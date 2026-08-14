// src/hooks/useDeliverableOutlets.js
import { useState, useEffect } from "react";
import { dinerService } from "../api/dinerService";

/**
 * Step 2: Custom React Hook for fetching Deliverable Outlets / Restaurants based on lat/lng radius
 */
export const useRestaurants = (locationCoords) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOutlets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dinerService.getRestaurants(locationCoords);
        if (isMounted) {
          setRestaurants(data);
        }
      } catch (err) {
        console.error("Failed to fetch deliverable restaurants:", err);
        if (isMounted) {
          setError(err?.message || "Failed to fetch deliverable outlets");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOutlets();
    return () => {
      isMounted = false;
    };
  }, [locationCoords?.lat, locationCoords?.lng]);

  return { restaurants, loading, error };
};

/**
 * Step 3: Custom React Hook for fetching Deliverable Dishes / Menu items based on lat/lng radius and filters
 */
export const useMenuItems = (locationCoords, categoryFilter = "all", searchQuery = "", extraFilters = {}) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDishes = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {
          category: categoryFilter,
          search: searchQuery,
          ...extraFilters,
        };
        const data = await dinerService.getMenuItems(locationCoords, filters);
        if (isMounted) {
          setDishes(data);
        }
      } catch (err) {
        console.error("Failed to fetch deliverable dishes:", err);
        if (isMounted) {
          setError(err?.message || "Failed to fetch deliverable dishes");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDishes();
    return () => {
      isMounted = false;
    };
  }, [
    locationCoords?.lat,
    locationCoords?.lng,
    categoryFilter,
    searchQuery,
    extraFilters?.isVegetarian,
    extraFilters?.brand,
    extraFilters?.restaurant,
  ]);

  return { dishes, loading, error };
};
