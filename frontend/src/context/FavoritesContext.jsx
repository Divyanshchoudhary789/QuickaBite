import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { dinerService } from "../api/dinerService";

const FavoritesContext = createContext();

const extractIds = (resData) => {
  const list = Array.isArray(resData)
    ? resData
    : resData?.data && Array.isArray(resData.data)
      ? resData.data
      : [];
  return list
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "object" && item !== null) {
        return item.restaurant?._id || item.restaurant?.id || item.menu?._id || item.menu?.id || item._id || item.id || String(item);
      }
      return String(item);
    })
    .filter(Boolean);
};

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [favoriteDishes, setFavoriteDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from service initially using 2 APIs: getFavoriteRestaurants & getFavoriteMenu
  const refreshFavorites = useCallback(async () => {
    const token = localStorage.getItem("globaleats_token");
    if (!token && import.meta.env.VITE_USE_MOCK === "false") {
      const cachedRes = localStorage.getItem("globaleats_favorites_restaurants");
      const cachedDish = localStorage.getItem("globaleats_favorites_dishes");
      setFavorites(extractIds(cachedRes ? JSON.parse(cachedRes) : []));
      setFavoriteDishes(extractIds(cachedDish ? JSON.parse(cachedDish) : []));
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const favResData = await dinerService.getFavoriteRestaurants();
      const favDishData = await dinerService.getFavoriteMenu();
      setFavorites(extractIds(favResData));
      setFavoriteDishes(extractIds(favDishData));
    } catch (err) {
      console.error("Failed to load favorites:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  // Toggle Favorite Restaurant using addFavoriteRestaurant / removeFavoriteRestaurant APIs
  const toggleFavorite = async (resId, e, triggerToast, resName) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const token = localStorage.getItem("globaleats_token");
    if (!token && import.meta.env.VITE_USE_MOCK === "false") {
      if (triggerToast) triggerToast("Please sign in to add favorites!");
      return;
    }
    const isFav = favorites.some((f) => String(f) === String(resId) || String(f?._id) === String(resId) || String(f?.id) === String(resId));
    const nameLabel = resName ? ` "${resName}"` : "";
    if (isFav) {
      setFavorites((prev) => prev.filter((id) => String(id) !== String(resId) && String(id?._id) !== String(resId)));
      if (triggerToast) triggerToast(`Removed restaurant${nameLabel} from favorites`);
      await dinerService.removeFavoriteRestaurant(resId);
    } else {
      setFavorites((prev) => [...prev, resId]);
      if (triggerToast) triggerToast(`Added restaurant${nameLabel} to your favorites!`);
      await dinerService.addFavoriteRestaurant(resId);
    }
  };

  // Toggle Favorite Dish using addFavoriteMenu / removeFavoriteMenu APIs
  const toggleFavoriteDish = async (dishId, triggerToast) => {
    const token = localStorage.getItem("globaleats_token");
    if (!token && import.meta.env.VITE_USE_MOCK === "false") {
      if (triggerToast) triggerToast("Please sign in to save favorites!");
      return;
    }
    const isAlreadyFav = favoriteDishes.some((f) => String(f) === String(dishId) || String(f?._id) === String(dishId) || String(f?.id) === String(dishId));
    if (isAlreadyFav) {
      setFavoriteDishes((prev) => prev.filter((id) => String(id) !== String(dishId) && String(id?._id) !== String(dishId)));
      if (triggerToast) triggerToast("Dish removed from saved favorites");
      await dinerService.removeFavoriteMenu(dishId);
    } else {
      setFavoriteDishes((prev) => [...prev, dishId]);
      if (triggerToast) triggerToast("Dish saved to your favorites!");
      await dinerService.addFavoriteMenu(dishId);
    }
  };

  // API 1: Add Favorite Restaurant
  const addFavoriteRestaurant = async (resId) => {
    setFavorites((prev) => (prev.some((f) => String(f) === String(resId)) ? prev : [...prev, resId]));
    return await dinerService.addFavoriteRestaurant(resId);
  };

  // API 2: Get Favorite Restaurant Status / List
  const getFavoriteRestaurantStatus = async () => {
    return await dinerService.getFavoriteRestaurantStatus();
  };

  // API 3: Check Favorite Restaurant
  const checkFavoriteRestaurant = async (resId) => {
    return await dinerService.checkFavoriteRestaurant(resId);
  };

  // API 4: Remove Favorite Restaurant
  const removeFavoriteRestaurant = async (resId) => {
    setFavorites((prev) => prev.filter((id) => String(id) !== String(resId) && String(id?._id) !== String(resId)));
    return await dinerService.removeFavoriteRestaurant(resId);
  };

  // API 5: Add Favorite Menu
  const addFavoriteMenu = async (menuId) => {
    setFavoriteDishes((prev) => (prev.some((f) => String(f) === String(menuId)) ? prev : [...prev, menuId]));
    return await dinerService.addFavoriteMenu(menuId);
  };

  // API 6: Get Favorite Menu
  const getFavoriteMenu = async () => {
    return await dinerService.getFavoriteMenu();
  };

  // API 7: Check Favorite Menu Status
  const checkFavoriteMenuStatus = async (menuId) => {
    return await dinerService.checkFavoriteMenuStatus(menuId);
  };

  // API 8: Remove Favorite Menu
  const removeFavoriteMenu = async (menuId) => {
    setFavoriteDishes((prev) => prev.filter((id) => String(id) !== String(menuId) && String(id?._id) !== String(menuId)));
    return await dinerService.removeFavoriteMenu(menuId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        setFavorites: (list) => {
          setFavorites(list);
          dinerService.saveFavorites(list);
        },
        favoriteDishes,
        setFavoriteDishes: (list) => {
          setFavoriteDishes(list);
          dinerService.saveFavoriteDishes(list);
        },
        loading,
        refreshFavorites,
        toggleFavorite,
        toggleFavoriteDish,
        // 8 Explicit Favorites API handlers
        addFavoriteRestaurant,
        getFavoriteRestaurantStatus,
        checkFavoriteRestaurant,
        removeFavoriteRestaurant,
        addFavoriteMenu,
        getFavoriteMenu,
        checkFavoriteMenuStatus,
        removeFavoriteMenu,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

