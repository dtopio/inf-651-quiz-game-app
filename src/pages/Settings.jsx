import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/context/SettingsContext.jsx";
import { useTheme } from "@/context/ThemeContext.jsx";
import { ConfirmModal } from "@/components/ui/confirm-modal.jsx";

export default function Settings() {
  const { listView, setListView, saveSettings, resetAllData } = useSettings();
  const { theme, setTheme, saveTheme } = useTheme();
  const navigate = useNavigate();
  const [saveOpen, setSaveOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalTheme] = useState(theme);
  const [originalListView] = useState(listView);

  const handleSaveSettings = () => {
    // kept for backward-compat if called directly
    saveTheme();
    saveSettings();
    // Reset unsaved changes flag
    setHasUnsavedChanges(false);
  };

  const handleDiscardChanges = () => {
    // Revert to original values without saving
    setTheme(originalTheme);
    setListView(originalListView);
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    // kept for backward-compat if called directly
    resetAllData();
  };

  // Track unsaved changes
  useEffect(() => {
    const themeChanged = theme !== originalTheme;
    const layoutChanged = listView !== originalListView;
    setHasUnsavedChanges(themeChanged || layoutChanged);
  }, [theme, listView, originalTheme, originalListView]);

  // Store pending navigation path globally so sidebar can access it
  useEffect(() => {
    if (hasUnsavedChanges) {
      // Store the current state to prevent navigation
      window.__settingsHasUnsavedChanges = true;
      window.__showSettingsConfirm = setNavigationOpen;
      window.__setPendingSettingsPath = setPendingPath;
    } else {
      window.__settingsHasUnsavedChanges = false;
    }
  }, [hasUnsavedChanges]);

  // Intercept all navigation and show confirmation if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    const handlePopState = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        setNavigationOpen(true);
        // Prevent the navigation
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);

  return (
    <div className="max-w-xl mx-auto">
      <h1
        className="text-3xl font-bold mb-6"
        style={{
          color: theme === 'christmas' ? '#0b5e15' : theme === 'dark' ? '#ffffff' : 'transparent',
          backgroundImage: theme === 'christmas' || theme === 'dark' ? 'none' : 'var(--accent-text-gradient)',
          backgroundClip: theme === 'christmas' || theme === 'dark' ? 'unset' : 'text',
          WebkitBackgroundClip: theme === 'christmas' || theme === 'dark' ? 'unset' : 'text'
        }}
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
            onClick={() => setSaveOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
          >
            Save Setting Preference
          </button>

          <button
            onClick={() => setResetOpen(true)}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700"
          >
            Reset Quiz History &amp; Settings
          </button>
        </div>

        <ConfirmModal
          isOpen={saveOpen}
          title="Save settings?"
          message="Save your current theme and layout settings?"
          onConfirm={() => {
            handleSaveSettings();
            setSaveOpen(false);
          }}
          onCancel={() => setSaveOpen(false)}
          confirmText="Confirm"
          confirmColor="bg-blue-600"
          confirmHover="hover:bg-blue-700"
        />

        <ConfirmModal
          isOpen={resetOpen}
          title="Reset all data?"
          message="Are you sure? This action can't be undone."
          onConfirm={() => {
            handleReset();
            setResetOpen(false);
          }}
          onCancel={() => setResetOpen(false)}
          confirmText="Confirm"
          confirmColor="bg-red-600"
          confirmHover="hover:bg-red-700"
        />

        <ConfirmModal
          isOpen={navigationOpen}
          title="Leave Settings?"
          message="You're leaving the Settings page. Make sure to save your changes first!"
          onConfirm={() => {
            setNavigationOpen(false);
            handleDiscardChanges();
            if (pendingPath) {
              navigate(pendingPath);
            }
          }}
          onCancel={() => {
            setNavigationOpen(false);
            setPendingPath(null);
          }}
          confirmText="Leave"
          cancelText="Stay"
          confirmColor="bg-orange-600"
          confirmHover="hover:bg-orange-700"
        />
      </div>
    </div>
  );
}
