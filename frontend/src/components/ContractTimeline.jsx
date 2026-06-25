import { useMemo, useState } from 'react';
import { buildTimeline, getTimelineSpan } from '../utils/timeline';

const COLOR_MAP = {
  red: { dot: 'bg-red-400', line: 'border-red-500/30', bg: 'bg-red-500/5', text: 'text-red-400' },
  amber: { dot: 'bg-amber-400', line: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400' },
  green: { dot: 'bg-green-400', line: 'border-green-500/30', bg: 'bg-green-500/5', text: 'text-green-400' },
  teal: { dot: 'bg-teal-400', line: 'border-teal-500/30', bg: 'bg-teal-500/5', text: 'text-teal-400' },
  slate: { dot: 'bg-slate-400', line: 'border-slate-500/30', bg: 'bg-slate-500/5', text: 'text-slate-400' },
};

export default function ContractTimeline({ data }) {
  const [filter, setFilter] = useState('all');
  const { dated, undated } = useMemo(() => buildTimeline(data), [data]);
  const span = useMemo(() => getTimelineSpan(dated), [dated]);

  const visible = filter === 'all' ? dated : dated.filter(e => e.type === filter);

  if (dated.length === 0 && undated.length === 0) return null;

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6" id="timeline">
      <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Contract Timeline
      </h2>
      <p className="text-slate-500 text-sm mb-4">
        {dated.length} events{span ? ` spanning ${span.diffDays} days` : ''}
        {undated.length > 0 && ` · ${undated.length} undated`}
      </p>

      <div className="flex gap-2 mb-4">
        {['all', 'date', 'obligation'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-teal-400/10 text-teal-400 border border-teal-500/30'
                : 'bg-navy-800 text-slate-500 border border-navy-700 hover:text-white'
            }`}
          >
            {f === 'all' ? 'All' : f === 'date' ? 'Key Dates' : 'Obligations'}
          </button>
        ))}
      </div>

      <div className="relative">
        {visible.map((event, i) => {
          const colors = COLOR_MAP[event.color] || COLOR_MAP.slate;
          return (
            <div key={i} className="flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${colors.dot} shrink-0 mt-1.5`} />
                {i < visible.length - 1 && <div className="w-px flex-1 bg-navy-700 mt-1" />}
              </div>
              <div className={`flex-1 rounded-lg p-3 ${colors.bg} border ${colors.line}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-white">{event.label}</p>
                  <span className={`text-xs shrink-0 ${colors.text}`}>
                    {event.type === 'obligation' ? 'Obligation' : 'Date'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500">{event.date}</span>
                  {event.party && <span className="text-xs text-slate-600">{event.party}</span>}
                  {event.significance && <span className="text-xs text-slate-600">{event.significance}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {undated.length > 0 && (
        <div className="mt-4 pt-4 border-t border-navy-700">
          <p className="text-xs text-slate-600 mb-2">Undated Events</p>
          <div className="space-y-1.5">
            {undated.map((event, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                <span className="text-slate-400">{event.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
