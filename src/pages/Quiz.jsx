import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { QUESTION_BANK } from '@/data/questions';
import { useQuizHistory } from "@/context/QuizHistory.jsx";
import { CATEGORIES } from "@/data/categories";



const PROGRESS_KEY_PREFIX = "quizProgress-";

function getProgressKey(categoryKey) {
  return `${PROGRESS_KEY_PREFIX}${categoryKey}`;
}

function loadProgress(categoryKey) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(getProgressKey(categoryKey));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveProgress(categoryKey, data) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      getProgressKey(categoryKey),
      JSON.stringify(data)
    );
  } catch {
    // ignore
  }
}

function clearProgress(categoryKey) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(getProgressKey(categoryKey));
  } catch {
    // ignore
  }
}


export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addQuizResult } = useQuizHistory();

  const passedCategory = location.state?.category;
  const categoryKey = passedCategory?.key || "science";
  const categoryTitle = passedCategory?.title || "Science";

  const categoryInfo = CATEGORIES.find(c => c.key === categoryKey);
  const categoryIcon = categoryInfo?.icon;

  const questions = QUESTION_BANK[categoryKey] || QUESTION_BANK.science;
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [showResumePrompt, setShowResumePrompt] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (isSubmitted) return;
    const saved = loadProgress(categoryKey);
    if (saved && typeof saved.currentIndex === "number") {
      setShowResumePrompt(true);
    }
  }, [categoryKey, isSubmitted]);

  const handleOptionSelect = (optionIndex) => {
    if (isSubmitted) return;
    setAnswers((prev) => {
      const updated = { ...prev, [currentIndex]: optionIndex };
      saveProgress(categoryKey, {
        currentIndex,
        answers: updated,
      });
      return updated;
    });
  };


  const handleNext = () => {
    if (isSubmitted) return;
    if (currentIndex < totalQuestions - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      saveProgress(categoryKey, {
        currentIndex: newIndex,
        answers,
      });
    }
  };

  const handlePrevious = () => {
    if (isSubmitted) return;
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      saveProgress(categoryKey, {
        currentIndex: newIndex,
        answers,
      });
    }
  };


  const handleResume = () => {
    const saved = loadProgress(categoryKey);
    if (saved) {
      setCurrentIndex(saved.currentIndex || 0);
      setAnswers(saved.answers || {});
    }
    setShowResumePrompt(false);
  };

  const handleStartOver = () => {
    clearProgress(categoryKey);
    setCurrentIndex(0);
    setAnswers({});
    setShowResumePrompt(false);
  };


  const handleSubmit = () => {
    clearProgress(categoryKey);
    setIsSubmitted(true);

    // Save the result to global history + localStorage
    addQuizResult({
      category: categoryTitle,
      categoryKey: categoryKey,
      score: correctCount,
      total: totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100),
      answers: answers,
      timestamp: Date.now()
    });
  };
  const handleBackClick = () => {
    const hasAnswers = Object.keys(answers).length > 0;

    if (hasAnswers && !isSubmitted) {
      setShowResumePrompt(true);
    } else {
      navigate(-1);
    }
  };


  const handleQuit = () => {
    clearProgress(categoryKey);
    navigate("/");
  };


  const correctCount = questions.reduce((sum, q, index) => {
    const chosen = answers[index];
    return chosen === q.answerIndex ? sum + 1 : sum;
  }, 0);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const allAnswered = Object.keys(answers).length === totalQuestions;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center mb-6 gap-3">
          <button
            onClick={handleBackClick}
            className="p-2 rounded-full shadow-sm border hover:shadow-md transition"
            style={{ 
              background: 'var(--card-bg)',
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <span className="text-3xl">{categoryIcon}</span>
              {categoryTitle}
            </h1>
            <p className="text-sm text-muted-foreground">{totalQuestions} Questions</p>
          </div>
        </div>

        {showResumePrompt && !isSubmitted ? (
          <div className="rounded-3xl shadow-xl border px-6 py-6 md:px-10 md:py-8"
            style={{ 
              background: 'var(--card-bg)',
              borderColor: 'var(--border)'
            }}
          >
            <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Continue your {categoryTitle} quiz?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              We found an unfinished {categoryTitle} quiz. Do you want to continue
              where you left off or start a new quiz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResume}
                className="btn flex-1 rounded-xl px-4 py-3 font-semibold text-sm md:text-base"
              >
                Continue
              </button>
              <button
                onClick={handleStartOver}
                className="flex-1 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border hover:opacity-80 transition"
                style={{ 
                  background: 'var(--card-bg)',
                  color: 'var(--text)',
                  borderColor: 'var(--border)'
                }}
              >
                Start Over
              </button>
            </div>
          </div>
        ) : !isSubmitted ? (
          <div className="rounded-3xl shadow-xl border px-6 py-6 md:px-10 md:py-8"
            style={{ 
              background: 'var(--card-bg)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="flex items-center justify-between mb-4 text-sm">
              <p className="font-semibold" style={{ color: 'var(--accent-1)' }}>
                Question: {currentIndex + 1}/{totalQuestions}
              </p>
              <button
                onClick={handleQuit}
                className="text-red-500 font-medium hover:underline"
              >
                Quit
              </button>
            </div>

            <h2 className="text-xl md:text-2xl font-semibold mb-6 leading-relaxed" style={{ color: 'var(--text)' }}>
              {currentQuestion.question}
            </h2>

            <div className="space-y-3 mb-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentIndex] === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleOptionSelect(index)}
                    className={`w-full text-left rounded-xl border px-4 py-3 md:px-5 md:py-3.5 text-sm md:text-base transition-all shadow-sm ${
                      isSelected ? "btn shadow-md scale-[1.01]" : "hover:shadow-md"
                    }`}
                    style={!isSelected ? { 
                      background: 'var(--card-bg)',
                      color: 'var(--text)',
                      borderColor: 'var(--border)'
                    } : {}}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={isFirst}
                className={`flex-1 md:flex-none md:w-40 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border transition ${
                  isFirst ? "cursor-not-allowed opacity-50" : "btn"
                }`}
                style={isFirst ? { 
                  background: 'var(--card-bg)',
                  color: 'var(--muted)',
                  borderColor: 'var(--border)'
                } : {}}
              >
                Previous
              </button>

              {isLast ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className={`flex-1 md:flex-none md:w-40 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border transition ${
                    !allAnswered ? "cursor-not-allowed opacity-50" : "btn"
                  }`}
                  style={!allAnswered ? { 
                    background: 'var(--card-bg)',
                    color: 'var(--muted)',
                    borderColor: 'var(--border)'
                  } : {}}
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={typeof answers[currentIndex] === "undefined"}
                  className={`flex-1 md:flex-none md:w-40 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border transition ${
                    typeof answers[currentIndex] === "undefined" ? "cursor-not-allowed opacity-50" : "btn"
                  }`}
                  style={typeof answers[currentIndex] === "undefined" ? { 
                    background: 'var(--card-bg)',
                    color: 'var(--muted)',
                    borderColor: 'var(--border)'
                  } : {}}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 rounded-2xl shadow border px-6 py-4"
              style={{ 
                background: 'var(--card-bg)',
                borderColor: 'var(--border)'
              }}
            >
              <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
                Your Result
              </h2>
              <p style={{ color: 'var(--text)' }}>
                You answered{" "}
                <span className="font-semibold">
                  {correctCount} / {totalQuestions}
                </span>{" "}
                correctly (
                {Math.round((correctCount / totalQuestions) * 100)}%).
              </p>
            </div>

            <div className="space-y-4">
              {questions.map((q, index) => {
                const selectedIndex = answers[index];
                const isCorrect = selectedIndex === q.answerIndex;

                const explanationCorrect =
                  q.explanationCorrect || "Nice! That is the correct answer.";
                const explanationGenericWrong =
                  q.explanationGenericWrong || "This option is not the correct answer.";

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl shadow border px-6 py-5"
                    style={{ 
                      background: 'var(--card-bg)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Question {index + 1} / {totalQuestions}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          isCorrect
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
                      {q.question}
                    </h3>

                    <div className="space-y-2 mb-4">
                      {q.options.map((option, optIndex) => {
                        const isSelected = selectedIndex === optIndex;
                        const isAnswer = q.answerIndex === optIndex;

                        let styles =
                          "w-full text-left rounded-xl border px-4 py-3 text-sm md:text-base";

                        if (isSelected && isCorrect) {
                          styles += " bg-emerald-600 text-white border-emerald-600";
                        } else if (isSelected && !isCorrect) {
                          styles += " bg-rose-600 text-white border-rose-600";
                        } else if (!isSelected && isAnswer && !isCorrect) {
                          styles +=
                            " bg-emerald-50 text-emerald-800 border-emerald-300";
                        } else {
                          styles += " border-slate-200";
                        }

                        return (
                          <div key={optIndex} className={styles}
                            style={!isSelected && !isAnswer ? { 
                              background: 'var(--card-bg)',
                              color: 'var(--text)',
                              borderColor: 'var(--border)'
                            } : {}}
                          >
                            {option}
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-xl border px-4 py-3 text-sm"
                      style={{ 
                        background: 'var(--surface)',
                        borderColor: 'var(--border)'
                      }}
                    >
                      <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Feedback</p>
                      {isCorrect ? (
                        <p style={{ color: 'var(--text)' }}>{explanationCorrect}</p>
                      ) : (
                        <div className="space-y-1" style={{ color: 'var(--text)' }}>
                          <p>
                            You chose:{" "}
                            <span className="font-semibold">
                              {q.options[selectedIndex] ?? "No answer"}
                            </span>
                            . {explanationGenericWrong}
                          </p>
                          <p>
                            The correct answer is{" "}
                            <span className="font-semibold">
                              {q.options[q.answerIndex]}
                            </span>
                            . {explanationCorrect}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

