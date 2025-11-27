import { useContext } from "react";
import { QuizHistoryContext } from "@/context/QuizHistoryContext.js";

export function useQuizHistory() {
  const context = useContext(QuizHistoryContext);
  if (!context) {
    throw new Error("useQuizHistory must be used within a QuizHistoryProvider");
  }
  return context;
}
