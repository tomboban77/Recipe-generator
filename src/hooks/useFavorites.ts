import { useState, useCallback, useEffect } from "react";
import { Recipe } from "../types";

const FAVORITES_STORAGE_KEY = "recipe-favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.warn("Failed to load favorites from localStorage");
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: Recipe[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.warn("Failed to save favorites to localStorage");
    }
  }, []);

  const addToFavorites = useCallback(
    (recipe: Recipe) => {
      setFavorites((prev) => {
        const isAlreadyFavorite = prev.some(
          (fav) => fav.title === recipe.title
        );
        if (isAlreadyFavorite) return prev;

        const newFavorites = [...prev, recipe];
        saveFavorites(newFavorites);
        return newFavorites;
      });
    },
    [saveFavorites]
  );

  const removeFromFavorites = useCallback(
    (recipeTitle: string) => {
      setFavorites((prev) => {
        const newFavorites = prev.filter((fav) => fav.title !== recipeTitle);
        saveFavorites(newFavorites);
        return newFavorites;
      });
    },
    [saveFavorites]
  );

  const isFavorite = useCallback(
    (recipeTitle: string) => {
      return favorites.some((fav) => fav.title === recipeTitle);
    },
    [favorites]
  );

  const clearAllFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearAllFavorites,
  };
};
