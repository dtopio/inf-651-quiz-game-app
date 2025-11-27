export default function About() {
  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        {/* Header / Hero */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-3xl">
              🎯
            </div>

            <div>
              <h1 className="text-3xl font-extrabold leading-tight bg-clip-text text-white">
                Quiz Game App
              </h1>
              <p className="text-sm opacity-90 mt-1">
                A responsive, accessible quiz experience built with React, Vite,
                and Tailwind CSS.
              </p>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 px-6 py-6 md:px-10 md:py-8">
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            This project demonstrates a clean, mobile-first UI for taking
            short quizzes. It supports multiple categories, local progress
            saving, and friendly feedback after submission.
          </p>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 shadow-sm">
              <div className="text-2xl mb-2">⚡️</div>
              <h3 className="text-sm font-semibold text-slate-900">Fast & Lightweight</h3>
              <p className="text-xs text-slate-600 mt-1">Built with Vite for a snappy dev and user experience.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 shadow-sm">
              <div className="text-2xl mb-2">💾</div>
              <h3 className="text-sm font-semibold text-slate-900">Resume Progress</h3>
              <p className="text-xs text-slate-600 mt-1">Quiz progress is stored locally so you can pick up where you left off.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 shadow-sm">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-sm font-semibold text-slate-900">Multiple Categories</h3>
              <p className="text-xs text-slate-600 mt-1">Try different topics (Science, History, Art, etc.) to challenge yourself.</p>
            </div>
          </div>

          <hr className="my-4" />

          {/* Contributors */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Creators</h2>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                  DT
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    Danil Top
                  </div>
                  <div className="text-xs text-slate-500">Contributor</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                  PE
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    Pichmarina El
                  </div>
                  <div className="text-xs text-slate-500">Contributor</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
                  RT
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    Rothrithyvong Thay
                  </div>
                  <div className="text-xs text-slate-500">Contributor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
