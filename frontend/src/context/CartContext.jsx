import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dinerService, extractImageUrl } from "../api/dinerService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [cartConflict, setCartConflict] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [tipAmount, setTipAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Recalculate or auto-remove coupon if cart items / subtotal change below minOrder
  useEffect(() => {
    if (!appliedCoupon) return;
    const subtotal = cartItems.reduce(
      (acc, curr) =>
        acc +
        Number(curr?.menuItem?.price ?? curr?.price ?? 0) *
        Number(curr?.quantity ?? 1),
      0,
    );
    if (cartItems.length === 0 || subtotal <= 0) {
      setAppliedCoupon(null);
      return;
    }
    if (appliedCoupon.minOrder && subtotal < appliedCoupon.minOrder) {
      setAppliedCoupon(null);
      return;
    }
    if (appliedCoupon.couponObj) {
      const coupon = appliedCoupon.couponObj;
      let newDiscount = 0;
      if (typeof coupon.calc === "function") {
        newDiscount = coupon.calc(subtotal);
      } else if (coupon.discountType === "percentage") {
        const calcVal = Math.round(subtotal * (coupon.discountValue / 100));
        newDiscount = coupon.maximumDiscount
          ? Math.min(coupon.maximumDiscount, calcVal)
          : calcVal;
      } else {
        newDiscount = coupon.discountValue || appliedCoupon.discount || 0;
      }
      if (newDiscount !== appliedCoupon.discount) {
        setAppliedCoupon((prev) =>
          prev ? { ...prev, discount: newDiscount } : null,
        );
      }
    }
  }, [cartItems]);

  const updateCartStateFromBackend = async (data) => {
    if (!data) return;
    const { cart, items } = data;
    if (!cart) return;

    if (cart.restaurant) {
      const isStringId = typeof cart.restaurant === "string";
      const resId = isStringId
        ? cart.restaurant
        : cart.restaurant._id || cart.restaurant.id;

      let name = isStringId ? "" : cart.restaurant.name;
      let image = isStringId ? "" : cart.restaurant.image;
      let city = isStringId ? "" : cart.restaurant.city;
      let deliveryFee = isStringId ? undefined : cart.restaurant.deliveryFee;
      let isFreeDelivery = isStringId
        ? undefined
        : cart.restaurant.isFreeDelivery;

      if (
        isStringId ||
        !name ||
        deliveryFee === undefined ||
        deliveryFee === null
      ) {
        try {
          const fullRes = await dinerService.getRestaurantById(resId);
          if (fullRes) {
            name = fullRes.name || name;
            image = fullRes.image || image;
            city = fullRes.city || city;
            deliveryFee = fullRes.deliveryFee;
            isFreeDelivery = fullRes.isFreeDelivery;
          }
        } catch (e) {
          console.error("Error fetching restaurant details for cart:", e);
        }
      }

      setCartRestaurant({
        id: resId,
        name: name,
        image: image,
        city: city,
        deliveryFee: deliveryFee !== undefined ? Number(deliveryFee) : 0,
        isFreeDelivery:
          isFreeDelivery !== undefined
            ? isFreeDelivery
            : deliveryFee !== undefined
              ? Number(deliveryFee) === 0
              : false,
      });
    } else {
      setCartRestaurant(null);
    }

    const normalizedItems = (items || []).map((item) => ({
      cartItemId: item._id,
      menuItem: {
        id: item.menu?._id || item.menu?.id,
        _id: item.menu?._id || item.menu?.id,
        name: item.menu?.name,
        image: extractImageUrl(item.menu?.image),
        category: item.menu?.category,
        price: item.menu?.price,
        isVeg:
          item.menu?.isVegetarian !== undefined
            ? item.menu?.isVegetarian
            : true,
      },
      quantity: item.quantity,
    }));

    setCartItems(normalizedItems);
    setSpecialInstructions(cart.specialInstructions || "");
    setTipAmount(cart.tipAmount || 0);
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (!USE_MOCK && isLoggedIn) {
        try {
          const data = await dinerService.getCart();
          await updateCartStateFromBackend(data);
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      } else if (!isLoggedIn) {
        setCartItems([]);
        setCartRestaurant(null);
        setCartConflict(null);
        setSpecialInstructions("");
        setTipAmount(0);
      }
    };
    fetchCart();
  }, [isLoggedIn]);

  const addToCart = async (resId, resName, item, triggerToast) => {
    if (item && (item.isAvailable === false || item.availability === false)) {
      if (triggerToast) {
        triggerToast(
          `Sorry, ${item.name || "this item"} is currently out of stock!`,
        );
      }
      return;
    }
    const token = localStorage.getItem("globaleats_token");
    if (!isLoggedIn && !token && !USE_MOCK) {
      if (triggerToast) {
        triggerToast("Please sign in to add items to your cart!");
      }
      try {
        navigate("/login", { state: { from: window.location.pathname } });
      } catch (e) {
        window.location.href = "/login";
      }
      return;
    }
    const isSameRestaurant =
      !cartRestaurant ||
      cartRestaurant.id === resId ||
      cartRestaurant._id === resId ||
      (cartRestaurant.name &&
        resName &&
        cartRestaurant.name.toLowerCase() === resName.toLowerCase());

    if (!isSameRestaurant) {
      setCartConflict({ resId, resName, item });
      return;
    }

    // Optimistic update: set cart restaurant immediately if not set
    if (!cartRestaurant) {
      setCartRestaurant({
        id: resId,
        name: resName,
        deliveryFee: 0,
        isFreeDelivery: true,
      });
    }

    // Optimistic update: update cartItems state immediately
    const itemId = item.id || item._id;
    setCartItems((prev) => {
      const existing = prev.find((i) => {
        const mId = i.menuItem?.id || i.menuItem?._id;
        return (
          mId === itemId ||
          (mId != null && itemId != null && String(mId) === String(itemId))
        );
      });

      if (existing) {
        return prev.map((i) => {
          const mId = i.menuItem?.id || i.menuItem?._id;
          if (
            mId === itemId ||
            (mId != null && itemId != null && String(mId) === String(itemId))
          ) {
            return { ...i, quantity: i.quantity + 1 };
          }
          return i;
        });
      }

      const normalizedItem = {
        ...item,
        id: item.id || item._id,
        _id: item._id || item.id,
      };
      return [...prev, { menuItem: normalizedItem, quantity: 1 }];
    });

    // Trigger instant visual feedback
    if (triggerToast) {
      triggerToast(`Added ${item.name} to basket!`);
    }

    // Perform backend sync asynchronously
    if (!USE_MOCK) {
      try {
        const data = await dinerService.addToCart(item._id || item.id, 1);
        if (data) {
          await updateCartStateFromBackend(data);
        }
      } catch (err) {
        console.error("Error syncing cart addition with API:", err);
      }
    }
  };

  const removeFromCart = async (resId, itemId) => {
    const existing = cartItems.find((i) => {
      const mId = i.menuItem?.id || i.menuItem?._id;
      return (
        mId === itemId ||
        (mId != null && itemId != null && String(mId) === String(itemId))
      );
    });

    // Optimistic update for removal/decrement
    setCartItems((prev) => {
      const match = prev.find((i) => {
        const mId = i.menuItem?.id || i.menuItem?._id;
        return (
          mId === itemId ||
          (mId != null && itemId != null && String(mId) === String(itemId))
        );
      });
      if (!match) return prev;

      if (match.quantity <= 1) {
        const remaining = prev.filter((i) => {
          const mId = i.menuItem?.id || i.menuItem?._id;
          return mId !== itemId && String(mId) !== String(itemId);
        });
        if (remaining.length === 0) {
          setCartRestaurant(null);
        }
        return remaining;
      }

      return prev.map((i) => {
        const mId = i.menuItem?.id || i.menuItem?._id;
        if (mId === itemId || String(mId) === String(itemId)) {
          return { ...i, quantity: i.quantity - 1 };
        }
        return i;
      });
    });

    if (!USE_MOCK && existing) {
      try {
        if (existing.quantity === 1 && existing.cartItemId) {
          const data = await dinerService.removeCartItem(existing.cartItemId);
          if (data) await updateCartStateFromBackend(data);
        } else if (existing.cartItemId) {
          const data = await dinerService.updateCartQuantity(
            existing.cartItemId,
            existing.quantity - 1,
          );
          if (data) await updateCartStateFromBackend(data);
        }
      } catch (err) {
        console.error("Error syncing cart removal with API:", err);
      }
    }
  };

  const clearCart = async () => {
    setAppliedCoupon(null);
    if (USE_MOCK) {
      setCartItems([]);
      setCartRestaurant(null);
      setCartConflict(null);
    } else {
      try {
        await dinerService.clearCart();
        // Always reset state regardless of what the backend returns,
        // since a cleared cart may return null/empty data.
        setCartItems([]);
        setCartRestaurant(null);
        setCartConflict(null);
        setSpecialInstructions("");
        setTipAmount(0);
      } catch (err) {
        console.error("Error clearing cart:", err);
      }
    }
  };

  const removeCoupon = async () => {
    if (!USE_MOCK) {
      try {
        await dinerService.removeCoupon();
      } catch (err) {
        console.warn("Remove coupon notice:", err);
      }
    }
    setAppliedCoupon(null);
  };

  const resolveCartConflict = async (triggerToast) => {
    if (cartConflict) {
      const { resId, resName, item } = cartConflict;
      if (item && (item.isAvailable === false || item.availability === false)) {
        if (triggerToast) {
          triggerToast(
            `Sorry, ${item.name || "this item"} is currently out of stock!`,
          );
        }
        setCartConflict(null);
        return;
      }
      if (USE_MOCK) {
        let deliveryFee = 0;
        let isFreeDelivery = false;
        try {
          const fullRes = await dinerService.getRestaurantById(resId);
          if (fullRes) {
            deliveryFee =
              fullRes.deliveryFee !== undefined
                ? Number(fullRes.deliveryFee)
                : 0;
            isFreeDelivery =
              fullRes.isFreeDelivery !== undefined
                ? fullRes.isFreeDelivery
                : deliveryFee === 0;
          }
        } catch (e) {
          console.error("Failed to fetch restaurant details:", e);
        }
        setCartItems([{ menuItem: item, quantity: 1 }]);
        setCartRestaurant({
          id: resId,
          name: resName,
          deliveryFee,
          isFreeDelivery,
        });
        setCartConflict(null);
        if (triggerToast) {
          triggerToast(`Basket cleared. Added ${item.name} from ${resName}!`);
        }
      } else {
        try {
          await dinerService.clearCart();
          const data = await dinerService.addToCart(item.id || item._id, 1);
          await updateCartStateFromBackend(data);
          setCartConflict(null);
          if (triggerToast) {
            triggerToast(`Basket cleared. Added ${item.name} from ${resName}!`);
          }
        } catch (err) {
          console.error("Error resolving cart conflict:", err);
        }
      }
    }
  };

  const updateSpecialInstructions = async (instructions) => {
    if (USE_MOCK) {
      setSpecialInstructions(instructions);
    } else {
      try {
        const data = await dinerService.updateSpecialInstructions(instructions);
        await updateCartStateFromBackend(data);
      } catch (err) {
        console.error("Error updating special instructions:", err);
      }
    }
  };

  const updateTip = async (amount) => {
    setTipAmount(amount);
    if (!USE_MOCK) {
      try {
        const data = await dinerService.updateTip(amount);
        if (data) {
          await updateCartStateFromBackend(data);
        }
      } catch (err) {
        console.error("Error updating tip:", err);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartRestaurant,
        setCartRestaurant,
        cartConflict,
        setCartConflict,
        addToCart,
        removeFromCart,
        clearCart,
        resolveCartConflict,
        specialInstructions,
        setSpecialInstructions,
        tipAmount,
        setTipAmount,
        updateSpecialInstructions,
        updateTip,
        appliedCoupon,
        setAppliedCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
