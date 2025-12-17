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

  useEffect(() => {
    // 串接後端公開 API
    fetch('http://localhost:8080/api/v1/scores?limit=20')
      .then((res) => res.json())
      .then((data) => setScores(data))
      .catch((err) => console.error("Fetch error:", err));
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
    switch (rank) {
      case 1: return 'bg-amber-50/50';
      case 2: return 'bg-slate-50/50';
      case 3: return 'bg-orange-50/50';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header - Material 3 Surface Container */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="bg-neutral-900 px-6 py-8 sm:px-8 sm:py-10">
            <h1 className="text-3xl sm:text-4xl font-medium text-white tracking-tight mb-1">
              HPL Performance Scoreboard
            </h1>
            <p className="text-base text-neutral-300 font-normal">
              高效能運算課程實測排名
            </p>
          </div>
        </div>

        {/* Stats Cards - Material 3 Filled Cards */}
        {scores.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-neutral-100 rounded-2xl p-4 sm:p-5 border border-neutral-200">
              <div className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">Top Score</div>
              <div className="text-2xl sm:text-3xl font-medium text-neutral-900">{scores[0]?.gflops.toFixed(2)}</div>
              <div className="text-xs text-neutral-500 mt-1">GFLOPS</div>
            </div>
            <div className="bg-neutral-100 rounded-2xl p-4 sm:p-5 border border-neutral-200">
              <div className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">Average</div>
              <div className="text-2xl sm:text-3xl font-medium text-neutral-900">
                {(scores.reduce((sum, s) => sum + s.gflops, 0) / scores.length).toFixed(2)}
              </div>
              <div className="text-xs text-neutral-500 mt-1">GFLOPS</div>
            </div>
            <div className="bg-neutral-100 rounded-2xl p-4 sm:p-5 border border-neutral-200">
              <div className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">Total</div>
              <div className="text-2xl sm:text-3xl font-medium text-neutral-900">{scores.length}</div>
              <div className="text-xs text-neutral-500 mt-1">Submissions</div>
            </div>
          </div>
        )}

        {/* Scoreboard - Material 3 Elevated Surface */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-medium text-neutral-700">Rank</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-medium text-neutral-700">Student ID</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-medium text-neutral-700">Performance</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-medium text-neutral-700">Configuration</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-sm font-medium text-neutral-700">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => {
                  const rank = i + 1;
                  const medal = getMedalEmoji(rank);
                  return (
                    <tr 
                      key={s.id} 
                      className={`border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${getRankColor(rank)}`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          {medal && <span className="text-xl">{medal}</span>}
                          <span className={`text-sm font-medium ${rank <= 3 ? 'text-neutral-900' : 'text-neutral-600'}`}>
                            #{rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-sm font-medium text-neutral-900">
                          {s.user_id}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <div className="text-lg font-semibold text-neutral-900 font-mono">
                            {s.gflops.toFixed(2)}
                          </div>
                          <div className="text-xs text-neutral-500">GFLOPS</div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-300">
                            N: {s.problem_size_n}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-300">
                            NB: {s.block_size_nb}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm text-neutral-700">
                          {new Date(s.submitted_at).toLocaleDateString('zh-TW')}
                        </div>
                        <div className="text-xs text-neutral-500">
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
            <div className="text-center py-16 px-4">
              <h3 className="text-lg font-medium text-neutral-700 mb-2">No submissions yet</h3>
              <p className="text-sm text-neutral-500">Waiting for performance data...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-neutral-500">Updates automatically</p>
        </div>
      </div>
    </div>
  );
}

export default App;