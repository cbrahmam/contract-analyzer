import { useMemo } from 'react';
import { getHistory } from '../utils/history';

const riskColors = {
  Low: { bar: 'bg-green-400', text: 'text-green-400' },
  Medium: { bar: 'bg-amber-400', text: 'text-amber-400' },
  High: { bar: 'bg-red-400', text: 'text-red-400' },
};

export default function StatsPage({ onBack }) {
  const stats = useMemo(() => {
    const history = getHistory();
    if (history.length === 0) return null;

    const riskCounts = { Low: 0, Medium: 0, High: 0 };
    const typeCounts = {};
    let totalRisks = 0;
    let totalObligations = 0;
    let totalTerms = 0;

    for (const entry of history) {
      riskCounts[entry.riskScore] = (riskCounts[entry.riskScore] || 0) + 1;
      typeCounts[entry.documentType] = (typeCounts[entry.documentType] || 0) + 1;

      if (entry.data) {
        totalRisks += entry.data.risk_flags?.length || 0;
        totalObligations += entry.data.obligations?.length || 0;
        totalTerms += entry.data.key_terms?.length || 0;
      }
    }

    const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

    return {
      total: history.length,
      riskCounts,
      sortedTypes,
      totalRisks,
      totalObligations,
      totalTerms,
      avgRisks: (totalRisks / history.length).toFixed(1),
      avgObligations: (totalObligations / history.length).toFixed(1),
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={onBack} className="text-slate-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
      <p className="text-slate-400 mb-8">Insights from your analyzed contracts</p>

      {!stats ? (
        <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-12 text-center">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <p className="text-slate-400">No data yet. Analyze some contracts to see insights.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Documents Analyzed', value: stats.total, color: 'text-teal-400' },
              { label: 'Total Risks Found', value: stats.totalRisks, color: 'text-red-400' },
              { label: 'Total Obligations', value: stats.totalObligations, color: 'text-amber-400' },
              { label: 'Total Key Terms', value: stats.totalTerms, color: 'text-blue-400' },
            ].map(card => (
              <div key={card.label} className="rounded-xl border border-navy-700 bg-navy-900/50 p-5">
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-slate-500 text-sm mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6">
              <h3 className="text-white font-semibold mb-4">Risk Distribution</h3>
              <div className="space-y-4">
                {Object.entries(stats.riskCounts).map(([level, count]) => {
                  const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={level}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${riskColors[level]?.text || ''}`}>{level} Risk</span>
                        <span className="text-slate-500 text-sm">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${riskColors[level]?.bar || ''}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6">
              <h3 className="text-white font-semibold mb-4">Document Types</h3>
              <div className="space-y-3">
                {stats.sortedTypes.map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">{type}</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-400/10 text-teal-400 text-xs font-medium">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6">
              <h3 className="text-white font-semibold mb-2">Avg Risks per Contract</h3>
              <p className="text-4xl font-bold text-red-400">{stats.avgRisks}</p>
            </div>
            <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6">
              <h3 className="text-white font-semibold mb-2">Avg Obligations per Contract</h3>
              <p className="text-4xl font-bold text-amber-400">{stats.avgObligations}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
