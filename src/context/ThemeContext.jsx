import { createContext, useContext, useState, useEffect } from 'react';

// Create Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export function ThemeProvider({ children }) {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('quiz-app-theme');
    return savedTheme || 'light';
  });

  // Apply theme to document and save to localStorage
  useEffect(() => {
    // Apply theme to document root element
    if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    // Save to localStorage
    localStorage.setItem('quiz-app-theme', theme);
  }, [theme]);

  // Theme context value
  const value = {
    theme,
    setTheme,
    themes: ['light', 'dark', 'ash'], // Available themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
