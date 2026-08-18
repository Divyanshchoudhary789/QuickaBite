// src/api/adminService.js
import apiClient from "./apiClient";
import { normalizeRestaurant, normalizeCoupon, validateCouponData, normalizeOrder } from "./dinerService";
export { normalizeCoupon };

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const normalizeUser = (u) => {
  if (!u) return null;
  const isBlocked = Boolean(u.isBlocked === true || u.status === "suspended" || u.status === "blocked");
  return {
    id: u._id || u.id,
    _id: u._id || u.id,
    name: u.fullName || u.name || "Unknown User",
    fullName: u.fullName || u.name || "Unknown User",
    email: u.email || "",
    phone: u.phone || "",
    role: u.role === "user" ? "customer" : (u.role || "customer"),
    isBlocked: isBlocked,
    status: isBlocked ? "suspended" : "active",
    joinDate: u.createdAt ? u.createdAt.split("T")[0] : (u.joinDate || new Date().toISOString().split("T")[0]),
    restaurant: u.restaurant || u.restaurantId || "",
  };
};

export const adminService = {
  // Categories management (/api/v1/categories)
  async getCategories(queryParams = {}) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_categories");
      return cached ? JSON.parse(cached) : [
        { _id: "64f1a2b3c4d5e6f7a8b9c0d1", name: "Burgers", slug: "burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", description: "Juicy gourmet burgers and crispy fries", displayOrder: 1, isActive: true },
        { _id: "64f1a2b3c4d5e6f7a8b9c0d2", name: "Biryani & Rice", slug: "biryani-rice", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8", description: "Authentic dum biryani and fragrant rice items", displayOrder: 2, isActive: true },
        { _id: "64f1a2b3c4d5e6f7a8b9c0d3", name: "Pizzas", slug: "pizzas", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591", description: "Handcrafted wood-fired pizzas", displayOrder: 3, isActive: true },
        { _id: "64f1a2b3c4d5e6f7a8b9c0d4", name: "Desserts & Shakes", slug: "desserts-shakes", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699", description: "Sweet delights, ice creams, and thick shakes", displayOrder: 4, isActive: true },
      ];
    } else {
      try {
        const params = { includeInactive: "true", all: "true", ...queryParams };
        const response = await apiClient.get("/v1/categories", { params });
        const resPayload = response.data;
        const list = Array.isArray(resPayload?.data) ? resPayload.data : Array.isArray(resPayload?.categories) ? resPayload.categories : Array.isArray(resPayload) ? resPayload : [];
        return list;
      } catch (err) {
        console.warn("getCategories with params error, falling back to standard /v1/categories:", err?.message || err);
        const response = await apiClient.get("/v1/categories");
        return response.data?.data || response.data?.categories || response.data || [];
      }
    }
  },

  async getCategoryById(id) {
    if (USE_MOCK) {
      const list = await this.getCategories();
      return list.find((c) => c._id === id || c.id === id) || null;
    } else {
      const response = await apiClient.get(`/v1/categories/${id}`);
      return response.data?.data || response.data;
    }
  },

  async createCategory(categoryPayload) {
    const payload = {
      name: String(categoryPayload.name || "").trim(),
      restaurant: String(categoryPayload.restaurant || categoryPayload.restaurantId || "").trim(),
      description: String(categoryPayload.description || "").trim(),
      image: String(categoryPayload.image || "").trim(),
      displayOrder: Number(categoryPayload.displayOrder) || 1,
      isActive: categoryPayload.isActive !== undefined ? Boolean(categoryPayload.isActive) : true,
    };
    if (USE_MOCK) {
      const list = await this.getCategories();
      const newCat = {
        _id: `cat-${Date.now()}`,
        slug: payload.name.toLowerCase().replace(/\s+/g, "-"),
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newCat, ...list];
      localStorage.setItem("globaleats_categories", JSON.stringify(updated));
      return newCat;
    } else {
      const response = await apiClient.post("/v1/categories", payload);
      return response.data?.data || response.data;
    }
  },

  async updateCategory(id, categoryPayload) {
    const payload = {
      name: String(categoryPayload.name || "").trim(),
      restaurant: String(categoryPayload.restaurant || categoryPayload.restaurantId || "").trim(),
      description: String(categoryPayload.description || "").trim(),
      image: String(categoryPayload.image || "").trim(),
      displayOrder: Number(categoryPayload.displayOrder) || 1,
      isActive: categoryPayload.isActive !== undefined ? Boolean(categoryPayload.isActive) : true,
    };
    if (USE_MOCK) {
      const list = await this.getCategories();
      const updated = list.map((c) =>
        c._id === id || c.id === id ? { ...c, ...payload, updatedAt: new Date().toISOString() } : c
      );
      localStorage.setItem("globaleats_categories", JSON.stringify(updated));
      return updated.find((c) => c._id === id || c.id === id);
    } else {
      const response = await apiClient.patch(`/v1/categories/${id}`, payload);
      return response.data?.data || response.data;
    }
  },

  async deleteCategory(id) {
    if (USE_MOCK) {
      const list = await this.getCategories();
      const updated = list.filter((c) => c._id !== id && c.id !== id);
      localStorage.setItem("globaleats_categories", JSON.stringify(updated));
      return { success: true };
    } else {
      const response = await apiClient.delete(`/v1/categories/${id}`);
      return response.data?.data || response.data;
    }
  },

  async getUsers() {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_users");
      const list = cached ? JSON.parse(cached) : [
        { id: "u-1", name: "Executive Admin", phone: "9999988888", role: "admin", status: "Active", joined: "Jan 2026" },
        { id: "u-2", name: "Vedanshi Bhabhra", phone: "9876543210", role: "user", status: "Active", joined: "June 2026" },
        { id: "u-3", name: "Chef Sanjay", phone: "8880012345", role: "manager", status: "Active", joined: "May 2026" },
      ];
      return list.map(normalizeUser).filter(Boolean);
    } else {
      try {
        const response = await apiClient.get("/v1/users");
        const rawData = response.data?.data || response.data?.users || response.data || [];
        const list = Array.isArray(rawData) ? rawData : [];
        return list.map(normalizeUser).filter(Boolean);
      } catch (err) {
        console.warn("getUsers API error, using local fallback:", err?.message || err);
        const cached = localStorage.getItem("globaleats_users");
        const list = cached ? JSON.parse(cached) : [];
        return list.map(normalizeUser).filter(Boolean);
      }
    }
  },

  async getUserById(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_users");
      const list = cached ? JSON.parse(cached) : [];
      const found = list.find((u) => u.id === id || u._id === id);
      return found ? normalizeUser(found) : null;
    } else {
      const response = await apiClient.get(`/v1/users/${id}`);
      const rawData = response.data?.data || response.data?.user || response.data;
      return normalizeUser(rawData);
    }
  },

  async createUser(userData) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const cached = localStorage.getItem("globaleats_users");
      const list = cached ? JSON.parse(cached) : [];
      const newUser = { _id: `usr-${Date.now()}`, ...userData };
      localStorage.setItem("globaleats_users", JSON.stringify([newUser, ...list]));
      return normalizeUser(newUser);
    } else {
      const response = await apiClient.post("/v1/users", userData);
      const rawData = response.data?.data || response.data?.user || response.data;
      return normalizeUser(rawData);
    }
  },

  async updateUserRole(id, role, restaurant) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_users");
      const list = cached ? JSON.parse(cached) : [];
      const updated = list.map((u) => (u.id === id || u._id === id) ? { ...u, role, restaurant: restaurant || u.restaurant } : u);
      localStorage.setItem("globaleats_users", JSON.stringify(updated));
      const found = updated.find((u) => u.id === id || u._id === id);
      return normalizeUser(found);
    } else {
      const body = { role };
      if (restaurant) body.restaurant = restaurant;
      const response = await apiClient.patch(`/v1/users/${id}/role`, body);
      const rawData = response.data?.data || response.data?.user || response.data;
      return normalizeUser(rawData);
    }
  },

  async toggleUserStatus(id, isBlocked) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_users");
      const list = cached ? JSON.parse(cached) : [];
      const updated = list.map((u) => (u.id === id || u._id === id) ? { ...u, isBlocked, status: isBlocked ? "suspended" : "active" } : u);
      localStorage.setItem("globaleats_users", JSON.stringify(updated));
      const found = updated.find((u) => u.id === id || u._id === id);
      return normalizeUser(found);
    } else {
      const response = await apiClient.patch(`/v1/users/${id}/status`, { isBlocked });
      const rawData = response.data?.data || response.data?.user || response.data;
      return normalizeUser(rawData);
    }
  },

  async updateUser(id, updateData) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_users");
      const list = cached ? JSON.parse(cached) : [];
      const updated = list.map((u) => (u.id === id || u._id === id) ? { ...u, ...updateData } : u);
      localStorage.setItem("globaleats_users", JSON.stringify(updated));
      const found = updated.find((u) => u.id === id || u._id === id);
      return normalizeUser(found);
    } else {
      const response = await apiClient.patch(`/v1/users/${id}`, updateData);
      const rawData = response.data?.data || response.data?.user || response.data;
      return normalizeUser(rawData);
    }
  },

  async saveUsers(users) {
    if (USE_MOCK) {
      localStorage.setItem("globaleats_users", JSON.stringify(users));
      return users;
    } else {
      const response = await apiClient.post("/admin/users", { users });
      return response.data;
    }
  },

  // Banners management
  async getBanners() {
    const cached = localStorage.getItem("globaleats_banners");
    return cached ? JSON.parse(cached) : [];
  },

  async saveBanners(banners) {
    localStorage.setItem("globaleats_banners", JSON.stringify(banners));
    return banners;
  },

  // Custom bulk notifications
  async getCustomNotifications() {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_custom_notifications");
      return cached ? JSON.parse(cached) : [];
    } else {
      const response = await apiClient.get("/admin/notifications");
      return response.data;
    }
  },

  async saveCustomNotifications(notifications) {
    if (USE_MOCK) {
      localStorage.setItem("globaleats_custom_notifications", JSON.stringify(notifications));
      return notifications;
    } else {
      const response = await apiClient.post("/admin/notifications", { notifications });
      return response.data;
    }
  },

  // Marketing configurations
  async getMarketingData() {
    if (USE_MOCK) {
      const leads = localStorage.getItem("marketing_leads");
      const settings = localStorage.getItem("marketing_whatsapp_settings");
      const templates = localStorage.getItem("marketing_templates");
      const contacts = localStorage.getItem("marketing_contacts");
      const campaigns = localStorage.getItem("marketing_campaigns");
      const automations = localStorage.getItem("marketing_automations");

      return {
        leads: leads ? JSON.parse(leads) : [],
        whatsappSettings: settings ? JSON.parse(settings) : null,
        templates: templates ? JSON.parse(templates) : [],
        contacts: contacts ? JSON.parse(contacts) : [],
        campaigns: campaigns ? JSON.parse(campaigns) : [],
        automations: automations ? JSON.parse(automations) : [],
      };
    } else {
      const response = await apiClient.get("/admin/marketing");
      return response.data;
    }
  },

  async saveMarketingLeads(leads) {
    if (USE_MOCK) {
      localStorage.setItem("marketing_leads", JSON.stringify(leads));
    } else {
      await apiClient.post("/admin/marketing/leads", { leads });
    }
  },

  async saveMarketingWhatsAppSettings(settings) {
    if (USE_MOCK) {
      localStorage.setItem("marketing_whatsapp_settings", JSON.stringify(settings));
    } else {
      await apiClient.post("/admin/marketing/whatsapp-settings", settings);
    }
  },

  async saveMarketingTemplates(templates) {
    if (USE_MOCK) {
      localStorage.setItem("marketing_templates", JSON.stringify(templates));
    } else {
      await apiClient.post("/admin/marketing/templates", { templates });
    }
  },

  async saveMarketingContacts(contacts) {
    if (USE_MOCK) {
      localStorage.setItem("marketing_contacts", JSON.stringify(contacts));
    } else {
      await apiClient.post("/admin/marketing/contacts", { contacts });
    }
  },

  async saveMarketingCampaigns(campaigns) {
    if (USE_MOCK) {
      localStorage.setItem("marketing_campaigns", JSON.stringify(campaigns));
    } else {
      await apiClient.post("/admin/marketing/campaigns", { campaigns });
    }
  },

  async saveMarketingAutomations(automations) {
    if (USE_MOCK) {
      localStorage.setItem("marketing_automations", JSON.stringify(automations));
    } else {
      await apiClient.post("/admin/marketing/automations", { automations });
    }
  },

  async getMarketingSegments() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const cached = localStorage.getItem("marketing_segments");
      return cached ? JSON.parse(cached) : [];
    } else {
      const response = await apiClient.get("/admin/marketing/segments");
      return response.data;
    }
  },

  async saveMarketingSegments(segments) {
    if (USE_MOCK) {
      localStorage.setItem("marketing_segments", JSON.stringify(segments));
    } else {
      await apiClient.post("/admin/marketing/segments", { segments });
    }
  },

  // Drivers/Couriers management (Riders API integration)
  async getDrivers(queryParams = {}) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_drivers");
      let list = cached ? JSON.parse(cached) : [];
      if (!cached) {
        list = [
          {
            _id: "6a74878c655e9cef0fa7ba0d",
            id: "6a74878c655e9cef0fa7ba0d",
            fullName: "Amit Patel",
            name: "Amit Patel",
            phone: "9988776655",
            rating: 4.9,
            vehicleType: "Honda Activa 6G (EV/Bike)",
            vehicle: "Honda Activa 6G (EV/Bike)",
            licensePlate: "MH 02 CD 4567",
            status: "IDLE",
            totalDeliveries: 12,
          },
          {
            _id: "drv-1",
            id: "drv-1",
            fullName: "Ravi Kumar",
            name: "Ravi Kumar",
            phone: "9876543210",
            rating: 4.8,
            vehicleType: "Yamaha FZ (Motorcycle)",
            vehicle: "Yamaha FZ (Motorcycle)",
            status: "IDLE",
            totalDeliveries: 342,
          },
          {
            _id: "drv-3",
            id: "drv-3",
            fullName: "Suresh Sharma",
            name: "Suresh Sharma",
            phone: "8877665544",
            rating: 4.5,
            vehicleType: "Hero Cycle (Bicycle)",
            vehicle: "Hero Cycle (Bicycle)",
            status: "OFFLINE",
            totalDeliveries: 120,
          },
          {
            _id: "drv-4",
            id: "drv-4",
            fullName: "Priya Nair",
            name: "Priya Nair",
            phone: "7766554433",
            rating: 4.7,
            vehicleType: "Ola Electric Scooter (E-Scooter)",
            vehicle: "Ola Electric Scooter (E-Scooter)",
            status: "IDLE",
            totalDeliveries: 89,
          },
        ];
        localStorage.setItem("globaleats_drivers", JSON.stringify(list));
      }
      if (queryParams && queryParams.status) {
        const targetStatus = queryParams.status.toUpperCase();
        list = list.filter((d) => (d.status || "").toUpperCase() === targetStatus);
      }
      return list;
    } else {
      try {
        const params = {};
        if (queryParams && queryParams.status) params.status = queryParams.status;
        const response = await apiClient.get("/v1/riders", { params });
        const rawPayload = response.data;
        const rawData = rawPayload?.data || rawPayload;
        const list = Array.isArray(rawData) ? rawData : Array.isArray(rawPayload?.riders) ? rawPayload.riders : [];
        return list.map((item) => ({
          _id: item._id || item.id,
          id: item._id || item.id,
          fullName: item.fullName || item.name || "Unnamed Rider",
          name: item.fullName || item.name || "Unnamed Rider",
          phone: item.phone || "",
          rating: item.rating !== undefined ? item.rating : 5.0,
          vehicleType: item.vehicleType || item.vehicle || "Standard Bike",
          vehicle: item.vehicleType || item.vehicle || "Standard Bike",
          licensePlate: item.licensePlate || "",
          status: (item.status || "OFFLINE").toUpperCase(),
          totalDeliveries: item.totalDeliveries || 0,
        }));
      } catch (err) {
        console.warn("getDrivers API call failed, falling back to local storage:", err?.message || err);
        const cached = localStorage.getItem("globaleats_drivers");
        let list = cached ? JSON.parse(cached) : [];
        if (queryParams && queryParams.status) {
          const targetStatus = queryParams.status.toUpperCase();
          list = list.filter((d) => (d.status || "").toUpperCase() === targetStatus);
        }
        return list;
      }
    }
  },

  async onboardCourier(riderData) {
    const payload = {
      fullName: String(riderData.fullName || riderData.name || "").trim(),
      phone: String(riderData.phone || "").replace(/\D/g, "").slice(-10),
      vehicleType: String(riderData.vehicleType || riderData.vehicle || "Honda Activa 6G (EV/Bike)").trim(),
      licensePlate: String(riderData.licensePlate || "").trim(),
    };

    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const cached = localStorage.getItem("globaleats_drivers");
      const list = cached ? JSON.parse(cached) : [];
      const newRider = {
        _id: `rider-${Date.now()}`,
        id: `rider-${Date.now()}`,
        ...payload,
        name: payload.fullName,
        vehicle: payload.vehicleType,
        rating: 5.0,
        status: "OFFLINE",
        totalDeliveries: 0,
        createdAt: new Date().toISOString(),
      };
      const updated = [newRider, ...list];
      localStorage.setItem("globaleats_drivers", JSON.stringify(updated));
      return { success: true, message: "Courier onboarded successfully", data: newRider };
    } else {
      try {
        const response = await apiClient.post("/v1/riders", payload);
        const resData = response.data;
        const created = resData?.data || resData;
        const normalized = {
          _id: created._id || created.id,
          id: created._id || created.id,
          fullName: created.fullName || payload.fullName,
          name: created.fullName || payload.fullName,
          phone: created.phone || payload.phone,
          rating: created.rating || 5.0,
          vehicleType: created.vehicleType || payload.vehicleType,
          vehicle: created.vehicleType || payload.vehicleType,
          licensePlate: created.licensePlate || payload.licensePlate,
          status: (created.status || "OFFLINE").toUpperCase(),
          totalDeliveries: created.totalDeliveries || 0,
        };
        const cached = localStorage.getItem("globaleats_drivers");
        const list = cached ? JSON.parse(cached) : [];
        localStorage.setItem("globaleats_drivers", JSON.stringify([normalized, ...list]));
        return { success: true, message: resData?.message || "Courier onboarded successfully", data: normalized };
      } catch (err) {
        console.warn("onboardCourier API failed, saving locally:", err?.message || err);
        const cached = localStorage.getItem("globaleats_drivers");
        const list = cached ? JSON.parse(cached) : [];
        const fallbackRider = {
          _id: `rider-${Date.now()}`,
          id: `rider-${Date.now()}`,
          ...payload,
          name: payload.fullName,
          vehicle: payload.vehicleType,
          rating: 5.0,
          status: "OFFLINE",
          totalDeliveries: 0,
        };
        localStorage.setItem("globaleats_drivers", JSON.stringify([fallbackRider, ...list]));
        return { success: true, message: "Courier onboarded locally", data: fallbackRider };
      }
    }
  },

  async updateRiderStatus(id, status) {
    const uppercaseStatus = String(status || "OFFLINE").toUpperCase();
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_drivers");
      const list = cached ? JSON.parse(cached) : [];
      const updated = list.map((d) =>
        d._id === id || d.id === id ? { ...d, status: uppercaseStatus } : d
      );
      localStorage.setItem("globaleats_drivers", JSON.stringify(updated));
      const target = updated.find((d) => d._id === id || d.id === id);
      return { success: true, message: "Rider status updated", data: target };
    } else {
      try {
        const response = await apiClient.patch(`/v1/riders/${id}/status`, { status: uppercaseStatus });
        const resData = response.data;
        const cached = localStorage.getItem("globaleats_drivers");
        if (cached) {
          const list = JSON.parse(cached);
          const updated = list.map((d) =>
            d._id === id || d.id === id ? { ...d, status: uppercaseStatus } : d
          );
          localStorage.setItem("globaleats_drivers", JSON.stringify(updated));
        }
        return resData;
      } catch (err) {
        console.warn("updateRiderStatus API failed, updating local storage:", err?.message || err);
        const cached = localStorage.getItem("globaleats_drivers");
        const list = cached ? JSON.parse(cached) : [];
        const updated = list.map((d) =>
          d._id === id || d.id === id ? { ...d, status: uppercaseStatus } : d
        );
        localStorage.setItem("globaleats_drivers", JSON.stringify(updated));
        return { success: true, message: "Rider status updated locally" };
      }
    }
  },

  async deleteRider(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_drivers");
      const list = cached ? JSON.parse(cached) : [];
      const filtered = list.filter((d) => d._id !== id && d.id !== id);
      localStorage.setItem("globaleats_drivers", JSON.stringify(filtered));
      return { success: true, message: "Courier deleted successfully", data: {} };
    } else {
      try {
        const response = await apiClient.delete(`/v1/riders/${id}`);
        const cached = localStorage.getItem("globaleats_drivers");
        if (cached) {
          const list = JSON.parse(cached);
          const filtered = list.filter((d) => d._id !== id && d.id !== id);
          localStorage.setItem("globaleats_drivers", JSON.stringify(filtered));
        }
        return response.data;
      } catch (err) {
        console.warn("deleteRider API failed, removing locally:", err?.message || err);
        const cached = localStorage.getItem("globaleats_drivers");
        const list = cached ? JSON.parse(cached) : [];
        const filtered = list.filter((d) => d._id !== id && d.id !== id);
        localStorage.setItem("globaleats_drivers", JSON.stringify(filtered));
        return { success: true, message: "Courier deleted locally", data: {} };
      }
    }
  },

  async dispatchOrderWithRider(orderId, riderId, deliveryRemarks = "Deliver carefully to the front door") {
    const cleanId = String(orderId || "").replace(/^GE-/, "");
    const payload = {
      riderId,
      deliveryRemarks,
    };

    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (riderId) {
        await this.updateRiderStatus(riderId, "DELIVERING");
      }
      return { success: true, message: "Order dispatched with rider successfully" };
    } else {
      try {
        const response = await apiClient.patch(`/v1/orders/${cleanId}/dispatch`, payload);
        if (riderId) {
          await this.updateRiderStatus(riderId, "DELIVERING");
        }
        return response.data;
      } catch (err) {
        console.warn("dispatchOrderWithRider API failed:", err?.message || err);
        throw err;
      }
    }
  },

  async saveDrivers(drivers) {
    if (USE_MOCK) {
      localStorage.setItem("globaleats_drivers", JSON.stringify(drivers));
      return drivers;
    } else {
      try {
        const response = await apiClient.post("/admin/drivers", { drivers });
        localStorage.setItem("globaleats_drivers", JSON.stringify(drivers));
        return response.data;
      } catch (err) {
        localStorage.setItem("globaleats_drivers", JSON.stringify(drivers));
        return drivers;
      }
    }
  },

  // Marketing leads timeline
  async getMarketingLeadsTimeline() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const cached = localStorage.getItem("marketing_leads_timeline");
      if (cached) return JSON.parse(cached);
      const defaultTimeline = {
        "lead_1": [
          { time: "2026-06-20 11:30", action: "Lead Created", note: "Corporate bento lead created via web inquiry." },
          { time: "2026-06-21 14:00", action: "Phone Call Logged", note: "Spoke with Mr. Suhail. Discussed catering scale. He wants strict organic ingredients and vegan alternatives. Premium boxes requested." },
          { time: "2026-06-25 09:15", action: "WhatsApp Contact", note: "Sent corporate menu booklet. He confirmed they are reviewing." }
        ],
        "lead_2": [
          { time: "2026-06-22 10:00", action: "Lead Created", note: "Fatima Al Qasimi submitted party birthday party inquiry for 80 guests." },
          { time: "2026-06-23 16:30", action: "Email Sent", note: "Sent detailed customized proposal with live dessert jars and slider bars costing ₹ 8,200." },
          { time: "2026-06-26 11:00", action: "Follow-up Call", note: "She loved the dessert station idea. Checking budget clearance with finance." }
        ],
        "lead_3": [
          { time: "2026-06-24 12:00", action: "Lead Created", note: "Marcus Vance of Eat Hospitality requested virtual franchise licensing info." },
          { time: "2026-06-24 15:30", action: "Intro Call Logged", note: "Initial vetting complete. Marcus has significant food franchise experience. Very interested in Riyadh cloud kitchen hubs." }
        ],
        "lead_5": [
          { time: "2026-06-18 09:00", action: "Lead Created", note: "Tech meetup event catering inquiry." },
          { time: "2026-06-20 11:00", action: "Proposal Sent", note: "Proposal for recurring weekly burger slider stations sent." },
          { time: "2026-06-24 14:00", action: "Negotiation", note: "Agreed on 10% discount for long term commitment." },
          { time: "2026-06-26 21:00", action: "Won & Delivered", note: "First batch delivered successfully. Client sent amazing review. Closed as Won." }
        ],
        "lead_6": [
          { time: "2026-06-10 10:00", action: "Lead Created", note: "Dxb Wedding catering query." },
          { time: "2026-06-15 15:00", action: "Lost Lead", note: "Lost due to pricing clash. They wanted live buffet setup, but our virtual kitchens specialize in live stations or bento deliveries." }
        ]
      };
      localStorage.setItem("marketing_leads_timeline", JSON.stringify(defaultTimeline));
      return defaultTimeline;
    } else {
      const response = await apiClient.get("/admin/marketing/leads-timeline");
      return response.data;
    }
  },

  async saveMarketingLeadsTimeline(timeline) {
    if (USE_MOCK) {
      localStorage.setItem("marketing_leads_timeline", JSON.stringify(timeline));
      return timeline;
    } else {
      const response = await apiClient.post("/admin/marketing/leads-timeline", { timeline });
      return response.data;
    }
  },

  async addRestaurant(restaurantData) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return {
        success: true,
        data: restaurantData
      };
    } else {
      const response = await apiClient.post("/v1/restaurants", restaurantData);
      return response.data;
    }
  },

  async getAdminRestaurants(queryParams = {}) {
    let params = {};
    if (queryParams?.page) params.page = queryParams.page;
    if (queryParams?.limit) params.limit = queryParams.limit;

    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_restaurants");
      const list = cached ? JSON.parse(cached) : [];
      const normalized = list.map(normalizeRestaurant);
      const page = Number(params.page);
      const limit = Number(params.limit);

      if (page || limit || queryParams?.returnPagination) {
        const p = page || 1;
        const l = limit || 10;
        const total = normalized.length;
        const totalPages = Math.ceil(total / l) || 1;
        const start = (p - 1) * l;
        const sliced = normalized.slice(start, start + l);

        const paginationObj = { total, page: p, limit: l, totalPages };
        sliced.pagination = paginationObj;

        if (queryParams?.returnPagination) {
          return { restaurants: sliced, pagination: paginationObj };
        }
        return sliced;
      }
      return normalized;
    } else {
      try {
        const response = await apiClient.get("/v1/restaurants", { params });
        const resPayload = response.data;
        const resData = resPayload?.data || resPayload;

        let list = [];
        let pagination = null;

        if (Array.isArray(resData)) {
          list = resData;
        } else if (resData && typeof resData === "object") {
          list = Array.isArray(resData.restaurants) ? resData.restaurants : [];
          pagination = resData.pagination || null;
        } else if (Array.isArray(resPayload?.restaurants)) {
          list = resPayload.restaurants;
          pagination = resPayload.pagination || null;
        }

        const normalized = list.map(normalizeRestaurant).filter(Boolean);
        if (pagination) {
          normalized.pagination = pagination;
        }

        if (queryParams?.returnPagination) {
          return {
            restaurants: normalized,
            pagination: pagination || {
              total: normalized.length,
              page: Number(params.page) || 1,
              limit: Number(params.limit) || 10,
              totalPages: Math.ceil(normalized.length / (Number(params.limit) || 10)) || 1,
            },
          };
        }

        return normalized;
      } catch (err) {
        console.warn("getAdminRestaurants API error:", err?.message || err);
        return queryParams?.returnPagination
          ? { restaurants: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } }
          : [];
      }
    }
  },

  async getDispatchBoard(queryParams = {}) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_orders");
      const list = cached ? JSON.parse(cached) : [];
      const normalizedList = Array.isArray(list) ? list.map(normalizeOrder).filter(Boolean) : [];
      if (queryParams?.returnFullPayload) {
        return {
          stats: {
            totalOrders: normalizedList.length,
            received: normalizedList.filter(o => o.status === "received" || o.status === "pending").length,
            accepted: normalizedList.filter(o => o.status === "accepted" || o.status === "confirmed").length,
            preparing: normalizedList.filter(o => o.status === "preparing").length,
            dispatched: normalizedList.filter(o => o.status === "dispatched" || o.status === "out_for_delivery").length,
            delivered: normalizedList.filter(o => o.status === "delivered").length,
            rejected: normalizedList.filter(o => o.status === "rejected").length,
          },
          orders: normalizedList,
          pagination: {
            total: normalizedList.length,
            page: Number(queryParams.page) || 1,
            limit: Number(queryParams.limit) || 10,
            totalPages: Math.ceil(normalizedList.length / (Number(queryParams.limit) || 10)) || 1
          }
        };
      }
      return normalizedList;
    } else {
      try {
        const response = await apiClient.get("/v1/admin/dispatch", { params: queryParams });
        const payload = response.data;
        const resData = payload?.data || payload;

        let rawOrders = [];
        let stats = null;
        let pagination = null;

        if (Array.isArray(resData)) {
          rawOrders = resData;
        } else if (resData && typeof resData === "object") {
          rawOrders = Array.isArray(resData.orders) ? resData.orders : [];
          stats = resData.stats || null;
          pagination = resData.pagination || null;
        } else if (Array.isArray(payload?.orders)) {
          rawOrders = payload.orders;
          stats = payload.stats || null;
          pagination = payload.pagination || null;
        }

        const normalizedOrders = rawOrders.map(normalizeOrder).filter(Boolean);

        if (queryParams?.returnFullPayload) {
          return {
            stats: stats || {},
            orders: normalizedOrders,
            pagination: pagination || {
              total: normalizedOrders.length,
              page: Number(queryParams.page) || 1,
              limit: Number(queryParams.limit) || 10,
              totalPages: 1
            }
          };
        }

        if (stats || pagination) {
          normalizedOrders.stats = stats;
          normalizedOrders.pagination = pagination;
        }

        return normalizedOrders;
      } catch (err) {
        try {
          const fallbackRes = await apiClient.get("/v1/orders/manager/incoming");
          const raw = fallbackRes.data?.data || fallbackRes.data?.orders || fallbackRes.data;
          const normalized = Array.isArray(raw) ? raw.map(normalizeOrder).filter(Boolean) : [];
          return queryParams?.returnFullPayload ? { stats: {}, orders: normalized, pagination: null } : normalized;
        } catch (fbErr) {
          console.warn("Fallback incoming orders also failed:", fbErr?.message || fbErr);
          return queryParams?.returnFullPayload ? { stats: {}, orders: [], pagination: null } : [];
        }
      }
    }
  },

  async dispatchOrderWithRider(orderId, courierId, remarks = "") {
    try {
      return await managerService.dispatchOrder(orderId, {
        driverName: courierId,
        deliveryRemarks: remarks,
      });
    } catch (e) {
      console.warn("dispatchOrderWithRider fallback:", e);
      return { success: true };
    }
  },

  async getRestaurantDropdownList() {
    return this.getAdminRestaurants();
  },

  async getFullBIDashboardData(restaurantId) {
    if (USE_MOCK) {
      const cachedOrders = localStorage.getItem("globaleats_orders");
      const orders = cachedOrders ? JSON.parse(cachedOrders) : [];
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      return {
        success: true,
        data: {
          totalRevenue,
          totalOrders: orders.length,
          avgOrderValue: orders.length ? totalRevenue / orders.length : 0,
          orders,
        },
      };
    } else {
      try {
        const params = restaurantId && restaurantId !== "all" ? { restaurant: restaurantId } : {};
        const response = await apiClient.get("/v1/dashboard/stats", { params });
        return response.data?.data || response.data;
      } catch (err) {
        console.warn("getFullBIDashboardData error:", err?.message || err);
        return { totalRevenue: 0, totalOrders: 0, orders: [] };
      }
    }
  },

  async exportToCsv(restaurantId) {
    if (!USE_MOCK) {
      try {
        const params = restaurantId && restaurantId !== "all" ? { restaurant: restaurantId } : {};
        const response = await apiClient.get("/v1/dashboard/export", { params, responseType: "blob" });
        const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `BI_Report_${restaurantId || "all"}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true };
      } catch (err) {
        console.warn("exportToCsv failed:", err);
      }
    }
    return { success: true };
  },

  async getRestaurant(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_restaurants");
      const list = cached ? JSON.parse(cached) : [];
      const found = list.find((r) => String(r.id) === String(id) || String(r._id) === String(id));
      return found ? { success: true, data: normalizeRestaurant(found) } : { success: false, message: "Not found" };
    } else {
      const response = await apiClient.get(`/v1/restaurants/${id}`);
      const rawData = response.data?.data || response.data?.restaurant || response.data;
      return {
        success: true,
        data: normalizeRestaurant(rawData)
      };
    }
  },

  async updateRestaurant(id, restaurantData) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return {
        success: true,
        data: restaurantData
      };
    } else {
      const response = await apiClient.patch(`/v1/restaurants/${id}`, restaurantData);
      return response.data;
    }
  },

  // Menu items/Recipes management
  async getAllMenu() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_restaurants");
      const list = cached ? JSON.parse(cached) : [];
      const allDishes = [];
      list.forEach((res) => {
        (res.menu || []).forEach((dish) => {
          allDishes.push({
            ...dish,
            restaurant: res.id || res._id
          });
        });
      });
      return allDishes;
    } else {
      const response = await apiClient.get("/v1/menu");
      return response.data;
    }
  },

  async getMenuById(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const cached = localStorage.getItem("globaleats_restaurants");
      const list = cached ? JSON.parse(cached) : [];
      for (const res of list) {
        const found = (res.menu || []).find((d) => d.id === id || d._id === id);
        if (found) return found;
      }
      return null;
    } else {
      const response = await apiClient.get(`/v1/menu/${id}`);
      return response.data;
    }
  },

  async getMenuByRestaurantId(restaurantId) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_restaurants");
      const list = cached ? JSON.parse(cached) : [];
      const foundRes = list.find((r) => r.id === restaurantId || r._id === restaurantId);
      return foundRes ? (foundRes.menu || []) : [];
    } else {
      const response = await apiClient.get(`/v1/menu/restaurant/${restaurantId}`);
      return response.data;
    }
  },

  async getMenuFiltered(restaurantId, brandId) {
    if (USE_MOCK) {
      return this.getAllMenu();
    } else {
      const params = {};
      if (restaurantId) params.restaurant = restaurantId;
      if (brandId) params.brand = brandId;
      const response = await apiClient.get("/v1/menu", { params });
      return response.data?.data || response.data;
    }
  },

  async createMenu(menuData) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return { success: true, data: menuData };
    } else {
      const response = await apiClient.post("/v1/menu", menuData);
      return response.data;
    }
  },

  async updateMenu(id, menuData) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { success: true, data: menuData };
    } else {
      const response = await apiClient.patch(`/v1/menu/${id}`, menuData);
      return response.data;
    }
  },

  async toggleAvailability(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { success: true };
    } else {
      const response = await apiClient.patch(`/v1/menu/${id}/toggle-availability`, {});
      return response.data;
    }
  },

  async deleteMenu(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { success: true };
    } else {
      const response = await apiClient.delete(`/v1/menu/${id}`);
      return response.data;
    }
  },

  // Coupons management
  async getAllCoupons() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_coupons");
      const list = cached ? JSON.parse(cached) : [];
      return list.map(normalizeCoupon).filter(Boolean);
    } else {
      try {
        let response;
        try {
          response = await apiClient.get("/v1/coupons/all");
        } catch {
          try {
            response = await apiClient.get("/v1/coupons");
          } catch {
            response = await apiClient.get("/v1/coupons/active");
          }
        }
        const resPayload = response.data;
        const resData = resPayload?.data || resPayload;
        let list = [];
        if (Array.isArray(resData)) {
          list = resData;
        } else if (resData && typeof resData === "object") {
          list = Array.isArray(resData.coupons) ? resData.coupons : Array.isArray(resData.data) ? resData.data : [];
        } else if (Array.isArray(resPayload?.coupons)) {
          list = resPayload.coupons;
        }
        return list.map(normalizeCoupon).filter(Boolean);
      } catch (err) {
        console.warn("getAllCoupons API error, fallback to local storage:", err?.message || err);
        const cached = localStorage.getItem("globaleats_coupons");
        const list = cached ? JSON.parse(cached) : [];
        return list.map(normalizeCoupon).filter(Boolean);
      }
    }
  },

  async createCoupon(couponData) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const cached = localStorage.getItem("globaleats_coupons");
      const list = cached ? JSON.parse(cached) : [];
      let newObj = {};
      if (couponData instanceof FormData) {
        couponData.forEach((val, key) => {
          if (key !== "image") newObj[key] = val;
        });
        newObj.image = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600";
      } else {
        newObj = { ...couponData };
      }
      const newCoupon = { _id: `coupon-${Date.now()}`, ...newObj };
      localStorage.setItem("globaleats_coupons", JSON.stringify([newCoupon, ...list]));
      return normalizeCoupon(newCoupon);
    } else {
      let payload = couponData;
      let headers = {};
      if (couponData instanceof FormData) {
        payload = couponData;
        headers = { "Content-Type": "multipart/form-data" };
      } else if (couponData.imageFile) {
        const formData = new FormData();
        Object.keys(couponData).forEach((key) => {
          if (key === "imageFile") {
            if (couponData.imageFile) formData.append("image", couponData.imageFile);
          } else if (couponData[key] !== undefined && couponData[key] !== null) {
            formData.append(key, couponData[key]);
          }
        });
        payload = formData;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        validateCouponData(couponData);
      }

      const response = await apiClient.post("/v1/coupons", payload, { headers });
      const rawData = response.data?.data || response.data;
      return normalizeCoupon(rawData);
    }
  },

  async getCouponById(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_coupons");
      const list = cached ? JSON.parse(cached) : [];
      const found = list.find(c => c._id === id || c.id === id);
      return found ? normalizeCoupon(found) : null;
    } else {
      const response = await apiClient.get(`/v1/coupons/${id}`);
      const rawData = response.data?.data || response.data;
      return normalizeCoupon(rawData);
    }
  },

  async updateCoupon(id, couponData) {
    if (couponData.code !== undefined && (typeof couponData.code !== "string" || !couponData.code.trim())) {
      throw new Error("Coupon code must be a non-empty string");
    }
    if (couponData.discountValue !== undefined && (isNaN(Number(couponData.discountValue)) || Number(couponData.discountValue) < 0)) {
      throw new Error("Coupon discountValue must be a non-negative number");
    }
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_coupons");
      const list = cached ? JSON.parse(cached) : [];
      const updated = list.map(c => (c._id === id || c.id === id) ? { ...c, ...couponData } : c);
      localStorage.setItem("globaleats_coupons", JSON.stringify(updated));
      const found = updated.find(c => c._id === id || c.id === id);
      return normalizeCoupon(found);
    } else {
      const response = await apiClient.patch(`/v1/coupons/${id}`, couponData);
      const rawData = response.data?.data || response.data;
      return normalizeCoupon(rawData);
    }
  },

  async deleteCoupon(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_coupons");
      const list = cached ? JSON.parse(cached) : [];
      const updated = list.filter(c => c._id !== id && c.id !== id);
      localStorage.setItem("globaleats_coupons", JSON.stringify(updated));
      return { success: true };
    } else {
      const response = await apiClient.delete(`/v1/coupons/${id}`);
      return response.data;
    }
  },

  // Admin Dashboard / Restaurant Analytics
  async getAdminDashboard() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return null;
    } else {
      const response = await apiClient.get("/v1/admin/dashboard");
      return response.data?.data || response.data;
    }
  },

  async getAdminKitchenAnalysis() {
    return this.getAdminDashboard();
  },

  async getFullBIDashboardData(restaurantId = "") {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return null;
    } else {
      const params = {};
      if (restaurantId && restaurantId !== "all") {
        params.restaurantId = restaurantId;
        params.restaurant = restaurantId;
      }
      try {
        const response = await apiClient.get("/v1/bi/dashboard", { params });
        return response.data?.data || response.data;
      } catch (err) {
        console.warn("getFullBIDashboardData /v1/bi/dashboard error, trying /v1/dashboard/stats:", err?.message || err);
        const response = await apiClient.get("/v1/dashboard/stats", { params });
        return response.data?.data || response.data;
      }
    }
  },

  async getRestaurantDropdownList() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return [];
    } else {
      const response = await apiClient.get("/v1/bi/restaurants");
      return response.data?.data || response.data || [];
    }
  },

  async exportToCsv(restaurantId = "") {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return "Date,Sales,Orders\n2026-07-27,0,0\n";
    } else {
      const params = {};
      if (restaurantId && restaurantId !== "all") {
        params.restaurantId = restaurantId;
      }
      const response = await apiClient.get("/v1/bi/export", {
        params,
        responseType: "text",
      });
      return response.data;
    }
  },


  async getAdminRestaurantsAlias(queryParams = {}) {
    return this.getAdminRestaurants(queryParams);
  },

  // WhatsApp Marketing & Console APIs (8 Endpoints Integration)
  async syncWhatsAppCredentials() {
    if (!USE_MOCK) {
      const response = await apiClient.post("/v1/admin/whatsapp/sync");
      return response.data?.data || response.data;
    }
    try {
      const response = await apiClient.post("/v1/admin/whatsapp/sync");
      return response.data?.data || response.data || { success: true, status: "connected" };
    } catch (err) {
      console.warn("syncWhatsAppCredentials API call failed, using fallback:", err?.message || err);
      return { success: true, status: "connected", syncedAt: new Date().toISOString() };
    }
  },

  async getWhatsAppDashboardStats() {
    if (!USE_MOCK) {
      const response = await apiClient.get("/v1/admin/whatsapp/dashboard");
      return response.data?.data || response.data;
    }
    try {
      const response = await apiClient.get("/v1/admin/whatsapp/dashboard");
      return response.data?.data || response.data;
    } catch (err) {
      console.warn("getWhatsAppDashboardStats API call failed, using fallback:", err?.message || err);
      return null;
    }
  },

  async getWhatsAppTemplates() {
    if (!USE_MOCK) {
      const response = await apiClient.get("/v1/admin/whatsapp/templates");
      const raw = response.data?.data || response.data?.templates || response.data;
      return Array.isArray(raw) ? raw : [];
    }
    try {
      const response = await apiClient.get("/v1/admin/whatsapp/templates");
      const raw = response.data?.data || response.data?.templates || response.data;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw;
      }
    } catch (err) {
      console.warn("getWhatsAppTemplates API call failed, using fallback:", err?.message || err);
    }
    return null;
  },

  async getWhatsAppTemplateByName(templateName) {
    if (!USE_MOCK) {
      const response = await apiClient.get(`/v1/admin/whatsapp/templates/${encodeURIComponent(templateName)}`);
      return response.data?.data || response.data;
    }
    try {
      const response = await apiClient.get(`/v1/admin/whatsapp/templates/${encodeURIComponent(templateName)}`);
      return response.data?.data || response.data;
    } catch (err) {
      console.warn("getWhatsAppTemplateByName API call failed, using fallback:", err?.message || err);
      return null;
    }
  },

  async sendWhatsAppTemplate(payload) {
    const cleanPayload = {
      phone: String(payload.phone || "").trim(),
      template: String(payload.template || "").trim(),
      variables: payload.variables && typeof payload.variables === "object" ? payload.variables : {},
    };

    if (!USE_MOCK) {
      const response = await apiClient.post("/v1/admin/whatsapp/send-template", cleanPayload);
      return response.data?.data || response.data;
    }
    try {
      const response = await apiClient.post("/v1/admin/whatsapp/send-template", cleanPayload);
      return response.data?.data || response.data || { success: true, messageId: `msg_${Date.now()}` };
    } catch (err) {
      console.warn("sendWhatsAppTemplate API call failed, using fallback:", err?.message || err);
      return { success: true, messageId: `msg_${Date.now()}`, mock: true };
    }
  },

  async getWhatsAppLogs() {
    if (!USE_MOCK) {
      const response = await apiClient.get("/v1/admin/whatsapp/logs");
      const raw = response.data?.data || response.data?.logs || response.data;
      return Array.isArray(raw) ? raw : [];
    }
    try {
      const response = await apiClient.get("/v1/admin/whatsapp/logs");
      const raw = response.data?.data || response.data?.logs || response.data;
      if (Array.isArray(raw)) {
        return raw;
      }
    } catch (err) {
      console.warn("getWhatsAppLogs API call failed, using fallback:", err?.message || err);
    }
    return null;
  },

  async clearWhatsAppLogs() {
    if (!USE_MOCK) {
      const response = await apiClient.delete("/v1/admin/whatsapp/logs");
      return response.data?.data || response.data;
    }
    try {
      const response = await apiClient.delete("/v1/admin/whatsapp/logs");
      return response.data?.data || response.data || { success: true };
    } catch (err) {
      console.warn("clearWhatsAppLogs API call failed, using fallback:", err?.message || err);
      return { success: true };
    }
  },

  async verifyWhatsAppWebhook(payload = {}) {
    if (!USE_MOCK) {
      const response = await apiClient.post("/v1/webhooks/whatsapp", payload);
      return response.data?.data || response.data;
    }
    try {
      const response = await apiClient.post("/v1/webhooks/whatsapp", payload);
      return response.data?.data || response.data || { status: "verified", message: "Webhook handle verified successfully." };
    } catch (err) {
      console.warn("verifyWhatsAppWebhook API call failed, using fallback:", err?.message || err);
      return { status: "verified", message: "Webhook challenge verified." };
    }
  }
};
