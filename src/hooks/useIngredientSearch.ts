import { useState, useCallback, useMemo, useEffect } from "react";
import { SpoonacularService } from "../services/spoonacularService";
import { FALLBACK_INGREDIENTS } from "../constants";

export interface IngredientSearchResult {
  id: string;
  name: string;
  category?: string;
}

export const useIngredientSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<IngredientSearchResult[]>(
    []
  );
  const [popularIngredients, setPopularIngredients] = useState<
    IngredientSearchResult[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState(true);

  useEffect(() => {
    const loadPopularIngredients = () => {
      setIsLoading(true);

      const fallbackIngredients = FALLBACK_INGREDIENTS.map((name, index) => ({
        id: `static-${index}`,
        name,
        category: "Popular",
      }));

      setPopularIngredients(fallbackIngredients);
      setIsApiAvailable(true);
      setIsLoading(false);
    };

    loadPopularIngredients();
  }, []);

  useEffect(() => {
    if (!isSearchMode || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const ingredients = await SpoonacularService.searchIngredients(
          searchQuery,
          10
        );

        if (ingredients.length > 0) {
          const formattedResults = ingredients.map((ing) => ({
            id: ing.id.toString(),
            name: ing.name,
            category: "Search Result",
          }));
          setSearchResults(formattedResults);
          setIsApiAvailable(true);
        } else {
          throw new Error("No results from API");
        }
      } catch (err: any) {
        console.error("Search failed:", err);
        setIsApiAvailable(false);

        if (
          err.message?.includes("API key") ||
          err.message?.includes("quota")
        ) {
          setError(err.message);
        } else {
          setError("API search failed, using basic search");
        }

        const query = searchQuery.toLowerCase();
        const fallbackResults = FALLBACK_INGREDIENTS.filter((ingredient) =>
          ingredient.toLowerCase().includes(query)
        )
          .slice(0, 8)
          .map((name, index) => ({
            id: `search-${index}`,
            name,
            category: "Search Result",
          }));
        setSearchResults(fallbackResults);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, isSearchMode]);

  const ingredientsToShow = useMemo(() => {
    if (isSearchMode) {
      return searchQuery.trim() ? searchResults : [];
    }
    return popularIngredients;
  }, [isSearchMode, searchQuery, searchResults, popularIngredients]);

  const toggleSearchMode = useCallback(() => {
    setIsSearchMode((prev) => !prev);
    if (isSearchMode) {
      setSearchQuery("");
      setSearchResults([]);
      setError(null);
    }
  }, [isSearchMode]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults: ingredientsToShow,
    isSearchMode,
    toggleSearchMode,
    clearSearch,
    isLoading,
    error,
    isApiAvailable,
    allIngredients: popularIngredients,
  };
};
