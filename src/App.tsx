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
      case 1: return 'from-amber-50 to-yellow-50 border-l-4 border-yellow-400';
      case 2: return 'from-slate-50 to-gray-50 border-l-4 border-gray-400';
      case 3: return 'from-orange-50 to-amber-50 border-l-4 border-orange-400';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">🚀</span>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                  HPL Performance Scoreboard
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-indigo-100 font-medium">
                高效能運算課程實測排名 · 即時更新
              </p>
              <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                v1.1 · Total {scores.length} Submissions
              </div>
            </div>
          </div>
        </div>

        {/* Scoreboard Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50">
          {/* Stats Bar */}
          {scores.length > 0 && (
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-4 border-b border-slate-200 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-slate-500 font-semibold uppercase">Top Score</div>
                <div className="text-2xl font-bold text-indigo-600">{scores[0]?.gflops.toFixed(2)}</div>
              </div>
              <div className="text-center border-x border-slate-300">
                <div className="text-xs text-slate-500 font-semibold uppercase">Average</div>
                <div className="text-2xl font-bold text-purple-600">
                  {(scores.reduce((sum, s) => sum + s.gflops, 0) / scores.length).toFixed(2)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 font-semibold uppercase">Submissions</div>
                <div className="text-2xl font-bold text-pink-600">{scores.length}</div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-indigo-200">
                <tr className="text-slate-700 text-xs sm:text-sm uppercase font-bold">
                  <th className="px-4 sm:px-6 py-5">Rank</th>
                  <th className="px-4 sm:px-6 py-5">Student ID</th>
                  <th className="px-4 sm:px-6 py-5">Performance</th>
                  <th className="px-4 sm:px-6 py-5">Configuration</th>
                  <th className="px-4 sm:px-6 py-5">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scores.map((s, i) => {
                  const rank = i + 1;
                  const medal = getMedalEmoji(rank);
                  return (
                    <tr 
                      key={s.id} 
                      className={`hover:bg-indigo-50/50 transition-all duration-200 hover:shadow-md ${getRankColor(rank)} group`}
                    >
                      <td className="px-4 sm:px-6 py-5">
                        <div className="flex items-center gap-2">
                          {medal && <span className="text-2xl animate-pulse">{medal}</span>}
                          <span className={`font-black text-lg ${rank <= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
                            #{rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-5">
                        <span className="font-semibold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                          {s.user_id}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-mono text-indigo-600 font-black text-xl">
                            {s.gflops.toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">GFLOPS</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-5">
                        <div className="flex gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            N: {s.problem_size_n}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                            NB: {s.block_size_nb}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-5">
                        <div className="text-slate-500 text-sm">
                          <div className="font-medium">{new Date(s.submitted_at).toLocaleDateString('zh-TW')}</div>
                          <div className="text-xs text-slate-400">{new Date(s.submitted_at).toLocaleTimeString('zh-TW')}</div>
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
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No submissions yet</h3>
              <p className="text-slate-500">Waiting for performance data...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Updates automatically · Powered by HPL Benchmark</p>
        </div>
      </div>
    </div>
  );
}

export default App;