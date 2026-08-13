// src/hooks/useSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api(\/v\d+)?\/?$/, "");
  }
  return "https://quikabite.onrender.com";
};

export const useSocket = (conversationId, onMessageReceived) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    const socketUrl = getSocketUrl();
    const token = localStorage.getItem("globaleats_token") || localStorage.getItem("token") || "";

    const socket = io(socketUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("⚡ Connected to Socket server:", socket.id);
      socket.emit("join_conversation", conversationId);
    });

    socket.on("new_message", (msg) => {
      console.log("📩 New message received via Socket:", msg);
      if (typeof onMessageReceived === "function") {
        onMessageReceived(msg);
      }
    });

    socket.on("error", (err) => {
      console.error("❌ Socket error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

  const sendMessage = (data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("send_message", data);
    } else {
      console.warn("⚠️ Socket is not connected. Message not sent via socket.");
    }
  };

  return { sendMessage, socket: socketRef.current };
};

export default useSocket;
