import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useIngredientAutocomplete } from "../hooks/useIngredientAutocomplete";

interface IngredientAutocompleteProps {
  selectedIngredients: string[];
  onIngredientSelect: (ingredient: string) => void;
  maxIngredients: number;
  placeholder?: string;
}

export const IngredientAutocomplete: React.FC<IngredientAutocompleteProps> = ({
  selectedIngredients,
  onIngredientSelect,
  maxIngredients,
  placeholder = "Search for ingredients...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { query, setQuery, suggestions, isLoading, error, clearQuery } =
    useIngredientAutocomplete();

  const isSelected = (ingredient: string) =>
    selectedIngredients.includes(ingredient);
  const isMaxReached = selectedIngredients.length >= maxIngredients;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
          handleSelectIngredient(suggestions[focusedIndex].name);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectIngredient = (ingredient: string) => {
    if (!isSelected(ingredient) && !isMaxReached) {
      onIngredientSelect(ingredient);
      setQuery("");
      setIsOpen(false);
      setFocusedIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setIsOpen(value.trim().length > 0);
    setFocusedIndex(-1);
  };

  const handleInputFocus = () => {
    if (query.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setFocusedIndex(-1);
    }, 150);
  };

  const handleClear = () => {
    clearQuery();
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[
        focusedIndex
      ] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [focusedIndex]);

  return (
    <Box position="relative">
      <TextField
        ref={inputRef}
        fullWidth
        size="small"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        disabled={isMaxReached}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isLoading ? (
                <CircularProgress size={16} />
              ) : (
                <SearchIcon color="action" fontSize="small" />
              )}
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderBottomLeftRadius: isOpen ? 0 : undefined,
            borderBottomRightRadius: isOpen ? 0 : undefined,
          },
        }}
      />

      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1300,
            maxHeight: 300,
            overflow: "hidden",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderTop: "none",
          }}
        >
          {isLoading ? (
            <Box p={2} textAlign="center">
              <CircularProgress size={20} />
              <Typography variant="caption" display="block" mt={1}>
                Searching ingredients...
              </Typography>
            </Box>
          ) : error ? (
            <Box p={2} textAlign="center">
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            </Box>
          ) : suggestions.length > 0 ? (
            <List
              ref={listRef}
              dense
              sx={{
                maxHeight: 250,
                overflow: "auto",
                py: 0,
              }}
            >
              {suggestions.map((ingredient, index) => {
                const selected = isSelected(ingredient.name);
                const disabled = !selected && isMaxReached;
                const focused = index === focusedIndex;

                return (
                  <ListItem
                    key={ingredient.id}
                    disablePadding
                    sx={{
                      backgroundColor: focused ? "action.hover" : "transparent",
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleSelectIngredient(ingredient.name)}
                      disabled={disabled}
                      sx={{
                        minHeight: 48,
                        px: 2,
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        width="100%"
                      >
                        {selected ? (
                          <CheckIcon fontSize="small" color="primary" />
                        ) : (
                          <AddIcon
                            fontSize="small"
                            color={disabled ? "disabled" : "action"}
                          />
                        )}
                        <ListItemText
                          primary={ingredient.name}
                          secondary={ingredient.category}
                          primaryTypographyProps={{
                            fontWeight: selected ? 600 : 400,
                            color: selected ? "primary" : "inherit",
                          }}
                        />
                        {selected && (
                          <Chip
                            label="Selected"
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        {disabled && !selected && (
                          <Chip
                            label="Max reached"
                            size="small"
                            color="default"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          ) : query.trim() ? (
            <Box p={2} textAlign="center">
              <Typography variant="caption" color="text.secondary">
                No ingredients found for "{query}"
              </Typography>
            </Box>
          ) : null}
        </Paper>
      )}
    </Box>
  );
};
