// src/api/notificationService.js
import apiClient from "./apiClient";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const notificationService = {
  // 1. Fetch Customer / Manager Notifications (GET /v1/notifications)
  async getNotifications() {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_notifications");
      return cached ? JSON.parse(cached) : [];
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) {
        const cached = localStorage.getItem("globaleats_notifications");
        return cached ? JSON.parse(cached) : [];
      }
      try {
        const response = await apiClient.get("/v1/notifications");
        const data = response.data?.data || response.data?.notifications || response.data;
        const list = Array.isArray(data) ? data : [];
        localStorage.setItem("globaleats_notifications", JSON.stringify(list));
        return list;
      } catch (err) {
        console.error("getNotifications API error, using cached:", err);
        const cached = localStorage.getItem("globaleats_notifications");
        return cached ? JSON.parse(cached) : [];
      }
    }
  },

  // Alias for Customer Notification (GET /v1/notifications)
  async getCustomerNotifications() {
    return this.getNotifications();
  },

  // Alias for Manager Notification (GET /v1/notifications)
  async getManagerNotifications() {
    return this.getNotifications();
  },

  // 2. Mark Customer / Manager Notification as Read (PATCH /v1/notifications/:id/read)
  async markNotificationRead(id) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_notifications");
      let list = cached ? JSON.parse(cached) : [];
      list = list.map((n) => (String(n.id) === String(id) || String(n._id) === String(id) ? { ...n, isRead: true } : n));
      localStorage.setItem("globaleats_notifications", JSON.stringify(list));
      return { success: true, notifications: list };
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) return { success: false };
      try {
        const response = await apiClient.patch(`/v1/notifications/${id}/read`);
        return response.data;
      } catch (err) {
        console.error("markNotificationRead API error:", err);
        // Fallback local update
        const cached = localStorage.getItem("globaleats_notifications");
        let list = cached ? JSON.parse(cached) : [];
        list = list.map((n) => (String(n.id) === String(id) || String(n._id) === String(id) ? { ...n, isRead: true } : n));
        localStorage.setItem("globaleats_notifications", JSON.stringify(list));
        return { success: true, notifications: list };
      }
    }
  },

  // Alias for Customer Notification Read (PATCH /v1/notifications/:id/read)
  async markCustomerNotificationRead(id) {
    return this.markNotificationRead(id);
  },

  // Alias for Manager Notification Read (PATCH /v1/notifications/:id/read)
  async markManagerNotificationRead(id) {
    return this.markNotificationRead(id);
  }
};

export default notificationService;
