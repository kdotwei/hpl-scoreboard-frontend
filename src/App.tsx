import { useEffect, useState } from 'react';

interface Score {
  id: string;
  user_id: string;
  gflops: number;
  problem_size_n: number;
  block_size_nb: number;
  submitted_at: string;
}

function App() {
  const [scores, setScores] = useState<Score[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 初始化時檢查系統偏好設定
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // 串接後端公開 API
    fetch('http://localhost:8080/api/v1/scores?limit=20')
      .then((res) => res.json())
      .then((data) => setScores(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    // 監聽系統主題變化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return null;
    }
  };

  const getRankColor = (rank: number) => {
    if (isDarkMode) {
      switch (rank) {
        case 1: return 'bg-amber-500/10 border-l-2 border-amber-400/40';
        case 2: return 'bg-slate-500/10 border-l-2 border-slate-400/40';
        case 3: return 'bg-orange-500/10 border-l-2 border-orange-400/40';
        default: return '';
      }
    }
    switch (rank) {
      case 1: return 'bg-amber-500/5 border-l-2 border-amber-400/30';
      case 2: return 'bg-slate-500/5 border-l-2 border-slate-400/30';
      case 3: return 'bg-orange-500/5 border-l-2 border-orange-400/30';
      default: return '';
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900' 
        : 'bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header - Glassmorphism */}
        <div className={`backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-slate-800/40 border border-slate-700/60' 
            : 'bg-white/40 border border-white/60'
        }`}>
          <div className={`backdrop-blur-sm px-6 py-8 sm:px-8 sm:py-10 flex justify-between items-center ${
            isDarkMode 
              ? 'bg-gradient-to-r from-slate-700/90 to-slate-600/90' 
              : 'bg-gradient-to-r from-slate-900/90 to-slate-800/90'
          }`}>
            <div>
              <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-1">
                HPL Performance Scoreboard
              </h1>
              <p className="text-base text-white/80 font-light">
                高效能運算課程實測排名
              </p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-amber-400/20 hover:bg-amber-400/30' 
                  : 'bg-slate-700/20 hover:bg-slate-700/30'
              }`}
              aria-label="Toggle dark mode"
            >
              <span className="text-2xl">{isDarkMode ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Glass Cards */}
        {scores.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className={`backdrop-blur-lg rounded-2xl p-4 sm:p-5 shadow-lg transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800/50 border border-slate-700/60' 
                : 'bg-white/50 border border-white/60'
            }`}>
              <div className={`text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300/90' : 'text-slate-600/90'}`}>Top Score</div>
              <div className={`text-2xl sm:text-3xl font-light ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{scores[0]?.gflops.toFixed(2)}</div>
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400/80' : 'text-slate-500/80'}`}>GFLOPS</div>
            </div>
            <div className={`backdrop-blur-lg rounded-2xl p-4 sm:p-5 shadow-lg transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800/50 border border-slate-700/60' 
                : 'bg-white/50 border border-white/60'
            }`}>
              <div className={`text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300/90' : 'text-slate-600/90'}`}>Average</div>
              <div className={`text-2xl sm:text-3xl font-light ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {(scores.reduce((sum, s) => sum + s.gflops, 0) / scores.length).toFixed(2)}
              </div>
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400/80' : 'text-slate-500/80'}`}>GFLOPS</div>
            </div>
            <div className={`backdrop-blur-lg rounded-2xl p-4 sm:p-5 shadow-lg transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800/50 border border-slate-700/60' 
                : 'bg-white/50 border border-white/60'
            }`}>
              <div className={`text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300/90' : 'text-slate-600/90'}`}>Total</div>
              <div className={`text-2xl sm:text-3xl font-light ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{scores.length}</div>
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400/80' : 'text-slate-500/80'}`}>Submissions</div>
            </div>
          </div>
        )}

        {/* Scoreboard - Glass Surface */}
        <div className={`backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-slate-800/60 border border-slate-700/70' 
            : 'bg-white/60 border border-white/70'
        }`}>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`backdrop-blur-sm transition-colors duration-300 ${
                  isDarkMode 
                    ? 'border-b border-slate-700/40 bg-slate-700/30' 
                    : 'border-b border-white/40 bg-white/30'
                }`}>
                  <th className={`px-4 sm:px-6 py-4 text-left text-sm font-medium ${isDarkMode ? 'text-slate-200/90' : 'text-slate-700/90'}`}>Rank</th>
                  <th className={`px-4 sm:px-6 py-4 text-left text-sm font-medium ${isDarkMode ? 'text-slate-200/90' : 'text-slate-700/90'}`}>Student ID</th>
                  <th className={`px-4 sm:px-6 py-4 text-left text-sm font-medium ${isDarkMode ? 'text-slate-200/90' : 'text-slate-700/90'}`}>Performance</th>
                  <th className={`px-4 sm:px-6 py-4 text-left text-sm font-medium ${isDarkMode ? 'text-slate-200/90' : 'text-slate-700/90'}`}>Configuration</th>
                  <th className={`px-4 sm:px-6 py-4 text-left text-sm font-medium ${isDarkMode ? 'text-slate-200/90' : 'text-slate-700/90'}`}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => {
                  const rank = i + 1;
                  const medal = getMedalEmoji(rank);
                  return (
                    <tr 
                      key={s.id} 
                      className={`backdrop-blur-sm transition-colors ${getRankColor(rank)} ${
                        isDarkMode 
                          ? 'border-b border-slate-700/30 hover:bg-slate-700/40' 
                          : 'border-b border-white/30 hover:bg-white/40'
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          {medal && <span className="text-xl">{medal}</span>}
                          <span className={`text-sm font-medium ${
                            rank <= 3 
                              ? isDarkMode ? 'text-white' : 'text-slate-900'
                              : isDarkMode ? 'text-slate-400/80' : 'text-slate-600/80'
                          }`}>
                            #{rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {s.user_id}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <div className={`text-lg font-semibold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {s.gflops.toFixed(2)}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-slate-400/80' : 'text-slate-500/80'}`}>GFLOPS</div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-slate-700/60 text-slate-200 border border-slate-600/60' 
                              : 'bg-white/60 text-slate-700 border border-white/60'
                          }`}>
                            N: {s.problem_size_n}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-slate-700/60 text-slate-200 border border-slate-600/60' 
                              : 'bg-white/60 text-slate-700 border border-white/60'
                          }`}>
                            NB: {s.block_size_nb}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className={`text-sm ${isDarkMode ? 'text-slate-200/90' : 'text-slate-700/90'}`}>
                          {new Date(s.submitted_at).toLocaleDateString('zh-TW')}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-400/80' : 'text-slate-500/80'}`}>
                          {new Date(s.submitted_at).toLocaleTimeString('zh-TW')}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {scores.length === 0 && (
            <div className="text-center py-16 px-4 backdrop-blur-sm">
              <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-slate-200/90' : 'text-slate-700/90'}`}>No submissions yet</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400/80' : 'text-slate-500/80'}`}>Waiting for performance data...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className={`text-sm ${isDarkMode ? 'text-slate-400/70' : 'text-slate-600/70'}`}>Updates automatically</p>
        </div>
      </div>
    </div>
  );
}

export default App;