import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/ui/sidebar.jsx";

import Home from "./pages/Home.jsx";
import Quiz from "./pages/Quiz.jsx";
import Score from "./pages/Score.jsx";
import Settings from "./pages/Settings.jsx";
import About from "./pages/About.jsx";

function App() {
  return (
    <div 
      className="min-h-screen"
      style={{ background: 'var(--background)' }}
    >
      <Sidebar />

      <main
        className="
          max-w-6xl mx-auto
          px-4 sm:px-6 lg:px-8
          pt-24 pb-16
        "
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/score" element={<Score />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
