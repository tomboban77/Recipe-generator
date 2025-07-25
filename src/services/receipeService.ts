import { RecipeMatch, Recipe } from "../types";
import { SpoonacularService } from "./spoonacularService";

const FALLBACK_RECIPES: Recipe[] = [
  {
    title: "Chicken Fried Rice",
    description: "A quick and delicious fried rice with chicken and vegetables",
    ingredients: ["chicken", "rice", "egg", "onion", "garlic", "soy sauce"],
  },
  {
    title: "Pasta with Tomato Sauce",
    description: "Classic pasta with a rich tomato sauce and herbs",
    ingredients: ["pasta", "tomato", "garlic", "onion", "basil", "olive oil"],
  },
  {
    title: "Beef Stir Fry",
    description: "Quick beef stir fry with colorful vegetables",
    ingredients: [
      "beef",
      "bell pepper",
      "broccoli",
      "onion",
      "garlic",
      "soy sauce",
    ],
  },
  {
    title: "Cheese Omelet",
    description: "Fluffy omelet filled with melted cheese",
    ingredients: ["egg", "cheese", "butter", "salt", "pepper"],
  },
  {
    title: "Mushroom Risotto",
    description: "Creamy risotto with fresh mushrooms and herbs",
    ingredients: ["rice", "mushroom", "onion", "garlic", "cheese", "butter"],
  },
];

export class RecipeService {
  static async findMatchingRecipes(
    selectedIngredients: string[]
  ): Promise<RecipeMatch[]> {
    if (selectedIngredients.length === 0) {
      return [];
    }

    try {
      const spoonacularRecipes =
        await SpoonacularService.searchRecipesByIngredients(
          selectedIngredients,
          9
        );

      if (spoonacularRecipes.length === 0) {
        return this.searchFallbackRecipes(selectedIngredients);
      }

      const recipeMatches: RecipeMatch[] = spoonacularRecipes.map((recipe) => {
        const recipeIngredients = recipe.extendedIngredients.map((ing) =>
          ing.name.toLowerCase()
        );
        const selectedLower = selectedIngredients.map((ing) =>
          ing.toLowerCase()
        );

        const matchedIngredients = recipeIngredients.filter((ingredient) =>
          selectedLower.some(
            (selected) =>
              ingredient.includes(selected) || selected.includes(ingredient)
          )
        );

        const matchCount = matchedIngredients.length;
        const totalIngredients = recipeIngredients.length || 1;
        const recipeCoverage = matchCount / totalIngredients;
        const userIngredientUsage = matchCount / selectedIngredients.length;
        const matchPercentage = Math.round(
          (recipeCoverage * 0.6 + userIngredientUsage * 0.4) * 100
        );

        const convertedRecipe: Recipe = {
          title: recipe.title,
          description: recipe.summary
            ? recipe.summary.replace(/<[^>]*>/g, "").substring(0, 150) + "..."
            : "Delicious recipe made with your selected ingredients",
          ingredients: recipeIngredients,
          image: recipe.image,
        };

        return {
          ...convertedRecipe,
          matchCount,
          matchedIngredients: matchedIngredients,
          matchPercentage: Math.max(matchPercentage, 1),
        };
      });

      const validMatches = recipeMatches.filter(
        (match) => match.matchCount > 0
      );

      const sortedMatches = validMatches.sort((a, b) => {
        if (a.matchCount !== b.matchCount) {
          return b.matchCount - a.matchCount;
        }
        return b.matchPercentage - a.matchPercentage;
      });

      return sortedMatches.slice(0, 9);
    } catch (error) {
      console.error(
        "Error searching recipes via API, falling back to static data:",
        error
      );
      return this.searchFallbackRecipes(selectedIngredients);
    }
  }

  private static searchFallbackRecipes(
    selectedIngredients: string[]
  ): RecipeMatch[] {
    const selectedLower = selectedIngredients.map((ing) => ing.toLowerCase());

    const recipeMatches: RecipeMatch[] = FALLBACK_RECIPES.map((recipe) => {
      const matchedIngredients = recipe.ingredients.filter((ingredient) =>
        selectedLower.includes(ingredient.toLowerCase())
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

    return validMatches.sort((a, b) => {
      if (a.matchCount !== b.matchCount) {
        return b.matchCount - a.matchCount;
      }
      return b.matchPercentage - a.matchPercentage;
    });
  }
}
