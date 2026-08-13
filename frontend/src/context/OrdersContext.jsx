import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { dinerService, normalizeOrder } from "../api/dinerService";

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  const fetchLatestOrders = useCallback(async () => {
    const token = localStorage.getItem("globaleats_token");
    const isMock = import.meta.env.VITE_USE_MOCK !== "false";
    if (!isMock && !token) {
      return;
    }

    try {
      const userStr = localStorage.getItem("globaleats_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const role = String(user.role || "").toLowerCase().trim();
        if (role === "manager" || role === "admin" || role === "driver" || role === "rider") {
          return;
        }
      }
    } catch {
      // ignore parse error
    }

    try {
      const data = await dinerService.getOrders();
      if (Array.isArray(data)) {
        setOrders((prev) => {
          if (!Array.isArray(prev) || prev.length === 0) {
            return data;
          }
          const dinerIds = new Set(data.map((o) => String(o._id || o.id)));
          const managerOrdersToKeep = prev.filter(
            (o) => o && !dinerIds.has(String(o._id || o.id))
          );
          const merged = [...data, ...managerOrdersToKeep];
          if (JSON.stringify(prev) === JSON.stringify(merged)) {
            return prev;
          }
          return merged;
        });
      }
    } catch (e) {
      if (e?.response?.status !== 403) {
        console.error("Error loading orders in OrdersContext:", e);
      }
    }
  }, []);

  const hasActiveOrders = useCallback((ordersList) => {
    if (!Array.isArray(ordersList)) return false;
    const activeStatuses = new Set([
      "received",
      "placed",
      "pending",
      "accepted",
      "confirmed",
      "preparing",
      "ready",
      "ready-for-pickup",
      "dispatched",
      "out_for_delivery",
      "out",
      "delivering",
      "in_transit",
      "on_way",
      "shipped",
    ]);
    return ordersList.some((o) => {
      if (!o) return false;
      const statusStr = String(o.status || o.orderStatus || "").toLowerCase().trim();
      return activeStatuses.has(statusStr);
    });
  }, []);

  // Initial fetch on mount & listen for mutation events
  useEffect(() => {
    fetchLatestOrders();

    const handleOrderMutated = () => {
      fetchLatestOrders();
    };

    window.addEventListener("globaleats_order_mutated", handleOrderMutated);

    return () => {
      window.removeEventListener(
        "globaleats_order_mutated",
        handleOrderMutated,
      );
    };
  }, [fetchLatestOrders]);

  // Smart Polling: Only poll server if there is at least one active order in progress
  useEffect(() => {
    if (!hasActiveOrders(orders)) {
      return;
    }

    const interval = setInterval(() => {
      fetchLatestOrders();
    }, 20000);

    return () => clearInterval(interval);
  }, [orders, hasActiveOrders, fetchLatestOrders]);

  // Sync activeOrder state automatically when orders array updates
  useEffect(() => {
    if (activeOrder) {
      const targetId = String(activeOrder.id || activeOrder._id || "");
      const latest = orders.find(
        (o) => o && String(o.id || o._id) === targetId,
      );
      if (latest) {
        if (
          latest.status !== activeOrder.status ||
          latest.rejectionReason !== activeOrder.rejectionReason ||
          latest.driverName !== activeOrder.driverName ||
          latest.deliveryPartner !== activeOrder.deliveryPartner
        ) {
          setActiveOrder(latest);
        }
      }
    }
  }, [orders, activeOrder]);

  const updateOrdersStateAndStorage = useCallback(async (updatedOrdersOrFn) => {
    setOrders((prev) => {
      const resolved =
        typeof updatedOrdersOrFn === "function"
          ? updatedOrdersOrFn(prev)
          : updatedOrdersOrFn;
      const safeArray = Array.isArray(resolved)
        ? resolved.map(normalizeOrder).filter(Boolean)
        : [];
      dinerService.saveOrders(safeArray).catch(() => {});
      return safeArray;
    });
  }, []);

  const checkoutSuccess = async (newOrder, addNotification, navigate) => {
    const normalizedNewOrder = normalizeOrder(newOrder) || newOrder;
    const targetId = String(
      normalizedNewOrder.id || normalizedNewOrder._id || "",
    );
    setOrders((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const filteredPrev = safePrev.filter(
        (o) => o && String(o.id || o._id) !== targetId,
      );
      const updated = [normalizedNewOrder, ...filteredPrev];
      dinerService.saveOrders(updated).catch(() => {});
      return updated;
    });
    setActiveOrder(normalizedNewOrder);

    if (addNotification) {
      addNotification({
        id: `order-notif-${Date.now()}`,
        category: "orders",
        title: "Order Confirmed!",
        message: `Your feast from ${normalizedNewOrder.restaurantName || "Restaurant"} is preparing. Estimated delivery in 35-45 mins!`,
        timestamp: "Just Now",
        isRead: false,
      });
    }

    if (navigate) {
      navigate("/orders");
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        setOrders: updateOrdersStateAndStorage,
        activeOrder,
        setActiveOrder,
        checkoutSuccess,
        fetchLatestOrders,
        refetchOrders: fetchLatestOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
