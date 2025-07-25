import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Container, Box } from "@mui/material";
import { useTheme } from "./hooks/useTheme";
import { useFavorites } from "./hooks/useFavorites";
import { getTheme } from "./theme/theme";
import { Header } from "./components/Header";
import { IngredientSelector } from "./components/IngredientSelector";
import { Recipe } from "./types";
import { useRecipeSearch } from "./hooks/useReceipeSearch";
import { RecipeResults } from "./components/ReceipeResults";
import { FavoritesPanel } from "./components/FavoritePanel";
import { MAX_INGREDIENTS } from "./constants";

const App: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientError, setIngredientError] = useState<string | null>(null);
  const { results, isLoading, error, searchRecipes } = useRecipeSearch();

  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearAllFavorites,
  } = useFavorites();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchRecipes(selectedIngredients);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedIngredients, searchRecipes]);

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(ingredient)) {
        setIngredientError(null);
        return prev.filter((item) => item !== ingredient);
      } else {
        if (prev.length >= MAX_INGREDIENTS) {
          setIngredientError(`Maximum ${MAX_INGREDIENTS} ingredients allowed`);
          setTimeout(() => setIngredientError(null), 3000);
          return prev;
        }
        setIngredientError(null);
        return [...prev, ingredient];
      }
    });
  };

  const handleClearAll = () => {
    setSelectedIngredients([]);
    setIngredientError(null);
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    if (isFavorite(recipe.title)) {
      removeFromFavorites(recipe.title);
    } else {
      addToFavorites(recipe);
    }
  };

  return (
    <ThemeProvider theme={getTheme(isDarkMode)}>
      <CssBaseline />
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />

        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
          <IngredientSelector
            selectedIngredients={selectedIngredients}
            onIngredientToggle={handleIngredientToggle}
            onClearAll={handleClearAll}
            error={ingredientError}
          />

          <RecipeResults
            results={results}
            isLoading={isLoading}
            selectedIngredients={selectedIngredients}
            error={error}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
          />
        </Container>

        <FavoritesPanel
          favorites={favorites}
          onRemoveFromFavorites={removeFromFavorites}
          onClearAllFavorites={clearAllFavorites}
        />
      </Box>
    </ThemeProvider>
  );
};

export default App;
