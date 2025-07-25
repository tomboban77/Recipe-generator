import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  RestaurantMenu as RestaurantIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { HeaderProps } from "../types";

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onThemeToggle,
}) => {
  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        background: "linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)",
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <RestaurantIcon sx={{ mr: 2, fontSize: 32 }} />
          <Box>
            <Typography variant="h5" component="h1" fontWeight={700}>
              Recipe Generator
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Discover recipes from your ingredients
            </Typography>
          </Box>
        </Box>

        <Chip
          label="✨ Smart Matching"
          size="small"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            fontWeight: 600,
            mr: 2,
            display: { xs: "none", sm: "flex" },
          }}
        />

        <Tooltip title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}>
          <IconButton
            onClick={onThemeToggle}
            color="inherit"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
