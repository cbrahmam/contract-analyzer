import { useMemo } from 'react';
import clauseLibrary from '../data/clauseLibrary';

export default function ClauseChecklist({ documentType, keyTerms }) {
  const checklist = useMemo(() => {
    const matchedType = Object.keys(clauseLibrary).find(
      t => documentType.toLowerCase().includes(t.toLowerCase()) ||
           t.toLowerCase().includes(documentType.toLowerCase())
    );

    if (!matchedType) return null;

    const termTexts = keyTerms.map(t => t.term.toLowerCase());
    const summaryTexts = keyTerms.map(t => t.summary.toLowerCase());
    const allText = [...termTexts, ...summaryTexts].join(' ');

    return clauseLibrary[matchedType].map(item => ({
      ...item,
      found: item.clause.toLowerCase().split(/\s+/).some(word =>
        word.length > 3 && allText.includes(word)
      ),
    }));
  }, [documentType, keyTerms]);

  if (!checklist) return null;

  const foundCount = checklist.filter(c => c.found).length;
  const essentialMissing = checklist.filter(c => c.essential && !c.found);

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6" id="checklist">
      <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Clause Checklist
      </h2>
      <p className="text-slate-500 text-sm mb-4">{foundCount}/{checklist.length} standard clauses detected</p>

      {essentialMissing.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
          <p className="text-red-400 text-sm font-medium mb-1">Missing Essential Clauses</p>
          <ul className="space-y-1">
            {essentialMissing.map(c => (
              <li key={c.clause} className="text-red-400/80 text-sm flex items-center gap-2">
                <span>✕</span> {c.clause}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        {checklist.map(item => (
          <div
            key={item.clause}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              item.found ? 'bg-green-500/5' : 'bg-navy-800/50'
            }`}
          >
            <span className={`text-sm ${item.found ? 'text-green-400' : 'text-slate-600'}`}>
              {item.found ? '✓' : '○'}
            </span>
            <span className={`text-sm ${item.found ? 'text-slate-300' : 'text-slate-500'}`}>
              {item.clause}
            </span>
            {item.essential && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 ml-auto">
                Essential
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
