import { useState } from 'react';

const priorityOrder = { high: 0, medium: 1, low: 2 };
const priorityColors = {
  high: 'bg-red-500/10 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  low: 'bg-green-500/10 text-green-400 border-green-500/30',
};

export default function ObligationsTracker({ obligations }) {
  const partyNames = [...new Set(obligations.map(o => o.party))];
  const [activeParty, setActiveParty] = useState(partyNames[0] || '');

  if (obligations.length === 0) return null;

  const filtered = obligations
    .filter(o => o.party === activeParty)
    .sort((a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2));

  return (
    <section id="obligations" className="animate-fadeIn">
      <div className="rounded-xl border border-navy-700 bg-navy-900/50 overflow-hidden">
        <div className="p-6 border-b border-navy-800">
          <h3 className="text-white font-semibold mb-4">Obligations</h3>
          <div className="flex gap-2 flex-wrap">
            {partyNames.map(name => (
              <button
                key={name}
                onClick={() => setActiveParty(name)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeParty === name
                    ? 'bg-teal-400/10 text-teal-400 border border-teal-400/30'
                    : 'bg-navy-800 text-slate-400 border border-navy-700 hover:text-white'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-navy-800">
          {filtered.map((o, i) => (
            <div key={i} className="p-5 hover:bg-navy-800/30 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="text-white text-sm font-medium">{o.description}</p>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[o.priority] || priorityColors.low}`}>
                  {o.priority}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span>{o.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
