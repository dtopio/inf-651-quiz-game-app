import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [listView, setListView] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("settings-listView");
    if (saved !== null) setListView(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("settings-listView", JSON.stringify(listView));
  }, [listView]);

  const resetAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <SettingsContext.Provider value={{ listView, setListView, resetAllData }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
