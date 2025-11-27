import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const THEME_KEY = "quiz-app-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to "light"
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(THEME_KEY);
        return saved || "light";
      } catch {
        return "light";
      }
    }
    return "light";
  });

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute("data-theme", theme);
    
    // Save to localStorage
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore localStorage errors
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
