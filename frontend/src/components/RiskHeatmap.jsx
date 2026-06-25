import { useMemo } from 'react';
import { categorizeRisks, getHeatmapColor, getRiskSummary } from '../utils/riskHeatmap';

const SEVERITIES = ['High', 'Medium', 'Low'];

export default function RiskHeatmap({ risks = [] }) {
  const categories = useMemo(() => categorizeRisks(risks), [risks]);
  const summary = useMemo(() => getRiskSummary(categories), [categories]);

  const maxCount = useMemo(() => {
    let max = 0;
    for (const cat of Object.values(categories)) {
      for (const sev of SEVERITIES) {
        if (cat[sev] > max) max = cat[sev];
      }
    }
    return max;
  }, [categories]);

  const categoryNames = Object.keys(categories).sort();

  if (risks.length === 0) return null;

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6" id="heatmap">
      <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
        </svg>
        Risk Heatmap
      </h2>
      <p className="text-slate-500 text-sm mb-4">
        {summary.categoryCount} risk categories across {risks.length} flags
        {summary.hotspotCategory && <span> — hotspot: <span className="text-amber-400">{summary.hotspotCategory}</span></span>}
      </p>

      <div className="flex gap-4 mb-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/40" />
          <span className="text-red-400">{summary.totalHigh} High</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/15 border border-amber-500/40" />
          <span className="text-amber-400">{summary.totalMedium} Medium</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-500/10 border border-green-500/40" />
          <span className="text-green-400">{summary.totalLow} Low</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs text-slate-600 font-medium pb-2 pr-4">Category</th>
              {SEVERITIES.map(s => (
                <th key={s} className="text-center text-xs text-slate-600 font-medium pb-2 px-2 w-20">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categoryNames.map(cat => (
              <tr key={cat}>
                <td className="text-sm text-slate-300 py-1.5 pr-4">{cat}</td>
                {SEVERITIES.map(sev => {
                  const count = categories[cat][sev];
                  const color = getHeatmapColor(count, maxCount);
                  return (
                    <td key={sev} className="px-2 py-1.5">
                      <div className={`text-center text-sm font-medium rounded-lg py-2 ${color.bg} ${color.text}`}>
                        {count}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
