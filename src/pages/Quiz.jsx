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
            className="p-2 rounded-full bg-white shadow-sm border hover:shadow-md transition"
          >
            <ArrowLeftIcon className="w-5 h-5 text-slate-700" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-3xl">{categoryIcon}</span>
              {categoryTitle}
            </h1>
            <p className="text-sm text-slate-500">{totalQuestions} Questions</p>
          </div>
        </div>

        {showResumePrompt && !isSubmitted ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 px-6 py-6 md:px-10 md:py-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              Continue your {categoryTitle} quiz?
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              We found an unfinished {categoryTitle} quiz. Do you want to continue
              where you left off or start a new quiz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResume}
                className="flex-1 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
              >
                Continue
              </button>
              <button
                onClick={handleStartOver}
                className="flex-1 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
              >
                Start Over
              </button>
            </div>
          </div>
        ) : !isSubmitted ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 px-6 py-6 md:px-10 md:py-8">
            <div className="flex items-center justify-between mb-4 text-sm">
              <p className="text-indigo-700 font-semibold">
                Question: {currentIndex + 1}/{totalQuestions}
              </p>
              <button
                onClick={handleQuit}
                className="text-red-500 font-medium hover:underline"
              >
                Quit
              </button>
            </div>

            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-6 leading-relaxed">
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
                    className={`w-full text-left rounded-xl border px-4 py-3 md:px-5 md:py-3.5 text-sm md:text-base transition-all shadow-sm
                      ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.01]"
                          : "bg-white text-slate-800 border-slate-200 hover:border-indigo-400 hover:shadow-md"
                      }`}
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
                className={`flex-1 md:flex-none md:w-40 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border transition
                  ${
                    isFirst
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : "bg-white text-indigo-700 border-indigo-600 hover:bg-indigo-50"
                  }`}
              >
                Previous
              </button>

              {isLast ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className={`flex-1 md:flex-none md:w-40 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border transition
                    ${
                      !allAnswered
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={typeof answers[currentIndex] === "undefined"}
                  className={`flex-1 md:flex-none md:w-40 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border transition
                    ${
                      typeof answers[currentIndex] === "undefined"
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 bg-white rounded-2xl shadow border border-slate-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-1">
                Your Result
              </h2>
              <p className="text-slate-700">
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
                    className="bg-white rounded-2xl shadow border border-slate-100 px-6 py-5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-slate-500">
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

                    <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
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
                          styles += " bg-white text-slate-800 border-slate-200";
                        }

                        return (
                          <div key={optIndex} className={styles}>
                            {option}
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm">
                      <p className="font-semibold mb-1">Feedback</p>
                      {isCorrect ? (
                        <p className="text-slate-800">{explanationCorrect}</p>
                      ) : (
                        <div className="space-y-1 text-slate-800">
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

