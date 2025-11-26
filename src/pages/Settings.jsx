import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Settings</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Theme</h2>
        <p className="text-sm text-gray-600 mb-3">Choose a theme. It will be persisted to localStorage.</p>

        <label className="block">
          <select
            aria-label="Select theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="ash">Ash</option>
            <option value="dark">Dark</option>
            <option value="white">White</option>
          </select>
        </label>
      </section>

      <section>
        <h3 className="text-md font-medium mb-2">Preview</h3>
        <div className="p-4 rounded-md shadow-sm">
          <p>Current theme: <strong>{theme}</strong></p>
        </div>
      </section>
    </div>
  );
}
