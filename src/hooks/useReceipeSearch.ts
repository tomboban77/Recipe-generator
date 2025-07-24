import { useState, useCallback } from "react";
import { RecipeMatch } from "../types";
import { RecipeService } from "../services/receipeService";

export const useRecipeSearch = () => {
  const [results, setResults] = useState<RecipeMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRecipes = useCallback(async (ingredients: string[]) => {
    if (ingredients.length === 0) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults =
        await RecipeService.findMatchingRecipes(ingredients);
      setResults(searchResults);

      if (searchResults.length === 0) {
        setError("No recipes found with selected ingredients");
      }
    } catch (err) {
      setError("Failed to search recipes. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    results,
    isLoading,
    error,
    searchRecipes,
  };
};
