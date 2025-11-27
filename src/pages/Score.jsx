import { useQuizHistory } from "@/hooks/useQuizHistory.js";
import { CATEGORIES } from "@/data/categories";
import { TrashIcon } from "@heroicons/react/24/outline";

// Map category
const CATEGORY_ICON_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.title, c.icon])
);

export default function Score() {
  const { history, clearHistory } = useQuizHistory();

  // Nothing taken yet
  if (!history || history.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text)' }}>Your Quiz Scores</h1>
      
        <div 
          className="p-6 rounded-2xl shadow"
          style={{ 
            background: 'var(--card-bg)', 
            borderColor: 'var(--border)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>You haven't taken any quizzes yet.</p>
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
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Your Quiz Performance</h1>

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
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>Best Score by Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(bestByCategory).map(([category, percent]) => (
            <div
              key={category}
              className="rounded-xl shadow p-5 flex flex-col items-center"
              style={{ 
                background: 'var(--card-bg)', 
                borderColor: 'var(--border)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              <div className="text-4xl mb-2">
                {CATEGORY_ICON_MAP[category]}
              </div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{category}</h3>
              <p className="text-xl font-semibold" style={{ color: 'var(--text-secondary)' }}>{percent}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>Quiz History</h2>

        <div 
          className="overflow-x-auto rounded-xl shadow"
          style={{ 
            background: 'var(--card-bg)', 
            borderColor: 'var(--border)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <table className="w-full text-left">
            <thead style={{ background: 'var(--surface)' }}>
              <tr>
                <th className="p-3" style={{ color: 'var(--text-secondary)' }}>Category</th>
                <th className="p-3" style={{ color: 'var(--text-secondary)' }}>Score</th>
                <th className="p-3" style={{ color: 'var(--text-secondary)' }}>Percentage</th>
                <th className="p-3" style={{ color: 'var(--text-secondary)' }}>Date</th>
              </tr>
            </thead>

            <tbody>
              {history.map((q, index) => (
                <tr key={index} style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="p-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <span className="text-xl">{CATEGORY_ICON_MAP[q.category]}</span>
                    {q.category}
                  </td>

                  <td className="p-3" style={{ color: 'var(--text)' }}>
                    {q.score} / {q.total}
                  </td>

                  <td className="p-3 font-semibold" style={{ color: 'var(--text)' }}>{q.percentage}%</td>

                  <td className="p-3" style={{ color: 'var(--text-secondary)' }}>
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
    <div 
      className="rounded-2xl shadow p-6 flex flex-col items-center"
      style={{ 
        background: 'var(--card-bg)', 
        borderColor: 'var(--border)',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <p className="text-4xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
    </div>
  );
}
