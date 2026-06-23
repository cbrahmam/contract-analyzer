import { useState } from 'react';
import { getAllDeadlines, deleteDeadline, exportToICS } from '../utils/deadlines';

const priorityColors = {
  high: 'text-red-400 bg-red-500/10',
  medium: 'text-amber-400 bg-amber-500/10',
  low: 'text-green-400 bg-green-500/10',
};

const typeIcons = {
  date: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
  obligation: 'M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75',
};

export default function DeadlinesPage({ onBack }) {
  const [deadlines, setDeadlines] = useState(getAllDeadlines);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? deadlines
    : deadlines.filter(d => d.type === filter);

  function handleDelete(id) {
    setDeadlines(deleteDeadline(id));
  }

  const groupedByFile = {};
  for (const d of filtered) {
    if (!groupedByFile[d.filename]) groupedByFile[d.filename] = [];
    groupedByFile[d.filename].push(d);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={onBack} className="text-slate-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Deadline Tracker</h1>
          <p className="text-slate-400">{deadlines.length} deadline{deadlines.length !== 1 ? 's' : ''} tracked across your contracts</p>
        </div>
        {deadlines.length > 0 && (
          <button
            onClick={() => exportToICS(filtered)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-sm font-medium transition-colors border border-teal-500/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Export to Calendar
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'date', label: 'Key Dates' },
          { key: 'obligation', label: 'Obligations' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-teal-400/10 text-teal-400 border border-teal-500/30'
                : 'bg-navy-800 text-slate-400 border border-navy-700 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-12 text-center">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
          </svg>
          <p className="text-slate-400">No deadlines tracked yet. Analyze a contract to automatically extract dates and deadlines.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByFile).map(([filename, items]) => (
            <div key={filename} className="rounded-xl border border-navy-700 bg-navy-900/50 overflow-hidden">
              <div className="px-5 py-3 border-b border-navy-800 bg-navy-800/30">
                <p className="text-white font-medium text-sm">{filename}</p>
              </div>
              <div className="divide-y divide-navy-800">
                {items.map(d => (
                  <div key={d.id} className="px-5 py-4 flex items-start gap-4 group">
                    <div className="shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={typeIcons[d.type]} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-teal-400 text-sm font-medium">{d.date}</span>
                        {d.priority && (
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${priorityColors[d.priority] || ''}`}>
                            {d.priority}
                          </span>
                        )}
                        <span className="text-slate-600 text-xs">{d.source}</span>
                      </div>
                      <p className="text-slate-300 text-sm">{d.title}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="shrink-0 p-1 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
