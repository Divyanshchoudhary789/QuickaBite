import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  Truck,
  CheckCircle2,
  X,
  MapPin,
  CreditCard,
  User,
  Phone,
  AlertCircle,
  Copy,
  Utensils,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  DollarSign,
  Loader2
} from "lucide-react";
import { managerService } from "../../api/managerService";
import { adminService } from "../../api/adminService";
import { parseApiError } from "../../api/apiClient";

export default function OrderManagementTab({
  orders,
  setOrders,
  couriers,
  setCouriers,
  restaurantsList,
  triggerToast
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginationInfo, setPaginationInfo] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [dispatchStats, setDispatchStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [restaurantFilter, setRestaurantFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [adminRestaurants, setAdminRestaurants] = useState([]);
  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [isLoadingDispatch, setIsLoadingDispatch] = useState(false);

  useEffect(() => {
    const loadAdminRestaurants = async () => {
      try {
        const list = await adminService.getAdminRestaurants();
        if (Array.isArray(list) && list.length > 0) {
          setAdminRestaurants(list);
        }
      } catch (e) {
        console.error("Failed to load admin restaurants in Rider Dispatch:", e);
      }
    };
    loadAdminRestaurants();
  }, []);
  const loadDispatchBoard = async () => {
    setIsLoadingDispatch(true);
    try {
      let apiSortParam = sortBy;
      if (sortBy === "total_high") apiSortParam = "high";
      if (sortBy === "total_low") apiSortParam = "low";
      
      const queryParams = {
        page: currentPage,
        limit: limit,
        returnFullPayload: true,
      };
      if (apiSortParam) queryParams.sort = apiSortParam;
      if (restaurantFilter && restaurantFilter !== "all") {
        queryParams.restaurant = restaurantFilter;
      }
      if (statusFilter && statusFilter !== "all") {
        queryParams.status = statusFilter;
      }
      
      const res = await adminService.getDispatchBoard(queryParams).catch(() => ({ orders: [], stats: null, pagination: null }));
              
        if (res && typeof res === "object" && !Array.isArray(res)) {
          setDispatchOrders(Array.isArray(res.orders) ? res.orders : []);
          if (res.pagination) setPaginationInfo(res.pagination);
          if (res.stats) setDispatchStats(res.stats);
        } else {
          setDispatchOrders(Array.isArray(res) ? res : []);
        }
      } catch (e) {
        console.error("Failed to load dispatch board via API:", e);
      } finally {
        setIsLoadingDispatch(false);
      }
    };

  useEffect(() => {
    loadDispatchBoard();
  }, [currentPage, limit, sortBy, restaurantFilter, statusFilter]);

  const activeOrdersList = dispatchOrders.length > 0 ? dispatchOrders : orders;
  const activeRestaurants = adminRestaurants.length > 0 ? adminRestaurants : (restaurantsList || []);
  const normalizeStatus = (status) => {
    if (status === "confirmed") return "received";
    if (status === "out_for_delivery") return "dispatched";
    return status;
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    triggerToast(`Copied "${text}" to clipboard!`);
  };
  const statusSequence = [
    "received",
    "accepted",
    "preparing",
    "dispatched",
    "delivered"
  ];
  const is24HexMongoId = (str) => typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str);

  const resolveOrderDbId = async (orderId, target) => {
    let candidate = target?.orderId || target?._id || target?.id || orderId;
    if (is24HexMongoId(candidate)) {
      return candidate;
    }
    try {
      const managerOrders = await managerService.getIncomingOrders();
      const matched = managerOrders.find(
        (m) =>
          String(m.orderNumber) === String(target?.orderNumber || orderId) ||
          String(m.orderId) === String(orderId) ||
          String(m.id) === String(orderId) ||
          String(m._id) === String(orderId)
      );
      if (matched && is24HexMongoId(matched.orderId || matched._id || matched.id)) {
        return matched.orderId || matched._id || matched.id;
      }
    } catch (e) {
      console.warn("Could not resolve 24-hex Mongo ID from manager incoming orders:", e);
    }
    return candidate;
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const target = activeOrdersList.find(
      (o) => String(o.orderId) === String(orderId) || String(o._id) === String(orderId) || String(o.id) === String(orderId) || String(o.orderNumber) === String(orderId)
    );
    const targetId = await resolveOrderDbId(orderId, target);

    if (target) {
      const norm = normalizeStatus(target.status);
      if (norm === "rejected" || norm === "delivered" || norm === "cancelled") {
        triggerToast(`Order #${String(targetId)} is already ${target.status.toUpperCase()} and cannot be changed.`, "error");
        return;
      }
    }
    try {
      await managerService.updateOrderStatus(targetId, newStatus);

      try {
        const updatedBoard = await adminService.getDispatchBoard({
          sort: sortBy === "total_high" ? "high" : sortBy === "total_low" ? "low" : sortBy,
          restaurant: restaurantFilter !== "all" ? restaurantFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined
        });
        if (Array.isArray(updatedBoard) && updatedBoard.length > 0) {
          setDispatchOrders(updatedBoard);
        } else {
          const updater = (prev) => prev.map((o) => (String(o._id) === String(targetId) || String(o.id) === String(targetId) || String(o.orderNumber) === String(targetId) ? { ...o, status: newStatus, orderStatus: newStatus } : o));
          setOrders(updater);
          setDispatchOrders(updater);
        }
      } catch {
        const updater = (prev) => prev.map((o) => (String(o._id) === String(targetId) || String(o.id) === String(targetId) || String(o.orderNumber) === String(targetId) ? { ...o, status: newStatus, orderStatus: newStatus } : o));
        setOrders(updater);
        setDispatchOrders(updater);
      }
      triggerToast(`Order #${String(targetId)} status updated to "${newStatus.toUpperCase()}"`);
    } catch (err) {
      const errMsg = parseApiError(err, "Failed to update order status.");
      triggerToast(errMsg, "error");
    }
  };

  const handleAssignCourierToOrder = async (orderId, courierId) => {
    const courier = couriers.find((c) => (c._id || c.id) === courierId);
    if (!courier) return;

    const target = activeOrdersList.find(
      (o) => String(o._id) === String(orderId) || String(o.id) === String(orderId) || String(o.orderNumber) === String(orderId)
    );
    const targetId = await resolveOrderDbId(orderId, target);

    try {
      await adminService.dispatchOrderWithRider(targetId, courier._id || courier.id, "Deliver carefully to the front door");

      const riderName = courier.fullName || courier.name || "Courier";
      const updater = (prev) => prev.map((o) => (String(o.id) === String(targetId) || String(o._id) === String(targetId) ? { ...o, status: "dispatched", driverName: riderName, driverPhone: courier.phone } : o));
      setOrders(updater);
      setDispatchOrders(updater);

      setCouriers((prev) =>
        prev.map((c) => ((c._id || c.id) === courierId ? { ...c, status: "DELIVERING" } : c))
      );

      triggerToast(`Assigned courier ${riderName} to Order #${String(orderId).slice(-6).toUpperCase()}`);
      if (selectedOrder && (selectedOrder.id === orderId || selectedOrder._id === orderId)) {
        setSelectedOrder((prev) => prev ? {
          ...prev,
          status: "dispatched",
          driverName: riderName,
          driverPhone: courier.phone
        } : null);
      }
    } catch (err) {
      const errMsg = parseApiError(err, "Failed to assign courier.");
      triggerToast(errMsg, "error");
    }
  };
  const getCountByStatus = (status) => {
    if (dispatchStats) {
      if (status === "all") return dispatchStats.totalOrders ?? paginationInfo.total ?? activeOrdersList.length;
      if (status === "received") return dispatchStats.received ?? 0;
      if (status === "accepted") return dispatchStats.accepted ?? 0;
      if (status === "preparing") return dispatchStats.preparing ?? 0;
      if (status === "dispatched") return dispatchStats.dispatched ?? 0;
      if (status === "delivered") return dispatchStats.delivered ?? 0;
      if (status === "rejected") return dispatchStats.rejected ?? 0;
    }
    if (status === "all") return paginationInfo.total || activeOrdersList.length;
    return activeOrdersList.filter((o) => normalizeStatus(o.status) === status).length;
  };

  const getItemName = (item) => {
    if (!item) return "Gourmet Dish";
    if (typeof item === "string") return item;
    return item.name || item.menuItem?.name || item.title || item.itemName || "Gourmet Dish";
  };

  const getItemPrice = (item, orderTotal = 0, totalItemsCount = 1) => {
    if (!item) return 0;
    const qty = Number(item.quantity) || 1;
    const unitP = Number(item.price ?? item.unitPrice ?? item.menuItem?.price);
    if (!isNaN(unitP) && unitP > 0) {
      return unitP * qty;
    }
    if (typeof item.totalPrice === "number" && item.totalPrice > 0) {
      return item.totalPrice;
    }
    if (orderTotal > 0 && totalItemsCount > 0) {
      return Number((orderTotal / totalItemsCount).toFixed(2)) * qty;
    }
    return 0;
  };

  const filteredOrders = activeOrdersList.filter((o) => {
    const normalized = normalizeStatus(o.status);
    const matchesStatus = statusFilter === "all" || normalized === statusFilter;
    const matchesRestaurant =
      restaurantFilter === "all" ||
      String(o.restaurantId) === String(restaurantFilter) ||
      String(o.restaurant) === String(restaurantFilter) ||
      String(o.restaurant?._id || o.restaurant?.id) === String(restaurantFilter) ||
      (o.restaurantName && activeRestaurants.some((r) => (String(r.id) === String(restaurantFilter) || String(r._id) === String(restaurantFilter)) && r.name?.toLowerCase() === o.restaurantName?.toLowerCase())) ||
      (o.restaurantName && String(o.restaurantName).toLowerCase().includes(String(restaurantFilter).toLowerCase()));

    const searchLower = (debouncedSearchTerm || "").toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      (o.id && String(o.id).toLowerCase().includes(searchLower)) ||
      (o.orderNumber && String(o.orderNumber).toLowerCase().includes(searchLower)) ||
      (o.restaurantName && o.restaurantName.toLowerCase().includes(searchLower)) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchLower)) ||
      o.items?.some((item) => getItemName(item).toLowerCase().includes(searchLower)) ||
      (o.driverName && o.driverName.toLowerCase().includes(searchLower));

    return matchesStatus && matchesRestaurant && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "newest") {
      return (b.timestamp || b.createdAt || "").localeCompare(a.timestamp || a.createdAt || "");
    }
    if (sortBy === "oldest") {
      return (a.timestamp || a.createdAt || "").localeCompare(b.timestamp || b.createdAt || "");
    }
    if (sortBy === "total_high") {
      return (b.total || 0) - (a.total || 0);
    }
    if (sortBy === "total_low") {
      return (a.total || 0) - (b.total || 0);
    }
    return 0;
  });
  const getStatusTokens = (status) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case "rejected":
        return {
          bg: "bg-rose-50 border-rose-100 text-rose-700",
          badge: "bg-rose-500",
          text: "text-rose-700",
          label: "Rejected",
          icon: AlertCircle
        };
      case "received":
        return {
          bg: "bg-indigo-50 border-indigo-100 text-indigo-700",
          badge: "bg-indigo-500",
          text: "text-indigo-700",
          label: "Received",
          icon: Clock
        };
      case "accepted":
        return {
          bg: "bg-blue-50 border-blue-100 text-blue-700",
          badge: "bg-blue-500",
          text: "text-blue-700",
          label: "Accepted",
          icon: CheckCircle2
        };
      case "preparing":
        return {
          bg: "bg-amber-50 border-amber-100 text-amber-700",
          badge: "bg-amber-500",
          text: "text-amber-700",
          label: "Preparing",
          icon: Utensils
        };
      case "dispatched":
        return {
          bg: "bg-sky-50 border-sky-100 text-sky-700",
          badge: "bg-sky-500",
          text: "text-sky-700",
          label: "Dispatched",
          icon: Truck
        };
      case "delivered":
        return {
          bg: "bg-emerald-50 border-emerald-100 text-emerald-700",
          badge: "bg-emerald-500",
          text: "text-emerald-700",
          label: "Delivered",
          icon: CheckCircle2
        };
      default:
        return {
          bg: "bg-neutral-100 border-neutral-200 text-neutral-700",
          badge: "bg-neutral-500",
          text: "text-neutral-700",
          label: "Unknown",
          icon: AlertCircle
        };
    }
  };
  const getCustomerInfo = (orderParam) => {
    if (!orderParam || typeof orderParam !== "object") {
      return {
        name: "Guest Customer",
        phone: "+91 9876543210",
        address: "Address Not Provided",
        instructions: "None",
        paymentMethod: "Online Payment"
      };
    }

    const realName =
      orderParam.customerName ||
      orderParam.contactName ||
      orderParam.user?.fullName ||
      orderParam.user?.name ||
      orderParam.userName;

    const realPhone =
      orderParam.customerPhone ||
      orderParam.contactPhone ||
      orderParam.user?.phone ||
      orderParam.phone;

    const realAddress =
      typeof orderParam.deliveryAddress === "string"
        ? orderParam.deliveryAddress
        : orderParam.deliveryAddress?.detail ||
        orderParam.deliveryAddress?.formattedAddress ||
        orderParam.address ||
        orderParam.shippingAddress;

    const realInstructions =
      typeof orderParam.deliveryInstructions === "string"
        ? orderParam.deliveryInstructions
        : orderParam.deliveryInstructions?.customNote || orderParam.instructions;

    const realPayment =
      orderParam.paymentMethod?.toUpperCase() ||
      (orderParam.paymentStatus === "paid" ? "ONLINE (PAID)" : "COD");

    const orderId = orderParam.id || orderParam._id || "123";
    const sum = String(orderId).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockNames = ["Ananya Krishnan", "Rohit Sharma", "Pooja Gupta", "Aryan Mehta", "Kavya Reddy", "Vikram Singh"];
    const mockPhones = ["+91 9876543210", "+91 87654 32109", "+91 76543 21098", "+91 65432 10987", "+91 54321 09876", "+91 93456 78901"];
    const mockAddresses = [
      "Flat 1402, Prestige Towers, Residency Road, Bengaluru 560025",
      "Villa 24, Street 5, Jubilee Hills, Hyderabad 500033",
      "3C, Ansal Sushant Lok, Gurugram, Haryana 122002",
      "Office 901, One BKC, Bandra Kurla Complex, Mumbai 400051",
      "Townhouse 8, Sobha City, Thanisandra, Bengaluru 560064",
      "Penthouse, Lodha Bellissimo, Mahalaxmi, Mumbai 400011"
    ];
    const idx = sum % mockNames.length;

    return {
      name: realName || mockNames[idx],
      phone: realPhone || mockPhones[idx],
      address: realAddress || mockAddresses[idx],
      instructions: realInstructions || "None",
      paymentMethod: realPayment
    };
  };

  return <div className="space-y-6" id="order-management-tab">

    {/* 1. Statistics Cards Ribbon */}
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {["all", "received", "accepted", "preparing", "dispatched", "delivered", "rejected"].map((status) => {
        const count = getCountByStatus(status);
        const active = statusFilter === status;
        let label = status.toUpperCase();
        if (status === "all") label = "TOTAL ORDERS";
        let colorClass = "border-neutral-200 text-neutral-700 bg-white hover:border-neutral-300";
        if (active) {
          if (status === "all") colorClass = "bg-neutral-900 border-neutral-900 text-white";
          if (status === "received") colorClass = "bg-indigo-600 border-indigo-600 text-white";
          if (status === "accepted") colorClass = "bg-blue-600 border-blue-600 text-white";
          if (status === "preparing") colorClass = "bg-amber-500 border-amber-500 text-white";
          if (status === "dispatched") colorClass = "bg-sky-500 border-sky-500 text-white";
          if (status === "delivered") colorClass = "bg-emerald-600 border-emerald-600 text-white";
          if (status === "rejected") colorClass = "bg-rose-600 border-rose-600 text-white";
        }
        return <button
          key={status}
          onClick={() => {
            setStatusFilter(status);
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${colorClass}`}
        >
          <span className={`text-[9px] font-black tracking-wider uppercase opacity-80`}>
            {label}
          </span>
          <div className="flex justify-between items-baseline w-full mt-1">
            <span className="text-xl font-black font-mono leading-none">{count}</span>
            <span className="text-[10px] font-bold opacity-60">
              {status === "all" ? "Logs" : "Live"}
            </span>
          </div>
        </button>;
      })}
    </div>

    {/* 2. Control Row: Search, Filter & Sort */}
    <div className="bg-white rounded-3xl border border-neutral-150 p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">

      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search Order #, kitchen, rider..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-50 border border-neutral-150 rounded-xl py-2 pl-10 pr-4 text-xs font-semibold outline-none focus:border-brand-orange focus:bg-white transition"
        />
        {searchTerm && <button
          onClick={() => setSearchTerm("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
        >
          ✕
        </button>}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">

        {/* Restaurant Selector */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3 w-3 text-neutral-400" />
          <select
            value={restaurantFilter}
            onChange={(e) => setRestaurantFilter(e.target.value)}
            className="bg-neutral-50 border border-neutral-150 rounded-xl px-2.5 py-1.5 text-xs font-bold text-neutral-700 outline-none focus:border-brand-orange cursor-pointer"
          >
            <option value="all">All Kitchen Outlets</option>
            {activeRestaurants.map((res) => (
              <option key={res.id || res._id} value={res.id || res._id}>
                {res.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sorter */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-neutral-50 border border-neutral-150 rounded-xl px-2.5 py-1.5 text-xs font-bold text-neutral-700 outline-none focus:border-brand-orange cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="total_high">Value: High to Low</option>
          <option value="total_low">Value: Low to High</option>
        </select>

        {isLoadingDispatch && (
          <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 text-brand-orange px-2.5 py-1 rounded-xl text-[10px] font-bold">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Fetching...</span>
          </div>
        )}

      </div>
    </div>

    {/* 3. Orders Grid & Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {isLoadingDispatch ? (
        <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center py-20 bg-white border border-dashed border-neutral-200 rounded-3xl space-y-3">
          <Loader2 className="h-10 w-10 text-brand-orange animate-spin mx-auto" />
          <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider">Fetching Live Dispatch Board...</h4>
          <p className="text-[10px] text-neutral-400">Loading live dispatch data...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center py-20 bg-white border border-dashed border-neutral-200 rounded-3xl">
          <AlertCircle className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
          <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider">No matching active orders found</h4>
          <p className="text-[10px] text-neutral-400 mt-1">Try adjusting your filters, search criteria, or status tab Selection.</p>
        </div>
      ) : filteredOrders.map((o) => {
        const statusTokens = getStatusTokens(o.status);
        const currentStatusNorm = normalizeStatus(o.status);
        const customer = getCustomerInfo(o);
        const totalItemsCount = (o.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
        const currentIdx = currentStatusNorm !== "rejected" ? statusSequence.indexOf(currentStatusNorm) : -1;
        const nextStatus = currentIdx >= 0 && currentIdx < statusSequence.length - 1 ? statusSequence[currentIdx + 1] : null;
        return <motion.div
          layout
          key={o._id || o.id}
          className="bg-white border border-neutral-150 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-neutral-300 transition-all duration-300"
        >
          <div className="space-y-4">

            {/* Order Header */}
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-neutral-900 text-xs font-mono truncate" title={o._id || o.id}>Order #{o._id || o.id}</h4>
                  <button
                    onClick={() => copyToClipboard(o._id || o.id)}
                    className="p-1 hover:bg-neutral-100 rounded-md text-neutral-400 hover:text-neutral-600 transition shrink-0"
                    title="Copy Full Order ID"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400 font-bold font-mono mt-0.5">{o.timestamp || o.createdAt || "Just Now"}</p>
              </div>

              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${statusTokens.bg}`}>
                {statusTokens.label}
              </span>
            </div>

            {/* Customer Brief */}
            <div className="border-t border-b border-neutral-100 py-2.5 space-y-1">
              <div className="flex items-center gap-2 text-[10px] text-neutral-600">
                <User className="h-3 w-3 text-neutral-400 shrink-0" />
                <span className="font-bold text-neutral-900 truncate">{customer.name}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                <MapPin className="h-3 w-3 text-neutral-400 shrink-0" />
                <span className="truncate">{customer.address}</span>
              </div>
            </div>

            {/* Kitchen Outlet & Items Details */}
            <div className="bg-neutral-50 rounded-2xl p-3.5 space-y-2 border border-neutral-100">
              <span className="text-[9px] font-black uppercase text-neutral-400 block tracking-wider truncate">
                Kitchen: <span className="text-neutral-700">{o.restaurantName || "Kitchen Outlet"}</span>
              </span>

              {/* Compact Item list */}
              <div className="space-y-1">
                {(o.items || []).slice(0, 2).map((item, idx) => {
                  const itemName = getItemName(item);
                  const itemPriceVal = getItemPrice(item, o.total || 0, totalItemsCount);
                  const qty = Number(item.quantity) || 1;
                  return (
                    <div key={idx} className="flex justify-between items-center text-[11px] font-semibold text-neutral-600 gap-2">
                      <span className="truncate flex-1">{itemName} <span className="text-neutral-400 font-mono text-[10px]">x{qty}</span></span>
                      <span className="font-bold text-neutral-900 font-mono shrink-0">₹ {itemPriceVal.toFixed(2)}</span>
                    </div>
                  );
                })}
                {(o.items || []).length > 2 && <p className="text-[9px] text-neutral-400 font-bold italic mt-1">
                  + {(o.items || []).length - 2} more item{(o.items || []).length - 2 > 1 ? "s" : ""}...
                </p>}
              </div>

              <div className="border-t border-neutral-200 mt-2 pt-2 flex justify-between items-center text-neutral-950 font-black">
                <span className="text-[10px]">Total Paid:</span>
                <span className="text-brand-orange font-mono text-xs">₹ {Number(o.total || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* View Full Slider Drawer Button */}
            <button
              onClick={() => setSelectedOrder(o)}
              className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <SlidersHorizontal className="h-3 w-3 text-brand-orange" />
              <span>Inspect Detailed Slider Drawer</span>
            </button>

            {/* Courier Partner */}
            {o.driverName ? <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-[10px] font-semibold text-neutral-700 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="truncate">Courier: <span className="font-black text-neutral-900">{o.driverName}</span></span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black font-mono shrink-0">ASSIGNED</span>
            </div> : currentStatusNorm === "dispatched" ? <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block">Assign Courier Agent</label>
              <select
                onChange={(e) => handleAssignCourierToOrder(o._id || o.id, e.target.value)}
                defaultValue=""
                className="w-full bg-orange-50/50 border border-orange-100 text-orange-800 rounded-xl p-2 text-[10px] font-bold outline-none focus:border-brand-orange cursor-pointer"
              >
                <option value="" disabled>Select Courier Agent...</option>
                {couriers.filter((c) => (c.status || "").toUpperCase() === "IDLE" || (c.status || "").toLowerCase() === "idle").map((c) => <option key={c._id || c.id} value={c._id || c.id}>
                  {c.fullName || c.name} ({(c.vehicleType || c.vehicle || "Bike").split(" ")[0]}) • ⭐{typeof c.rating === "number" ? c.rating.toFixed(1) : "5.0"}
                </option>)}
              </select>
            </div> : null}

          </div>

          {/* Dispatch & Manager Control Buttons */}
          <div className="mt-5 pt-3 border-t border-neutral-100 space-y-2">
            <div className="flex items-center gap-2">
              {nextStatus ? (
                <button
                  onClick={() => handleUpdateStatus(o._id || o.id, nextStatus)}
                  className="flex-1 py-2.5 bg-neutral-900 hover:bg-brand-orange text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs hover:shadow-sm"
                >
                  <span>Mark: {nextStatus.toUpperCase()}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <div className="flex-1 text-center text-[10px] font-black text-emerald-600 flex items-center justify-center gap-1 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="h-4 w-4" />
                  ORDER COMPLETE
                </div>
              )}

              {currentStatusNorm !== "rejected" && currentStatusNorm !== "delivered" && (
                <button
                  onClick={() => handleUpdateStatus(o._id || o.id, "rejected")}
                  className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                  title="Reject / Cancel Order"
                >
                  Reject
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-100">
              <span className="text-[9px] font-black uppercase text-neutral-400 shrink-0">State:</span>
              <select
                value={currentStatusNorm}
                onChange={(e) => handleUpdateStatus(o._id || o.id, e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1 text-[10px] font-bold text-neutral-700 outline-none focus:border-brand-orange cursor-pointer"
              >
                <option value="received">Received (Pending)</option>
                <option value="accepted">Accepted (Confirmed)</option>
                <option value="preparing">Preparing (In Kitchen)</option>
                <option value="dispatched">Dispatched (Out for Delivery)</option>
                <option value="delivered">Delivered (Completed)</option>
                <option value="rejected">Rejected (Cancelled)</option>
              </select>
            </div>
          </div>

        </motion.div>;
      })}
    </div>

    {/* 4. Pagination Controls Bar */}
    {((paginationInfo && (paginationInfo.totalPages > 1 || (paginationInfo.total > limit))) || dispatchOrders.length >= limit || currentPage > 1) && (
      <div className="bg-white rounded-3xl border border-neutral-150 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="text-xs font-semibold text-neutral-500">
          Showing page<span className="font-black text-neutral-900">{paginationInfo.page || currentPage}</span> of{" "}
          <span className="font-black text-neutral-900">{paginationInfo.totalPages || 1}</span> (Total{" "}
          <span className="font-black text-brand-orange">{paginationInfo.total || dispatchOrders.length}</span>)
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1 || isLoadingDispatch}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="px-3.5 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-neutral-700 transition cursor-pointer"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.max(paginationInfo.totalPages || 1, currentPage + (dispatchOrders.length >= limit ? 1 : 0)) }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-8 h-8 rounded-xl text-xs font-black transition cursor-pointer ${pg === currentPage
                    ? "bg-brand-orange text-white shadow-xs"
                    : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200"
                  }`}
              >
                {pg}
              </button>
            ))}
          </div>

          <button
            disabled={(paginationInfo.totalPages ? currentPage >= paginationInfo.totalPages : dispatchOrders.length < limit) || isLoadingDispatch}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3.5 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-neutral-700 transition cursor-pointer"
          >
            Next →
          </button>
        </div>
      </div>
    )}

    {/* ORDER DETAILS SLIDE-OVER DRAWER MODAL */}
    <AnimatePresence>
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Slider Header */}
            <div className="p-5 border-b border-neutral-200 flex justify-between items-center bg-neutral-900 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-orange flex items-center justify-center text-white font-black text-sm">
                  #{String(selectedOrder._id || selectedOrder.id || selectedOrder.orderNumber).slice(-4).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-white">
                    Order #{selectedOrder._id || selectedOrder.id || selectedOrder.orderNumber}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono">
                    {selectedOrder.timestamp || selectedOrder.createdAt || "Live Order"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Content Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              {(() => {
                const statusTokens = getStatusTokens(selectedOrder.status);
                const customer = getCustomerInfo(selectedOrder);
                const totalItemsCount = (selectedOrder.items || []).reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);

                return (
                  <>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                      <div>
                        <span className="text-[9px] font-black uppercase text-neutral-400 block tracking-wider">
                          Current Order Status
                        </span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border mt-1 ${statusTokens.bg}`}>
                          <statusTokens.icon className="w-3.5 h-3.5" />
                          {statusTokens.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black uppercase text-neutral-400 block tracking-wider">
                          Total Grand Value
                        </span>
                        <span className="font-mono text-base font-black text-brand-orange">
                          ₹ {Number(selectedOrder.total || selectedOrder.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                      <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-2">
                        <User className="w-4 h-4 text-brand-orange" />
                        <span>Customer & Delivery Details</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[9px] font-black uppercase text-neutral-400 block">Name</span>
                          <span className="font-extrabold text-neutral-900">{customer.name}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase text-neutral-400 block">Phone</span>
                          <a href={`tel:${customer.phone}`} className="font-mono font-bold text-brand-orange hover:underline">
                            {customer.phone}
                          </a>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 space-y-1">
                        <span className="text-[9px] font-black uppercase text-neutral-400 block">Delivery Address</span>
                        <p className="text-xs font-medium text-neutral-700 leading-relaxed bg-neutral-50 p-2.5 rounded-xl border border-neutral-150">
                          {customer.address}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100 text-xs">
                        <div>
                          <span className="text-[9px] font-black uppercase text-neutral-400 block">Payment Method</span>
                          <span className="font-bold text-neutral-800">{customer.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase text-neutral-400 block">Special Notes</span>
                          <span className="font-semibold text-neutral-600 truncate block">{customer.instructions}</span>
                        </div>
                      </div>
                    </div>

                    {/* Kitchen Partner */}
                    <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center font-black">
                          <Utensils className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase text-orange-700 block">Partner Kitchen Outlet</span>
                          <h5 className="font-black text-xs text-neutral-900">
                            {selectedOrder.restaurantName || "Kitchen Outlet"}
                          </h5>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items Breakdown */}
                    <div className="space-y-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                      <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center justify-between border-b border-neutral-100 pb-2">
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-brand-orange" />
                          <span>Ordered Items ({totalItemsCount})</span>
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 font-bold">Itemized Bill</span>
                      </h4>

                      <div className="divide-y divide-neutral-100">
                        {(selectedOrder.items || []).map((item, idx) => {
                          const itemName = getItemName(item);
                          const itemPriceVal = getItemPrice(item, selectedOrder.total || 0, totalItemsCount);
                          const qty = Number(item.quantity) || 1;

                          return (
                            <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                              <div>
                                <span className="font-extrabold text-neutral-900">{itemName}</span>
                                <span className="text-neutral-400 font-mono text-[11px] ml-2">x{qty}</span>
                              </div>
                              <span className="font-mono font-black text-neutral-900">₹ {itemPriceVal.toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-3 border-t-2 border-dashed border-neutral-200 space-y-1">
                        <div className="flex justify-between text-xs text-neutral-500 font-medium">
                          <span>Subtotal Items</span>
                          <span className="font-mono">₹ {(Number(selectedOrder.total || 0) * 0.82).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-neutral-500 font-medium">
                          <span>Taxes & Service Fee</span>
                          <span className="font-mono">₹ {(Number(selectedOrder.total || 0) * 0.18).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-black text-neutral-950 pt-2 border-t border-neutral-150">
                          <span>Grand Total</span>
                          <span className="font-mono text-brand-orange">₹ {Number(selectedOrder.total || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Courier & Rider Assignment */}
                    <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                      <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>Dispatch Rider Assignment</span>
                      </h4>

                      {selectedOrder.driverName ? (
                        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[9px] font-black uppercase text-emerald-700 block">Assigned Rider</span>
                            <span className="font-black text-neutral-900">{selectedOrder.driverName}</span>
                            {selectedOrder.driverPhone && (
                              <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{selectedOrder.driverPhone}</p>
                            )}
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-600 text-white font-black text-[9px] rounded-md uppercase">
                            DISPATCHED
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase text-neutral-500 block">
                            Select Available Rider Agent
                          </label>
                          <select
                            onChange={(e) => handleAssignCourierToOrder(selectedOrder._id || selectedOrder.id, e.target.value)}
                            defaultValue=""
                            className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-bold text-neutral-800 outline-none focus:border-brand-orange"
                          >
                            <option value="" disabled>Select Courier Agent...</option>
                            {couriers.map((c) => (
                              <option key={c._id || c.id} value={c._id || c.id}>
                                {c.fullName || c.name} ({c.vehicleType || "Bike"}) • ⭐{typeof c.rating === "number" ? c.rating.toFixed(1) : "5.0"}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Slider Footer Actions */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center gap-3 shrink-0">
              {(() => {
                const currentNorm = normalizeStatus(selectedOrder.status);
                const currentIdx = currentNorm !== "rejected" ? statusSequence.indexOf(currentNorm) : -1;
                const nextStatus = currentIdx >= 0 && currentIdx < statusSequence.length - 1 ? statusSequence[currentIdx + 1] : null;

                return (
                  <>
                    {nextStatus && (
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedOrder._id || selectedOrder.id, nextStatus);
                          setSelectedOrder((prev) => prev ? { ...prev, status: nextStatus } : null);
                        }}
                        className="flex-1 py-3 bg-neutral-950 hover:bg-brand-orange text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                      >
                        <span>Advance to: {nextStatus.toUpperCase()}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    {currentNorm !== "rejected" && currentNorm !== "delivered" && (
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedOrder._id || selectedOrder.id, "rejected");
                          setSelectedOrder((prev) => prev ? { ...prev, status: "rejected" } : null);
                        }}
                        className="py-3 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
                      >
                        Reject
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </div>;
}
