export interface SpoonacularIngredient {
  id: number;
  name: string;
  image: string;
}

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  summary: string;
  extendedIngredients: Array<{
    id: number;
    name: string;
    original: string;
  }>;
}

export interface RecipeSearchResponse {
  results: SpoonacularRecipe[];
  totalResults: number;
}

export class SpoonacularService {
  private static readonly BASE_URL = process.env.REACT_APP_SPOONACULAR_API;
  private static readonly API_KEY =
    process.env.REACT_APP_SPOONACULAR_API_KEY || "";

  private static isConfigured(): boolean {
    return this.API_KEY.trim() !== "";
  }

  static async searchIngredients(
    query: string,
    limit: number = 10
  ): Promise<SpoonacularIngredient[]> {
    if (!query.trim() || !this.isConfigured()) return [];

    try {
      const response = await fetch(
        `${this.BASE_URL}/food/ingredients/search?apiKey=${this.API_KEY}&query=${encodeURIComponent(query)}&number=${limit}`
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid API key");
        }
        if (response.status === 402) {
          throw new Error("API quota exceeded");
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error searching ingredients:", error);
      throw error;
    }
  }

  static async searchRecipesByIngredients(
    ingredients: string[],
    limit: number = 12
  ): Promise<SpoonacularRecipe[]> {
    if (ingredients.length === 0 || !this.isConfigured()) return [];

    try {
      const ingredientsList = ingredients.join(",");
      const response = await fetch(
        `${this.BASE_URL}/recipes/findByIngredients?apiKey=${this.API_KEY}&ingredients=${encodeURIComponent(ingredientsList)}&number=${limit}&ranking=2&ignorePantry=true`
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid API key");
        }
        if (response.status === 402) {
          throw new Error("API quota exceeded");
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const recipes = await response.json();

      const transformedRecipes = recipes.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        summary: `A delicious recipe using ${recipe.usedIngredientCount} of your selected ingredients.`,
        extendedIngredients: [
          ...(recipe.usedIngredients || []).map((ing: any) => ({
            id: ing.id,
            name: ing.name,
            original: ing.original || ing.name,
          })),
          ...(recipe.missedIngredients || []).map((ing: any) => ({
            id: ing.id,
            name: ing.name,
            original: ing.original || ing.name,
          })),
        ],
        usedIngredientCount: recipe.usedIngredientCount || 0,
        missedIngredientCount: recipe.missedIngredientCount || 0,
        likes: recipe.likes || 0,
      }));

      return transformedRecipes;
    } catch (error) {
      console.error("Error searching recipes:", error);
      throw error;
    }
  }

  static async getPopularIngredients(
    limit: number = 20
  ): Promise<SpoonacularIngredient[]> {
    if (!this.isConfigured()) {
      return [];
    }

    const popularIngredientNames = [
      "chicken",
      "beef",
      "pork",
      "salmon",
      "shrimp",
      "tomato",
      "onion",
      "garlic",
      "bell pepper",
      "carrot",
      "potato",
      "broccoli",
      "spinach",
      "mushroom",
      "corn",
      "rice",
      "pasta",
      "cheese",
      "egg",
      "milk",
    ];

    try {
      const searchPromises = popularIngredientNames
        .slice(0, limit)
        .map((name) => this.searchIngredients(name, 1));

      const results = await Promise.all(searchPromises);
      return results
        .filter((result) => result.length > 0)
        .map((result) => result[0]);
    } catch (error) {
      console.error("Error fetching popular ingredients:", error);
      return [];
    }
  }
}
