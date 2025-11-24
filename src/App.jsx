import { Sidebar } from "./components/ui/sidebar.jsx";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Quiz from "./pages/Quiz.jsx";
import Score from "./pages/Score.jsx";
import Settings from "./pages/Settings.jsx";
import About from "./pages/About.jsx";

function App() {
  return (
    <div className="flex">
      {/* Sidebar is fixed on the left */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ml-64">
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
