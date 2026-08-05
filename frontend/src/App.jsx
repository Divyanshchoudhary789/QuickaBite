import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RESTAURANTS,
  CATEGORIES,
  OFFER_CARDS,
  COLLECTIONS,
  saveRestaurantsToStorage,
  EXTRA_KITCHENS,
  INITIAL_NOTIFICATIONS,
} from "./data";
import Navbar from "./components/common/Navbar";
import SearchPage from "./components/diner/SearchPage";
import OffersPage from "./components/diner/OffersPage";
import HeroSlider from "./components/diner/HeroSlider";
import ReelPlayer from "./components/diner/ReelPlayer";
import RestaurantDetailModal from "./components/diner/RestaurantDetailModal";
import CartDrawer from "./components/diner/CartDrawer";
import ActiveOrderTracker from "./components/diner/ActiveOrderTracker";
import ShoppingCartPage from "./components/diner/ShoppingCartPage";
import CheckoutPage from "./components/diner/CheckoutPage";
import OrdersPage from "./components/diner/OrdersPage";
import ProfilePage from "./components/diner/ProfilePage";
import FavoritesPage from "./components/diner/FavoritesPage";
import SupportPage from "./components/diner/SupportPage";
import AuthPage from "./components/common/AuthPage";
import HomePage from "./components/diner/HomePage";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManagerDashboard from "./components/manager/ManagerDashboard";
import CloudKitchenSection from "./components/diner/CloudKitchenSection";
import BrandManagementTab from "./components/admin/BrandManagementTab";
import BottomNavbar from "./components/common/BottomNavbar";
import CartConflictModal from "./components/diner/CartConflictModal";
import FloatingDecorations from "./components/common/FloatingDecorations";
import LandingLoader from "./components/common/LandingLoader";

import { authService } from "./api/authService";
import { dinerService, normalizeMenuItem } from "./api/dinerService";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { OrdersProvider, useOrders } from "./context/OrdersContext";
import { FavoritesProvider, useFavorites } from "./context/FavoritesContext";
import {
  NotificationProvider,
  useNotifications,
} from "./context/NotificationContext";
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showLoader, setShowLoader] = useState(() => {
    return !sessionStorage.getItem("qb_loaded");
  });

  // Draw global context states
  const { isLoggedIn, setIsLoggedIn, userRole, setUserRole, logout, profile } =
    useAuth();
  const {
    cartItems,
    setCartItems,
    cartRestaurant,
    setCartRestaurant,
    cartConflict,
    setCartConflict,
    addToCart,
    removeFromCart,
    clearCart,
    resolveCartConflict: contextResolveCartConflict,
  } = useCart();
  const { orders, setOrders, activeOrder, setActiveOrder, checkoutSuccess } =
    useOrders();
  const {
    favorites,
    setFavorites,
    favoriteDishes,
    setFavoriteDishes,
    toggleFavorite,
    toggleFavoriteDish,
  } = useFavorites();
  const {
    notifications,
    setNotifications,
    markAllAsRead,
    toggleRead,
    deleteNotification,
    clearAll,
    addNotification,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.substring(1);
    const validTabs = [
      "home",
      "search",
      "offers",
      "orders",
      "profile",
      "admin",
      "manager",
      "brands",
      "favorites",
      "cart",
      "checkout",
      "support",
      "login",
    ];
    if (path && validTabs.includes(path)) {
      return path;
    }
    const role = authService.getCurrentUser().role;
    if (role === "admin") {
      return "admin";
    }
    if (role === "manager") {
      return "manager";
    }
    return "home";
  });

  useEffect(() => {
    const path = location.pathname.substring(1);
    if (!path || path === "") {
      navigate("/home", { replace: true });
      return;
    }
    const validTabs = [
      "home",
      "search",
      "offers",
      "orders",
      "profile",
      "admin",
      "manager",
      "brands",
      "favorites",
      "cart",
      "checkout",
      "support",
      "login",
    ];
    if (!validTabs.includes(path)) {
      navigate("/home", { replace: true });
      return;
    }

    // Guard: logged in users should not access the login page
    if (path === "login" && isLoggedIn) {
      if (userRole === "admin") {
        navigate("/admin", { replace: true });
      } else if (userRole === "manager") {
        navigate("/manager", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
      return;
    }

    // Auth & Role Guards
    const requiresAuth = [
      "orders",
      "profile",
      "checkout",
      "admin",
      "manager",
      "brands",
    ].includes(path);

    if (requiresAuth && !isLoggedIn) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
      triggerToast(
        `Please sign in to access your ${path.charAt(0).toUpperCase() + path.slice(1)}!`,
      );
      return;
    }

    if (path === "admin" && userRole !== "admin") {
      navigate("/home", { replace: true });
      return;
    }

    if (path === "manager" && userRole !== "manager") {
      navigate("/home", { replace: true });
      return;
    }

    if (path === "brands" && userRole !== "admin" && userRole !== "manager") {
      navigate("/home", { replace: true });
      return;
    }

    if (
      (path === "favorites" || path === "cart" || path === "checkout") &&
      (userRole === "admin" || userRole === "manager")
    ) {
      navigate("/home", { replace: true });
      return;
    }

    if (path !== activeTab) {
      setActiveTab(path);
    }
  }, [location.pathname, navigate, activeTab, isLoggedIn, userRole]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Home, Dubai");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCuisineExpanded, setIsCuisineExpanded] = useState(false);
  const [isPopularCuisinesExpanded, setIsPopularCuisinesExpanded] =
    useState(false);
  const [toast, setToast] = useState(null);
  const [hideBottomNavbar, setHideBottomNavbar] = useState(false);
  const triggerToast = (msg) => {
    setToast(msg);
  };
  const navigateWithAuth = (tab, options) => {
    const rawTab = typeof tab === "string" ? tab : "";
    const cleanTab = rawTab.split("?")[0].replace(/^\//, "");
    if (
      (cleanTab === "favorites" || cleanTab === "cart" || cleanTab === "checkout") &&
      (userRole === "admin" || userRole === "manager")
    ) {
      triggerToast("Access denied: diners only!");
      return;
    }
    if (
      !isLoggedIn &&
      (cleanTab === "orders" ||
        cleanTab === "profile" ||
        cleanTab === "checkout" ||
        cleanTab === "admin" ||
        cleanTab === "manager" ||
        cleanTab === "brands")
    ) {
      const fromPath = rawTab.startsWith("/") ? rawTab : `/${rawTab}`;
      navigate("/login", { state: { from: fromPath } });
      triggerToast(
        `Please sign in to access your ${cleanTab.charAt(0).toUpperCase() + cleanTab.slice(1)}!`,
      );
    } else {
      const targetPath = rawTab.startsWith("/") ? rawTab : `/${rawTab}`;
      navigate(targetPath, options);
    }
  };
  const handleLogout = async () => {
    navigate("/home", { replace: true });
    await logout();
    triggerToast("Logged out securely");
  };
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3e3);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const [adminSubTab, setAdminSubTab] = useState(() => {
    return localStorage.getItem("quikabite_admin_subtab") || "overview";
  });
  const [marketingSubTab, setMarketingSubTab] = useState(() => {
    return localStorage.getItem("quikabite_marketing_subtab") || "whatsapp";
  });

  useEffect(() => {
    localStorage.setItem("quikabite_admin_subtab", adminSubTab);
  }, [adminSubTab]);

  useEffect(() => {
    localStorage.setItem("quikabite_marketing_subtab", marketingSubTab);
  }, [marketingSubTab]);

  const [filterFastDelivery, setFilterFastDelivery] = useState(false);
  const [filterTopRated, setFilterTopRated] = useState(false);
  const [filterPureVeg, setFilterPureVeg] = useState(false);
  const [filterOffers, setFilterOffers] = useState(false);
  const [filterPrice, setFilterPrice] = useState("all");
  const [restaurants, setRestaurants] = useState([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  useEffect(() => {
    const loadRestaurants = async () => {
      setIsLoadingRestaurants(true);
      try {
        const list = await dinerService.getRestaurants();

        if (import.meta.env.VITE_USE_MOCK === "false") {
          try {
            const response = await dinerService.getAllMenu();
            const allMenus = response?.data || response || [];

            const updatedList = list.map((res) => {
              const restaurantMenus = allMenus
                .filter((item) => {
                  const itemResId =
                    item.restaurant?._id ||
                    item.restaurant?.id ||
                    item.restaurant;
                  return (
                    String(itemResId) === String(res._id) ||
                    String(itemResId) === String(res.id) ||
                    (res.slug && String(itemResId) === String(res.slug))
                  );
                })
                .map((item) => normalizeMenuItem(item));
              return {
                ...res,
                menu: restaurantMenus.length > 0 ? restaurantMenus : (res.menu || []),
              };
            });
            setRestaurants(updatedList);
          } catch (menuErr) {
            console.error("Failed to load menus in App.jsx:", menuErr);
            setRestaurants(list);
          }
        } else {
          setRestaurants(list);
        }
      } catch (err) {
        console.error("Failed to load restaurants in App.jsx:", err);
      } finally {
        setIsLoadingRestaurants(false);
      }
    };
    loadRestaurants();
  }, []);
  const [isExploreMoreUnlocked, setIsExploreMoreUnlocked] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [preAppliedCoupon, setPreAppliedCoupon] = useState("");

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [activeReelId, setActiveReelId] = useState(null);
  const [reels, setReels] = useState([]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const fetched = await dinerService.getReels();
        setReels(Array.isArray(fetched) && fetched.length > 0 ? fetched : []);
      } catch (err) {
        console.error("Error fetching reels in App.jsx:", err);
        setReels([]);
      }
    };
    fetchReels();
  }, []);


  const handleSetSelectedRestaurant = (restaurant) => {
    if (restaurant) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        const resId = restaurant.id || restaurant._id;
        next.set("restaurant", resId);
        if (restaurant.initialMenuItemId) {
          next.set("dish", restaurant.initialMenuItemId);
        } else {
          next.delete("dish");
        }
        return next;
      });
    } else {
      if (searchParams.has("restaurant")) {
        navigate(-1);
      } else {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("restaurant");
          next.delete("dish");
          return next;
        });
      }
    }
  };

  const handleSetActiveReelId = (reelId) => {
    if (reelId) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("reel", reelId);
        return next;
      });
    } else {
      if (searchParams.has("reel")) {
        navigate(-1);
      } else {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("reel");
          return next;
        });
      }
    }
  };

  const handleSetIsCartOpen = (isOpen) => {
    if (isOpen) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("cart", "true");
        return next;
      });
    } else {
      if (searchParams.get("cart") === "true") {
        navigate(-1);
      } else {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete("cart");
          return next;
        });
      }
    }
  };

  const restaurantParam = searchParams.get("restaurant");
  const dishParam = searchParams.get("dish");
  const reelParam = searchParams.get("reel");
  const cartParam = searchParams.get("cart");

  useEffect(() => {
    if (restaurantParam) {
      const found = restaurants.find(
        (r) => String(r.id || r._id) === String(restaurantParam)
      );
      if (found) {
        setSelectedRestaurant({
          ...found,
          initialMenuItemId: dishParam || found.initialMenuItemId,
        });
      } else {
        setSelectedRestaurant(null);
      }
    } else {
      setSelectedRestaurant(null);
    }

    if (reelParam) {
      setActiveReelId(reelParam);
    } else {
      setActiveReelId(null);
    }

    const cartOpen = cartParam === "true";
    setIsCartOpen(cartOpen);
  }, [restaurantParam, reelParam, cartParam, restaurants]);
  const handleToggleFavoriteDish = (dishId) => {
    toggleFavoriteDish(dishId, triggerToast);
  };
  const handleMarkAllNotificationsAsRead = () => {
    markAllAsRead(triggerToast);
  };
  const handleToggleNotificationRead = (id) => {
    toggleRead(id);
  };
  const handleDeleteNotification = (id) => {
    deleteNotification(id, triggerToast);
  };
  const handleClearAllNotifications = () => {
    clearAll(triggerToast);
  };
  const handleCheckoutSuccess = (newOrder) => {
    checkoutSuccess(newOrder, addNotification, navigate);
  };
  const handleAddToCart = (resId, resName, item) => {
    addToCart(resId, resName, item, triggerToast);
  };
  const resolveCartConflict = () => {
    contextResolveCartConflict(triggerToast);
  };
  const handleRemoveFromCart = (resId, itemId) => {
    removeFromCart(resId, itemId);
  };
  const handleToggleRadius = (expanded) => {
    setIsExploreMoreUnlocked(expanded);
    if (import.meta.env.VITE_USE_MOCK === "false") {
      triggerToast(
        expanded
          ? "Delivery radius expanded! Showing all available partners."
          : "Delivery radius reset to Home (Local partners only).",
      );
      return;
    }
    if (expanded) {
      const combined = [...RESTAURANTS, ...EXTRA_KITCHENS];
      const unique = combined.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
      );
      saveRestaurantsToStorage(unique);
      setRestaurants(unique);
      triggerToast(
        "Delivery radius expanded! 4 hidden gourmet gems unlocked near Jumeirah & Business Bay.",
      );
    } else {
      const extraIds = EXTRA_KITCHENS.map((k) => k.id);
      const filtered = RESTAURANTS.filter((r) => !extraIds.includes(r.id));
      saveRestaurantsToStorage(filtered);
      setRestaurants(filtered);
      triggerToast(
        "Delivery radius reset to Home, Dubai (Local partners only).",
      );
    }
  };
  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    const isSpecial = catId === "italian" || catId === "desserts";
    if (isSpecial && !isExploreMoreUnlocked) {
      handleToggleRadius(true);
      triggerToast(
        `Expanded delivery zone to show premium ${catId === "italian" ? "Italian" : "Dessert"} options!`,
      );
    }
  };
  const handleToggleFavorite = (resId, e, resName) => {
    toggleFavorite(resId, e, triggerToast, resName);
  };
  const filteredRestaurants = restaurants.filter((restaurant) => {
    let matchesCategory = selectedCategory === "all";
    if (!matchesCategory) {
      const cat = selectedCategory.toLowerCase();
      const checkMatch = (term) => {
        const t = term.toLowerCase();
        if (cat === "burger") {
          return (
            t.includes("burger") ||
            t.includes("fast food") ||
            t.includes("american")
          );
        }
        if (cat === "arabian") {
          return (
            t.includes("arab") ||
            t.includes("shawarma") ||
            t.includes("lebanese") ||
            t.includes("middle eastern") ||
            t.includes("kebab")
          );
        }
        if (cat === "indian") {
          return (
            t.includes("indian") ||
            t.includes("mughlai") ||
            t.includes("kebab") ||
            t.includes("biryani")
          );
        }
        if (cat === "biryani") {
          return t.includes("biryani");
        }
        if (cat === "chinese") {
          return (
            t.includes("chinese") ||
            t.includes("thai") ||
            t.includes("asian") ||
            t.includes("sichuan") ||
            t.includes("noodle") ||
            t.includes("ramen") ||
            t.includes("japanese")
          );
        }
        if (cat === "italian") {
          return (
            t.includes("italian") ||
            t.includes("pizza") ||
            t.includes("pasta") ||
            t.includes("truffle")
          );
        }
        if (cat === "healthy") {
          return (
            t.includes("healthy") || t.includes("salad") || t.includes("veg")
          );
        }
        if (cat === "desserts") {
          return (
            t.includes("dessert") ||
            t.includes("sweet") ||
            t.includes("waffle") ||
            t.includes("crepe") ||
            t.includes("ice cream") ||
            t.includes("cake") ||
            t.includes("chocolate")
          );
        }
        return t.includes(cat);
      };
      matchesCategory =
        restaurant.cuisines.some((c) => checkMatch(c)) ||
        restaurant.menu.some(
          (item) => checkMatch(item.category) || checkMatch(item.name),
        );
    }
    if (!matchesCategory) return false;
    if (filterFastDelivery) {
      const minutes = parseInt(restaurant.deliveryTime, 10);
      if (isNaN(minutes) || minutes > 30) return false;
    }
    if (filterTopRated) {
      if (restaurant.rating < 4.5) return false;
    }
    if (filterPureVeg) {
      const hasVeg = restaurant.menu.some((item) => item.isVeg);
      if (!hasVeg) return false;
    }
    if (filterOffers) {
      if (!restaurant.isPromoBadge) return false;
    }
    if (filterPrice !== "all") {
      const hasMatchingPrice = restaurant.menu.some((item) => {
        const price = Number(item.price);
        if (filterPrice === "under-99") return price <= 99;
        if (filterPrice === "under-199") return price <= 199;
        if (filterPrice === "under-299") return price <= 299;
        if (filterPrice === "above-299") return price >= 299;
        return true;
      });
      if (!hasMatchingPrice) return false;
    }
    return true;
  });
  if (activeTab === "login" && isLoggedIn) {
    return null;
  }

  if (activeTab === "login" && !isLoggedIn) {
    return (
      <>
        <AnimatePresence mode="wait">
          {showLoader && (
            <LandingLoader
              onComplete={() => {
                sessionStorage.setItem("qb_loaded", "true");
                setShowLoader(false);
              }}
            />
          )}
        </AnimatePresence>
        <AuthPage
          onLoginSuccess={(profileData) => {
            // Auth state (isLoggedIn, userRole, profile) is already set inside
            // AuthContext by verifyLoginOtp / verifySignupOtp. We only handle routing.
            const role = profileData?.role || "user";
            if (role === "admin") {
              navigate("/admin", { replace: true });
            } else if (role === "manager") {
              navigate("/manager", { replace: true });
            } else {
              let redirectPath = location.state?.from || "/home";
              if (redirectPath === "/login") {
                redirectPath = "/home";
              }
              navigate(redirectPath, { replace: true });
            }
          }}
          onBackToHome={() => navigate("/home")}
          triggerToast={triggerToast}
        />
        {toast && (
          <div
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] bg-gray-950 text-white font-black text-xs px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-800 animate-slide-up"
            id="auth-toast-banner"
          >
            <span>{toast}</span>
          </div>
        )}
      </>
    );
  }
  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <LandingLoader
            onComplete={() => {
              sessionStorage.setItem("qb_loaded", "true");
              setShowLoader(false);
            }}
          />
        )}
      </AnimatePresence>
      <div
        className="min-h-screen bg-cream-base flex flex-col font-sans relative pb-32 sm:pb-20 overflow-x-hidden"
        id="main-globaleats-app"
      >
        {/* Decorative floating spices/ingredients and herb illustrations in background */}
        <FloatingDecorations />

        {/* 1. Global Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={navigateWithAuth}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
          onCartToggle={() => navigateWithAuth("cart")}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          onDeleteNotification={handleDeleteNotification}
          onClearAllNotifications={handleClearAllNotifications}
          userRole={userRole}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          profile={profile}
        />

        {/* Main Core View Area */}
        <main
          className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative"
          id="viewports-stage"
        >
          {activeTab === "home" &&
            userRole !== "admin" &&
            userRole !== "manager" && (
              <HomePage
                restaurants={restaurants}
                currentLocation={currentLocation}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                isCuisineExpanded={isCuisineExpanded}
                setIsCuisineExpanded={setIsCuisineExpanded}
                isPopularCuisinesExpanded={isPopularCuisinesExpanded}
                setIsPopularCuisinesExpanded={setIsPopularCuisinesExpanded}
                triggerToast={triggerToast}
                cartItems={cartItems}
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
                filterFastDelivery={filterFastDelivery}
                setFilterFastDelivery={setFilterFastDelivery}
                filterTopRated={filterTopRated}
                setFilterTopRated={setFilterTopRated}
                filterPureVeg={filterPureVeg}
                setFilterPureVeg={setFilterPureVeg}
                filterOffers={filterOffers}
                setFilterOffers={setFilterOffers}
                filterPrice={filterPrice}
                setFilterPrice={setFilterPrice}
                filteredRestaurants={filteredRestaurants}
                setSelectedRestaurant={handleSetSelectedRestaurant}
                favorites={favorites}
                handleToggleFavorite={handleToggleFavorite}
                isExploreMoreUnlocked={isExploreMoreUnlocked}
                handleToggleRadius={handleToggleRadius}
                setActiveReelId={handleSetActiveReelId}
                setActiveTab={navigateWithAuth}
              />
            )}

          {/* TAB 2: SEARCH DIRECT VIEW */}
          {activeTab === "search" && (
            <SearchPage
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              restaurants={restaurants}
              onAddToCart={handleAddToCart}
              setSelectedRestaurant={handleSetSelectedRestaurant}
              setActiveTab={navigateWithAuth}
              triggerToast={triggerToast}
              isLoading={isLoadingRestaurants}
            />
          )}

          {/* TAB 3: OFFERS VIEW */}
          {activeTab === "offers" && (
            <OffersPage
              preAppliedCoupon={preAppliedCoupon}
              setPreAppliedCoupon={setPreAppliedCoupon}
              triggerToast={triggerToast}
            />
          )}

          {/* TAB 5: MY ORDERS HISTORY */}
          {activeTab === "orders" &&
            (activeOrder ? (
              <ActiveOrderTracker
                order={activeOrder}
                onClose={() => {
                  setActiveOrder(null);
                }}
                triggerToast={triggerToast}
              />
            ) : (
              <OrdersPage
                orders={orders}
                setOrders={setOrders}
                activeOrder={activeOrder}
                setActiveOrder={setActiveOrder}
                onAddToCart={handleAddToCart}
                setIsCartOpen={handleSetIsCartOpen}
                setActiveTab={navigateWithAuth}
                triggerToast={triggerToast}
              />
            ))}

          {/* TAB 4: MY PROFILE PREFERENCES */}
          {activeTab === "profile" && (
            <ProfilePage
              setSelectedRestaurant={handleSetSelectedRestaurant}
              setActiveTab={navigateWithAuth}
              triggerToast={triggerToast}
              setIsLoggedIn={setIsLoggedIn}
            />
          )}

          {/* TAB 10: ADMIN DASHBOARD */}
          {(activeTab === "home" || activeTab === "admin") &&
            userRole === "admin" && (
              <AdminDashboard
                orders={orders}
                setOrders={setOrders}
                activeOrder={activeOrder}
                setActiveOrder={setActiveOrder}
                triggerToast={triggerToast}
                setActiveTab={navigateWithAuth}
                notifications={notifications}
                setNotifications={setNotifications}
                adminSubTab={adminSubTab}
                setAdminSubTab={setAdminSubTab}
                userRole={userRole}
                marketingSubTab={marketingSubTab}
                setMarketingSubTab={setMarketingSubTab}
              />
            )}

          {/* TAB 12: MANAGER DASHBOARD */}
          {(activeTab === "home" || activeTab === "manager") &&
            userRole === "manager" && (
              <ManagerDashboard
                orders={orders}
                setOrders={setOrders}
                triggerToast={triggerToast}
                setHideBottomNavbar={setHideBottomNavbar}
              />
            )}

          {/* TAB 11: VIRTUAL BRAND MANAGEMENT */}
          {activeTab === "brands" &&
            (userRole === "admin" || userRole === "manager") && (
              <div
                className="bg-cream-base p-4 sm:p-6"
                id="admin-brands-tab-viewport"
              >
                <BrandManagementTab
                  orders={orders}
                  triggerToast={triggerToast}
                />
              </div>
            )}

          {/* TAB 8: FAVORITES VIEW */}
          {activeTab === "favorites" && (
            <FavoritesPage
              favorites={favorites}
              setFavorites={setFavorites}
              favoriteDishes={favoriteDishes}
              setFavoriteDishes={setFavoriteDishes}
              restaurants={restaurants}
              onAddToCart={handleAddToCart}
              setSelectedRestaurant={handleSetSelectedRestaurant}
              setActiveTab={navigateWithAuth}
              triggerToast={triggerToast}
            />
          )}

          {/* TAB 6: SHOPPING CART PAGE */}
          {activeTab === "cart" && (
            <ShoppingCartPage
              cartItems={cartItems}
              restaurantName={cartRestaurant?.name || ""}
              restaurantId={cartRestaurant?.id || ""}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={clearCart}
              onCheckoutSuccess={handleCheckoutSuccess}
              setActiveTab={navigateWithAuth}
              triggerToast={triggerToast}
              preAppliedCoupon={preAppliedCoupon}
              setPreAppliedCoupon={setPreAppliedCoupon}
            />
          )}

          {/* TAB 7: SECURE CHECKOUT PAGE */}
          {activeTab === "checkout" && (
            <CheckoutPage
              cartItems={cartItems}
              restaurantName={cartRestaurant?.name || ""}
              restaurantId={cartRestaurant?.id || ""}
              onClearCart={clearCart}
              onCheckoutSuccess={handleCheckoutSuccess}
              setActiveTab={navigateWithAuth}
              triggerToast={triggerToast}
              preAppliedCoupon={preAppliedCoupon}
              setPreAppliedCoupon={setPreAppliedCoupon}
            />
          )}

          {/* SUPPORT CENTER VIEW */}
          {activeTab === "support" && (
            <SupportPage
              orders={orders}
              triggerToast={triggerToast}
              setActiveTab={navigateWithAuth}
            />
          )}
        </main>

        {/* 2. Slide Drawer for Cart */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => handleSetIsCartOpen(false)}
          cartItems={cartItems}
          restaurantId={cartRestaurant?.id || ""}
          restaurantName={cartRestaurant?.name || ""}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={clearCart}
          onCheckoutSuccess={handleCheckoutSuccess}
          onProceedToCheckout={() => navigateWithAuth("checkout")}
        />

        {/* 3. Restaurant Detail Modal */}
        {selectedRestaurant && (
          <RestaurantDetailModal
            restaurant={selectedRestaurant}
            cartItems={cartItems.filter(
              (item) => cartRestaurant?.id === selectedRestaurant.id,
            )}
            onClose={() => handleSetSelectedRestaurant(null)}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            favoriteDishes={favoriteDishes}
            onToggleFavoriteDish={handleToggleFavoriteDish}
            onViewCart={() => {
              setSelectedRestaurant(null);
              navigate("/cart");
            }}
          />
        )}

        {/* 4. Reels vertical full screen player */}
        {activeReelId && (
          <ReelPlayer
            reels={reels}
            initialReelId={activeReelId}
            onClose={() => handleSetActiveReelId(null)}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* 5. Sticky Bottom Navigation Bar (Responsive floating dock) */}
        {/* 5. Sticky Bottom Navigation Bar (Responsive floating dock) */}
        {!hideBottomNavbar && (
          <BottomNavbar
            activeTab={activeTab}
            setActiveTab={navigateWithAuth}
            userRole={userRole}
            cartItems={cartItems}
            adminSubTab={adminSubTab}
            setAdminSubTab={setAdminSubTab}
            marketingSubTab={marketingSubTab}
            setMarketingSubTab={setMarketingSubTab}
          />
        )}

        {/* 6. Custom Cart Conflict Modal */}
        <CartConflictModal
          cartConflict={cartConflict}
          cartRestaurantName={cartRestaurant?.name || ""}
          onClose={() => setCartConflict(null)}
          onConfirm={resolveCartConflict}
        />

        {/* 7. Beautiful Toast Banner */}
        {toast && (
          <div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-white font-bold text-xs px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2 border border-gray-800 animate-slide-up"
            id="toast-banner"
          >
            <span className="text-brand-orange text-sm font-black">✦</span>
            <span>{toast}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrdersProvider>
          <FavoritesProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </FavoritesProvider>
        </OrdersProvider>
      </CartProvider>
    </AuthProvider>
  );
}
