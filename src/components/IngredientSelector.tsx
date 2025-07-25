import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Alert,
  Fade,
  Tooltip,
  Tabs,
  Tab,
  Skeleton,
} from "@mui/material";
import {
  RestaurantMenu as RestaurantIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Search as SearchIcon,
  GridView as GridIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { IngredientSelectorProps } from "../types";
import { MAX_INGREDIENTS } from "../constants";
import { useIngredientSearch } from "../hooks/useIngredientSearch";
import { IngredientAutocomplete } from "./IngredientAutoComplete";

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  selectedIngredients,
  onIngredientToggle,
  onClearAll,
  error,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const {
    searchResults,
    isSearchMode,
    toggleSearchMode,
    isLoading,
    error: searchError,
    isApiAvailable,
  } = useIngredientSearch();

  const isSelected = (ingredient: string) =>
    selectedIngredients.includes(ingredient);
  const isMaxReached = selectedIngredients.length >= MAX_INGREDIENTS;

  const ingredientsToShow = searchResults.map((item) => item.name);
  const hasError = isMaxReached || Boolean(error) || Boolean(searchError);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 1 && !isSearchMode) {
      toggleSearchMode();
    } else if (newValue === 0 && isSearchMode) {
      toggleSearchMode();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <RestaurantIcon color="primary" />
        <Typography variant="h5" component="h2" fontWeight={600}>
          Select Your Ingredients
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Choose up to {MAX_INGREDIENTS} ingredients to find matching recipes
      </Typography>

      {hasError && (
        <Fade in={hasError}>
          <Alert
            severity={searchError ? "error" : "warning"}
            sx={{ mb: 3 }}
            icon={searchError ? <WarningIcon /> : undefined}
          >
            {searchError ||
              error ||
              `Maximum ${MAX_INGREDIENTS} ingredients allowed. Remove some to add others.`}
          </Alert>
        </Fade>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        p={2}
        sx={{
          backgroundColor: "action.hover",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={600} color="primary">
            Selected: {selectedIngredients.length}/{MAX_INGREDIENTS}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {MAX_INGREDIENTS - selectedIngredients.length} more available
          </Typography>
        </Box>

        {selectedIngredients.length > 0 && (
          <Chip
            label="Clear All"
            variant="outlined"
            size="small"
            onClick={onClearAll}
            color="secondary"
            sx={{
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "error.main",
                color: "white",
                borderColor: "error.main",
              },
            }}
          />
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="ingredient selection tabs"
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
            },
          }}
        >
          <Tab
            icon={<TrendingIcon />}
            iconPosition="start"
            label="Popular Ingredients"
            sx={{ gap: 1 }}
          />
          <Tab
            icon={<SearchIcon />}
            iconPosition="start"
            label="Search All Ingredients"
            sx={{ gap: 1 }}
          />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TrendingIcon fontSize="small" color="primary" />
              <Typography variant="subtitle1" fontWeight={600}>
                Most Popular Ingredients
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" mb={3}>
              Quick selection from commonly used ingredients
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 1.5,
                minHeight: "120px",
              }}
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    height={40}
                    sx={{ borderRadius: 3 }}
                  />
                ))
              ) : ingredientsToShow.length > 0 ? (
                ingredientsToShow.map((ingredient) => {
                  const selected = isSelected(ingredient);
                  const disabled = !selected && isMaxReached;

                  return (
                    <Tooltip
                      key={ingredient}
                      title={
                        disabled
                          ? "Maximum ingredients reached"
                          : selected
                            ? "Click to remove"
                            : "Click to add"
                      }
                      arrow
                    >
                      <span style={{ width: "100%" }}>
                        <Chip
                          label={ingredient}
                          onClick={() =>
                            !disabled && onIngredientToggle(ingredient)
                          }
                          color={selected ? "primary" : "default"}
                          variant={selected ? "filled" : "outlined"}
                          icon={selected ? <CheckIcon /> : <AddIcon />}
                          disabled={disabled}
                          sx={{
                            width: "100%",
                            height: 40,
                            justifyContent: "flex-start",
                            fontSize: "0.875rem",
                            fontWeight: selected ? 600 : 500,
                            transition: "all 0.3s ease-in-out",
                            cursor: disabled ? "not-allowed" : "pointer",
                            "&:hover": !disabled
                              ? {
                                  transform: "translateY(-2px)",
                                  boxShadow: 3,
                                  borderColor: "primary.main",
                                }
                              : undefined,
                          }}
                        />
                      </span>
                    </Tooltip>
                  );
                })
              ) : (
                <Box gridColumn="1 / -1" textAlign="center" py={4}>
                  <GridIcon
                    sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No popular ingredients available
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Box role="tabpanel" hidden={activeTab !== 1}>
        {activeTab === 1 && (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SearchIcon fontSize="small" color="primary" />
              <Typography variant="subtitle1" fontWeight={600}>
                Search Ingredients
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" mb={3}>
              Find any ingredient from our extensive database
            </Typography>

            <Box mb={3}>
              <IngredientAutocomplete
                selectedIngredients={selectedIngredients}
                onIngredientSelect={onIngredientToggle}
                maxIngredients={MAX_INGREDIENTS}
                placeholder="Type to search ingredients (e.g., chicken, tomatoes, basil)..."
              />
            </Box>

            <Box
              sx={{
                backgroundColor: "primary.50",
                borderRadius: 2,
                p: 2,
                border: "1px solid",
                borderColor: "primary.200",
              }}
            >
              <Typography variant="body2" color="primary.dark">
                💡 <strong>Pro tip:</strong>{" "}
                {isApiAvailable
                  ? "Try searching for specific ingredients like 'bell pepper', 'chicken breast', or 'fresh basil'"
                  : "API unavailable - using basic search functionality"}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {selectedIngredients.length > 0 && (
        <Fade in timeout={300}>
          <Box
            mt={4}
            p={3}
            sx={{
              backgroundColor: "success.50",
              borderRadius: 3,
              border: "2px solid",
              borderColor: "success.200",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              color="success.dark"
            >
              ✅ Your Selected Ingredients ({selectedIngredients.length})
            </Typography>
            <Typography variant="body2" color="success.dark" mb={2}>
              Ready to find matching recipes!
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {selectedIngredients.map((ingredient) => (
                <Chip
                  key={ingredient}
                  label={ingredient}
                  onDelete={() => onIngredientToggle(ingredient)}
                  color="success"
                  variant="filled"
                  size="medium"
                  sx={{
                    fontWeight: 600,
                    "& .MuiChip-deleteIcon": {
                      color: "inherit",
                    },
                    "&:hover": {
                      backgroundColor: "success.dark",
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
