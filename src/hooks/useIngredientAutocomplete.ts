import { useState, useEffect, useCallback, useRef } from "react";
import { SpoonacularService } from "../services/spoonacularService";
import { FALLBACK_INGREDIENTS } from "../constants";

export interface IngredientSuggestion {
  id: string;
  name: string;
  category?: string;
}

export const useIngredientAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState(true);

  const currentQueryRef = useRef(query);
  currentQueryRef.current = query;

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setError(null);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      if (currentQueryRef.current !== query) return;

      try {
        setIsLoading(true);
        setError(null);

        let results: IngredientSuggestion[] = [];

        if (isApiAvailable) {
          try {
            const apiIngredients = await SpoonacularService.searchIngredients(
              query,
              8
            );
            results = apiIngredients.map((ing) => ({
              id: ing.id.toString(),
              name: ing.name,
              category: "API Result",
            }));
            setIsApiAvailable(true);
          } catch (apiError: any) {
            console.error("API search failed:", apiError);
            setIsApiAvailable(false);

            if (
              apiError.message?.includes("API key") ||
              apiError.message?.includes("quota")
            ) {
              setError(apiError.message);
            }

            results = searchFallbackIngredients(query);
          }
        } else {
          results = searchFallbackIngredients(query);
        }

        if (currentQueryRef.current === query) {
          setSuggestions(results);
        }
      } catch (err: any) {
        console.error("Search error:", err);
        if (currentQueryRef.current === query) {
          setError("Search failed");
          setSuggestions(searchFallbackIngredients(query));
        }
      } finally {
        if (currentQueryRef.current === query) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, isApiAvailable]);

  const searchFallbackIngredients = useCallback(
    (searchQuery: string): IngredientSuggestion[] => {
      const queryLower = searchQuery.toLowerCase();
      return FALLBACK_INGREDIENTS.filter((ingredient) =>
        ingredient.toLowerCase().includes(queryLower)
      )
        .slice(0, 8)
        .map((name, index) => ({
          id: `fallback-${index}-${name}`,
          name,
          category: "Common Ingredient",
        }));
    },
    []
  );

  const clearQuery = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setError(null);
  }, []);

  const retryApiSearch = useCallback(() => {
    setIsApiAvailable(true);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    isApiAvailable,
    clearQuery,
    retryApiSearch,
  };
};
