import { RecipeMatch } from "../types";
import { MOCK_RECIPES, MAX_RESULTS } from "../constants";

export class RecipeService {
  static async findMatchingRecipes(
    selectedIngredients: string[]
  ): Promise<RecipeMatch[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (selectedIngredients.length === 0) {
      return [];
    }

    const recipeMatches: RecipeMatch[] = MOCK_RECIPES.map((recipe) => {
      const matchedIngredients = recipe.ingredients.filter((ingredient) =>
        selectedIngredients.includes(ingredient)
      );

      const matchCount = matchedIngredients.length;

      const recipeCoverage = matchCount / recipe.ingredients.length;
      const userIngredientUsage = matchCount / selectedIngredients.length;
      const matchPercentage = Math.round(
        ((recipeCoverage + userIngredientUsage) / 2) * 100
      );

      return {
        ...recipe,
        matchCount,
        matchedIngredients,
        matchPercentage,
      };
    });

    const validMatches = recipeMatches.filter((match) => match.matchCount > 0);

    const sortedMatches = validMatches.sort((a, b) => {
      if (a.matchCount !== b.matchCount) {
        return b.matchCount - a.matchCount;
      }
      return b.matchPercentage - a.matchPercentage;
    });

    return sortedMatches.slice(0, MAX_RESULTS);
  }
}
