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
        <p 
          className="text-4xl font-bold mb-6"
          style={{ color: 'var(--text)' }}
        >
          {greeting} 👋
        </p>

        {/* HERO */}
        <div 
          className="rounded-3xl p-10 shadow-xl w-full"
          style={{ 
            background: 'var(--hero-bg)',
            color: 'var(--hero-text)'
          }}
        >
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
          className="w-full mt-8 py-4 text-2xl font-semibold rounded-xl text-white shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          style={{ 
            background: 'var(--accent-gradient)'
          }}
        >
          Start Quiz →
        </button>

      {/* LATEST SCORE */}
      <div
        className="mt-10 rounded-2xl shadow-xl p-8 w-full"
        style={{ 
          background: 'var(--card-bg)', 
          borderColor: 'var(--border)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        {latest ? (
          <>
            <h2 
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Latest Score
            </h2>

            <h3 
              className="text-3xl font-bold mb-2 flex items-center justify-center gap-2"
              style={{ color: 'var(--text)' }}
            >
              <span className="text-4xl">
                {ICON_MAP[latest.categoryKey] || "📘"}
              </span>
              {latest.category}
            </h3>

            <p
              className="text-5xl font-extrabold mb-1 bg-clip-text text-transparent"
              style={{ 
                backgroundImage: 'var(--accent-text-gradient)'
              }}
            >
              {latest.percentage}%
            </p>

            <p 
              className="text-xs mt-3"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {new Date(latest.timestamp).toLocaleString()}
            </p>
          </>
        ) : (
          <>
            <h2 
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Latest Score
            </h2>

            <p 
              className="text-base"
              style={{ color: 'var(--muted-foreground)' }}
            >
              No quizzes taken yet.
            </p>

            <p 
              className="text-sm mt-1"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Start your first quiz to see your progress here!
            </p>
          </>
        )}
      </div>

      {/* QUOTE */}
      <div className="mt-8 mb-4">
        <div 
          className="px-6 py-4 rounded-2xl backdrop-blur-md shadow-md max-w-lg"
          style={{ 
            background: 'var(--card-bg)',
            opacity: 0.95
          }}
        >
          <p 
            className="text-xl font-semibold bg-clip-text text-transparent"
            style={{ 
              backgroundImage: 'var(--accent-text-gradient)'
            }}
          >
            "{quotes[quoteIndex]}"
          </p>
        </div>
      </div>
    </div>
    </div>

  );
}
