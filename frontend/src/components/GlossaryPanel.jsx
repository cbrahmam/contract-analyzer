import { useState, useMemo } from 'react';
import legalGlossary from '../data/legalGlossary';

export default function GlossaryPanel({ data }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const matchedTerms = useMemo(() => {
    const allText = [
      data.executive_summary,
      ...data.key_terms.map(t => `${t.term} ${t.summary}`),
      ...data.obligations.map(o => o.description),
      ...data.risk_flags.map(r => `${r.risk} ${r.description} ${r.recommendation}`),
    ].join(' ').toLowerCase();

    const found = [];
    for (const [term, definition] of Object.entries(legalGlossary)) {
      const words = term.split(' ');
      const inContract = words.every(w => allText.includes(w));
      if (inContract) {
        found.push({ term, definition });
      }
    }

    return found.sort((a, b) => a.term.localeCompare(b.term));
  }, [data]);

  const filtered = search
    ? matchedTerms.filter(t =>
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase())
      )
    : matchedTerms;

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6" id="glossary">
      <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        Legal Glossary
      </h2>
      <p className="text-slate-500 text-sm mb-4">{matchedTerms.length} legal terms detected in this contract</p>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search terms..."
        className="w-full px-3 py-2 mb-4 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
      />

      {filtered.length === 0 ? (
        <p className="text-slate-600 text-sm text-center py-4">No matching terms found.</p>
      ) : (
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {filtered.map(({ term, definition }) => (
            <div key={term}>
              <button
                onClick={() => setExpanded(expanded === term ? null : term)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-navy-800/50 transition-colors text-left"
              >
                <span className="text-sm font-medium text-white capitalize">{term}</span>
                <svg
                  className={`w-4 h-4 text-slate-500 transition-transform ${expanded === term ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {expanded === term && (
                <div className="px-3 pb-3 pt-0">
                  <p className="text-slate-400 text-sm leading-relaxed pl-3 border-l-2 border-teal-500/30">
                    {definition}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
