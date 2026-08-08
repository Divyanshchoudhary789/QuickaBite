import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CATEGORIES,
  OFFER_CARDS,
  COLLECTIONS,
  POPULAR_CUISINES,
  INITIAL_RESTAURANTS,
} from "../../data";
import HeroSlider from "./HeroSlider";
import CloudKitchenSection from "./CloudKitchenSection";
import { dinerService } from "../../api/dinerService";

const CARD_COLORS = [
  "bg-emerald-50 text-emerald-800 border-emerald-200",
  "bg-indigo-50 text-indigo-800 border-indigo-200",
  "bg-amber-50 text-amber-800 border-amber-200",
  "bg-rose-50 text-rose-800 border-rose-200",
  "bg-purple-50 text-purple-800 border-purple-200",
  "bg-blue-50 text-blue-800 border-blue-200",
];

import {
  Utensils,
  Soup,
  ChefHat,
  Flame,
  Pizza,
  Clock,
  Plus,
  Heart,
  Star,
  Ticket,
  ArrowRight,
  Zap,
  ShieldCheck,
  MessageSquare,
  ChevronsRight,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

import { FaMotorcycle } from "react-icons/fa";
import { PiFilmReelFill, PiBowlFoodFill } from "react-icons/pi";

export default function HomePage({
  restaurants,
  currentLocation,
  selectedCategory,
  setSelectedCategory,
  isCuisineExpanded,
  setIsCuisineExpanded,
  isPopularCuisinesExpanded,
  setIsPopularCuisinesExpanded,
  triggerToast,
  cartItems,
  handleAddToCart,
  handleRemoveFromCart,
  filterFastDelivery,
  setFilterFastDelivery,
  filterTopRated,
  setFilterTopRated,
  filterPureVeg,
  setFilterPureVeg,
  filterOffers,
  setFilterOffers,
  filterPrice,
  setFilterPrice,
  filteredRestaurants,
  setSelectedRestaurant,
  favorites,
  handleToggleFavorite,
  isExploreMoreUnlocked,
  handleToggleRadius,
  setActiveReelId,
  setActiveTab,
}) {
  const location = useLocation();
  // Filtered categories for the Quick Cuisine Filter drawer (excluding "all" and "more")
  const QUICK_CATEGORIES = CATEGORIES.filter(
    (cat) => cat.id !== "all" && cat.id !== "more",
  );

  // Combine CATEGORIES and POPULAR_CUISINES for the dropdown options
  const cuisineOptions = [];
  const addedIds = new Set();

  CATEGORIES.forEach((cat) => {
    if (cat.id !== "more" && !addedIds.has(cat.id)) {
      addedIds.add(cat.id);
      cuisineOptions.push({
        id: cat.id,
        name: cat.id === "all" ? "All Cuisines" : cat.name,
      });
    }
  });

  POPULAR_CUISINES.forEach((cuis) => {
    if (!addedIds.has(cuis.id)) {
      addedIds.add(cuis.id);
      cuisineOptions.push({ id: cuis.id, name: cuis.name });
    }
  });

  const [isCuisineDropdownOpen, setIsCuisineDropdownOpen] = useState(false);
  const cuisineDropdownRef = useRef(null);
  const cuisineScrollRef = useRef(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [liveCoupons, setLiveCoupons] = useState([]);
  const [randomSideCoupons, setRandomSideCoupons] = useState([]);
  const [reelsList, setReelsList] = useState([]);
  const topChainsScrollRef = useRef(null);
  const cravingScrollRef = useRef(null);

  const scrollCraving = (direction) => {
    if (cravingScrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      cravingScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollTopChains = (direction) => {
    if (topChainsScrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      topChainsScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const DEFAULT_REELS = [
    {
      id: "reel-1",
      title: "Signature Angus Truffle Burger",
      restaurantName: "The Gourmet Burger Bistro",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
      rating: "4.9",
      deliveryTime: "15 min",
      offer: "30% OFF",
      logo: "🍔",
      tag: "TRENDING",
    },
    {
      id: "reel-2",
      title: "Royal Mutton Dum Biryani",
      restaurantName: "Royal Biryani Palace",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
      rating: "4.8",
      deliveryTime: "20 min",
      offer: "FLAT ₹100",
      logo: "🍛",
      tag: "POPULAR",
    },
    {
      id: "reel-3",
      title: "Woodfired Truffle Cheese Pizza",
      restaurantName: "Napoli Artisan Pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
      rating: "4.9",
      deliveryTime: "18 min",
      offer: "BUY 1 GET 1",
      logo: "🍕",
      tag: "HOT",
    },
    {
      id: "reel-4",
      title: "Charcoal Shish Kebab Platter",
      restaurantName: "Kebab House",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
      rating: "4.7",
      deliveryTime: "25 min",
      offer: "FREE DEL",
      logo: "🥙",
      tag: "CHEF'S SPECIAL",
    },
    {
      id: "reel-5",
      title: "Crispy Szechuan Chili Noodles",
      restaurantName: "Asian Wok",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80",
      rating: "4.6",
      deliveryTime: "22 min",
      offer: "20% OFF",
      logo: "🥡",
      tag: "SPICY",
    },
  ];

  const displayReels = (reelsList && reelsList.length > 0) ? reelsList : DEFAULT_REELS;

  const activeRestaurantsList =
    (filteredRestaurants && filteredRestaurants.length > 0)
      ? filteredRestaurants
      : (restaurants && restaurants.length > 0)
        ? restaurants
        : INITIAL_RESTAURANTS;

  useEffect(() => {
    let isMounted = true;
    const fetchReels = async () => {
      try {
        const fetched = await dinerService.getReels();
        if (isMounted && Array.isArray(fetched) && fetched.length > 0) {
          setReelsList(fetched);
        }
      } catch (err) {
        console.error("Error fetching reels on HomePage:", err);
      }
    };
    fetchReels();
  }, []);


  const handleCuisineMouseDown = (e) => {
    if (!cuisineScrollRef.current) return;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - cuisineScrollRef.current.offsetLeft;
    scrollLeftStartRef.current = cuisineScrollRef.current.scrollLeft;
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setIsDraggingState(true);
  };

  const handleCuisineMouseMove = (e) => {
    if (!isMouseDownRef.current || !cuisineScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - cuisineScrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(x - startXRef.current) > 5) {
      hasDraggedRef.current = true;
    }

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      const distance = e.pageX - lastXRef.current;
      velocityRef.current = distance / dt;
    }
    lastXRef.current = e.pageX;
    lastTimeRef.current = now;

    cuisineScrollRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleCuisineMouseUp = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    setIsDraggingState(false);

    if (cuisineScrollRef.current && Math.abs(velocityRef.current) > 0.1) {
      let vel = velocityRef.current * 14;
      const momentumStep = () => {
        if (!cuisineScrollRef.current || Math.abs(vel) < 0.3) return;
        cuisineScrollRef.current.scrollLeft -= vel;
        vel *= 0.92;
        animFrameRef.current = requestAnimationFrame(momentumStep);
      };
      animFrameRef.current = requestAnimationFrame(momentumStep);
    }
  };

  const handleCuisineMouseLeave = () => {
    if (isMouseDownRef.current) {
      handleCuisineMouseUp();
    }
  };

  const handleCuisineScroll = () => {
    const container = cuisineScrollRef.current;
    if (!container) return;
    const singleSetWidth = container.scrollWidth / 5;
    if (singleSetWidth <= 0) return;

    if (container.scrollLeft >= singleSetWidth * 3.5) {
      container.scrollLeft -= singleSetWidth * 2;
    } else if (container.scrollLeft <= singleSetWidth * 0.5) {
      container.scrollLeft += singleSetWidth * 2;
    }
  };

  useEffect(() => {
    if (isCuisineExpanded) {
      const timer = setTimeout(() => {
        if (cuisineScrollRef.current) {
          const container = cuisineScrollRef.current;
          const singleSetWidth = container.scrollWidth / 5;
          if (singleSetWidth > 0) {
            container.scrollLeft = singleSetWidth * 2;
          }
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isCuisineExpanded]);

  useEffect(() => {
    let isMounted = true;
    const fetchActiveCoupons = async () => {
      try {
        const fetched = await dinerService.getActiveCoupons();
        if (isMounted) {
          setLiveCoupons(fetched || []);
        }
      } catch (err) {
        console.error("Error fetching coupons on HomePage:", err);
      }
    };
    fetchActiveCoupons();
  }, []);

  useEffect(() => {
    const pool = liveCoupons.length > 0 ? liveCoupons : OFFER_CARDS;
    if (pool && pool.length > 0) {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      setRandomSideCoupons(shuffled.slice(0, 2));
    }
  }, [liveCoupons]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        cuisineDropdownRef.current &&
        !cuisineDropdownRef.current.contains(event.target)
      ) {
        setIsCuisineDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (
      location.hash === "#restaurants-grid-section" ||
      location.hash === "#explore" ||
      location.state?.scrollTo === "restaurants-grid-section" ||
      location.state?.scrollTo === "explore"
    ) {
      const timer = setTimeout(() => {
        const resSection =
          document.getElementById("restaurants-grid-section") ||
          document.getElementById("explore");
        if (resSection) {
          resSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.state]);

  return (
    <div className="space-y-10 animate-fade-in" id="home-viewport">
      <HeroSlider
        onSearchClick={() => {
          const resSection = document.getElementById(
            "restaurants-grid-section",
          );
          if (resSection) {
            resSection.scrollIntoView({
              behavior: "smooth",
            });
          }
        }}
        currentLocation={currentLocation}
        onCuisineSelect={(cuisineId) => {
          setSelectedCategory(cuisineId);
          triggerToast(`Showing ${cuisineId} restaurants!`);
          const resSection = document.getElementById("restaurants-grid-section");
          if (resSection) resSection.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* What's on your mind? — Swiggy-style circular HD food photography carousel */}
      <div className="space-y-4 pt-2" id="explore-cuisine-circular-section">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-gray-900 tracking-tight flex items-center gap-2">
              <span>What's on your mind?</span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">Explore top dishes &amp; filter kitchens by dish</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCraving("left")}
              className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer active:scale-95 shadow-xs"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollCraving("right")}
              className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer active:scale-95 shadow-xs"
              aria-label="Scroll Right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Circular HD food tiles horizontal carousel */}
        {(() => {
          const CRAVING_ITEMS = [
            { id: "biryani", label: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400" },
            { id: "pizza", label: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400" },
            { id: "burger", label: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400" },
            { id: "chinese", label: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400" },
            { id: "arabian", label: "Shawarma", image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&q=80&w=400" },
            { id: "desserts", label: "Cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400" },
            { id: "healthy", label: "Salads", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400" },
            { id: "japanese", label: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400" },
            { id: "italian", label: "Pasta", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400" },
            { id: "american", label: "Tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=400" },
            { id: "indian", label: "North Indian", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=400" },
            { id: "mexican", label: "Rolls", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400" },
          ];
          return (
            <div
              ref={cravingScrollRef}
              className="flex gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-2 scroll-smooth snap-x snap-mandatory"
            >
              {CRAVING_ITEMS.map((item) => {
                const isSelected = selectedCategory === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(item.id === selectedCategory ? "all" : item.id);
                      if (item.id !== selectedCategory) {
                        triggerToast(`Showing ${item.label} kitchens!`);
                        const resSection = document.getElementById("restaurants-grid-section");
                        if (resSection) resSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="shrink-0 snap-start flex flex-col items-center gap-2.5 group cursor-pointer active:scale-95 focus:outline-none"
                  >
                    {/* HD Circular Avatar Container */}
                    <div
                      className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 transition-all duration-300 transform group-hover:scale-105 shadow-md ${
                        isSelected
                          ? "ring-4 ring-brand-orange ring-offset-2 scale-105 shadow-xl bg-orange-500"
                          : "bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200/60 hover:shadow-lg"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.label}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
                        }}
                        className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:rotate-2"
                      />
                      {isSelected && (
                        <span className="absolute bottom-1 right-1 bg-brand-orange text-white text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-xs sm:text-sm font-extrabold tracking-tight transition-colors ${
                        isSelected ? "text-brand-orange" : "text-gray-700 group-hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Top restaurant chains in your area — Swiggy horizontal carousel */}
      <div className="space-y-4 pt-4 border-t border-gray-100" id="top-chains-carousel-section">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-gray-900 tracking-tight flex items-center gap-2">
            <span>Top restaurant chains in your area</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTopChains("left")}
              className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer active:scale-95 shadow-xs"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollTopChains("right")}
              className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer active:scale-95 shadow-xs"
              aria-label="Scroll Right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={topChainsScrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar pb-3 scroll-smooth snap-x snap-mandatory"
        >
          {activeRestaurantsList.map((res) => {
            const distanceStr = `${(res.coordinates?.x * 0.05 + res.coordinates?.y * 0.03 + 0.8).toFixed(1)} km`;
            return (
              <div
                key={`chain-${res.id}`}
                onClick={() => setSelectedRestaurant(res)}
                className="shrink-0 snap-start w-[240px] sm:w-[270px] bg-white rounded-2xl overflow-hidden cursor-pointer group shadow-xs hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-100"
              >
                {/* Image + Swiggy Badge */}
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={res.image}
                    alt={res.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Swiggy Discount Ribbon */}
                  <div className="absolute bottom-2.5 left-3 text-white font-black text-xs uppercase tracking-wider drop-shadow-md flex items-center gap-1">
                    <span>🏷️</span>
                    <span>{res.discount || (res.isPromoBadge ? "FLAT 30% OFF" : "ITEMS AT ₹99")}</span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleToggleFavorite(res.id || res._id, e, res.name)}
                    className="absolute top-2.5 right-2.5 h-7 w-7 bg-white/80 hover:bg-white text-gray-700 rounded-full flex items-center justify-center backdrop-blur-sm transition shadow-xs z-10 cursor-pointer"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        (favorites || []).some(f => String(f) === String(res.id) || String(f?.id) === String(res.id))
                          ? "text-red-500 fill-red-500"
                          : "text-gray-500"
                      }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3.5 space-y-1">
                  <h4 className="font-display font-extrabold text-base text-gray-900 truncate group-hover:text-brand-orange transition">
                    {res.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <span className="flex items-center gap-0.5 bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">
                      ★ {res.rating}
                    </span>
                    <span>•</span>
                    <span>{res.deliveryTime}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    {(res.cuisines || []).join(", ")}
                  </p>
                  <p className="text-[11px] text-gray-400 font-semibold truncate">
                    {res.address || "Downtown, " + distanceStr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="space-y-4" id="reels-highlights-section">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-gray-900 leading-tight">
                Food Reels
              </h3>
              <p className="text-[11px] text-gray-400 font-medium leading-none">Watch &amp; order instantly</p>
            </div>
          </div>
          {reelsList && reelsList.length > 0 && (
            <button
              onClick={() => setActiveReelId(reelsList[0].id || reelsList[0]._id)}
              className="flex items-center gap-1 text-xs font-black text-brand-orange hover:underline cursor-pointer"
            >
              <span>See All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Reel cards horizontal scroll */}
        <div
          className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory"
          id="reels-scroller"
        >
          {displayReels.map((reel, idx) => {
              /* Cycle through vibrant gradient overlays */
              const OVERLAYS = [
                "from-orange-900/90 via-orange-700/40 to-transparent",
                "from-pink-900/90 via-pink-700/40 to-transparent",
                "from-teal-900/90 via-teal-700/40 to-transparent",
                "from-red-900/90 via-red-700/40 to-transparent",
                "from-yellow-900/90 via-yellow-700/40 to-transparent",
                "from-purple-900/90 via-purple-700/40 to-transparent",
                "from-amber-900/90 via-amber-700/40 to-transparent",
                "from-sky-900/90 via-sky-700/40 to-transparent",
              ];
              const overlay = OVERLAYS[idx % OVERLAYS.length];

              return (
                <div
                  key={reel.id || reel._id}
                  onClick={() => setActiveReelId(reel.id || reel._id)}
                  className="relative shrink-0 snap-start w-[160px] sm:w-[180px] h-[280px] sm:h-[310px] rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  id={`reel-card-${reel.id || reel._id}`}
                >
                  {/* Food image */}
                  <img
                    src={reel.bgImage || reel.image}
                    alt={reel.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient overlay — bottom-heavy like Reels */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${overlay}`} />

                  {/* Top row: tag badge + play button */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                    {reel.tag && (
                      <span className={`${reel.tagColor || "bg-red-500"} text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shadow-md`}>
                        {reel.tag}
                      </span>
                    )}
                    {/* Animated play icon */}
                    <div className="relative h-8 w-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md group-hover:bg-white/35 transition ml-auto shrink-0">
                      <span className="text-white text-xs ml-0.5">▶</span>
                      <span className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping opacity-40" />
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10 space-y-2">
                    {/* Restaurant logo + name */}
                    <div className="flex items-center gap-2">
                      <div className={`h-7 w-7 rounded-full bg-gradient-to-br ${reel.logoColor || "from-orange-500 to-red-500"} flex items-center justify-center text-white text-[9px] font-black shadow-md border-2 border-white/30 shrink-0`}>
                        {reel.logo}
                      </div>
                      <span className="text-white/90 text-[10px] font-bold truncate leading-tight">
                        {reel.restaurantName}
                      </span>
                    </div>

                    {/* Dish title */}
                    <h4 className="font-display font-extrabold text-sm text-white leading-tight line-clamp-2 drop-shadow-md">
                      {reel.title}
                    </h4>

                    {/* Rating + delivery time */}
                    <div className="flex items-center gap-2">
                      {reel.rating && (
                        <span className="flex items-center gap-0.5 bg-black/30 backdrop-blur-sm text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                          ⭐ {reel.rating}
                        </span>
                      )}
                      {reel.deliveryTime && (
                        <span className="flex items-center gap-0.5 bg-black/30 backdrop-blur-sm text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                          🕐 {reel.deliveryTime}
                        </span>
                      )}
                    </div>

                    {/* Offer badge */}
                    {reel.offer && (
                      <span className={`${reel.offerColor || "bg-orange-500"} text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide inline-block shadow-sm`}>
                        🏷 {reel.offer}
                      </span>
                    )}

                    {/* Order Now CTA */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveReelId(reel.id || reel._id);
                      }}
                      className="w-full bg-white text-gray-900 font-extrabold text-[10px] py-2 rounded-xl shadow-md hover:bg-orange-500 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer text-center block mt-1"
                    >
                      Order Now →
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Top Restaurants Section with Advanced Filter bar and Layout Toggle */}
      <div className="space-y-6" id="restaurants-grid-section">
        {/* Header block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight text-gray-900">
                Restaurants with online food delivery in your area
              </h3>
            </div>
            <p className="text-xs text-gray-500 ml-1">
              Explore top-rated kitchens, fast delivery, and daily discounts
            </p>
          </div>
          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-2 bg-brand-orange text-white text-xs font-black px-4 py-2 rounded-full shadow-md">
              <span>🍴</span>
              <span className="capitalize">{selectedCategory}</span>
              <button
                onClick={() => setSelectedCategory("all")}
                className="ml-1 text-white/80 hover:text-white font-black cursor-pointer"
                aria-label="Clear filter"
              >✕</button>
            </span>
          )}
        </div>

        {/* Advanced Restaurant Interactive Filter Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-wider">
              <SlidersHorizontal className="h-3.5 w-3.5 text-brand-orange" />
              <span>Filter Kitchens</span>
            </div>
            {(filterFastDelivery ||
              filterTopRated ||
              filterPureVeg ||
              filterOffers ||
              filterPrice !== "all" ||
              selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setFilterFastDelivery(false);
                  setFilterTopRated(false);
                  setFilterPureVeg(false);
                  setFilterOffers(false);
                  setFilterPrice("all");
                  setSelectedCategory("all");
                  triggerToast("All listing filters reset!");
                }}
                className="cursor-pointer text-xs font-bold text-red-500 hover:underline"
              >
                Clear All Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5 md:flex-wrap md:overflow-visible">
            {/* Cuisine Filter Custom Dropdown Pill */}
            <div
              className="relative flex-shrink-0 flex items-center"
              ref={cuisineDropdownRef}
            >
              <button
                onClick={() => setIsCuisineDropdownOpen(!isCuisineDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 h-[34px] rounded-xl text-xs font-bold transition border cursor-pointer focus:outline-none ${
                  selectedCategory !== "all"
                    ? "bg-orange-50 border-orange-200 text-brand-orange"
                    : "bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-200"
                }`}
              >
                <span>
                  {selectedCategory === "all"
                    ? "Cuisine"
                    : cuisineOptions.find((c) => c.id === selectedCategory)
                        ?.name || selectedCategory}
                </span>
                <span
                  className={`text-[9px] transition-transform duration-200 ${isCuisineDropdownOpen ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>

              <AnimatePresence>
                {isCuisineDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1.5 left-0 min-w-[180px] bg-white border border-gray-100 rounded-2xl shadow-premium py-2 max-h-48 overflow-y-auto z-50 flex flex-col items-start scrollbar-thin"
                  >
                    {cuisineOptions.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setIsCuisineDropdownOpen(false);
                            const isSpecial =
                              cat.id === "italian" || cat.id === "desserts";
                            if (isSpecial && !isExploreMoreUnlocked) {
                              handleToggleRadius(true);
                              triggerToast(
                                `Expanded delivery zone to show premium ${cat.id === "italian" ? "Italian" : "Dessert"} options!`,
                              );
                            } else {
                              triggerToast(
                                `Cuisine filter set to: ${cat.id === "all" ? "All Cuisines" : cat.name}`,
                              );
                            }
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-orange-50 text-brand-orange"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fast Delivery Pill */}
            <button
              onClick={() => {
                setFilterFastDelivery(!filterFastDelivery);
                triggerToast(
                  filterFastDelivery
                    ? "Fast Delivery disabled"
                    : "Showing under 30-min deliveries!",
                );
              }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${filterFastDelivery ? "bg-orange-500 text-white border-orange-500 shadow-sm" : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-100"}`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Fast Delivery (≤30 min)</span>
            </button>

            {/* Top Rated Pill */}
            <button
              onClick={() => {
                setFilterTopRated(!filterTopRated);
                triggerToast(
                  filterTopRated
                    ? "Top Rated disabled"
                    : "Showing kitchens rated 4.5★ and above!",
                );
              }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${filterTopRated ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-100"}`}
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>Top Rated (4.5★+)</span>
            </button>

            {/* Pure Veg Pill */}
            <button
              onClick={() => {
                setFilterPureVeg(!filterPureVeg);
                triggerToast(
                  filterPureVeg
                    ? "Pure Veg filter disabled"
                    : "Showing Pure Veg options!",
                );
              }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${filterPureVeg ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-100"}`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 border border-white" />
              <span>Pure Veg Only</span>
            </button>

            {/* Offers Pill */}
            <button
              onClick={() => {
                setFilterOffers(!filterOffers);
                triggerToast(
                  filterOffers
                    ? "Offers filter disabled"
                    : "Showing promo offers!",
                );
              }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${filterOffers ? "bg-red-500 text-white border-red-500 shadow-sm" : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-100"}`}
            >
              <Ticket className="h-3.5 w-3.5" />
              <span>Active Offers</span>
            </button>

            {/* Price filter dropdown */}
            <div className="relative flex-shrink-0 flex items-center">
              <select
                value={filterPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilterPrice(val);
                  const labels = {
                    "all": "Any Price",
                    "under-99": "Under ₹99",
                    "under-199": "Under ₹199",
                    "under-299": "Under ₹299",
                    "above-299": "₹299+",
                  };
                  triggerToast(
                    `Price filter set to: ${labels[val] || val}`,
                  );
                }}
                className="bg-gray-50 border border-gray-100 text-gray-700 hover:border-gray-200 font-bold text-xs px-3.5 h-[34px] rounded-xl outline-none transition cursor-pointer appearance-none pr-8 relative"
              >
                <option value="all">Any Price</option>
                <option value="under-99">Under ₹ 99</option>
                <option value="under-199">Under ₹ 199</option>
                <option value="under-299">Under ₹ 299</option>
                <option value="above-299">₹ 299+</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Render lists or grid */}
        {activeRestaurantsList.length > 0 ? (
          <>
            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(isExploreMoreUnlocked
                ? activeRestaurantsList
                : activeRestaurantsList.slice(0, 3)
              ).map((res) => {
                const distanceStr = `${(res.coordinates.x * 0.05 + res.coordinates.y * 0.03 + 0.8).toFixed(1)} km`;
                return (
                  <div
                    key={res.id}
                    onClick={() => setSelectedRestaurant(res)}
                    className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 cursor-pointer flex flex-col group relative"
                    id={`restaurant-card-${res.id}`}
                  >
                    {/* Banner image with offer tags & favorite button */}
                    <div className="relative h-44 sm:h-48 bg-neutral-100 overflow-hidden shrink-0">
                      <img
                        src={res.image}
                        alt={res.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 animate-fade-in"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Promo offer badge */}
                      {res.isPromoBadge && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FF5200] to-[#FF8C00] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                          <span>🏷️</span>
                          {res.discount}
                        </div>
                      )}

                      {/* Favorite Button (Functional toggle) */}
                      <button
                        onClick={(e) =>
                          handleToggleFavorite(res.id || res._id, e, res.name)
                        }
                        className="absolute top-3 right-3 h-8 w-8 bg-white/80 hover:bg-white text-gray-700 rounded-full flex items-center justify-center backdrop-blur-sm transition shadow-sm z-10 cursor-pointer"
                        aria-label="Save to favorites"
                      >
                        <Heart
                          className={`h-4.5 w-4.5 transition ${(favorites || []).some((f) => String(f) === String(res.id) || String(f) === String(res._id) || String(f?._id) === String(res.id) || String(f?.id) === String(res.id)) ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-red-500"}`}
                        />
                      </button>

                      {/* Rating over image */}
                      <div className="absolute bottom-3 right-3 bg-white/95 text-gray-900 text-xs font-extrabold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 backdrop-blur-sm">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span>{res.rating}</span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          ({res.reviewsCount ?? res.totalReviews ?? 0})
                        </span>
                      </div>
                    </div>

                    {/* Info body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-display font-black text-lg text-gray-800 line-clamp-1 group-hover:text-brand-orange transition">
                          {res.name}
                        </h4>
                        {/* Cuisines */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {res.cuisines.map((c, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100/50"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer parameters: Distance, Delivery time, Delivery fee */}
                      <div className="border-t border-gray-50 mt-4 pt-3 flex items-center justify-between text-xs text-gray-500 font-semibold">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                            <span>{res.deliveryTime}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-[10px]">📍</span>
                            <span>{distanceStr}</span>
                          </span>
                        </div>
                        {res.isFreeDelivery ? (
                          <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                            Free Delivery
                          </span>
                        ) : (
                          <span className="text-gray-600 bg-gray-50 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                            ₹{res.deliveryFee} Delivery
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explore More Button centered globally below the grid */}
            {(isExploreMoreUnlocked || filteredRestaurants.length > 3) && (
              <div
                className="flex justify-center mt-12 w-full"
                id="explore-more-restaurants-button-wrapper"
              >
                <button
                  onClick={() => handleToggleRadius(!isExploreMoreUnlocked)}
                  className="border border-black bg-white hover:bg-black/5 text-black rounded-full px-10 py-3.5 flex items-center justify-center gap-3 text-xs font-medium tracking-[0.2em] transition duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 uppercase"
                  id="explore-more-restaurants-toggle-btn"
                >
                  {isExploreMoreUnlocked ? (
                    <>
                      <span>SHOW LESS</span>
                      <ChevronsRight className="w-4 h-4 text-black transform rotate-180" />
                    </>
                  ) : (
                    <>
                      <span>EXPLORE MORE</span>
                      <ChevronsRight className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-8 max-w-md mx-auto shadow-sm space-y-4">
            <div className="space-y-1">
              <h4 className="font-display font-black text-lg text-gray-900">
                No Matching Kitchens
              </h4>
              <p className="text-xs text-gray-500">
                We couldn't find any restaurants that fit your exact combination
                of active filters. Try resetting some filter toggles to browse
                more delicious cuisines!
              </p>
            </div>
            <button
              onClick={() => {
                setFilterFastDelivery(false);
                setFilterTopRated(false);
                setFilterPureVeg(false);
                setFilterOffers(false);
                setFilterPrice("all");
                setSelectedCategory("all");
              }}
              className="bg-brand-orange hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition"
            >
              Reset All Listing Filters
            </button>
          </div>
        )}
      </div>  

      {/* Collections Row */}
      <div className="space-y-4" id="collections-scroller-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-extrabold text-lg tracking-tight text-gray-900">
              Curated Collections
            </h3>
          </div>
          <button
            onClick={() => setActiveTab("offers")}
            className="text-brand-orange cursor-pointer text-xs font-black hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Collections Cards list */}
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory scroll-smooth">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              className="relative w-[calc((100%-16px)/2)] sm:w-[calc((100%-32px)/3)] md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-64px)/5)] h-[120px] rounded-2xl overflow-hidden shadow-xs cursor-pointer shrink-0 hover:scale-[1.02] transition duration-300 group snap-start snap-always"
              id={`collection-card-${col.id}`}
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h4 className="font-display font-black text-sm leading-tight">
                  {col.title}
                </h4>
                <p className="text-[10px] text-orange-200 font-bold uppercase tracking-wider mt-0.5">
                  {col.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Circular Popular Cuisines (Replication from image) */}
      <div className="space-y-4" id="popular-cuisines-row">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800">
            <h3 className="font-display font-extrabold text-lg tracking-tight">
              Popular Cuisines
            </h3>
          </div>
        </div>

        {/* Swiggy Footer Accordions — Cities & Cuisines pills */}
      <div className="space-y-8 pt-8 border-t border-gray-200" id="swiggy-cities-footer-section">
        {/* Section 1: Best Places to Eat */}
        <div className="space-y-4">
          <h3 className="font-display font-black text-lg text-gray-900">
            Best Places to Eat Across Cities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              "Best Restaurants in Bangalore",
              "Best Restaurants in Pune",
              "Best Restaurants in Mumbai",
              "Best Restaurants in Delhi",
              "Best Restaurants in Hyderabad",
              "Best Restaurants in Kolkata",
              "Best Restaurants in Chennai",
              "Best Restaurants in Chandigarh",
              "Best Restaurants in Ahmedabad",
              "Best Restaurants in Jaipur",
              "Best Restaurants in Nagpur",
              "Show More Cities ▼",
            ].map((city, idx) => (
              <button
                key={idx}
                onClick={() => triggerToast(`Browsing ${city}`)}
                className="p-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer text-left truncate"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Best Cuisines Near Me */}
        <div className="space-y-4">
          <h3 className="font-display font-black text-lg text-gray-900">
            Best Cuisines Near Me
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              "Chinese Restaurant Near Me",
              "South Indian Restaurant Near Me",
              "Indian Restaurant Near Me",
              "Kerala Restaurant Near Me",
              "Korean Restaurant Near Me",
              "North Indian Restaurant Near Me",
              "Seafood Restaurant Near Me",
              "Bengali Restaurant Near Me",
              "Punjabi Restaurant Near Me",
              "Italian Restaurant Near Me",
              "Bakery Near Me",
              "Show More Cuisines ▼",
            ].map((cuis, idx) => (
              <button
                key={idx}
                onClick={() => triggerToast(`Filtering ${cuis}`)}
                className="p-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer text-left truncate"
              >
                {cuis}
              </button>
            ))}
          </div>
        </div>
      </div>

        {/* Popular Cuisines Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(isPopularCuisinesExpanded
            ? POPULAR_CUISINES
            : POPULAR_CUISINES.slice(0, 5)
          ).map((cuis) => (
            <div
              key={cuis.id}
              onClick={() => {
                setSelectedCategory(cuis.id);
                const topResEl = document.getElementById(
                  "restaurants-grid-section",
                );
                if (topResEl) topResEl.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-xs hover:border-emerald-100 transition group"
            >
              <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 shadow-inner border border-gray-100">
                <img
                  src={cuis.image}
                  alt={cuis.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="font-bold text-gray-800 text-xs mt-3 capitalize">
                {cuis.name}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">{cuis.outlets}</p>
            </div>
          ))}

          {/* Interactive Toggle Card */}
          {!isPopularCuisinesExpanded ? (
            <div
              onClick={() => {
                setIsPopularCuisinesExpanded(true);
                triggerToast(
                  "Expanded popular cuisines! Enjoy exploring new flavors.",
                );
              }}
              className="bg-emerald-50/20 border border-emerald-100/60 hover:border-emerald-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-sm hover:bg-emerald-50/50 transition group min-h-[140px]"
              id="expand-popular-cuisines-card"
            >
              <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-200/50 transition-all group-hover:scale-110 duration-300 shadow-xs">
                <Plus className="h-6 w-6 text-emerald-700" />
              </div>
              <h4 className="font-extrabold text-emerald-800 text-xs mt-3 capitalize">
                Explore More
              </h4>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                +{POPULAR_CUISINES.length - 5} Cuisines
              </p>
            </div>
          ) : (
            <div
              onClick={() => {
                setIsPopularCuisinesExpanded(false);
                const cuisinesRow = document.getElementById(
                  "popular-cuisines-row",
                );
                if (cuisinesRow)
                  cuisinesRow.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-emerald-50/20 border border-emerald-100/60 hover:border-emerald-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-sm hover:bg-emerald-50/50 transition group min-h-[140px]"
              id="collapse-popular-cuisines-card"
            >
              <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-200/50 transition-all group-hover:scale-110 duration-300 shadow-xs">
                <ChevronRight className="h-6 w-6 text-gray-600 -rotate-90" />
              </div>
              <h4 className="font-extrabold text-emerald-800 text-xs mt-3 capitalize">
                Show Less
              </h4>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                Collapse View
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Value Props Bar (Service Guarantees) */}
      <div
        className="bg-white border border-gray-100 rounded-3xl p-6 grid grid-cols-2 lg:grid-cols-4 gap-6"
        id="value-props-bar"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-xs">
              Live Order Tracking
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Track your order in real-time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-xs">
              Superfast Delivery
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5">
              On-time or it is completely free
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-xs">Best Quality</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">
              100% gourmet hygienic standards
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-xs">24/7 Support</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Dedicated experts ready to assist
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
