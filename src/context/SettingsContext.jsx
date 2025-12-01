import { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

const LIST_VIEW_KEY = "settings-listView";

export function SettingsProvider({ children }) {
  const [listView, setListView] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = window.localStorage.getItem(LIST_VIEW_KEY);
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const saveSettings = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LIST_VIEW_KEY, JSON.stringify(listView));
    } catch {
      // ignore
    }
  };

  const resetAllData = () => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
    window.location.reload();
  };

  return (
    <SettingsContext.Provider
      value={{ listView, setListView, saveSettings, resetAllData }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
