import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { QuizHistoryProvider } from "./context/QuizHistory.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QuizHistoryProvider>
        <App />
      </QuizHistoryProvider>
    </BrowserRouter>
  </StrictMode>
);
