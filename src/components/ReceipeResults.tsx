import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Fade,
  Divider,
  Skeleton,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  TrendingUp as TrendingIcon,
  SearchOff as SearchOffIcon,
  LocalDining as DiningIcon,
  ImageNotSupported as NoImageIcon,
} from "@mui/icons-material";
import { RecipeResultsProps, RecipeMatch, Recipe } from "../types";
import { FavoriteButton } from "./FavoritePanel";

interface RecipeCardProps {
  recipe: RecipeMatch;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  index,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const getRankBadgeColor = (
    rank: number
  ): "primary" | "secondary" | "success" => {
    switch (rank) {
      case 0:
        return "primary";
      case 1:
        return "secondary";
      case 2:
        return "success";
      default:
        return "primary";
    }
  };

  const getRankLabel = (rank: number): string => {
    switch (rank) {
      case 0:
        return "🥇 Best Match";
      case 1:
        return "🥈 Great Match";
      case 2:
        return "🥉 Good Match";
      default:
        return "Match";
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const hasImage = recipe.image && !recipe.image.includes("fallback");

  return (
    <Fade in timeout={300 + index * 100}>
      <Card
        elevation={3}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
          overflow: "hidden",
        }}
      >
        {hasImage && (
          <Box
            sx={{
              position: "relative",
              height: 200,
              overflow: "hidden",
            }}
          >
            {imageLoading && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                animation="wave"
              />
            )}

            {!imageError ? (
              <CardMedia
                component="img"
                height="200"
                image={recipe.image}
                alt={recipe.title}
                onLoad={handleImageLoad}
                onError={handleImageError}
                sx={{
                  display: imageLoading ? "none" : "block",
                  objectFit: "cover",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            ) : (
              <Box
                sx={{
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "grey.100",
                  color: "grey.500",
                }}
              >
                <NoImageIcon sx={{ fontSize: 48 }} />
              </Box>
            )}

            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                right: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Chip
                label={getRankLabel(index)}
                color={getRankBadgeColor(index)}
                size="small"
                sx={{
                  fontWeight: 600,
                  backdropFilter: "blur(4px)",
                }}
              />

              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(4px)",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {onToggleFavorite && (
                  <FavoriteButton
                    recipe={recipe}
                    isFavorite={isFavorite}
                    onToggleFavorite={onToggleFavorite}
                  />
                )}
                <Box textAlign="right">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Match
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight={700}
                    sx={{ fontSize: "1rem", lineHeight: 1 }}
                  >
                    {recipe.matchPercentage}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {!hasImage && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={2}
            >
              <Chip
                label={getRankLabel(index)}
                color={getRankBadgeColor(index)}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Box display="flex" alignItems="center" gap={1}>
                {onToggleFavorite && (
                  <FavoriteButton
                    recipe={recipe}
                    isFavorite={isFavorite}
                    onToggleFavorite={onToggleFavorite}
                  />
                )}
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary">
                    Match Score
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight={700}>
                    {recipe.matchPercentage}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
            {recipe.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            {recipe.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <DiningIcon fontSize="small" color="primary" />
            Recipe Ingredients ({recipe.ingredients.length})
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
            {recipe.ingredients.slice(0, 8).map((ingredient) => {
              const isMatched = recipe.matchedIngredients.includes(ingredient);
              return (
                <Chip
                  key={ingredient}
                  label={ingredient}
                  size="small"
                  variant={isMatched ? "filled" : "outlined"}
                  color={isMatched ? "success" : "default"}
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: isMatched ? 600 : 400,
                  }}
                />
              );
            })}
            {recipe.ingredients.length > 8 && (
              <Chip
                label={`+${recipe.ingredients.length - 8} more`}
                size="small"
                variant="outlined"
                color="default"
                sx={{ fontSize: "0.75rem" }}
              />
            )}
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Ingredient Match: {recipe.matchCount}/{recipe.ingredients.length}{" "}
              ingredients
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(recipe.matchCount / recipe.ingredients.length) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

interface EnhancedRecipeResultsProps extends RecipeResultsProps {
  isFavorite?: (title: string) => boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
}

export const RecipeResults: React.FC<EnhancedRecipeResultsProps> = ({
  results,
  isLoading,
  selectedIngredients,
  error,
  isFavorite,
  onToggleFavorite,
}) => {
  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={4}>
        <CircularProgress size={48} sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Finding perfect recipes for you...
        </Typography>
      </Box>
    );
  }

  if (selectedIngredients.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <RestaurantIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Select ingredients to discover amazing recipes
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Choose from the ingredients above to get personalized recipe
          recommendations
        </Typography>
      </Box>
    );
  }

  if (error && !isLoading) {
    return (
      <Alert
        severity="info"
        icon={<SearchOffIcon />}
        sx={{
          textAlign: "center",
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
      >
        <Typography variant="body1" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try selecting different ingredients or adding more to your selection
        </Typography>
      </Alert>
    );
  }

  if (results.length > 0) {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <TrendingIcon color="primary" />
          <Typography variant="h5" component="h2" fontWeight={600}>
            Top Recipe Matches
          </Typography>
          <Chip
            label={`${results.length} found`}
            color="primary"
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Recipes ranked by ingredient compatibility and match percentage
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {results.map((recipe, index) => (
            <RecipeCard
              key={recipe.title}
              recipe={recipe}
              index={index}
              isFavorite={isFavorite ? isFavorite(recipe.title) : false}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </Box>

        <Box
          mt={4}
          p={2}
          bgcolor="background.paper"
          borderRadius={2}
          border={1}
          borderColor="divider"
        >
          <Typography variant="caption" color="text.secondary" display="block">
            💡 <strong>Pro tip:</strong> Try different ingredient combinations
            to discover new recipes. Heart your favorites to save them for
            later!
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
};
