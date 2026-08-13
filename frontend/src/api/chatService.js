import apiClient, { USE_MOCK } from "./apiClient";
import { io } from "socket.io-client";

let socketInstance = null;

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api(\/v\d+)?\/?$/, "");
  }
  return "https://quikabite.onrender.com";
};

/**
 * Initialize and connect Socket.io connection for a conversation room
 */
export const initSocket = (conversationId, onNewMessage) => {
  if (!conversationId) return null;
  const socketUrl = getSocketUrl();

  if (socketInstance) {
    socketInstance.disconnect(); // Clean up existing connection before creating a new one
  }

  const token = localStorage.getItem("globaleats_token") || localStorage.getItem("token") || "";
  socketInstance = io(socketUrl, {
    auth: { token: `Bearer ${token}` },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socketInstance.on("connect", () => {
    console.log("⚡ Connected to Socket server:", socketInstance.id);
    // Join conversation room
    socketInstance.emit("join_conversation", conversationId);
  });

  socketInstance.on("new_message", (data) => {
    console.log("📩 New message received via Socket:", data);
    if (typeof onNewMessage === "function") {
      onNewMessage(data);
    }
  });

  socketInstance.on("error", (err) => {
    console.error("❌ Socket error:", err);
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("🔌 Socket disconnected:", reason);
  });

  return socketInstance;
};

/**
 * Emit a new message payload over Socket.io
 */
export const sendSocketMessage = (messagePayload) => {
  if (socketInstance && socketInstance.connected) {
    socketInstance.emit("send_message", messagePayload);
  } else {
    console.warn("⚠️ Socket is not connected. Message not sent via socket.");
  }
};

/**
 * Cleanly disconnect socket on unmount
 */
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const chatService = {
  // Helper to resolve 24-hex Mongo _id for an order
  _resolve24HexOrderId(orderId) {
    if (!orderId) return null;
    let raw = orderId;
    if (typeof raw === "object" && raw !== null) {
      raw = raw._id || raw.orderId || raw.id || "";
    }
    const str = String(raw || "").trim();
    const clean = str.replace(/^GE-/, "");

    if (/^[0-9a-fA-F]{24}$/.test(clean)) {
      return clean;
    }

    try {
      const cached = localStorage.getItem("globaleats_orders");
      const list = cached ? JSON.parse(cached) : [];
      if (Array.isArray(list)) {
        const found = list.find(
          (o) =>
            String(o.orderNumber) === clean ||
            String(o.orderId) === clean ||
            String(o.id) === clean ||
            String(o._id) === clean ||
            String(o.orderNumber) === str ||
            String(o.id) === str ||
            String(o._id) === str
        );
        if (found) {
          const dbId = found._id || found.orderId;
          if (dbId && /^[0-9a-fA-F]{24}$/.test(String(dbId))) {
            return String(dbId);
          }
        }
      }
    } catch {
      // ignore
    }

    return null;
  },

  // REST API: Start or fetch conversation for an order
  async startConversation(orderId) {
    const mongoOrderId = this._resolve24HexOrderId(orderId);

    if (USE_MOCK || !mongoOrderId) {
      const mockConvId = `conv-${mongoOrderId || (typeof orderId === "string" ? orderId.replace(/^GE-/, "") : "gen")}-${Date.now()}`;
      return {
        _id: mockConvId,
        id: mockConvId,
        order: mongoOrderId || orderId,
        status: "BOT",
        mode: "BOT",
        createdAt: new Date().toISOString(),
      };
    }
    try {
      const response = await apiClient.post("/v1/chat/conversations", { order: mongoOrderId });
      return response.data?.data || response.data;
    } catch (err) {
      console.warn("startConversation REST API notice:", err?.response?.data?.message || err?.message || err);
      const fallbackId = `conv-${mongoOrderId || Date.now()}`;
      return { _id: fallbackId, id: fallbackId, order: mongoOrderId || orderId, status: "BOT", mode: "BOT" };
    }
  },

  // REST API: Fetch chat history messages for a conversation
  async getMessages(conversationId) {
    if (!conversationId) return [];
    if (USE_MOCK) {
      const cached = localStorage.getItem(`Quikabite_chat_msgs_${conversationId}`);
      if (cached) return JSON.parse(cached);
      return [];
    }
    try {
      const response = await apiClient.get(`/v1/chat/conversations/${conversationId}/messages`);
      const raw = response.data?.data || response.data || [];
      return Array.isArray(raw) ? raw : [];
    } catch (err) {
      console.warn("getMessages REST API failed, using cached/fallback messages:", err?.message || err);
      const cached = localStorage.getItem(`Quikabite_chat_msgs_${conversationId}`);
      return cached ? JSON.parse(cached) : [];
    }
  },

  // REST API: Close a conversation
  async closeConversation(conversationId) {
    if (USE_MOCK) {
      return { success: true, status: "CLOSED" };
    }
    try {
      const response = await apiClient.patch(`/v1/chat/conversations/${conversationId}/close`);
      return response.data?.data || response.data;
    } catch (err) {
      console.warn("closeConversation REST API failed:", err?.message || err);
      return { success: false };
    }
  },

  // Socket.io helper aliases for backward compatibility
  connectSocket(conversationId, onNewMessage) {
    return initSocket(conversationId, onNewMessage);
  },

  sendMessage(payload) {
    const { conversationId, message, senderType = "USER", sender = "user", quickReplyUsed = "" } = payload;
    const messageObj = {
      conversationId,
      message,
      text: message,
      senderType,
      sender,
      quickReplyUsed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: new Date().toISOString(),
    };
    sendSocketMessage(messageObj);
    return messageObj;
  },

  disconnectSocket() {
    disconnectSocket();
  }
};

export default chatService;
