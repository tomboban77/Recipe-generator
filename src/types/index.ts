export interface Recipe {
  title: string;
  ingredients: string[];
  description: string;
  image?: string;
}

export interface RecipeMatch extends Recipe {
  matchCount: number;
  matchedIngredients: string[];
  matchPercentage: number;
}

export interface IngredientSelectorProps {
  selectedIngredients: string[];
  onIngredientToggle: (ingredient: string) => void;
  onClearAll: () => void;
  error?: string | null;
}

export interface RecipeResultsProps {
  results: RecipeMatch[];
  isLoading: boolean;
  selectedIngredients: string[];
  error: string | null;
}

export interface HeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}
