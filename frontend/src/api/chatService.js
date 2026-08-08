import apiClient, { USE_MOCK } from "./apiClient";

let socketInstance = null;

export const chatService = {
  // REST API: Start or fetch conversation for an order
  async startConversation(orderId) {
    if (USE_MOCK) {
      const mockConvId = `conv-${orderId || "gen-" + Date.now()}`;
      return {
        _id: mockConvId,
        id: mockConvId,
        order: orderId,
        status: "BOT",
        mode: "BOT",
        createdAt: new Date().toISOString(),
      };
    }
    try {
      const response = await apiClient.post("/v1/chat/conversations", { order: orderId });
      return response.data?.data || response.data;
    } catch (err) {
      console.warn("startConversation REST API failed, using fallback:", err?.message || err);
      const fallbackId = `conv-${orderId || Date.now()}`;
      return { _id: fallbackId, id: fallbackId, order: orderId, status: "BOT", mode: "BOT" };
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

  // Socket.io Real-Time Integration
  async connectSocket(conversationId, onNewMessage) {
    if (!conversationId) return null;
    try {
      const { io } = await import("socket.io-client");
      const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:5000";

      if (socketInstance) {
        socketInstance.disconnect();
      }

      const token = localStorage.getItem("globaleats_token") || localStorage.getItem("token") || "";
      socketInstance = io(socketUrl, {
        auth: { token: `Bearer ${token}` },
        transports: ["websocket", "polling"],
      });

      socketInstance.on("connect", () => {
        console.log("⚡ Socket connected. Joining conversation room:", conversationId);
        socketInstance.emit("join_conversation", { conversationId });
      });

      socketInstance.on("new_message", (messageObj) => {
        console.log("📩 Socket received new_message:", messageObj);
        if (typeof onNewMessage === "function") {
          onNewMessage(messageObj);
        }
      });

      socketInstance.on("disconnect", () => {
        console.log("🔌 Socket disconnected.");
      });

      return socketInstance;
    } catch (err) {
      console.warn("Socket.io client not initialized, running in fallback mode:", err?.message || err);
      return null;
    }
  },

  // Socket.io: Send a message to conversation room
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

    if (socketInstance && socketInstance.connected) {
      socketInstance.emit("send_message", messageObj);
    } else {
      console.log("Socket connection inactive, sending local dispatch:", messageObj);
    }

    return messageObj;
  },

  // Socket.io: Disconnect socket cleanly
  disconnectSocket() {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
  }
};
