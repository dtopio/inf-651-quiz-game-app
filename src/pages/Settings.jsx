import { useSettings } from "@/context/SettingsContext.jsx";
import { useTheme } from "@/context/ThemeContext.jsx";

export default function Settings() {
  const { listView, setListView, resetAllData } = useSettings();
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="max-w-xl mx-auto">

      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>Settings</h1>

      {/* Theme Selector */}
      <div className="rounded-xl shadow p-4 mb-6 border"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--border)'
        }}
      >
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Theme</h2>
        
        <div className="space-y-2">
          {themes.map((themeName) => (
            <label key={themeName} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="theme"
                checked={theme === themeName}
                onChange={() => setTheme(themeName)}
                className="w-5 h-5"
              />
              <span style={{ color: 'var(--text)' }} className="capitalize">
                {themeName} Theme
              </span>
            </label>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg border"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)'
          }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
            Current Theme: <span className="capitalize">{theme}</span>
          </p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Your theme preference is saved automatically.
          </p>
        </div>
      </div>

      {/* List View Toggle */}
      <div className="rounded-xl shadow p-4 mb-6 border"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--border)'
        }}
      >
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Category Layout</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={listView}
            onChange={() => setListView(!listView)}
            className="w-5 h-5"
          />
          <span style={{ color: 'var(--text)' }}>
            Use List View for Categories
          </span>
        </label>
      </div>

      {/* Reset Button */}
      <div className="rounded-xl shadow p-4 border"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--border)'
        }}
      >
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Reset All Data</h2>
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
