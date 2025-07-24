import { createTheme } from "@mui/material/styles";

export const getTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#2E7D32",
        light: "#4CAF50",
        dark: "#1B5E20",
      },
      secondary: {
        main: "#FF6F00",
        light: "#FFB74D",
        dark: "#E65100",
      },
      background: {
        default: isDarkMode ? "#121212" : "#f8f9fa",
        paper: isDarkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            transition: "all 0.2s ease-in-out",
          },
        },
      },
    },
  });
