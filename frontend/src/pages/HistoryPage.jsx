import { useState } from 'react';
import { getHistory, deleteHistoryEntry, clearHistory } from '../utils/history';

const scoreColors = {
  Low: 'text-green-400 bg-green-500/10',
  Medium: 'text-amber-400 bg-amber-500/10',
  High: 'text-red-400 bg-red-500/10',
};

export default function HistoryPage({ onViewResult, onBack }) {
  const [history, setHistory] = useState(getHistory());

  function handleDelete(id) {
    deleteHistoryEntry(id);
    setHistory(getHistory());
  }

  function handleClear() {
    clearHistory();
    setHistory([]);
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={onBack} className="text-slate-500 hover:text-white text-sm mb-2 flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Analysis History</h1>
          <p className="text-slate-400 mt-1">{history.length} document{history.length !== 1 ? 's' : ''} analyzed</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors border border-red-500/30"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-12 text-center">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-400">No analyses yet. Upload a contract to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map(entry => (
            <div
              key={entry.id}
              className="rounded-xl border border-navy-700 bg-navy-900/50 p-5 hover:bg-navy-800/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onViewResult(entry)}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-teal-400/10 text-teal-400 text-xs font-medium">
                      {entry.documentType}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${scoreColors[entry.riskScore] || ''}`}>
                      {entry.riskScore} Risk
                    </span>
                  </div>
                  <p className="text-white font-medium truncate">{entry.filename}</p>
                  <p className="text-slate-500 text-sm mt-1 line-clamp-2">{entry.summary}</p>
                  <p className="text-slate-600 text-xs mt-2">{formatDate(entry.analyzedAt)}</p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="shrink-0 p-2 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
