import { useSettings } from "@/context/SettingsContext.jsx";

export default function Settings() {
  const { listView, setListView, resetAllData } = useSettings();

  return (
    <div className="max-w-xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* List View Toggle */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 border">
        <h2 className="text-lg font-semibold mb-2">Category Layout</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={listView}
            onChange={() => setListView(!listView)}
            className="w-5 h-5"
          />
          <span className="text-slate-700">
            Use List View for Categories
          </span>
        </label>
      </div>

      {/* Reset Button */}
      <div className="bg-white rounded-xl shadow p-4 border">
        <h2 className="text-lg font-semibold mb-3">Reset All Data</h2>
        <button
          onClick={resetAllData}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700"
        >
          Reset Quiz History & Progress
        </button>
      </div>

    </div>
  );
}
