import apiClient from "../api/apiClient";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

/**
 * Dynamically load Razorpay SDK script if not present on window
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const paymentService = {
  loadRazorpayScript,

  /**
   * Create Razorpay Payment Order (Step 2)
   * Calls POST /api/v1/payments/razorpay/order
   */
  async createRazorpayOrder(payload) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const orderId = payload.orderId || `65f${Math.random().toString(16).substring(2, 10)}1a2b3c4d5e6f7`;
      const orderNumber = payload.orderNumber || Math.floor(1000 + Math.random() * 9000).toString();
      return {
        success: true,
        data: {
          razorpay: {
            keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mock_key_id",
            orderId: `order_mock_${Date.now()}`,
            amount: Math.round((payload.amount || payload.total || 100) * 100),
            currency: "INR",
          },
          order: {
            _id: orderId,
            id: orderId,
            orderNumber: orderNumber,
            address: payload.address,
            contactName: payload.contactName,
            contactPhone: payload.contactPhone,
            paymentStatus: "pending",
            orderStatus: "received",
            total: payload.amount || payload.total || 100,
          },
        },
      };
    } else {
      const cleanPayload = {
        address: payload.address,
        contactName: payload.contactName,
        contactPhone: payload.contactPhone,
      };

      if (payload.deliveryInstructions) {
        cleanPayload.deliveryInstructions = {
          presets: Array.isArray(payload.deliveryInstructions?.presets)
            ? payload.deliveryInstructions.presets
            : [],
          customNote: payload.deliveryInstructions?.customNote || "",
        };
      }

      const response = await apiClient.post("/v1/payments/razorpay/order", cleanPayload);
      return response.data;
    }
  },

  /**
   * Verify Razorpay Payment Signature (Step 4 handler)
   * Calls POST /api/v1/payments/razorpay/verify
   */
  async verifyPayment(verificationData) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        data: {
          success: true,
          order: {
            _id: verificationData.orderId,
            id: verificationData.orderId,
            paymentStatus: "paid",
            orderStatus: "received",
            razorpayOrderId: verificationData.razorpayOrderId,
            razorpayPaymentId: verificationData.razorpayPaymentId,
          },
        },
      };
    } else {
      const response = await apiClient.post("/v1/payments/razorpay/verify", {
        orderId: verificationData.orderId,
        razorpayOrderId: verificationData.razorpayOrderId,
        razorpayPaymentId: verificationData.razorpayPaymentId,
        razorpaySignature: verificationData.razorpaySignature,
      });
      return response.data;
    }
  },

  /**
   * Check Razorpay Payment Status (Requirement 3: Polling Fallback)
   * Calls GET /api/v1/payments/razorpay/status/:orderId
   */
  async checkPaymentStatus(orderId) {
    if (!orderId) return { paymentStatus: "pending" };
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const isPaid = localStorage.getItem(`mock_order_paid_${orderId}`) === "true";
      return {
        success: true,
        data: {
          paymentStatus: isPaid ? "paid" : "pending",
          orderId: orderId,
        },
        paymentStatus: isPaid ? "paid" : "pending",
      };
    } else {
      try {
        const response = await apiClient.get(`/v1/payments/razorpay/status/${orderId}`);
        const data = response.data?.data || response.data;
        return {
          success: true,
          data: data,
          paymentStatus: data?.paymentStatus || response.data?.paymentStatus || "pending",
        };
      } catch (error) {
        console.error("checkPaymentStatus error:", error);
        return { success: false, paymentStatus: "pending", error };
      }
    }
  },

  /**
   * Launch Razorpay SDK for UPI Direct Intent & App Redirection
   */
  async launchRazorpayUpiCheckout({
    razorpayData,
    internalOrder,
    currentUser,
    onSuccess,
    onError,
    onDismiss,
  }) {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      throw new Error("Failed to load Razorpay Checkout SDK. Please check your internet connection.");
    }

    const key = razorpayData?.keyId || razorpayData?.key || import.meta.env.VITE_RAZORPAY_KEY_ID;
    const amount = razorpayData?.amount;
    const currency = razorpayData?.currency || "INR";
    const order_id = razorpayData?.orderId || razorpayData?.razorpayOrderId;
    const orderNumber = internalOrder?.orderNumber || internalOrder?._id || internalOrder?.id || "";

    if (!key) {
      throw new Error("Razorpay Key ID is missing.");
    }
    if (!order_id) {
      throw new Error("Razorpay Order ID is missing.");
    }

    // Save pending order ID to localStorage for mobile app tab reload polling fallback
    const targetOrderId = internalOrder?._id || internalOrder?.id;
    if (targetOrderId) {
      localStorage.setItem("pending_razorpay_order_id", targetOrderId);
    }

    const options = {
      key: key,
      amount: amount,
      currency: currency,
      name: "QuikaBite",
      description: `Order #${orderNumber}`,
      order_id: order_id,
      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI (PhonePe / GPay / Paytm)",
              instruments: [{ method: "upi" }],
            },
          },
          sequence: ["block.upi"],
        },
      },
      handler: async function (response) {
        try {
          const verifyRes = await paymentService.verifyPayment({
            orderId: internalOrder._id || internalOrder.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (USE_MOCK && targetOrderId) {
            localStorage.setItem(`mock_order_paid_${targetOrderId}`, "true");
          }

          localStorage.removeItem("pending_razorpay_order_id");

          const isSuccess = verifyRes?.success || verifyRes?.data?.success;
          if (isSuccess && typeof onSuccess === "function") {
            onSuccess(verifyRes, response);
          } else if (!isSuccess && typeof onError === "function") {
            onError(new Error("Payment verification failed on server."));
          }
        } catch (err) {
          if (typeof onError === "function") {
            onError(err);
          }
        }
      },
      prefill: {
        name: currentUser?.name || "Customer",
        email: currentUser?.email || "",
        contact: currentUser?.phone || "",
      },
      theme: {
        color: "#FF6B00",
      },
      modal: {
        ondismiss: function () {
          if (typeof onDismiss === "function") {
            onDismiss();
          }
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    return rzp;
  },
};

export default paymentService;
