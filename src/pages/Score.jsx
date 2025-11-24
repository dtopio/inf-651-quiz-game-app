import { useQuizHistory } from "@/context/QuizHistory.jsx";
import { CATEGORIES } from "@/data/categories";
import { TrashIcon } from "@heroicons/react/24/outline";

// Map category → icon (from your categories.js)
const CATEGORY_ICON_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.title, c.icon])
);

export default function Score() {
  const { history, clearHistory } = useQuizHistory();

  // Nothing taken yet
  if (!history || history.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Your Quiz Scores</h1>
      
        <div className="bg-white p-6 rounded-2xl shadow border">
          <p className="text-gray-700">You haven't taken any quizzes yet.</p>
        </div>
      </div>
    );
  }

  // Stats
  const totalQuizzes = history.length;
  const averagePercentage = Math.round(
    history.reduce((sum, q) => sum + q.percentage, 0) / totalQuizzes
  );

  const latestQuiz = history[history.length - 1];

  // Best score per category
  const bestByCategory = history.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = q.percentage;
    else acc[q.category] = Math.max(acc[q.category], q.percentage);
    return acc;
  }, {});

  return (
    <div className="p-6">
      {/* Title + Clear Button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Quiz Performance</h1>

        <button
          onClick={clearHistory}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
        >
          <TrashIcon className="w-5 h-5" />
          Clear History
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard label="Total Quizzes Taken" value={totalQuizzes} />
        <SummaryCard label="Average Score" value={`${averagePercentage}%`} />
        <SummaryCard label="Latest Score" value={`${latestQuiz.percentage}%`} />
      </div>

      {/* Best by Category */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Best Score by Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(bestByCategory).map(([category, percent]) => (
            <div
              key={category}
              className="bg-white rounded-xl shadow border p-5 flex flex-col items-center"
            >
              <div className="text-4xl mb-2">
                {CATEGORY_ICON_MAP[category]}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{category}</h3>
              <p className="text-xl font-semibold">{percent}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quiz History</h2>

        <div className="overflow-x-auto rounded-xl shadow border bg-white">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Score</th>
                <th className="p-3">Percentage</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {history.map((q, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 flex items-center gap-2">
                    <span className="text-xl">{CATEGORY_ICON_MAP[q.category]}</span>
                    {q.category}
                  </td>

                  <td className="p-3">
                    {q.score} / {q.total}
                  </td>

                  <td className="p-3 font-semibold">{q.percentage}%</td>

                  <td className="p-3 text-gray-600">
                    {new Date(q.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reusable summary card
function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow border p-6 flex flex-col items-center">
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
