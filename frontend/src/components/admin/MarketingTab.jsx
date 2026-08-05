import React, { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { adminService, normalizeCoupon, USE_MOCK } from "../../api/adminService";
import { parseApiError } from "../../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Sparkles,
  Users,
  FileText,
  Cpu,
  Send,
  Plus,
  Trash2,
  X,
  TrendingUp,
  Phone,
  Clock,
  Calendar,
  Search,
  UserCheck,
  UserX,
  Database,
  BarChart3,
  Sliders,
  RefreshCw,
  Eye,
  Smartphone,
  Share2,
  Mail,
  Building,
  Download,
  Briefcase,
  Tag,
  Ticket,
} from "lucide-react";
import Modal from "../common/Modal";
export default function MarketingTab({
  triggerToast,
  activeSubTab: propActiveSubTab,
  setActiveSubTab: propSetActiveSubTab,
  restaurantsList,
  setRestaurantsList,
  saveRestaurantsToStorage,
  couponsList,
  setCouponsList,
  saveOffersToStorage,
}) {
  const [localActiveSubTab, setLocalActiveSubTab] = useState("whatsapp");
  const activeSubTab = propActiveSubTab || localActiveSubTab;
  const setActiveSubTab = propSetActiveSubTab || setLocalActiveSubTab;

  const [selectedResIdForOffer, setSelectedResIdForOffer] = useState(null);
  const [newOfferText, setNewOfferText] = useState("");
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponTitle, setNewCouponTitle] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");
  const [newCouponDesc, setNewCouponDesc] = useState("");
  const [newCouponMinOrder, setNewCouponMinOrder] = useState("");
  const [newCouponCategory, setNewCouponCategory] = useState("coupon");
  const [newCouponDiscountType, setNewCouponDiscountType] =
    useState("percentage");
  const [newCouponDiscountValue, setNewCouponDiscountValue] = useState("");
  const [newCouponMaxDiscount, setNewCouponMaxDiscount] = useState("");
  const [newCouponUsageLimit, setNewCouponUsageLimit] = useState("100");
  const [newCouponUsageLimitPerUser, setNewCouponUsageLimitPerUser] =
    useState("1");
  const [newCouponValidFrom, setNewCouponValidFrom] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [newCouponValidTill, setNewCouponValidTill] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [newCouponIsActive, setNewCouponIsActive] = useState(true);
  const [newCouponIsLoyaltyReward, setNewCouponIsLoyaltyReward] =
    useState(false);

  const handleUpdateRestaurantOffer = (e) => {
    e.preventDefault();
    if (!selectedResIdForOffer || !newOfferText) {
      triggerToast("Select a kitchen and enter offer text.");
      return;
    }
    const updated = restaurantsList.map((r) => {
      if (r.id === selectedResIdForOffer) {
        return { ...r, discount: newOfferText };
      }
      return r;
    });
    setRestaurantsList(updated);
    saveRestaurantsToStorage(updated);
    triggerToast(
      `Updated offer badge for "${restaurantsList.find((r) => r.id === selectedResIdForOffer)?.name}" to "${newOfferText}"`,
    );
    setNewOfferText("");
  };

  const handleAddCouponSubmit = async (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponTitle || !newCouponDiscount) {
      triggerToast("Please fill out all required fields.");
      return;
    }

    // Determine campaign category
    let campaignCategory = "STANDARD";
    if (newCouponCategory === "bank") {
      campaignCategory = "BANK";
    } else if (newCouponCategory === "restaurant") {
      campaignCategory = "RESTAURANT";
    } else if (newCouponCategory === "cashback") {
      campaignCategory = "CASHBACK";
    } else if (newCouponCategory === "payment") {
      campaignCategory = "PAYMENT";
    } else {
      campaignCategory = newCouponCategory.toUpperCase();
    }

    const payload = {
      code: newCouponCode.toUpperCase().replace(/\s+/g, ""),
      campaignCategory,
      bannerTitle: newCouponTitle,
      discountLabel: newCouponDiscount,
      discountType: newCouponDiscountType,
      discountValue: Number(newCouponDiscountValue) || 0,
      maximumDiscount: Number(newCouponMaxDiscount) || 0,
      minimumOrderAmount: Number(newCouponMinOrder) || 0,
      policyText: newCouponDesc || "No conditions set.",
      isLoyaltyReward: newCouponIsLoyaltyReward,
      usageLimit: Number(newCouponUsageLimit) || 100,
      usageLimitPerUser: Number(newCouponUsageLimitPerUser) || 1,
      validFrom: new Date(newCouponValidFrom).toISOString(),
      validTill: new Date(newCouponValidTill).toISOString(),
      isActive: newCouponIsActive,
    };

    try {
      const created = await adminService.createCoupon(payload);
      const updated = [created, ...couponsList];
      setCouponsList(updated);
      saveOffersToStorage(updated);
      triggerToast(
        `Promo Code "${newCouponCode.toUpperCase()}" published live!`,
      );
      setNewCouponCode("");
      setNewCouponTitle("");
      setNewCouponDiscount("");
      setNewCouponDesc("");
      setNewCouponMinOrder("");
      setNewCouponDiscountValue("");
      setNewCouponMaxDiscount("");
      setNewCouponUsageLimit("100");
      setNewCouponUsageLimitPerUser("1");
      setNewCouponIsActive(true);
      setNewCouponIsLoyaltyReward(false);
    } catch (err) {
      console.error("Failed to create coupon:", err);
      triggerToast(
        err.response?.data?.message || "Failed to publish promo code.",
      );
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    try {
      await adminService.deleteCoupon(id);
      const updated = couponsList.filter((c) => c.id !== id);
      setCouponsList(updated);
      saveOffersToStorage(updated);
      triggerToast(`Coupon Code "${code}" suspended.`);
    } catch (err) {
      console.error("Failed to delete coupon:", err);
      triggerToast(err.response?.data?.message || "Failed to suspend coupon.");
    }
  };
  const [leads, setLeads] = useState(() => {
    if (!USE_MOCK) return [];
    return [
      {
        id: "lead_1",
        name: "Rajesh Agarwal",
        email: "rajesh@infosys.com",
        phone: "+91 98765 43210",
        segment: "Corporate Catering",
        status: "Negotiation",
        value: 12500,
        notes:
          "Requested premium Bento lunches for 150 VIP executives at the company annual gala on July 10th. Demanding high-end presentation and custom organic, vegan boxes.",
        createdAt: "2026-06-20",
        lastFollowUp: "2026-06-25",
        companyName: "Infosys Technologies",
      },
      {
        id: "lead_2",
        name: "Sunita Mehrotra",
        email: "sunita@bangalorevents.in",
        phone: "+91 87654 32109",
        segment: "Party Bookings",
        status: "Proposal Sent",
        value: 8200,
        notes:
          "Birthday celebration catering for 80 guests. Needs custom chaat stations, live dosa bars, and premium mithai dessert jars from our virtual dessert brands.",
        createdAt: "2026-06-22",
        lastFollowUp: "2026-06-26",
        companyName: "Bangalore Events Co",
      },
      {
        id: "lead_3",
        name: "Vikram Khanna",
        email: "vikram@eatindia.com",
        phone: "+91 76543 21098",
        segment: "Franchise Queries",
        status: "Contacted",
        value: 45e3,
        notes:
          "National operator interested in licensing our Virtual Biryani Labs & Pizza Labs brands for expansion in Delhi and Jaipur. Needs detailed CAPEX report.",
        createdAt: "2026-06-24",
        lastFollowUp: "2026-06-24",
        companyName: "Eat India Hospitality Group",
      },
      {
        id: "lead_4",
        name: "Rohit Kapoor",
        email: "rohit@kapoorgroup.in",
        phone: "+91 65432 10987",
        segment: "VIP Memberships",
        status: "New",
        value: 3500,
        notes:
          "High-net-worth individual looking to establish a corporate dining subscription for his executive suite in BKC Mumbai. Prefers premium cuts and custom delivery timing.",
        createdAt: "2026-06-26",
        lastFollowUp: "Never",
        companyName: "Kapoor Group BKC",
      },
      {
        id: "lead_5",
        name: "Aditya Choudhary",
        email: "aditya@techbengaluru.io",
        phone: "+91 54321 09876",
        segment: "Corporate Catering",
        status: "Won",
        value: 15e3,
        notes:
          "Tech meetup event catering (recurring contract). Delivered successfully last night! Excellent feedback on the slider stations and biryani pots. Lead closed as Won.",
        createdAt: "2026-06-18",
        lastFollowUp: "2026-06-26",
        companyName: "TechBengaluru Hub",
      },
      {
        id: "lead_6",
        name: "Meera Iyer",
        email: "meera@bangaloreweddings.in",
        phone: "+91 93456 78901",
        segment: "Party Bookings",
        status: "Lost",
        value: 22e3,
        notes:
          "Bangalore Wedding catering query. Lost due to pricing clash. They went with a traditional banquet hall service instead of a cloud kitchen setup.",
        createdAt: "2026-06-10",
        lastFollowUp: "2026-06-15",
        companyName: "Bangalore Luxury Weddings",
      },
    ];
  });
  const [settings, setSettings] = useState(() => {
    return {
      accessToken: "EAAG9zZA290sABAHf9zC...4ZBZB6",
      phoneNumberId: "109283748293021",
      businessAccountId: "392817283921029",
      webhookVerifyToken: "globaleats_verification_key_2026",
      status: "connected",
    };
  });
  const [templates, setTemplates] = useState(() => {
    if (!USE_MOCK) return [];
    return [
      {
        id: "tpl_order_confirmation",
        name: "ORDER_CONFIRMATION_V1",
        category: "UTILITY",
        language: "en_US",
        body: "Hi {{1}}! Your order {{2}} from QuikaBite has been successfully received and is now cooking 🧑‍🍳. Total amount is ₹ {{3}}. Click below to track live.",
        footer: "Thank you for choosing QuikaBite!",
        buttons: [
          {
            type: "URL",
            text: "Track Order Live 📍",
            value: "https://quikabite.app/track",
          },
          { type: "QUICK_REPLY", text: "Chat Support 💬" },
        ],
        status: "APPROVED",
        updatedAt: "2026-06-25 14:32",
      },
      {
        id: "tpl_weekend_feast",
        name: "WEEKEND_FEAST_50",
        category: "MARKETING",
        language: "en_US",
        body: "Hey {{1}}! Weekend plans? We got you sorted! 🍔 Craving juicy burgers or spicy biryanis? Use code FEAST50 to get flat 50% OFF up to ₹ 25 on your order today!",
        footer: "Valid only until Sunday 11:59 PM.",
        buttons: [
          {
            type: "URL",
            text: "Order Now 🍕",
            value: "https://quikabite.app/offers",
          },
        ],
        status: "APPROVED",
        updatedAt: "2026-06-26 10:15",
      },
      {
        id: "tpl_welcome_diner",
        name: "WELCOME_NEW_DINER",
        category: "MARKETING",
        language: "en_US",
        body: "Welcome to QuikaBite family, {{1}}! 🎉 We are thrilled to have you onboard. Here is a sweet welcome treat: Use code WELCOME01 to get FREE delivery on your first 3 orders!",
        footer: "Explore 50+ premium virtual kitchen brands.",
        buttons: [
          { type: "QUICK_REPLY", text: "View Menu 📋" },
          { type: "QUICK_REPLY", text: "Unsubscribe ❌" },
        ],
        status: "APPROVED",
        updatedAt: "2026-06-24 09:00",
      },
      {
        id: "tpl_feedback_loop",
        name: "DELIVERY_FEEDBACK",
        category: "UTILITY",
        language: "en_US",
        body: "Hi {{1}}, hope you loved your meal from {{2}}! ⭐️ How would you rate the taste and delivery? Help us improve by rating with a quick tap below.",
        footer: "Takes only 10 seconds.",
        buttons: [
          { type: "QUICK_REPLY", text: "⭐⭐⭐⭐⭐ Loved It!" },
          { type: "QUICK_REPLY", text: "⭐⭐⭐ Average" },
          { type: "QUICK_REPLY", text: "⭐ Needs Work" },
        ],
        status: "APPROVED",
        updatedAt: "2026-06-23 16:45",
      },
    ];
  });
  const [contacts, setContacts] = useState(() => {
    if (!USE_MOCK) return [];
    return [
      {
        id: "c_1",
        name: "Ananya Singh",
        phone: "+91 98765 43210",
        tags: ["High Spender", "Burger Lover", "Active"],
        optIn: true,
        createdAt: "2026-06-20",
      },
      {
        id: "c_2",
        name: "Kabir Verma",
        phone: "+91 87654 32109",
        tags: ["Vegan", "Healthy", "Active"],
        optIn: true,
        createdAt: "2026-06-21",
      },
      {
        id: "c_3",
        name: "Shruti Desai",
        phone: "+91 76543 21098",
        tags: ["Dessert Enthusiast", "Active"],
        optIn: true,
        createdAt: "2026-06-22",
      },
      {
        id: "c_4",
        name: "Deepika Nair",
        phone: "+91 65432 10987",
        tags: ["Dormant", "Biryani Fan"],
        optIn: false,
        createdAt: "2026-06-18",
      },
      {
        id: "c_5",
        name: "Sneha Iyer",
        phone: "+91 54321 09876",
        tags: ["High Spender", "Biryani Fan", "Active"],
        optIn: true,
        createdAt: "2026-06-24",
      },
      {
        id: "c_6",
        name: "Arjun Kapoor",
        phone: "+91 93456 78901",
        tags: ["High Spender", "Burger Lover"],
        optIn: true,
        createdAt: "2026-06-25",
      },
    ];
  });
  const [campaigns, setCampaigns] = useState(() => {
    if (!USE_MOCK) return [];
    return [
      {
        id: "camp_1",
        name: "Ramadan Biryani Feast",
        templateId: "tpl_weekend_feast",
        targetSegment: "Biryani Fan",
        status: "COMPLETED",
        recipientsCount: 12,
        openRate: "91.6%",
        clickRate: "58.3%",
        sentAt: "2026-06-15 19:30",
      },
      {
        id: "camp_2",
        name: "Weekend Gourmet Promo Blast",
        templateId: "tpl_weekend_feast",
        targetSegment: "High Spender",
        status: "COMPLETED",
        recipientsCount: 24,
        openRate: "95.8%",
        clickRate: "70.8%",
        sentAt: "2026-06-22 12:00",
      },
      {
        id: "camp_3",
        name: "Dormant User Re-engagement",
        templateId: "tpl_welcome_diner",
        targetSegment: "Dormant",
        status: "SCHEDULED",
        recipientsCount: 8,
        sentAt: "2026-06-28 10:00",
      },
    ];
  });
  const [automations, setAutomations] = useState(() => {
    if (!USE_MOCK) return [];
    return [
      {
        id: "auto_1",
        name: "New Customer Welcome Sequence 🎁",
        triggerEvent: "New customer",
        delay: "Instant",
        templateId: "tpl_welcome_diner",
        isActive: true,
        createdAt: "2026-06-22",
        actions: [
          {
            id: "act_1_1",
            type: "SEND_MESSAGE",
            config: {
              templateId: "tpl_welcome_diner",
            },
          },
          {
            id: "act_1_2",
            type: "SEND_COUPON",
            config: {
              couponCode: "WELCOME30",
              discount: "30% OFF",
            },
          },
        ],
      },
      {
        id: "auto_2",
        name: "Post-Delivery Feedback Loop 🛵",
        triggerEvent: "Order delivered",
        delay: "Instant",
        templateId: "tpl_feedback_loop",
        isActive: true,
        createdAt: "2026-06-23",
        actions: [
          {
            id: "act_2_1",
            type: "SEND_MESSAGE",
            config: {
              templateId: "tpl_feedback_loop",
            },
          },
          {
            id: "act_2_2",
            type: "SEND_REMINDER",
            config: {
              reminderText: "How was your delivery? Rate us now! ⭐⭐⭐⭐⭐",
              delay: "2 hours",
            },
          },
        ],
      },
      {
        id: "auto_3",
        name: "Dormant Customer Win-Back Flow 🔄",
        triggerEvent: "No order in 30 days",
        delay: "30 days",
        templateId: "tpl_weekend_feast",
        isActive: true,
        createdAt: "2026-06-24",
        actions: [
          {
            id: "act_3_1",
            type: "SEND_COUPON",
            config: {
              couponCode: "MISSEDYOU50",
              discount: "50% OFF up to ₹ 30",
            },
          },
          {
            id: "act_3_2",
            type: "SEND_REMINDER",
            config: {
              reminderText:
                "We miss your cravings! Use code MISSEDYOU50 before it expires tomorrow! ⏳",
              delay: "2 days",
            },
          },
        ],
      },
    ];
  });
  const [logs, setLogs] = useState(() => {
    if (!USE_MOCK) return [];
    return [
      {
        id: "l_1",
        direction: "system",
        phone: "System",
        message: "WhatsApp Business API Server Connection Established.",
        status: "connected",
        timestamp: "10:02:14",
      },
      {
        id: "l_2",
        direction: "outgoing",
        phone: "+91 98765 43210",
        message: "Template: ORDER_CONFIRMATION_V1 to Ananya Singh",
        status: "read",
        timestamp: "10:15:32",
      },
      {
        id: "l_3",
        direction: "incoming",
        phone: "+91 98765 43210",
        message: 'Button Clicked: "Track Order Live 📍"',
        status: "received",
        timestamp: "10:16:01",
      },
      {
        id: "l_4",
        direction: "outgoing",
        phone: "+91 87654 32109",
        message: "Template: DELIVERY_FEEDBACK to Kabir Verma",
        status: "delivered",
        timestamp: "10:45:12",
      },
      {
        id: "l_5",
        direction: "incoming",
        phone: "+91 87654 32109",
        message: 'Button Clicked: "⭐⭐⭐⭐⭐ Loved It!"',
        status: "received",
        timestamp: "10:46:19",
      },
    ];
  });
  useEffect(() => {
    const loadMarketingData = async () => {
      const data = await adminService.getMarketingData();
      if (data.leads && data.leads.length > 0) setLeads(data.leads);
      if (data.whatsappSettings) setSettings(data.whatsappSettings);
      if (data.templates && data.templates.length > 0)
        setTemplates(data.templates);
      if (data.contacts && data.contacts.length > 0) setContacts(data.contacts);
      if (data.campaigns && data.campaigns.length > 0)
        setCampaigns(data.campaigns);
      if (data.automations && data.automations.length > 0)
        setAutomations(data.automations);

      const segs = await adminService.getMarketingSegments();
      if (segs && segs.length > 0) setSegments(segs);
    };
    loadMarketingData();
  }, []);

  useEffect(() => {
    adminService.saveMarketingWhatsAppSettings(settings);
  }, [settings]);
  useEffect(() => {
    if (templates.length > 0) {
      adminService.saveMarketingTemplates(templates);
    }
  }, [templates]);
  useEffect(() => {
    if (contacts.length > 0) {
      adminService.saveMarketingContacts(contacts);
    }
  }, [contacts]);
  useEffect(() => {
    if (campaigns.length > 0) {
      adminService.saveMarketingCampaigns(campaigns);
    }
  }, [campaigns]);
  useEffect(() => {
    if (automations.length > 0) {
      adminService.saveMarketingAutomations(automations);
    }
  }, [automations]);
  useEffect(() => {
    if (leads.length > 0) {
      adminService.saveMarketingLeads(leads);
    }
  }, [leads]);

  // WhatsApp Console (Tab 1) States & Handlers
  const [dashStats, setDashStats] = useState(null);
  const [isSyncingMeta, setIsSyncingMeta] = useState(false);
  const [isSendingTestMsg, setIsSendingTestMsg] = useState(false);
  const [isClearingLogs, setIsClearingLogs] = useState(false);
  const [isVerifyingWebhook, setIsVerifyingWebhook] = useState(false);
  const [webhookVerified, setWebhookVerified] = useState(false);

  useEffect(() => {
    if (activeSubTab === "whatsapp") {
      const fetchWhatsAppConsoleData = async () => {
        const stats = await adminService.getWhatsAppDashboardStats();
        if (stats) setDashStats(stats);

        const tpls = await adminService.getWhatsAppTemplates();
        if (Array.isArray(tpls) && tpls.length > 0) {
          const normalized = tpls.map((t) => ({
            ...t,
            id: t.id || t._id || t.name,
            name: t.name || t.id || t._id,
            category: t.category || "MARKETING",
            body: t.body || (Array.isArray(t.components) ? t.components.find((c) => c.type === "BODY")?.text : "") || "",
          }));
          setTemplates(normalized);
          setTestTemplateId(normalized[0].id || normalized[0].name);
        }

        const logsData = await adminService.getWhatsAppLogs();
        if (Array.isArray(logsData) && logsData.length > 0) setLogs(logsData);
      };
      fetchWhatsAppConsoleData();
    }
  }, [activeSubTab]);

  const handleSyncCredentials = async () => {
    setIsSyncingMeta(true);
    try {
      await adminService.syncWhatsAppCredentials();
      setSettings((prev) => ({ ...prev, status: "connected" }));
      triggerToast("Relayed cloud credentials. Node connection secure.");
    } catch (err) {
      console.error("Sync failed:", err);
      triggerToast(err?.message || "Failed to synchronize credentials.");
    } finally {
      setIsSyncingMeta(false);
    }
  };

  const handleVerifyWebhook = async () => {
    setIsVerifyingWebhook(true);
    try {
      await adminService.verifyWhatsAppWebhook({
        name: "VIP Burger Lovers",
        description: "People who ordered burgers more than 5 times",
        consentRule: "Opted-In",
        selectedTags: ["VIP", "Burger Lover"],
      });
      setWebhookVerified(true);
      triggerToast("Meta Webhook Verification handle succeeded! (200 OK)");
    } catch (err) {
      console.error("Webhook verify failed:", err);
      triggerToast("Webhook verification failed.");
    } finally {
      setIsVerifyingWebhook(false);
    }
  };

  const handleClearLogs = async () => {
    setIsClearingLogs(true);
    try {
      await adminService.clearWhatsAppLogs();
      setLogs([]);
      triggerToast("Sandbox console logs cleared.");
    } catch (err) {
      console.error("Clear logs failed:", err);
      triggerToast("Failed to clear console logs.");
    } finally {
      setIsClearingLogs(false);
    }
  };

  const totalContactsCount = dashStats?.totalContacts ?? (USE_MOCK ? contacts.length : 0);
  const campaignsCount = dashStats?.campaignsCount ?? (USE_MOCK ? campaigns.length : 0);
  const messagesSentCount =
    dashStats?.messagesSent ??
    (USE_MOCK
      ? campaigns.reduce((acc, c) => acc + (c.recipientsCount || 0), 0) + 1424
      : 0);
  const completedCamps = campaigns.filter(
    (c) => c.status === "COMPLETED" && c.openRate,
  );
  const averageOpenRate =
    dashStats?.averageOpenRate ??
    (USE_MOCK
      ? completedCamps.length > 0
        ? (
            completedCamps.reduce(
              (acc, c) => acc + parseFloat(c.openRate || "0"),
              0,
            ) / completedCamps.length
          ).toFixed(1) + "%"
        : "94.8%"
      : "0%");

  const [testPhone, setTestPhone] = useState("");
  const [testTemplateId, setTestTemplateId] = useState("");
  const [testVariables, setTestVariables] = useState(["", "", "", ""]);

  const selectedTestTemplate =
    templates.find((t) => (t.id || t.name) === testTemplateId) ||
    templates[0];

  const handleSelectTestTemplate = async (templateId) => {
    setTestTemplateId(templateId);
    setTestVariables(["", "", "", ""]);
    const tplObj = templates.find((t) => (t.id || t.name) === templateId);
    if (tplObj?.name) {
      const detail = await adminService.getWhatsAppTemplateByName(tplObj.name);
      if (detail && detail.body) {
        setTemplates((prev) =>
          prev.map((t) => ((t.id || t.name) === templateId ? { ...t, ...detail } : t)),
        );
      }
    }
  };

  const handleSendTestMessage = async (e) => {
    e.preventDefault();
    if (!testPhone) {
      triggerToast("Please enter a recipient phone number.");
      return;
    }
    if (!selectedTestTemplate) {
      triggerToast("Please select a template.");
      return;
    }

    setIsSendingTestMsg(true);
    try {
      let renderedBody = selectedTestTemplate.body || "";
      const variableMatches = Array.from(
        new Set(renderedBody.match(/\{\{\d+\}\}/g) || []),
      );
      const bodyVarCount = variableMatches.length;

      const isImageTemplate = Boolean(
        selectedTestTemplate?.name?.toLowerCase().includes("image") ||
          selectedTestTemplate?.headerType === "IMAGE" ||
          selectedTestTemplate?.components?.some(
            (c) => c.type === "HEADER" && (c.format === "IMAGE" || c.format === "MEDIA"),
          ),
      );

      const varObj = {};
      let paramIdx = 1;

      if (isImageTemplate) {
        varObj[String(paramIdx)] =
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80";
        paramIdx++;
      }

      if (bodyVarCount > 0) {
        for (let i = 0; i < bodyVarCount; i++) {
          const val = testVariables[i]?.trim() || `[Var ${i + 1}]`;
          varObj[String(paramIdx)] = val;
          renderedBody = renderedBody.replace(
            new RegExp(`\\{\\{${i + 1}\\}\\}`, "g"),
            val,
          );
          paramIdx++;
        }
      }

      const cleanPhone = testPhone.trim();

      await adminService.sendWhatsAppTemplate({
        phone: cleanPhone,
        template: selectedTestTemplate.name,
        variables: varObj,
      });

      const newLogId = "l_" + Date.now();
      const now = /* @__PURE__ */ new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const outgoingLog = {
        id: newLogId,
        direction: "outgoing",
        phone: cleanPhone,
        message: `Template: ${selectedTestTemplate.name} -> Body: "${renderedBody}"`,
        status: "sent",
        timestamp: timeStr,
      };
      setLogs((prev) => [outgoingLog, ...prev]);
      triggerToast(
        `WhatsApp sent to ${cleanPhone} using ${selectedTestTemplate.name}!`,
      );
      setTimeout(() => {
        setLogs((prev) =>
          prev.map((log) =>
            log.id === newLogId ? { ...log, status: "delivered" } : log,
          ),
        );
      }, 1500);
      setTimeout(() => {
        setLogs((prev) =>
          prev.map((log) =>
            log.id === newLogId ? { ...log, status: "read" } : log,
          ),
        );
      }, 3500);
    } catch (err) {
      console.error("Send test message failed:", err);
      const errMsg = parseApiError(err, "Failed to transmit WhatsApp message.");
      triggerToast(errMsg);
    } finally {
      setIsSendingTestMsg(false);
    }
  };
  const [campaignName, setCampaignName] = useState("");
  const [campaignTemplateId, setCampaignTemplateId] = useState(
    templates[0]?.id || "",
  );
  const [campaignSegment, setCampaignSegment] = useState("All");
  const [campaignSchedule, setCampaignSchedule] = useState("instant");
  const [campaignScheduleTime, setCampaignScheduleTime] = useState("");
  const [campaignFrequency, setCampaignFrequency] = useState("one-time");
  const [campaignLocalTimezone, setCampaignLocalTimezone] = useState(true);
  const [activeSimulatorCampId, setActiveSimulatorCampId] = useState(null);
  const [simulatorStep, setSimulatorStep] = useState("");
  const [simulatorProgress, setSimulatorProgress] = useState(0);
  const [campaignSearch, setCampaignSearch] = useState("");
  const debouncedCampaignSearch = useDebounce(campaignSearch, 300);
  const [campaignStatusFilter, setCampaignStatusFilter] = useState("ALL");
  const [expandedCampaignMessageId, setExpandedCampaignMessageId] =
    useState(null);
  const [reschedulingCampaignId, setReschedulingCampaignId] = useState(null);
  const [tempRescheduleTime, setTempRescheduleTime] = useState("");
  const [showCampaignRecipientList, setShowCampaignRecipientList] =
    useState(false);
  const allTags = Array.from(new Set(contacts.flatMap((c) => c.tags)));
  const getMatchingContactsForCampaign = (targetSegId) => {
    return contacts.filter((c) => {
      if (!c.optIn) return false;
      if (targetSegId === "All") return true;
      const activeSegment = segments.find((s) => s.id === targetSegId);
      if (activeSegment) {
        if (activeSegment.optInOnly === "optin" && !c.optIn) return false;
        if (activeSegment.optInOnly === "optout" && c.optIn) return false;
        if (activeSegment.matchingTags.length > 0) {
          return activeSegment.matchingTags.some((tag) => c.tags.includes(tag));
        }
        return true;
      }
      return c.tags.includes(targetSegId);
    });
  };
  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!campaignName.trim()) {
      triggerToast("Please enter a campaign name.");
      return;
    }
    const recs = getMatchingContactsForCampaign(campaignSegment);
    const isInstant = campaignSchedule === "instant";
    const now = /* @__PURE__ */ new Date();
    const formattedNow =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      " " +
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");
    const newCampaign = {
      id: "camp_" + Date.now(),
      name: campaignName.trim(),
      templateId: campaignTemplateId,
      targetSegment: campaignSegment,
      status: isInstant ? "DRAFT" : "SCHEDULED",
      recipientsCount: recs.length,
      sentAt: isInstant ? void 0 : campaignScheduleTime || formattedNow,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    setCampaignName("");
    setCampaignSchedule("instant");
    setCampaignScheduleTime("");
    setCampaignFrequency("one-time");
    triggerToast(
      isInstant
        ? `Draft Campaign "${newCampaign.name}" created targeting ${recs.length} diners!`
        : `Scheduled Campaign "${newCampaign.name}" targeting ${recs.length} diners for ${newCampaign.sentAt}!`,
    );
  };
  const handleDuplicateCampaign = (camp) => {
    setCampaignName(`${camp.name} (Copy)`);
    setCampaignTemplateId(camp.templateId);
    setCampaignSegment(camp.targetSegment);
    setCampaignSchedule("instant");
    setActiveSubTab?.("campaigns");
    triggerToast(`Loaded settings from "${camp.name}" to creation wizard!`);
  };
  const handleSaveReschedule = (campId, newTime) => {
    if (!newTime) {
      triggerToast("Please select a valid date and time.");
      return;
    }
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campId ? { ...c, sentAt: newTime.replace("T", " ") } : c,
      ),
    );
    setReschedulingCampaignId(null);
    setTempRescheduleTime("");
    triggerToast("Campaign broadcast rescheduled successfully!");
  };
  const handlePauseCampaign = (campId) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campId ? { ...c, status: "DRAFT" } : c)),
    );
    triggerToast("Campaign converted back to Draft and paused.");
  };
  const triggerCampaignSendingSim = (campId) => {
    const camp = campaigns.find((c) => c.id === campId);
    if (!camp) return;
    setActiveSimulatorCampId(campId);
    setSimulatorProgress(10);
    setSimulatorStep("Connecting to Meta Cloud WhatsApp API Gateways...");
    setTimeout(() => {
      setSimulatorProgress(35);
      setSimulatorStep(
        `Identifying opt-in phone numbers tagged as "${camp.targetSegment}"...`,
      );
    }, 1200);
    setTimeout(() => {
      setSimulatorProgress(65);
      setSimulatorStep(
        `Broadcasting template "${templates.find((t) => t.id === camp.templateId)?.name}" to ${camp.recipientsCount} phone(s)...`,
      );
      const now = /* @__PURE__ */ new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const newLogs = [
        {
          id: "camp_log_" + Date.now() + "_1",
          direction: "outgoing",
          phone:
            camp.recipientsCount > 0 ? contacts[0].phone : "+91 XXXXXXXXXX",
          message: `Campaign Blast "${camp.name}": Sent template message`,
          status: "sent",
          timestamp: timeStr,
        },
      ];
      setLogs((prev) => [...newLogs, ...prev]);
    }, 2500);
    setTimeout(() => {
      setSimulatorProgress(100);
      setSimulatorStep("Completed! WhatsApp API delivered confirmation.");
    }, 4e3);
    setTimeout(() => {
      const now = /* @__PURE__ */ new Date();
      const timestamp =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        " " +
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campId
            ? {
                ...c,
                status: "COMPLETED",
                sentAt: timestamp,
                openRate:
                  80 +
                  Math.floor(Math.random() * 18) +
                  "." +
                  Math.floor(Math.random() * 9) +
                  "%",
                clickRate:
                  40 +
                  Math.floor(Math.random() * 35) +
                  "." +
                  Math.floor(Math.random() * 9) +
                  "%",
              }
            : c,
        ),
      );
      setActiveSimulatorCampId(null);
      triggerToast(
        `Campaign "${camp.name}" has finished sending successfully!`,
      );
    }, 5e3);
  };
  const handleDeleteCampaign = (id, name) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    triggerToast(`Campaign "${name}" deleted.`);
  };
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactTagsString, setNewContactTagsString] = useState("");
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const debouncedContactSearchQuery = useDebounce(contactSearchQuery, 300);
  const [contactActiveFilterTag, setContactActiveFilterTag] = useState("All");
  const [selectedContactId, setSelectedContactId] = useState("c_1");
  const [segments, setSegments] = useState(() => {
    return [
      {
        id: "seg_all",
        name: "All Diners 👥",
        matchingTags: [],
        optInOnly: "all",
      },
      {
        id: "seg_vip",
        name: "VIP High Spenders 💎",
        matchingTags: ["High Spender"],
        optInOnly: "optin",
      },
      {
        id: "seg_vegan",
        name: "Healthy & Vegan 🌱",
        matchingTags: ["Vegan", "Healthy"],
        optInOnly: "all",
      },
      {
        id: "seg_burgers",
        name: "Burger Lovers 🍔",
        matchingTags: ["Burger Lover"],
        optInOnly: "all",
      },
      {
        id: "seg_dormant",
        name: "Dormant Users 💤",
        matchingTags: ["Dormant"],
        optInOnly: "all",
      },
      {
        id: "seg_unsub",
        name: "Opted Out / Unsubscribed 🛑",
        matchingTags: [],
        optInOnly: "optout",
      },
    ];
  });
  useEffect(() => {
    if (segments.length > 0) {
      adminService.saveMarketingSegments(segments);
    }
  }, [segments]);
  const [selectedSegmentId, setSelectedSegmentId] = useState("seg_all");
  const [newSegmentName, setNewSegmentName] = useState("");
  const [newSegmentTags, setNewSegmentTags] = useState([]);
  const [newSegmentOptIn, setNewSegmentOptIn] = useState("all");
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [showBulkImportForm, setShowBulkImportForm] = useState(false);
  const [showSegmentCreator, setShowSegmentCreator] = useState(false);
  const [crmMsgTemplateId, setCrmMsgTemplateId] = useState(
    templates[0]?.id || "",
  );
  const [crmMsgVar1, setCrmMsgVar1] = useState("");
  const [crmMsgVar2, setCrmMsgVar2] = useState("");
  const [crmNewTag, setCrmNewTag] = useState("");
  const [bulkPasteText, setBulkPasteText] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState("lead_1");
  const [leadFilterStatus, setLeadFilterStatus] = useState("all");
  const [leadFilterSegment, setLeadFilterSegment] = useState("all");
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const debouncedLeadSearchQuery = useDebounce(leadSearchQuery, 300);
  const [leadViewMode, setLeadViewMode] = useState("list");
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadSegment, setNewLeadSegment] = useState("Corporate Catering");
  const [newLeadValue, setNewLeadValue] = useState("");
  const [newLeadStatus, setNewLeadStatus] = useState("New");
  const [newLeadNotes, setNewLeadNotes] = useState("");
  const [followUpNoteText, setFollowUpNoteText] = useState("");
  const [whatsappLeadTemplateId, setWhatsappLeadTemplateId] = useState(
    templates[0]?.id || "",
  );
  const [whatsappLeadVar1, setWhatsappLeadVar1] = useState("");
  const [leadsTimeline, setLeadsTimeline] = useState({});
  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const cached = await adminService.getMarketingLeadsTimeline();
        if (cached) setLeadsTimeline(cached);
      } catch (e) {
        console.error("Failed to load leads timeline:", e);
      }
    };
    loadTimeline();
  }, []);
  useEffect(() => {
    const syncTimeline = async () => {
      if (leadsTimeline && Object.keys(leadsTimeline).length > 0) {
        await adminService.saveMarketingLeadsTimeline(leadsTimeline);
      }
    };
    syncTimeline();
  }, [leadsTimeline]);
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) {
      triggerToast("Please provide name and phone.");
      return;
    }
    const tagsArr = newContactTagsString
      ? newContactTagsString
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : ["Imported"];
    const newContact = {
      id: "c_" + Date.now(),
      name: newContactName,
      phone: newContactPhone,
      tags: tagsArr,
      optIn: true,
      createdAt: /* @__PURE__ */ new Date().toISOString().split("T")[0],
    };
    setContacts((prev) => [newContact, ...prev]);
    setNewContactName("");
    setNewContactPhone("");
    setNewContactTagsString("");
    triggerToast(`Added contact "${newContact.name}" to directory.`);
  };
  const handleBulkImport = () => {
    if (!bulkPasteText.trim()) {
      triggerToast("Paste some text first!");
      return;
    }
    const lines = bulkPasteText.split("\n");
    let importedCount = 0;
    const newContactsList = [];
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      let parts = trimmed.split(",");
      if (parts.length < 2) parts = trimmed.split("	");
      if (parts.length < 2) parts = trimmed.split(";");
      const name = parts[0]?.trim();
      const phone = parts[1]?.trim() || "+91 98765 43210";
      const rawTags = parts[2]?.trim() || "Bulk Import";
      const tags = rawTags
        .split("|")
        .map((t) => t.trim())
        .filter(Boolean);
      if (name) {
        newContactsList.push({
          id: "c_bulk_" + Math.random().toString(36).substr(2, 9),
          name,
          phone,
          tags: tags.length > 0 ? tags : ["Bulk Import"],
          optIn: true,
          createdAt: /* @__PURE__ */ new Date().toISOString().split("T")[0],
        });
        importedCount++;
      }
    });
    if (newContactsList.length > 0) {
      setContacts((prev) => [...newContactsList, ...prev]);
      setBulkPasteText("");
      setShowBulkModal(false);
      triggerToast(
        `Successfully imported ${importedCount} contacts from list!`,
      );
    } else {
      triggerToast(
        "Failed to parse contacts. Check formatting (Name, Phone, Tag1|Tag2).",
      );
    }
  };
  const handleDeleteContact = (id, name) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    triggerToast(`Contact "${name}" removed from directory.`);
  };
  const toggleContactOptIn = (id) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextOpt = !c.optIn;
          triggerToast(
            `${nextOpt ? "Opted-in" : "Opted-out"} contact "${c.name}"`,
          );
          return { ...c, optIn: nextOpt };
        }
        return c;
      }),
    );
  };
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(debouncedContactSearchQuery.toLowerCase()) ||
      c.phone
        .replace(/\s+/g, "")
        .includes(debouncedContactSearchQuery.replace(/\s+/g, ""));
    const matchesTag =
      contactActiveFilterTag === "All" ||
      c.tags.includes(contactActiveFilterTag);
    const activeSegment = segments.find((s) => s.id === selectedSegmentId);
    let matchesSegment = true;
    if (activeSegment) {
      if (activeSegment.optInOnly === "optin" && !c.optIn)
        matchesSegment = false;
      if (activeSegment.optInOnly === "optout" && c.optIn)
        matchesSegment = false;
      if (activeSegment.matchingTags.length > 0) {
        const hasMatchingTag = activeSegment.matchingTags.some((tag) =>
          c.tags.includes(tag),
        );
        if (!hasMatchingTag) matchesSegment = false;
      }
    }
    return matchesSearch && matchesTag && matchesSegment;
  });
  const handleCreateSegment = (e) => {
    e.preventDefault();
    if (!newSegmentName.trim()) {
      triggerToast("Please enter a segment name.");
      return;
    }
    const newSeg = {
      id: "seg_" + Date.now(),
      name: newSegmentName,
      matchingTags: newSegmentTags,
      optInOnly: newSegmentOptIn,
    };
    setSegments((prev) => [...prev, newSeg]);
    setNewSegmentName("");
    setNewSegmentTags([]);
    setNewSegmentOptIn("all");
    setShowSegmentCreator(false);
    setSelectedSegmentId(newSeg.id);
    triggerToast(`Created smart segment "${newSeg.name}"!`);
  };
  const handleDeleteSegment = (id, name) => {
    if (
      id === "seg_all" ||
      id === "seg_vip" ||
      id === "seg_vegan" ||
      id === "seg_burgers" ||
      id === "seg_dormant" ||
      id === "seg_unsub"
    ) {
      triggerToast("Default segments cannot be deleted.");
      return;
    }
    setSegments((prev) => prev.filter((s) => s.id !== id));
    if (selectedSegmentId === id) {
      setSelectedSegmentId("seg_all");
    }
    triggerToast(`Segment "${name}" deleted.`);
  };
  const handleRemoveTagFromContact = (contactId, tagToRemove) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            tags: c.tags.filter((t) => t !== tagToRemove),
          };
        }
        return c;
      }),
    );
    triggerToast(`Tag "${tagToRemove}" removed.`);
  };
  const handleAddTagToContact = (contactId, tagToAdd) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          if (c.tags.includes(trimmed)) return c;
          return {
            ...c,
            tags: [...c.tags, trimmed],
          };
        }
        return c;
      }),
    );
    setCrmNewTag("");
    triggerToast(`Added tag "${trimmed}".`);
  };
  const handleSendCrmMessage = (contact) => {
    const templ = templates.find((t) => t.id === crmMsgTemplateId);
    if (!templ) {
      triggerToast("Please select a template.");
      return;
    }
    let rendered = templ.body;
    rendered = rendered.replace("{{1}}", contact.name);
    rendered = rendered.replace("{{2}}", crmMsgVar2 || "QuikaBite Kitchen");
    const newLogId = "l_" + Date.now();
    const now = /* @__PURE__ */ new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const outgoingLog = {
      id: newLogId,
      direction: "outgoing",
      phone: contact.phone,
      message: `Direct Message to ${contact.name} -> "${rendered}"`,
      status: "sent",
      timestamp: timeStr,
    };
    setLogs((prev) => [outgoingLog, ...prev]);
    triggerToast(`Sent WhatsApp to ${contact.name}!`);
    setTimeout(() => {
      setLogs((prev) =>
        prev.map((log) =>
          log.id === newLogId ? { ...log, status: "delivered" } : log,
        ),
      );
    }, 1200);
    setTimeout(() => {
      setLogs((prev) =>
        prev.map((log) =>
          log.id === newLogId ? { ...log, status: "read" } : log,
        ),
      );
    }, 2800);
  };
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("MARKETING");
  const [newTemplateHeaderType, setNewTemplateHeaderType] = useState("NONE");
  const [newTemplateHeaderText, setNewTemplateHeaderText] = useState("");
  const [newTemplateHeaderImgUrl, setNewTemplateHeaderImgUrl] = useState("");
  const [newTemplateBody, setNewTemplateBody] = useState("");
  const [newTemplateFooter, setNewTemplateFooter] = useState("");
  const [newTemplateButtonsText, setNewTemplateButtonsText] = useState("");
  const [newTemplateButtons, setNewTemplateButtons] = useState([]);
  const [templatePreviewMode, setTemplatePreviewMode] = useState("FILLED");
  const [previewVal1, setPreviewVal1] = useState("Alex");
  const [previewVal2, setPreviewVal2] = useState("FEAST50");
  const [previewVal3, setPreviewVal3] = useState("₹ 25.00");
  const [previewVal4, setPreviewVal4] = useState("QuikaBite");
  const [selectedPreviewTemplateId, setSelectedPreviewTemplateId] =
    useState(null);
  const [isApprovingTemplate, setIsApprovingTemplate] = useState(false);
  const [approvalProgress, setApprovalProgress] = useState(0);
  const [approvalStepText, setApprovalStepText] = useState("");
  const templatePresets = [
    {
      id: "welcome",
      title: "Welcome Gift 🎁",
      name: "WELCOME_DINER_GIFT",
      category: "MARKETING",
      headerType: "TEXT",
      headerText: "WELCOME GIFT",
      body: "Welcome to the QuikaBite family, {{1}}! 🍕 We're thrilled to have you dine with us. Enjoy flat {{2}}% OFF on your first 3 orders of gourmet meals. Tap below to start exploring menus!",
      footer: "Terms and conditions apply.",
      buttons: [
        { type: "QUICK_REPLY", text: "Explore Menu 📋" },
        { type: "QUICK_REPLY", text: "Unsubscribe ❌" },
      ],
    },
    {
      id: "offers",
      title: "Weekend Flash Promo 🍟",
      name: "WEEKEND_FLASH_50",
      category: "MARKETING",
      headerType: "IMAGE",
      headerImgUrl:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
      body: "Hey {{1}}! 🍟 Weekend craving hitting hard? Use code {{2}} on the checkout page to grab a massive discount of {{3}} on orders above ₹ 60! Valid across all 40+ cloud kitchens today only.",
      footer: "Valid until Sunday midnight.",
      buttons: [
        {
          type: "URL",
          text: "Order Now 🍔",
          value: "https://quikabite.app/offers",
        },
      ],
    },
    {
      id: "festival",
      title: "Festival Wishes 🌙✨",
      name: "EID_FESTIVAL_FEAST",
      category: "MARKETING",
      headerType: "TEXT",
      headerText: "FESTIVAL SPECIAL",
      body: "Eid Mubarak to you and your loved ones from QuikaBite, {{1}}! 🌙✨ Let us sweeten your celebrations! Get a complimentary dessert with any main course order using code {{2}}. Make it a memorable feast!",
      footer: "Valid on all deliveries during festival holidays.",
      buttons: [
        { type: "QUICK_REPLY", text: "Claim Dessert 🍰" },
        { type: "QUICK_REPLY", text: "View Festival Special 🍲" },
      ],
    },
    {
      id: "order_updates",
      title: "Order Dispatch Tracker 🛵",
      name: "ORDER_DISPATCHED_TRACK",
      category: "UTILITY",
      headerType: "TEXT",
      headerText: "ORDER DISPATCHED",
      body: "Great news, {{1}}! Your delicious meal from {{2}} is ready and has been dispatched! 🛵 Your rider is heading your way. Track your order live using the link below.",
      footer: "Estimated delivery time: 25-35 minutes.",
      buttons: [
        {
          type: "URL",
          text: "Track Live Order 📍",
          value: "https://globaleats.app/track",
        },
        { type: "QUICK_REPLY", text: "Contact Support 📞" },
      ],
    },
  ];
  const handleLoadPreset = (presetId) => {
    const preset = templatePresets.find((p) => p.id === presetId);
    if (!preset) return;
    setNewTemplateName(preset.name);
    setNewTemplateCategory(preset.category);
    setNewTemplateHeaderType(preset.headerType || "NONE");
    setNewTemplateHeaderText(preset.headerText || "");
    setNewTemplateHeaderImgUrl(preset.headerImgUrl || "");
    setNewTemplateBody(preset.body);
    setNewTemplateFooter(preset.footer);
    setNewTemplateButtons(preset.buttons);
    if (presetId === "welcome") {
      setPreviewVal1("Alex");
      setPreviewVal2("WELCOME01");
    } else if (presetId === "offers") {
      setPreviewVal1("Sarah");
      setPreviewVal2("FEAST50");
      setPreviewVal3("₹ 25.00");
    } else if (presetId === "festival") {
      setPreviewVal1("Kabir");
      setPreviewVal2("EIDMUBARAK");
    } else if (presetId === "order_updates") {
      setPreviewVal1("Diana");
      setPreviewVal2("Burgers & Beyond");
    }
    triggerToast(
      `Loaded WhatsApp Preset: "${preset.title}" into the editor workspace!`,
    );
  };
  const handleCreateTemplate = (e) => {
    e.preventDefault();
    if (!newTemplateName || !newTemplateBody) {
      triggerToast("Template name and body text are required.");
      return;
    }
    const formatName = newTemplateName.toUpperCase().replace(/\s+/g, "_");
    setIsApprovingTemplate(true);
    setApprovalProgress(0);
    const steps = [
      { text: "Sanitizing template syntax and spacing...", progress: 15 },
      { text: "Running automated category safety checks...", progress: 35 },
      {
        text: "Validating placeholder variables index compatibility...",
        progress: 60,
      },
      { text: "Verifying Meta Business anti-spam guidelines...", progress: 85 },
      {
        text: "Registering custom template on WhatsApp Sandbox nodes...",
        progress: 95,
      },
      { text: "Template Approved Successfully! 🎉", progress: 100 },
    ];
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setApprovalStepText(steps[currentStep].text);
        setApprovalProgress(steps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        const formatNameClean = formatName.toUpperCase().replace(/\s+/g, "_");
        const finalBody =
          newTemplateHeaderType === "TEXT" && newTemplateHeaderText
            ? `[HEADER: ${newTemplateHeaderText}]

${newTemplateBody}`
            : newTemplateHeaderType === "IMAGE" && newTemplateHeaderImgUrl
              ? `[IMAGE HEADER: ${newTemplateHeaderImgUrl}]

${newTemplateBody}`
              : newTemplateBody;
        const newTpl = {
          id: "tpl_" + Date.now(),
          name: formatNameClean,
          category: newTemplateCategory,
          language: "en_US",
          body: finalBody,
          footer: newTemplateFooter || void 0,
          buttons: newTemplateButtons.length > 0 ? newTemplateButtons : void 0,
          status: "APPROVED",
          updatedAt: /* @__PURE__ */ new Date()
            .toISOString()
            .replace("T", " ")
            .substr(0, 16),
        };
        setTemplates((prev) => [newTpl, ...prev]);
        setSelectedPreviewTemplateId(newTpl.id);
        setNewTemplateName("");
        setNewTemplateBody("");
        setNewTemplateFooter("");
        setNewTemplateHeaderType("NONE");
        setNewTemplateHeaderText("");
        setNewTemplateHeaderImgUrl("");
        setNewTemplateButtons([]);
        setIsApprovingTemplate(false);
        triggerToast(
          `Custom Template "${formatNameClean}" successfully approved by Sandbox Gate!`,
        );
      }
    }, 450);
  };
  const handleDeleteTemplate = (id, name) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    if (selectedPreviewTemplateId === id) {
      setSelectedPreviewTemplateId(null);
    }
    triggerToast(`Template "${name}" removed.`);
  };
  const renderTemplateMockupText = (body, footer) => {
    let replaced = body;
    if (templatePreviewMode === "FILLED") {
      replaced = replaced.replace(/\{\{1\}\}/g, previewVal1 || "[Var 1]");
      replaced = replaced.replace(/\{\{2\}\}/g, previewVal2 || "[Var 2]");
      replaced = replaced.replace(/\{\{3\}\}/g, previewVal3 || "[Var 3]");
      replaced = replaced.replace(/\{\{4\}\}/g, previewVal4 || "[Var 4]");
    }
    const formatWhatsAppText = (text) => {
      let html = text
        .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
        .replace(/_(.*?)_/g, "<em>$1</em>")
        .replace(/~(.*?)~/g, "<del>$1</del>")
        .replace(
          /```(.*?)```/g,
          '<code class="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[9px]">$1</code>',
        );
      const isTextHeader = html.startsWith("[HEADER:");
      const isImgHeader = html.startsWith("[IMAGE HEADER:");
      let headerElement = null;
      if (isTextHeader) {
        const headerText = html.match(/\[HEADER:\s*(.*?)\]/)?.[1] || "";
        html = html.replace(/\[HEADER:\s*(.*?)\]\n*\s*/, "");
        headerElement = (
          <div className="text-[10px] font-black uppercase text-neutral-800 tracking-wider mb-1.5 pb-1 border-b border-neutral-100/60">
            {headerText}
          </div>
        );
      } else if (isImgHeader) {
        const imgUrl = html.match(/\[IMAGE HEADER:\s*(.*?)\]/)?.[1] || "";
        html = html.replace(/\[IMAGE HEADER:\s*(.*?)\]\n*\s*/, "");
        headerElement = (
          <div className="mb-2 rounded-lg overflow-hidden border border-neutral-100 max-h-[120px] bg-neutral-50">
            <img
              src={imgUrl}
              alt="Template Header"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        );
      }
      return (
        <div className="space-y-1">
          {headerElement}
          <p
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      );
    };
    return (
      <div className="space-y-1 text-neutral-800 text-[10.5px] leading-relaxed break-words font-sans">
        {formatWhatsAppText(replaced)}
        {footer && (
          <p className="text-[8.5px] text-neutral-400 mt-1.5 border-t border-neutral-100 pt-1 font-semibold">
            {footer}
          </p>
        )}
      </div>
    );
  };
  const [newAutoName, setNewAutoName] = useState("");
  const [newAutoTrigger, setNewAutoTrigger] = useState("New customer");
  const [newAutoDelay, setNewAutoDelay] = useState("Instant");
  const [newAutoTemplateId, setNewAutoTemplateId] = useState(
    templates[0]?.id || "",
  );
  const [selectedAutomationId, setSelectedAutomationId] = useState("auto_1");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStepIndex, setSimulationStepIndex] = useState(-1);
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [simulatedDiner, setSimulatedDiner] = useState("Alex");
  const [selectedEditingActionId, setSelectedEditingActionId] = useState(null);
  const [editingTriggerId, setEditingTriggerId] = useState(null);
  const handleCreateAutomation = (e) => {
    e.preventDefault();
    if (!newAutoName) {
      triggerToast("Please enter an automation name.");
      return;
    }
    const newId = "auto_" + Date.now();
    const newAuto = {
      id: newId,
      name: newAutoName,
      triggerEvent: newAutoTrigger,
      delay: newAutoDelay,
      templateId: newAutoTemplateId,
      isActive: true,
      createdAt: /* @__PURE__ */ new Date().toISOString().split("T")[0],
      actions: [
        {
          id: "act_" + Date.now() + "_1",
          type: "SEND_MESSAGE",
          config: {
            templateId: newAutoTemplateId,
          },
        },
      ],
    };
    setAutomations((prev) => [newAuto, ...prev]);
    setSelectedAutomationId(newId);
    setNewAutoName("");
    triggerToast(
      `Visual flow "${newAutoName}" configured with initial message node!`,
    );
  };
  const addWorkflowAction = (automationId, type) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id === automationId) {
          const currentActions = a.actions || [];
          if (currentActions.length >= 5) {
            triggerToast(
              "Maximum 5 sequence actions allowed in sandbox limits.",
            );
            return a;
          }
          const newAct = {
            id: "act_" + Date.now() + "_" + Math.floor(Math.random() * 1e3),
            type,
            config: {
              couponCode: type === "SEND_COUPON" ? "FLASHSALE20" : void 0,
              discount: type === "SEND_COUPON" ? "20% OFF" : void 0,
              reminderText:
                type === "SEND_REMINDER"
                  ? "Friendly reminder to check out your favorites! 🍕"
                  : void 0,
              delay: type === "SEND_REMINDER" ? "1 day" : void 0,
              templateId:
                type === "SEND_MESSAGE" ? templates[0]?.id || "" : void 0,
            },
          };
          triggerToast(
            `Added action "${type.replace("_", " ")}" to workflow sequence!`,
          );
          return {
            ...a,
            actions: [...currentActions, newAct],
          };
        }
        return a;
      }),
    );
  };
  const deleteWorkflowAction = (automationId, actionId) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id === automationId) {
          const updated = (a.actions || []).filter(
            (act) => act.id !== actionId,
          );
          triggerToast("Action step removed.");
          if (selectedEditingActionId === actionId)
            setSelectedEditingActionId(null);
          return { ...a, actions: updated };
        }
        return a;
      }),
    );
  };
  const updateWorkflowAction = (automationId, actionId, updatedConfig) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id === automationId) {
          const updated = (a.actions || []).map((act) => {
            if (act.id === actionId) {
              return { ...act, config: { ...act.config, ...updatedConfig } };
            }
            return act;
          });
          return { ...a, actions: updated };
        }
        return a;
      }),
    );
  };
  const updateWorkflowTrigger = (automationId, newTrigger) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id === automationId) {
          triggerToast(`Trigger updated to: "${newTrigger}"`);
          return { ...a, triggerEvent: newTrigger };
        }
        return a;
      }),
    );
  };
  const runWorkflowSimulation = (automationId) => {
    const targetAuto = automations.find((a) => a.id === automationId);
    if (!targetAuto) return;
    setIsSimulating(true);
    setSimulationStepIndex(0);
    const logsList = [
      `🚀 Initializing visual test run for workflow: "${targetAuto.name}"`,
      `👤 Selected test recipient: ${simulatedDiner} (Primary Sandbox Node)`,
      `⏳ Simulating trigger: Event [${targetAuto.triggerEvent}] detected in systems...`,
    ];
    setSimulationLogs(logsList);
    const sequenceActions = targetAuto.actions || [];
    let timerIdx = 1;
    sequenceActions.forEach((act, idx) => {
      setTimeout(() => {
        setSimulationStepIndex(idx + 1);
        let actMsg = "";
        if (act.type === "SEND_MESSAGE") {
          const tName =
            templates.find((t) => t.id === act.config.templateId)?.name ||
            "DYNAMIC_TEMPLATE";
          actMsg = `💬 Step ${idx + 1} SUCCESS: Dispatched WhatsApp Template [${tName}] to ${simulatedDiner}. (Status: DELIVERED ✅)`;
        } else if (act.type === "SEND_COUPON") {
          actMsg = `🎫 Step ${idx + 1} SUCCESS: Automatically generated & logged coupon [${act.config.couponCode || "DEFAULT20"}] (${act.config.discount || "20% OFF"}) in ${simulatedDiner}'s profile!`;
        } else if (act.type === "SEND_REMINDER") {
          actMsg = `⏳ Step ${idx + 1} SUCCESS: Scheduled fallback reminder to dispatch in ${act.config.delay || "1 day"}. Message queue logged: "${act.config.reminderText || ""}"`;
        }
        setSimulationLogs((prev) => [...prev, actMsg]);
      }, timerIdx * 1e3);
      timerIdx++;
    });
    setTimeout(() => {
      setSimulationStepIndex(-2);
      setSimulationLogs((prev) => [
        ...prev,
        `🎉 Visual Simulation Completed Successfully! All pipeline actions triggered without errors.`,
      ]);
      setIsSimulating(false);
      triggerToast("Visual workflow simulation completed!");
    }, timerIdx * 1e3);
  };
  const toggleAutomationActive = (id) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextActive = !a.isActive;
          triggerToast(
            `Automation "${a.name}" is now ${nextActive ? "Active" : "Paused"}`,
          );
          return { ...a, isActive: nextActive };
        }
        return a;
      }),
    );
  };
  const handleDeleteAutomation = (id, name) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    if (selectedAutomationId === id) {
      setSelectedAutomationId("");
    }
    triggerToast(`Automation "${name}" removed.`);
  };
  return (
    <div
      className="bg-neutral-50/50 rounded-3xl p-6 border border-neutral-150 shadow-sm space-y-6"
      id="marketing-module-main-card"
    >
      {/* MODULE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-150 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Meta Approved API
            </span>
          </div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="h-5.5 w-5.5 text-brand-orange" />
            <span>WhatsApp Marketing Command Center</span>
          </h2>
          <p className="text-xs text-neutral-500 font-semibold mt-0.5">
            Broadcast promotions, automate checkout pings, and coordinate chat
            loyalty loops with Meta Business Hub.
          </p>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200/60 self-stretch md:self-auto overflow-x-auto gap-0.5">
          {[
            { id: "whatsapp", label: "Console", icon: MessageSquare },
            { id: "campaigns", label: "Campaigns", icon: Sparkles },
            { id: "contacts", label: "Diner Directory", icon: Users },
            { id: "templates", label: "Message Hub", icon: FileText },
            { id: "automations", label: "Workflows", icon: Cpu },
            { id: "leads", label: "Lead CRM", icon: Briefcase },
            { id: "offers", label: "Brand Offers", icon: Tag },
            { id: "coupons", label: "Promo Coupons", icon: Ticket },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${isSel ? "bg-white text-neutral-950 shadow-xs border border-neutral-200/50" : "text-neutral-500 hover:text-neutral-800"}`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* ======================================================= */}
          {/* TAB 1: WHATSAPP DASHBOARD / CONSOLE                     */}
          {/* ======================================================= */}
          {activeSubTab === "whatsapp" && (
            <div className="space-y-6">
              {/* API CONNECTION BAR */}
              <div className="bg-neutral-900 text-white rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-6 pointer-events-none">
                  <Database className="h-44 w-44" />
                </div>
                <div className="space-y-1.5 z-10">
                  <span className="bg-brand-orange text-white px-2.5 py-0.5 rounded-full text-[8px] font-black font-mono tracking-widest uppercase">
                    API LIVE CHANNEL
                  </span>
                  <h3 className="text-md font-black">
                    Meta Business API Cloud Node
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap text-neutral-300 text-xs font-semibold">
                    <span>Webhook Gateway:</span>
                    <span className="font-mono text-[10px] text-orange-200 bg-neutral-800/80 px-2 py-0.5 rounded border border-neutral-700">
                      https://quikabite.onrender.com/api/v1/webhooks/whatsapp
                    </span>
                    <button
                      onClick={handleVerifyWebhook}
                      disabled={isVerifyingWebhook}
                      className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifyingWebhook ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <UserCheck className="h-3 w-3" />
                      )}
                      <span>{webhookVerified ? "Verified ✅" : "Verify Webhook Handle"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 z-10">
                  <div className="bg-neutral-800 border border-neutral-700/80 px-3.5 py-2 rounded-xl flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-300">
                      Ping: 14ms
                    </span>
                  </div>
                  <button
                    onClick={handleSyncCredentials}
                    disabled={isSyncingMeta}
                    className="bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isSyncingMeta ? "animate-spin" : ""}`} />
                    <span>{isSyncingMeta ? "Syncing..." : "Synchronize Credentials"}</span>
                  </button>
                </div>
              </div>

              {/* METRIC CARD DOCK */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Contacts",
                    val: totalContactsCount.toLocaleString(),
                    change: "+12% this month",
                    color: "text-blue-600",
                    bg: "bg-blue-50/50",
                  },
                  {
                    label: "Campaigns",
                    val: campaignsCount.toLocaleString(),
                    change: "Active segments engaged",
                    color: "text-green-600",
                    bg: "bg-green-50/50",
                  },
                  {
                    label: "Messages Sent",
                    val: messagesSentCount.toLocaleString(),
                    change: "99.2% Delivery rate",
                    color: "text-orange-600",
                    bg: "bg-orange-50/50",
                  },
                  {
                    label: "Open Rate",
                    val: averageOpenRate,
                    change: "Highest across channels",
                    color: "text-purple-600",
                    bg: "bg-purple-50/50",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border border-neutral-100 ${stat.bg} space-y-1`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                      {stat.label}
                    </span>
                    <div className={`text-xl font-black ${stat.color}`}>
                      {stat.val}
                    </div>
                    <span className="text-[9px] font-semibold text-neutral-400 block">
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* DOUBLE PANELS: SEND TEST & LOGS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT PANEL: BROADCAST SENDER */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-150 shadow-xs space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
                      <Send className="h-4 w-4 text-brand-orange" />
                      <span>Meta Sandbox Broadcast Simulator</span>
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-semibold">
                      Simulate outgoing transactional or promotional WhatsApp
                      templates.
                    </p>
                  </div>

                  <form onSubmit={handleSendTestMessage} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Recipient Phone Number (with Country Code) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. +916204676330"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Message Template *
                      </label>
                      <select
                        value={testTemplateId || (selectedTestTemplate ? (selectedTestTemplate.id || selectedTestTemplate.name) : "")}
                        onChange={(e) => handleSelectTestTemplate(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
                      >
                        {templates.map((t) => {
                          const val = t.id || t._id || t.name;
                          return (
                            <option key={val} value={val}>
                              {t.name || val} ({t.category || "MARKETING"})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* DYNAMIC VARIABLE FIELD RENDERING */}
                    {selectedTestTemplate && (
                      <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 space-y-3">
                        <span className="text-[8px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
                          Template Variables Mapping:
                        </span>

                        {/* Identify variables in body text */}
                        {Array.from({
                          length: (
                            selectedTestTemplate.body.match(/\{\{\d\}\}/g) || []
                          ).length,
                        }).map((_, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-white border border-neutral-200 w-10 text-center py-1 rounded">
                              {"{{"}
                              {idx + 1}
                              {"}}"}
                            </span>
                            <input
                              type="text"
                              placeholder={`Value for var ${idx + 1}`}
                              value={testVariables[idx] || ""}
                              onChange={(e) => {
                                const copy = [...testVariables];
                                copy[idx] = e.target.value;
                                setTestVariables(copy);
                              }}
                              className="flex-1 bg-white border border-neutral-150 rounded-lg p-1.5 text-[11px] font-semibold outline-none focus:border-brand-orange"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSendingTestMsg}
                      className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-black py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                    >
                      {isSendingTestMsg ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      <span>{isSendingTestMsg ? "Transmitting..." : "Transmit Sandbox Message"}</span>
                    </button>
                  </form>
                </div>

                {/* RIGHT PANEL: WEBHOOK STREAMS */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-150 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-brand-orange" />
                        <span>Cloud Webhook Stream & Activity Logs</span>
                      </h3>
                      <button
                        onClick={handleClearLogs}
                        disabled={isClearingLogs}
                        className="text-[9px] font-bold text-neutral-400 hover:text-neutral-600 uppercase cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {isClearingLogs ? <RefreshCw className="h-2.5 w-2.5 animate-spin" /> : null}
                        <span>{isClearingLogs ? "Clearing..." : "Clear logs"}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-semibold mb-4">
                      Real-time callbacks monitoring outbound payloads, read
                      receipts, and user reply events.
                    </p>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {logs.length === 0 ? (
                        <div className="p-8 text-center text-neutral-300 font-semibold text-xs font-mono">
                          No logging traffic on connection stream.
                        </div>
                      ) : (
                        logs.map((log) => {
                          const isSys = log.direction === "system";
                          const isOut = log.direction === "outgoing";
                          return (
                            <div
                              key={log.id}
                              className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-start gap-3"
                            >
                              <span className="font-mono text-[9px] text-neutral-400 font-semibold mt-0.5">
                                {log.timestamp}
                              </span>

                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black text-neutral-800">
                                    {isSys
                                      ? "🤖 API Connection"
                                      : isOut
                                        ? `📤 Sent to: ${log.phone}`
                                        : `📥 Reply from: ${log.phone}`}
                                  </span>

                                  {/* Delivery status badge */}
                                  <span
                                    className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded ${log.status === "read" ? "bg-blue-100 text-blue-700 border border-blue-200" : log.status === "delivered" ? "bg-green-100 text-green-700 border border-green-200" : log.status === "sent" ? "bg-neutral-200 text-neutral-600" : log.status === "received" ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-green-100 text-green-700"}`}
                                  >
                                    {log.status}
                                  </span>
                                </div>
                                <p className="text-[10.5px] font-medium text-neutral-600 break-words font-sans">
                                  {log.message}
                                </p>
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
          )}

          {/* ======================================================= */}
          {/* TAB 2: CAMPAIGNS                                        */}
          {/* ======================================================= */}
          {activeSubTab === "campaigns" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* LEFT COLUMN: CAMPAIGN CREATION ORCHESTRATOR & LIVE MOCKUP */}
              <div className="xl:col-span-7 bg-white p-6 rounded-2xl border border-neutral-150 shadow-xs space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-brand-orange" />
                    <span>Campaign Orchestrator Hub</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-semibold mt-1">
                    Design and broadcast personalized WhatsApp templates. Match
                    with smart segments and schedule automated queue deliveries.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-neutral-100 pt-5">
                  {/* Sub-Column 1: Settings Form */}
                  <form
                    onSubmit={handleCreateCampaign}
                    className="md:col-span-6 space-y-4"
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block border-b border-neutral-100 pb-1">
                      1. Campaign Settings
                    </span>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Campaign Name / Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="e.g. Biryani Weekend Promo 🍛"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Target Audience Segment *
                      </label>
                      <select
                        value={campaignSegment}
                        onChange={(e) => setCampaignSegment(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-brand-orange focus:bg-white transition"
                      >
                        <option value="All">
                          👥 All Registered Diners (Opt-In)
                        </option>

                        <optgroup label="Smart Audience Segments">
                          {segments.map((seg) => (
                            <option key={seg.id} value={seg.id}>
                              🎯 {seg.name}
                            </option>
                          ))}
                        </optgroup>

                        <optgroup label="Dynamic Interest Tags">
                          {allTags.map((tag) => (
                            <option key={tag} value={tag}>
                              🏷️ Tag: {tag}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Approved Message Template *
                      </label>
                      <select
                        value={campaignTemplateId}
                        onChange={(e) => setCampaignTemplateId(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-brand-orange focus:bg-white transition"
                      >
                        {templates
                          .filter((t) => t.status === "APPROVED")
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.category})
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Show dynamic Coupon / Variable 2 input if template uses it */}
                    {(() => {
                      const selectedTpl = templates.find(
                        (t) => t.id === campaignTemplateId,
                      );
                      if (selectedTpl && selectedTpl.body.includes("{{2}}")) {
                        return (
                          <div className="space-y-1 animate-fade-in">
                            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                              Promo Code / Variable 2 Value
                            </label>
                            <input
                              type="text"
                              value={crmMsgVar2}
                              onChange={(e) => setCrmMsgVar2(e.target.value)}
                              placeholder="e.g. FEAST50"
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange focus:bg-white transition"
                            />
                            <p className="text-[9px] text-neutral-400 font-medium">
                              Replaces the second parameter inside your template
                              preview body.
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block border-b border-neutral-100 pt-3 pb-1">
                      2. Dispatch Scheduling
                    </span>

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCampaignSchedule("instant")}
                          className={`p-3 rounded-xl border text-xs font-black uppercase tracking-wider transition cursor-pointer flex flex-col items-center gap-1.5 justify-center ${campaignSchedule === "instant" ? "bg-neutral-950 border-neutral-950 text-white" : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"}`}
                        >
                          <Send className="h-4 w-4" />
                          <span>Instant Blast</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCampaignSchedule("scheduled")}
                          className={`p-3 rounded-xl border text-xs font-black uppercase tracking-wider transition cursor-pointer flex flex-col items-center gap-1.5 justify-center ${campaignSchedule === "scheduled" ? "bg-neutral-950 border-neutral-950 text-white" : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"}`}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Schedule Later</span>
                        </button>
                      </div>
                    </div>

                    {campaignSchedule === "scheduled" && (
                      <div className="space-y-3 bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-150 animate-fade-in">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                            Choose Date & Time *
                          </label>
                          <input
                            type="datetime-local"
                            required
                            value={campaignScheduleTime}
                            onChange={(e) =>
                              setCampaignScheduleTime(e.target.value)
                            }
                            className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-xs font-bold outline-none focus:border-brand-orange"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                            Queue Frequency
                          </label>
                          <select
                            value={campaignFrequency}
                            onChange={(e) =>
                              setCampaignFrequency(e.target.value)
                            }
                            className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-xs font-semibold outline-none focus:border-brand-orange"
                          >
                            <option value="one-time">One-Time Broadcast</option>
                            <option value="weekly">Weekly Repeat Blast</option>
                            <option value="monthly">
                              Monthly Repeat Blast
                            </option>
                          </select>
                        </div>

                        <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={campaignLocalTimezone}
                            onChange={(e) =>
                              setCampaignLocalTimezone(e.target.checked)
                            }
                            className="rounded border-neutral-200 text-brand-orange focus:ring-brand-orange"
                          />
                          <span>Optimize for customer local timezone</span>
                        </label>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-black py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      {campaignSchedule === "instant" ? (
                        <>
                          <Plus className="h-4.5 w-4.5" />
                          <span>Draft Campaign</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4.5 w-4.5" />
                          <span>Schedule Campaign Queue</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Sub-Column 2: Smartphone Live WhatsApp Mockup & Audience Dossier */}
                  <div className="md:col-span-6 space-y-4 flex flex-col">
                    {/* Audience Target Dossier Card */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                      <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block border-b border-neutral-100 pb-1">
                        🎯 Target Audience Preview
                      </span>

                      {(() => {
                        const targetRecipients =
                          getMatchingContactsForCampaign(campaignSegment);
                        return (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-base font-extrabold text-neutral-950 font-mono">
                                  {targetRecipients.length} diners
                                </span>
                                <span className="text-[10px] text-neutral-400 font-semibold block">
                                  of {contacts.length} total register database
                                </span>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${targetRecipients.length > 0 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                              >
                                {targetRecipients.length > 0
                                  ? "Audience Ready"
                                  : "Empty Audience"}
                              </span>
                            </div>

                            {targetRecipients.length > 0 ? (
                              <div className="space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCampaignRecipientList(
                                      !showCampaignRecipientList,
                                    )
                                  }
                                  className="text-[10px] text-brand-orange hover:text-orange-600 font-extrabold flex items-center gap-1 transition"
                                >
                                  {showCampaignRecipientList
                                    ? "Hide recipient roster ✖"
                                    : "👥 Review targeted diners list (" +
                                      targetRecipients.length +
                                      ") ➔"}
                                </button>

                                {showCampaignRecipientList && (
                                  <div className="max-h-[110px] overflow-y-auto bg-white border border-neutral-150 rounded-xl p-2 space-y-1 text-[10px] font-semibold divide-y divide-neutral-100/60 shadow-inner">
                                    {targetRecipients.map((r) => (
                                      <div
                                        key={r.id}
                                        className="flex justify-between items-center py-1"
                                      >
                                        <span className="text-neutral-800 font-bold truncate max-w-[110px]">
                                          {r.name}
                                        </span>
                                        <span className="text-neutral-400 font-mono text-[9px]">
                                          {r.phone}
                                        </span>
                                        <div className="flex gap-0.5">
                                          {r.tags.slice(0, 1).map((t) => (
                                            <span
                                              key={t}
                                              className="text-[7px] bg-neutral-100 text-neutral-500 font-extrabold px-1 py-0.2 rounded uppercase"
                                            >
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-[9px] text-amber-600 font-medium leading-relaxed bg-amber-50 p-2 rounded-lg border border-amber-100">
                                ⚠️ No opt-in diner profiles contain the tags
                                matched by this segment criteria. Adjust your
                                segment filter or tag selection.
                              </p>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Smartphone Mockup */}
                    <div className="flex-1 flex flex-col bg-neutral-950 border-4 border-neutral-800 rounded-[30px] p-3 shadow-md relative overflow-hidden min-h-[300px]">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-4 w-28 bg-neutral-800 rounded-b-xl z-20" />

                      {/* Phone Screen Header */}
                      <div className="bg-emerald-800 text-white pt-5 pb-2.5 px-3 rounded-t-2xl flex items-center justify-between border-b border-emerald-900/40 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-emerald-600/80 flex items-center justify-center font-bold text-[10px] text-white">
                            QB
                          </div>
                          <div className="leading-tight">
                            <span className="text-[10px] font-black block tracking-tight">
                              QuikaBite Broadcast
                            </span>
                            <span className="text-[8px] text-emerald-100/80 font-medium flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                              <span>Live Template Preview</span>
                            </span>
                          </div>
                        </div>
                        <Smartphone className="h-4 w-4 text-emerald-100/60" />
                      </div>

                      {/* Phone Chat Body */}
                      <div className="flex-1 bg-[#efeae2] p-3 rounded-b-2xl overflow-y-auto space-y-3 relative z-10 font-sans shadow-inner">
                        <div className="text-center">
                          <span className="text-[8px] bg-white/80 text-neutral-500 px-2 py-0.5 rounded-md font-extrabold shadow-3xs uppercase tracking-wider">
                            Today
                          </span>
                        </div>

                        {/* WhatsApp Message Bubble */}
                        {(() => {
                          const activeTpl = templates.find(
                            (t) => t.id === campaignTemplateId,
                          );
                          if (!activeTpl) {
                            return (
                              <div className="text-center py-8 text-neutral-400 font-medium text-xs">
                                No template selected.
                              </div>
                            );
                          }
                          let renderedBody = activeTpl.body;
                          renderedBody = renderedBody.replace("{{1}}", "Alex");
                          renderedBody = renderedBody.replace(
                            "{{2}}",
                            crmMsgVar2 || "FEAST50",
                          );
                          renderedBody = renderedBody.replace(
                            "{{3}}",
                            "120.00",
                          );
                          return (
                            <div className="max-w-[90%] bg-white rounded-2xl rounded-tl-none p-3 shadow-xs border border-neutral-200/50 space-y-1.5 relative">
                              <span className="absolute -left-1.5 top-0 text-white">
                                <svg
                                  width="8"
                                  height="13"
                                  viewBox="0 0 8 13"
                                  fill="currentColor"
                                >
                                  <path d="M0 0 L8 0 L8 13 Z" />
                                </svg>
                              </span>

                              {/* Body */}
                              <p className="text-[10.5px] font-medium text-neutral-800 leading-relaxed font-sans whitespace-pre-line">
                                {renderedBody}
                              </p>

                              {/* Footer */}
                              {activeTpl.footer && (
                                <p className="text-[8px] text-neutral-400 font-bold border-t border-neutral-100 pt-1 font-sans">
                                  {activeTpl.footer}
                                </p>
                              )}

                              {/* Buttons inside bubble or attached below */}
                              {activeTpl.buttons &&
                                activeTpl.buttons.length > 0 && (
                                  <div className="border-t border-neutral-100/80 pt-1.5 mt-1.5 space-y-1.5">
                                    {activeTpl.buttons.map((btn, i) => (
                                      <div
                                        key={i}
                                        className="w-full bg-neutral-50/80 hover:bg-neutral-100 border border-neutral-200/50 rounded-lg py-1.5 px-2 text-[9.5px] font-black text-blue-600 text-center flex items-center justify-center gap-1 transition"
                                      >
                                        {btn.type === "URL" ? (
                                          <Share2 className="h-3 w-3" />
                                        ) : (
                                          <MessageSquare className="h-3 w-3" />
                                        )}
                                        <span>{btn.text}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                              {/* Time stamp */}
                              <div className="text-right text-[7.5px] text-neutral-400 font-semibold mt-1">
                                12:40 PM ✓✓
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: CAMPAIGNS DIRECTORY & SCHEDULER QUEUE */}
              <div className="xl:col-span-5 bg-white p-6 rounded-2xl border border-neutral-150 shadow-xs space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
                        <Database className="h-4.5 w-4.5 text-brand-orange" />
                        <span>Campaign Directory</span>
                      </h3>
                      <p className="text-[10px] font-semibold text-neutral-400 mt-0.5">
                        Manage broadcasts, queue configurations, and dispatch
                        logs.
                      </p>
                    </div>
                  </div>

                  {/* BROADCAST PIPELINE SIMULATOR MODULE */}
                  {activeSimulatorCampId && (
                    <div className="p-4 rounded-xl bg-neutral-950 text-white border border-neutral-800 space-y-3.5 shadow-md relative overflow-hidden">
                      <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
                        <Sparkles className="h-24 w-24 text-orange-400" />
                      </div>

                      <div className="flex justify-between items-center relative z-10">
                        <span className="text-[9px] font-mono font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                          <RefreshCw className="h-3 w-3 animate-spin text-orange-400" />
                          BROADCAST PIPELINE RUNNING
                        </span>
                        <span className="text-xs font-mono font-black text-orange-400">
                          {simulatorProgress}%
                        </span>
                      </div>

                      <p className="text-[10px] font-mono font-semibold text-orange-100 relative z-10 leading-relaxed min-h-[30px]">
                        {simulatorStep}
                      </p>

                      <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden relative z-10">
                        <div
                          className="bg-brand-orange h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${simulatorProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* SEARCH AND FILTERS BAR */}
                  <div className="space-y-3">
                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <input
                        type="text"
                        value={campaignSearch}
                        onChange={(e) => setCampaignSearch(e.target.value)}
                        placeholder="Search campaign directory..."
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-brand-orange transition"
                      />
                    </div>

                    {/* Status Tabs Slider */}
                    <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200/40 gap-0.5 overflow-x-auto">
                      {["ALL", "DRAFT", "SCHEDULED", "COMPLETED"].map(
                        (status) => {
                          const count =
                            status === "ALL"
                              ? campaigns.length
                              : campaigns.filter((c) => c.status === status)
                                  .length;
                          const isSel = campaignStatusFilter === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setCampaignStatusFilter(status)}
                              className={`flex-1 py-1.5 px-2.5 rounded-lg font-black text-[9px] uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${isSel ? "bg-white text-neutral-950 shadow-3xs" : "text-neutral-500 hover:text-neutral-800"}`}
                            >
                              <span>{status}</span>
                              <span
                                className={`ml-1 px-1 rounded font-extrabold ${isSel ? "bg-neutral-950 text-neutral-200" : "bg-neutral-200/60 text-neutral-600"}`}
                              >
                                {count}
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {/* CAMPAIGN CARDS LIST */}
                  <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                    {(() => {
                      const filteredCampaigns = campaigns.filter((camp) => {
                        const matchesSearch =
                          camp.name
                            .toLowerCase()
                            .includes(debouncedCampaignSearch.toLowerCase()) ||
                          camp.targetSegment
                            .toLowerCase()
                            .includes(debouncedCampaignSearch.toLowerCase());
                        const matchesFilter =
                          campaignStatusFilter === "ALL" ||
                          camp.status === campaignStatusFilter;
                        return matchesSearch && matchesFilter;
                      });
                      if (filteredCampaigns.length === 0) {
                        return (
                          <div className="py-12 text-center text-neutral-300 font-semibold text-xs font-mono">
                            No campaigns match filters.
                          </div>
                        );
                      }
                      return filteredCampaigns.map((camp) => {
                        const tpl = templates.find(
                          (t) => t.id === camp.templateId,
                        );
                        const isDraft = camp.status === "DRAFT";
                        const isCompleted = camp.status === "COMPLETED";
                        const isScheduled = camp.status === "SCHEDULED";
                        const segmentName =
                          segments.find((s) => s.id === camp.targetSegment)
                            ?.name || camp.targetSegment;
                        const isMessageExpanded =
                          expandedCampaignMessageId === camp.id;
                        const isRescheduling =
                          reschedulingCampaignId === camp.id;
                        return (
                          <div
                            key={camp.id}
                            className={`p-4 rounded-xl border transition space-y-3 ${isScheduled ? "bg-blue-50/10 border-blue-100 hover:border-blue-200" : isCompleted ? "bg-neutral-50/40 border-neutral-100 hover:border-neutral-200" : "bg-white border-neutral-150 hover:shadow-2xs"}`}
                          >
                            {/* Card Header */}
                            <div className="flex justify-between items-start gap-2">
                              <div className="space-y-0.5 truncate">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-neutral-900 text-xs truncate max-w-[150px]">
                                    {camp.name}
                                  </span>
                                  <span
                                    className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-md border ${isCompleted ? "bg-green-100 text-green-700 border-green-200" : isScheduled ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-neutral-100 text-neutral-600 border-neutral-200"}`}
                                  >
                                    {camp.status}
                                  </span>
                                </div>
                                <p className="text-[10px] text-neutral-400 font-semibold">
                                  Segment:{" "}
                                  <span className="text-neutral-600 font-bold">
                                    {segmentName}
                                  </span>
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {/* Expand message bubble */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedCampaignMessageId(
                                      isMessageExpanded ? null : camp.id,
                                    )
                                  }
                                  className={`p-1.5 rounded-lg border transition ${isMessageExpanded ? "bg-neutral-100 text-neutral-800" : "text-neutral-400 hover:bg-neutral-50"}`}
                                  title="View broadcast message template bubble"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>

                                {/* Duplicate / Pre-fill */}
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateCampaign(camp)}
                                  className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-50 border border-transparent rounded-lg transition"
                                  title="Duplicate / Pre-fill Creator Wizard"
                                >
                                  <Share2 className="h-3.5 w-3.5" />
                                </button>

                                {/* Delete Campaign */}
                                <button
                                  onClick={() =>
                                    handleDeleteCampaign(camp.id, camp.name)
                                  }
                                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Delete campaign log"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Collapsible Message Preview */}
                            {isMessageExpanded && tpl && (
                              <div className="bg-[#efeae2]/40 p-3 rounded-xl border border-neutral-200/50 space-y-1.5 text-[10px] font-semibold text-neutral-700 animate-fade-in relative shadow-inner font-sans">
                                <span className="text-[8px] font-black uppercase text-neutral-400 block mb-1">
                                  WhatsApp Broadcast Preview:
                                </span>
                                <p className="whitespace-pre-line leading-relaxed text-neutral-800 font-medium">
                                  {tpl.body
                                    .replace("{{1}}", "[Diner Name]")
                                    .replace("{{2}}", crmMsgVar2 || "FEAST50")}
                                </p>
                                {tpl.footer && (
                                  <p className="text-[8px] text-neutral-400 font-bold border-t border-neutral-200/50 pt-1 mt-1">
                                    {tpl.footer}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* COMPLETED RESULTS PANELS */}
                            {isCompleted && (
                              <div className="grid grid-cols-3 gap-2 bg-white/85 p-2.5 rounded-xl border border-neutral-100/80 text-center font-mono">
                                <div>
                                  <span className="text-[8px] text-neutral-400 uppercase font-sans font-bold">
                                    Recipients
                                  </span>
                                  <p className="text-xs font-black text-neutral-800 mt-0.5">
                                    {camp.recipientsCount} phone(s)
                                  </p>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[8px] text-neutral-400 uppercase font-sans font-bold">
                                    Open Rate
                                  </span>
                                  <p className="text-xs font-black text-green-600">
                                    {camp.openRate}
                                  </p>
                                  <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                                    <div
                                      className="bg-green-500 h-1"
                                      style={{ width: camp.openRate || "0%" }}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[8px] text-neutral-400 uppercase font-sans font-bold">
                                    CTR
                                  </span>
                                  <p className="text-xs font-black text-blue-600">
                                    {camp.clickRate}
                                  </p>
                                  <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                                    <div
                                      className="bg-blue-500 h-1"
                                      style={{ width: camp.clickRate || "0%" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* SCHEDULED SETTINGS & CONTROLS */}
                            {isScheduled && (
                              <div className="space-y-2">
                                <div className="text-[9.5px] font-semibold text-neutral-500 flex flex-wrap items-center gap-x-2 gap-y-1 bg-white/80 px-2.5 py-2 rounded-lg border border-neutral-100 shadow-3xs">
                                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                  <span>
                                    Automated blast queued at{" "}
                                    <span className="text-neutral-800 font-bold font-mono">
                                      {camp.sentAt}
                                    </span>
                                  </span>
                                  <span className="text-[8px] bg-blue-100 text-blue-700 font-black px-1.5 py-0.2 rounded uppercase">
                                    one-time
                                  </span>
                                </div>

                                {/* Reschedule Toggle / Inputs */}
                                {isRescheduling ? (
                                  <div className="bg-white p-3 rounded-lg border border-neutral-200 space-y-2 animate-fade-in">
                                    <label className="text-[8px] font-black uppercase tracking-wider text-neutral-400 block">
                                      Select New Run Time
                                    </label>
                                    <div className="flex gap-1.5">
                                      <input
                                        type="datetime-local"
                                        value={tempRescheduleTime}
                                        onChange={(e) =>
                                          setTempRescheduleTime(e.target.value)
                                        }
                                        className="flex-1 bg-neutral-50 border border-neutral-200 rounded-md px-2 py-1 text-xs outline-none"
                                      />
                                      <button
                                        onClick={() =>
                                          handleSaveReschedule(
                                            camp.id,
                                            tempRescheduleTime,
                                          )
                                        }
                                        className="bg-neutral-950 hover:bg-neutral-900 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded transition"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() =>
                                          setReschedulingCampaignId(null)
                                        }
                                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[9px] font-bold px-2 py-1 rounded transition"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-1.5 pt-1">
                                    {/* Dispatch Now immediate button */}
                                    <button
                                      onClick={() => {
                                        setCampaigns((prev) =>
                                          prev.map((c) =>
                                            c.id === camp.id
                                              ? { ...c, status: "DRAFT" }
                                              : c,
                                          ),
                                        );
                                        triggerCampaignSendingSim(camp.id);
                                      }}
                                      className="flex-1 bg-neutral-950 hover:bg-neutral-900 text-white font-black py-1.5 px-2 rounded-lg text-[9px] uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      <Send className="h-3 w-3" />
                                      <span>Dispatch Now</span>
                                    </button>

                                    {/* Reschedule trigger button */}
                                    <button
                                      onClick={() => {
                                        setReschedulingCampaignId(camp.id);
                                        setTempRescheduleTime(
                                          camp.sentAt
                                            ? camp.sentAt.replace(" ", "T")
                                            : "",
                                        );
                                      }}
                                      className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 font-extrabold py-1.5 px-2.5 rounded-lg text-[9px] uppercase tracking-wider transition cursor-pointer"
                                    >
                                      Reschedule
                                    </button>

                                    {/* Pause to Draft button */}
                                    <button
                                      onClick={() =>
                                        handlePauseCampaign(camp.id)
                                      }
                                      className="bg-neutral-100 hover:bg-red-50 hover:text-red-600 border border-transparent text-neutral-400 font-bold py-1.5 px-2 rounded-lg text-[9px] uppercase tracking-wider transition cursor-pointer"
                                      title="Convert back to Draft/Pause"
                                    >
                                      Pause
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* DRAFT TRIGGER SIMULATOR PANEL */}
                            {isDraft && (
                              <div className="pt-1.5">
                                <button
                                  onClick={() =>
                                    triggerCampaignSendingSim(camp.id)
                                  }
                                  className="w-full bg-brand-orange hover:bg-orange-600 text-white font-black py-2 rounded-lg text-[9px] uppercase tracking-widest transition flex items-center justify-center gap-1 cursor-pointer shadow-3xs"
                                >
                                  <Send className="h-3.5 w-3.5" />
                                  <span>Launch Broadcast Simulation</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Upcoming Schedule Timeline Checklist / Calendar */}
                <div className="border-t border-neutral-150 pt-4 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-brand-orange" />
                    <span>Weekly Queue Checklist</span>
                  </span>

                  <div className="grid grid-cols-7 gap-1 font-mono text-center">
                    {[
                      { day: "Mo", date: 22, active: false },
                      { day: "Tu", date: 23, active: false },
                      { day: "We", date: 24, active: false },
                      { day: "Th", date: 25, active: false },
                      { day: "Fr", date: 26, active: false },
                      { day: "Sa", date: 27, active: true },
                      { day: "Su", date: 28, active: true, camp: true },
                    ].map((d, i) => (
                      <div
                        key={i}
                        className={`p-1.5 rounded-lg border transition-all ${d.active ? "bg-neutral-950 text-white border-neutral-950 shadow-3xs" : "bg-neutral-50 border-neutral-100 text-neutral-400"}`}
                      >
                        <span className="text-[8px] font-sans block uppercase font-bold tracking-tight">
                          {d.day}
                        </span>
                        <span className="text-xs font-black block mt-0.5">
                          {d.date}
                        </span>
                        {d.camp && (
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-orange mx-auto mt-1 block animate-ping" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 3: CONTACTS / REGISTERED CLIENTS                    */}
          {/* ======================================================= */}
          {activeSubTab === "contacts" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column: Smart Segments & Directory Tags */}
              <div className="xl:col-span-3 bg-white p-5 rounded-2xl border border-neutral-150 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950 mb-3 flex items-center gap-1.5">
                    <Database className="h-4.5 w-4.5 text-brand-orange" />
                    <span>Diner Segments</span>
                  </h3>

                  {/* Segment List */}
                  <div className="space-y-1.5">
                    {segments.map((seg) => {
                      const isSel = selectedSegmentId === seg.id;
                      const matchCount = contacts.filter((c) => {
                        if (seg.optInOnly === "optin" && !c.optIn) return false;
                        if (seg.optInOnly === "optout" && c.optIn) return false;
                        if (seg.matchingTags.length > 0) {
                          return seg.matchingTags.some((tag) =>
                            c.tags.includes(tag),
                          );
                        }
                        return true;
                      }).length;
                      return (
                        <div
                          key={seg.id}
                          className={`group w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${isSel ? "bg-neutral-950 text-white" : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100/80"}`}
                          onClick={() => setSelectedSegmentId(seg.id)}
                        >
                          <span className="truncate">{seg.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold ${isSel ? "bg-neutral-800 text-neutral-200" : "bg-neutral-200/60 text-neutral-600"}`}
                            >
                              {matchCount}
                            </span>

                            {/* Allow deleting custom segments */}
                            {seg.id !== "seg_all" &&
                              seg.id !== "seg_vip" &&
                              seg.id !== "seg_vegan" &&
                              seg.id !== "seg_burgers" &&
                              seg.id !== "seg_dormant" &&
                              seg.id !== "seg_unsub" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSegment(seg.id, seg.name);
                                  }}
                                  className={`p-0.5 rounded hover:bg-red-500 hover:text-white transition ${isSel ? "text-neutral-400 group-hover:text-neutral-300" : "text-neutral-400"}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Create Custom Segment Form Toggle */}
                <div className="border-t border-neutral-100 pt-4">
                  {!showSegmentCreator ? (
                    <button
                      onClick={() => setShowSegmentCreator(true)}
                      className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-extrabold py-2 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Smart Segment</span>
                    </button>
                  ) : (
                    <form
                      onSubmit={handleCreateSegment}
                      className="space-y-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-100"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          New Smart Segment
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowSegmentCreator(false)}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Segment Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newSegmentName}
                          onChange={(e) => setNewSegmentName(e.target.value)}
                          placeholder="e.g. Vegetarian VIPs 🌱"
                          className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-xs font-semibold outline-none focus:border-brand-orange"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Consent Rule
                        </label>
                        <select
                          value={newSegmentOptIn}
                          onChange={(e) => setNewSegmentOptIn(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-xs font-semibold outline-none focus:border-brand-orange"
                        >
                          <option value="all">Any Consent Status</option>
                          <option value="optin">Opted-In Only</option>
                          <option value="optout">Opted-Out Only</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Filter by Tags (Select Any)
                        </label>
                        <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto border border-neutral-200 rounded-lg p-2 bg-white">
                          {allTags.map((tag) => {
                            const isSelected = newSegmentTags.includes(tag);
                            return (
                              <button
                                type="button"
                                key={tag}
                                onClick={() => {
                                  if (isSelected) {
                                    setNewSegmentTags((prev) =>
                                      prev.filter((t) => t !== tag),
                                    );
                                  } else {
                                    setNewSegmentTags((prev) => [...prev, tag]);
                                  }
                                }}
                                className={`px-2 py-1 rounded text-[9px] font-bold transition uppercase tracking-wider ${isSelected ? "bg-brand-orange text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-black py-2 rounded-xl text-xs transition cursor-pointer"
                      >
                        Save Smart Segment
                      </button>
                    </form>
                  )}
                </div>

                {/* Directory Tags Filter List */}
                <div className="border-t border-neutral-100 pt-4 space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                    Tag Cloud Index
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setContactActiveFilterTag("All")}
                      className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${contactActiveFilterTag === "All" ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"}`}
                    >
                      All Tags
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setContactActiveFilterTag(tag)}
                        className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${contactActiveFilterTag === tag ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center Column: Diner Directory List */}
              <div className="xl:col-span-5 bg-white p-5 rounded-2xl border border-neutral-150 shadow-xs space-y-4 flex flex-col">
                {/* Search and Collapsible Form Toggles */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950">
                        Diner Directory
                      </h3>
                      <p className="text-[10px] font-semibold text-neutral-400">
                        Showing {filteredContacts.length} of {contacts.length}{" "}
                        diners
                      </p>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setShowAddContactForm(!showAddContactForm);
                          setShowBulkImportForm(false);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-1 ${showAddContactForm ? "bg-neutral-950 text-white border-neutral-950" : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowBulkImportForm(!showBulkImportForm);
                          setShowAddContactForm(false);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer border flex items-center gap-1 ${showBulkImportForm ? "bg-neutral-950 text-white border-neutral-950" : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"}`}
                      >
                        <Database className="h-3.5 w-3.5" />
                        <span>Bulk</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search name or phone..."
                      value={contactSearchQuery}
                      onChange={(e) => setContactSearchQuery(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-150 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold outline-none focus:border-brand-orange"
                    />
                  </div>

                  {/* Collapsible Form: Add Single Diner */}
                  {showAddContactForm && (
                    <form
                      onSubmit={handleAddContact}
                      className="bg-neutral-50 p-4 rounded-xl border border-neutral-150 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800">
                          Register Single Contact
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddContactForm(false)}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newContactName}
                          onChange={(e) => setNewContactName(e.target.value)}
                          placeholder="e.g. Sarah Connor"
                          className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-brand-orange"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          WhatsApp Phone *
                        </label>
                        <input
                          type="text"
                          required
                          value={newContactPhone}
                          onChange={(e) => setNewContactPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-brand-orange"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Interests Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={newContactTagsString}
                          onChange={(e) =>
                            setNewContactTagsString(e.target.value)
                          }
                          placeholder="e.g. High Spender, Vegan, Active"
                          className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-brand-orange"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-orange hover:bg-orange-600 text-white font-black py-2 rounded-lg text-xs transition cursor-pointer"
                      >
                        Register Contact
                      </button>
                    </form>
                  )}

                  {/* Collapsible Form: Bulk CSV / Paste Parser */}
                  {showBulkImportForm && (
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-150 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800">
                            CSV / Bulk Paste Parser
                          </span>
                          <p className="text-[8px] text-neutral-400">
                            Format: Name, Phone, Tag1|Tag2 (One per line)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowBulkImportForm(false)}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <textarea
                        rows={4}
                        value={bulkPasteText}
                        onChange={(e) => setBulkPasteText(e.target.value)}
                        placeholder="John Doe, +919811112222, Burger Lover|VIP&#10;Alice Smith, +919833334444, Healthy|Vegan"
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 text-xs font-mono font-semibold outline-none focus:border-brand-orange"
                      />

                      <button
                        onClick={handleBulkImport}
                        className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-black py-2 rounded-lg text-xs transition cursor-pointer"
                      >
                        Bulk Import List
                      </button>
                    </div>
                  )}
                </div>

                {/* Diner Listing */}
                <div className="overflow-y-auto max-h-[460px] pr-1 space-y-2 flex-1">
                  {filteredContacts.length === 0 ? (
                    <div className="py-12 text-center text-neutral-300 font-semibold text-xs font-mono">
                      No matching contacts found in segment.
                    </div>
                  ) : (
                    filteredContacts.map((c) => {
                      const isSelected = selectedContactId === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedContactId(c.id)}
                          className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${isSelected ? "bg-orange-50/40 border-brand-orange/60 shadow-xs" : "bg-white border-neutral-100 hover:bg-neutral-50/50 hover:border-neutral-200"}`}
                        >
                          <div className="space-y-1 truncate max-w-[70%]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-neutral-900">
                                {c.name}
                              </span>
                              {!c.optIn && (
                                <span className="text-[8px] font-black bg-red-100 text-red-700 px-1.5 py-0.2 rounded uppercase">
                                  Opt-out
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-neutral-400 font-mono font-semibold block">
                              {c.phone}
                            </span>

                            {/* Tags pillbox */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {c.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[8px] font-black uppercase bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Inline Consent Toggler */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleContactOptIn(c.id);
                              }}
                              className={`p-1.5 rounded-lg border transition ${c.optIn ? "bg-green-50 text-green-600 border-green-200/50 hover:bg-green-100" : "bg-red-50 text-red-500 border-red-200/50 hover:bg-red-100"}`}
                              title={
                                c.optIn ? "Click to Opt-Out" : "Click to Opt-In"
                              }
                            >
                              {c.optIn ? (
                                <UserCheck className="h-4 w-4" />
                              ) : (
                                <UserX className="h-4 w-4" />
                              )}
                            </button>

                            {/* Delete Contact */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteContact(c.id, c.name);
                              }}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Customer Details CRM Panel (Dossier) */}
              <div className="xl:col-span-4 bg-white p-5 rounded-2xl border border-neutral-150 shadow-xs space-y-6">
                {(() => {
                  const activeContact =
                    contacts.find((c) => c.id === selectedContactId) ||
                    filteredContacts[0] ||
                    contacts[0];
                  if (!activeContact) {
                    return (
                      <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-2">
                        <Users className="h-12 w-12 text-neutral-200" />
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                          No Diners Selected
                        </span>
                        <p className="text-[10px] text-neutral-400 font-semibold max-w-[180px]">
                          Add a contact or select one from the directory to view
                          CRM analytics.
                        </p>
                      </div>
                    );
                  }
                  const initials = activeContact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2);
                  const lifetimeOrders = activeContact.tags.includes(
                    "High Spender",
                  )
                    ? 38
                    : activeContact.tags.includes("Dormant")
                      ? 1
                      : 12;
                  const estimatedSpend = activeContact.tags.includes(
                    "High Spender",
                  )
                    ? "2,840.50"
                    : activeContact.tags.includes("Dormant")
                      ? "45.00"
                      : "480.20";
                  const prefBrand = activeContact.tags.includes("Burger Lover")
                    ? "Smash Kitchen"
                    : activeContact.tags.includes("Vegan")
                      ? "Veggie Greens"
                      : "Biryani Lab";
                  const engagement = activeContact.tags.includes("High Spender")
                    ? "98% (Excellent)"
                    : activeContact.tags.includes("Dormant")
                      ? "10% (Low)"
                      : "85% (Good)";
                  return (
                    <div className="space-y-6">
                      {/* Contact Dossier Header */}
                      <div className="flex items-center gap-4 border-b border-neutral-100 pb-5">
                        <div className="h-14 w-14 bg-orange-100 border border-brand-orange/40 text-brand-orange font-black text-lg flex items-center justify-center rounded-2xl shadow-inner uppercase">
                          {initials}
                        </div>
                        <div className="truncate flex-1 space-y-0.5">
                          <h4 className="text-sm font-black text-neutral-900 leading-none">
                            {activeContact.name}
                          </h4>
                          <p className="text-[10px] text-neutral-400 font-mono font-semibold">
                            {activeContact.phone}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <span
                              className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${activeContact.optIn ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                            >
                              {activeContact.optIn
                                ? "Consented (WhatsApp OK)"
                                : "Opted Out"}
                            </span>
                            <span className="text-[9px] text-neutral-400 font-bold">
                              Since {activeContact.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CRM Lifetime Analytics Card */}
                      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-3">
                        <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
                          CRM Analytics Dossier
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-[8px] text-neutral-400 uppercase font-bold block leading-tight">
                              Lifetime Value
                            </span>
                            <span className="text-xs font-black text-neutral-800 font-mono">
                              ₹ {estimatedSpend}
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] text-neutral-400 uppercase font-bold block leading-tight">
                              Completed Orders
                            </span>
                            <span className="text-xs font-black text-neutral-800 font-mono">
                              {lifetimeOrders} Orders
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] text-neutral-400 uppercase font-bold block leading-tight">
                              Favorite Brand
                            </span>
                            <span className="text-[11px] font-extrabold text-brand-orange truncate block">
                              {prefBrand}
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] text-neutral-400 uppercase font-bold block leading-tight">
                              Engagement Rate
                            </span>
                            <span className="text-xs font-black text-neutral-800">
                              {engagement}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Tags Editor */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block">
                          Diner Tags & Preferences
                        </span>

                        <div className="flex flex-wrap gap-1 bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-100 min-h-[48px]">
                          {activeContact.tags.length === 0 ? (
                            <span className="text-[9px] text-neutral-400 font-semibold italic">
                              No preferences tagged yet.
                            </span>
                          ) : (
                            activeContact.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-white border border-neutral-150 text-neutral-600 px-2 py-0.5 rounded-md"
                              >
                                <span>{tag}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveTagFromContact(
                                      activeContact.id,
                                      tag,
                                    )
                                  }
                                  className="text-neutral-400 hover:text-red-500 transition font-bold"
                                >
                                  &times;
                                </button>
                              </span>
                            ))
                          )}
                        </div>

                        {/* Inline Tag Adding */}
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Type tag & press enter..."
                            value={crmNewTag}
                            onChange={(e) => setCrmNewTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddTagToContact(
                                  activeContact.id,
                                  crmNewTag,
                                );
                              }
                            }}
                            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-brand-orange"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleAddTagToContact(activeContact.id, crmNewTag)
                            }
                            className="bg-neutral-950 hover:bg-neutral-900 text-white font-extrabold px-3 rounded-lg text-xs transition"
                          >
                            + Add
                          </button>
                        </div>
                      </div>

                      {/* Quick Campaign/Template Sender directly to this diner */}
                      <div className="border-t border-neutral-100 pt-4 space-y-3">
                        <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                          <Phone className="h-3 w-3 text-brand-orange" />
                          <span>Direct Dispatch (WhatsApp Test Node)</span>
                        </span>

                        <div className="space-y-2 bg-orange-50/30 p-3 rounded-xl border border-orange-100/60">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase tracking-wider text-neutral-400">
                              Select Template ID
                            </label>
                            <select
                              value={crmMsgTemplateId}
                              onChange={(e) =>
                                setCrmMsgTemplateId(e.target.value)
                              }
                              className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-xs font-semibold outline-none focus:border-brand-orange"
                            >
                              {templates.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} ({t.category})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Render dynamic mockup preview */}
                          {(() => {
                            const activeTpl = templates.find(
                              (t) => t.id === crmMsgTemplateId,
                            );
                            if (!activeTpl) return null;
                            let previewBody = activeTpl.body;
                            previewBody = previewBody.replace(
                              "{{1}}",
                              activeContact.name,
                            );
                            previewBody = previewBody.replace(
                              "{{2}}",
                              crmMsgVar2 || "[Brand Name]",
                            );
                            return (
                              <div className="space-y-2">
                                {/* Conditional Variable input if tpl needs variable 2 */}
                                {activeTpl.body.includes("{{2}}") && (
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-black uppercase tracking-wider text-neutral-400">
                                      Var 2 (Brand / Kitchen Name)
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="e.g. Biryani Lab 🍲"
                                      value={crmMsgVar2}
                                      onChange={(e) =>
                                        setCrmMsgVar2(e.target.value)
                                      }
                                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1 text-[10px] font-semibold outline-none focus:border-brand-orange"
                                    />
                                  </div>
                                )}

                                <div className="p-2.5 bg-green-50/50 rounded-lg border border-green-100 text-[10px] text-neutral-600 space-y-1 font-semibold leading-relaxed">
                                  <span className="text-[8px] font-black uppercase text-green-700 block">
                                    Sandbox Template Render:
                                  </span>
                                  <p>{previewBody}</p>
                                  {activeTpl.footer && (
                                    <span className="text-[8px] text-neutral-400 block border-t border-neutral-200/50 pt-1">
                                      {activeTpl.footer}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          <button
                            type="button"
                            onClick={() => handleSendCrmMessage(activeContact)}
                            disabled={!activeContact.optIn}
                            className={`w-full font-black py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${activeContact.optIn ? "bg-neutral-950 hover:bg-neutral-900 text-white shadow-xs" : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"}`}
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>
                              {activeContact.optIn
                                ? "Dispatch Outgoing WhatsApp"
                                : "Opt-In Consent Required"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Chronological CRM Activity Timeline */}
                      <div className="border-t border-neutral-100 pt-4 space-y-3">
                        <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-brand-orange" />
                          <span>CRM Touchpoint Activity</span>
                        </span>

                        <div className="space-y-3 pl-2.5 border-l border-neutral-150 relative">
                          <div className="relative">
                            <span className="absolute -left-[14.5px] top-1.5 h-2 w-2 rounded-full bg-brand-orange ring-4 ring-white" />
                            <div className="text-[10px] font-bold text-neutral-800">
                              Direct Message Dispatched (Meta Webhook)
                            </div>
                            <span className="text-[8px] text-neutral-400 font-semibold font-mono block">
                              Today - Delivered Successfully
                            </span>
                          </div>

                          <div className="relative">
                            <span className="absolute -left-[14.5px] top-1.5 h-2 w-2 rounded-full bg-neutral-300 ring-4 ring-white" />
                            <div className="text-[10px] font-semibold text-neutral-700">
                              Diner tags / preferences updated
                            </div>
                            <span className="text-[8px] text-neutral-400 font-semibold font-mono block">
                              2 days ago - Tagged as "Active"
                            </span>
                          </div>

                          <div className="relative">
                            <span className="absolute -left-[14.5px] top-1.5 h-2 w-2 rounded-full bg-neutral-300 ring-4 ring-white" />
                            <div className="text-[10px] font-semibold text-neutral-700">
                              Registered to CRM Hub list
                            </div>
                            <span className="text-[8px] text-neutral-400 font-semibold font-mono block">
                              {activeContact.createdAt} - Web portal
                              registration
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 4: TEMPLATES HUB & PHONE MOCKUP                      */}
          {/* ======================================================= */}
          {activeSubTab === "templates" && (
            <div className="space-y-6">
              {/* TOP PRESETS ROW */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-150 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-brand-orange animate-pulse" />
                      <span>WhatsApp Template Presets</span>
                    </h3>
                    <p className="text-[10px] font-semibold text-neutral-400 mt-0.5">
                      Quick-load pre-designed configurations for common
                      restaurant and marketing events.
                    </p>
                  </div>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider self-start md:self-auto">
                    Active Sandbox Environment
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {templatePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleLoadPreset(preset.id)}
                      className="group p-3.5 text-left rounded-xl bg-neutral-50 border border-neutral-150 hover:bg-white hover:border-brand-orange hover:shadow-sm transition duration-250 cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 h-1.5 w-12 bg-brand-orange/10 group-hover:bg-brand-orange/20 transition" />
                      <span className="text-xs font-bold text-neutral-800 block mb-1 group-hover:text-brand-orange transition">
                        {preset.title}
                      </span>
                      <p className="text-[9px] text-neutral-400 font-semibold line-clamp-2 leading-relaxed">
                        {preset.body}
                      </p>
                      <span className="inline-block mt-2 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md bg-neutral-200 text-neutral-600 uppercase">
                        {preset.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CORE WORKSPACE GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT TEMPLATE CREATOR / BUILDER PANEL */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-150 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
                          <Plus className="h-4.5 w-4.5 text-brand-orange" />
                          <span>Custom Template Editor</span>
                        </h4>
                        <p className="text-[9px] text-neutral-400 font-semibold mt-0.5">
                          Design a compliant, interactive rich template
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewTemplateName("SUMMER_SPECIAL_OFFER");
                          setNewTemplateCategory("MARKETING");
                          setNewTemplateHeaderType("NONE");
                          setNewTemplateBody(
                            "Hi {{1}}! Try our brand new chef special burger from {{2}} with flat {{3}} off today! Use code FEAST!",
                          );
                          setNewTemplateFooter("Valid on orders today.");
                          setNewTemplateButtons([
                            { type: "QUICK_REPLY", text: "Order Now 🍔" },
                          ]);
                          triggerToast("Loaded a basic drafting canvas.");
                        }}
                        className="text-[9px] text-brand-orange hover:underline font-extrabold"
                      >
                        Reset to Blank Draft
                      </button>
                    </div>

                    {isApprovingTemplate ? (
                      /* SIMULATED META APPROVAL PIPELINE VIEW */
                      <div className="py-8 px-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="relative h-12 w-12 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-4 border-neutral-100 border-t-brand-orange animate-spin" />
                          <Smartphone className="h-5 w-5 text-neutral-400 animate-pulse" />
                        </div>
                        <div className="space-y-1.5 w-full max-w-[240px]">
                          <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block">
                            WhatsApp Cloud Node
                          </span>
                          <h5 className="text-xs font-black text-neutral-800 animate-pulse leading-snug">
                            {approvalStepText}
                          </h5>

                          {/* PROGRESS BAR */}
                          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden mt-3">
                            <div
                              className="bg-brand-orange h-full rounded-full transition-all duration-300"
                              style={{ width: `${approvalProgress}%` }}
                            />
                          </div>
                          <span className="text-[8.5px] font-bold text-neutral-400 mt-1 block">
                            Meta sandbox compliance pipeline: {approvalProgress}
                            %
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* ACTUAL CREATOR FORM */
                      <form
                        onSubmit={handleCreateTemplate}
                        className="space-y-4"
                      >
                        {/* IDENTIFIER & CATEGORY */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                              <span>Template ID *</span>
                              <span className="text-[8px] text-neutral-300 font-bold">
                                (Caps & Under)
                              </span>
                            </label>
                            <input
                              type="text"
                              required
                              value={newTemplateName}
                              onChange={(e) =>
                                setNewTemplateName(
                                  e.target.value
                                    .toUpperCase()
                                    .replace(/\s+/g, "_"),
                                )
                              }
                              placeholder="e.g. PROMO_BURGER_DELIGHT"
                              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange uppercase placeholder:normal-case"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                              Category
                            </label>
                            <select
                              value={newTemplateCategory}
                              onChange={(e) =>
                                setNewTemplateCategory(e.target.value)
                              }
                              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange"
                            >
                              <option value="MARKETING">
                                Marketing / Offers
                              </option>
                              <option value="UTILITY">Utility / Orders</option>
                              <option value="AUTHENTICATION">
                                Authentication / OTP
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* HEADER BUILDER SECTION */}
                        <div className="space-y-2 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-500">
                              Rich Message Header
                            </label>
                            <span className="text-[8px] text-neutral-400 font-bold">
                              Increases open rate by 32%
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {["NONE", "TEXT", "IMAGE"].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setNewTemplateHeaderType(type)}
                                className={`py-1.5 px-2 rounded-lg text-[9px] font-black transition cursor-pointer ${newTemplateHeaderType === type ? "bg-neutral-900 text-white shadow-xs" : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"}`}
                              >
                                {type === "NONE"
                                  ? "No Header"
                                  : type === "TEXT"
                                    ? "Text Banner"
                                    : "Food Image"}
                              </button>
                            ))}
                          </div>

                          {newTemplateHeaderType === "TEXT" && (
                            <div className="space-y-1 pt-1.5">
                              <span className="text-[8px] font-black uppercase text-neutral-400">
                                Header Text *
                              </span>
                              <input
                                type="text"
                                required
                                value={newTemplateHeaderText}
                                onChange={(e) =>
                                  setNewTemplateHeaderText(e.target.value)
                                }
                                placeholder="e.g. FLASH OFFER ⚡"
                                maxLength={60}
                                className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-[11px] font-semibold outline-none focus:border-brand-orange"
                              />
                            </div>
                          )}

                          {newTemplateHeaderType === "IMAGE" && (
                            <div className="space-y-1.5 pt-1.5">
                              <span className="text-[8px] font-black uppercase text-neutral-400">
                                Header Food Image URL *
                              </span>
                              <input
                                type="url"
                                required
                                value={newTemplateHeaderImgUrl}
                                onChange={(e) =>
                                  setNewTemplateHeaderImgUrl(e.target.value)
                                }
                                placeholder="https://images.unsplash.com/..."
                                className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-[10px] font-semibold outline-none focus:border-brand-orange"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setNewTemplateHeaderImgUrl(
                                      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
                                    )
                                  }
                                  className="text-[8px] bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-2 py-0.5 rounded font-bold"
                                >
                                  Pizza Image 🍕
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setNewTemplateHeaderImgUrl(
                                      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
                                    )
                                  }
                                  className="text-[8px] bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-2 py-0.5 rounded font-bold"
                                >
                                  Burger Image 🍔
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* TEMPLATE BODY */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                              Template Body text *
                            </label>
                            <span className="text-[8.5px] font-bold text-neutral-400">
                              Supports variables
                            </span>
                          </div>
                          <textarea
                            required
                            value={newTemplateBody}
                            onChange={(e) => setNewTemplateBody(e.target.value)}
                            placeholder="e.g. Hi {{1}}! Your delicious meal is ready at {{2}}. Enjoy!"
                            rows={3}
                            className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange leading-relaxed"
                          />

                          {/* QUICK TAG INSERTER */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[8px] font-black text-neutral-400 uppercase mr-1">
                              Tap to insert:
                            </span>
                            {[
                              { label: "{{1}} Diner Name", code: "{{1}}" },
                              { label: "{{2}} Promo/Code", code: "{{2}}" },
                              { label: "{{3}} Price/Discount", code: "{{3}}" },
                              { label: "{{4}} Brand/Event", code: "{{4}}" },
                            ].map((tag) => (
                              <button
                                key={tag.code}
                                type="button"
                                onClick={() => {
                                  setNewTemplateBody(
                                    (prev) => prev + " " + tag.code,
                                  );
                                }}
                                className="text-[8.5px] font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 rounded px-1.5 py-0.5 transition"
                              >
                                {tag.label}
                              </button>
                            ))}
                          </div>

                          {/* FORMATTING GUIDE CHEAT SHEET */}
                          <div className="bg-neutral-50/50 p-2 rounded-lg border border-neutral-100 flex items-center justify-between text-[8px] text-neutral-400 mt-2 font-semibold">
                            <span>
                              Markdown:{" "}
                              <strong className="text-neutral-600">
                                *bold*
                              </strong>
                            </span>
                            <span>
                              <em className="text-neutral-600">_italic_</em>
                            </span>
                            <span>
                              <del className="text-neutral-600">~strike~</del>
                            </span>
                            <span>
                              <code className="text-neutral-600">
                                ```code```
                              </code>
                            </span>
                          </div>
                        </div>

                        {/* FOOTER */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                            Footer Text (Optional)
                          </label>
                          <input
                            type="text"
                            value={newTemplateFooter}
                            onChange={(e) =>
                              setNewTemplateFooter(e.target.value)
                            }
                            placeholder="e.g. Tap Unsubscribe if you'd like to stop receiving updates"
                            className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-brand-orange"
                          />
                        </div>

                        {/* DYNAMIC BUTTONS BUILDER */}
                        <div className="space-y-2.5 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500">
                              Interactive Call-to-Actions
                            </span>
                            <span className="text-[8px] text-neutral-400 font-bold">
                              {newTemplateButtons.length} of 3 added
                            </span>
                          </div>

                          {newTemplateButtons.length === 0 ? (
                            <div className="text-center py-2.5 border border-dashed border-neutral-200 rounded-lg text-[9px] text-neutral-400 font-bold">
                              No action buttons. Standard template text only.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {newTemplateButtons.map((btn, index) => (
                                <div
                                  key={index}
                                  className="flex gap-2 items-center bg-white p-2 rounded-lg border border-neutral-150"
                                >
                                  <div className="flex-1 grid grid-cols-12 gap-1.5">
                                    <select
                                      value={btn.type}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setNewTemplateButtons((prev) =>
                                          prev.map((b, i) =>
                                            i === index
                                              ? {
                                                  ...b,
                                                  type: val,
                                                  value:
                                                    val === "QUICK_REPLY"
                                                      ? void 0
                                                      : "",
                                                }
                                              : b,
                                          ),
                                        );
                                      }}
                                      className="col-span-4 bg-neutral-50 border border-neutral-150 rounded p-1 text-[9px] font-bold"
                                    >
                                      <option value="QUICK_REPLY">
                                        Reply Button
                                      </option>
                                      <option value="URL">
                                        Visit Web Link
                                      </option>
                                      <option value="PHONE">Dial Phone</option>
                                    </select>

                                    <input
                                      type="text"
                                      required
                                      value={btn.text}
                                      onChange={(e) => {
                                        const text = e.target.value;
                                        setNewTemplateButtons((prev) =>
                                          prev.map((b, i) =>
                                            i === index ? { ...b, text } : b,
                                          ),
                                        );
                                      }}
                                      placeholder="Button text"
                                      className="col-span-4 bg-neutral-50 border border-neutral-150 rounded p-1 text-[9px] font-semibold"
                                    />

                                    {btn.type !== "QUICK_REPLY" ? (
                                      <input
                                        type="text"
                                        required
                                        value={btn.value || ""}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setNewTemplateButtons((prev) =>
                                            prev.map((b, i) =>
                                              i === index ? { ...b, value } : b,
                                            ),
                                          );
                                        }}
                                        placeholder={
                                          btn.type === "URL"
                                            ? "https://..."
                                            : "+91 ..."
                                        }
                                        className="col-span-4 bg-neutral-50 border border-neutral-150 rounded p-1 text-[9px] font-semibold"
                                      />
                                    ) : (
                                      <div className="col-span-4 text-[8px] text-neutral-400 flex items-center justify-center font-bold">
                                        Returns payload
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setNewTemplateButtons((prev) =>
                                        prev.filter((_, i) => i !== index),
                                      )
                                    }
                                    className="p-1 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {newTemplateButtons.length < 3 && (
                            <button
                              type="button"
                              onClick={() => {
                                setNewTemplateButtons((prev) => [
                                  ...prev,
                                  {
                                    type: "QUICK_REPLY",
                                    text: "New Button ⚡",
                                  },
                                ]);
                              }}
                              className="w-full bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 py-1.5 rounded-lg text-[9px] font-black transition flex items-center justify-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Action Button</span>
                            </button>
                          )}
                        </div>

                        {/* SUBMIT */}
                        <button
                          type="submit"
                          className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-black py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <FileText className="h-4 w-4 text-orange-400" />
                          <span>Register & Approve with Meta</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* RIGHT CATALOG + PHONE PREVIEW COLUMN */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-150 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* LEFT HALF OF GRID: TEMPLATE CATALOG */}
                  <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950">
                          WhatsApp Registered Hub
                        </h3>
                        <span className="text-[8.5px] font-bold text-neutral-400 font-mono">
                          {templates.length} Templates
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-semibold mt-1">
                        Select a template below to view, test with mock
                        variables, and preview inside the phone emulator.
                      </p>

                      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 mt-4">
                        {templates.map((tpl) => {
                          const isSelected =
                            selectedPreviewTemplateId === tpl.id ||
                            (!selectedPreviewTemplateId &&
                              templates[0]?.id === tpl.id);
                          return (
                            <div
                              key={tpl.id}
                              onClick={() =>
                                setSelectedPreviewTemplateId(tpl.id)
                              }
                              className={`p-3.5 rounded-xl border transition text-left cursor-pointer relative ${isSelected ? "bg-neutral-50 border-brand-orange shadow-xs ring-1 ring-brand-orange/20" : "bg-neutral-50/60 border-neutral-150 hover:bg-white hover:border-neutral-300"}`}
                            >
                              {isSelected && (
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
                              )}

                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[9px] font-black text-neutral-800 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                                    {tpl.name}
                                  </span>
                                  <span
                                    className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase ${tpl.category === "MARKETING" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}
                                  >
                                    {tpl.category}
                                  </span>
                                  <span className="text-[7.5px] bg-emerald-100 text-emerald-800 px-1 rounded font-extrabold font-mono">
                                    APPROVED
                                  </span>
                                </div>

                                <p className="text-[10px] text-neutral-600 font-semibold line-clamp-3 leading-relaxed">
                                  {tpl.body}
                                </p>

                                {tpl.buttons && (
                                  <div className="flex gap-1.5 pt-1.5 flex-wrap">
                                    {tpl.buttons.map((btn, bIdx) => (
                                      <span
                                        key={bIdx}
                                        className="text-[8px] bg-neutral-200/60 text-neutral-500 font-bold px-1.5 py-0.5 rounded border border-neutral-200 flex items-center gap-0.5"
                                      >
                                        {btn.type === "URL"
                                          ? "🔗"
                                          : btn.type === "PHONE"
                                            ? "📞"
                                            : "💬"}{" "}
                                        {btn.text}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-neutral-200/50">
                                <span className="text-[8px] text-neutral-400 font-semibold font-mono">
                                  Updated: {tpl.updatedAt}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTemplate(tpl.id, tpl.name);
                                  }}
                                  className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT HALF OF GRID: REAL-TIME WHATSAPP PHONE PREVIEW & VARIABLES TESTING */}
                  <div className="md:col-span-5 flex flex-col space-y-4">
                    {/* PREVIEW CONTROLS BOARD */}
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500">
                          Preview Mode
                        </span>
                        <div className="flex rounded-md overflow-hidden bg-white border border-neutral-200 p-0.5">
                          <button
                            onClick={() => setTemplatePreviewMode("RAW")}
                            className={`px-2 py-0.5 text-[8.5px] font-extrabold rounded cursor-pointer ${templatePreviewMode === "RAW" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100"}`}
                          >
                            Raw
                          </button>
                          <button
                            onClick={() => setTemplatePreviewMode("FILLED")}
                            className={`px-2 py-0.5 text-[8.5px] font-extrabold rounded cursor-pointer ${templatePreviewMode === "FILLED" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100"}`}
                          >
                            Filled
                          </button>
                        </div>
                      </div>

                      {templatePreviewMode === "FILLED" && (
                        <div className="space-y-1.5 pt-1 border-t border-neutral-100">
                          <span className="text-[8px] font-black uppercase text-neutral-400 block mb-1">
                            Live Test Parameters
                          </span>

                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="space-y-0.5">
                              <span className="text-[8px] text-neutral-400 font-bold">
                                {"{{1}}"} Name
                              </span>
                              <input
                                type="text"
                                value={previewVal1}
                                onChange={(e) => setPreviewVal1(e.target.value)}
                                className="w-full bg-white border border-neutral-200 rounded p-1 text-[9px] font-semibold outline-none focus:border-brand-orange"
                                placeholder="e.g. Alex"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[8px] text-neutral-400 font-bold">
                                {"{{2}}"} Code/Order
                              </span>
                              <input
                                type="text"
                                value={previewVal2}
                                onChange={(e) => setPreviewVal2(e.target.value)}
                                className="w-full bg-white border border-neutral-200 rounded p-1 text-[9px] font-semibold outline-none focus:border-brand-orange"
                                placeholder="e.g. FEAST50"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[8px] text-neutral-400 font-bold">
                                {"{{3}}"} Amount
                              </span>
                              <input
                                type="text"
                                value={previewVal3}
                                onChange={(e) => setPreviewVal3(e.target.value)}
                                className="w-full bg-white border border-neutral-200 rounded p-1 text-[9px] font-semibold outline-none focus:border-brand-orange"
                                placeholder="e.g. ₹ 25.00"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[8px] text-neutral-400 font-bold">
                                {"{{4}}"} Kitchen
                              </span>
                              <input
                                type="text"
                                value={previewVal4}
                                onChange={(e) => setPreviewVal4(e.target.value)}
                                className="w-full bg-white border border-neutral-200 rounded p-1 text-[9px] font-semibold outline-none focus:border-brand-orange"
                                placeholder="e.g. Smash Kitchen"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PHONE WRAPPER FRAME */}
                    <div className="bg-neutral-100 rounded-3xl p-3 border border-neutral-200 shadow-inner flex flex-col items-center min-h-[420px]">
                      {/* PHONE TOP BANNER (Green WhatsApp Theme) */}
                      <div className="w-full bg-[#075e54] text-white rounded-t-2xl py-2 px-3 text-[10px] flex items-center justify-between font-bold shadow-xs">
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="h-3.5 w-3.5 text-neutral-100" />
                          <div className="flex flex-col">
                            <span className="text-[9.5px] leading-tight font-black">
                              Meta Cloud Sandbox
                            </span>
                            <span className="text-[7.5px] text-emerald-200 font-mono leading-none">
                              Online Hub
                            </span>
                          </div>
                        </div>
                        <span className="text-[8px] bg-green-500 text-white px-1.5 py-0.5 rounded font-mono">
                          ONLINE
                        </span>
                      </div>

                      {/* CHAT AREA (WhatsApp Beige Wallpaper) */}
                      <div className="flex-1 w-full bg-[#efeae2] p-3 border-x border-b border-neutral-200 shadow-inner flex flex-col justify-end space-y-2 relative overflow-hidden min-h-[300px]">
                        {/* CHAT BUBBLE CONTAINER */}
                        <div className="bg-white rounded-xl p-2.5 border border-neutral-200 max-w-[95%] shadow-xs relative self-start w-full">
                          {(() => {
                            const activeTpl =
                              templates.find(
                                (t) => t.id === selectedPreviewTemplateId,
                              ) || templates[0];
                            if (!activeTpl) {
                              return (
                                <span className="text-[9px] text-neutral-400 font-bold">
                                  Drafting a new template...
                                </span>
                              );
                            }
                            return (
                              <div className="space-y-1.5">
                                {renderTemplateMockupText(
                                  activeTpl.body,
                                  activeTpl.footer,
                                )}
                              </div>
                            );
                          })()}

                          {/* Chat bubble pointer */}
                          <div className="absolute top-2 left-[-5px] w-0 h-0 border-y-4 border-y-transparent border-r-6 border-r-white" />
                        </div>

                        {/* RENDER DYNAMIC BUTTONS DIRECTLY UNDERNEATH LIKE REAL WHATSAPP TEMPLATES */}
                        {(() => {
                          const activeTpl =
                            templates.find(
                              (t) => t.id === selectedPreviewTemplateId,
                            ) || templates[0];
                          if (!activeTpl || !activeTpl.buttons) return null;
                          return (
                            <div className="space-y-1 max-w-[95%] w-full self-start">
                              {activeTpl.buttons.map((btn, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white hover:bg-neutral-50 text-sky-600 border border-neutral-200/80 rounded-lg py-1.5 px-3 text-center text-[9.5px] font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                                >
                                  {btn.type === "URL" && <span>🔗</span>}
                                  {btn.type === "PHONE" && <span>📞</span>}
                                  {btn.type === "QUICK_REPLY" && (
                                    <span>↩️</span>
                                  )}
                                  <span>{btn.text}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      <span className="text-[7.5px] text-neutral-400 font-bold font-mono mt-2 uppercase tracking-wider">
                        WhatsApp Live Screen
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 5: AUTOMATION WORKFLOWS                             */}
          {/* ======================================================= */}
          {activeSubTab === "leads" && (
            <div className="space-y-6" id="lead-crm-workspace">
              {/* STATS METRICS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(() => {
                  const totalCount = leads.length;
                  const totalVal = leads.reduce((sum, l) => sum + l.value, 0);
                  const activeLeads = leads.filter(
                    (l) => l.status !== "Won" && l.status !== "Lost",
                  );
                  const activeVal = activeLeads.reduce(
                    (sum, l) => sum + l.value,
                    0,
                  );
                  const wonLeads = leads.filter((l) => l.status === "Won");
                  const wonVal = wonLeads.reduce((sum, l) => sum + l.value, 0);
                  const lostLeads = leads.filter((l) => l.status === "Lost");
                  const conversionRate =
                    wonLeads.length + lostLeads.length > 0
                      ? (
                          (wonLeads.length /
                            (wonLeads.length + lostLeads.length)) *
                          100
                        ).toFixed(0) + "%"
                      : "0%";
                  return (
                    <>
                      <div className="bg-white rounded-2xl p-4 border border-neutral-150 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                            Total Pipeline
                          </span>
                          <h4 className="text-lg font-black text-neutral-900">
                            ₹ {totalVal.toLocaleString()}
                          </h4>
                          <p className="text-[9px] text-neutral-500 font-bold">
                            {totalCount} Deals Registered
                          </p>
                        </div>
                        <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
                          <Database className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-neutral-150 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                            Active Workspace
                          </span>
                          <h4 className="text-lg font-black text-neutral-900">
                            ₹ {activeVal.toLocaleString()}
                          </h4>
                          <p className="text-[9px] text-orange-500 font-bold">
                            {activeLeads.length} Hot Leads
                          </p>
                        </div>
                        <div className="bg-orange-50 text-brand-orange p-2.5 rounded-xl">
                          <TrendingUp className="h-5 w-5 animate-pulse" />
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-neutral-150 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                            Won Business
                          </span>
                          <h4 className="text-lg font-black text-emerald-600">
                            ₹ {wonVal.toLocaleString()}
                          </h4>
                          <p className="text-[9px] text-emerald-500 font-bold">
                            {wonLeads.length} Contracts Closed
                          </p>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
                          <UserCheck className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-neutral-150 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                            Won Win-Rate
                          </span>
                          <h4 className="text-lg font-black text-neutral-900">
                            {conversionRate}
                          </h4>
                          <p className="text-[9px] text-neutral-500 font-bold">
                            Closed Deals Ratio
                          </p>
                        </div>
                        <div className="bg-neutral-50 text-neutral-600 p-2.5 rounded-xl">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* ACTION BAR: SEARCH, FILTERS, & EXPORTS */}
              <div className="bg-white p-4 rounded-3xl border border-neutral-150 shadow-xs space-y-3.5">
                <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
                  {/* Search and view toggle */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial md:w-64">
                      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search leads, email, phone, company..."
                        value={leadSearchQuery}
                        onChange={(e) => setLeadSearchQuery(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-150 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:border-brand-orange"
                      />
                    </div>

                    {/* View mode toggle */}
                    <div className="flex bg-neutral-100 p-0.5 rounded-xl border border-neutral-200">
                      <button
                        onClick={() => setLeadViewMode("list")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${leadViewMode === "list" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-800"}`}
                      >
                        Spreadsheet View
                      </button>
                      <button
                        onClick={() => setLeadViewMode("board")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${leadViewMode === "board" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-800"}`}
                      >
                        Kanban Board
                      </button>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => {
                        const headers = [
                          "Lead ID",
                          "Name",
                          "Email",
                          "Phone",
                          "Company",
                          "Segment",
                          "Status",
                          "Value (₹)",
                          "Created At",
                          "Last Follow-up",
                          "Notes",
                        ];
                        const rows = leads.map((lead) => [
                          lead.id,
                          lead.name,
                          lead.email,
                          lead.phone,
                          lead.companyName || "",
                          lead.segment,
                          lead.status,
                          lead.value,
                          lead.createdAt,
                          lead.lastFollowUp,
                          lead.notes.replace(/"/g, '""'),
                        ]);
                        let csvContent =
                          "data:text/csv;charset=utf-8," +
                          [
                            headers.join(","),
                            ...rows.map((e) =>
                              e.map((val) => `"${val}"`).join(","),
                            ),
                          ].join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute(
                          "download",
                          `globaleats_leads_${/* @__PURE__ */ new Date().toISOString().split("T")[0]}.csv`,
                        );
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        triggerToast("Leads exported to CSV successfully!");
                      }}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => setShowAddLeadModal(true)}
                      className="px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Register Lead</span>
                    </button>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black uppercase text-neutral-400 mr-1.5">
                      Category:
                    </span>
                    {[
                      "all",
                      "Corporate Catering",
                      "Party Bookings",
                      "Franchise Queries",
                      "VIP Memberships",
                    ].map((seg) => (
                      <button
                        key={seg}
                        onClick={() => setLeadFilterSegment(seg)}
                        className={`px-3 py-1 rounded-full text-[9.5px] font-bold transition ${leadFilterSegment === seg ? "bg-neutral-900 text-white" : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"}`}
                      >
                        {seg === "all" ? "All Segments" : seg}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 md:ml-auto">
                    <span className="text-[9px] font-black uppercase text-neutral-400 mr-1.5 font-mono">
                      Status:
                    </span>
                    {[
                      "all",
                      "New",
                      "Contacted",
                      "Proposal Sent",
                      "Negotiation",
                      "Won",
                      "Lost",
                    ].map((st) => (
                      <button
                        key={st}
                        onClick={() => setLeadFilterStatus(st)}
                        className={`px-3 py-1 rounded-full text-[9.5px] font-bold transition ${leadFilterStatus === st ? "bg-neutral-950 text-white" : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"}`}
                      >
                        {st === "all" ? "All Statuses" : st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* COMPUTED LEADS FILTERED LIST */}
              {(() => {
                const filteredLeads = leads.filter((l) => {
                  const matchesSearch =
                    l.name
                      .toLowerCase()
                      .includes(debouncedLeadSearchQuery.toLowerCase()) ||
                    (l.companyName &&
                      l.companyName
                        .toLowerCase()
                        .includes(debouncedLeadSearchQuery.toLowerCase())) ||
                    l.email
                      .toLowerCase()
                      .includes(debouncedLeadSearchQuery.toLowerCase()) ||
                    l.phone
                      .replace(/\s+/g, "")
                      .includes(debouncedLeadSearchQuery.replace(/\s+/g, ""));
                  const matchesSegment =
                    leadFilterSegment === "all" ||
                    l.segment === leadFilterSegment;
                  const matchesStatus =
                    leadFilterStatus === "all" || l.status === leadFilterStatus;
                  return matchesSearch && matchesSegment && matchesStatus;
                });
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEADS CONTENT AREA (BOARD OR SPREADSHEET) */}
                    <div className="lg:col-span-8 space-y-4">
                      {filteredLeads.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 border border-neutral-150 text-center space-y-3">
                          <Briefcase className="h-10 w-10 text-neutral-300 mx-auto" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800">
                            No Leads Located
                          </h4>
                          <p className="text-[10px] text-neutral-400 font-semibold max-w-sm mx-auto">
                            Try adjusting your filters, searching for alternate
                            contact info, or registering a manual corporate
                            catering lead.
                          </p>
                        </div>
                      ) : leadViewMode === "list" ? (
                        /* SPREADSHEET LIST VIEW */
                        <div className="bg-white rounded-3xl border border-neutral-150 shadow-xs overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                              <thead>
                                <tr className="bg-neutral-50 border-b border-neutral-150">
                                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-neutral-400">
                                    Deal Info
                                  </th>
                                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-neutral-400">
                                    Segment
                                  </th>
                                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-neutral-400">
                                    Status
                                  </th>
                                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-neutral-400">
                                    Value
                                  </th>
                                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-neutral-400 text-right">
                                    Last Follow-up
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-100">
                                {filteredLeads.map((lead) => {
                                  const isSelected = selectedLeadId === lead.id;
                                  const statusColor =
                                    lead.status === "Won"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                                      : lead.status === "Lost"
                                        ? "bg-rose-50 text-rose-700 border-rose-150"
                                        : lead.status === "Negotiation"
                                          ? "bg-purple-50 text-purple-700 border-purple-150"
                                          : lead.status === "Proposal Sent"
                                            ? "bg-indigo-50 text-indigo-700 border-indigo-150"
                                            : lead.status === "Contacted"
                                              ? "bg-blue-50 text-blue-700 border-blue-150"
                                              : "bg-orange-50 text-orange-700 border-orange-150";
                                  return (
                                    <tr
                                      key={lead.id}
                                      onClick={() => setSelectedLeadId(lead.id)}
                                      className={`hover:bg-neutral-50/70 transition cursor-pointer ${isSelected ? "bg-orange-50/30" : ""}`}
                                    >
                                      <td className="px-4 py-3.5">
                                        <div className="space-y-0.5">
                                          <div className="font-extrabold text-xs text-neutral-900 flex items-center gap-1.5">
                                            <span>{lead.name}</span>
                                            {lead.companyName && (
                                              <span className="text-[9px] font-bold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                                                {lead.companyName}
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-[9.5px] text-neutral-500 font-semibold">
                                            {lead.email} • {lead.phone}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3.5">
                                        <span className="text-[9px] font-black uppercase bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                                          {lead.segment}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3.5">
                                        <span
                                          className={`text-[9.5px] font-extrabold border px-2 py-0.5 rounded-full ${statusColor}`}
                                        >
                                          {lead.status}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3.5">
                                        <span className="font-mono text-xs font-extrabold text-neutral-800">
                                          ₹ {lead.value.toLocaleString()}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3.5 text-right">
                                        <span className="text-[10px] text-neutral-400 font-bold flex items-center justify-end gap-1">
                                          <Clock className="h-3 w-3" />
                                          {lead.lastFollowUp}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        /* KANBAN BOARD VIEW */
                        <div
                          className="flex gap-4 overflow-x-auto pb-4 max-w-full"
                          style={{ minHeight: "400px" }}
                        >
                          {[
                            "New",
                            "Contacted",
                            "Proposal Sent",
                            "Negotiation",
                            "Won",
                            "Lost",
                          ].map((st) => {
                            const statusLeads = filteredLeads.filter(
                              (l) => l.status === st,
                            );
                            const columnSum = statusLeads.reduce(
                              (sum, l) => sum + l.value,
                              0,
                            );
                            const colColor =
                              st === "Won"
                                ? "bg-emerald-500"
                                : st === "Lost"
                                  ? "bg-rose-500"
                                  : st === "Negotiation"
                                    ? "bg-purple-500"
                                    : st === "Proposal Sent"
                                      ? "bg-indigo-500"
                                      : st === "Contacted"
                                        ? "bg-blue-500"
                                        : "bg-orange-500";
                            return (
                              <div
                                key={st}
                                className="w-64 bg-neutral-100/70 p-3 rounded-2xl border border-neutral-200/60 flex-shrink-0 flex flex-col space-y-3"
                              >
                                {/* Column Header */}
                                <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`h-2.5 w-2.5 rounded-full ${colColor}`}
                                    />
                                    <span className="text-[11px] font-black uppercase text-neutral-800 tracking-wider">
                                      {st}
                                    </span>
                                    <span className="bg-neutral-200 text-neutral-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                      {statusLeads.length}
                                    </span>
                                  </div>
                                  <span className="text-[9.5px] font-mono font-black text-neutral-500">
                                    ₹ {columnSum.toLocaleString()}
                                  </span>
                                </div>

                                {/* Column Cards */}
                                <div className="space-y-2.5 overflow-y-auto pr-0.5 flex-1 max-h-[480px]">
                                  {statusLeads.length === 0 ? (
                                    <div className="text-center py-8 text-[9.5px] text-neutral-400 font-bold border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
                                      No Leads
                                    </div>
                                  ) : (
                                    statusLeads.map((lead) => {
                                      const isSelected =
                                        selectedLeadId === lead.id;
                                      return (
                                        <div
                                          key={lead.id}
                                          onClick={() =>
                                            setSelectedLeadId(lead.id)
                                          }
                                          className={`bg-white p-3 rounded-xl border transition shadow-xs cursor-pointer text-left space-y-2.5 hover:shadow-md hover:border-neutral-300 ${isSelected ? "border-brand-orange ring-1 ring-brand-orange" : "border-neutral-200/80"}`}
                                        >
                                          <div className="space-y-0.5">
                                            {lead.companyName && (
                                              <span className="text-[8.5px] font-black uppercase text-neutral-400 tracking-wider">
                                                {lead.companyName}
                                              </span>
                                            )}
                                            <h5 className="font-extrabold text-xs text-neutral-950 truncate">
                                              {lead.name}
                                            </h5>
                                          </div>

                                          <p className="text-[9.5px] text-neutral-400 font-semibold line-clamp-2 leading-relaxed">
                                            {lead.notes}
                                          </p>

                                          <div className="flex justify-between items-center pt-2 border-t border-neutral-100 text-[9.5px]">
                                            <span className="text-neutral-500 font-black uppercase tracking-wider text-[8px] bg-neutral-100 px-1.5 py-0.5 rounded">
                                              {lead.segment.split(" ")[0]}
                                            </span>
                                            <span className="font-mono font-extrabold text-neutral-800">
                                              ₹ {lead.value.toLocaleString()}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* CRM PROFILE INTEGRATION PANEL (RIGHT SIDEBAR) */}
                    <div className="lg:col-span-4 space-y-4">
                      {(() => {
                        const activeLead = leads.find(
                          (l) => l.id === selectedLeadId,
                        );
                        if (!activeLead) {
                          return (
                            <div className="bg-white rounded-3xl p-6 border border-neutral-150 shadow-xs text-center text-neutral-400 text-xs">
                              Select a lead from spreadsheet or board to explore
                              live CRM details, log interactions, and coordinate
                              custom WhatsApp proposals.
                            </div>
                          );
                        }
                        const leadLogs = leadsTimeline[activeLead.id] || [];
                        const statusColor =
                          activeLead.status === "Won"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                            : activeLead.status === "Lost"
                              ? "bg-rose-50 text-rose-700 border-rose-150"
                              : activeLead.status === "Negotiation"
                                ? "bg-purple-50 text-purple-700 border-purple-150"
                                : activeLead.status === "Proposal Sent"
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-150"
                                  : activeLead.status === "Contacted"
                                    ? "bg-blue-50 text-blue-700 border-blue-150"
                                    : "bg-orange-50 text-orange-700 border-orange-150";
                        return (
                          <div className="bg-white rounded-3xl border border-neutral-150 shadow-xs p-5 space-y-5 text-left">
                            {/* Profile Header */}
                            <div className="border-b border-neutral-150 pb-4 space-y-2">
                              <div className="flex justify-between items-start">
                                <span
                                  className={`text-[9.5px] font-extrabold border px-2 py-0.5 rounded-full ${statusColor}`}
                                >
                                  {activeLead.status}
                                </span>
                                <button
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `Are you sure you want to delete lead for ${activeLead.name}?`,
                                      )
                                    ) {
                                      setLeads((prev) =>
                                        prev.filter(
                                          (l) => l.id !== activeLead.id,
                                        ),
                                      );
                                      setSelectedLeadId(null);
                                      triggerToast(
                                        "Lead deleted successfully.",
                                      );
                                    }
                                  }}
                                  className="text-neutral-400 hover:text-red-600 transition p-1 rounded-lg hover:bg-neutral-50"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              <div>
                                <h3 className="text-base font-black text-neutral-900 leading-tight">
                                  {activeLead.name}
                                </h3>
                                {activeLead.companyName && (
                                  <p className="text-xs text-neutral-500 font-bold flex items-center gap-1 mt-0.5">
                                    <Building className="h-3.5 w-3.5 text-neutral-400" />
                                    <span>{activeLead.companyName}</span>
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <div className="text-[10px] bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                                  <span className="block text-[8px] font-black uppercase text-neutral-400">
                                    Pipeline Value
                                  </span>
                                  <span className="font-mono font-extrabold text-neutral-800">
                                    ₹ {activeLead.value.toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-[10px] bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                                  <span className="block text-[8px] font-black uppercase text-neutral-400">
                                    Created Date
                                  </span>
                                  <span className="font-extrabold text-neutral-700">
                                    {activeLead.createdAt}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-2.5 text-xs border-b border-neutral-150 pb-4">
                              <h4 className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                                Lead Metadata
                              </h4>
                              <div className="space-y-2">
                                <a
                                  href={`mailto:${activeLead.email}`}
                                  className="flex items-center gap-2 text-neutral-600 hover:text-brand-orange font-semibold"
                                >
                                  <Mail className="h-4 w-4 text-neutral-400" />
                                  <span>{activeLead.email}</span>
                                </a>
                                <a
                                  href={`tel:${activeLead.phone}`}
                                  className="flex items-center gap-2 text-neutral-600 hover:text-brand-orange font-mono font-semibold"
                                >
                                  <Phone className="h-4 w-4 text-neutral-400" />
                                  <span>{activeLead.phone}</span>
                                </a>
                                <div className="flex items-center gap-2 text-neutral-600 font-semibold">
                                  <Sliders className="h-4 w-4 text-neutral-400" />
                                  <span>Segment: {activeLead.segment}</span>
                                </div>
                              </div>
                            </div>

                            {/* Status Changer Actions */}
                            <div className="space-y-2 border-b border-neutral-150 pb-4">
                              <h4 className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                                Update Lead Status
                              </h4>
                              <div className="grid grid-cols-3 gap-1">
                                {[
                                  "Contacted",
                                  "Proposal Sent",
                                  "Negotiation",
                                  "Won",
                                  "Lost",
                                ].map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => {
                                      const nowStr = /* @__PURE__ */ new Date()
                                        .toISOString()
                                        .replace("T", " ")
                                        .substr(0, 16);
                                      setLeads((prev) =>
                                        prev.map((l) => {
                                          if (l.id === activeLead.id) {
                                            const timelineLog = {
                                              time: nowStr,
                                              action: "Status Updated",
                                              note: `Status updated from "${l.status}" to "${st}".`,
                                            };
                                            setLeadsTimeline(
                                              (prevTimeline) => ({
                                                ...prevTimeline,
                                                [activeLead.id]: [
                                                  timelineLog,
                                                  ...(prevTimeline[
                                                    activeLead.id
                                                  ] || []),
                                                ],
                                              }),
                                            );
                                            return {
                                              ...l,
                                              status: st,
                                              lastFollowUp:
                                                nowStr.split(" ")[0],
                                            };
                                          }
                                          return l;
                                        }),
                                      );
                                      triggerToast(
                                        `Status updated to "${st}"!`,
                                      );
                                    }}
                                    className={`px-1.5 py-1.5 rounded-lg text-[9px] font-bold border transition ${activeLead.status === st ? "bg-neutral-900 text-white border-neutral-900 shadow-xs" : "bg-neutral-50 border-neutral-150 text-neutral-600 hover:bg-neutral-100"}`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Lead Automated WhatsApp Outreach (Meta Integration) */}
                            <div className="space-y-3 border-b border-neutral-150 pb-4 bg-green-50/50 p-3 rounded-2xl border border-green-100">
                              <div className="flex items-center gap-1.5">
                                <MessageSquare className="h-4 w-4 text-green-600" />
                                <h4 className="text-[9.5px] font-black uppercase tracking-wider text-green-700">
                                  Sandbox CRM WhatsApp Outreach
                                </h4>
                              </div>

                              <p className="text-[9px] text-neutral-500 font-medium leading-relaxed">
                                Select an approved Meta template to broadcast
                                directly to lead's phone:
                              </p>

                              <div className="space-y-2">
                                <select
                                  value={whatsappLeadTemplateId}
                                  onChange={(e) =>
                                    setWhatsappLeadTemplateId(e.target.value)
                                  }
                                  className="w-full bg-white border border-neutral-200 rounded-xl p-2 text-[10px] font-semibold outline-none focus:border-green-500"
                                >
                                  {templates.map((t) => (
                                    <option key={t.id} value={t.id}>
                                      {t.name} ({t.category})
                                    </option>
                                  ))}
                                </select>

                                {(() => {
                                  const selectedTpl = templates.find(
                                    (t) => t.id === whatsappLeadTemplateId,
                                  );
                                  const needsVariables =
                                    selectedTpl?.body.includes("{{2}}");
                                  return (
                                    <>
                                      {needsVariables && (
                                        <input
                                          type="text"
                                          placeholder="Enter Custom Value (e.g. Wedding Package)"
                                          value={whatsappLeadVar1}
                                          onChange={(e) =>
                                            setWhatsappLeadVar1(e.target.value)
                                          }
                                          className="w-full bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 text-[10px] font-semibold outline-none focus:border-green-500"
                                        />
                                      )}

                                      <button
                                        onClick={() => {
                                          const templ = templates.find(
                                            (t) =>
                                              t.id === whatsappLeadTemplateId,
                                          );
                                          if (!templ) return;
                                          let rendered = templ.body;
                                          rendered = rendered.replace(
                                            "{{1}}",
                                            activeLead.name,
                                          );
                                          rendered = rendered.replace(
                                            "{{2}}",
                                            whatsappLeadVar1 ||
                                              "QuikaBite Operations",
                                          );
                                          const nowStr =
                                            /* @__PURE__ */ new Date()
                                              .toISOString()
                                              .replace("T", " ")
                                              .substr(0, 16);
                                          const newLogId = "l_" + Date.now();
                                          const outgoingLog = {
                                            id: newLogId,
                                            direction: "outgoing",
                                            phone: activeLead.phone,
                                            message: `WhatsApp Lead broadcast: "${rendered}"`,
                                            status: "sent",
                                            timestamp: nowStr.split(" ")[1],
                                          };
                                          setLogs((prev) => [
                                            outgoingLog,
                                            ...prev,
                                          ]);
                                          const timelineLog = {
                                            time: nowStr,
                                            action: "WhatsApp Broadcast",
                                            note: `Dispatched WhatsApp Template "${templ.name}". Text: "${rendered}"`,
                                          };
                                          setLeadsTimeline((prev) => ({
                                            ...prev,
                                            [activeLead.id]: [
                                              timelineLog,
                                              ...(prev[activeLead.id] || []),
                                            ],
                                          }));
                                          triggerToast(
                                            `Simulated WhatsApp sent to Lead "${activeLead.name}"!`,
                                          );
                                        }}
                                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition cursor-pointer shadow-sm shadow-green-200"
                                      >
                                        Send Template Ping
                                      </button>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* Lead Interactive Notes Logger */}
                            <div className="space-y-2 border-b border-neutral-150 pb-4">
                              <h4 className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                                Log Interaction Note
                              </h4>
                              <div className="space-y-2">
                                <textarea
                                  placeholder="Type call minutes, meeting notes, custom proposals, email replies, or next actions..."
                                  value={followUpNoteText}
                                  onChange={(e) =>
                                    setFollowUpNoteText(e.target.value)
                                  }
                                  rows={2}
                                  className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-brand-orange"
                                />
                                <div className="grid grid-cols-2 gap-1.5">
                                  <button
                                    onClick={() => {
                                      if (!followUpNoteText.trim()) {
                                        triggerToast(
                                          "Please enter a follow-up note.",
                                        );
                                        return;
                                      }
                                      const nowStr = /* @__PURE__ */ new Date()
                                        .toISOString()
                                        .replace("T", " ")
                                        .substr(0, 16);
                                      const newLog = {
                                        time: nowStr,
                                        action: "Phone Call Logged",
                                        note: followUpNoteText.trim(),
                                      };
                                      setLeadsTimeline((prev) => ({
                                        ...prev,
                                        [activeLead.id]: [
                                          newLog,
                                          ...(prev[activeLead.id] || []),
                                        ],
                                      }));
                                      setLeads((prev) =>
                                        prev.map((l) =>
                                          l.id === activeLead.id
                                            ? {
                                                ...l,
                                                lastFollowUp:
                                                  nowStr.split(" ")[0],
                                              }
                                            : l,
                                        ),
                                      );
                                      setFollowUpNoteText("");
                                      triggerToast("Logged call minutes.");
                                    }}
                                    className="py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-[9px] uppercase rounded-lg transition"
                                  >
                                    📞 Log Call
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (!followUpNoteText.trim()) {
                                        triggerToast(
                                          "Please enter a follow-up note.",
                                        );
                                        return;
                                      }
                                      const nowStr = /* @__PURE__ */ new Date()
                                        .toISOString()
                                        .replace("T", " ")
                                        .substr(0, 16);
                                      const newLog = {
                                        time: nowStr,
                                        action: "Email Logged",
                                        note: followUpNoteText.trim(),
                                      };
                                      setLeadsTimeline((prev) => ({
                                        ...prev,
                                        [activeLead.id]: [
                                          newLog,
                                          ...(prev[activeLead.id] || []),
                                        ],
                                      }));
                                      setLeads((prev) =>
                                        prev.map((l) =>
                                          l.id === activeLead.id
                                            ? {
                                                ...l,
                                                lastFollowUp:
                                                  nowStr.split(" ")[0],
                                              }
                                            : l,
                                        ),
                                      );
                                      setFollowUpNoteText("");
                                      triggerToast("Logged email update.");
                                    }}
                                    className="py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-[9px] uppercase rounded-lg transition"
                                  >
                                    ✉️ Log Email
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Lead CRM Interaction Timeline Logs */}
                            <div className="space-y-3">
                              <h4 className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                                Interaction History
                              </h4>

                              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                                {leadLogs.length === 0 ? (
                                  <p className="text-[10px] text-neutral-400 font-medium italic">
                                    No previous logs registered. Start by adding
                                    a follow-up note above.
                                  </p>
                                ) : (
                                  leadLogs.map((log, idx) => (
                                    <div
                                      key={idx}
                                      className="relative pl-3.5 border-l border-neutral-200 text-xs"
                                    >
                                      <span className="absolute left-[-4.5px] top-1 h-2 w-2 rounded-full bg-brand-orange" />
                                      <div className="flex justify-between items-start text-[9px] text-neutral-400 font-bold mb-0.5 font-mono">
                                        <span>{log.action}</span>
                                        <span>{log.time}</span>
                                      </div>
                                      <p className="text-[10px] text-neutral-600 font-semibold leading-relaxed">
                                        {log.note}
                                      </p>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()}

              {/* REGISTER NEW MANUAL LEAD MODAL */}
              <Modal isOpen={showAddLeadModal} onClose={() => setShowAddLeadModal(false)} maxWidth="max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950">
                    Register Corporate Lead
                  </h3>
                  <button onClick={() => setShowAddLeadModal(false)} className="text-neutral-400 hover:text-neutral-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newLeadName || !newLeadEmail || !newLeadPhone) {
                            triggerToast(
                              "Name, Email, and Phone are required.",
                            );
                            return;
                          }
                          const val = Number(newLeadValue) || 0;
                          const newLead = {
                            id: "lead_" + Date.now(),
                            name: newLeadName,
                            email: newLeadEmail,
                            phone: newLeadPhone,
                            companyName: newLeadCompany || void 0,
                            segment: newLeadSegment,
                            status: newLeadStatus,
                            value: val,
                            notes: newLeadNotes || "No notes added.",
                            createdAt: /* @__PURE__ */ new Date()
                              .toISOString()
                              .split("T")[0],
                            lastFollowUp: "Never",
                          };
                          setLeads((prev) => [newLead, ...prev]);
                          setLeadsTimeline((prev) => ({
                            ...prev,
                            [newLead.id]: [
                              {
                                time: /* @__PURE__ */ new Date()
                                  .toISOString()
                                  .replace("T", " ")
                                  .substr(0, 16),
                                action: "Lead Created",
                                note: `Lead created manually under segment "${newLeadSegment}".`,
                              },
                            ],
                          }));
                          setNewLeadName("");
                          setNewLeadEmail("");
                          setNewLeadPhone("");
                          setNewLeadCompany("");
                          setNewLeadValue("");
                          setNewLeadStatus("New");
                          setNewLeadNotes("");
                          setShowAddLeadModal(false);
                          setSelectedLeadId(newLead.id);
                          triggerToast(`Lead for "${newLeadName}" created!`);
                        }}
                        className="space-y-4 text-left"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                              Contact Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={newLeadName}
                              onChange={(e) => setNewLeadName(e.target.value)}
                              placeholder="e.g. Suhail Al Mazrouei"
                              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                              Company Name
                            </label>
                            <input
                              type="text"
                              value={newLeadCompany}
                              onChange={(e) =>
                                setNewLeadCompany(e.target.value)
                              }
                              placeholder="e.g. Ministry of Economy"
                              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                              Email ID *
                            </label>
                            <input
                              type="email"
                              required
                              value={newLeadEmail}
                              onChange={(e) => setNewLeadEmail(e.target.value)}
                              placeholder="suhail@moei.gov.ae"
                              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                              WhatsApp / Phone *
                            </label>
                            <input
                              type="text"
                              required
                              value={newLeadPhone}
                              onChange={(e) => setNewLeadPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                              Target Segment *
                            </label>
                            <select
                              value={newLeadSegment}
                              onChange={(e) =>
                                setNewLeadSegment(e.target.value)
                              }
                              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
                            >
                              <option value="Corporate Catering">
                                Corporate Catering
                              </option>
                              <option value="Party Bookings">
                                Party Bookings
                              </option>
                              <option value="Franchise Queries">
                                Franchise Queries
                              </option>
                              <option value="VIP Memberships">
                                VIP Memberships
                              </option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                              Deal Value (₹) *
                            </label>
                            <input
                              type="number"
                              required
                              value={newLeadValue}
                              onChange={(e) => setNewLeadValue(e.target.value)}
                              placeholder="15000"
                              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                            Initial Stage Status
                          </label>
                          <select
                            value={newLeadStatus}
                            onChange={(e) => setNewLeadStatus(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Negotiation">Negotiation</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                            Notes & Brief *
                          </label>
                          <textarea
                            required
                            value={newLeadNotes}
                            onChange={(e) => setNewLeadNotes(e.target.value)}
                            placeholder="Detail requirements: scale of attendees, menu preferences, date and time, budget boundaries..."
                            rows={3}
                            className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-brand-orange hover:bg-orange-600 text-white font-black py-3 rounded-xl text-xs transition mt-2 cursor-pointer shadow-md"
                        >
                          Register Corporate CRM Deal
                        </button>
                      </form>
              </Modal>
            </div>
          )}

          {activeSubTab === "automations" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: ACTIVE WORKFLOWS LIST & NEW WORKFLOW FORM */}
              <div className="lg:col-span-4 space-y-6">
                {/* INITIALIZE A NEW WORKFLOW CARD */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-150 shadow-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950 mb-1 flex items-center gap-1.5">
                    <Plus className="h-4.5 w-4.5 text-brand-orange" />
                    <span>Initialize Flow</span>
                  </h3>
                  <p className="text-[10px] font-semibold text-neutral-400 mb-4">
                    Launch a new event-triggered automation flow sequence.
                  </p>

                  <form
                    onSubmit={handleCreateAutomation}
                    className="space-y-3.5"
                  >
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Flow Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAutoName}
                        onChange={(e) => setNewAutoName(e.target.value)}
                        placeholder="e.g. 30-Day Dormant Rescue Flow"
                        className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Starting Trigger Event
                      </label>
                      <select
                        value={newAutoTrigger}
                        onChange={(e) => setNewAutoTrigger(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange"
                      >
                        <option value="New customer">
                          New customer 👤 (First Registration)
                        </option>
                        <option value="Order delivered">
                          Order delivered 📦 (Successful Sale)
                        </option>
                        <option value="No order in 30 days">
                          No order in 30 days ⏳ (Dormancy Alert)
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Default Message Template
                      </label>
                      <select
                        value={newAutoTemplateId}
                        onChange={(e) => setNewAutoTemplateId(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange"
                      >
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-black py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Cpu className="h-4 w-4 text-orange-400" />
                      <span>Create Visual Flow</span>
                    </button>
                  </form>
                </div>

                {/* ACTIVE RULES / SEQUENCES LIST */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-150 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950">
                      Active Automation Sequences
                    </h3>
                    <span className="text-[9px] bg-neutral-100 text-neutral-600 font-bold px-2 py-0.5 rounded-full border border-neutral-200">
                      {automations.length} Flows
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {automations.map((auto) => {
                      const isSelected = selectedAutomationId === auto.id;
                      const actionCount = auto.actions?.length || 0;
                      return (
                        <div
                          key={auto.id}
                          onClick={() => {
                            setSelectedAutomationId(auto.id);
                            setSelectedEditingActionId(null);
                            setEditingTriggerId(null);
                          }}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition relative group ${isSelected ? "bg-neutral-50 border-brand-orange shadow-xs ring-1 ring-brand-orange/20" : "bg-neutral-50/60 border-neutral-150 hover:bg-white hover:border-neutral-300"}`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1">
                              <h4 className="font-bold text-neutral-900 text-xs leading-tight group-hover:text-brand-orange transition">
                                {auto.name}
                              </h4>
                              <p className="text-[8.5px] font-black uppercase tracking-wide text-neutral-400 flex items-center gap-1">
                                <span className="text-brand-orange">⚡</span>{" "}
                                {auto.triggerEvent}
                              </p>
                            </div>
                            <span
                              className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${auto.isActive ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-500"}`}
                            >
                              {auto.isActive ? "Active" : "Paused"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-neutral-200/50">
                            <span className="text-[9px] font-bold text-neutral-500 flex items-center gap-1">
                              <Sliders className="h-3 w-3" /> {actionCount}{" "}
                              {actionCount === 1
                                ? "Action Node"
                                : "Action Nodes"}
                            </span>

                            <div
                              className="flex items-center gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => toggleAutomationActive(auto.id)}
                                className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border cursor-pointer transition ${auto.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-neutral-100 text-neutral-600 border-neutral-200"}`}
                              >
                                {auto.isActive ? "Pause" : "Start"}
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteAutomation(auto.id, auto.name)
                                }
                                className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: INTERACTIVE VISUAL FLOW CANVAS */}
              <div className="lg:col-span-8 flex flex-col space-y-6">
                {(() => {
                  const activeFlow = automations.find(
                    (a) => a.id === selectedAutomationId,
                  );
                  if (!activeFlow) {
                    return (
                      <div className="bg-white p-12 rounded-3xl border border-neutral-150 shadow-xs flex flex-col items-center justify-center text-center space-y-4 min-h-[480px]">
                        <div className="p-4 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-300">
                          <Cpu className="h-10 w-10 text-neutral-400 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
                            No Workflow Selected
                          </h3>
                          <p className="text-[10px] text-neutral-400 font-semibold max-w-[320px] leading-relaxed">
                            Click on any active automation sequence from the
                            list or create a brand new one to load the Visual
                            Canvas.
                          </p>
                        </div>
                      </div>
                    );
                  }
                  const activeActions = activeFlow.actions || [];
                  return (
                    <div className="bg-white rounded-3xl border border-neutral-150 shadow-xs p-6 space-y-6">
                      {/* FLOW CANVAS HEADER / CONTROL BAR */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
                              <span className="p-1 rounded bg-orange-100 text-brand-orange font-mono text-[10px]">
                                Canvas
                              </span>
                              <span>{activeFlow.name}</span>
                            </h3>
                            <span
                              className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full border ${activeFlow.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-neutral-100 text-neutral-500 border-neutral-200"}`}
                            >
                              {activeFlow.isActive
                                ? "🟢 Running Live"
                                : "⚪ Paused"}
                            </span>
                          </div>
                          <p className="text-[10px] font-semibold text-neutral-400 mt-1 leading-relaxed">
                            Click any node to customize parameters. Add multiple
                            action blocks to create automatic event-driven
                            chains.
                          </p>
                        </div>

                        {/* LIVE SIMULATOR CONTROLS */}
                        <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-150 p-2 rounded-2xl">
                          <div className="space-y-0.5">
                            <label className="text-[7.5px] font-black text-neutral-400 uppercase block">
                              Test Diner
                            </label>
                            <select
                              value={simulatedDiner}
                              onChange={(e) =>
                                setSimulatedDiner(e.target.value)
                              }
                              disabled={isSimulating}
                              className="bg-transparent border-none text-[10px] font-black text-neutral-700 focus:outline-none p-0 cursor-pointer"
                            >
                              <option value="Alex">Alex (High-Spender)</option>
                              <option value="Sarah">Sarah (Vegan Lover)</option>
                              <option value="Kabir">
                                Kabir (Frequent Diner)
                              </option>
                              <option value="Emma">Emma (New Diner)</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => runWorkflowSimulation(activeFlow.id)}
                            disabled={isSimulating}
                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 transition ${isSimulating ? "bg-neutral-200 text-neutral-400 cursor-not-allowed" : "bg-brand-orange hover:bg-orange-600 text-white shadow-xs cursor-pointer"}`}
                          >
                            <Cpu className="h-3.5 w-3.5 animate-spin" />
                            <span>
                              {isSimulating ? "Simulating..." : "Test Run"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* WORKSPACE AREA: VISUAL FLOW GRAPH CANVAS */}
                      <div className="bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] bg-neutral-50/50 border border-neutral-200 rounded-3xl p-6 relative overflow-hidden min-h-[480px] flex flex-col justify-between">
                        {/* THE GRAPH LIST OF CONNECTED NODES */}
                        <div className="max-w-lg mx-auto w-full space-y-3 py-4 flex flex-col items-center">
                          {/* ======================================= */}
                          {/* TRIGGER NODE                            */}
                          {/* ======================================= */}
                          <motion.div
                            onClick={() => {
                              setEditingTriggerId(activeFlow.id);
                              setSelectedEditingActionId(null);
                            }}
                            animate={{
                              scale:
                                simulationStepIndex === 0 ? [1, 1.03, 1] : 1,
                              boxShadow:
                                simulationStepIndex === 0
                                  ? "0 0 15px rgba(249, 115, 22, 0.4)"
                                  : "none",
                            }}
                            transition={{
                              repeat: simulationStepIndex === 0 ? Infinity : 0,
                              duration: 1,
                            }}
                            className={`w-full max-w-sm bg-white p-4 rounded-2xl border cursor-pointer relative transition duration-200 ${editingTriggerId === activeFlow.id ? "border-brand-orange ring-1 ring-brand-orange/10 shadow-md" : "border-neutral-150 shadow-xs hover:border-neutral-300 hover:shadow-xs"} ${simulationStepIndex === 0 ? "ring-2 ring-brand-orange bg-orange-50/30" : ""}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[8px] font-black uppercase text-brand-orange tracking-widest flex items-center gap-1">
                                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                                <span>Starting Event Trigger</span>
                              </span>
                              <span className="text-[8px] bg-neutral-100 text-neutral-500 font-bold px-1.5 py-0.5 rounded">
                                Event Node
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-orange-50 text-brand-orange">
                                <Cpu className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-black text-neutral-800">
                                  Trigger: {activeFlow.triggerEvent}
                                </h4>
                                <p className="text-[9px] text-neutral-400 font-semibold">
                                  Detects customer behavior and triggers
                                  pipeline immediately
                                </p>
                              </div>
                            </div>

                            {/* TRIGGER CONFIG PANEL IF ACTIVE */}
                            {editingTriggerId === activeFlow.id && (
                              <div
                                className="mt-3.5 pt-3.5 border-t border-neutral-100 space-y-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <label className="text-[8.5px] font-black uppercase tracking-wider text-neutral-400 block">
                                  Select Trigger Scenario
                                </label>
                                <select
                                  value={activeFlow.triggerEvent}
                                  onChange={(e) =>
                                    updateWorkflowTrigger(
                                      activeFlow.id,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-xs font-bold"
                                >
                                  <option value="New customer">
                                    New customer 👤 (First Diner Registration)
                                  </option>
                                  <option value="Order delivered">
                                    Order delivered 📦 (Order state is
                                    Successful)
                                  </option>
                                  <option value="No order in 30 days">
                                    No order in 30 days ⏳ (Re-engage Dormant
                                    Customer)
                                  </option>
                                </select>
                                <div className="text-[8px] text-neutral-400 font-semibold flex justify-end">
                                  <button
                                    onClick={() => setEditingTriggerId(null)}
                                    className="text-brand-orange hover:underline font-extrabold"
                                  >
                                    Done 📭
                                  </button>
                                </div>
                              </div>
                            )}
                          </motion.div>

                          {/* DYNAMIC SEQUENCE ACTIONS LIST */}
                          {activeActions.map((act, index) => {
                            const isSelected =
                              selectedEditingActionId === act.id;
                            const isGlowing = simulationStepIndex === index + 1;
                            return (
                              <React.Fragment key={act.id}>
                                {/* CONNECTING CONNECTOR ARROW */}
                                <div className="h-7 flex items-center justify-center">
                                  <div className="w-0.5 bg-neutral-200 h-full relative">
                                    <div
                                      className="absolute inset-0 bg-brand-orange transition-all duration-300"
                                      style={{
                                        height: isGlowing ? "100%" : "0%",
                                      }}
                                    />
                                    <div className="absolute bottom-0 -left-[3px] w-2 h-2 border-r-2 border-b-2 border-neutral-300 rotate-45" />
                                  </div>
                                </div>

                                {/* ACTION CARD */}
                                <motion.div
                                  onClick={() => {
                                    setSelectedEditingActionId(act.id);
                                    setEditingTriggerId(null);
                                  }}
                                  animate={{
                                    scale: isGlowing ? [1, 1.03, 1] : 1,
                                    boxShadow: isGlowing
                                      ? "0 0 15px rgba(249, 115, 22, 0.4)"
                                      : "none",
                                  }}
                                  transition={{
                                    repeat: isGlowing ? Infinity : 0,
                                    duration: 1,
                                  }}
                                  className={`w-full max-w-sm bg-white p-4 rounded-2xl border cursor-pointer relative transition duration-200 ${isSelected ? "border-brand-orange ring-1 ring-brand-orange/10 shadow-md" : "border-neutral-150 shadow-xs hover:border-neutral-300 hover:shadow-xs"} ${isGlowing ? "ring-2 ring-brand-orange bg-orange-50/20" : ""}`}
                                >
                                  {/* DELETE BUTTON ON THE CORNER */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteWorkflowAction(
                                        activeFlow.id,
                                        act.id,
                                      );
                                    }}
                                    className="absolute top-3 right-3 p-1 hover:bg-red-50 text-neutral-300 hover:text-red-500 rounded-lg transition"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>

                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[8px] font-black uppercase text-blue-600 tracking-wider flex items-center gap-1.5">
                                      <span className="font-mono bg-blue-100 text-blue-700 px-1 rounded">
                                        Step {index + 1}
                                      </span>
                                      <span>
                                        {act.type === "SEND_MESSAGE"
                                          ? "💬 Send Message"
                                          : act.type === "SEND_COUPON"
                                            ? "🎫 Send Coupon"
                                            : "⏰ Fallback Reminder"}
                                      </span>
                                    </span>
                                  </div>

                                  {/* INNER CARD BODY */}
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2.5 rounded-xl ${act.type === "SEND_MESSAGE" ? "bg-sky-50 text-sky-600" : act.type === "SEND_COUPON" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                                    >
                                      {act.type === "SEND_MESSAGE" && (
                                        <MessageSquare className="h-5 w-5" />
                                      )}
                                      {act.type === "SEND_COUPON" && (
                                        <FileText className="h-5 w-5" />
                                      )}
                                      {act.type === "SEND_REMINDER" && (
                                        <Clock className="h-5 w-5" />
                                      )}
                                    </div>

                                    <div className="flex-1">
                                      {act.type === "SEND_MESSAGE" && (
                                        <>
                                          <h4 className="text-xs font-black text-neutral-800">
                                            Message:{" "}
                                            {templates.find(
                                              (t) =>
                                                t.id === act.config.templateId,
                                            )?.name || "Custom Message / Draft"}
                                          </h4>
                                          <p className="text-[9px] text-neutral-400 font-semibold">
                                            Sends pre-approved rich WhatsApp
                                            template to diner
                                          </p>
                                        </>
                                      )}

                                      {act.type === "SEND_COUPON" && (
                                        <>
                                          <h4 className="text-xs font-black text-neutral-800">
                                            Issue Coupon:{" "}
                                            <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded border border-emerald-100">
                                              {act.config.couponCode ||
                                                "PROMO20"}
                                            </span>{" "}
                                            ({act.config.discount || "20% OFF"})
                                          </h4>
                                          <p className="text-[9px] text-neutral-400 font-semibold">
                                            Instantly issues a tracked CRM
                                            discount voucher code
                                          </p>
                                        </>
                                      )}

                                      {act.type === "SEND_REMINDER" && (
                                        <>
                                          <h4 className="text-xs font-black text-neutral-800 line-clamp-1">
                                            Reminder: "
                                            {act.config.reminderText ||
                                              "Send friendly ping"}
                                            "
                                          </h4>
                                          <p className="text-[9px] text-neutral-400 font-semibold">
                                            Schedules an automated WhatsApp
                                            follow-up in{" "}
                                            {act.config.delay || "1 day"}
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* DYNAMIC EDIT OPTIONS INLINE PANEL */}
                                  {isSelected && (
                                    <div
                                      className="mt-4 pt-4 border-t border-neutral-100 space-y-3.5"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {/* SEND MESSAGE OPTIONS */}
                                      {act.type === "SEND_MESSAGE" && (
                                        <div className="space-y-1.5">
                                          <label className="text-[8px] font-black uppercase tracking-wider text-neutral-400 block">
                                            Select Approved Template
                                          </label>
                                          <select
                                            value={act.config.templateId || ""}
                                            onChange={(e) =>
                                              updateWorkflowAction(
                                                activeFlow.id,
                                                act.id,
                                                { templateId: e.target.value },
                                              )
                                            }
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-xs font-bold focus:border-brand-orange"
                                          >
                                            <option value="">
                                              -- Choose Template --
                                            </option>
                                            {templates.map((t) => (
                                              <option key={t.id} value={t.id}>
                                                {t.name} ({t.category})
                                              </option>
                                            ))}
                                          </select>
                                          <p className="text-[8px] text-neutral-400 font-semibold">
                                            Template changes update the
                                            automated visual dispatcher
                                            instantly.
                                          </p>
                                        </div>
                                      )}

                                      {/* SEND COUPON OPTIONS */}
                                      {act.type === "SEND_COUPON" && (
                                        <div className="grid grid-cols-2 gap-2.5">
                                          <div className="space-y-1">
                                            <label className="text-[8px] font-black uppercase tracking-wider text-neutral-400 block">
                                              Voucher Code
                                            </label>
                                            <input
                                              type="text"
                                              value={
                                                act.config.couponCode || ""
                                              }
                                              onChange={(e) =>
                                                updateWorkflowAction(
                                                  activeFlow.id,
                                                  act.id,
                                                  {
                                                    couponCode:
                                                      e.target.value.toUpperCase(),
                                                  },
                                                )
                                              }
                                              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-xs font-bold uppercase"
                                              placeholder="WELCOME50"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[8px] font-black uppercase tracking-wider text-neutral-400 block">
                                              Discount Value
                                            </label>
                                            <input
                                              type="text"
                                              value={act.config.discount || ""}
                                              onChange={(e) =>
                                                updateWorkflowAction(
                                                  activeFlow.id,
                                                  act.id,
                                                  { discount: e.target.value },
                                                )
                                              }
                                              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-xs font-bold"
                                              placeholder="25% OFF"
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {/* SEND REMINDER OPTIONS */}
                                      {act.type === "SEND_REMINDER" && (
                                        <div className="space-y-2">
                                          <div className="space-y-1">
                                            <label className="text-[8px] font-black uppercase tracking-wider text-neutral-400 block">
                                              Reminder Copy *
                                            </label>
                                            <input
                                              type="text"
                                              value={
                                                act.config.reminderText || ""
                                              }
                                              onChange={(e) =>
                                                updateWorkflowAction(
                                                  activeFlow.id,
                                                  act.id,
                                                  {
                                                    reminderText:
                                                      e.target.value,
                                                  },
                                                )
                                              }
                                              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-xs font-bold"
                                              placeholder="Hey! Only 24 hours left to claim..."
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[8px] font-black uppercase tracking-wider text-neutral-400 block">
                                              Reminder Delay Interval
                                            </label>
                                            <select
                                              value={act.config.delay || ""}
                                              onChange={(e) =>
                                                updateWorkflowAction(
                                                  activeFlow.id,
                                                  act.id,
                                                  { delay: e.target.value },
                                                )
                                              }
                                              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-xs font-bold"
                                            >
                                              <option value="Instant">
                                                Instant (Immediately after
                                                previous step)
                                              </option>
                                              <option value="1 hour">
                                                1 hour delay
                                              </option>
                                              <option value="2 hours">
                                                2 hours delay
                                              </option>
                                              <option value="1 day">
                                                1 day delay
                                              </option>
                                              <option value="2 days">
                                                2 days delay
                                              </option>
                                            </select>
                                          </div>
                                        </div>
                                      )}

                                      <div className="flex justify-between items-center text-[8.5px] border-t border-neutral-100 pt-3">
                                        <span className="text-neutral-400 font-bold">
                                          Press card again to close settings
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setSelectedEditingActionId(null)
                                          }
                                          className="text-brand-orange hover:underline font-extrabold"
                                        >
                                          Collapse 🔼
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              </React.Fragment>
                            );
                          })}

                          {/* ======================================= */}
                          {/* ADD NEW ACTIONS PLACEMENT ZONE          */}
                          {/* ======================================= */}
                          <div className="h-7 flex items-center justify-center">
                            <div className="w-0.5 bg-neutral-200 h-full relative">
                              <div className="absolute bottom-0 -left-[3px] w-2 h-2 border-r-2 border-b-2 border-neutral-300 rotate-45" />
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <div className="relative group">
                              <button
                                type="button"
                                className="h-10 w-10 rounded-full bg-white hover:bg-brand-orange hover:text-white text-neutral-400 border-2 border-dashed border-neutral-300 hover:border-brand-orange transition-all duration-200 cursor-pointer flex items-center justify-center shadow-xs"
                              >
                                <Plus className="h-5 w-5" />
                              </button>

                              {/* DROP-DOWN ADDING ACTION CHANNELS */}
                              <div className="absolute top-11 left-1/2 -translate-x-1/2 z-30 bg-white border border-neutral-200 p-2 rounded-2xl shadow-xl w-44 space-y-1 hidden group-hover:block hover:block">
                                <span className="text-[7.5px] font-black text-neutral-400 uppercase tracking-widest block px-2.5 py-1 text-center">
                                  Add Node to Flow
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    addWorkflowAction(
                                      activeFlow.id,
                                      "SEND_MESSAGE",
                                    )
                                  }
                                  className="w-full text-left font-bold text-xs p-2 text-neutral-700 hover:bg-neutral-50 hover:text-brand-orange rounded-xl flex items-center gap-2 cursor-pointer"
                                >
                                  <span>💬</span> Send Message
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    addWorkflowAction(
                                      activeFlow.id,
                                      "SEND_COUPON",
                                    )
                                  }
                                  className="w-full text-left font-bold text-xs p-2 text-neutral-700 hover:bg-neutral-50 hover:text-brand-orange rounded-xl flex items-center gap-2 cursor-pointer"
                                >
                                  <span>🎫</span> Send Coupon
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    addWorkflowAction(
                                      activeFlow.id,
                                      "SEND_REMINDER",
                                    )
                                  }
                                  className="w-full text-left font-bold text-xs p-2 text-neutral-700 hover:bg-neutral-50 hover:text-brand-orange rounded-xl flex items-center gap-2 cursor-pointer"
                                >
                                  <span>⏰</span> Send Reminder
                                </button>
                              </div>
                            </div>
                            <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest animate-pulse">
                              Add action node
                            </span>
                          </div>
                        </div>

                        {/* ======================================= */}
                        {/* TERMINAL EMULATED OUTPUT SCREEN         */}
                        {/* ======================================= */}
                        {simulationLogs.length > 0 && (
                          <div className="mt-6 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 font-mono text-[9.5px] text-emerald-400 space-y-1 shadow-inner relative max-h-[140px] overflow-y-auto w-full text-left">
                            <div className="flex justify-between items-center text-neutral-500 text-[8px] font-black tracking-wider border-b border-neutral-800 pb-1.5 mb-2 uppercase">
                              <span>Flow Execution Logs</span>
                              <span className="animate-pulse text-emerald-400">
                                ● LIVE RUN
                              </span>
                            </div>
                            {simulationLogs.map((log, idx) => (
                              <div key={idx} className="leading-relaxed">
                                {log}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {activeSubTab === "offers" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-left">
              {/* LEFT FORM */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-150 flex flex-col justify-between shadow-xs">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950 mb-1 flex items-center gap-1.5">
                    <Tag className="h-4.5 w-4.5 text-brand-orange" />
                    <span>Restaurant Promotion Badges</span>
                  </h3>
                  <p className="text-[10px] font-semibold text-neutral-400 mb-5">
                    Attach high-visibility promotional discounts directly onto
                    kitchen outlets on the home page.
                  </p>

                  <form
                    onSubmit={handleUpdateRestaurantOffer}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Target Kitchen Outlet *
                      </label>
                      <select
                        required
                        value={selectedResIdForOffer || ""}
                        onChange={(e) => {
                          setSelectedResIdForOffer(e.target.value);
                          const currentDiscount = restaurantsList?.find(
                            (r) => r.id === e.target.value,
                          )?.discount;
                          setNewOfferText(currentDiscount || "");
                        }}
                        className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 cursor-pointer text-neutral-800"
                      >
                        <option value="" disabled>
                          Select kitchen...
                        </option>
                        {restaurantsList?.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Promo Discount Text Badge *
                      </label>
                      <input
                        type="text"
                        required
                        value={newOfferText}
                        onChange={(e) => setNewOfferText(e.target.value)}
                        placeholder="e.g. FLAT 25% OFF ON BIRYANI"
                        className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 text-neutral-800"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-orange hover:bg-orange-700 text-white font-black py-3 rounded-xl text-xs transition mt-2 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/15"
                    >
                      <Tag className="h-4 w-4" />
                      <span>Apply Offer Badge</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* RIGHT PREVIEWS */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-150 shadow-xs">
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950 mb-4">
                  Current Promo Badge Listing
                </h3>

                <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                  {restaurantsList?.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-xl bg-neutral-50/50 border border-neutral-150 flex justify-between items-center shadow-xs"
                    >
                      <div>
                        <h4 className="font-black text-neutral-950 text-xs">
                          {r.name}
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-semibold">
                          {r.cuisines?.join(", ")}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {r.discount && r.discount !== "No discount" ? (
                          <span className="text-[10px] font-black bg-orange-50 text-brand-orange border border-orange-200 px-3 py-1.5 rounded-xl font-mono">
                            🏷️ {r.discount}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-xl">
                            No promo badge active
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const updated = restaurantsList.map((item) =>
                              item.id === r.id
                                ? { ...item, discount: "No discount" }
                                : item,
                            );
                            setRestaurantsList(updated);
                            saveRestaurantsToStorage(updated);
                            triggerToast(
                              `Deactivated promo badge on "${r.name}"`,
                            );
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Deactivate Offer Badge"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "coupons" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-left">
              {/* LEFT FORM */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-150 flex flex-col justify-between shadow-xs">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950 mb-1 flex items-center gap-1.5">
                    <Ticket className="h-4.5 w-4.5 text-brand-orange" />
                    <span>Publish Check-out Coupons</span>
                  </h3>
                  <p className="text-[10px] font-semibold text-neutral-400 mb-5">
                    Configure loyalty promo codes that diners can apply on the
                    cart review screen.
                  </p>

                  <form onSubmit={handleAddCouponSubmit} className="space-y-4">
                    {/* Code & Category */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Coupon Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={newCouponCode}
                          onChange={(e) => setNewCouponCode(e.target.value)}
                          placeholder="e.g. EIDFEAST"
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 uppercase text-neutral-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Campaign Category
                        </label>
                        <select
                          value={newCouponCategory}
                          onChange={(e) => setNewCouponCategory(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 cursor-pointer text-neutral-800"
                        >
                          <option value="coupon">🏷️ Coupon Card</option>
                          <option value="bank">🏦 Bank Offer</option>
                          <option value="festival">✨ Festival Offer</option>
                          <option value="restaurant">
                            🍔 Restaurant Offer
                          </option>
                          <option value="cashback">👛 Instant Cashback</option>
                        </select>
                      </div>
                    </div>

                    {/* Banner Title & Discount Label */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Promo Banner Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCouponTitle}
                        onChange={(e) => setNewCouponTitle(e.target.value)}
                        placeholder="e.g. HSBC Visa Diner Delight"
                        className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 text-neutral-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Discount Display Label *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCouponDiscount}
                        onChange={(e) => setNewCouponDiscount(e.target.value)}
                        placeholder="e.g. Flat 30% OFF"
                        className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 text-neutral-800"
                      />
                    </div>

                    {/* Type, Value & Capping */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Type
                        </label>
                        <select
                          value={newCouponDiscountType}
                          onChange={(e) =>
                            setNewCouponDiscountType(e.target.value)
                          }
                          className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 cursor-pointer text-neutral-800"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="flat">Flat Discount</option>
                          <option value="free-delivery">Free Delivery</option>
                          <option value="cashback">Cashback</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Value
                        </label>
                        <input
                          type="number"
                          required
                          value={newCouponDiscountValue}
                          onChange={(e) =>
                            setNewCouponDiscountValue(e.target.value)
                          }
                          placeholder="30"
                          className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 text-neutral-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Max Cap (₹)
                        </label>
                        <input
                          type="number"
                          value={newCouponMaxDiscount}
                          onChange={(e) =>
                            setNewCouponMaxDiscount(e.target.value)
                          }
                          placeholder="300"
                          className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 text-neutral-800"
                        />
                      </div>
                    </div>

                    {/* Limits & Min Order */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Min Order (₹)
                        </label>
                        <input
                          type="number"
                          value={newCouponMinOrder}
                          onChange={(e) => setNewCouponMinOrder(e.target.value)}
                          placeholder="100"
                          className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 text-neutral-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Usage Limit
                        </label>
                        <input
                          type="number"
                          value={newCouponUsageLimit}
                          onChange={(e) =>
                            setNewCouponUsageLimit(e.target.value)
                          }
                          placeholder="100"
                          className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 text-neutral-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Limit/User
                        </label>
                        <input
                          type="number"
                          value={newCouponUsageLimitPerUser}
                          onChange={(e) =>
                            setNewCouponUsageLimitPerUser(e.target.value)
                          }
                          placeholder="1"
                          className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 text-neutral-800"
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Valid From
                        </label>
                        <input
                          type="date"
                          value={newCouponValidFrom}
                          onChange={(e) =>
                            setNewCouponValidFrom(e.target.value)
                          }
                          className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 text-neutral-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                          Valid Till
                        </label>
                        <input
                          type="date"
                          value={newCouponValidTill}
                          onChange={(e) =>
                            setNewCouponValidTill(e.target.value)
                          }
                          className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 text-neutral-800"
                        />
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-neutral-700">
                        <input
                          type="checkbox"
                          checked={newCouponIsActive}
                          onChange={(e) =>
                            setNewCouponIsActive(e.target.checked)
                          }
                          className="rounded border-neutral-300 text-brand-orange focus:ring-brand-orange/20 h-4 w-4"
                        />
                        <span>Is Active</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-neutral-700">
                        <input
                          type="checkbox"
                          checked={newCouponIsLoyaltyReward}
                          onChange={(e) =>
                            setNewCouponIsLoyaltyReward(e.target.checked)
                          }
                          className="rounded border-neutral-300 text-brand-orange focus:ring-brand-orange/20 h-4 w-4"
                        />
                        <span>Loyalty Reward</span>
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                        Coupon Policy / Conditions
                      </label>
                      <textarea
                        value={newCouponDesc}
                        onChange={(e) => setNewCouponDesc(e.target.value)}
                        placeholder="Enter terms, e.g. Applicable on HSBC Cards on orders above ₹ 50."
                        rows={2}
                        className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 resize-none text-neutral-800"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-orange hover:bg-orange-700 text-white font-black py-3 rounded-xl text-xs transition mt-2 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/15"
                    >
                      <Ticket className="h-4 w-4" />
                      <span>Publish Promo Voucher</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* RIGHT LIST */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-150 shadow-xs">
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950 mb-4">
                  Loyalty Vouchers Catalog ({couponsList?.length || 0})
                </h3>

                <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                  {couponsList?.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl border border-neutral-150 bg-neutral-50/50 hover:shadow-xs transition flex justify-between items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-black bg-orange-50 text-brand-orange px-2 py-0.5 rounded border border-orange-200/40">
                            {c.code}
                          </span>
                          <span className="text-[8px] font-black uppercase bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                            {c.category}
                          </span>
                        </div>
                        <h4 className="font-black text-neutral-900 text-xs">
                          {c.title}
                        </h4>
                        <p className="text-[10px] font-bold text-brand-orange">
                          {c.discount}
                        </p>
                        <p className="text-[10px] font-semibold text-neutral-400">
                          {c.desc || "No conditions set."} • Min Order: ₹{" "}
                          {c.minOrder}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.id, c.code)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Revoke Coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* --- EXTRA: COHORT BULK EXCEL IMPORT SLIDE-OVER / MODAL --- */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} maxWidth="max-w-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950">
            Bulk Contacts Paste-Importer
          </h3>
          <button onClick={() => setShowBulkModal(false)} className="text-neutral-400 hover:text-neutral-600">
            <X className="h-5 w-5" />
          </button>
        </div>

              <div className="space-y-4">
                <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                  Paste contact list rows copied from Excel or text files.
                  Format each row as: <br />
                  <span className="font-mono text-[9px] text-neutral-700 bg-neutral-100 p-1 rounded inline-block mt-1">
                    Diner Name, Phone Number, Tag1|Tag2
                  </span>
                </p>

                <textarea
                  value={bulkPasteText}
                  onChange={(e) => setBulkPasteText(e.target.value)}
                  placeholder="e.g.&#10;John Doe, +919811112222, High Spender|Active&#10;Jane Smith, +919820001111, Vegan|Dessert Enthusiast"
                  rows={6}
                  className="w-full bg-neutral-50 border border-neutral-150 rounded-2xl p-4 text-xs font-mono outline-none focus:border-brand-orange"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkImport}
                    className="bg-brand-orange hover:bg-orange-600 text-white font-black px-5 py-2 rounded-xl text-xs transition"
                  >
                    Parse & Import List
                  </button>
                </div>
              </div>
      </Modal>
    </div>
  );
}
