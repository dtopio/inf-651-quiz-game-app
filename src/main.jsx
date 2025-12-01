import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { QuizHistoryProvider } from "./context/QuizHistory.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <ThemeProvider>
        <QuizHistoryProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </QuizHistoryProvider>
      </ThemeProvider>
  </Router>
  </StrictMode>
);
