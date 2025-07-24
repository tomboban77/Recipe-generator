import { useState, useCallback, useMemo } from "react";

export interface IngredientSearchResult {
  id: string;
  name: string;
  category?: string;
}

const EXPANDED_INGREDIENTS: IngredientSearchResult[] = [
  { id: "1", name: "Chicken", category: "Protein" },
  { id: "2", name: "Rice", category: "Grain" },
  { id: "3", name: "Tomato", category: "Vegetable" },
  { id: "4", name: "Onion", category: "Vegetable" },
  { id: "5", name: "Garlic", category: "Vegetable" },
  { id: "6", name: "Pasta", category: "Grain" },
  { id: "7", name: "Cheese", category: "Dairy" },
  { id: "8", name: "Spinach", category: "Vegetable" },
  { id: "9", name: "Mushroom", category: "Vegetable" },
  { id: "10", name: "Egg", category: "Protein" },

  { id: "11", name: "Bell Pepper", category: "Vegetable" },
  { id: "12", name: "Carrot", category: "Vegetable" },
  { id: "13", name: "Broccoli", category: "Vegetable" },
  { id: "14", name: "Potato", category: "Vegetable" },
  { id: "15", name: "Beef", category: "Protein" },
  { id: "16", name: "Salmon", category: "Protein" },
  { id: "17", name: "Beans", category: "Legume" },
  { id: "18", name: "Corn", category: "Vegetable" },
  { id: "19", name: "Lemon", category: "Fruit" },
  { id: "20", name: "Olive Oil", category: "Oil" },
  { id: "21", name: "Butter", category: "Dairy" },
  { id: "22", name: "Milk", category: "Dairy" },
  { id: "23", name: "Basil", category: "Herb" },
  { id: "24", name: "Oregano", category: "Herb" },
  { id: "25", name: "Salt", category: "Seasoning" },
  { id: "26", name: "Black Pepper", category: "Seasoning" },
  { id: "27", name: "Flour", category: "Baking" },
  { id: "28", name: "Sugar", category: "Baking" },
  { id: "29", name: "Bread", category: "Grain" },
  { id: "30", name: "Avocado", category: "Fruit" },
];

export const useIngredientSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return EXPANDED_INGREDIENTS.slice(0, 10);

    const query = searchQuery.toLowerCase();
    return EXPANDED_INGREDIENTS.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(query) ||
        ingredient.category?.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [searchQuery]);

  const toggleSearchMode = useCallback(() => {
    setIsSearchMode((prev) => !prev);
    if (isSearchMode) {
      setSearchQuery("");
    }
  }, [isSearchMode]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearchMode,
    toggleSearchMode,
    clearSearch,
    allIngredients: EXPANDED_INGREDIENTS,
  };
};
