import { useState, useEffect, useRef } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import {
  LifeBuoy,
  MessageSquare,
  Phone,
  FileText,
  Search,
  Send,
  Sparkles,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  Coins,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  HelpCircle,
  ClipboardList,
  ShieldCheck,
  Ticket,
  CreditCard,
  BookOpen,
} from "lucide-react";
import { BsRobot } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { dinerService } from "../../api/dinerService";
import { chatService } from "../../api/chatService";
import { useNotifications } from "../../context/NotificationContext";
const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const getMsgId = (prefix) => `msg-${prefix}-${Date.now()}`;
const getRefundId = () => `refund-notif-${Date.now()}`;

const FAQ_CATEGORIES = [
  { id: "all", label: "All FAQs", icon: "❓" },
  { id: "delivery", label: "Delivery & Tracking", icon: "📍" },
  { id: "refunds", label: "Refunds & Wallet", icon: "💳" },
  { id: "coupons", label: "Offers & Promo", icon: "🏷️" },
];
const FAQS = [
  {
    category: "delivery",
    q: "How do I track my delivery in real-time?",
    a: 'Once your order is placed, go to the "Orders" tab in the top navigation bar. You will see a live interactive tracking map showing your driver’s location, status steps, and coordinates.',
  },
  {
    category: "delivery",
    q: "My driver is heading in the wrong direction. What should I do?",
    a: 'Drivers sometimes complete batch deliveries nearby to remain efficient. If you see them deviating significantly, use our Live Chat or click the "Call Driver" button directly inside the order tracker page.',
  },
  {
    category: "refunds",
    q: "How long do refunds take to reflect in my account?",
    a: "Refunds sent to your QuikaBite Wallet are processed instantly and can be used on your next order. Bank/Card refunds usually take 3 to 5 business days depending on your banking partner.",
  },
  {
    category: "refunds",
    q: "I received the wrong order or missing items. Can I get a refund?",
    a: 'Absolutely! Use our "Order Issues & Refunds" panel inside the Support Center. Choose your order, check the missing/damaged items, upload a quick photo, and claim an instant wallet refund in under 1 minute.',
  },
  {
    category: "coupons",
    q: "Why is my promo coupon not applying during checkout?",
    a: 'Most coupon codes have minimum cart value requirements (e.g. ₹ 40) or are specific to select kitchen partners. Check the conditions listed in the "Coupons & Rewards" section.',
  },
  {
    category: "coupons",
    q: "How do I get free delivery on my food orders?",
    a: 'Look out for restaurants tagged with "FREE DELIVERY" on the home feed, or apply premium vouchers earned in your Profile Loyalty progress.',
  },
];
export default function SupportPage({ orders, triggerToast, setActiveTab }) {
  const { addNotification } = useNotifications();
  const [activeSubTab, setActiveSubTab] = useState("chat");
  const [faqSearch, setFaqSearch] = useState("");
  const debouncedFaqSearch = useDebounce(faqSearch, 300);
  const [activeFaqCategory, setActiveFaqCategory] = useState("all");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [chatMode, setChatMode] = useState("BOT");
  const chatEndRef = useRef(null);
  const [tickets, setTickets] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadSupportData = async () => {
      try {
        const activeOrdId = orders.length > 0 ? (orders[0].id || orders[0]._id) : "general-order";
        const conv = await chatService.startConversation(activeOrdId);
        if (isMounted) {
          setConversation(conv);
          setChatMode(conv.status || conv.mode || "BOT");
          const historyMsgs = await chatService.getMessages(conv._id || conv.id);
          if (historyMsgs && historyMsgs.length > 0) {
            setChatMessages(historyMsgs.map(m => ({
              id: m._id || m.id || `msg-${Date.now()}`,
              sender: (m.senderType === "USER" || m.sender === "user") ? "user" : (m.senderType === "AGENT" ? "agent" : "bot"),
              senderType: m.senderType || (m.sender === "user" ? "USER" : "BOT"),
              text: m.message || m.text || "",
              timestamp: m.timestamp || (m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : getTimestamp())
            })));
          } else {
            setChatMessages([
              {
                id: "msg-1",
                sender: "bot",
                senderType: "BOT",
                text: "Hi! Welcome to QuikaBite Gourmet Support. 🌟 I'm your digital concierge agent. How can I assist you with your order today?",
                timestamp: getTimestamp(),
              },
            ]);
          }
        }

        // Initialize Socket Connection & Join Room (Event: join_conversation)
        const convId = conv._id || conv.id;
        chatService.connectSocket(convId, (newMsg) => {
          if (!isMounted) return;
          setChatMessages((prev) => {
            const exists = prev.some(m => m.id === (newMsg._id || newMsg.id));
            if (exists) return prev;
            return [
              ...prev,
              {
                id: newMsg._id || newMsg.id || `msg-${Date.now()}`,
                sender: (newMsg.senderType === "USER" || newMsg.sender === "user") ? "user" : (newMsg.senderType === "AGENT" ? "agent" : "bot"),
                senderType: newMsg.senderType || "BOT",
                text: newMsg.message || newMsg.text || "",
                timestamp: newMsg.timestamp || getTimestamp(),
              }
            ];
          });
        });
      } catch (err) {
        console.warn("Support chat load error:", err);
      }

      try {
        const tks = await dinerService.getTickets();
        if (isMounted) {
          if (tks && tks.length > 0) setTickets(tks);
          else {
            setTickets([
              {
                id: "TK-84291",
                category: "Delivery delay",
                priority: "medium",
                orderId: "GE-4821",
                description: "Driver was delayed by heavy traffic. Food arrived slightly cold.",
                status: "Resolved",
                timestamp: "2 days ago",
              },
            ]);
          }
        }
      } catch (err) {
        console.warn("Tickets load error:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadSupportData();

    return () => {
      isMounted = false;
      chatService.disconnectSocket();
    };
  }, [orders]);

  const [ticketCategory, setTicketCategory] = useState("Delivery delay");
  const [ticketPriority, setTicketPriority] = useState("medium");
  const [ticketOrderId, setTicketOrderId] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState("ringing");
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const callIntervalRef = useRef(null);
  const [selectedRefundOrder, setSelectedRefundOrder] = useState(null);
  const [affectedItems, setAffectedItems] = useState([]);
  const [refundReason, setRefundReason] = useState("Missing items");
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [refundSuccessData, setRefundSuccessData] = useState(null);
  const [mockTemplateOrders] = useState([
    {
      id: "GE-98321",
      restaurantId: "r1",
      restaurantName: "The Gourmet Burger Bistro",
      items: [
        {
          menuItem: {
            id: "m1_1",
            name: "Signature Angus Truffle Burger",
            price: 45,
            description: "Angus beef with black truffle sauce",
            image:
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
            isVeg: false,
            category: "Burgers",
          },
          quantity: 2,
        },
        {
          menuItem: {
            id: "m1_2",
            name: "Parmesan Herb Loaded Fries",
            price: 22,
            description: "Hand-cut fries sprinkled with cheese",
            image:
              "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80",
            isVeg: true,
            category: "Sides",
          },
          quantity: 1,
        },
      ],
      status: "delivered",
      timestamp: "Today, 1:15 PM",
      subtotal: 112,
      deliveryFee: 5,
      discount: 15,
      tax: 5.6,
      total: 107.6,
      driverCoords: { x: 50, y: 50 },
    },
    {
      id: "GE-92841",
      restaurantId: "r2",
      restaurantName: "Royal Biryani Palace",
      items: [
        {
          menuItem: {
            id: "m2_1",
            name: "Premium Mutton Dum Biryani",
            price: 55,
            description: "Fragrant basmati rice layered with juicy mutton",
            image:
              "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80",
            isVeg: false,
            category: "Biryani",
          },
          quantity: 1,
        },
        {
          menuItem: {
            id: "m2_2",
            name: "Garlic Butter Naan",
            price: 8,
            description: "Tandoor naan loaded with garlic butter",
            image:
              "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=300&q=80",
            isVeg: true,
            category: "Breads",
          },
          quantity: 3,
        },
      ],
      status: "delivered",
      timestamp: "Yesterday, 8:30 PM",
      subtotal: 79,
      deliveryFee: 5,
      discount: 0,
      tax: 3.95,
      total: 87.95,
      driverCoords: { x: 30, y: 40 },
    },
  ]);
  const allAvailableOrders = orders.length > 0 ? orders : mockTemplateOrders;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (chatMessages.length > 0) {
      dinerService.saveSupportChat(chatMessages);
    }
  }, [chatMessages]);

  useEffect(() => {
    if (tickets.length > 0) {
      dinerService.saveTickets(tickets);
    }
  }, [tickets]);

  useEffect(() => {
    if (isCalling && callStatus === "connected") {
      callIntervalRef.current = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1e3);
    } else {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    }
    return () => {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    };
  }, [isCalling, callStatus]);

  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const chatChips = [
    { text: "Where is my order? 📍", keyword: "track" },
    { text: "Wrong item received 🍔", keyword: "wrong" },
    { text: "Request a refund 💳", keyword: "refund" },
    { text: "Voucher not working 🏷️", keyword: "voucher" },
    { text: "Connect to live agent 🧑‍💼", keyword: "agent" },
  ];

  const handleSendChatMessage = (textToSend, quickReplyText = "") => {
    if (!textToSend.trim()) return;

    const convId = conversation?._id || conversation?.id || `conv-gen-${Date.now()}`;
    const userMsgObj = {
      id: getMsgId("user"),
      sender: "user",
      senderType: "USER",
      text: textToSend,
      timestamp: getTimestamp(),
    };

    setChatMessages((prev) => [...prev, userMsgObj]);
    setChatInput("");

    // Emit Socket.io send_message Event
    chatService.sendMessage({
      conversationId: convId,
      message: textToSend,
      senderType: "USER",
      sender: "user",
      quickReplyUsed: quickReplyText || textToSend,
    });

    const lower = textToSend.toLowerCase();

    // Check Escalation to Live Agent
    if (lower.includes("agent") || lower.includes("human") || lower.includes("live") || lower.includes("person")) {
      setChatMode("LIVE_AGENT");
      setIsBotTyping(true);
      setTimeout(() => {
        const agentEscalationMsg = {
          id: getMsgId("agent"),
          sender: "agent",
          senderType: "AGENT",
          text: "🧑‍💼 Connected to QuikaBite Live Concierge Agent! A manager or support specialist is now connected to your private chat room.",
          timestamp: getTimestamp(),
        };
        setChatMessages((prev) => [...prev, agentEscalationMsg]);
        setIsBotTyping(false);
      }, 1000);
      return;
    }

    // Bot Automated Reply Logic
    if (chatMode === "BOT") {
      setIsBotTyping(true);
      setTimeout(() => {
        let botText =
          "Thank you for sharing. Let me look that up in your QuikaBite account. Can you select the order related to this request inside the 'Order Issues' tab to help me resolve this instantly?";
        if (
          lower.includes("track") ||
          lower.includes("where") ||
          lower.includes("status")
        ) {
          const activeOrder = orders.find((o) => o.status !== "delivered");
          if (activeOrder) {
            botText = `I see your active order #${activeOrder.id} from "${activeOrder.restaurantName}" is currently in "${activeOrder.status.replace(/_/g, " ")}" phase. Estimated delivery in 15-20 minutes. You can also monitor live driver coordinates in the 'Orders' dashboard!`;
          } else {
            botText =
              "You don't have any active deliveries at this moment. Your last order was successfully delivered. Let me know if you would like me to report an issue for that order!";
          }
        } else if (
          lower.includes("refund") ||
          lower.includes("money") ||
          lower.includes("charge") ||
          lower.includes("cancel")
        ) {
          botText =
            "I understand you'd like to claim a refund. QuikaBite offers a seamless refund system! Head over to our 'Order Issues & Refunds' tab above, pick the order, check the affected gourmet dishes, and receive instant credits directly to your loyalty wallet.";
        } else if (
          lower.includes("wrong") ||
          lower.includes("cold") ||
          lower.includes("bad") ||
          lower.includes("missing")
        ) {
          botText =
            "I am deeply sorry to hear that your food quality was not up to our gourmet standard! 😔 Please open the 'Order Issues & Refunds' panel. Check the specific items that were wrong or cold, and click the 'Claim Instant Wallet Refund' button. We will credit you immediately.";
        } else if (
          lower.includes("voucher") ||
          lower.includes("promo") ||
          lower.includes("coupon") ||
          lower.includes("code")
        ) {
          botText =
            "Vouchers might fail if the restaurant is excluded, or if the order subtotal is below the threshold. Copy the GOURMET50 code from your alerts, and ensure your cart value is above ₹ 40 at checkout to unlock your 50% discount!";
        }
        const botMsg = {
          id: getMsgId("bot"),
          sender: "bot",
          senderType: "BOT",
          text: botText,
          timestamp: getTimestamp(),
        };
        setChatMessages((prev) => [...prev, botMsg]);
        setIsBotTyping(false);
      }, 1000);
    }
  };
  const handleInitiateCall = () => {
    setIsCalling(true);
    setCallStatus("ringing");
    setCallTimer(0);
    triggerToast("Dialing QuikaBite Dedicated hotline...");
    setTimeout(() => {
      setCallStatus("connected");
      triggerToast("✓ Call connected with Clara from QuikaBite!");
    }, 2500);
  };
  const handleEndCall = () => {
    setCallStatus("ended");
    triggerToast("Support call concluded.");
    setTimeout(() => {
      setIsCalling(false);
    }, 1e3);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };
  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };
  const handleDropFile = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
      triggerToast(`✓ Loaded ${file.name} successfully!`);
    }
  };
  const handleManualFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
      triggerToast(`✓ Selected image ${file.name}`);
    }
  };
  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketDesc.trim()) {
      triggerToast("Please write details before submitting.");
      return;
    }
    const ticketId = `TK-${Math.floor(1e4 + Math.random() * 9e4)}`;
    const newTicket = {
      id: ticketId,
      category: ticketCategory,
      priority: ticketPriority,
      orderId: ticketOrderId || "General App Help",
      description: ticketDesc,
      screenshotName: screenshot ? screenshot.name : void 0,
      screenshotUrl: screenshotPreview || void 0,
      status: "Open",
      timestamp: "Just Now",
    };
    setTickets((prev) => [newTicket, ...prev]);
    setTicketDesc("");
    setScreenshot(null);
    setScreenshotPreview(null);
    triggerToast(`Support ticket ${ticketId} created successfully!`);
  };
  const handleToggleItemRefund = (itemId) => {
    setAffectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };
  const handleSelectAllRefundItems = () => {
    if (!selectedRefundOrder) return;
    const allIds = selectedRefundOrder.items.map((i) => i.menuItem.id);
    if (affectedItems.length === allIds.length) {
      setAffectedItems([]);
    } else {
      setAffectedItems(allIds);
    }
  };
  const getRefundSubtotal = () => {
    if (!selectedRefundOrder) return 0;
    return selectedRefundOrder.items
      .filter((item) => affectedItems.includes(item.menuItem.id))
      .reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);
  };
  const calculateTotalRefundAmount = () => {
    if (!selectedRefundOrder || affectedItems.length === 0) return 0;
    const subtotal = getRefundSubtotal();
    const proportion = subtotal / selectedRefundOrder.subtotal;
    const proportionalTax = selectedRefundOrder.tax * proportion;
    const proportionalFee = selectedRefundOrder.deliveryFee * proportion;
    const proportionalDiscount = selectedRefundOrder.discount * proportion;
    const total =
      subtotal + proportionalTax + proportionalFee - proportionalDiscount;
    return parseFloat(Math.max(0, total).toFixed(2));
  };
  const handleProcessRefund = () => {
    if (!selectedRefundOrder) return;
    if (affectedItems.length === 0) {
      triggerToast(
        "Please check at least one gourmet dish to request a refund.",
      );
      return;
    }
    setIsProcessingRefund(true);
    setTimeout(async () => {
      const finalRefund = calculateTotalRefundAmount();
      const ticketId = `RF-${Math.floor(1e4 + Math.random() * 9e4)}`;
      const prevWalletStr = await dinerService.getWalletBalance();
      const updatedBalance = parseFloat(prevWalletStr) + finalRefund;
      await dinerService.saveWalletBalance(updatedBalance.toFixed(2));

      const refundNotif = {
        id: getRefundId(),
        category: "wallet",
        title: `₹ ${finalRefund} Refund Approved! 💳`,
        message: `Approved refund for your items from ${selectedRefundOrder.restaurantName}. Added to wallet. New balance: ₹ ${updatedBalance.toFixed(2)}`,
        timestamp: "Just Now",
        isRead: false,
        amount: `₹ ${finalRefund}`,
      };

      addNotification(refundNotif);
      const refundTicket = {
        id: ticketId,
        category: `Refund Request - ${refundReason}`,
        priority: "high",
        orderId: selectedRefundOrder.id,
        description: `Instant Refund requested for ${affectedItems.length} dish(es) from "${selectedRefundOrder.restaurantName}". Amount: ₹ ${finalRefund}.`,
        status: "Resolved",
        timestamp: "Just Now",
      };
      setTickets((prev) => [refundTicket, ...prev]);
      setRefundSuccessData({ amount: finalRefund, ticketId });
      setIsProcessingRefund(false);
      setAffectedItems([]);
      triggerToast(`✓ Instantly credited ₹ ${finalRefund} to your wallet!`);
    }, 1800);
  };
  const handleToggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };
  const filteredFAQs = FAQS.filter((faq) => {
    const matchesCategory =
      activeFaqCategory === "all" || faq.category === activeFaqCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(debouncedFaqSearch.toLowerCase()) ||
      faq.a.toLowerCase().includes(debouncedFaqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4 animate-pulse animate-fade-in" id="support-center-loading">
        {/* Page Title Loading */}
        <div className="text-center max-w-xl mx-auto space-y-3 mb-8">
          <div className="h-10 w-10 bg-neutral-200 rounded-full mx-auto" />
          <div className="h-8 bg-neutral-200 rounded-full w-2/3 mx-auto" />
          <div className="h-3 bg-neutral-200 rounded-full w-1/2 mx-auto" />
        </div>
        {/* Top Selection Bar Loading */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-40 bg-neutral-200 rounded-2xl animate-pulse" />
          ))}
        </div>
        {/* Chat box skeleton */}
        <div className="bg-white border border-neutral-150 rounded-3xl p-5 h-[400px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-neutral-200 rounded-full shrink-0 animate-pulse" />
              <div className="h-12 bg-neutral-200 rounded-2xl w-2/3 animate-pulse" />
            </div>
            <div className="flex gap-2 justify-end">
              <div className="h-10 bg-neutral-200 rounded-2xl w-1/3 animate-pulse" />
              <div className="h-8 w-8 bg-neutral-200 rounded-full shrink-0 animate-pulse" />
            </div>
          </div>
          <div className="h-12 bg-neutral-100 rounded-2xl w-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-6xl mx-auto py-6 px-4 animate-fade-in"
      id="support-center-viewport"
    >
      {/* Page Title & Intro */}
      <div className="text-center max-w-xl mx-auto space-y-2.5 mb-8">
        <div className="inline-flex bg-orange-50 p-2.5 rounded-2xl border border-orange-100 text-brand-orange">
          <LifeBuoy className="h-6 w-6 animate-spin-slow" />
        </div>
        <h2 className="font-display font-black text-3xl text-gray-900 tracking-tight">
          Gourmet Concierge Support
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
          How can we perfect your culinary experience today? Resolve orders,
          claim instant wallet refunds, or speak with an agent in seconds.
        </p>
      </div>

      {/* Segmented Top Selection Bar */}
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2 no-scrollbar justify-start sm:justify-center border-b border-gray-100">
        <button
          onClick={() => {
            setActiveSubTab("chat");
            setRefundSuccessData(null);
          }}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold transition shrink-0 ${activeSubTab === "chat" ? "bg-brand-orange text-white shadow-md font-black scale-102" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Conversational Chat</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab("refunds");
            setRefundSuccessData(null);
          }}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold transition shrink-0 ${activeSubTab === "refunds" ? "bg-brand-orange text-white shadow-md font-black scale-102" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
        >
          <Coins className="h-4 w-4" />
          <span>Order Issues & Refunds</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab("ticket");
            setRefundSuccessData(null);
          }}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold transition shrink-0 ${activeSubTab === "ticket" ? "bg-brand-orange text-white shadow-md font-black scale-102" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
        >
          <FileText className="h-4 w-4" />
          <span>Raise Ticket</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab("call");
            setRefundSuccessData(null);
          }}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold transition shrink-0 ${activeSubTab === "call" ? "bg-brand-orange text-white shadow-md font-black scale-102" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
        >
          <Phone className="h-4 w-4" />
          <span>Call Hotline Support</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab("faqs");
            setRefundSuccessData(null);
          }}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold transition shrink-0 ${activeSubTab === "faqs" ? "bg-brand-orange text-white shadow-md font-black scale-102" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Knowledge & FAQs</span>
        </button>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Active Panel (takes 8 cols on desktop) */}
        <div className="lg:col-span-8 bg-white border border-gray-150 rounded-3xl overflow-hidden min-h-[500px] flex flex-col justify-between shadow-xs">
          {/* TAB 1: LIVE CHAT */}
          {activeSubTab === "chat" && (
            <div className="flex flex-col h-[520px] justify-between">
              {/* Chat Panel Header */}
              <div className="bg-neutral-50 border-b border-gray-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 bg-orange-100 border border-orange-200 rounded-2xl flex items-center justify-center font-black text-brand-orange">
                      {chatMode === "LIVE_AGENT" ? "🧑‍💼" : "🛎️"}
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm text-gray-800 flex items-center gap-1">
                      <span>{chatMode === "LIVE_AGENT" ? "Live Concierge Agent" : "Gourmet Concierge"}</span>
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {chatMode === "LIVE_AGENT" ? "Direct Agent Session (LIVE_AGENT)" : "AI Instant Support Bot (BOT)"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1 select-none ${chatMode === "LIVE_AGENT" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${chatMode === "LIVE_AGENT" ? "bg-amber-500" : "bg-emerald-500"}`} />
                    <span>{chatMode === "LIVE_AGENT" ? "Agent Connected" : "Bot Active"}</span>
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-neutral-50/20">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    {msg.sender === "bot" ? (
                      <BsRobot className="h-5 w-5 flex items-center justify-center text-xs shrink-0 select-none text-brand-orange" />
                    ) : msg.sender === "agent" ? (
                      <span className="text-sm shrink-0">🧑‍💼</span>
                    ) : (
                      <FaUser className="h-5 w-5 flex items-center justify-center text-xs shrink-0 select-none text-neutral-600" />
                    )}
                    <div className="space-y-0.5 min-w-0">
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === "user" ? "bg-brand-orange text-white rounded-br-xs" : msg.sender === "agent" ? "bg-amber-50 border border-amber-200 text-amber-950 rounded-bl-xs shadow-xs font-semibold" : "bg-white border border-gray-150 text-gray-800 rounded-bl-xs shadow-xs"}`}
                      >
                        <p className="whitespace-pre-line font-medium break-words">
                          {msg.text}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] text-gray-400 font-bold block ${msg.sender === "user" ? "text-right" : "text-left"}`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isBotTyping && (
                  <div className="flex items-end gap-2.5 max-w-[80%]">
                    <BsRobot className="h-5 w-5 flex items-center justify-center text-xs shrink-0 select-none" />
                    <div className="bg-white border border-gray-150 p-3 px-4 rounded-2xl rounded-bl-xs flex items-center gap-1 shadow-xs">
                      <span
                        className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Footer Controls */}
              <div className="p-3 bg-white border-t border-gray-100 space-y-3">
                {/* Suggestions chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {chatChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChatMessage(chip.text)}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-orange-50 hover:text-brand-orange text-gray-600 border border-gray-100 rounded-full text-[10px] font-black shrink-0 transition"
                    >
                      {chip.text}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSendChatMessage(chatInput)
                    }
                    placeholder="Describe your issue or click quick chips..."
                    className="flex-1 px-4 py-3 bg-neutral-50 text-xs text-gray-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-orange-300 transition placeholder:text-gray-400 font-medium border border-neutral-100"
                  />
                  <button
                    onClick={() => handleSendChatMessage(chatInput)}
                    disabled={!chatInput.trim()}
                    className="bg-brand-orange disabled:opacity-50 hover:bg-orange-600 text-white p-3 rounded-xl transition shadow-sm active:scale-95"
                    title="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER ISSUES & REFUND CENTER */}
          {activeSubTab === "refunds" && (
            <div className="p-5 space-y-5 flex flex-col justify-between h-full">
              {!refundSuccessData ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <CreditCard className="text-xl text-blue-500" />
                      <div>
                        <h3 className="font-display font-black text-sm text-gray-800 uppercase tracking-wider">
                          Culinary Refund Center
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold">
                          Claim instant wallet credits for incorrect, cold, or
                          delayed meals.
                        </p>
                      </div>
                    </div>

                    {/* Step 1: Select the Order */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 block">
                        Select Order Affected
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {allAvailableOrders.map((order) => (
                          <button
                            key={order.id}
                            onClick={() => {
                              setSelectedRefundOrder(order);
                              setAffectedItems([]);
                            }}
                            className={`p-3.5 rounded-2xl text-left border text-xs transition ${selectedRefundOrder?.id === order.id ? "border-brand-orange bg-orange-55/10 bg-orange-50/15" : "border-gray-100 hover:bg-gray-50 bg-white"}`}
                          >
                            <div className="flex justify-between font-black text-gray-800">
                              <span>Order #{order.id}</span>
                              <span className="text-[10px] font-mono text-brand-orange">
                                ₹ {order.total}
                              </span>
                            </div>
                            <p className="font-semibold text-gray-500 mt-1 truncate">
                              {order.restaurantName}
                            </p>
                            <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold mt-2.5 pt-1.5 border-t border-gray-55/40 border-neutral-50">
                              <span>⏱️ {order.timestamp}</span>
                              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-extrabold">
                                {order.status}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Select Items Affected */}
                    {selectedRefundOrder && (
                      <div className="space-y-3 bg-neutral-50/50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-[10px] font-black uppercase text-gray-500">
                            Gourmet Dishes Affected:
                          </span>
                          <button
                            onClick={handleSelectAllRefundItems}
                            className="text-[10px] text-brand-orange font-bold hover:underline"
                          >
                            {affectedItems.length ===
                              selectedRefundOrder.items.length
                              ? "Deselect All"
                              : "Select All"}
                          </button>
                        </div>

                        <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                          {selectedRefundOrder.items.map((item) => (
                            <div
                              key={item.menuItem.id}
                              onClick={() =>
                                handleToggleItemRefund(item.menuItem.id)
                              }
                              className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-xl cursor-pointer hover:border-orange-200 transition"
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={affectedItems.includes(
                                    item.menuItem.id,
                                  )}
                                  onChange={() => { }}
                                  className="h-4.5 w-4.5 rounded text-brand-orange border-gray-300 focus:ring-brand-orange"
                                />
                                <div>
                                  <h4 className="text-xs font-bold text-gray-800">
                                    {item.menuItem.name}
                                  </h4>
                                  <span className="text-[10px] text-gray-400">
                                    Qty: {item.quantity} × ₹{" "}
                                    {item.menuItem.price}
                                  </span>
                                </div>
                              </div>
                              <span className="font-mono text-xs font-bold text-gray-700">
                                ₹ {item.menuItem.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Reason Selection */}
                        <div className="space-y-1.5 pt-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 block">
                            Select Issue Reason
                          </label>
                          <select
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            className="w-full text-xs bg-white border border-gray-200 p-2.5 rounded-xl font-semibold text-gray-700 focus:outline-hidden"
                          >
                            <option value="Missing items">
                              Certain items were completely missing ⚠️
                            </option>
                            <option value="Wrong items">
                              Delivered incorrect items / wrong dishes 🍔
                            </option>
                            <option value="Cold food">
                              Food was cold / poor packing temperature ❄️
                            </option>
                            <option value="Spilled food">
                              Dishes spilled / packaging damaged during transit
                              📦
                            </option>
                            <option value="Extreme Delay">
                              Severe delivery delay (&gt; 35 mins late) ⏰
                            </option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit / Calculation Footer */}
                  {selectedRefundOrder && affectedItems.length > 0 && (
                    <div className="border-t border-gray-100 pt-4 space-y-3.5 bg-white">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-bold">
                          Estimated Instant Refund Value:
                        </span>
                        <div className="text-right">
                          <span className="font-mono font-black text-brand-orange text-lg">
                            ₹ {calculateTotalRefundAmount()}
                          </span>
                          <span className="block text-[8px] text-emerald-500 font-extrabold uppercase mt-0.5">
                            Instant Wallet Credit Approved
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleProcessRefund}
                        disabled={isProcessingRefund}
                        className="w-full bg-brand-orange hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-black py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        {isProcessingRefund ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            <span>Securing Instant Approvals...</span>
                          </>
                        ) : (
                          <>
                            <Coins className="h-4 w-4" />
                            <span>
                              Claim Instant Wallet Credit (₹{" "}
                              {calculateTotalRefundAmount()})
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* SUCCESS MODAL FOR APPROVED REFUNDS */
                <div className="py-12 px-6 text-center space-y-6 flex flex-col justify-center items-center h-full animate-scale-up">
                  <div className="h-20 w-20 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center relative shadow-sm">
                    <CheckCircle className="h-10 w-10 text-emerald-500" />
                    <Sparkles className="h-5 w-5 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <h3 className="font-display font-black text-xl text-gray-900">
                      Refund Approved Instantly!
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Excellent news! Under our premium gourmet guarantee, we
                      have credited your claimed amount directly into your
                      QuikaBite Wallet.
                    </p>
                  </div>

                  <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-2xl w-full max-w-xs space-y-1.5">
                    <div className="flex justify-between text-[10px] text-gray-400 font-extrabold uppercase">
                      <span>Ref ID:</span>
                      <span className="font-mono">
                        {refundSuccessData.ticketId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-700">
                        Refunded Amount:
                      </span>
                      <span className="font-mono font-black text-brand-orange text-base">
                        ₹ {refundSuccessData.amount}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-emerald-600 font-bold">
                      <span>Wallet Method:</span>
                      <span>Instant Balance Node</span>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full max-w-xs">
                    <button
                      onClick={() => setRefundSuccessData(null)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-3 rounded-xl transition"
                    >
                      File Another
                    </button>
                    <button
                      onClick={() => {
                        setRefundSuccessData(null);
                        setActiveTab("home");
                        triggerToast("Let’s search some new dishes!");
                      }}
                      className="flex-1 bg-brand-orange hover:bg-orange-600 text-white text-xs font-black py-3 rounded-xl transition shadow-sm"
                    >
                      Browse Foods
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RAISE TICKET FORM */}
          {activeSubTab === "ticket" && (
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Ticket className="text-xl text-red-500" />
                <div>
                  <h3 className="font-display font-black text-sm text-gray-800 uppercase tracking-wider">
                    Raise Support Ticket
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold">
                    Lodge structured tickets for deeper investigations with our
                    corporate desk.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">
                      Issue Category
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full text-xs border border-gray-200 p-2.5 rounded-xl font-semibold text-gray-700 focus:outline-hidden"
                    >
                      <option value="Delivery delay">
                        Delivery Delay / Traffic delay 📍
                      </option>
                      <option value="Missing items">
                        Missing Items in Order 🍔
                      </option>
                      <option value="App issue">
                        App Bug or Layout issue 📱
                      </option>
                      <option value="Payment problem">
                        Double Charging / Coupon issue 💳
                      </option>
                      <option value="Other">
                        Other Miscellaneous Request ⚙️
                      </option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400">
                      Priority Level
                    </label>
                    <div className="flex gap-2">
                      {["low", "medium", "high", "urgent"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setTicketPriority(p)}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition border ${ticketPriority === p ? (p === "urgent" ? "bg-red-500 text-white border-red-500" : p === "high" ? "bg-orange-500 text-white border-orange-500" : "bg-brand-orange text-white border-brand-orange") : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50"}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Related Order ID selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">
                    Related Order ID (Optional)
                  </label>
                  <select
                    value={ticketOrderId}
                    onChange={(e) => setTicketOrderId(e.target.value)}
                    className="w-full text-xs border border-gray-200 p-2.5 rounded-xl font-semibold text-gray-700 focus:outline-hidden"
                  >
                    <option value="">
                      General Support - No Specific Order
                    </option>
                    {allAvailableOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        Order #{o.id} - {o.restaurantName} (₹ {o.total})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">
                    Elaborate details of your issue
                  </label>
                  <textarea
                    rows={3}
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder="Provide specific notes. For example, 'Fries were soggy and the soda spilled inside the plastic carry bag'..."
                    className="w-full text-xs border border-gray-200 p-3 rounded-xl font-semibold text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-orange-300 resize-none"
                    required
                  />
                </div>

                {/* Drag & Drop Screenshot Upload Area */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">
                    Attach Screenshot / Photo Proof
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDropFile}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center transition ${isDraggingFile ? "border-brand-orange bg-orange-50/20" : screenshot ? "border-emerald-300 bg-emerald-50/10" : "border-gray-200 hover:border-orange-300 bg-neutral-50/20"}`}
                  >
                    {!screenshot ? (
                      <div className="space-y-2 select-none">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto animate-bounce" />
                        <p className="text-xs text-gray-500 font-bold">
                          Drag and drop your screenshot here, or click to browse
                        </p>
                        <p className="text-[9px] text-gray-400">
                          Supports PNG, JPG (Max 5MB)
                        </p>
                        <label className="inline-block mt-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-[10px] font-black px-4 py-2 rounded-lg cursor-pointer shadow-sm transition">
                          <span>Browse Files</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleManualFileSelect}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-left">
                          {screenshotPreview && (
                            <img
                              src={screenshotPreview}
                              alt="preview"
                              className="h-10 w-10 object-cover rounded-lg border border-gray-100 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate">
                              {screenshot.name}
                            </p>
                            <span className="text-[9px] text-emerald-600 font-bold">
                              Loaded Proof successfully ✓
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshot(null);
                            setScreenshotPreview(null);
                            triggerToast("Removed attachment proof.");
                          }}
                          className="h-7 w-7 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-orange-600 text-white font-black text-xs py-3.5 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Submit Support Ticket</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: CALL HOTLINE SUPPORT */}
          {activeSubTab === "call" && (
            <div className="p-5 flex flex-col justify-between h-full ">
              {!isCalling ? (
                /* INITIATE CALL DASH */
                <div className="space-y-6 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <Phone className="text-xl text-red-500" />
                    <div>
                      <h3 className="font-display font-black text-sm text-gray-800 uppercase tracking-wider">
                        Direct Hotline Connect
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold">
                        Skip messaging! Speak with our live gourmet operations
                        leads in seconds.
                      </p>
                    </div>
                  </div>

                  {/* Regional Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-neutral-50/50 border border-neutral-100 p-4 rounded-2xl space-y-3 relative group overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-800">
                          Dubai HQ Hotline
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      </div>
                      <p className="font-mono font-black text-sm text-gray-700">
                        +91 80 800-FOOD
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                        <span>Wait Time:</span>
                        <span className="text-emerald-500 font-extrabold">
                          &lt; 1 min
                        </span>
                      </div>
                    </div>

                    <div className="bg-neutral-50/50 border border-neutral-100 p-4 rounded-2xl space-y-3 relative group overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-800">
                          Mumbai Connect
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      </div>
                      <p className="font-mono font-black text-sm text-gray-700">
                        +91 22 700-EATS
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                        <span>Wait Time:</span>
                        <span className="text-emerald-500 font-extrabold">
                          &lt; 2 mins
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Big Call Button Trigger */}
                  <div className="text-center py-6 space-y-4">
                    <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                      All support conversations are recorded for quality
                      reviews. You can place the VoIP dial directly from your
                      web browser safely.
                    </p>
                    <button
                      onClick={handleInitiateCall}
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 py-4 rounded-2xl shadow-lg hover:shadow-emerald-500/15 scale-102 hover:scale-104 active:scale-95 transition"
                    >
                      <Phone className="h-5 w-5 animate-pulse" />
                      <span>Connect In-App VoIP Call</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* ACTIVE VOIP CALL SIMULATOR PANEL */
                <div className="flex-1 flex flex-col justify-between items-center py-10 bg-neutral-900 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-fade-in select-none">
                  {/* Glowing absolute decorative waves */}
                  <div className="absolute top-0 inset-x-0 h-40 bg-radial-gradient from-emerald-500/10 via-transparent to-transparent opacity-50" />

                  {/* Caller Header info */}
                  <div className="text-center space-y-2 relative z-10">
                    <div className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                      VoIP Caller Node Active
                    </div>
                    <h3 className="font-display font-black text-lg">
                      QuikaBite Premium Support
                    </h3>
                    <p className="text-xs font-medium text-neutral-400">
                      {callStatus === "ringing"
                        ? "Dialing secure operations desk..."
                        : "Connected with Agent Clara"}
                    </p>
                  </div>

                  {/* Pulse visual waves in Center */}
                  <div className="relative h-44 w-44 flex items-center justify-center z-10">
                    <div
                      className={`absolute inset-0 rounded-full bg-emerald-500/5 ${callStatus === "connected" ? "animate-ping-slow" : "animate-ping"}`}
                    />
                    <div className="absolute h-32 w-32 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <div className="h-24 w-24 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          {callStatus === "connected" ? (
                            <Volume2 className="h-7 w-7" />
                          ) : (
                            <Phone className="h-7 w-7" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Peak dynamic spikes if connected */}
                    {callStatus === "connected" && (
                      <div className="absolute bottom-1 flex items-center gap-1">
                        <span
                          className="h-3 w-1 bg-emerald-400 rounded-full animate-pulse-fast"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="h-5 w-1 bg-emerald-400 rounded-full animate-pulse-fast"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="h-4 w-1 bg-emerald-400 rounded-full animate-pulse-fast"
                          style={{ animationDelay: "300ms" }}
                        />
                        <span
                          className="h-6 w-1 bg-emerald-400 rounded-full animate-pulse-fast"
                          style={{ animationDelay: "450ms" }}
                        />
                        <span
                          className="h-2 w-1 bg-emerald-400 rounded-full animate-pulse-fast"
                          style={{ animationDelay: "600ms" }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Timer & controls footer */}
                  <div className="w-full max-w-xs space-y-8 relative z-10">
                    <div className="text-center">
                      <span className="font-mono font-black text-2xl text-emerald-400">
                        {callStatus === "ringing"
                          ? "Ringing..."
                          : formatCallTime(callTimer)}
                      </span>
                    </div>

                    {/* Sub dialer buttons */}
                    <div className="flex justify-center items-center gap-6">
                      {/* Mute toggle */}
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`h-11 w-11 rounded-full flex items-center justify-center border transition ${isMuted ? "bg-red-500 border-red-500 text-white" : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-300"}`}
                        title={
                          isMuted ? "Unmute microphone" : "Mute microphone"
                        }
                      >
                        {isMuted ? (
                          <MicOff className="h-4.5 w-4.5" />
                        ) : (
                          <Mic className="h-4.5 w-4.5" />
                        )}
                      </button>

                      {/* RED HANG UP */}
                      <button
                        onClick={handleEndCall}
                        className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition"
                        title="End VoIP call"
                      >
                        <Phone className="h-6 w-6 rotate-135" />
                      </button>

                      {/* Speaker toggle */}
                      <button
                        onClick={() => setIsSpeaker(!isSpeaker)}
                        className={`h-11 w-11 rounded-full flex items-center justify-center border transition ${isSpeaker ? "bg-emerald-500 border-emerald-500 text-white" : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-300"}`}
                        title={
                          isSpeaker ? "Turn speaker off" : "Turn speaker on"
                        }
                      >
                        {isSpeaker ? (
                          <Volume2 className="h-4.5 w-4.5" />
                        ) : (
                          <VolumeX className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FAQS & KNOWLEDGE */}
          {activeSubTab === "faqs" && (
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <BookOpen className="text-xl text-blue-500" />
                <div>
                  <h3 className="font-display font-black text-sm text-gray-800 uppercase tracking-wider">
                    Self Help Knowledge Base
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold">
                    Search curated questions compiled by our logistics quality
                    controllers.
                  </p>
                </div>
              </div>

              {/* FAQs Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search keywords (e.g., 'refund', 'tracking', 'coupon')..."
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-orange-300 font-semibold"
                />
                {faqSearch && (
                  <button
                    onClick={() => setFaqSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full hover:bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-bold"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Categories Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFaqCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black shrink-0 transition ${activeFaqCategory === cat.id ? "bg-brand-orange text-white" : "bg-neutral-50 text-gray-500 hover:bg-neutral-100"}`}
                  >
                    <span>{cat.icon} </span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* FAQs Accordion items */}
              <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar pr-1">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-10 space-y-2 select-none">
                    <p className="text-xs font-bold text-gray-500">
                      No matching FAQs found
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Try searching general terms like 'money' or 'driver'.
                    </p>
                  </div>
                ) : (
                  filteredFAQs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-150 rounded-2xl overflow-hidden transition hover:border-orange-100"
                    >
                      <button
                        onClick={() => handleToggleFaq(idx)}
                        className="w-full p-4 text-left flex items-center justify-between bg-neutral-50/20 hover:bg-neutral-50/60 transition text-xs font-black text-gray-800 gap-4"
                      >
                        <span>{faq.q}</span>
                        {expandedFaqIndex === idx ? (
                          <ChevronUp className="h-4 w-4 text-brand-orange shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                        )}
                      </button>

                      {expandedFaqIndex === idx && (
                        <div className="p-4 bg-white border-t border-gray-50 text-xs text-gray-600 leading-relaxed font-medium animate-slide-down">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Tickets History & Metrics (takes 4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Metrics Widget */}
          <div className="bg-white border border-gray-150 p-5 rounded-3xl space-y-4 shadow-2xs">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-gray-400">
              Response Standards
            </h4>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-neutral-50/50 p-3 rounded-2xl border border-neutral-100">
                <span className="block text-xl">⚡</span>
                <span className="block text-base font-black text-neutral-800 mt-1">
                  &lt; 1 min
                </span>
                <span className="block text-[8px] text-neutral-400 font-bold uppercase mt-0.5">
                  Live chat SLA
                </span>
              </div>

              <div className="bg-neutral-50/50 p-3 rounded-2xl border border-neutral-100">
                <span className="block text-xl">💳</span>
                <span className="block text-base font-black text-neutral-800 mt-1">
                  Instant
                </span>
                <span className="block text-[8px] text-neutral-400 font-bold uppercase mt-0.5">
                  Wallet Credits
                </span>
              </div>
            </div>

            <div className="bg-orange-50/45 p-3 rounded-2xl border border-orange-100/50 flex items-center gap-3">
              <ShieldCheck className="h-15 w-15 text-brand-orange" />
              <p className="text-[10px] text-gray-600 leading-relaxed font-semibold">
                Under the QuikaBite{" "}
                <span className="text-brand-orange font-bold">
                  Gourmet Guarantee
                </span>
                , all claims are verified instantly with automatic driver
                diagnostics.
              </p>
            </div>
          </div>

          {/* Persistent Ticket History Panel */}
          <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-1.5">
                <ClipboardList className="h-4.5 w-4.5 text-brand-orange" />
                <h4 className="font-display font-black text-xs uppercase tracking-wider text-gray-800">
                  Your Tickets ({tickets.length})
                </h4>
              </div>
              {tickets.length > 1 && (
                <button
                  onClick={() => {
                    setTickets([]);
                    triggerToast("Cleared ticket archive");
                  }}
                  className="text-[9px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar pr-1">
              {tickets.length === 0 ? (
                <div className="text-center py-6 select-none space-y-1">
                  <p className="text-[10px] font-bold text-gray-400">
                    No active tickets raised
                  </p>
                  <p className="text-[9px] text-gray-300">
                    Submit the form to lodge a ticket.
                  </p>
                </div>
              ) : (
                tickets.map((ticket) => {
                  let statusBg = "bg-gray-100 text-gray-600";
                  if (ticket.status === "Open")
                    statusBg =
                      "bg-blue-50 text-blue-600 border border-blue-100";
                  if (ticket.status === "Resolved")
                    statusBg =
                      "bg-emerald-50 text-emerald-600 border border-emerald-100";
                  let priorityColor = "bg-neutral-100 text-neutral-600";
                  if (ticket.priority === "high")
                    priorityColor =
                      "bg-orange-100 text-orange-700 font-extrabold";
                  if (ticket.priority === "urgent")
                    priorityColor = "bg-red-100 text-red-700 font-extrabold";
                  return (
                    <div
                      key={ticket.id}
                      className="p-3 bg-neutral-50/50 border border-neutral-100 rounded-2xl relative space-y-1.5 text-left"
                    >
                      <div className="flex justify-between items-center text-[10px] font-extrabold">
                        <span className="text-gray-800">{ticket.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[8px] uppercase ${statusBg}`}
                        >
                          {ticket.status}
                        </span>
                      </div>

                      <p className="text-xs font-black text-gray-700 leading-snug truncate">
                        {ticket.category}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium line-clamp-2 leading-relaxed">
                        {ticket.description}
                      </p>

                      <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 pt-1.5 border-t border-neutral-200/40 border-gray-100">
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{ticket.timestamp}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[8px] uppercase px-1.5 py-0.5 rounded font-black ${priorityColor}`}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
