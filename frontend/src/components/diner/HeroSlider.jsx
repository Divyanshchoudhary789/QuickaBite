import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Zap, Star, Tag } from "lucide-react";
import {
  FaBowlRice,
  FaPizzaSlice,
  FaBurger,
  FaUtensils,
  FaCakeCandles,
  FaCarrot,
  FaDrumstickBite,
  FaFishFins,
  FaBacon,
  FaCookieBite,
  FaFire,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import { dinerService } from "../../api/dinerService";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_SLIDES = [
  {
    title: "UP TO 50% OFF",
    subtitle: "ON YOUR FIRST GOURMET ORDER",
    code: "WELCOME50",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=1200",
    accent: "#FF5200",
    bg: "from-[#FF5200] via-[#FF7340] to-[#FFA040]",
    tag: "🎉 New User Special",
  },
  {
    title: "FLAT 40% OFF",
    subtitle: "ON WOODFIRED ARTISAN PIZZAS",
    code: "FOOD40",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200",
    accent: "#E91E8C",
    bg: "from-[#E91E8C] via-[#F06292] to-[#FF5252]",
    tag: "🍕 Pizza Mania",
  },
  {
    title: "BUY 1 GET 1 FREE",
    subtitle: "ON CHARCOAL GRILLED KEBABS",
    code: "YALLABOGO",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1200",
    accent: "#00897B",
    bg: "from-[#00897B] via-[#26A69A] to-[#00BCD4]",
    tag: "🥙 BOGO Feast",
  },
  {
    title: "FREE FAST DELIVERY",
    subtitle: "ON SMASH BURGERS & SIDES",
    code: "FREEDEL",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1200",
    accent: "#7B1FA2",
    bg: "from-[#7B1FA2] via-[#AB47BC] to-[#E040FB]",
    tag: "Superfast 20 Min",
  },
];

// Swiggy-style quick cuisine chips with professional vector food icons
const QUICK_CUISINES = [
  { label: "Biryani", icon: FaBowlRice, badge: "Hot", bg: "from-amber-500/10 to-orange-500/10 text-amber-900 border-amber-300 hover:bg-amber-500 hover:text-white" },
  { label: "Pizza", icon: FaPizzaSlice, badge: "40% OFF", bg: "from-red-500/10 to-rose-500/10 text-red-900 border-red-300 hover:bg-red-500 hover:text-white" },
  { label: "Burgers", icon: FaBurger, badge: "Smash", bg: "from-yellow-500/10 to-amber-500/10 text-yellow-900 border-yellow-300 hover:bg-yellow-500 hover:text-white" },
  { label: "Chinese", icon: FaUtensils, badge: "Spicy", bg: "from-orange-500/10 to-red-500/10 text-orange-900 border-orange-300 hover:bg-orange-500 hover:text-white" },
  { label: "Desserts", icon: FaCakeCandles, badge: "Sweet", bg: "from-pink-500/10 to-rose-500/10 text-pink-900 border-pink-300 hover:bg-pink-500 hover:text-white" },
  { label: "Healthy", icon: FaCarrot, badge: "Fresh", bg: "from-emerald-500/10 to-green-500/10 text-emerald-900 border-emerald-300 hover:bg-emerald-500 hover:text-white" },
  { label: "Shawarma", icon: FaDrumstickBite, badge: "BOGO", bg: "from-lime-500/10 to-emerald-500/10 text-lime-900 border-lime-300 hover:bg-lime-500 hover:text-white" },
  { label: "Sushi", icon: FaFishFins, badge: "Fresh", bg: "from-sky-500/10 to-blue-500/10 text-sky-900 border-sky-300 hover:bg-sky-500 hover:text-white" },
  { label: "Pasta", icon: FaBacon, badge: "Cheese", bg: "from-purple-500/10 to-indigo-500/10 text-purple-900 border-purple-300 hover:bg-purple-500 hover:text-white" },
  { label: "Rolls", icon: FaCookieBite, badge: "Wrap", bg: "from-teal-500/10 to-cyan-500/10 text-teal-900 border-teal-300 hover:bg-teal-500 hover:text-white" },
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
    <div id="hero-slider-section" className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 overflow-hidden">
      {/* ── MAIN BANNER ── */}
      <div className={`relative bg-gradient-to-br ${bgGradient} min-h-[340px] sm:min-h-[420px] md:min-h-[460px] overflow-hidden flex flex-col justify-between`}>

        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-white/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-black/15 blur-3xl pointer-events-none" />

        {/* Slide background images (crossfade) */}
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? "opacity-35" : "opacity-0"}`}
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-16 pt-5 sm:pt-8 md:pt-10 pb-6 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-7xl mx-auto w-full">
          {/* Left text block */}
          <div className="flex-1 max-w-xl space-y-4 text-left">
            {/* Location bar */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-300 shrink-0 animate-bounce" />
              <span className="text-white/90 text-xs sm:text-sm font-extrabold truncate max-w-[260px] bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                {currentLocation || "Detecting location…"}
              </span>
            </div>

            {/* Offer tag pill */}
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              <Tag className="h-3.5 w-3.5 text-yellow-300" />
              {slide.tag || "Exclusive Offer"}
            </span>

            {/* Big headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white leading-none drop-shadow-xl tracking-tight">
              {slide.title}
            </h1>
            <p className="text-white/90 font-black text-base sm:text-xl uppercase tracking-wide drop-shadow-md">
              {slide.subtitle}
            </p>

            {/* Code + CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="bg-white/25 backdrop-blur-md border border-white/35 px-5 py-3 rounded-2xl text-xs sm:text-sm font-mono font-black text-white tracking-widest shadow-lg">
                USE: <span className="text-yellow-300 font-extrabold">{slide.code || "QuickaBITE"}</span>
              </div>
              <button
                onClick={onSearchClick}
                className="cursor-pointer bg-white text-gray-900 font-black text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-orange-50 hover:scale-105 active:scale-100 transition-all duration-200 flex items-center gap-2"
              >
                <span>Order Now</span>
                <span className="text-brand-orange text-lg">→</span>
              </button>
            </div>
          </div>

          {/* Right: mouth-watering ultra-realistic food spotlight */}
          <div className="hidden sm:block relative w-72 h-64 sm:w-80 sm:h-72 md:w-[420px] md:h-[340px] shrink-0">
            {slides.map((s, idx) => (
              <img
                key={idx}
                src={s.image}
                alt={s.title}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover rounded-3xl border-4 border-white/40 shadow-2xl transition-all duration-700 transform ${idx === currentSlide ? "opacity-100 scale-100 rotate-1" : "opacity-0 scale-95 -rotate-2"}`}
              />
            ))}
          </div>
        </div>

        {/* ── HERO BOTTOM FEATURE BAR ── */}
        <div className="mt-auto w-full relative z-20 border-t border-white/20 bg-black/30 backdrop-blur-xl py-3.5 px-4 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
            {[
              {title: "Superfast 20 Min", sub: "On-time or free" },
              {title: "50% OFF First Order", sub: "Use WELCOME50" },
              {title: "Free Delivery > ₹199", sub: "Zero hidden charges" },
              {title: "4.8★ Rated Kitchens", sub: "100% Quality checked" },
              {title: "Daily Hot Deals", sub: "Fresh offers hourly" },
              {title: "Instant UPI Cashback", sub: "Extra ₹30 back" },
              { title: "Late Night Delivery", sub: "Open till 3 AM" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md px-4 py-2 rounded-2xl shrink-0 transition-all duration-300 transform hover:scale-105 shadow-xs group cursor-pointer"
              >
                <div>
                  <p className="font-display font-black text-xs sm:text-s text-white leading-tight drop-shadow-sm">
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-bold text-yellow-300 mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>
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
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
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
    </div>
  );
}
