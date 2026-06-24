import { useState, useMemo } from 'react';
import { computeDiff, getDiffStats } from '../utils/diff';

export default function RedlineDiffViewer() {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [hideUnchanged, setHideUnchanged] = useState(false);

  const diff = useMemo(() => {
    if (!showDiff || !oldText || !newText) return [];
    return computeDiff(oldText, newText);
  }, [oldText, newText, showDiff]);

  const stats = useMemo(() => getDiffStats(diff), [diff]);

  const visibleDiff = hideUnchanged ? diff.filter(d => d.type !== 'unchanged') : diff;

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6" id="redline">
      <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
        Redline Diff Viewer
      </h2>
      <p className="text-slate-500 text-sm mb-4">Compare two versions of contract text</p>

      {!showDiff ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Original Version</label>
              <textarea
                value={oldText}
                onChange={e => setOldText(e.target.value)}
                placeholder="Paste original contract text..."
                rows={8}
                className="w-full px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Revised Version</label>
              <textarea
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder="Paste revised contract text..."
                rows={8}
                className="w-full px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>
          </div>
          <button
            onClick={() => setShowDiff(true)}
            disabled={!oldText.trim() || !newText.trim()}
            className="px-4 py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-sm font-medium transition-colors border border-teal-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Compare Versions
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-green-500/20 border border-green-500/40" />
                <span className="text-green-400">{stats.added} added</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/40" />
                <span className="text-red-400">{stats.removed} removed</span>
              </span>
              <span className="text-slate-600">{stats.unchanged} unchanged</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideUnchanged}
                  onChange={e => setHideUnchanged(e.target.checked)}
                  className="rounded border-navy-600 bg-navy-800"
                />
                Hide unchanged
              </label>
              <button
                onClick={() => setShowDiff(false)}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-navy-700 overflow-hidden max-h-96 overflow-y-auto">
            {visibleDiff.map((line, i) => (
              <div
                key={i}
                className={`flex text-sm font-mono ${
                  line.type === 'added'
                    ? 'bg-green-500/5 border-l-2 border-green-500'
                    : line.type === 'removed'
                      ? 'bg-red-500/5 border-l-2 border-red-500'
                      : 'border-l-2 border-transparent'
                }`}
              >
                <span className="w-10 shrink-0 text-right pr-2 py-1 text-slate-700 select-none text-xs">
                  {line.lineOld || ''}
                </span>
                <span className="w-10 shrink-0 text-right pr-2 py-1 text-slate-700 select-none text-xs">
                  {line.lineNew || ''}
                </span>
                <span className="w-6 shrink-0 text-center py-1 select-none text-xs">
                  {line.type === 'added' ? (
                    <span className="text-green-400">+</span>
                  ) : line.type === 'removed' ? (
                    <span className="text-red-400">-</span>
                  ) : null}
                </span>
                <span className={`flex-1 py-1 pr-3 ${
                  line.type === 'added' ? 'text-green-300' : line.type === 'removed' ? 'text-red-300 line-through' : 'text-slate-400'
                }`}>
                  {line.content || ' '}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
