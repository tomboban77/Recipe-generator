import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  Fab,
  Badge,
  Divider,
  Button,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  ClearAll as ClearAllIcon,
} from "@mui/icons-material";
import { Recipe } from "../types";

interface FavoritesPanelProps {
  favorites: Recipe[];
  onRemoveFromFavorites: (title: string) => void;
  onClearAllFavorites: () => void;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  favorites,
  onRemoveFromFavorites,
  onClearAllFavorites,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <>
      <Fab
        color="secondary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={toggleDrawer}
      >
        <Badge badgeContent={favorites.length} color="error" max={99}>
          <FavoriteIcon />
        </Badge>
      </Fab>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 400 } },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600}>
              Favorite Recipes ({favorites.length})
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          {favorites.length === 0 ? (
            <Box textAlign="center" py={4}>
              <FavoriteBorderIcon
                sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No favorite recipes yet
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Heart recipes to save them here!
              </Typography>
            </Box>
          ) : (
            <>
              <Box mb={2}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<ClearAllIcon />}
                  onClick={onClearAllFavorites}
                  fullWidth
                >
                  Clear All Favorites
                </Button>
              </Box>

              <List sx={{ p: 0 }}>
                {favorites.map((recipe, index) => (
                  <React.Fragment key={recipe.title}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <Card elevation={1} sx={{ width: "100%" }}>
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            mb={1}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              sx={{ flex: 1 }}
                            >
                              {recipe.title}
                            </Typography>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                onRemoveFromFavorites(recipe.title)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            paragraph
                            sx={{ mb: 1 }}
                          >
                            {recipe.description}
                          </Typography>

                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {recipe.ingredients
                              .slice(0, 3)
                              .map((ingredient) => (
                                <Chip
                                  key={ingredient}
                                  label={ingredient}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: "0.7rem" }}
                                />
                              ))}
                            {recipe.ingredients.length > 3 && (
                              <Chip
                                label={`+${recipe.ingredients.length - 3} more`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem" }}
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </ListItem>
                    {index < favorites.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

interface FavoriteButtonProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <IconButton
      onClick={() => onToggleFavorite(recipe)}
      color={isFavorite ? "error" : "default"}
      size="small"
      sx={{
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  );
};
