/* eslint-disable react-refresh/only-export-components */
import React from "react";

const ThemeContext = React.createContext(undefined);

const THEME_KEY = "quiz_theme";
const AVAILABLE = ["ash", "dark", "white"];

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = React.useState(() => {
    try {
      const v = localStorage.getItem(THEME_KEY);
      return v && AVAILABLE.includes(v) ? v : "white";
    } catch {
      return "white";
    }
  });

  React.useEffect(() => {
    const root = document.documentElement;
    AVAILABLE.forEach((t) => root.classList.remove(`theme-${t}`));
    root.classList.add(`theme-${theme}`);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = React.useCallback((t) => {
    if (!AVAILABLE.includes(t)) return;
    setThemeState(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, available: AVAILABLE }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export default ThemeContext;
