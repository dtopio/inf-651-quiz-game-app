import { useNavigate } from "react-router-dom";
import { useQuizHistory } from "@/context/QuizHistory.jsx";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { history } = useQuizHistory();

  const latest = history?.length ? history[history.length - 1] : null;

  // Quotes
  const quotes = [
    "Knowledge is your superpower.",
    "Every question helps you grow.",
    "Stay curious, stay sharp.",
    "Small progress still counts.",
    "Learning never stops.",
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 18 ? "Good afternoon" :
    "Good evening";

  const ICON_MAP = {
    science: "🔬",
    history: "📜",
    art: "🎨",
    geography: "🌍",
    technology: "💻",
    sports: "⚽",
  };

  return (
    <div className="flex flex-col items-center text-center min-h-screen py-8">

      <div className="flex flex-col items-center w-full max-w-3xl flex-grow justify-center">

        {/* Greeting */}
        <p className="text-4xl font-bold text-slate-800 mb-6">
          {greeting} 👋
        </p>

        {/* HERO */}
        <div className="
          bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
          rounded-3xl p-10 text-white shadow-xl w-full
        ">
          <div className="flex flex-col items-center gap-4">
            <div className="
              w-24 h-24 flex items-center justify-center
              rounded-2xl bg-white/20 backdrop-blur-md
              text-5xl shadow-md
            ">
              🧠
            </div>

            <h1 className="text-5xl font-extrabold leading-tight">
              Welcome to Quiz Game
            </h1>

            <p className="text-base opacity-90 mt-1">
              A fun way to learn something new every day.
            </p>
          </div>
        </div>

        {/* START QUIZ BUTTON */}
        <button
          onClick={() => navigate("/quiz")}
          className="
            w-full mt-8 py-4 text-2xl font-semibold rounded-xl
            bg-gradient-to-r from-indigo-500 to-blue-600
            text-white shadow-lg hover:shadow-2xl hover:scale-[1.02]
            transition-all duration-300
          "
        >
          Start Quiz →
        </button>

      {/* LATEST SCORE */}
      <div
        className="
          mt-10 bg-white rounded-2xl shadow-xl
          border border-slate-200 p-8 w-full
        "
      >
        {latest ? (
          <>
            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              Latest Score
            </h2>

            <h3 className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
              <span className="text-4xl">
                {ICON_MAP[latest.categoryKey] || "📘"}
              </span>
              {latest.category}
            </h3>

            <p
              className="
                text-5xl font-extrabold mb-1
                bg-gradient-to-r from-indigo-600 to-purple-600
                bg-clip-text text-transparent
              "
            >
              {latest.percentage}%
            </p>

            <p className="text-xs text-slate-500 mt-3">
              {new Date(latest.timestamp).toLocaleString()}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              Latest Score
            </h2>

            <p className="text-base text-slate-500">
              No quizzes taken yet.
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Start your first quiz to see your progress here!
            </p>
          </>
        )}
      </div>

      {/* QUOTE */}
      <div className="mt-8 mb-4">
        <div className="
          px-6 py-4 rounded-2xl bg-white/40
          backdrop-blur-md shadow-md max-w-lg
        ">
          <p className="
            text-xl font-semibold
            bg-gradient-to-r from-indigo-500 to-purple-600
            bg-clip-text text-transparent
          ">
            “{quotes[quoteIndex]}”
          </p>
        </div>
      </div>
    </div>
    </div>

  );
}
