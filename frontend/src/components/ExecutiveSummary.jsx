import CopyButton from './CopyButton';

export default function ExecutiveSummary({ summary, parties, riskExplanation }) {
  return (
    <section id="summary" className="space-y-4 animate-fadeIn">
      <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Executive Summary</h3>
          <CopyButton text={summary} />
        </div>
        <p className="text-slate-300 leading-relaxed">{summary}</p>
      </div>

      <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6">
        <h3 className="text-white font-semibold mb-4">Parties Involved</h3>
        <div className="flex flex-wrap gap-3">
          {parties.map((p, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-navy-800 border border-navy-700">
              <div className="w-8 h-8 rounded-full bg-teal-400/10 flex items-center justify-center">
                <span className="text-teal-400 text-sm font-semibold">{p.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{p.name}</p>
                <p className="text-slate-500 text-xs">{p.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6">
        <h3 className="text-white font-semibold mb-2">Risk Assessment</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{riskExplanation}</p>
      </div>
    </section>
  );
}
