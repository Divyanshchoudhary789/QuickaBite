import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CATEGORIES,
  OFFER_CARDS,
  COLLECTIONS,
  POPULAR_CUISINES,
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
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(true);
  const [randomSideCoupons, setRandomSideCoupons] = useState([]);
  const [reelsList, setReelsList] = useState([]);
  const [isLoadingReels, setIsLoadingReels] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchReels = async () => {
      setIsLoadingReels(true);
      try {
        const fetched = await dinerService.getReels();
        if (isMounted) {
          setReelsList(Array.isArray(fetched) && fetched.length > 0 ? fetched : []);
        }
      } catch (err) {
        console.error("Error fetching reels on HomePage:", err);
        if (isMounted) {
          setReelsList([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingReels(false);
        }
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
      } finally {
        if (isMounted) {
          setIsLoadingCoupons(false);
        }
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

      {/* Explore Cuisine Section — Swiggy-style colourful circular icons grid */}
      <div
        className="relative overflow-hidden rounded-premium bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border border-orange-100 shadow-soft"
        id="explore-cuisine-circular-section"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="relative z-10 px-4 sm:px-6 pt-5 pb-4">
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl text-gray-900 tracking-tight">
                What are you craving? 🍽️
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Tap a cuisine to filter restaurants instantly</p>
            </div>
            <button
              onClick={() => {
                setIsCuisineExpanded(!isCuisineExpanded);
                triggerToast(isCuisineExpanded ? "Showing fewer cuisines" : "All cuisines unlocked!");
              }}
              className="text-xs font-black text-brand-orange hover:underline cursor-pointer flex items-center gap-1"
            >
              {isCuisineExpanded ? "Show Less ▲" : "See All ▼"}
            </button>
          </div>

          {/* Cuisine icon grid */}
          {(() => {
            const CUISINE_TILES = [
              { id: "biryani", emoji: "🍛", label: "Biryani", bg: "bg-amber-500", shadow: "shadow-amber-300" },
              { id: "pizza", emoji: "🍕", label: "Pizza", bg: "bg-red-500", shadow: "shadow-red-300" },
              { id: "burger", emoji: "🍔", label: "Burger", bg: "bg-yellow-500", shadow: "shadow-yellow-300" },
              { id: "chinese", emoji: "🥡", label: "Chinese", bg: "bg-orange-500", shadow: "shadow-orange-300" },
              { id: "desserts", emoji: "🍰", label: "Desserts", bg: "bg-pink-500", shadow: "shadow-pink-300" },
              { id: "healthy", emoji: "🥗", label: "Healthy", bg: "bg-green-500", shadow: "shadow-green-300" },
              { id: "arabian", emoji: "🥙", label: "Shawarma", bg: "bg-lime-500", shadow: "shadow-lime-300" },
              { id: "japanese", emoji: "🍱", label: "Sushi", bg: "bg-sky-500", shadow: "shadow-sky-300" },
              { id: "italian", emoji: "🍝", label: "Pasta", bg: "bg-purple-500", shadow: "shadow-purple-300" },
              { id: "american", emoji: "🌮", label: "Tacos", bg: "bg-teal-500", shadow: "shadow-teal-300" },
              { id: "indian", emoji: "🫕", label: "Indian", bg: "bg-rose-500", shadow: "shadow-rose-300" },
              { id: "mexican", emoji: "🌯", label: "Rolls", bg: "bg-cyan-500", shadow: "shadow-cyan-300" },
            ];
            const visibleTiles = isCuisineExpanded ? CUISINE_TILES : CUISINE_TILES.slice(0, 8);
            return (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                {visibleTiles.map((tile) => {
                  const isSelected = selectedCategory === tile.id;
                  return (
                    <button
                      key={tile.id}
                      onClick={() => {
                        setSelectedCategory(tile.id === selectedCategory ? "all" : tile.id);
                        if (tile.id !== selectedCategory) {
                          triggerToast(`Showing ${tile.label} restaurants!`);
                          const resSection = document.getElementById("restaurants-grid-section");
                          if (resSection) resSection.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer group focus:outline-none active:scale-90 hover:scale-105 ${isSelected ? `${tile.bg} border-transparent shadow-lg ${tile.shadow}` : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"}`}
                    >
                      <span className={`text-2xl sm:text-3xl leading-none transition-transform duration-200 group-hover:scale-110 ${isSelected ? "drop-shadow-md" : ""}`}>
                        {tile.emoji}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wide leading-none ${isSelected ? "text-white" : "text-gray-600"}`}>
                        {tile.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>

      </div>

      {/* Reels Section — Instagram Stories style cards */}
      <div className="space-y-4" id="reels-highlights-section">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 flex items-center justify-center shadow-md shadow-pink-200">
              <span className="text-lg">🎬</span>
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg tracking-tight text-gray-900 leading-tight">
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
          {isLoadingReels ? (
            /* Skeleton */
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="shrink-0 snap-start w-[160px] sm:w-[180px] h-[280px] sm:h-[310px] rounded-2xl bg-gray-200 animate-pulse"
              />
            ))
          ) : (
            reelsList.map((reel, idx) => {
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
            })
          )}
        </div>
      </div>


      {/* Exclusive Multi-brand Cloud Kitchen Section */}
      <CloudKitchenSection
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
      />

      {/* Trending Offers Horizontal Strip — Swiggy-style */}
      <div className="space-y-3" id="trending-deals-strip">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <h3 className="font-display font-extrabold text-lg text-gray-900 tracking-tight">Trending Deals</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {[
            { label: "50% OFF", sub: "First Order", color: "from-[#FF5200] to-[#FF8C00]", emoji: "🎉" },
            { label: "Free Delivery", sub: "Above ₹199", color: "from-[#0D9488] to-[#06B6D4]", emoji: "🛵" },
            { label: "Buy 1 Get 1", sub: "On Biryani", color: "from-[#7C3AED] to-[#C026D3]", emoji: "🍛" },
            { label: "Flat ₹100 OFF", sub: "On ₹499+", color: "from-[#DC2626] to-[#F97316]", emoji: "💸" },
            { label: "30% Cashback", sub: "On UPI Pay", color: "from-[#0284C7] to-[#6366F1]", emoji: "📲" },
            { label: "Late Night", sub: "Extra 20% OFF", color: "from-[#374151] to-[#6B7280]", emoji: "🌙" },
          ].map((deal, i) => (
            <div
              key={i}
              onClick={() => setActiveTab && setActiveTab("offers")}
              className={`shrink-0 cursor-pointer bg-gradient-to-br ${deal.color} text-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 min-w-[160px]`}
            >
              <span className="text-3xl">{deal.emoji}</span>
              <div>
                <p className="font-display font-black text-sm leading-tight">{deal.label}</p>
                <p className="text-[11px] text-white/80 font-semibold mt-0.5">{deal.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Restaurants Section with Advanced Filter bar and Layout Toggle */}
      <div className="space-y-6" id="restaurants-grid-section">
        {/* Header block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight text-gray-900">
                Explore Restaurants
              </h3>
            </div>
            <p className="text-xs text-gray-500 ml-9">
              Discover premium culinary kitchens in your neighborhood
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
        {!restaurants || restaurants.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[320px] p-5 space-y-4"
              >
                <div className="h-44 bg-neutral-200 rounded-2xl w-full animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 bg-neutral-200 rounded-full w-2/3" />
                  <div className="h-3 bg-neutral-200 rounded-full w-1/2" />
                </div>
                <div className="border-t border-gray-50 pt-3 flex justify-between">
                  <div className="h-4 bg-neutral-200 rounded-full w-20" />
                  <div className="h-4 bg-neutral-200 rounded-full w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <>
            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(isExploreMoreUnlocked
                ? filteredRestaurants
                : filteredRestaurants.slice(0, 3)
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

      {/* Vibrant Promo Banners Row — Swiggy/Zomato style */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        id="split-promo-banner-row"
      >
        {/* Banner 1: Big discount */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FF5200] to-[#FFC300] p-6 text-white shadow-lg group cursor-pointer hover:scale-[1.02] transition-transform duration-200 col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_60%)] pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-block bg-white/25 backdrop-blur-sm border border-white/30 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                ⏰ Limited Time
              </span>
              <h3 className="font-display font-black text-3xl sm:text-4xl leading-none">
                FLAT 40% OFF
              </h3>
              <p className="text-sm font-bold text-orange-100 uppercase tracking-wide">
                On orders above ₹100
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="bg-white/20 border border-white/30 font-mono font-black text-sm px-3.5 py-2 rounded-xl backdrop-blur-sm tracking-widest">
                  Use: <span className="text-yellow-300">FOOD40</span>
                </span>
                <button
                  onClick={() => triggerToast('Coupon "FOOD40" copied!')}
                  className="bg-white text-[#FF5200] font-extrabold text-xs px-4 py-2 rounded-xl hover:bg-orange-50 transition cursor-pointer"
                >
                  Copy Code
                </button>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=300"
              alt="food"
              referrerPolicy="no-referrer"
              className="hidden sm:block w-36 h-36 object-cover rounded-xl border-2 border-white/30 shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Banner 2: Live coupons stack */}
        <div className="flex flex-col gap-3">
          {isLoadingCoupons ? (
            <>
              <div className="h-28 bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse rounded-2xl" />
              <div className="h-28 bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse rounded-2xl" />
            </>
          ) : (() => {
            const card0 = randomSideCoupons[0] || (liveCoupons.length > 0 ? liveCoupons[0] : OFFER_CARDS[0]);
            const card0Title = card0?.title || card0?.discount || (card0?.discountType === "flat" ? `₹ ${card0.discountValue} OFF` : card0?.discountValue ? `${card0.discountValue}% OFF` : "Exclusive Offer");
            const card0Code = card0?.code || "FREEDEL";
            const card1 = randomSideCoupons[1] || (liveCoupons.length > 1 ? liveCoupons[1] : OFFER_CARDS[1] || OFFER_CARDS[0]);
            const card1Title = card1?.title || card1?.discount || (card1?.discountType === "flat" ? `₹ ${card1.discountValue} OFF` : card1?.discountValue ? `${card1.discountValue}% OFF` : "Partner Reward");
            const card1Code = card1?.code || "BANK30";
            return (
              <>
                <div className="flex-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white flex items-center justify-between gap-3 shadow-md group hover:scale-[1.02] transition-transform duration-200 cursor-pointer relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="z-10">
                    <span className="text-[10px] font-black text-emerald-200 uppercase tracking-wider">🛵 Delivery Offer</span>
                    <h4 className="font-display font-black text-xl text-white mt-0.5">{card0Title}</h4>
                    <span className="bg-white/20 border border-white/25 font-mono text-[10px] font-black px-2.5 py-1 rounded-md inline-block mt-2 tracking-wider">
                      {card0Code}
                    </span>
                  </div>
                  <FaMotorcycle className="h-14 w-14 text-white/80 shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="flex-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5 text-white flex items-center justify-between gap-3 shadow-md group hover:scale-[1.02] transition-transform duration-200 cursor-pointer relative overflow-hidden">
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="z-10">
                    <span className="text-[10px] font-black text-pink-200 uppercase tracking-wider">🎁 Bank Reward</span>
                    <h4 className="font-display font-black text-xl text-white mt-0.5">{card1Title}</h4>
                    <span className="bg-white/20 border border-white/25 font-mono text-[10px] font-black px-2.5 py-1 rounded-md inline-block mt-2 tracking-wider">
                      {card1Code}
                    </span>
                  </div>
                  <span className="text-4xl shrink-0">💳</span>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Collections Row */}
      <div className="space-y-4" id="collections-scroller-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📂</span>
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

      {/* Coupons fast look row */}
      <div className="space-y-4" id="coupons-scroller-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎟️</span>
            <h3 className="font-display font-extrabold text-lg tracking-tight text-gray-900">
              Top Offers For You
            </h3>
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab("offers")}
            className="text-brand-orange cursor-pointer text-xs font-black hover:underline flex items-center gap-0.5"
          >
            <span>View All Deals</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Coupons List */}
        {isLoadingCoupons ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-32 bg-gray-100 animate-pulse rounded-2xl p-4 border border-gray-200"
              />
            ))}
          </div>
        ) : (liveCoupons.length > 0 ? liveCoupons : OFFER_CARDS).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(liveCoupons.length > 0 ? liveCoupons : OFFER_CARDS).map(
              (card, idx) => {
                const cardColor =
                  card.color || CARD_COLORS[idx % CARD_COLORS.length];
                const cardTitle =
                  card.title ||
                  card.discount ||
                  (card.discountType === "flat"
                    ? `₹ ${card.discountValue} OFF`
                    : `${card.discountValue}% OFF`);
                const cardCondition =
                  card.desc ||
                  card.condition ||
                  (card.minOrder > 0
                    ? `ON ORDERS ABOVE ₹ ${card.minOrder}`
                    : "FOR ALL ORDERS");

                return (
                  <div
                    key={card.id || card.code || idx}
                    className={`border border-dashed p-4 rounded-2xl ${
                      idx >= 2 ? "hidden sm:flex" : "flex"
                    } flex-col justify-between min-h-[128px] h-auto transition hover:shadow-xs relative ${cardColor}`}
                  >
                    <div className="absolute top-1/2 -left-2.5 h-5 w-5 bg-neutral-50 border-r border-dashed border-gray-200 rounded-full transform -translate-y-1/2" />
                    <div className="absolute top-1/2 -right-2.5 h-5 w-5 bg-neutral-50 border-l border-dashed border-gray-200 rounded-full transform -translate-y-1/2" />

                    <div>
                      <h4 className="font-display font-black text-lg leading-none uppercase">
                        {cardTitle}
                      </h4>
                      <p className="text-[10px] font-bold mt-1 uppercase tracking-wider opacity-85 break-words">
                        {cardCondition}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/20 mt-2">
                      <span className="font-mono font-black text-xs bg-white/45 px-2.5 py-1 rounded-md tracking-wider">
                        {card.code}
                      </span>
                      <button
                        onClick={() => {
                          if (card.code) {
                            navigator.clipboard.writeText(card.code);
                            triggerToast(`Coupon "${card.code}" copied!`);
                          }
                        }}
                        className="cursor-pointer text-[10px] hover:underline hover:font-bold text-black"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 border border-gray-100 rounded-2xl">
            <p className="text-xs text-gray-500 font-bold">
              No active offers at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Circular Popular Cuisines (Replication from image) */}
      <div className="space-y-4" id="popular-cuisines-row">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800">
            <PiBowlFoodFill className="h-5 w-5 animate-pulse text-red-500" />
            <h3 className="font-display font-extrabold text-lg tracking-tight">
              Popular Cuisines
            </h3>
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
