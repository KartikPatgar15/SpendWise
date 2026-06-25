// src/hooks/useTheme.js
// Extracts theme state from Tracker.jsx into a reusable hook.
// Any component can call useTheme() to get tokens + the setter.

import { useState, useCallback } from "react";
import { THEMES } from "../config/themeConfig";

export function useTheme() {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  }, []);

  const tokens = THEMES[theme] || THEMES.dark;

  return { theme, setTheme, tokens };
}