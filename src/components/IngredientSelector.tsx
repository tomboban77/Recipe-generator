import React from "react";

import {
  Box,
  Typography,
  Paper,
  Chip,
  Alert,
  Fade,
  Tooltip,
  TextField,
  IconButton,
  InputAdornment,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  RestaurantMenu as RestaurantIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  GridView as GridIcon,
} from "@mui/icons-material";
import { IngredientSelectorProps } from "../types";
import { AVAILABLE_INGREDIENTS, MAX_INGREDIENTS } from "../constants";
import { useIngredientSearch } from "../hooks/useIngredientSearch";

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  selectedIngredients,
  onIngredientToggle,
  onClearAll,
  error,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearchMode,
    toggleSearchMode,
    clearSearch,
  } = useIngredientSearch();

  const isSelected = (ingredient: string) =>
    selectedIngredients.includes(ingredient);
  const isMaxReached = selectedIngredients.length >= MAX_INGREDIENTS;

  const ingredientsToShow = isSearchMode
    ? searchResults.map((item) => item.name)
    : AVAILABLE_INGREDIENTS;

  const hasError = isMaxReached || Boolean(error);

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <RestaurantIcon color="primary" />
        <Typography variant="h5" component="h2" fontWeight={600}>
          Select Your Ingredients
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Choose up to {MAX_INGREDIENTS} ingredients to find matching recipes
      </Typography>

      {hasError && (
        <Fade in={hasError}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error ||
              `Maximum ${MAX_INGREDIENTS} ingredients allowed. Remove some to add others.`}
          </Alert>
        </Fade>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="body2" color="text.secondary">
          Selected: {selectedIngredients.length}/{MAX_INGREDIENTS}
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <FormControlLabel
            control={
              <Switch
                checked={isSearchMode}
                onChange={toggleSearchMode}
                size="small"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={0.5}>
                {isSearchMode ? (
                  <SearchIcon fontSize="small" />
                ) : (
                  <GridIcon fontSize="small" />
                )}
                <Typography variant="caption">
                  {isSearchMode ? "Search" : "Grid"}
                </Typography>
              </Box>
            }
          />

          {selectedIngredients.length > 0 && (
            <Chip
              label="Clear All"
              variant="outlined"
              size="small"
              onClick={onClearAll}
              color="secondary"
            />
          )}
        </Box>
      </Box>

      {isSearchMode && (
        <Box mb={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 1,
        }}
      >
        {ingredientsToShow.map((ingredient) => {
          const selected = isSelected(ingredient);
          const disabled = !selected && isMaxReached;

          return (
            <Tooltip
              key={ingredient}
              title={disabled ? "Maximum ingredients reached" : ""}
              arrow
            >
              <span style={{ width: "100%", display: "block" }}>
                <Chip
                  label={ingredient}
                  onClick={() => !disabled && onIngredientToggle(ingredient)}
                  color={selected ? "primary" : "default"}
                  variant={selected ? "filled" : "outlined"}
                  icon={selected ? <CheckIcon /> : <AddIcon />}
                  disabled={disabled}
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    transition: "all 0.2s ease-in-out",
                    cursor: disabled ? "not-allowed" : "pointer",
                    "&:hover": !disabled
                      ? {
                          transform: "translateY(-2px)",
                          boxShadow: 2,
                        }
                      : undefined,
                  }}
                />
              </span>
            </Tooltip>
          );
        })}
      </Box>

      {isSearchMode && ingredientsToShow.length === 0 && (
        <Box textAlign="center" py={2}>
          <Typography variant="body2" color="text.secondary">
            No ingredients found for "{searchQuery}"
          </Typography>
        </Box>
      )}

      {selectedIngredients.length > 0 && (
        <Fade in timeout={300}>
          <Box mt={3}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Ingredients:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {selectedIngredients.map((ingredient) => (
                <Chip
                  key={ingredient}
                  label={ingredient}
                  onDelete={() => onIngredientToggle(ingredient)}
                  color="primary"
                  size="small"
                  sx={{
                    "& .MuiChip-deleteIcon": {
                      color: "inherit",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Fade>
      )}
    </Paper>
  );
};
