import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { QuizHistoryProvider } from "./context/QuizHistory.jsx";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <QuizHistoryProvider>
          <App />
        </QuizHistoryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
