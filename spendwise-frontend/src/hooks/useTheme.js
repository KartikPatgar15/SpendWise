// src/hooks/useTheme.js
// Extracts theme state into a reactive hook that syncs across all pages and sets body background.

import { useState, useEffect, useCallback } from "react";
import { THEMES } from "../config/themeConfig";

const THEME_EVENT = "spendwise_theme_change";

export function useTheme() {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "theme" && e.newValue) {
        setThemeState(e.newValue);
      }
    };
    const handleCustom = (e) => {
      if (e.detail) {
        setThemeState(e.detail);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(THEME_EVENT, handleCustom);

    // Apply body background
    const bgMap = {
      dark: "#080D12",
      light: "#EAEFE8",
      grey: "#09090b",
    };
    document.body.style.backgroundColor = bgMap[theme] || "#080D12";
    document.documentElement.style.backgroundColor = bgMap[theme] || "#080D12";

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(THEME_EVENT, handleCustom);
    };
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: newTheme }));
  }, []);

  const tokens = THEMES[theme] || THEMES.dark;

  return { theme, setTheme, tokens };
}