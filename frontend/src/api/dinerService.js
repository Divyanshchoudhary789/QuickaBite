// src/api/dinerService.js
import apiClient from "./apiClient";
import { RESTAURANTS, REELS } from "../data";
import { notificationService } from "./notificationService";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const dinerService = {
  // Fetch deliverable restaurant catalog (GET /api/v1/restaurants?lat=...&lng=...)
  async getRestaurants(locationCoords = null) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return RESTAURANTS.map(normalizeRestaurant);
    } else {
      const params = {};
      if (locationCoords?.lat && locationCoords?.lng) {
        params.lat = locationCoords.lat;
        params.lng = locationCoords.lng;
      }
      const response = await apiClient.get("/v1/restaurants", { params });
      let list = [];
      if (Array.isArray(response.data)) {
        list = response.data;
      } else if (Array.isArray(response.data?.data)) {
        list = response.data.data;
      } else if (Array.isArray(response.data?.restaurants)) {
        list = response.data.restaurants;
      }
      return list.map(normalizeRestaurant);
    }
  },

  // Fetch deliverable menu items / dishes (GET /api/v1/menu?lat=...&lng=...&category=...&isVegetarian=...&search=...&brand=...)
  async getMenuItems(locationCoords = null, filters = {}) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      let list = [];
      RESTAURANTS.forEach((r) => {
        if (Array.isArray(r.menu)) {
          r.menu.forEach((m) => {
            list.push({ ...m, restaurant: r });
          });
        }
      });
      return list.map(normalizeMenuItem);
    } else {
      const params = {};
      if (locationCoords?.lat && locationCoords?.lng) {
        params.lat = locationCoords.lat;
        params.lng = locationCoords.lng;
      }
      if (filters.category && filters.category !== "all") {
        params.category = filters.category;
      }
      if (filters.isVegetarian !== undefined && filters.isVegetarian !== null) {
        params.isVegetarian = filters.isVegetarian;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.brand) {
        params.brand = filters.brand;
      }
      if (filters.restaurant) {
        params.restaurant = filters.restaurant;
      }
      const response = await apiClient.get("/v1/menu", { params });
      let list = [];
      if (Array.isArray(response.data)) {
        list = response.data;
      } else if (Array.isArray(response.data?.data)) {
        list = response.data.data;
      } else if (Array.isArray(response.data?.items)) {
        list = response.data.items;
      }
      return list.map(normalizeMenuItem);
    }
  },

  async getAllMenu(locationCoords = null, filters = {}) {
    return this.getMenuItems(locationCoords, filters);
  },

  // Fetch restaurant details by ID (GET /api/v1/restaurants/:id)
  async getRestaurantById(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_restaurants");
      const list = cached ? JSON.parse(cached) : RESTAURANTS;
      const found = list.find((r) => String(r.id) === String(id) || String(r._id) === String(id));
      return found ? normalizeRestaurant(found) : null;
    } else {
      const response = await apiClient.get(`/v1/restaurants/${id}`);
      const raw = response.data?.data || response.data?.restaurant || response.data;
      return normalizeRestaurant(raw);
    }
  },

  // Update restaurant details (admin additions, menus, rating, radius checks)
  async updateRestaurant(updatedList) {
    if (USE_MOCK) {
      // Sync live array reference
      RESTAURANTS.length = 0;
      RESTAURANTS.push(...updatedList);
      localStorage.setItem("globaleats_restaurants", JSON.stringify(updatedList));
      return updatedList;
    } else {
      const response = await apiClient.put("/diner/restaurants", updatedList);
      return response.data;
    }
  },

  // --- FAVORITE RESTAURANTS APIs ---
  async addFavoriteRestaurant(restaurantId) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_favorites_restaurants");
      const list = cached ? JSON.parse(cached) : [];
      if (!list.includes(restaurantId)) list.push(restaurantId);
      localStorage.setItem("globaleats_favorites_restaurants", JSON.stringify(list));
      return { success: true, data: list };
    } else {
      try {
        const response = await apiClient.post("/v1/favorites/restaurants", { restaurant: restaurantId });
        return response.data;
      } catch (err) {
        console.error("addFavoriteRestaurant error:", err);
        const cached = localStorage.getItem("globaleats_favorites_restaurants");
        const list = cached ? JSON.parse(cached) : [];
        if (!list.includes(restaurantId)) list.push(restaurantId);
        localStorage.setItem("globaleats_favorites_restaurants", JSON.stringify(list));
        return { success: true, data: list };
      }
    }
  },

  async getFavoriteRestaurants() {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_favorites_restaurants");
      return cached ? JSON.parse(cached) : [];
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) {
        const cached = localStorage.getItem("globaleats_favorites_restaurants");
        return cached ? JSON.parse(cached) : [];
      }
      try {
        const response = await apiClient.get("/v1/favorites/restaurants");
        return response.data;
      } catch (err) {
        console.error("getFavoriteRestaurants error:", err);
        const cached = localStorage.getItem("globaleats_favorites_restaurants");
        return cached ? JSON.parse(cached) : [];
      }
    }
  },

  async getFavoriteRestaurantStatus() {
    return this.getFavoriteRestaurants();
  },

  async checkFavoriteRestaurant(restaurantId) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_favorites_restaurants");
      const list = cached ? JSON.parse(cached) : [];
      return { isFavorite: list.includes(restaurantId) };
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) {
        const cached = localStorage.getItem("globaleats_favorites_restaurants");
        const list = cached ? JSON.parse(cached) : [];
        return { isFavorite: list.includes(restaurantId) };
      }
      try {
        const response = await apiClient.get(`/v1/favorites/restaurants/${restaurantId}/status`);
        return response.data;
      } catch (err) {
        console.error("checkFavoriteRestaurant error:", err);
        const cached = localStorage.getItem("globaleats_favorites_restaurants");
        const list = cached ? JSON.parse(cached) : [];
        return { isFavorite: list.includes(restaurantId) };
      }
    }
  },

  async removeFavoriteRestaurant(restaurantId) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_favorites_restaurants");
      let list = cached ? JSON.parse(cached) : [];
      list = list.filter((id) => id !== restaurantId);
      localStorage.setItem("globaleats_favorites_restaurants", JSON.stringify(list));
      return { success: true, data: list };
    } else {
      try {
        const response = await apiClient.delete(`/v1/favorites/restaurants/${restaurantId}`);
        return response.data;
      } catch (err) {
        console.error("removeFavoriteRestaurant error:", err);
        const cached = localStorage.getItem("globaleats_favorites_restaurants");
        let list = cached ? JSON.parse(cached) : [];
        list = list.filter((id) => id !== restaurantId);
        localStorage.setItem("globaleats_favorites_restaurants", JSON.stringify(list));
        return { success: true, data: list };
      }
    }
  },

  // Legacy wrappers for backward compatibility
  async getFavorites() {
    return this.getFavoriteRestaurants();
  },

  async saveFavorites(favorites) {
    if (USE_MOCK) {
      localStorage.setItem("globaleats_favorites_restaurants", JSON.stringify(favorites));
    }
  },

  // --- FAVORITE MENU APIs ---
  async addFavoriteMenu(menuId) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_favorites_dishes");
      const list = cached ? JSON.parse(cached) : [];
      if (!list.includes(menuId)) list.push(menuId);
      localStorage.setItem("globaleats_favorites_dishes", JSON.stringify(list));
      return { success: true, data: list };
    } else {
      try {
        const response = await apiClient.post("/v1/favorites/menu", { menu: menuId });
        return response.data;
      } catch (err) {
        console.error("addFavoriteMenu error:", err);
        const cached = localStorage.getItem("globaleats_favorites_dishes");
        const list = cached ? JSON.parse(cached) : [];
        if (!list.includes(menuId)) list.push(menuId);
        localStorage.setItem("globaleats_favorites_dishes", JSON.stringify(list));
        return { success: true, data: list };
      }
    }
  },

  async getFavoriteMenu() {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_favorites_dishes");
      return cached ? JSON.parse(cached) : [];
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) {
        const cached = localStorage.getItem("globaleats_favorites_dishes");
        return cached ? JSON.parse(cached) : [];
      }
      try {
        const response = await apiClient.get("/v1/favorites/menu");
        return response.data;
      } catch (err) {
        console.error("getFavoriteMenu error:", err);
        const cached = localStorage.getItem("globaleats_favorites_dishes");
        return cached ? JSON.parse(cached) : [];
      }
    }
  },

  async checkFavoriteMenuStatus(menuId) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_favorites_dishes");
      const list = cached ? JSON.parse(cached) : [];
      return { isFavorite: list.includes(menuId) };
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) {
        const cached = localStorage.getItem("globaleats_favorites_dishes");
        const list = cached ? JSON.parse(cached) : [];
        return { isFavorite: list.includes(menuId) };
      }
      try {
        const response = await apiClient.get(`/v1/favorites/menu/${menuId}/status`);
        return response.data;
      } catch (err) {
        console.error("checkFavoriteMenuStatus error:", err);
        const cached = localStorage.getItem("globaleats_favorites_dishes");
        const list = cached ? JSON.parse(cached) : [];
        return { isFavorite: list.includes(menuId) };
      }
    }
  },

  async removeFavoriteMenu(menuId) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_favorites_dishes");
      let list = cached ? JSON.parse(cached) : [];
      list = list.filter((id) => id !== menuId);
      localStorage.setItem("globaleats_favorites_dishes", JSON.stringify(list));
      return { success: true, data: list };
    } else {
      try {
        const response = await apiClient.delete(`/v1/favorites/menu/${menuId}`);
        return response.data;
      } catch (err) {
        console.error("removeFavoriteMenu error:", err);
        const cached = localStorage.getItem("globaleats_favorites_dishes");
        let list = cached ? JSON.parse(cached) : [];
        list = list.filter((id) => id !== menuId);
        localStorage.setItem("globaleats_favorites_dishes", JSON.stringify(list));
        return { success: true, data: list };
      }
    }
  },

  // Legacy wrappers for backward compatibility
  async getFavoriteDishes() {
    return this.getFavoriteMenu();
  },

  async saveFavoriteDishes(favoriteDishes) {
    if (USE_MOCK) {
      localStorage.setItem("globaleats_favorites_dishes", JSON.stringify(favoriteDishes));
    }
  },

  async getNotifications() {
    return notificationService.getNotifications();
  },

  async saveNotifications(notifications) {
    try {
      localStorage.setItem("globaleats_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.error("Error saving notifications to localStorage:", e);
    }
  },

  async getOrders() {
    if (USE_MOCK) {
      let localOrders = [];
      try {
        const cached = localStorage.getItem("globaleats_orders");
        const parsed = cached ? JSON.parse(cached) : [];
        localOrders = Array.isArray(parsed)
          ? parsed.map(normalizeOrder).filter(Boolean).filter(isPaidOrCodOrder)
          : [];
      } catch (e) {
        console.error("Error reading local orders:", e);
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
      return localOrders;
    } else {
      try {
        const response = await apiClient.get("/v1/orders/my");
        const raw = response.data?.data || response.data?.orders || response.data;
        const list = Array.isArray(raw) ? raw : [];
        const remoteOrders = list.map(normalizeOrder).filter(Boolean).filter(isPaidOrCodOrder);

        try {
          localStorage.setItem("globaleats_orders", JSON.stringify(remoteOrders));
        } catch (e) {
          console.error("Error caching orders in localStorage:", e);
        }
        return remoteOrders;
      } catch (err) {
        if (err?.response?.status !== 403) {
          console.error("getOrders API error:", err);
        }
        return [];
      }
    }
  },

  async getOrderById(orderId) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_orders");
      const list = cached ? JSON.parse(cached) : [];
      const found = list.find((o) => String(o.id) === String(orderId) || String(o._id) === String(orderId));
      return found ? normalizeOrder(found) : null;
    } else {
      try {
        const response = await apiClient.get(`/v1/orders/${orderId}`);
        const raw = response.data?.data || response.data?.order || response.data;
        return raw ? normalizeOrder(raw) : null;
      } catch (err) {
        console.error("getOrderById error:", err);
        return null;
      }
    }
  },

  async createOrder(orderPayload) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        id: `GE-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "received",
        paymentMethod: orderPayload.paymentMethod || "cod",
        paymentStatus: orderPayload.paymentStatus || "pending",
        ...orderPayload,
      };
    } else {
      const payload = {
        address: orderPayload.address,
        contactName: orderPayload.contactName,
        contactPhone: orderPayload.contactPhone,
        paymentMethod: orderPayload.paymentMethod || "cod",
      };

      if (orderPayload.deliveryInstructions) {
        payload.deliveryInstructions = {
          presets: Array.isArray(orderPayload.deliveryInstructions?.presets)
            ? orderPayload.deliveryInstructions.presets
            : [],
          customNote: orderPayload.deliveryInstructions?.customNote || "",
        };
      }

      const response = await apiClient.post("/v1/orders", payload);
      return response.data?.data || response.data?.order || response.data;
    }
  },

  async createCodOrder(orderPayload) {
    return this.createOrder({ ...orderPayload, paymentMethod: "cod" });
  },

  async createRazorpayOrder(orderPayload) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
        razorpayOrderId: `order_mock_${Date.now()}`,
        amount: Math.round((orderPayload.grandTotal || orderPayload.total || 100) * 100),
        currency: "INR",
        orderId: `GE-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    } else {
      const cleanPayload = {
        address: orderPayload.address,
        contactName: orderPayload.contactName,
        contactPhone: orderPayload.contactPhone,
      };

      if (orderPayload.deliveryInstructions) {
        cleanPayload.deliveryInstructions = {
          presets: Array.isArray(orderPayload.deliveryInstructions?.presets)
            ? orderPayload.deliveryInstructions.presets
            : [],
          customNote: orderPayload.deliveryInstructions?.customNote || "",
        };
      }

      const response = await apiClient.post("/v1/payments/razorpay/order", cleanPayload);
      return response.data?.data || response.data;
    }
  },

  async verifyRazorpayPayment(verificationPayload) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        order: {
          id: verificationPayload.orderId,
          status: "received",
          paymentStatus: "paid",
          paymentMethod: "razorpay",
        },
      };
    } else {
      const response = await apiClient.post("/v1/payments/razorpay/verify", {
        orderId: verificationPayload.orderId,
        razorpayOrderId: verificationPayload.razorpayOrderId,
        razorpayPaymentId: verificationPayload.razorpayPaymentId,
        razorpaySignature: verificationPayload.razorpaySignature,
      });
      return response.data?.data || response.data;
    }
  },

  async getRazorpayPaymentStatus(orderId) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const isPaid = localStorage.getItem(`mock_order_paid_${orderId}`) === "true";
      return {
        paymentStatus: isPaid ? "paid" : "pending",
        orderId: orderId,
      };
    } else {
      try {
        const response = await apiClient.get(`/v1/payments/razorpay/status/${orderId}`);
        return response.data?.data || response.data;
      } catch (err) {
        console.error("getRazorpayPaymentStatus API error:", err);
        return { paymentStatus: "pending", error: err };
      }
    }
  },

  async saveOrders(orders) {
    try {
      localStorage.setItem("globaleats_orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Error saving orders to localStorage:", e);
    }
  },

  // Customer Support Operations
  async getSupportChat() {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_support_chat");
      return cached ? JSON.parse(cached) : [];
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) {
        const cached = localStorage.getItem("globaleats_support_chat");
        return cached ? JSON.parse(cached) : [];
      }
      const response = await apiClient.get("/diner/support/chat");
      return response.data;
    }
  },

  async saveSupportChat(chat) {
    if (USE_MOCK) {
      localStorage.setItem("globaleats_support_chat", JSON.stringify(chat));
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) return;
      await apiClient.post("/diner/support/chat", { chat });
    }
  },

  async getTickets() {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_tickets");
      return cached ? JSON.parse(cached) : [];
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) {
        const cached = localStorage.getItem("globaleats_tickets");
        return cached ? JSON.parse(cached) : [];
      }
      try {
        const response = await apiClient.get("/v1/support/tickets");
        const raw = response.data?.data || response.data?.tickets || response.data || [];
        return Array.isArray(raw) ? raw : [];
      } catch (err) {
        console.warn("getTickets API error, using cached/fallback:", err?.message || err);
        const cached = localStorage.getItem("globaleats_tickets");
        return cached ? JSON.parse(cached) : [];
      }
    }
  },

  async createTicket(ticketData) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_tickets");
      const list = cached ? JSON.parse(cached) : [];
      const updated = [ticketData, ...list];
      localStorage.setItem("globaleats_tickets", JSON.stringify(updated));
      return ticketData;
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) return ticketData;
      try {
        const response = await apiClient.post("/v1/support/tickets", ticketData);
        return response.data?.data || response.data || ticketData;
      } catch (err) {
        console.warn("createTicket API error:", err?.message || err);
        return ticketData;
      }
    }
  },

  async saveTickets(tickets) {
    if (USE_MOCK) {
      localStorage.setItem("globaleats_tickets", JSON.stringify(tickets));
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) return;
      try {
        await apiClient.post("/v1/support/tickets", { tickets });
      } catch (err) {
        console.warn("saveTickets API error:", err?.message || err);
      }
    }
  },

  async getWalletBalance() {
    if (USE_MOCK) {
      return localStorage.getItem("globaleats_wallet_balance") || "250.00";
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) {
        return localStorage.getItem("globaleats_wallet_balance") || "250.00";
      }
      try {
        const response = await apiClient.get("/diner/wallet/balance");
        return response.data.balance || "0.00";
      } catch (err) {
        console.warn("getWalletBalance API failed, using cached balance:", err?.message);
        return localStorage.getItem("globaleats_wallet_balance") || "250.00";
      }
    }
  },

  async saveWalletBalance(balance) {
    if (USE_MOCK) {
      localStorage.setItem("globaleats_wallet_balance", balance);
    } else {
      await apiClient.post("/diner/wallet/balance", { balance });
    }
  },

  async getBrands() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const cached = localStorage.getItem("globaleats_brands");
      return cached ? JSON.parse(cached) : [];
    } else {
      const response = await apiClient.get("/v1/brands");
      return response.data?.data || response.data;
    }
  },

  async getActiveCoupons(brandId, restaurantId) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_coupons");
      const list = cached ? JSON.parse(cached) : [];
      return list.map(normalizeCoupon).filter(Boolean);
    } else {
      const params = {};
      if (brandId) params.brand = brandId;
      if (restaurantId) params.restaurant = restaurantId;
      const response = await apiClient.get("/v1/coupons/active", { params });
      const rawData = response.data?.data || response.data?.coupons || response.data || [];
      const list = Array.isArray(rawData) ? rawData : [];
      return list.map(normalizeCoupon).filter(Boolean);
    }
  },

  async applyCoupon(code) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { success: true, message: "Coupon applied successfully" };
    } else {
      const response = await apiClient.post("/v1/coupons/apply", { code });
      return response.data?.data || response.data;
    }
  },

  async getCategories() {
    if (USE_MOCK) {
      return [
        { _id: "65f1a2b3c4d5e6f7a8b9c0d1", name: "Biryani & Rice" },
        { _id: "65f1a2b3c4d5e6f7a8b9c0d2", name: "Pizzas & Italian" },
        { _id: "65f1a2b3c4d5e6f7a8b9c0d3", name: "Burgers & Fast Food" },
        { _id: "65f1a2b3c4d5e6f7a8b9c0d4", name: "Desserts & Shakes" },
      ];
    } else {
      try {
        const response = await apiClient.get("/v1/categories");
        const raw = response.data?.data || response.data?.categories || response.data;
        return Array.isArray(raw) ? raw : [];
      } catch (err) {
        console.warn("getCategories API error, using default categories:", err?.message || err);
        return [
          { _id: "65f1a2b3c4d5e6f7a8b9c0d1", name: "Biryani & Rice" },
          { _id: "65f1a2b3c4d5e6f7a8b9c0d2", name: "Pizzas & Italian" },
          { _id: "65f1a2b3c4d5e6f7a8b9c0d3", name: "Burgers & Fast Food" },
          { _id: "65f1a2b3c4d5e6f7a8b9c0d4", name: "Desserts & Shakes" },
        ];
      }
    }
  },

  async createBrand(brandData) {
    const cleanPayload = {
      name: String(brandData.name || "").trim(),
      category: String(brandData.category || "").trim(),
      tagline: String(brandData.tagline || brandData.slogan || "").trim(),
      description: String(brandData.description || "").trim(),
      coverImage: String(brandData.coverImage || brandData.bannerImage || "").trim(),
      logo: String(brandData.logo || "").trim(),
      averagePrepTime: String(brandData.averagePrepTime || brandData.prepTime || "15-20 mins").trim(),
      isFreeDelivery: Boolean(brandData.isFreeDelivery),
      restaurants: Array.isArray(brandData.restaurants) ? brandData.restaurants : [],
    };
    const response = await apiClient.post("/v1/brands", cleanPayload);
    return response.data?.data || response.data;
  },

  async updateBrand(id, brandData) {
    const cleanPayload = {
      name: String(brandData.name || "").trim(),
      category: String(brandData.category || "").trim(),
      tagline: String(brandData.tagline || brandData.slogan || "").trim(),
      description: String(brandData.description || "").trim(),
      coverImage: String(brandData.coverImage || brandData.bannerImage || "").trim(),
      logo: String(brandData.logo || "").trim(),
      averagePrepTime: String(brandData.averagePrepTime || brandData.prepTime || "15-20 mins").trim(),
      isFreeDelivery: Boolean(brandData.isFreeDelivery),
      restaurants: Array.isArray(brandData.restaurants) ? brandData.restaurants : [],
    };
    const response = await apiClient.patch(`/v1/brands/${id}`, cleanPayload);
    return response.data?.data || response.data;
  },

  async getBrandById(id) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_brands");
      const list = cached ? JSON.parse(cached) : [];
      return list.find((b) => String(b.id || b._id) === String(id)) || null;
    } else {
      const response = await apiClient.get(`/v1/brands/${id}`);
      return response.data?.data || response.data;
    }
  },

  async deleteBrand(id) {
    if (USE_MOCK) {
      const cached = localStorage.getItem("globaleats_brands");
      let list = cached ? JSON.parse(cached) : [];
      list = list.filter((b) => String(b.id || b._id) !== String(id));
      localStorage.setItem("globaleats_brands", JSON.stringify(list));
      return { success: true };
    } else {
      const response = await apiClient.delete(`/v1/brands/${id}`);
      return response.data?.data || response.data;
    }
  },

  async saveBrands(brands) {
    if (USE_MOCK) {
      localStorage.setItem("globaleats_brands", JSON.stringify(brands));
    } else {
      await apiClient.post("/v1/brands", { brands });
    }
  },

  // Banners Management (diner-scoped)
  async getBanners() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_banners");
      if (cached) return JSON.parse(cached);
      const defaultBanners = [
        {
          title: "UP TO 50% OFF",
          subtitle: "ON YOUR FIRST ORDER",
          code: "WELCOME50",
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
          foodName: "Signature Dum Biryani",
          color: "from-orange-600 to-amber-500"
        },
        {
          title: "FLAT 40% OFF",
          subtitle: "ON PREMIUM FEASTS",
          code: "FOOD40",
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
          foodName: "Melted Cheese Pizzas",
          color: "from-rose-600 to-orange-500"
        },
        {
          title: "BUY 1 GET 1 FREE",
          subtitle: "ON LEBANESE SHAWARMAS",
          code: "YALLABOGO",
          image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=800",
          foodName: "Authentic Arabic Bowls",
          color: "from-emerald-600 to-teal-500"
        }
      ];
      localStorage.setItem("globaleats_banners", JSON.stringify(defaultBanners));
      return defaultBanners;
    } else {
      const response = await apiClient.get("/diner/banners");
      return response.data;
    }
  },

  async saveBanners(banners) {
    if (USE_MOCK) {
      localStorage.setItem("globaleats_banners", JSON.stringify(banners));
      return banners;
    } else {
      const response = await apiClient.post("/diner/banners", { banners });
      return response.data;
    }
  },

  // --- REELS API ---
  async getReels() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return REELS; // Return rich dummy reels in mock mode
    } else {
      try {
        const response = await apiClient.get("/v1/reels");
        const raw = response.data?.data || response.data?.reels || response.data;
        return Array.isArray(raw) && raw.length > 0 ? raw : REELS;
      } catch (err) {
        console.warn("getReels notice: Reels API endpoint unavailable.", err?.message);
        return REELS; // Fallback to dummy reels
      }
    }
  },


  async getAllMenu() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return [];
    } else {
      const response = await apiClient.get("/v1/menu");
      return response.data;
    }
  },

  async getMenuByRestaurantId(restaurantId) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return [];
    } else {
      const response = await apiClient.get(`/v1/menu/restaurant/${restaurantId}`);
      return response.data;
    }
  },

  async getCart() {
    if (USE_MOCK) {
      const cachedItems = localStorage.getItem("globaleats_cart_items");
      const items = cachedItems ? JSON.parse(cachedItems) : [];
      const cachedRestaurant = localStorage.getItem("globaleats_cart_restaurant");
      const restaurant = cachedRestaurant ? JSON.parse(cachedRestaurant) : null;
      return { cart: { restaurant, specialInstructions: "", tipAmount: 0 }, items };
    } else {
      const token = localStorage.getItem("globaleats_token");
      if (!token) {
        return { cart: { restaurant: null, specialInstructions: "", tipAmount: 0 }, items: [] };
      }
      const response = await apiClient.get("/v1/cart");
      return response.data?.data;
    }
  },

  async addToCart(menuId, quantity = 1) {
    if (USE_MOCK) {
      return null;
    } else {
      const response = await apiClient.post("/v1/cart", { menu: menuId, quantity });
      return response.data?.data;
    }
  },

  async updateCartQuantity(cartItemId, quantity) {
    if (USE_MOCK) {
      return null;
    } else {
      const response = await apiClient.patch(`/v1/cart/${cartItemId}`, { quantity });
      return response.data?.data;
    }
  },

  async removeCartItem(cartItemId) {
    if (USE_MOCK) {
      return null;
    } else {
      const response = await apiClient.delete(`/v1/cart/${cartItemId}`);
      return response.data?.data;
    }
  },

  async clearCart() {
    if (USE_MOCK) {
      return null;
    } else {
      const response = await apiClient.delete("/v1/cart");
      return response.data?.data;
    }
  },

  async updateSpecialInstructions(specialInstructions) {
    if (USE_MOCK) {
      return null;
    } else {
      const response = await apiClient.patch("/v1/cart/instructions", { specialInstructions });
      return response.data?.data;
    }
  },

  async updateTip(tipAmount) {
    if (USE_MOCK) {
      return null;
    } else {
      const response = await apiClient.patch("/v1/cart/tip", { tipAmount });
      return response.data?.data;
    }
  },

  async applyCoupon(code) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return { success: true, message: "Coupon applied successfully" };
    } else {
      const response = await apiClient.post("/v1/cart/coupon", { code });
      return response.data;
    }
  },

  async removeCoupon() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return { success: true, message: "Coupon removed successfully" };
    } else {
      try {
        const response = await apiClient.delete("/v1/cart/coupon");
        return response.data;
      } catch (err) {
        console.warn("removeCoupon API notice:", err);
        return null;
      }
    }
  },

  async getActiveCoupons() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cached = localStorage.getItem("globaleats_coupons");
      let list = cached ? JSON.parse(cached) : null;
      if (!list || list.length === 0) {
        list = [
          {
            _id: "cp-1",
            code: "SAVE10",
            title: "₹ 10 OFF",
            bannerTitle: "₹ 10 OFF",
            desc: "ON ORDERS ABOVE ₹ 49",
            policyText: "ON ORDERS ABOVE ₹ 49",
            minimumOrderAmount: 49,
            discountType: "flat",
            discountValue: 10,
            campaignCategory: "STANDARD",
            isActive: true,
          },
          {
            _id: "cp-2",
            code: "HALF120",
            title: "50% OFF",
            bannerTitle: "50% OFF",
            desc: "UP TO ₹ 20 ON ORDERS",
            policyText: "UP TO ₹ 20 ON ORDERS",
            minimumOrderAmount: 0,
            discountType: "percentage",
            discountValue: 50,
            maximumDiscount: 20,
            campaignCategory: "STANDARD",
            isActive: true,
          },
          {
            _id: "cp-3",
            code: "YUM30",
            title: "FLAT 30% OFF",
            bannerTitle: "FLAT 30% OFF",
            desc: "ON ORDERS ABOVE ₹ 59",
            policyText: "ON ORDERS ABOVE ₹ 59",
            minimumOrderAmount: 59,
            discountType: "percentage",
            discountValue: 30,
            campaignCategory: "STANDARD",
            isActive: true,
          },
          {
            _id: "cp-4",
            code: "FREEDEL",
            title: "FREE DELIVERY",
            bannerTitle: "FREE DELIVERY",
            desc: "ON ORDERS ABOVE ₹ 39",
            policyText: "ON ORDERS ABOVE ₹ 39",
            minimumOrderAmount: 39,
            discountType: "flat",
            discountValue: 30,
            campaignCategory: "STANDARD",
            isActive: true,
          },
        ];
        localStorage.setItem("globaleats_coupons", JSON.stringify(list));
      }
      return list.map(normalizeCoupon).filter(Boolean);
    } else {
      const response = await apiClient.get("/v1/coupons/active");
      const rawData = response.data?.data || response.data || [];
      const list = Array.isArray(rawData) ? rawData : [];
      return list.map(normalizeCoupon).filter(Boolean);
    }
  },

  async getCoupons() {
    return this.getActiveCoupons();
  },

  // --- REVIEWS APIs ---
  async getReviewsByRestaurant(restaurantId) {
    if (USE_MOCK) {
      const cached = localStorage.getItem(`globaleats_reviews_${restaurantId}`);
      if (cached) return JSON.parse(cached);
      return [];
    } else {
      try {
        const response = await apiClient.get("/v1/reviews", {
          params: restaurantId ? { restaurant: restaurantId } : {},
        });
        const rawList = Array.isArray(response.data)
          ? response.data
          : response.data?.data || response.data?.reviews || [];
        const normalized = rawList.map(normalizeReview).filter(Boolean);
        if (!restaurantId) return normalized;
        const targetId = String(restaurantId);
        const filtered = normalized.filter((rev) => {
          if (!rev.restaurant) return true;
          const resVal = rev.restaurant;
          const revResId = typeof resVal === "object" ? String(resVal._id || resVal.id) : String(resVal);
          return revResId === targetId;
        });
        return filtered;
      } catch (err) {
        console.error("getReviewsByRestaurant error:", err);
        const cached = localStorage.getItem(`globaleats_reviews_${restaurantId}`);
        if (cached) return JSON.parse(cached);
        return [];
      }
    }
  },

  async getAllReviews(restaurantId) {
    return this.getReviewsByRestaurant(restaurantId);
  },

  async createReview(data) {
    if (USE_MOCK) {
      const restaurantId = data.restaurant || data.restaurantId;
      const cached = localStorage.getItem(`globaleats_reviews_${restaurantId}`);
      const list = cached ? JSON.parse(cached) : [];
      const newReview = normalizeReview({
        id: String(Date.now()),
        _id: String(Date.now()),
        userName: data.userName || "Verified Diner",
        rating: Number(data.rating),
        comment: data.comment,
        photos: data.photoUrls || [],
        createdAt: new Date().toISOString(),
        likes: 0,
        isLocal: true,
      });
      list.unshift(newReview);
      localStorage.setItem(`globaleats_reviews_${restaurantId}`, JSON.stringify(list));
      return { success: true, data: newReview };
    } else {
      let payload;
      if (data instanceof FormData) {
        payload = data;
      } else {
        const fileList = Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []);
        const photoUrls = Array.isArray(data.photoUrls) ? data.photoUrls : [];
        const hasFiles = fileList.some((img) => img instanceof File || img instanceof Blob);

        if (hasFiles) {
          payload = new FormData();
          if (data.restaurant || data.restaurantId) payload.append("restaurant", data.restaurant || data.restaurantId);
          if (data.rating !== undefined) payload.append("rating", String(data.rating));
          if (data.comment) payload.append("comment", data.comment);

          fileList.forEach((img) => {
            if (img instanceof File || img instanceof Blob) {
              payload.append("images", img);
            }
          });

          photoUrls.forEach((url) => {
            if (typeof url === "string" && !url.startsWith("data:")) {
              payload.append("images", url);
            }
          });
        } else {
          const imageUrls = photoUrls.length > 0
            ? photoUrls
            : fileList.filter((img) => typeof img === "string" && !img.startsWith("data:"));

          payload = {
            restaurant: data.restaurant || data.restaurantId,
            rating: Number(data.rating),
            comment: data.comment,
            images: imageUrls,
          };
        }
      }
      const response = await apiClient.post("/v1/reviews", payload);
      if (response.data && response.data.success === false) {
        const err = new Error(response.data.message || "Failed to create review");
        err.response = response;
        err.data = response.data;
        throw err;
      }
      return response.data;
    }
  },

  async updateReview(reviewId, data) {
    if (USE_MOCK) {
      return { success: true };
    } else {
      let payload;
      if (data instanceof FormData) {
        payload = data;
      } else {
        const fileList = Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []);
        const photoUrls = Array.isArray(data.photoUrls) ? data.photoUrls : [];
        const hasFiles = fileList.some((img) => img instanceof File || img instanceof Blob);

        if (hasFiles) {
          payload = new FormData();
          if (data.rating !== undefined) payload.append("rating", String(data.rating));
          if (data.comment !== undefined) payload.append("comment", data.comment);

          fileList.forEach((img) => {
            if (img instanceof File || img instanceof Blob) {
              payload.append("images", img);
            }
          });

          photoUrls.forEach((url) => {
            if (typeof url === "string" && !url.startsWith("data:")) {
              payload.append("images", url);
              payload.append("photoUrls", url);
            }
          });
        } else {
          const imageUrls = photoUrls.length > 0
            ? photoUrls
            : fileList.filter((img) => typeof img === "string" && !img.startsWith("data:"));

          payload = {
            rating: Number(data.rating),
            comment: data.comment,
            images: imageUrls,
          };
        }
      }
      const response = await apiClient.patch(`/v1/reviews/${reviewId}`, payload);
      if (response.data && response.data.success === false) {
        const err = new Error(response.data.message || "Failed to update review");
        err.response = response;
        err.data = response.data;
        throw err;
      }
      return response.data;
    }
  },

  async deleteReview(reviewId) {
    if (USE_MOCK) {
      return { success: true };
    } else {
      const response = await apiClient.delete(`/v1/reviews/${reviewId}`);
      if (response.data && response.data.success === false) {
        const err = new Error(response.data.message || "Failed to delete review");
        err.response = response;
        err.data = response.data;
        throw err;
      }
      return response.data;
    }
  }
};

export const normalizeReview = (rev) => {
  if (!rev) return null;
  const photos = Array.isArray(rev.images)
    ? rev.images.map((img) => (typeof img === "string" ? img : img?.url || img?.secure_url || ""))
    : Array.isArray(rev.photos)
      ? rev.photos
      : [];

  const isHexId = (str) => typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str);

  const userObj = rev.customer || rev.user;

  let uName = "";
  if (rev.userName && !isHexId(rev.userName)) {
    uName = rev.userName;
  } else if (userObj && typeof userObj === "object") {
    uName = userObj.fullName || userObj.name || userObj.email?.split("@")[0] || "";
  } else if (typeof userObj === "string" && !isHexId(userObj)) {
    uName = userObj;
  }

  if (!uName || isHexId(uName)) {
    try {
      const storedUser = localStorage.getItem("globaleats_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const loggedId = parsed?._id || parsed?.id;
        const revUserId = typeof userObj === "object" ? (userObj?._id || userObj?.id) : userObj;
        if (loggedId && revUserId && String(loggedId) === String(revUserId)) {
          uName = parsed?.fullName || parsed?.name || "You";
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (!uName || isHexId(uName)) {
    uName = "Verified Diner";
  }

  return {
    id: rev.id || rev._id,
    _id: rev._id || rev.id,
    userName: uName,
    rating: Number(rev.rating) || 5,
    text: rev.comment || rev.text || "",
    comment: rev.comment || rev.text || "",
    photos: photos.filter(Boolean),
    images: rev.images || [],
    date: rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : (rev.date || "Recently"),
    createdAt: rev.createdAt || null,
    likes: rev.likes || 0,
    user: userObj || null,
    customer: rev.customer || null,
    restaurant: rev.restaurant || null,
  };
};

export const extractImageUrl = (img, fallback = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400") => {
  if (!img) return fallback;
  if (typeof img === "string") {
    if (!img.trim() || img === "[object Object]") return fallback;
    return img;
  }
  if (typeof img === "object") {
    return img.secure_url || img.url || img.path || img.src || fallback;
  }
  return fallback;
};

const cleanCategoryName = (cat) => {
  if (!cat) return "";
  const cleaned = cat.trim();
  if (cleaned.toLowerCase() === "itailan" || cleaned.toLowerCase() === "italian") {
    return "Italian";
  }
  return cleaned;
};

export const normalizeMenuItem = (item) => {
  if (!item) return null;
  const imageUrl =
    extractImageUrl(item.image, "") ||
    extractImageUrl(item.imageUrl, "") ||
    extractImageUrl(item.photo, "") ||
    extractImageUrl(item.coverImage, "") ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";

  const cat = item.category ? cleanCategoryName(item.category) : "";

  const parseIsAvailable = (val, fallbackVal) => {
    if (val !== undefined && val !== null) {
      if (typeof val === "boolean") return val;
      if (typeof val === "string") return val.trim().toLowerCase() !== "false" && val.trim() !== "0";
      if (typeof val === "number") return val !== 0;
      return Boolean(val);
    }
    if (fallbackVal !== undefined && fallbackVal !== null) {
      if (typeof fallbackVal === "boolean") return fallbackVal;
      if (typeof fallbackVal === "string") return fallbackVal.trim().toLowerCase() !== "false" && fallbackVal.trim() !== "0";
      if (typeof fallbackVal === "number") return fallbackVal !== 0;
      return Boolean(fallbackVal);
    }
    return true;
  };

  return {
    id: item._id || item.id,
    _id: item._id || item.id,
    name: item.name || "",
    price: Number(item.price) || 0,
    category: cat,
    description: item.description || "",
    image: imageUrl,
    isVeg: item.isVegetarian !== undefined ? item.isVegetarian : (item.isVeg !== undefined ? item.isVeg : true),
    isBestseller: item.isBestSeller !== undefined ? item.isBestSeller : (item.isBestseller !== undefined ? item.isBestseller : false),
    isAvailable: parseIsAvailable(item.isAvailable, item.isActive),
    brand: item.brand || item.brandId || null,
  };
};

export const isPaidOrCodOrder = (order) => {
  if (!order) return false;
  const method = String(order.paymentMethod || "cod").toLowerCase().trim();
  const status = String(order.paymentStatus || "").toLowerCase().trim();

  // Cash on Delivery (COD) is valid immediately
  if (method === "cod" || method === "cash" || method === "cash_on_delivery" || method.includes("cod") || method.includes("cash")) {
    return true;
  }

  // Online payments (Razorpay, UPI, etc.) MUST have paymentStatus set to paid/completed/success/captured
  return status === "paid" || status === "completed" || status === "success" || status === "captured";
};

export const normalizeOrder = (raw) => {
  if (!raw) return null;
  const orderObj = raw.order || (raw._id || raw.id ? raw : null) || raw;
  if (!orderObj) return null;

  const rawItems = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(orderObj.items)
      ? orderObj.items
      : [];

  const resObj = typeof orderObj.restaurant === "object" ? orderObj.restaurant : null;
  const resName =
    orderObj.restaurantName ||
    resObj?.name ||
    (typeof orderObj.restaurant === "string" ? orderObj.restaurant : "") ||
    "QuikaBite Gourmet";

  const resImage =
    resObj?.image?.url ||
    resObj?.image?.secure_url ||
    (typeof resObj?.image === "string" ? resObj.image : "") ||
    orderObj.restaurantImage ||
    "";

  const normalizedItems = rawItems.map((item) => {
    const isString = typeof item === "string";
    const name = isString ? item : (item?.itemName || item?.name || item?.menuItem?.name || "Gourmet Dish");
    const price = isString ? 0 : Number(item?.unitPrice ?? item?.price ?? item?.menuItem?.price ?? 0);
    const quantity = isString ? 1 : Number(item?.quantity ?? item?.qty ?? 1);
    const itemImg = isString ? "" : (item?.itemImage || item?.image || item?.menuItem?.image || "");
    const category = isString ? "Main" : (item?.category || item?.menuItem?.category || "Main");
    return {
      id: isString ? `item-${Math.random()}` : (item?._id || item?.id || ""),
      menuItem: {
        id: isString ? "" : (item?.menu || item?.menuItem?.id || item?.menuItem?._id || item?._id || item?.id || ""),
        name: name,
        price: price,
        image: itemImg,
        category: category,
      },
      name: name,
      price: price,
      quantity: quantity,
      image: itemImg,
      category: category,
      totalPrice: Number(isString ? (Number(orderObj.totalAmount || orderObj.total || 0)) : (item?.totalPrice ?? (price * quantity))),
    };
  });

  const calculatedItemsTotal = normalizedItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const subtotal = Number(orderObj.subtotal || orderObj.itemsPrice || calculatedItemsTotal);
  const deliveryFee = Number(orderObj.deliveryFee ?? orderObj.shippingPrice ?? 0);
  const tax = Number(orderObj.tax ?? orderObj.taxPrice ?? 0);
  const discount = Number(orderObj.discount ?? 0);
  const tipAmount = Number(orderObj.tipAmount ?? orderObj.tip ?? 0);
  const rawTotal = Number(orderObj.totalAmount ?? orderObj.total ?? orderObj.grandTotal ?? orderObj.totalPrice ?? 0);
  const total = rawTotal > 0 ? rawTotal : Math.max(0, subtotal + deliveryFee + tax + tipAmount - discount);

  const rawStatus = orderObj.orderStatus || orderObj.status || "received";
  const statusStr = String(rawStatus).toLowerCase().trim();
  let normalizedStatus = statusStr;
  if (statusStr === "pending" || statusStr === "placed" || statusStr === "paid") {
    normalizedStatus = "received";
  } else if (statusStr === "accepted" || statusStr === "confirmed") {
    normalizedStatus = "accepted";
  } else if (statusStr === "ready" || statusStr === "ready-for-pickup") {
    normalizedStatus = "ready";
  } else if (
    statusStr === "dispatched" ||
    statusStr === "out_for_delivery" ||
    statusStr === "out-for-delivery" ||
    statusStr === "out for delivery" ||
    statusStr === "out" ||
    statusStr === "delivering" ||
    statusStr === "in_transit" ||
    statusStr === "in transit" ||
    statusStr === "on_way" ||
    statusStr === "on way" ||
    statusStr === "shipped"
  ) {
    normalizedStatus = "dispatched";
  } else if (statusStr === "completed" || statusStr === "delivered") {
    normalizedStatus = "delivered";
  } else if (statusStr === "cancelled" || statusStr === "rejected") {
    normalizedStatus = "rejected";
  }

  const rawDate = orderObj.createdAt || orderObj.timestamp;
  let timestampStr = "Just now";
  if (rawDate) {
    try {
      timestampStr = new Date(rawDate).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      timestampStr = String(rawDate);
    }
  }

  const deliveryObj = orderObj.delivery || {};

  const rawDbId = String(orderObj.orderId || orderObj._id || orderObj.id || "");
  const displayId = orderObj.orderNumber || orderObj.orderId || rawDbId || fallbackDisplayId;

  return {
    ...orderObj,
    id: String(displayId),
    _id: rawDbId || fallbackDisplayId,
    orderNumber: orderObj.orderNumber || orderObj.orderId || rawDbId || "",
    restaurantName: String(resName),
    restaurantImage: resImage,
    restaurantId: String(resObj?._id || orderObj.restaurantId || (typeof orderObj.restaurant === "string" ? orderObj.restaurant : "") || ""),
    status: normalizedStatus,
    orderStatus: rawStatus,
    timestamp: timestampStr,
    createdAt: orderObj.createdAt || rawDate,
    rejectedAt: orderObj.rejectedAt || null,
    items: normalizedItems,
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    tax: tax,
    discount: discount,
    tipAmount: tipAmount,
    total: total,
    totalAmount: total,
    couponCode: orderObj.couponCode || "",
    paymentMethod: orderObj.paymentMethod || "cod",
    paymentStatus: orderObj.paymentStatus || (orderObj.paymentMethod === "razorpay" ? "pending" : "paid"),
    razorpayOrderId: orderObj.razorpayOrderId || orderObj.razorpay_order_id || "",
    razorpayPaymentId: orderObj.razorpayPaymentId || orderObj.razorpay_payment_id || "",
    contactName: orderObj.contactName || orderObj.user?.fullName || "",
    contactPhone: orderObj.contactPhone || orderObj.user?.phone || "",
    contactEmail: orderObj.contactEmail || orderObj.user?.email || "",
    driverName: deliveryObj.driverName || orderObj.driverName || "Ahmed Ali",
    driverPhone: deliveryObj.driverPhone || orderObj.driverPhone || "+91 9876543210",
    deliveryPartner: deliveryObj.partner || orderObj.deliveryPartner || "Gold Partner",
    vehicleDetails: deliveryObj.vehicleDetails || orderObj.vehicleDetails || "Red Honda Activa (DX-09-RT-4412)",
    deliveryInstructions: orderObj.deliveryInstructions || { presets: [], customNote: "" },
    address: orderObj.address || null,
  };
};

export const normalizeRestaurant = (res) => {
  if (!res) return null;

  const cuisinesList = Array.isArray(res.cuisines)
    ? res.cuisines.map(cleanCategoryName).filter(Boolean)
    : typeof res.cuisines === "string"
      ? res.cuisines.split(",").map(cleanCategoryName).filter(Boolean)
      : Array.isArray(res.tags)
        ? res.tags.map(cleanCategoryName).filter(Boolean)
        : typeof res.tags === "string"
          ? res.tags.split(",").map(cleanCategoryName).filter(Boolean)
          : [];

  const imageUrl =
    typeof res.image === "string"
      ? res.image
      : res.image?.secure_url ||
      res.image?.url ||
      res.imageUrl ||
      res.photo ||
      res.coverImage ||
      "https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&auto=format&fit=crop";

  return {
    id: res.id || res._id || res.slug,
    _id: res._id || res.id,
    name: res.name || "",
    image: imageUrl,
    address: typeof res.address === "object" ? res.address?.fullAddress || "" : res.address || "",
    addressObj: res.addressObj || {
      landmark: typeof res.address === "object" ? res.address?.landmark || "" : res.landmark || "",
      city: res.city || "",
      fullAddress: typeof res.address === "object" ? res.address?.fullAddress || "" : res.address || ""
    },
    landmark: res.landmark || (typeof res.address === "object" ? res.address?.landmark || "" : "") || res.addressObj?.landmark || "",
    city: res.city || res.addressObj?.city || "",
    cuisines: cuisinesList,
    tags: cuisinesList,
    deliveryTime: res.deliveryTime || res.cookingLeadTime || "20-25 mins",
    cookingLeadTime: res.cookingLeadTime || res.deliveryTime || "20-25 mins",
    deliveryFee: res.deliveryFee !== undefined && res.deliveryFee !== null ? Number(res.deliveryFee) : (res.deliveryCharge !== undefined && res.deliveryCharge !== null ? Number(res.deliveryCharge) : 0),
    isFreeDelivery: res.isFreeDelivery !== undefined ? res.isFreeDelivery : (Number(res.deliveryFee ?? res.deliveryCharge ?? 0) === 0),
    rating: res.rating !== undefined ? Number(res.rating) : (res.averageRating !== undefined ? Number(res.averageRating) : 4.5),
    reviewsCount: res.reviewsCount !== undefined && res.reviewsCount !== null
      ? Number(res.reviewsCount)
      : (res.totalReviews !== undefined && res.totalReviews !== null
        ? Number(res.totalReviews)
        : (res.numReviews !== undefined && res.numReviews !== null
          ? Number(res.numReviews)
          : 0)),
    totalReviews: res.totalReviews !== undefined && res.totalReviews !== null
      ? Number(res.totalReviews)
      : (res.reviewsCount !== undefined && res.reviewsCount !== null
        ? Number(res.reviewsCount)
        : 0),
    menu: Array.isArray(res.menu)
      ? res.menu.map((item) => normalizeMenuItem(item))
      : [],
    deliveryRadiusKm: res.deliveryRadiusKm !== undefined ? Number(res.deliveryRadiusKm) : 10,
    distance: res.distance !== undefined && res.distance !== null ? Number(res.distance) : null,
    location: res.location || null,
    brands: Array.isArray(res.brands) ? res.brands : [],
    isActive: res.isActive !== false,
    contactNumber: res.contactNumber || "",
    operatingHours: Array.isArray(res.operatingHours) ? res.operatingHours : [],
    coordinates: res.coordinates || (res.location?.coordinates
      ? { x: res.location.coordinates[0], y: res.location.coordinates[1] }
      : { x: 0, y: 0 })
  };
};

export const validateCouponData = (coupon) => {
  if (!coupon) {
    throw new Error("Coupon data is required");
  }
  if (typeof coupon.code !== "string" || !coupon.code.trim()) {
    throw new Error("Coupon code must be a non-empty string");
  }
  const validCategories = ["STANDARD", "BANK", "FESTIVAL", "RESTAURANT", "CASHBACK", "PAYMENT", "WALLET"];
  if (coupon.campaignCategory && !validCategories.includes(coupon.campaignCategory.toUpperCase())) {
    console.warn(`Warning: Coupon campaignCategory "${coupon.campaignCategory}" is not one of the standard categories.`);
  }
  if (coupon.discountType && !["percentage", "flat"].includes(coupon.discountType)) {
    throw new Error("Coupon discountType must be either 'percentage' or 'flat'");
  }
  if (coupon.discountValue !== undefined && (isNaN(Number(coupon.discountValue)) || Number(coupon.discountValue) < 0)) {
    throw new Error("Coupon discountValue must be a non-negative number");
  }
  if (coupon.minimumOrderAmount !== undefined && (isNaN(Number(coupon.minimumOrderAmount)) || Number(coupon.minimumOrderAmount) < 0)) {
    throw new Error("Coupon minimumOrderAmount must be a non-negative number");
  }
  if (coupon.maximumDiscount !== undefined && (isNaN(Number(coupon.maximumDiscount)) || Number(coupon.maximumDiscount) < 0)) {
    throw new Error("Coupon maximumDiscount must be a non-negative number");
  }
  if (coupon.validTill) {
    const d = new Date(coupon.validTill);
    if (isNaN(d.getTime())) {
      throw new Error("Coupon validTill must be a valid date representation");
    }
  }
  return true;
};

export const normalizeCoupon = (coupon) => {
  if (!coupon || typeof coupon.code !== "string" || !coupon.code.trim()) {
    console.warn("Skipping normalization for invalid coupon data:", coupon);
    return null;
  }
  const backendCategory = coupon.campaignCategory || "";
  let frontendCategory = "coupon";
  if (backendCategory === "STANDARD") {
    frontendCategory = "coupon";
  } else if (backendCategory === "RESTAURANT") {
    frontendCategory = "restaurant";
  } else if (backendCategory === "BANK") {
    frontendCategory = "bank";
  } else if (backendCategory === "CASHBACK") {
    frontendCategory = "cashback";
  } else {
    frontendCategory = backendCategory.toLowerCase() || "coupon";
  }

  let expiryStr = "Valid till end of month";
  if (coupon.validTill) {
    try {
      expiryStr = new Date(coupon.validTill).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      console.error("Failed to parse coupon validTill date:", e);
    }
  }

  let imageUrl = "";
  if (coupon.image) {
    if (typeof coupon.image === "object") {
      imageUrl = coupon.image.url || "";
    } else if (typeof coupon.image === "string") {
      imageUrl = coupon.image;
    }
  }

  return {
    id: coupon._id || coupon.id,
    code: coupon.code,
    category: frontendCategory,
    campaignCategory: backendCategory,
    title: coupon.bannerTitle || coupon.title || "",
    discount: coupon.discountLabel || coupon.discount || "",
    desc: coupon.policyText || coupon.desc || "",
    minOrder: coupon.minimumOrderAmount !== undefined ? coupon.minimumOrderAmount : (coupon.minOrder || 0),
    expiry: expiryStr,
    validTill: coupon.validTill,
    validFrom: coupon.validFrom,
    discountType: coupon.discountType || "percentage",
    discountValue: coupon.discountValue || 0,
    maximumDiscount: coupon.maximumDiscount || 0,
    isLoyaltyReward: coupon.isLoyaltyReward || false,
    usageLimit: coupon.usageLimit || 100,
    usageLimitPerUser: coupon.usageLimitPerUser || 1,
    usedCount: coupon.usedCount || 0,
    isActive: coupon.isActive !== undefined ? coupon.isActive : true,
    restaurant: coupon.restaurant || null,
    image: imageUrl,
    rawImageObj: coupon.image,
  };
};

