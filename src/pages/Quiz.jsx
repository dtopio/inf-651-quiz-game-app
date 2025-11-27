import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import questionBank from '@/data/questions.json';
import { getRandomQuestions } from '@/utils/quizUtils';
import { useQuizHistory } from "@/hooks/useQuizHistory.js";
import { CATEGORIES } from "@/data/categories";
import { useSettings } from "@/context/SettingsContext.jsx";
import { useTheme } from "@/context/ThemeContext.jsx";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui";

const PROGRESS_KEY_PREFIX = "quizProgress-";
const LAST_CATEGORY_KEY = "lastQuizCategory";

function loadLastCategoryKey() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_CATEGORY_KEY);
  } catch {
    return null;
  }
}

function saveLastCategoryKey(categoryKey) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_CATEGORY_KEY, categoryKey);
  } catch {
    // Ignore localStorage errors
  }
}

function clearLastCategoryKey() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LAST_CATEGORY_KEY);
  } catch {
    // Ignore localStorage errors
  }
}


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
    // Ignore localStorage errors
  }
}

function clearProgress(categoryKey) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(getProgressKey(categoryKey));
  } catch {
    // Ignore localStorage errors
  }
}

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addQuizResult } = useQuizHistory();
  const { theme } = useTheme();

  const passedCategory = location.state?.category || null;
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (passedCategory) return passedCategory;

    const storedKey = loadLastCategoryKey();
    if (!storedKey) return null;

    const found = CATEGORIES.find((c) => c.key === storedKey);
    return found || null;
  });
  const activeCategory = selectedCategory || passedCategory;
  const categoryKey = activeCategory?.key || "science";
  const categoryTitle = activeCategory?.title || "Science";

  const categoryInfo = CATEGORIES.find((c) => c.key === categoryKey);
  const categoryIcon = categoryInfo?.icon;

  // State for quiz questions - randomized once per quiz session
  const [questions, setQuestions] = useState([]);
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [showQuitPrompt, setShowQuitPrompt] = useState(false);

  const currentQuestion = questions[currentIndex];

  const { listView } = useSettings();

  // Load and randomize questions when category changes
  useEffect(() => {
    if (!activeCategory) return;
    
    // Check if we have saved progress with questions
    const saved = loadProgress(categoryKey);
    if (saved && saved.questions && saved.questions.length > 0) {
      // Use saved questions to maintain consistency
      setQuestions(saved.questions);
      return;
    }
    
    // Otherwise, load and randomize new questions
    const allQuestions = questionBank[categoryKey] || [];
    const randomized = getRandomQuestions(allQuestions, 10);
    setQuestions(randomized);
    
    // Reset quiz state when category changes
    setCurrentIndex(0);
    setAnswers({});
    setIsSubmitted(false);
  }, [categoryKey, activeCategory]);


  useEffect(() => {
    if (!activeCategory) return;
    if (isSubmitted) return;

    const saved = loadProgress(categoryKey);
    if (saved && typeof saved.currentIndex === "number") {
      setShowResumePrompt(true);
    }
  }, [activeCategory, categoryKey, isSubmitted]);

  const handleOptionSelect = (optionIndex) => {
    if (isSubmitted) return;
    setAnswers((prev) => {
      const updated = { ...prev, [currentIndex]: optionIndex };
      saveProgress(categoryKey, {
        currentIndex,
        answers: updated,
        questions, // Save questions to maintain consistency
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
        questions, // Save questions to maintain consistency
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
        questions, // Save questions to maintain consistency
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
    setShowQuitPrompt(true);
  };


  const handleQuit = () => {
    clearProgress(categoryKey);
    clearLastCategoryKey();
    setShowResumePrompt(false);
    navigate("/");
  };


  const correctCount = questions.reduce((sum, q, index) => {
    const chosen = answers[index];
    return chosen === q.answerIndex ? sum + 1 : sum;
  }, 0);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const allAnswered = Object.keys(answers).length === totalQuestions;

  const hasCategory = !!activeCategory;

  if (!hasCategory) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="mb-12 text-center">
            <h1 
              className="mb-4 text-5xl font-extrabold leading-[1.2] pb-1"
              style={{ 
                color: theme === 'christmas' ? '#0b5e15' : 'transparent',
                backgroundImage: theme === 'christmas' ? 'none' : 'var(--accent-text-gradient)',
                backgroundClip: theme === 'christmas' ? 'unset' : 'text',
                WebkitBackgroundClip: theme === 'christmas' ? 'unset' : 'text'
              }}
            >
              Pick a Category
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Choose a quiz to get started.
            </p>
          </div>

          <div
            className={
              listView
                ? "flex flex-col gap-4" // list view
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10" // grid view
            }
          >
            {CATEGORIES.map((category, index) => {
              const description =
                category.description ||
                `Test your knowledge in ${category.title.toLowerCase()}.`;

              return listView ? (
                // ----- LIST MODE -----
                <button
                  key={category.key}
                  onClick={() => {
                    setSelectedCategory(category);
                    saveLastCategoryKey(category.key);
                    setIsSubmitted(false);
                    setCurrentIndex(0);
                    setAnswers({});
                    setShowResumePrompt(false);
                  }}
                  className="
                    w-full flex items-center gap-4 p-4 
                    rounded-xl 
                    shadow-sm hover:shadow-md hover:-translate-y-[2px]
                    transition-all
                    text-left
                  "
                  style={{ 
                    background: 'var(--card-bg)', 
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <span className="text-3xl">{category.icon}</span>

                  <div>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                      {category.title}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{description}</p>
                  </div>

                  <span className="ml-auto font-semibold" style={{ color: 'var(--accent)' }}>
                    →
                  </span>
                </button>
              ) : (
                // ----- GRID MODE -----
                <Card
                  key={category.key}
                  className="group h-80 flex flex-col rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer w-full relative overflow-hidden"
                  style={{ 
                    background: theme === 'christmas' 
                      ? (index % 2 === 0 ? 'var(--christmas-present-red)' : 'var(--christmas-present-green)')
                      : 'var(--card-bg)', 
                    borderColor: theme === 'christmas' ? 'transparent' : 'var(--border)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  {/* Christmas Present Wrapper (only shows in christmas theme) */}
                  {theme === 'christmas' && (
                    <>
                      {/* Vertical Ribbon */}
                      <div 
                        className="absolute left-1/2 top-0 bottom-0 w-10 -translate-x-1/2 z-0 pointer-events-none"
                        style={{
                          background: index % 2 === 0 
                            ? '#ffffff'
                            : '#ffd43b',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      />
                      
                      {/* Horizontal Ribbon */}
                      <div 
                        className="absolute left-0 right-0 top-1/3 h-10 z-0 pointer-events-none"
                        style={{
                          background: index % 2 === 0 
                            ? '#ffffff'
                            : '#ffd43b',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      />
                      
                      {/* Transparent backdrop for content */}
                      <div className="absolute inset-0 z-5 pointer-events-none"
                        style={{
                          background: 'rgba(0,0,0,0.25)'
                        }}
                      />
                      
                      {/* Christmas Bow */}
                      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-4xl drop-shadow-lg">
                        🎀
                      </div>
                    </>
                  )}
                  
                  <CardHeader className="flex-1 flex flex-col items-center justify-between p-6 relative z-10">
                    <div 
                      className="w-20 h-20 flex items-center justify-center rounded-2xl shadow-lg 
                      transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ 
                          background: theme === 'christmas' 
                            ? '#ffffff'
                            : 'var(--accent-gradient)'
                        }}
                      >
                        <span className="text-4xl">{category.icon}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <CardTitle 
                          className="text-2xl font-bold text-center transition-colors"
                          style={{ 
                            color: theme === 'christmas' ? '#ffffff' : 'var(--text)',
                            textShadow: theme === 'christmas' ? '0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)' : 'none'
                          }}
                        >
                          {category.title}
                        </CardTitle>

                        <CardDescription 
                          className="text-sm text-center leading-relaxed mt-1"
                          style={{ 
                            color: theme === 'christmas' ? 'rgba(255,255,255,0.95)' : 'var(--text-secondary)',
                            textShadow: theme === 'christmas' ? '0 1px 4px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.4)' : 'none'
                          }}
                        >
                          {description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardFooter className="p-6 pt-0 flex justify-center relative z-10">
                      <button
                        className="px-6 py-2 text-sm font-semibold rounded-lg shadow-md 
                        hover:shadow-xl hover:scale-105 transition-all duration-200"
                        style={{ 
                          background: theme === 'christmas' ? '#ffffff' : 'var(--accent-gradient)',
                          color: theme === 'christmas' ? (index % 2 === 0 ? '#c92a2a' : '#2f9e44') : '#ffffff'
                        }}
                        onClick={() => {
                          setSelectedCategory(category);
                          saveLastCategoryKey(category.key);
                          setIsSubmitted(false);
                          setCurrentIndex(0);
                          setAnswers({});
                          setShowResumePrompt(false);
                        }}
                      >
                        Start Quiz →
                      </button>
                    </CardFooter>
                  </Card>
              );
            })}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center mb-6 gap-3">
          <button
            onClick={handleBackClick}
            className="p-2 rounded-full shadow-sm hover:shadow-md transition"
            style={{ 
              background: 'var(--card-bg)', 
              borderColor: 'var(--border)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <ArrowLeftIcon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>

          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <span className="text-3xl">{categoryIcon}</span>
              {categoryTitle}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{totalQuestions} Questions</p>
          </div>
        </div>

        {!currentQuestion && totalQuestions === 0 ? (
          <div 
            className="rounded-3xl shadow-xl px-6 py-8 md:px-10 md:py-10"
            style={{ 
              background: 'var(--card-bg)', 
              borderColor: 'var(--border)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
              Loading questions...
            </p>
          </div>
        ) : showQuitPrompt ? (
          <div 
            className="rounded-3xl shadow-xl px-6 py-8 md:px-10 md:py-10"
            style={{ 
              background: 'var(--card-bg)', 
              borderColor: 'var(--border)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Quit this quiz?
            </h2>

            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              If you quit now, your current progress will be lost. 
              Are you sure you want to exit this quiz?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowQuitPrompt(false)}
                className="flex-1 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border hover:opacity-90"
                style={{ 
                  background: 'var(--surface)', 
                  color: 'var(--text)',
                  borderColor: 'var(--border)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleQuit}
                className="flex-1 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border bg-red-600 text-white border-red-600 hover:bg-red-700"
              >
                Quit Quiz
              </button>

            </div>
          </div>
        ) : showResumePrompt && !isSubmitted ? (
          <div 
            className="rounded-3xl shadow-xl px-6 py-8 md:px-10 md:py-10 mb-6"
            style={{ 
              background: 'var(--card-bg)', 
              borderColor: 'var(--border)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                Continue your {categoryTitle} quiz?
              </h2>
            </div>

            <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We found an unfinished {categoryTitle} quiz.  
              Do you want to continue where you left off, start a new quiz, or quit?
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleResume}
                className="flex-1 rounded-xl px-4 py-3 font-semibold text-sm md:text-base text-white border hover:opacity-90 transition"
                style={{ 
                  background: 'var(--accent-gradient)', 
                  borderColor: 'var(--accent)'
                }}
              >
                Continue
              </button>
              <button
                onClick={handleQuit}
                className="flex-1 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border bg-red-600 text-white border-red-600 hover:bg-red-700"
              >
                Quit
              </button>
            </div>
          </div>
        ) : !isSubmitted ? (
          <div 
            className="rounded-3xl shadow-xl px-6 py-6 md:px-10 md:py-8"
            style={{ 
              background: 'var(--card-bg)', 
              borderColor: 'var(--border)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <div className="flex items-center justify-between mb-4 text-sm">
              <p className="font-semibold" style={{ color: 'var(--accent)' }}>
                Question: {currentIndex + 1}/{totalQuestions}
              </p>
              <button
                onClick={() => setShowQuitPrompt(true)}
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
                    className={`w-full text-left rounded-xl border px-4 py-3 md:px-5 md:py-3.5 text-sm md:text-base transition-all shadow-sm
                      ${
                        isSelected
                          ? "text-white shadow-md scale-[1.01]"
                          : "hover:shadow-md"
                      }`}
                    style={isSelected ? { 
                      background: 'var(--accent-gradient)', 
                      borderColor: 'var(--accent)'
                    } : { 
                      background: 'var(--surface)', 
                      color: 'var(--text)',
                      borderColor: 'var(--border)'
                    }}
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
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                style={isFirst ? { 
                  background: 'var(--surface)', 
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border)'
                } : { 
                  background: 'var(--surface)', 
                  color: 'var(--text)',
                  borderColor: 'var(--border)'
                }}
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
                        ? "opacity-50 cursor-not-allowed"
                        : "text-white hover:opacity-90"
                    }`}
                  style={!allAnswered ? { 
                    background: 'var(--surface)', 
                    color: 'var(--text-secondary)',
                    borderColor: 'var(--border)'
                  } : { 
                    background: 'var(--accent-gradient)', 
                    borderColor: 'var(--accent)'
                  }}
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
                        ? "opacity-50 cursor-not-allowed"
                        : "text-white hover:opacity-90"
                    }`}
                  style={typeof answers[currentIndex] === "undefined" ? { 
                    background: 'var(--surface)', 
                    color: 'var(--text-secondary)',
                    borderColor: 'var(--border)'
                  } : { 
                    background: 'var(--accent-gradient)', 
                    borderColor: 'var(--accent)'
                  }}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div 
              className="mb-6 rounded-2xl shadow px-6 py-4"
              style={{ 
                background: 'var(--card-bg)', 
                borderColor: 'var(--border)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
                Your Result
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
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
                    className="rounded-2xl shadow px-6 py-5"
                    style={{ 
                      background: 'var(--card-bg)', 
                      borderColor: 'var(--border)',
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
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
                          <div 
                            key={optIndex} 
                            className={styles}
                            style={
                              !isSelected && (!isAnswer || isCorrect)
                                ? { background: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border)' }
                                : {}
                            }
                          >
                            {option}
                          </div>
                        );
                      })}
                    </div>

                    <div 
                      className="rounded-xl px-4 py-3 text-sm"
                      style={{ 
                        background: 'var(--surface)', 
                        borderColor: 'var(--border)',
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}
                    >
                      <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Feedback</p>
                      {isCorrect ? (
                        <p style={{ color: 'var(--text-secondary)' }}>{explanationCorrect}</p>
                      ) : (
                        <div className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
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
            
            {/* Back to Categories Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  clearLastCategoryKey();
                  setSelectedCategory(null);
                  setIsSubmitted(false);
                  setCurrentIndex(0);
                  setAnswers({});
                  setShowResumePrompt(false);
                }}
                className="px-8 py-3 rounded-xl font-semibold text-sm md:text-base border shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
                style={{ 
                  background: 'var(--accent-gradient)', 
                  color: '#ffffff',
                  borderColor: 'var(--accent)'
                }}
              >
                Back to Quiz Categories
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}