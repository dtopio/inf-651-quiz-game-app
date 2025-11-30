import { useSettings } from "@/context/SettingsContext.jsx";
import { useTheme } from "@/context/ThemeContext.jsx";

export default function Settings() {
  const { listView, setListView, saveSettings, resetAllData } = useSettings();
  const { theme, setTheme, saveTheme } = useTheme();

  const handleSaveSettings = () => {
    const ok = window.confirm("Confirm saving your settings?");
    if (!ok) return;

    saveTheme();
    saveSettings();
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure? This action can't be undone."
    );
    if (!confirmed) return;

    resetAllData();
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--text)" }}
      >
        Settings
      </h1>

      <div
        className="rounded-xl shadow p-4 mb-6"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <h2
          className="text-lg font-semibold mb-3"
          style={{ color: "var(--text)" }}
        >
          Theme
        </h2>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
              className="w-4 h-4"
            />
            <span style={{ color: "var(--text-secondary)" }}>Light Theme</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
              className="w-4 h-4"
            />
            <span style={{ color: "var(--text-secondary)" }}>Dark Theme</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="ash"
              checked={theme === "ash"}
              onChange={() => setTheme("ash")}
              className="w-4 h-4"
            />
            <span style={{ color: "var(--text-secondary)" }}>Ash Theme</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="christmas"
              checked={theme === "christmas"}
              onChange={() => setTheme("christmas")}
              className="w-4 h-4"
            />
            <span style={{ color: "var(--text-secondary)" }}>
              🎄 Christmas Theme 🎅
            </span>
          </label>
        </div>
      </div>

      <div
        className="rounded-xl shadow p-4 mb-6"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <h2
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--text)" }}
        >
          Category Layout
        </h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={listView}
            onChange={() => setListView(!listView)}
            className="w-5 h-5"
          />
          <span style={{ color: "var(--text-secondary)" }}>
            Use List View for Categories
          </span>
        </label>
      </div>

      <div
        className="rounded-xl shadow p-4"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <h2
          className="text-lg font-semibold mb-3"
          style={{ color: "var(--text)" }}
        >
          Actions
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
          >
            Save Setting Preference
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700"
          >
            Reset Quiz History &amp; Settings
          </button>
        </div>
      </div>
    </div>
  );
}
