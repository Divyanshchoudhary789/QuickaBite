import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import HomePage from "../components/diner/HomePage";

const SearchPage = lazy(() => import("../components/diner/SearchPage"));
const OffersPage = lazy(() => import("../components/diner/OffersPage"));
const OrdersPage = lazy(() => import("../components/diner/OrdersPage"));
const ProfilePage = lazy(() => import("../components/diner/ProfilePage"));
const FavoritesPage = lazy(() => import("../components/diner/FavoritesPage"));
const SupportPage = lazy(() => import("../components/diner/SupportPage"));
const ShoppingCartPage = lazy(() => import("../components/diner/ShoppingCartPage"));
const CheckoutPage = lazy(() => import("../components/diner/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("../components/diner/OrderSuccessPage"));
const AdminDashboard = lazy(() => import("../components/admin/AdminDashboard"));
const BrandManagementTab = lazy(() => import("../components/admin/BrandManagementTab"));
const ManagerDashboard = lazy(() => import("../components/manager/ManagerDashboard"));
const ActiveOrderTracker = lazy(() => import("../components/diner/ActiveOrderTracker"));

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full py-12">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      <span className="text-xs font-semibold text-neutral-500 tracking-wide animate-pulse">Loading...</span>
    </div>
  </div>
);

export default function AppRoutes({
  userRole,
  isLoggedIn,
  activeOrder,
  adminSubTab,
  marketingSubTab,
  marketingMenuOpen,
  setMarketingMenuOpen,
  // passthrough
  toast,
  triggerToast,
  navigateWithAuth,

  currentLocation,
  setCurrentLocation,

  searchQuery,
  setSearchQuery,

  restaurants,
  setRestaurants,
  selectedCategory,
  setSelectedCategory,
  isCuisineExpanded,
  setIsCuisineExpanded,
  isPopularCuisinesExpanded,
  setIsPopularCuisinesExpanded,
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
  selectedRestaurant,
  setActiveReelId,

  cartItems,
  cartRestaurant,
  setCartRestaurant,
  setCartItems,
  onAddToCart,
  onRemoveFromCart,
  setIsCartOpen,
  isCartOpen,
  preAppliedCoupon,
  setPreAppliedCoupon,

  favorites,
  setFavorites,
  favoriteDishes,
  setFavoriteDishes,
  handleToggleFavorite,
  handleToggleRadius,
  isExploreMoreUnlocked,

  // orders
  orders,
  setOrders,
  setActiveOrder,
  onCheckoutSuccess,

  // admin
  notifications,
  setNotifications,
  setAdminSubTab,
  setMarketingSubTab,

  // misc
  handleLogout,
  setIsLoggedIn,
}) {
  const { clearCart } = useCart();
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route
          path="/home"
          element={
            <HomePage
              currentLocation={currentLocation}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              isCuisineExpanded={isCuisineExpanded}
              setIsCuisineExpanded={setIsCuisineExpanded}
              isPopularCuisinesExpanded={isPopularCuisinesExpanded}
              setIsPopularCuisinesExpanded={setIsPopularCuisinesExpanded}
              triggerToast={triggerToast}
              cartItems={cartItems}
              handleAddToCart={onAddToCart}
              handleRemoveFromCart={onRemoveFromCart}
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
              setSelectedRestaurant={setSelectedRestaurant}
              favorites={favorites}
              handleToggleFavorite={handleToggleFavorite}
              isExploreMoreUnlocked={isExploreMoreUnlocked}
              handleToggleRadius={handleToggleRadius}
              setActiveReelId={setActiveReelId}
              setActiveTab={navigateWithAuth}
            />
          }
        />

        <Route
          path="/search"
          element={
            <SearchPage
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              restaurants={restaurants}
              onAddToCart={onAddToCart}
              setSelectedRestaurant={setSelectedRestaurant}
              setActiveTab={navigateWithAuth}
              triggerToast={triggerToast}
            />
          }
        />

        <Route
          path="/offers"
          element={
            <OffersPage
              preAppliedCoupon={preAppliedCoupon}
              setPreAppliedCoupon={setPreAppliedCoupon}
              triggerToast={triggerToast}
            />
          }
        />

        <Route
          path="/favorites"
          element={
            <FavoritesPage
              favorites={favorites}
              setFavorites={setFavorites}
              favoriteDishes={favoriteDishes}
              setFavoriteDishes={setFavoriteDishes}
              restaurants={restaurants}
              onAddToCart={onAddToCart}
              setSelectedRestaurant={setSelectedRestaurant}
              setActiveTab={navigateWithAuth}
              triggerToast={triggerToast}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <ShoppingCartPage
              cartItems={cartItems}
              restaurantName={cartRestaurant?.name || ""}
              restaurantId={cartRestaurant?.id || ""}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onClearCart={clearCart}
              onCheckoutSuccess={onCheckoutSuccess}
              setActiveTab={navigateWithAuth}
              triggerToast={triggerToast}
              preAppliedCoupon={preAppliedCoupon}
              setPreAppliedCoupon={setPreAppliedCoupon}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cartItems={cartItems}
              restaurantName={cartRestaurant?.name || ""}
              restaurantId={cartRestaurant?.id || ""}
              onClearCart={clearCart}
              onCheckoutSuccess={onCheckoutSuccess}
              setActiveTab={navigateWithAuth}
              triggerToast={triggerToast}
              preAppliedCoupon={preAppliedCoupon}
              setPreAppliedCoupon={setPreAppliedCoupon}
            />
          }
        />

        <Route
          path="/order-success/:orderId"
          element={
            <OrderSuccessPage
              triggerToast={triggerToast}
              setActiveOrder={setActiveOrder}
            />
          }
        />

        <Route
          path="/orders"
          element={
            activeOrder ? (
              <ActiveOrderTracker
                order={activeOrder}
                onClose={() => setActiveOrder(null)}
                triggerToast={triggerToast}
              />
            ) : (
              <OrdersPage
                orders={orders}
                setOrders={setOrders}
                activeOrder={activeOrder}
                setActiveOrder={setActiveOrder}
                onAddToCart={onAddToCart}
                setIsCartOpen={setIsCartOpen}
                setActiveTab={navigateWithAuth}
                triggerToast={triggerToast}
              />
            )
          }
        />

        <Route
          path="/profile"
          element={
            <ProfilePage
              setSelectedRestaurant={setSelectedRestaurant}
              setActiveTab={navigateWithAuth}
              triggerToast={triggerToast}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />

        <Route
          path="/support"
          element={
            <SupportPage
              orders={orders}
              triggerToast={triggerToast}
              setActiveTab={navigateWithAuth}
            />
          }
        />

        <Route
          path="/admin"
          element={
            userRole === "admin" ? (
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
            ) : userRole === "manager" ? (
              <Navigate to="/manager" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route
          path="/manager"
          element={
            userRole === "manager" ? (
              <ManagerDashboard
                orders={orders}
                setOrders={setOrders}
                triggerToast={triggerToast}
              />
            ) : userRole === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route
          path="/brands"
          element={
            userRole === "admin" || userRole === "manager" ? (
              <div
                className="bg-cream-base p-4 sm:p-6"
                id="admin-brands-tab-viewport"
              >
                <BrandManagementTab orders={orders} triggerToast={triggerToast} />
              </div>
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
}
