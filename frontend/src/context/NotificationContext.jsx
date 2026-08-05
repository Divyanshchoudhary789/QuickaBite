import { createContext, useContext, useState, useEffect } from "react";
import { dinerService } from "../api/dinerService";
import { notificationService } from "../api/notificationService";
import { INITIAL_NOTIFICATIONS } from "../data";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // Load notifications initially from service
  useEffect(() => {
    const loadNotifs = async () => {
      const data = await notificationService.getNotifications();
      if (data && data.length > 0) {
        setNotifications(data);
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    };
    loadNotifs();
  }, []);

  const updateNotificationsStateAndStorage = async (updatedNotifs) => {
    setNotifications(updatedNotifs);
    await dinerService.saveNotifications(updatedNotifs);
  };

  const markAllAsRead = async (triggerToast) => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    for (const n of notifications) {
      if (!n.isRead && (n.id || n._id)) {
        notificationService.markNotificationRead(n.id || n._id).catch(() => {});
      }
    }
    if (triggerToast) triggerToast("✓ Marked all notifications as read");
  };

  const toggleRead = async (id) => {
    const target = notifications.find((n) => n.id === id || n._id === id);
    const updated = notifications.map((n) =>
      (n.id === id || n._id === id) ? { ...n, isRead: !n.isRead } : n
    );
    setNotifications(updated);
    if (target && !target.isRead) {
      await notificationService.markNotificationRead(id);
    }
  };

  const deleteNotification = async (id, triggerToast) => {
    const updated = notifications.filter((n) => n.id !== id);
    await updateNotificationsStateAndStorage(updated);
    if (triggerToast) triggerToast("Notification deleted");
  };

  const clearAll = async (triggerToast) => {
    await updateNotificationsStateAndStorage([]);
    if (triggerToast) triggerToast("Cleared notification feed history");
  };

  const addNotification = async (notif) => {
    const updated = [notif, ...notifications];
    await updateNotificationsStateAndStorage(updated);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications: updateNotificationsStateAndStorage,
        markAllAsRead,
        toggleRead,
        deleteNotification,
        clearAll,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
