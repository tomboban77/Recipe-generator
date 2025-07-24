import { useState, useCallback } from "react";

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme-mode");
    return saved === "dark";
  });

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme-mode", newMode ? "dark" : "light");
      return newMode;
    });
  }, []);

  return {
    isDarkMode,
    toggleTheme,
  };
};
