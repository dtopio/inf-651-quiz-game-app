import { useState } from "react";
import { Sidebar } from "./components/ui/sidebar.jsx";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Quiz from "./pages/Quiz.jsx";
import Score from "./pages/Score.jsx";
import Settings from "./pages/Settings.jsx";
import About from "./pages/About.jsx";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--background)' }}
    >

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main content */}
      <main
        className={`
          flex-1 
          h-screen
          overflow-y-auto
          transition-all duration-300
          ${isSidebarOpen ? "md:ml-64" : "ml-0"}
        `}
      >
        <div className="max-w-6xl mx-auto px-6 py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/score" element={<Score />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
