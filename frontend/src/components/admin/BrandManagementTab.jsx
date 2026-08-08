import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../common/Modal";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  ChefHat,
  Utensils,
  Star,
  ShoppingBag,
  Save,
  FolderPlus,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { INITIAL_BRANDS, ICON_MAP } from "../diner/CloudKitchenSection";
import { dinerService } from "../../api/dinerService";

export default function BrandManagementTab({ orders, triggerToast }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const saved = await dinerService.getBrands();
        if (saved && saved.length > 0) {
          setBrands(saved);
        } else {
          setBrands(INITIAL_BRANDS);
        }
      } catch (e) {
        console.error("Failed to load brands:", e);
        setBrands(INITIAL_BRANDS);
      }
    };
    loadBrands();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formName, setFormName] = useState("");
  const [formSlogan, setFormSlogan] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIconName, setFormIconName] = useState("Utensils");
  const [formBannerImage, setFormBannerImage] = useState("");
  const [formPrepTime, setFormPrepTime] = useState("20 mins");
  const [formDeliveryFee, setFormDeliveryFee] = useState("Free");
  const [formStatus, setFormStatus] = useState("Active");
  const [formIsVisible, setFormIsVisible] = useState(true);
  const [formCuisineType, setFormCuisineType] = useState("Biryani");

  useEffect(() => {
    const syncBrands = async () => {
      if (brands && brands.length > 0) {
        await dinerService.saveBrands(brands);
        window.dispatchEvent(new Event("storage"));
      }
    };
    syncBrands();
  }, [brands]);
  const openAddModal = () => {
    setEditingBrand(null);
    setFormName("");
    setFormSlogan("");
    setFormDescription("");
    setFormIconName("Utensils");
    setFormBannerImage(
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    );
    setFormPrepTime("20 mins");
    setFormDeliveryFee("Free");
    setFormStatus("Active");
    setFormIsVisible(true);
    setFormCuisineType("Biryani");
    setIsModalOpen(true);
  };
  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setFormName(brand.name);
    setFormSlogan(brand.slogan);
    setFormDescription(brand.description);
    setFormIconName(brand.iconName);
    setFormBannerImage(brand.bannerImage);
    setFormPrepTime(brand.prepTime);
    setFormDeliveryFee(brand.deliveryFee);
    setFormStatus(brand.status || "Active");
    setFormIsVisible(brand.isVisible !== void 0 ? brand.isVisible : true);
    setFormCuisineType(brand.specialties?.[0]?.category || "Biryani");
    setIsModalOpen(true);
  };
  const handleSaveBrand = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      triggerToast("Please enter a brand name");
      return;
    }
    const paletteMap = {
      Flame: {
        text: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        button: "bg-amber-600 hover:bg-amber-700",
        gradient: "from-amber-600 to-yellow-500",
        glow: "shadow-amber-500/10",
        ring: "ring-amber-500",
      },
      Pizza: {
        text: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-200",
        button: "bg-rose-600 hover:bg-rose-700",
        gradient: "from-rose-600 to-orange-500",
        glow: "shadow-rose-500/10",
        ring: "ring-rose-500",
      },
      Soup: {
        text: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        button: "bg-emerald-600 hover:bg-emerald-700",
        gradient: "from-emerald-600 to-teal-500",
        glow: "shadow-emerald-500/10",
        ring: "ring-emerald-500",
      },
      ChefHat: {
        text: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        button: "bg-orange-600 hover:bg-orange-700",
        gradient: "from-orange-600 to-amber-500",
        glow: "shadow-orange-500/10",
        ring: "ring-orange-500",
      },
      Utensils: {
        text: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        button: "bg-blue-600 hover:bg-blue-700",
        gradient: "from-blue-600 to-indigo-500",
        glow: "shadow-blue-500/10",
        ring: "ring-blue-500",
      },
      Award: {
        text: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200",
        button: "bg-purple-600 hover:bg-purple-700",
        gradient: "from-purple-600 to-pink-500",
        glow: "shadow-purple-500/10",
        ring: "ring-purple-500",
      },
    };
    const themeColor = paletteMap[formIconName] || paletteMap.Utensils;
    if (editingBrand) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingBrand.id
            ? {
              ...b,
              name: formName,
              slogan: formSlogan || `${formCuisineType} Gastronomy`,
              description: formDescription,
              iconName: formIconName,
              bannerImage:
                formBannerImage ||
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
              prepTime: formPrepTime,
              deliveryFee: formDeliveryFee,
              status: formStatus,
              isVisible: formIsVisible,
              themeColor,
              // Update category of any Specialties to match updated Cuisine Type
              specialties: b.specialties.map((s) => ({
                ...s,
                category: formCuisineType,
              })),
            }
            : b,
        ),
      );
      triggerToast(`Brand "${formName}" updated successfully!`);
    } else {
      const newBrandId = `globaleats-${formName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      const seedSpecialties = [
        {
          id: `cb-spec-1-${Date.now()}`,
          name: `Signature ${formCuisineType} Platter`,
          price: 45,
          description: `Our premier chef-crafted ${formCuisineType} platter served hot with premium dips & dynamic garnishes.`,
          image:
            formBannerImage ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
          isVeg: true,
          isBestseller: true,
          category: formCuisineType,
        },
        {
          id: `cb-spec-2-${Date.now()}`,
          name: `Fiery ${formCuisineType} Delight`,
          price: 39,
          description: `A hot & mildly spicy rendition of our signature ${formCuisineType} using fresh garden-picked organic chilies.`,
          image:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400",
          isVeg: false,
          isBestseller: false,
          category: formCuisineType,
        },
      ];
      const newBrand = {
        id: newBrandId,
        name: formName,
        slogan: formSlogan || `Artisanal Premium ${formCuisineType}`,
        description:
          formDescription ||
          `Decadent, gourmet multi-brand kitchen specialty prepared with professional hygiene and express delivery logs.`,
        rating: 4.8,
        reviewsCount: 1,
        prepTime: formPrepTime,
        deliveryFee: formDeliveryFee,
        iconName: formIconName,
        themeColor,
        bannerImage:
          formBannerImage ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
        keyNotes: [
          `Gourmet ${formCuisineType}`,
          "100% Chef Authoritative",
          "Temperature-Lock Delivery",
        ],
        status: formStatus,
        isVisible: formIsVisible,
        specialties: seedSpecialties,
      };
      setBrands((prev) => [...prev, newBrand]);
      triggerToast(
        `Brand "${formName}" successfully launched into multi-brand grid!`,
      );
    }
    setIsModalOpen(false);
  };
  const handleToggleVisibility = (id, currentVal) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isVisible: !currentVal } : b)),
    );
    triggerToast(`Visibility toggled for brand`);
  };
  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Disabled" : "Active";
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b)),
    );
    triggerToast(`Brand status set to ${nextStatus.toUpperCase()}`);
  };
  const handleDeleteBrand = (id, name) => {
    if (
      confirm(
        `Are you sure you want to delete the kitchen brand "${name}"? This will withdraw all menu items and recipes.`,
      )
    ) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      triggerToast(`Chef brand "${name}" completely decommissioned.`);
    }
  };
  const handleResetBrands = () => {
    if (
      confirm(
        "Revert all brands to default kitchen settings? All newly added brands will be removed.",
      )
    ) {
      setBrands(INITIAL_BRANDS);
      triggerToast(
        "Kitchen brand directory re-seeded to factory default state.",
      );
    }
  };
  const renderIconWithClass = (iconName, className = "h-5 w-5") => {
    const Component = ICON_MAP[iconName] || Utensils;
    return <Component className={className} />;
  };
  return (
    <div className="space-y-6" id="brand-management-module-container">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-neutral-900 text-white p-6 rounded-3xl border border-neutral-800 shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800")',
          }}
        />
        <div className="z-10 space-y-1">
          <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-400 animate-pulse" />
            <span>Virtual Brand Management Studio</span>
          </h3>
          <p className="text-[11px] text-neutral-300 max-w-2xl font-medium">
            Launch new virtual concepts, configure custom aesthetic palette
            styling, toggle live visibility indexes, or lock down brand statuses
            for your smart multi-brand facility.
          </p>
        </div>

        <div className="flex items-center gap-2 z-10 shrink-0">
          <button
            onClick={handleResetBrands}
            className="px-3.5 py-2.5 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-750 border border-neutral-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
          >
            Reset Default
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/20 hover:scale-102"
          >
            <Plus className="h-4 w-4" />
            <span>Add Brand Lab</span>
          </button>
        </div>
      </div>

      {/* CLOUD KITCHEN STATISTICS MATRIX */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        id="brand-management-stats-row"
      >
        {/* Metric 1: Total Brands Count */}
        <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-soft flex items-center gap-4">
          <div className="h-10 w-10 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
              Total Brands
            </span>
            <h4 className="text-lg font-black text-gray-900">
              {brands.length} Concepts
            </h4>
          </div>
        </div>

        {/* Metric 2: Active Brands */}
        <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-soft flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
              Active Status
            </span>
            <h4 className="text-lg font-black text-emerald-600">
              {brands.filter((b) => b.status === "Active").length} Live
            </h4>
          </div>
        </div>

        {/* Metric 3: Hidden Brands */}
        <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-soft flex items-center gap-4">
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <EyeOff className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
              Hidden Offline
            </span>
            <h4 className="text-lg font-black text-amber-600">
              {brands.filter((b) => !b.isVisible).length} Toggled
            </h4>
          </div>
        </div>

        {/* Metric 4: Total Specialties */}
        <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-soft flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
              Total Recipes
            </span>
            <h4 className="text-lg font-black text-blue-600">
              {brands.reduce((sum, b) => sum + (b.specialties?.length || 0), 0)}{" "}
              Items
            </h4>
          </div>
        </div>
      </div>

      {/* BRAND CARDS DIRECTORY WITH INTEGRATED STATISTICS */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        id="brand-management-cards-grid"
      >
        {brands.map((brand) => {
          const brandOrders = orders.filter(
            (o) =>
              o.restaurantId === brand.id ||
              o.restaurantName
                .toLowerCase()
                .includes(brand.name.toLowerCase().replace("globaleats ", "")),
          );
          const brandOrdersCount =
            brandOrders.length +
            (brand.id === "globaleats-biryani"
              ? 2
              : brand.id === "globaleats-pizza"
                ? 2
                : 1);
          const brandRevenue =
            brandOrders.reduce((sum, o) => sum + o.total, 0) +
            (brand.id === "globaleats-biryani"
              ? 123.1
              : brand.id === "globaleats-pizza"
                ? 214.15
                : 87.9);
          return (
            <motion.div
              layout
              key={brand.id}
              className={`bg-white rounded-3xl border border-neutral-100 shadow-soft hover:shadow-lg transition relative overflow-hidden flex flex-col justify-between group ${brand.status === "Disabled" ? "opacity-70 bg-neutral-50/50" : ""}`}
            >
              <div>
                {/* Banner image representation */}
                <div className="h-32 w-full bg-gray-100 relative">
                  <img
                    referrerPolicy="no-referrer"
                    src={brand.bannerImage}
                    alt={brand.name}
                    className="w-full h-full object-cover grayscale-xs group-hover:scale-102 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                  {/* Floating Action Bar */}
                  <div className="absolute top-3 right-3 flex gap-1 z-10">
                    <button
                      onClick={() =>
                        handleToggleVisibility(brand.id, brand.isVisible)
                      }
                      className={`h-7 w-7 rounded-lg flex items-center justify-center transition border ${brand.isVisible ? "bg-emerald-500 border-emerald-400 text-white" : "bg-gray-800 border-gray-750 text-gray-400 hover:text-white"}`}
                      title={
                        brand.isVisible
                          ? "Visible to customers"
                          : "Hidden from customers"
                      }
                    >
                      {brand.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleStatus(brand.id, brand.status)}
                      className={`px-2.5 h-7 rounded-lg flex items-center justify-center text-[9px] font-black uppercase tracking-wider transition border ${brand.status === "Active" ? "bg-emerald-500 border-emerald-400 text-white" : "bg-red-500 border-red-400 text-white"}`}
                      title="Toggle Status"
                    >
                      {brand.status}
                    </button>
                  </div>

                  {/* Brand Meta on Banner */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3">
                    <div
                      className={`h-11 w-11 rounded-xl bg-gradient-to-br ${brand.themeColor.gradient} text-white flex items-center justify-center shadow-lg shrink-0`}
                    >
                      {renderIconWithClass(
                        brand.iconName,
                        "h-5 w-5 text-white",
                      )}
                    </div>
                    <div className="text-white truncate">
                      <h4 className="font-display font-black text-sm truncate">
                        {brand.name}
                      </h4>
                      <p className="text-[10px] text-white/80 font-semibold truncate leading-tight">
                        {brand.slogan}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 space-y-4">
                  <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                    {brand.description}
                  </p>

                  {/* STATS SECTION IN CARD */}
                  <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-2.5 rounded-2xl border border-neutral-100">
                    <div className="text-center">
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">
                        Orders
                      </span>
                      <span className="text-xs font-black text-gray-800 font-mono flex items-center justify-center gap-0.5">
                        <ShoppingBag className="h-3 w-3 text-brand-orange" />
                        <span>{brandOrdersCount}</span>
                      </span>
                    </div>

                    <div className="text-center border-x border-neutral-200">
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">
                        Revenue
                      </span>
                      <span className="text-xs font-black text-emerald-600 font-mono">
                        ₹ {brandRevenue.toFixed(0)}
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">
                        Score
                      </span>
                      <span className="text-xs font-black text-amber-500 flex items-center justify-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{brand.rating}</span>
                      </span>
                    </div>
                  </div>

                  {/* Menu Specialties Previews */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                      Menu Preview
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {brand.specialties?.map((item) => (
                        <span
                          key={item.id}
                          className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-[9px] font-bold border border-neutral-200 max-w-[120px] truncate"
                          title={`${item.name} (₹ ${item.price})`}
                        >
                          {item.name}
                        </span>
                      )) || (
                          <span className="text-[10px] text-gray-400 italic font-medium">
                            No specialties created
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-gray-400">
                  Prep: <span className="text-gray-700">{brand.prepTime}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(brand)}
                    className="p-1.5 bg-white text-neutral-600 hover:text-brand-orange hover:bg-orange-50 border border-neutral-200 rounded-lg transition cursor-pointer"
                    title="Edit Brand details"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteBrand(brand.id, brand.name)}
                    className="p-1.5 bg-white text-neutral-400 hover:text-red-600 hover:bg-red-50 border border-neutral-200 rounded-lg transition cursor-pointer"
                    title="Decommission Concept"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* BRAND MODAL (ADD & EDIT) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-lg">
        <div>
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h4 className="font-display font-black text-base text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                {editingBrand ? (
                  <Edit className="h-5 w-5 text-brand-orange" />
                ) : (
                  <FolderPlus className="h-5 w-5 text-brand-orange" />
                )}
                <span>
                  {editingBrand
                    ? "Edit Virtual Brand Lab"
                    : "Launch New Brand Concept"}
                </span>
              </h4>
              <p className="text-[10px] text-gray-400 font-semibold">
                Configure details to update our distributed cloud kitchen
                recipe lists
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="h-8 w-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-500 transition focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSaveBrand} className="p-6 space-y-4">
            {/* Row 1: Name and Cuisine */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. QuikaBite Indian"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                  Cuisine Specialty
                </label>
                <select
                  value={formCuisineType}
                  onChange={(e) => setFormCuisineType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange bg-white"
                >
                  <option value="Biryani">Biryani</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Italian">Italian</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>

            {/* Slogan */}
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={formSlogan}
                onChange={(e) => setFormSlogan(e.target.value)}
                placeholder="e.g. Authentic Wood-Fired Masterpieces"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                Concept Description
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Provide a detailed, mouth-watering description of the food concept, sourcing, hygiene, etc."
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
              />
            </div>

            {/* Row 3: Logo (Icon) Select */}
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                Dynamic Theme Icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {Object.keys(ICON_MAP).map((iconName) => {
                  const Icon = ICON_MAP[iconName];
                  const isSelected = formIconName === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormIconName(iconName)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${isSelected ? "border-brand-orange bg-orange-50 text-brand-orange font-black" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[8px] font-black uppercase leading-none">
                        {iconName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Banner Image URL */}
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                Banner Image URL
              </label>
              <div className="flex gap-2">
                <span className="px-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                  <ImageIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={formBannerImage}
                  onChange={(e) => setFormBannerImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
                />
              </div>
              <span className="text-[9px] text-gray-400 font-semibold block mt-1">
                Provide a landscape Unsplash image URL for beautiful layout
                rendering.
              </span>
            </div>

            {/* Prep time & Delivery fee */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                  Average Prep Time
                </label>
                <input
                  type="text"
                  value={formPrepTime}
                  onChange={(e) => setFormPrepTime(e.target.value)}
                  placeholder="e.g. 25 mins"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                  Delivery Fee
                </label>
                <input
                  type="text"
                  value={formDeliveryFee}
                  onChange={(e) => setFormDeliveryFee(e.target.value)}
                  placeholder="e.g. Free"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            {/* Status & Visibility Row */}
            <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-3 rounded-2xl border border-neutral-150">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-800 block">
                    Brand Status
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold leading-tight">
                    Disable if out of stock
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormStatus((prev) =>
                      prev === "Active" ? "Disabled" : "Active",
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${formStatus === "Active" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}
                >
                  {formStatus}
                </button>
              </div>

              <div className="flex items-center justify-between border-l border-neutral-200 pl-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-800 block">
                    Home Visibility
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold leading-tight">
                    Hide on consumer grid
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormIsVisible((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${formIsVisible ? "bg-emerald-500 text-white" : "bg-neutral-300 text-neutral-700"}`}
                >
                  {formIsVisible ? "Visible" : "Hidden"}
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-250 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Save className="h-4 w-4" />
                <span>
                  {editingBrand ? "Save Changes" : "Launch Brand"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
