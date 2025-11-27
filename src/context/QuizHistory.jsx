import { useEffect, useState } from "react";
import { QuizHistoryContext } from "@/context/QuizHistoryContext.js";

export function QuizHistoryProvider({ children }) {
  const [history, setHistory] = useState(null); // null = still loading

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("quizHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    } else {
      setHistory([]); // no history yet
    }
  }, []);

  // Save history to localStorage (but not when it's null)
  useEffect(() => {
    if (history !== null) {
      localStorage.setItem("quizHistory", JSON.stringify(history));
    }
  }, [history]);

  // Add quiz result
  const addQuizResult = (result) => {
    setHistory((prev) => [...prev, result]);
  };

  const clearHistory = () => {
    setHistory([]);               // reset in state
    localStorage.removeItem("quizHistory"); // clear localStorage
  };

  // Loading state
  if (history === null) {
    return <div className="p-6">Loading quiz history...</div>;
  }

  return (
    <QuizHistoryContext.Provider
      value={{ history, addQuizResult, clearHistory }} // <-- added here
    >
      {children}
    </QuizHistoryContext.Provider>
  );
}
