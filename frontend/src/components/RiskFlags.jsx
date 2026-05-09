const severityOrder = { high: 0, medium: 1, low: 2 };
const severityColors = {
  high: { border: 'border-red-500/30', bg: 'bg-red-500/5', badge: 'bg-red-500/10 text-red-400 border-red-500/30', icon: 'text-red-400' },
  medium: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: 'text-amber-400' },
  low: { border: 'border-green-500/30', bg: 'bg-green-500/5', badge: 'bg-green-500/10 text-green-400 border-green-500/30', icon: 'text-green-400' },
};

export default function RiskFlags({ risks }) {
  if (risks.length === 0) return null;

  const sorted = [...risks].sort((a, b) => (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2));

  return (
    <section id="risks" className="animate-fadeIn">
      <div className="rounded-xl border border-navy-700 bg-navy-900/50 overflow-hidden">
        <div className="p-6 border-b border-navy-800">
          <h3 className="text-white font-semibold">Risk Flags</h3>
        </div>
        <div className="p-4 space-y-3">
          {sorted.map((r, i) => {
            const colors = severityColors[r.severity] || severityColors.low;
            return (
              <div key={i} className={`rounded-lg border ${colors.border} ${colors.bg} p-5`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <svg className={`w-5 h-5 shrink-0 ${colors.icon}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                    </svg>
                    <span className="text-white font-medium">{r.risk}</span>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${colors.badge}`}>
                    {r.severity}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-3 ml-7">{r.description}</p>
                <div className="ml-7 flex items-start gap-2 text-sm">
                  <span className="text-teal-400 font-medium shrink-0">Recommendation:</span>
                  <span className="text-slate-300">{r.recommendation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
