import { useMemo, useState } from 'react';
import { buildPartyMatrix, getPartyRiskLevel, getPartyStats } from '../utils/partyMatrix';

const RISK_STYLES = {
  critical: 'bg-red-500/10 border-red-500/30 text-red-400',
  elevated: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  moderate: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  low: 'bg-green-500/10 border-green-500/30 text-green-400',
  none: 'bg-navy-800/30 border-navy-700 text-slate-500',
};

export default function PartyObligationsMatrix({ obligations = [], parties = [] }) {
  const [expandedParty, setExpandedParty] = useState(null);

  const { matrix } = useMemo(() => buildPartyMatrix(obligations, parties), [obligations, parties]);
  const stats = useMemo(() => getPartyStats(matrix), [matrix]);

  if (stats.partyCount === 0) return null;

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6" id="party-matrix">
      <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
        Party Obligations Matrix
      </h2>
      <p className="text-slate-500 text-sm mb-4">
        {stats.totalObligations} obligations across {stats.partyCount} parties
        {stats.mostObligated && <span> — most obligated: <span className="text-teal-400">{stats.mostObligated}</span></span>}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(matrix).map(([party, data]) => {
          const risk = getPartyRiskLevel(data);
          const isExpanded = expandedParty === party;
          return (
            <div key={party} className={`rounded-lg border p-4 transition-colors ${RISK_STYLES[risk]}`}>
              <button
                onClick={() => setExpandedParty(isExpanded ? null : party)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">{party}</h3>
                  <span className="text-xs capitalize px-2 py-0.5 rounded bg-navy-800/50">{risk} risk</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <span>
                    <span className="text-red-400 font-medium">{data.high.length}</span>
                    <span className="text-slate-600 ml-1">high</span>
                  </span>
                  <span>
                    <span className="text-amber-400 font-medium">{data.medium.length}</span>
                    <span className="text-slate-600 ml-1">medium</span>
                  </span>
                  <span>
                    <span className="text-green-400 font-medium">{data.low.length}</span>
                    <span className="text-slate-600 ml-1">low</span>
                  </span>
                  <span className="text-slate-500 ml-auto">{data.total} total</span>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-navy-700/50 space-y-1.5">
                  {[...data.high, ...data.medium, ...data.low].map((o, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        o.priority === 'High' ? 'bg-red-400' : o.priority === 'Low' ? 'bg-green-400' : 'bg-amber-400'
                      }`} />
                      <div>
                        <p className="text-xs text-slate-300">{o.description}</p>
                        {o.deadline && <p className="text-xs text-slate-600">{o.deadline}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
