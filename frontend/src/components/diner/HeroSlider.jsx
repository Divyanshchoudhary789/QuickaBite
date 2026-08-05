import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Zap, Star, Tag } from "lucide-react";
import { dinerService } from "../../api/dinerService";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_SLIDES = [
  {
    title: "UP TO 50% OFF",
    subtitle: "ON YOUR FIRST ORDER",
    code: "WELCOME50",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
    accent: "#FF5200",
    bg: "from-[#FF5200] via-[#FF7340] to-[#FFA040]",
    tag: "🎉 New User Deal",
  },
  {
    title: "FLAT 40% OFF",
    subtitle: "ON PREMIUM FEASTS",
    code: "FOOD40",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
    accent: "#E91E8C",
    bg: "from-[#E91E8C] via-[#F06292] to-[#FF5252]",
    tag: "🍕 Pizza Lovers",
  },
  {
    title: "BUY 1 GET 1 FREE",
    subtitle: "ON LEBANESE SHAWARMAS",
    code: "YALLABOGO",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=800",
    accent: "#00897B",
    bg: "from-[#00897B] via-[#26A69A] to-[#00BCD4]",
    tag: "🥙 BOGO Offer",
  },
  {
    title: "FREE DELIVERY",
    subtitle: "ON ORDERS ABOVE ₹199",
    code: "FREEDEL",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    accent: "#7B1FA2",
    bg: "from-[#7B1FA2] via-[#AB47BC] to-[#E040FB]",
    tag: "🛵 Free Delivery",
  },
];

// Swiggy-style quick cuisine chips
const QUICK_CUISINES = [
  { label: "Biryani", emoji: "🍛", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { label: "Pizza", emoji: "🍕", color: "bg-red-100 text-red-800 border-red-200" },
  { label: "Burgers", emoji: "🍔", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { label: "Chinese", emoji: "🥡", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { label: "Desserts", emoji: "🍰", color: "bg-pink-100 text-pink-800 border-pink-200" },
  { label: "Healthy", emoji: "🥗", color: "bg-green-100 text-green-800 border-green-200" },
  { label: "Shawarma", emoji: "🥙", color: "bg-lime-100 text-lime-800 border-lime-200" },
  { label: "Sushi", emoji: "🍱", color: "bg-sky-100 text-sky-800 border-sky-200" },
  { label: "Pasta", emoji: "🍝", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { label: "Rolls", emoji: "🌯", color: "bg-teal-100 text-teal-800 border-teal-200" },
];

export default function HeroSlider({ onSearchClick, currentLocation, onCuisineSelect }) {
  const { isLoggedIn } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const list = await dinerService.getBanners();
        if (list && list.length > 0) setSlides(list);
      } catch (e) {
        console.error("Failed to load banners:", e);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((prev) => (prev + 1) % (slides.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (idxOrFn) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newIdx = typeof idxOrFn === "function" ? idxOrFn(currentSlide) : idxOrFn;
    setCurrentSlide(newIdx);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => goToSlide((p) => (p - 1 + slides.length) % slides.length);
  const handleNext = () => goToSlide((p) => (p + 1) % slides.length);

  const slide = slides[currentSlide] || DEFAULT_SLIDES[0];
  const bgGradient = slide.bg || "from-[#FF5200] via-[#FF7340] to-[#FFA040]";

  return (
    <div id="hero-slider-section" className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
      {/* ── MAIN BANNER ── */}
      <div className={`relative bg-gradient-to-br ${bgGradient} min-h-[260px] sm:min-h-[320px] overflow-hidden`}>

        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-black/10 blur-2xl pointer-events-none" />

        {/* Slide background images (crossfade) */}
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? "opacity-30" : "opacity-0"}`}
            aria-hidden="true"
          >
            <img
              src={s.image}
              alt=""
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 max-w-7xl mx-auto">
          {/* Left text block */}
          <div className="flex-1 max-w-lg space-y-3">
            {/* Location bar */}
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-white/80 shrink-0" />
              <span className="text-white/80 text-xs font-semibold truncate max-w-[220px]">
                {currentLocation || "Detecting location…"}
              </span>
            </div>

            {/* Offer tag pill */}
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <Tag className="h-3 w-3" />
              {slide.tag || "Exclusive Offer"}
            </span>

            {/* Big headline */}
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white leading-tight drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-white/90 font-bold text-sm sm:text-base uppercase tracking-wide">
              {slide.subtitle}
            </p>

            {/* Code + CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl text-xs font-mono font-black text-white tracking-widest">
                USE: <span className="text-yellow-300">{slide.code || "QUIKABITE"}</span>
              </div>
              <button
                onClick={onSearchClick}
                className="cursor-pointer bg-white text-gray-900 font-extrabold text-sm px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-200"
              >
                Order Now →
              </button>
            </div>
          </div>

          {/* Right: food image spotlight */}
          <div className="hidden sm:block relative w-56 h-48 shrink-0">
            {slides.map((s, idx) => (
              <img
                key={idx}
                src={s.image}
                alt={s.title}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover rounded-2xl border-2 border-white/30 shadow-2xl transition-all duration-700 ${idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              />
            ))}
          </div>
        </div>

        {/* Slider controls */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`rounded-full transition-all duration-300 ${idx === currentSlide ? "w-7 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/60"}`}
            />
          ))}
        </div>
      </div>

      {/* ── PROMO STRIP ── */}
      <div className="bg-gradient-to-r from-[#FF5200] to-[#FFC300] px-4 sm:px-8 lg:px-12 py-2.5 flex items-center gap-6 overflow-x-auto no-scrollbar">
        {[
          { icon: "⚡", text: "Fast Delivery in 20 mins" },
          { icon: "🎁", text: "50% OFF on First Order" },
          { icon: "🆓", text: "Free Delivery above ₹199" },
          { icon: "⭐", text: "4.8★ Rated Restaurants" },
          { icon: "🔥", text: "Exclusive Daily Deals" },
          { icon: "💳", text: "Pay via UPI & get cashback" },
        ].map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 text-white text-xs font-bold whitespace-nowrap shrink-0">
            <span>{item.icon}</span>
            <span>{item.text}</span>
            {i < 5 && <span className="ml-4 text-white/40">•</span>}
          </span>
        ))}
      </div>

      {/* ── QUICK CUISINE CHIPS ── */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 lg:px-12 py-3">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
          {QUICK_CUISINES.map((c) => (
            <button
              key={c.label}
              onClick={() => onCuisineSelect?.(c.label.toLowerCase())}
              className={`flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer ${c.color}`}
            >
              <span className="text-base leading-none">{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
