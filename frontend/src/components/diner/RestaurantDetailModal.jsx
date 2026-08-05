import React, { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import {
  X,
  Star,
  Clock,
  Search,
  Check,
  CheckCircle,
  Ticket,
  Calendar,
  Camera,
  Plus,
  Minus,
  ShoppingCart,
  ThumbsUp,
  Send,
  Sparkles,
  Upload,
  Trash2,
  Heart,
  Edit3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { extractImageUrl, dinerService, normalizeReview } from "../../api/dinerService";
import { parseApiError } from "../../api/apiClient";
const getInitialReviewsForRestaurant = (restaurantId) => {
  const commonReplies = {
    chef: {
      text: "Thank you so much! Our kitchen team is extremely dedicated to packing meals with premium insulated wraps so they arrive fresh and hot. We are thrilled to cook for you!",
      date: "Today",
      author: "Head Chef",
    },
    manager: {
      text: "We appreciate your wonderful feedback. We share these words with our staff to keep delivering top quality. Looking forward to your next order!",
      date: "Yesterday",
      author: "Restaurant Manager",
    },
  };
  const reviewsByRestaurant = {
    "bombay-darling": [
      {
        id: "bd-rev-1",
        userName: "Mariam Al-Mansoori",
        rating: 5,
        date: "Today",
        text: "The Chicken Biryani was absolutely scrumptious! Highly recommended. The delivery arrived 10 minutes earlier than estimated, and the food was steaming hot.",
        likes: 14,
        photos: [
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",
        ],
        restaurantReply: commonReplies.chef,
      },
      {
        id: "bd-rev-2",
        userName: "Hassan Syed",
        rating: 5,
        date: "3 days ago",
        text: "The Butter Chicken with Garlic Naan is legendary! Perfect sweetness and spice balance. Consistent quality every single time.",
        likes: 9,
        photos: [
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400",
        ],
        restaurantReply: null,
      },
    ],
    "biryani-junction": [
      {
        id: "bj-rev-1",
        userName: "Aisha Al-Maktoum",
        rating: 5,
        date: "Today",
        text: "The Hyderabadi Dum Biryani here is as authentic as it gets. Long grain rice, perfectly spiced chicken, and beautiful saffron aroma. Best biryani in town!",
        likes: 18,
        photos: [
          "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=400",
        ],
        restaurantReply: commonReplies.chef,
      },
      {
        id: "bj-rev-2",
        userName: "Kabir Dev",
        rating: 4,
        date: "5 days ago",
        text: "Tried the Lucknowi Mutton Biryani. It was cooked to perfection, mutton was falling off the bone. A bit mild for my taste but high quality.",
        likes: 7,
        photos: [],
        restaurantReply: null,
      },
    ],
    "la-dolce-vita": [
      {
        id: "ldv-rev-1",
        userName: "Francesca Rossi",
        rating: 5,
        date: "Yesterday",
        text: "Mamma Mia! The woodfired Margherita pizza took me straight to Naples. The crust is perfectly thin and charred. Best Italian option on this app!",
        likes: 21,
        photos: [
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
        ],
        restaurantReply: commonReplies.chef,
      },
      {
        id: "ldv-rev-2",
        userName: "Liam Cooper",
        rating: 5,
        date: "4 days ago",
        text: "Outstanding Creamy Fettuccine Carbonara. Very rich, perfectly seasoned with real parmigiano. Delivery was prompt.",
        likes: 12,
        photos: [
          "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=400",
        ],
        restaurantReply: commonReplies.manager,
      },
    ],
    "the-burger-lab": [
      {
        id: "tbl-rev-1",
        userName: "Zayn Malik",
        rating: 5,
        date: "Today",
        text: "The Lava Cheese Burger is an absolute masterpiece! Cheesy goodness oozing with every bite. Fries were seasoned perfectly too.",
        likes: 15,
        photos: [
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        ],
        restaurantReply: commonReplies.chef,
      },
      {
        id: "tbl-rev-2",
        userName: "Sarah Jenkins",
        rating: 4,
        date: "3 days ago",
        text: "Loved the Peri-Peri fried chicken burger. Crispy, spicy, and juicy. Deducting one star because delivery took a bit longer than estimated.",
        likes: 6,
        photos: [],
        restaurantReply: commonReplies.manager,
      },
    ],
    "sweet-treats-co": [
      {
        id: "stc-rev-1",
        userName: "Fatima Al-Kamali",
        rating: 5,
        date: "Yesterday",
        text: "Best chocolate fudge lava cake I have ever had! Warm, gooey, and absolutely decadent. Highly recommend ordering.",
        likes: 11,
        photos: [
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400",
        ],
        restaurantReply: commonReplies.chef,
      },
      {
        id: "stc-rev-2",
        userName: "Noah Miller",
        rating: 5,
        date: "2 weeks ago",
        text: "The red velvet cupcakes are out of this world. Frosting is not too sweet, just perfect. My kids absolutely loved them!",
        likes: 8,
        photos: [
          "https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&q=80&w=400",
        ],
        restaurantReply: null,
      },
    ],
    "green-lean-salads": [
      {
        id: "gls-rev-1",
        userName: "Emily Watson",
        rating: 5,
        date: "Today",
        text: "Finally a healthy option that actually tastes incredible! Avocado Quinoa bowl is loaded with fresh, high-quality ingredients.",
        likes: 13,
        photos: [
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
        ],
        restaurantReply: commonReplies.chef,
      },
      {
        id: "gls-rev-2",
        userName: "Ryan Reynolds",
        rating: 5,
        date: "4 days ago",
        text: "The Grilled Salmon salad was fresh and healthy. Dressing was outstanding, Salmon cooked beautifully. Will order daily!",
        likes: 19,
        photos: [
          "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=crop&q=80&w=400",
        ],
        restaurantReply: commonReplies.manager,
      },
    ],
  };
  const defaultReviews = [
    {
      id: "def-1",
      userName: "Mariam Al-Mansoori",
      rating: 5,
      date: "Today",
      text: "The food was absolutely scrumptious! The delivery arrived 10 minutes earlier than estimated, and the hot items were piping hot. Best meal of the week.",
      likes: 14,
      isLocal: false,
      photos: [
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=500",
      ],
      restaurantReply: commonReplies.chef,
    },
    {
      id: "def-2",
      userName: "Hassan Syed",
      rating: 5,
      date: "3 days ago",
      text: "Superb quantity and quality of ingredients. The bestseller dishes are highly recommended. Extremely hygienic packaging!",
      likes: 9,
      isLocal: false,
      photos: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=500",
      ],
      restaurantReply: null,
    },
    {
      id: "def-3",
      userName: "Oliver Bennett",
      rating: 4,
      date: "1 week ago",
      text: "Really good flavor profile, especially the signature dishes. A minor delay in delivery but they made up for it with extra promo codes.",
      likes: 4,
      isLocal: false,
      photos: [],
      restaurantReply: {
        text: "We appreciate your feedback! We are sharing this note with our delivery drivers to optimize routes. Glad you loved the signature tastes!",
        date: "6 days ago",
        author: "Restaurant Manager",
      },
    },
  ];
  return reviewsByRestaurant[restaurantId] || defaultReviews;
};

const MenuItemCard = React.memo(function MenuItemCard({
  item,
  quantityInCart,
  isOutOfStock,
  isFavorite,
  onAddToCart,
  onRemoveFromCart,
  onToggleFavoriteDish,
  restaurantId,
  restaurantName,
}) {
  return (
    <div
      className={`flex gap-4 p-4 border border-gray-100 hover:border-orange-100/70 hover:bg-orange-50/10 rounded-2xl transition-all duration-300 ${isOutOfStock ? "grayscale opacity-75" : ""}`}
      id={`menu-item-${item.id || item._id}`}
    >
      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div
            className={`h-4 w-4 border-2 flex items-center justify-center rounded-sm shrink-0 ${item.isVeg ? "border-emerald-500" : "border-rose-600"}`}
            title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${item.isVeg ? "bg-emerald-500" : "bg-rose-600"}`}
            />
          </div>

          {item.isBestseller && (
            <span className="bg-amber-50 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5 uppercase tracking-wider border border-amber-100">
              <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
              <span>Bestseller</span>
            </span>
          )}
        </div>

        <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
        <span className="font-mono font-black text-gray-900 text-sm mt-0.5 block">
          ₹ {item.price}
        </span>
        <p className="text-gray-400 text-xs mt-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Image & Action container */}
      <div className="flex flex-col items-center shrink-0 self-center">
        {/* Image Div */}
        <div
          className="relative w-24 h-24 bg-neutral-50 rounded-2xl overflow-hidden"
          id={`dish-thumb-${item.id}`}
        >
          <img
            src={extractImageUrl(item.image)}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-2 mt-2 justify-center w-full">
          <div className="w-[86px]">
            {isOutOfStock ? (
              <div className="w-full bg-neutral-100 text-neutral-400 border border-neutral-200 text-[9px] font-black py-1.5 rounded-lg shadow-xs text-center select-none uppercase tracking-wider">
                OUT OF STOCK
              </div>
            ) : quantityInCart > 0 ? (
              <div className="bg-white border border-brand-orange text-brand-orange flex items-center justify-between px-1 py-0.5 rounded-lg shadow-md font-bold text-xs transition-all transform active:scale-95">
                <button
                  onClick={() => onRemoveFromCart(restaurantId, item.id || item._id)}
                  className="px-1.5 py-0.5 hover:bg-orange-50 rounded text-brand-orange font-bold transition text-xs active:scale-90 cursor-pointer"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="font-black text-gray-800">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => onAddToCart(restaurantId, restaurantName, item)}
                  className="px-1.5 py-0.5 hover:bg-orange-50 rounded text-brand-orange font-bold transition text-xs active:scale-90 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(restaurantId, restaurantName, item)}
                className="cursor-pointer w-full bg-white text-brand-orange hover:bg-orange-50 active:bg-orange-100 border border-orange-200 text-[10px] font-black py-1 px-2.5 rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                ADD +
              </button>
            )}
          </div>

          {onToggleFavoriteDish && (
            <button
              onClick={() => onToggleFavoriteDish(item.id || item._id)}
              className="h-7 w-7 bg-white hover:bg-neutral-50 text-gray-700 border border-neutral-200 rounded-lg flex items-center justify-center transition-colors duration-150 shadow-sm active:scale-90 cursor-pointer shrink-0"
              title={isFavorite ? "Remove from favorites" : "Save to favorites"}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isFavorite ? "text-rose-500 fill-rose-500" : "text-gray-400"
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
export default function RestaurantDetailModal({
  restaurant,
  cartItems,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  favoriteDishes = [],
  onToggleFavoriteDish,
  onViewCart,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menu");
  const [isScrolled, setIsScrolled] = useState(false);

  const handleGoToCart = () => {
    if (onViewCart) {
      onViewCart();
    } else {
      onClose();
      navigate("/cart");
    }
  };

  const handleScroll = (e) => {
    const scrolled = e.target.scrollTop > 60;
    setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
  };

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  React.useEffect(() => {
    const targetDishId = restaurant?.initialMenuItemId || restaurant?.initialDishId;
    if (targetDishId) {
      setActiveTab("menu");
      const timer = setTimeout(() => {
        const el = document.getElementById(`menu-item-${targetDishId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-brand-orange", "bg-orange-50/50");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-brand-orange", "bg-orange-50/50");
          }, 3000);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [restaurant?.initialMenuItemId, restaurant?.initialDishId]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [vegOnly, setVegOnly] = useState(false);
  const [bestsellersOnly, setBestsellersOnly] = useState(false);
  const [activeMenuCategory, setActiveMenuCategory] = useState("all");
  const [reviewsList, setReviewsList] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewErrorMsg, setReviewErrorMsg] = useState(null);

  // Edit / Delete Review State
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewRating, setEditReviewRating] = useState(5);
  const [editReviewComment, setEditReviewComment] = useState("");
  const [editReviewSubmitting, setEditReviewSubmitting] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [confirmDeleteReviewId, setConfirmDeleteReviewId] = useState(null);
  const [editAttachedPhotos, setEditAttachedPhotos] = useState([]);

  // Unified attached photos state: array of { id, url, file }
  const [attachedPhotos, setAttachedPhotos] = useState([]);
  const reviewPhotos = React.useMemo(() => attachedPhotos.map((p) => p.url), [attachedPhotos]);
  const reviewImageFiles = React.useMemo(() => attachedPhotos.map((p) => p.file).filter(Boolean), [attachedPhotos]);

  const resId = restaurant?.id || restaurant?._id;

  const fetchReviews = React.useCallback(async () => {
    if (!resId) return;
    setLoadingReviews(true);
    setReviewErrorMsg(null);
    try {
      const data = await dinerService.getReviewsByRestaurant(resId);
      setReviewsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      const fallback = getInitialReviewsForRestaurant(resId);
      setReviewsList(fallback);
    } finally {
      setLoadingReviews(false);
    }
  }, [resId]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const isReviewOwner = React.useCallback((rev) => {
    if (!rev) return false;
    if (rev.isLocal) return true;

    try {
      let loggedUserId = null;
      let loggedUserName = null;
      let loggedUserEmail = null;

      const profileStr = localStorage.getItem("globaleats_profile_info");
      if (profileStr) {
        const p = JSON.parse(profileStr);
        loggedUserId = p?.id || p?._id || loggedUserId;
        loggedUserName = p?.name || p?.fullName || loggedUserName;
        if (p?.email) loggedUserEmail = String(p.email).toLowerCase();
      }

      const userStr = localStorage.getItem("globaleats_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        loggedUserId = u?.id || u?._id || loggedUserId;
        loggedUserName = u?.name || u?.fullName || loggedUserName;
        if (u?.email) loggedUserEmail = String(u.email).toLowerCase();
      }

      const token = localStorage.getItem("globaleats_token");
      if (token) {
        try {
          const base64Url = token.split(".")[1];
          if (base64Url) {
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const decoded = JSON.parse(atob(base64));
            if (decoded?.userId) loggedUserId = String(decoded.userId);
            if (decoded?.id) loggedUserId = String(decoded.id);
            if (decoded?._id) loggedUserId = String(decoded._id);
          }
        } catch (e) {
          // ignore
        }
      }

      if (!loggedUserId && !loggedUserEmail && !loggedUserName) {
        return false;
      }

      const customerObj = rev.customer || rev.user;
      const revUserId = typeof customerObj === "object" ? String(customerObj?._id || customerObj?.id || "") : String(customerObj || "");
      const revUserEmail = typeof customerObj === "object" && customerObj?.email ? String(customerObj.email).toLowerCase() : null;
      const revUserName = rev.userName || (typeof customerObj === "object" ? customerObj?.fullName || customerObj?.name : null);

      if (loggedUserId && revUserId && String(revUserId) === String(loggedUserId)) {
        return true;
      }
      if (loggedUserEmail && revUserEmail && revUserEmail === loggedUserEmail) {
        return true;
      }
      if (loggedUserName && revUserName && String(revUserName).trim().toLowerCase() === String(loggedUserName).trim().toLowerCase()) {
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }, []);

  const isUserLoggedIn = React.useMemo(() => {
    try {
      const isLoggedInFlag = localStorage.getItem("globaleats_is_logged_in");
      const token = localStorage.getItem("globaleats_token");
      const profile = localStorage.getItem("globaleats_profile_info");
      const user = localStorage.getItem("globaleats_user");

      return isLoggedInFlag === "true" || Boolean(token) || Boolean(profile) || Boolean(user);
    } catch (e) {
      return false;
    }
  }, []);

  const hasUserReviewed = React.useMemo(() => {
    if (!reviewsList || !reviewsList.length) return false;
    return reviewsList.some((rev) => isReviewOwner(rev));
  }, [reviewsList, isReviewOwner]);

  const canWriteReview = isUserLoggedIn && !hasUserReviewed;

  const FOOD_PHOTO_PRESETS = [
    {
      name: "Pizza 🍕",
      url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Burger 🍔",
      url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Pasta 🍝",
      url: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Sushi 🍣",
      url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Cake 🍰",
      url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400",
    },
  ];

  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [dragActive, setDragActive] = useState(false);
  const [votedReviews, setVotedReviews] = useState([]);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);
  const photosList = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1560684352-8497838a2229?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=500",
  ];
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const openingHours = "9:00 AM - 11:30 PM";
  const [offersList, setOffersList] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCoupon = (code) => {
    const copy = () => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    };
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(copy).catch(() => {
        // fallback
        const el = document.createElement("textarea");
        el.value = code;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        copy();
      });
    } else {
      const el = document.createElement("textarea");
      el.value = code;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      copy();
    }
  };

  React.useEffect(() => {
    let cancelled = false;
    const fetchCoupons = async () => {
      setOffersLoading(true);
      try {
        const coupons = await dinerService.getActiveCoupons();
        if (!cancelled) setOffersList(Array.isArray(coupons) ? coupons : []);
      } catch (err) {
        console.error("Failed to fetch coupons:", err);
        if (!cancelled) setOffersList([]);
      } finally {
        if (!cancelled) setOffersLoading(false);
      }
    };
    fetchCoupons();
    return () => { cancelled = true; };
  }, []);

  const cartQuantityMap = React.useMemo(() => {
    const map = {};
    if (cartItems && cartItems.length) {
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        const id = item?.menuItem?.id || item?.menuItem?._id;
        if (id != null) {
          map[id] = item.quantity;
          map[String(id)] = item.quantity;
        }
      }
    }
    return map;
  }, [cartItems]);

  const favoriteSet = React.useMemo(() => {
    const set = new Set();
    if (favoriteDishes && favoriteDishes.length) {
      for (let i = 0; i < favoriteDishes.length; i++) {
        const f = favoriteDishes[i];
        const id = typeof f === "object" ? f?.id || f?._id : f;
        if (id != null) set.add(String(id));
      }
    }
    return set;
  }, [favoriteDishes]);

  const menuCategories = React.useMemo(() => {
    if (!restaurant?.menu) return ["all"];
    return [
      "all",
      ...Array.from(new Set(restaurant.menu.map((item) => item.category))),
    ];
  }, [restaurant?.menu]);

  const filteredMenu = React.useMemo(() => {
    if (!restaurant?.menu) return [];
    const search = debouncedSearchTerm.toLowerCase();
    return restaurant.menu.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search);
      const matchesVeg = vegOnly ? item.isVeg : true;
      const matchesBestseller = bestsellersOnly ? item.isBestseller : true;
      const matchesCategory =
        activeMenuCategory === "all"
          ? true
          : item.category === activeMenuCategory;
      return matchesSearch && matchesVeg && matchesBestseller && matchesCategory;
    });
  }, [
    restaurant?.menu,
    debouncedSearchTerm,
    vegOnly,
    bestsellersOnly,
    activeMenuCategory,
  ]);

  const totalCartCount = React.useMemo(
    () => cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
    [cartItems]
  );
  const totalCartCost = React.useMemo(
    () =>
      cartItems.reduce(
        (acc, curr) => acc + curr.quantity * (curr.menuItem?.price || 0),
        0
      ),
    [cartItems]
  );

  const reviewsStats = React.useMemo(() => {
    if (!reviewsList || !reviewsList.length) {
      return { avg: "0.0", starRows: [], total: 0 };
    }
    const total = reviewsList.length;
    let sum = 0;
    const countMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (let i = 0; i < total; i++) {
      const r = reviewsList[i];
      sum += r.rating;
      if (countMap[r.rating] !== undefined) countMap[r.rating]++;
    }
    const avg = (sum / total).toFixed(1);
    const starRows = [5, 4, 3, 2, 1].map((star) => {
      const count = countMap[star] || 0;
      const pct = Math.round((count / total) * 100);
      return { star, count, pct };
    });
    return { avg, starRows, total };
  }, [reviewsList]);
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };
  const processFiles = (files) => {
    if (attachedPhotos.length >= 3) {
      setReviewErrorMsg("Maximum 3 images allowed per review.");
      return;
    }
    const currentCount = attachedPhotos.length;
    const remainingSlots = 3 - currentCount;
    const validImages = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (validImages.length > remainingSlots) {
      setReviewErrorMsg("Maximum 3 images allowed per review.");
    }

    const imagesToProcess = validImages.slice(0, remainingSlots);
    imagesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachedPhotos((prev) => {
            if (prev.length >= 3) return prev;
            return [
              ...prev,
              {
                id: `file-${Date.now()}-${Math.random()}`,
                url: event.target.result,
                file: file,
              },
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const handlePhotoUpload = (e) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(files);
  };
  const removeReviewPhoto = (indexToRemove) => {
    setAttachedPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };
  const togglePresetPhoto = (url) => {
    setAttachedPhotos((prev) => {
      const exists = prev.some((p) => p.url === url);
      if (exists) {
        return prev.filter((p) => p.url !== url);
      } else {
        return [...prev, { id: `preset-${url}`, url: url, file: null }];
      }
    });
  };
  const handleHelpfulClick = (reviewId) => {
    if (votedReviews.includes(reviewId)) {
      setReviewsList((prev) =>
        prev.map((rev) => {
          if (rev.id === reviewId || rev._id === reviewId) {
            return { ...rev, likes: Math.max(0, rev.likes - 1) };
          }
          return rev;
        }),
      );
      setVotedReviews((prev) => prev.filter((id) => id !== reviewId));
    } else {
      setReviewsList((prev) =>
        prev.map((rev) => {
          if (rev.id === reviewId || rev._id === reviewId) {
            return { ...rev, likes: rev.likes + 1 };
          }
          return rev;
        }),
      );
      setVotedReviews((prev) => [...prev, reviewId]);
    }
  };

  // --- API HANDLERS ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    setReviewSubmitting(true);
    setReviewErrorMsg(null);

    const currentRating = newReviewRating;
    const currentComment = newReviewText.trim();
    let reviewerName = "Verified Diner";
    try {
      const storedUser = localStorage.getItem("globaleats_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        reviewerName = parsed?.fullName || parsed?.name || "Verified Diner";
      }
    } catch (e) {
      // ignore
    }

    try {
      const formData = new FormData();
      formData.append("restaurant", resId);
      formData.append("rating", String(currentRating));
      formData.append("comment", currentComment);

      reviewImageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const resData = await dinerService.createReview({
        restaurant: resId,
        rating: currentRating,
        comment: currentComment,
        images: reviewImageFiles,
        photoUrls: reviewPhotos,
        userName: reviewerName,
      });

      const rawItem = resData?.data || (resData?.success ? resData : null);
      let newReviewItem = rawItem ? normalizeReview(rawItem) : null;

      if (!newReviewItem) {
        newReviewItem = {
          id: String(Date.now()),
          _id: String(Date.now()),
          userName: reviewerName,
          rating: currentRating,
          text: currentComment,
          comment: currentComment,
          photos: [...reviewPhotos],
          images: reviewPhotos,
          date: "Just Now",
          isLocal: true,
          likes: 0,
        };
      } else {
        newReviewItem.isLocal = true;
        if (!newReviewItem.photos || newReviewItem.photos.length === 0) {
          newReviewItem.photos = reviewPhotos.length > 0 ? [...reviewPhotos] : [];
        }
      }

      setReviewsList((prev) => [newReviewItem, ...prev]);
      setNewReviewText("");
      setNewReviewRating(5);
      setAttachedPhotos([]);
      setReviewSuccessMsg(true);
      setTimeout(() => setReviewSuccessMsg(false), 4000);
      await fetchReviews();
    } catch (err) {
      console.error("Failed to create review:", err);
      const msg = parseApiError(err, "Failed to post review. Please try again.");
      setReviewErrorMsg(msg);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const processEditFiles = (files) => {
    if (editAttachedPhotos.length >= 3) {
      setReviewErrorMsg("Maximum 3 images allowed per review.");
      return;
    }
    const currentCount = editAttachedPhotos.length;
    const remainingSlots = 3 - currentCount;
    const validImages = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (validImages.length > remainingSlots) {
      setReviewErrorMsg("Maximum 3 images allowed per review.");
    }

    const imagesToProcess = validImages.slice(0, remainingSlots);
    imagesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditAttachedPhotos((prev) => {
            if (prev.length >= 3) return prev;
            return [
              ...prev,
              {
                id: `edit-file-${Date.now()}-${Math.random()}`,
                url: event.target.result,
                file: file,
              },
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEditPhoto = (indexToRemove) => {
    setEditAttachedPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleStartEdit = (rev) => {
    setEditingReviewId(rev.id || rev._id);
    setEditReviewRating(rev.rating || 5);
    setEditReviewComment(rev.text || rev.comment || "");
    const photos = rev.photos && Array.isArray(rev.photos) ? rev.photos : [];
    setEditAttachedPhotos(
      photos.map((p, idx) => ({
        id: `existing-${idx}-${Date.now()}`,
        url: typeof p === "string" ? p : p?.url || p?.secure_url || "",
        file: null,
      })).filter((item) => Boolean(item.url))
    );
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditReviewRating(5);
    setEditReviewComment("");
    setEditAttachedPhotos([]);
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editReviewComment.trim()) return;
    setEditReviewSubmitting(true);
    setReviewErrorMsg(null);

    try {
      const editFiles = editAttachedPhotos.map((p) => p.file).filter(Boolean);
      const editPhotoUrls = editAttachedPhotos.map((p) => p.url);

      await dinerService.updateReview(reviewId, {
        rating: editReviewRating,
        comment: editReviewComment.trim(),
        images: editFiles,
        photoUrls: editPhotoUrls,
      });

      setReviewsList((prev) =>
        prev.map((rev) => {
          if (String(rev.id) === String(reviewId) || String(rev._id) === String(reviewId)) {
            return {
              ...rev,
              rating: editReviewRating,
              text: editReviewComment.trim(),
              comment: editReviewComment.trim(),
              photos: editPhotoUrls,
            };
          }
          return rev;
        })
      );
      handleCancelEdit();
      await fetchReviews();
    } catch (err) {
      console.error("Failed to update review:", err);
      const msg = parseApiError(err, "Failed to update review.");
      setReviewErrorMsg(msg);
    } finally {
      setEditReviewSubmitting(false);
    }
  };

  const handleDeleteReview = (reviewId) => {
    setConfirmDeleteReviewId(reviewId);
  };

  const handleConfirmDeleteReview = async () => {
    if (!confirmDeleteReviewId) return;
    const reviewId = confirmDeleteReviewId;
    setDeletingReviewId(reviewId);
    setReviewErrorMsg(null);

    try {
      await dinerService.deleteReview(reviewId);
      setReviewsList((prev) =>
        prev.filter(
          (rev) => String(rev.id) !== String(reviewId) && String(rev._id) !== String(reviewId)
        )
      );
      setConfirmDeleteReviewId(null);
      await fetchReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
      const msg = parseApiError(err, "Failed to delete review.");
      setReviewErrorMsg(msg);
    } finally {
      setDeletingReviewId(null);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-fade-in cursor-pointer"
      id="restaurant-detail-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl cursor-default flex flex-col h-[calc(100vh-16px)] sm:h-[90vh] max-h-[900px]"
        id="restaurant-detail-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Sticky Header Bar */}
        <div
          className={`absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 transition-all duration-300 ${
            isScrolled
              ? "bg-white border-b border-gray-100 shadow-xs"
              : "bg-transparent border-transparent"
          }`}
        >
          <span
            className={`font-display font-black text-sm truncate max-w-[240px] sm:max-w-md transition-all duration-300 ${
              isScrolled
                ? "text-gray-800 opacity-100 translate-y-0"
                : "text-white opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            {restaurant.name}
          </span>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-all duration-300 ${
              isScrolled
                ? "text-gray-500 hover:bg-gray-100"
                : "bg-black/50 hover:bg-black/70 text-white"
            }`}
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable container for scrolling */}
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain transform-gpu"
          id="restaurant-modal-scrollable-content"
        >
          {/* Banner image with header overlay */}
          <div
            className="relative h-52 sm:h-60 bg-neutral-100"
            id="restaurant-banner-image"
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Restaurant details on banner */}
            <div
              className="absolute bottom-4 left-6 right-6 text-white"
              id="restaurant-banner-content"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {restaurant.discount || "Special Promo"}
                </span>
                <span className="bg-black/40 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span>HYGIENE CERTIFIED</span>
                </span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl leading-tight">
                {restaurant.name}
              </h2>
              <p className="text-gray-200 text-xs mt-1 font-semibold tracking-wide">
                {restaurant.cuisines.join(", ")}
              </p>
            </div>
          </div>

          {/* Quick metadata & timings bar */}
          <div
            className="bg-orange-50/40 border-b border-orange-100/30 px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600"
            id="restaurant-quick-stats"
          >
            <div className="flex items-center gap-2">
              <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
              <div>
                <span className="font-bold text-gray-900 text-sm">
                  {restaurant.rating}
                </span>
                <span className="text-gray-400">
                  {" "}
                  ({restaurant.reviewsCount ?? restaurant.totalReviews ?? 0} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-brand-orange" />
              <div>
                <span className="font-bold text-gray-900">
                  {restaurant.deliveryTime}
                </span>
                <span className="text-gray-400"> • 1.2 km away</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-emerald-600" />
              <div>
                <span className="font-bold text-gray-900">
                  Today: {openingHours}
                </span>
                <span className="text-emerald-600 font-extrabold ml-1.5 bg-emerald-50 px-1.5 py-0.5 rounded-md text-[10px] uppercase">
                  Open Now
                </span>
              </div>
            </div>
          </div>

          {/* Offers Carousel section */}
          <div
            className="px-6 py-3 bg-white border-b border-gray-100"
            id="restaurant-offers-showcase"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
              <Ticket className="h-3.5 w-3.5 text-brand-orange" />
              <span>Exclusive Promotional Deals</span>
            </div>

            <div
              className="flex gap-3 overflow-x-auto pb-1.5 no-scrollbar"
              id="offers-scroller"
            >
              {offersLoading ? (
                // Skeleton shimmer cards while loading
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-2xl p-3 min-w-[210px] max-w-[240px] shrink-0 flex flex-col gap-2 animate-pulse"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="h-3 w-20 bg-gray-200 rounded-md" />
                      <div className="h-3 w-14 bg-gray-200 rounded-md" />
                    </div>
                    <div className="h-2.5 w-32 bg-gray-200 rounded-md mt-1" />
                    <div className="h-2 w-24 bg-gray-200 rounded-md mt-2" />
                  </div>
                ))
              ) : offersList.length === 0 ? (
                <p className="text-xs text-gray-400 font-medium py-2">No active deals right now. Check back soon!</p>
              ) : (
                offersList.map((coupon) => {
                  // Build a human-readable subtitle from discount info
                  let subtitle = coupon.title || "";
                  if (coupon.discountType === "percentage" && coupon.discountValue) {
                    subtitle = `${coupon.discountValue}% off`;
                    if (coupon.maximumDiscount) subtitle += ` up to ₹${coupon.maximumDiscount}`;
                  } else if (coupon.discountType === "flat" && coupon.discountValue) {
                    subtitle = `Flat ₹${coupon.discountValue} off`;
                  }
                  const desc = coupon.desc
                    ? coupon.desc
                    : coupon.minOrder > 0
                    ? `Min order ₹${coupon.minOrder}`
                    : coupon.expiry
                    ? `Valid till ${coupon.expiry}`
                    : "";

                  const isCopied = copiedCode === coupon.code;
                  return (
                    <div
                      key={coupon.id || coupon.code}
                      onClick={() => handleCopyCoupon(coupon.code)}
                      title={`Click to copy code: ${coupon.code}`}
                      className={`cursor-pointer select-none bg-gradient-to-br from-amber-50/70 to-orange-50/50 border rounded-2xl p-3 min-w-[210px] max-w-[240px] shrink-0 flex flex-col justify-between shadow-xs transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] ${
                        isCopied
                          ? "border-emerald-300 ring-2 ring-emerald-100"
                          : "border-orange-100/50 hover:border-orange-200"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-black text-xs text-brand-orange uppercase">
                            {coupon.title || subtitle}
                          </span>
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-wider transition-all duration-200 ${
                              isCopied
                                ? "bg-emerald-500 border border-emerald-500 text-white"
                                : "bg-white border border-orange-200 text-orange-700"
                            }`}
                          >
                            {isCopied ? "✓ Copied!" : coupon.code}
                          </span>
                        </div>
                        <p className="text-gray-800 font-extrabold text-[11px] mt-1">
                          {subtitle}
                        </p>
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold mt-2">
                        {desc ? `✦ ${desc}` : ""}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Dynamic Navigation Tabs Selector */}
          <div
            className="bg-gray-50 border-b border-gray-100 flex p-1 sticky top-[48px] z-30"
            id="restaurant-details-tabs"
          >
            <button
              onClick={() => setActiveTab("menu")}
              className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === "menu" ? "bg-white text-brand-orange shadow-sm rounded-xl font-black" : "text-gray-500 hover:text-gray-800"}`}
            >
              <span>📖 Menu</span>
              <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {restaurant.menu.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === "reviews" ? "bg-white text-brand-orange shadow-sm rounded-xl font-black" : "text-gray-500 hover:text-gray-800"}`}
            >
              <span>💬 Reviews</span>
              <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {reviewsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("photos")}
              className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === "photos" ? "bg-white text-brand-orange shadow-sm rounded-xl font-black" : "text-gray-500 hover:text-gray-800"}`}
            >
              <span>📸 Photos</span>
              <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {photosList.length}
              </span>
            </button>
          </div>

          {/* Main Content Area based on Active Tab */}
          <div
            className="flex-1 max-h-none overflow-y-visible scrollbar-thin scrollbar-thumb-gray-200"
            id="restaurant-tab-body-container"
          >
            {/* ================================== TABS: MENU ================================== */}
            {activeTab === "menu" && (
              <div>
                {/* Menu Filter and search row */}
                <div className="p-4 bg-white border-b border-gray-100 space-y-3 sticky top-[96px] z-20">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    {/* Search inside menu input */}
                    <div className="relative w-full sm:max-w-xs">
                      <input
                        type="text"
                        placeholder="Search dishes or ingredients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-orange-200 focus:ring-2 focus:ring-orange-100 transition"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>

                    {/* Diet toggles */}
                    <div className="flex items-center gap-4 shrink-0">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={vegOnly}
                          onChange={() => setVegOnly(!vegOnly)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4.5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500 relative" />
                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Veg Only
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={bestsellersOnly}
                          onChange={() => setBestsellersOnly(!bestsellersOnly)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4.5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-500 relative" />
                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          Bestsellers
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Subcategories Scroll */}
                  <div
                    className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
                    id="menu-subcategory-scroller"
                  >
                    {menuCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveMenuCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition capitalize ${activeMenuCategory === cat ? "bg-brand-orange text-white shadow-sm font-black" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                      >
                        {cat === "all" ? "All Dishes" : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu listings list */}
                <div className="p-5">
                  {filteredMenu.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5">
                      {filteredMenu.map((item) => (
                        <MenuItemCard
                          key={item.id || item._id}
                          item={item}
                          quantityInCart={
                            cartQuantityMap[item.id] ||
                            cartQuantityMap[item._id] ||
                            cartQuantityMap[String(item.id)] ||
                            cartQuantityMap[String(item._id)] ||
                            0
                          }
                          isOutOfStock={
                            item.isAvailable === false || item.availability === false
                          }
                          isFavorite={
                            favoriteSet.has(String(item.id)) ||
                            (item._id && favoriteSet.has(String(item._id)))
                          }
                          onAddToCart={onAddToCart}
                          onRemoveFromCart={onRemoveFromCart}
                          onToggleFavoriteDish={onToggleFavoriteDish}
                          restaurantId={restaurant.id}
                          restaurantName={restaurant.name}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 font-medium text-sm mt-3">
                        No dishes found matching filters.
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Try turning off some checkboxes!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================================== TABS: REVIEWS ================================== */}
            {activeTab === "reviews" && (
              <div className="p-5 space-y-6">
                {/* Global Error Banner */}
                {reviewErrorMsg && (
                  <div className="bg-rose-50 text-rose-800 border border-rose-200 text-xs p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>{reviewErrorMsg}</span>
                    </div>
                    <button
                      onClick={() => setReviewErrorMsg(null)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Dynamic Ratings breakdown block */}
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-center justify-between border border-gray-100">
                  <div className="text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-1">
                      <span className="text-3xl font-black text-gray-900">
                        {reviewsStats.avg}
                      </span>
                      <span className="text-gray-400 text-sm">/ 5</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${s < Math.round(Number(reviewsStats.avg)) ? "text-amber-500 fill-amber-500" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {reviewsStats.total} total customer reviews
                    </p>
                  </div>

                  {/* Stars chart bar lines */}
                  <div className="flex-1 max-w-xs w-full space-y-1.5">
                    {reviewsStats.starRows.map(({ star, count, pct }) => (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-[10px]"
                      >
                        <span className="w-10 text-gray-500 text-right font-bold">
                          {star} star
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-gray-400 font-bold text-right">
                          {pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add interactive review Form (Only visible if user is logged in and has NOT already reviewed this restaurant) */}
                {canWriteReview && (
                  <form
                    onSubmit={handleSubmitReview}
                    className="bg-white border border-orange-100/60 rounded-2xl p-4 space-y-4 shadow-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">✍️</span>
                      <h4 className="font-display font-black text-xs uppercase tracking-wider text-gray-500">
                        Write a Restaurant Review
                      </h4>
                    </div>

                    {reviewErrorMsg && (
                      <div className="bg-rose-50 text-rose-800 border border-rose-200 text-xs px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-between animate-fade-in">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                          <span>{reviewErrorMsg}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReviewErrorMsg(null)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}

                    {reviewSuccessMsg && (
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-2 animate-fade-in">
                        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                        <div className="space-y-0.5">
                          <p>Review posted successfully!</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">
                          Star Rating
                        </label>
                        <div className="flex items-center gap-1.5 h-8">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReviewRating(star)}
                              className="focus:outline-none transition hover:scale-120 cursor-pointer"
                              title={`${star} star${star > 1 ? "s" : ""}`}
                            >
                              <Star
                                className={`h-6 w-6 transition-colors ${star <= newReviewRating ? "text-amber-500 fill-amber-500" : "text-gray-200 hover:text-amber-200"}`}
                              />
                            </button>
                          ))}
                          <span className="text-[10px] text-gray-400 font-bold uppercase ml-2 select-none">
                            {newReviewRating === 5 && "Outstanding!"}
                            {newReviewRating === 4 && "Very Good!"}
                            {newReviewRating === 3 && "Average"}
                            {newReviewRating === 2 && "Disappointed"}
                            {newReviewRating === 1 && "Very Poor"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">
                        Detailed Comment / Description
                      </label>
                      <textarea
                        placeholder="Tell other food lovers about the flavor balance, ingredient quality, delivery speeds, packaging hygiene..."
                        rows={2}
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        required
                        maxLength={1000}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:bg-white focus:border-orange-200 focus:ring-2 focus:ring-orange-100/50 transition resize-none leading-relaxed"
                      />
                    </div>

                    {/* Attach Food Photos Submodule */}
                    <div className="space-y-2.5">
                      <label className="block text-[10px] text-gray-400 font-bold uppercase">
                        Attach Food Snapshots
                      </label>

                      {/* File Upload Zone with Drag & Drop */}
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${dragActive ? "border-brand-orange bg-orange-50/40 text-brand-orange scale-[0.99]" : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-orange-200 text-gray-400"}`}
                      >
                        <input
                          type="file"
                          id="food-photo-uploader"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="food-photo-uploader"
                          className="cursor-pointer flex flex-col items-center w-full"
                        >
                          <Upload className="h-5 w-5 text-gray-400 mb-1 group-hover:text-brand-orange transition" />
                          <p className="text-[10px] font-bold text-gray-600">
                            Drag & drop food images or{" "}
                            <span className="text-brand-orange underline">
                              browse files
                            </span>
                          </p>
                          <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                            JPEG, PNG, WebP supported (Max 3 images).
                          </p>
                        </label>
                      </div>

                      {/* Attachment Previews */}
                      {attachedPhotos.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[9px] text-gray-400 font-bold uppercase">
                            Attached Snapshots ({attachedPhotos.length} / 3):
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {attachedPhotos.map((photoObj, idx) => (
                              <div
                                key={photoObj.id || idx}
                                onClick={() => removeReviewPhoto(idx)}
                                className="relative group w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-red-600 bg-red-600 shadow-xs cursor-pointer shrink-0 transition-all duration-200 select-none"
                                title="Click to remove photo"
                              >
                                <img
                                  src={photoObj.url}
                                  alt="Preview"
                                  className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-25 group-hover:scale-110"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-red-600/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 pointer-events-none">
                                  <Trash2 className="h-5 w-5 text-white drop-shadow-md animate-bounce" />
                                  <span className="text-[8px] font-black uppercase tracking-wider text-white mt-0.5">Delete</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="bg-brand-orange hover:bg-orange-700 disabled:opacity-50 text-white font-black text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                      >
                        {reviewSubmitting ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Posting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3 w-3" />
                            <span>Post Review</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews Feed */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">
                      Customer Experience Feed
                    </h4>
                    <span className="text-[9px] bg-gray-100 text-gray-500 font-black px-2 py-0.5 rounded-full select-none">
                      Most Recent
                    </span>
                  </div>

                  {loadingReviews ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                      <Loader2 className="h-6 w-6 animate-spin text-brand-orange" />
                      <span className="text-xs font-bold">Loading reviews...</span>
                    </div>
                  ) : reviewsList.length > 0 ? (
                    <div className="space-y-5">
                      {reviewsList.map((rev) => {
                        const revId = rev.id || rev._id;
                        const isEditing = String(editingReviewId) === String(revId);
                        const isDeleting = String(deletingReviewId) === String(revId);

                        return (
                          <div
                            key={revId}
                            className="border-b border-gray-100 pb-5 space-y-3"
                          >
                            {/* Review Header */}
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-extrabold text-sm text-gray-800 flex items-center gap-1.5">
                                  <span>{rev.userName}</span>
                                  {(rev.isLocal || rev.user) && (
                                    <span className="bg-orange-50 text-brand-orange text-[9px] font-black px-1.5 py-0.2 rounded border border-orange-100 uppercase tracking-wide">
                                      Verified
                                    </span>
                                  )}
                                </h5>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < rev.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-gray-400 ml-2 font-bold">
                                    {rev.date}
                                  </span>
                                </div>
                              </div>

                              {/* Review Actions: Edit, Delete (Only visible to review author) */}
                              {isReviewOwner(rev) && (
                                <div className="flex items-center gap-1.5">
                                  {/* Edit Button */}
                                  <button
                                    onClick={() => handleStartEdit(rev)}
                                    className="p-1 hover:bg-orange-50 text-gray-400 hover:text-brand-orange rounded-lg transition cursor-pointer"
                                    title="Edit review"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    onClick={() => handleDeleteReview(revId)}
                                    disabled={isDeleting}
                                    className="p-1 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition cursor-pointer disabled:opacity-50"
                                    title="Delete review"
                                  >
                                    {isDeleting ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-500" />
                                    ) : (
                                      <Trash2 className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Inline Edit Form OR Review Content */}
                            {isEditing ? (
                              <div className="bg-orange-50/40 border border-orange-200/60 rounded-xl p-3 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase text-brand-orange">
                                    Edit Review
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setEditReviewRating(star)}
                                        className="focus:outline-none cursor-pointer"
                                      >
                                        <Star
                                          className={`h-4 w-4 ${star <= editReviewRating ? "text-amber-500 fill-amber-500" : "text-gray-200"}`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <textarea
                                  value={editReviewComment}
                                  onChange={(e) => setEditReviewComment(e.target.value)}
                                  rows={2}
                                  className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-100"
                                />

                                {/* Edit Review Photos Submodule */}
                                <div className="space-y-2 pt-1 border-t border-orange-100/80">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                      Review Snapshots ({editAttachedPhotos.length} / 3)
                                    </span>
                                    {editAttachedPhotos.length < 3 && (
                                      <label className="text-[10px] text-brand-orange font-bold hover:underline cursor-pointer flex items-center gap-1">
                                        <Plus className="h-3 w-3" /> Add Photo
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={(e) => e.target.files && processEditFiles(e.target.files)}
                                          className="hidden"
                                        />
                                      </label>
                                    )}
                                  </div>

                                  {editAttachedPhotos.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                      {editAttachedPhotos.map((photoObj, pIdx) => (
                                        <div
                                          key={photoObj.id || pIdx}
                                          onClick={() => removeEditPhoto(pIdx)}
                                          className="relative group w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-red-600 bg-red-600 shadow-xs cursor-pointer shrink-0 transition-all duration-200 select-none"
                                          title="Click to remove photo"
                                        >
                                          <img
                                            src={photoObj.url}
                                            alt="Edit snapshot"
                                            className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-25 group-hover:scale-110"
                                            referrerPolicy="no-referrer"
                                          />
                                          <div className="absolute inset-0 bg-red-600/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 pointer-events-none">
                                            <Trash2 className="h-4 w-4 text-white drop-shadow-md animate-bounce" />
                                            <span className="text-[7px] font-black uppercase text-white mt-0.5">Delete</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 transition cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateReview(revId)}
                                    disabled={editReviewSubmitting}
                                    className="px-3 py-1 bg-brand-orange hover:bg-orange-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wide transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                                  >
                                    {editReviewSubmitting ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : null}
                                    <span>Save</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* Review Comment text */}
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                  {rev.text || rev.comment}
                                </p>

                                {/* Attached Review Food Photos */}
                                {rev.photos && rev.photos.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {rev.photos.map((picUrl, pIdx) => (
                                      <div
                                        key={pIdx}
                                        onClick={() => setSelectedPhoto(picUrl)}
                                        className="relative w-16 h-16 rounded-xl overflow-hidden cursor-zoom-in group border border-gray-100 shadow-xs shrink-0 bg-neutral-50 hover:border-orange-200 transition"
                                      >
                                        <img
                                          src={picUrl}
                                          alt="Food snapshot"
                                          className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />
                                        <Camera className="absolute bottom-1 right-1 h-3.5 w-3.5 text-white/80" />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-1.5 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                      <span className="text-2xl">✍️</span>
                      <p className="text-gray-600 font-bold text-xs">No reviews yet</p>
                      <p className="text-gray-400 text-[10px]">Be the first diner to leave a review for this restaurant!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================================== TABS: PHOTOS ================================== */}
            {activeTab === "photos" && (
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">
                    Kitchen & Meal Photographs
                  </h4>
                  <p className="text-[10px] text-gray-400 font-semibold leading-snug">
                    Real snapshots shared by patrons, inspectors, and kitchen
                    chefs to display plating and cooking atmosphere.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photosList.map((photoUrl, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedPhoto(photoUrl)}
                      className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in group shadow-xs border border-gray-100"
                    >
                      <img
                        src={photoUrl}
                        alt={`Ambiance snapshot ${index + 1}`}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition" />
                      <Camera className="absolute bottom-2.5 right-2.5 h-4.5 w-4.5 text-white/80 drop-shadow-sm opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Cart Button (Inside Modal) */}
        {totalCartCount > 0 && (
          <div
            className="absolute bottom-20 right-6 z-30"
            id="floating-cart-anchor"
          >
            <button
              onClick={handleGoToCart}
              className="bg-brand-orange hover:bg-orange-700 text-white h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-105 relative border border-white/25"
              title="View Cart Page"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border border-white">
                {totalCartCount}
              </span>
            </button>
          </div>
        )}

        {/* Sticky Checkout CTA at Modal Bottom */}
        {totalCartCount > 0 ? (
          <div
            className="bg-brand-orange p-4 sm:rounded-b-3xl text-white flex items-center justify-between shadow-premium border-t border-orange-600/30 shrink-0 sticky bottom-0 left-0 right-0 z-20 animate-slide-up"
            id="restaurant-detail-sticky-checkout"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="bg-white text-brand-orange font-black text-[11px] h-5 w-5 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
                <span className="font-extrabold text-xs tracking-wide uppercase">
                  DISHES ADDED
                </span>
              </div>
              <p className="text-[10px] text-orange-100 font-semibold">
                Total Feast Cost:{" "}
                <span className="font-black text-white">
                  ₹ {totalCartCost.toFixed(2)}
                </span>
              </p>
            </div>

            <button
              onClick={handleGoToCart}
              className="bg-white hover:bg-orange-50 text-brand-orange font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span>View Basket & Checkout ➔</span>
            </button>
          </div>
        ) : (
          <div
            className="bg-gray-50 border-t border-gray-100/60 px-6 py-4 flex justify-between items-center sm:rounded-b-3xl shrink-0"
            id="restaurant-modal-empty-cart-footer"
          >
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-brand-orange" />
              <span>HANDCRAFTED RECIPES WITH HYGIENE VERIFIED</span>
            </p>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-extrabold text-[11px] px-4 py-2 rounded-xl transition"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Lightbox photo viewer */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-55 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={selectedPhoto}
            alt="Enlarged food screenshot"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl animate-fade-in"
          />
        </div>
      )}

      {/* Custom Delete Confirmation Popup Modal */}
      {confirmDeleteReviewId && (
        <div
          className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setConfirmDeleteReviewId(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-xs sm:max-w-sm w-full shadow-2xl space-y-4 text-center border border-gray-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-gray-900">
                Delete Review?
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteReviewId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteReview}
                disabled={deletingReviewId === confirmDeleteReviewId}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deletingReviewId === confirmDeleteReviewId ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
