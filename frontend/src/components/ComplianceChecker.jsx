import { useState, useMemo } from 'react';
import complianceRules from '../data/complianceRules';

export default function ComplianceChecker({ data }) {
  const [selectedFramework, setSelectedFramework] = useState('GDPR');

  const allText = useMemo(() => {
    return [
      data.executive_summary,
      ...data.key_terms.map(t => `${t.term} ${t.summary}`),
      ...data.obligations.map(o => `${o.description} ${o.deadline}`),
      ...data.risk_flags.map(r => `${r.risk} ${r.description} ${r.recommendation}`),
      data.risk_score_explanation,
    ].join(' ').toLowerCase();
  }, [data]);

  const results = useMemo(() => {
    const framework = complianceRules[selectedFramework];
    if (!framework) return [];

    return framework.checks.map(check => {
      const found = check.keywords.some(kw => allText.includes(kw.toLowerCase()));
      return { ...check, found };
    });
  }, [selectedFramework, allText]);

  const passCount = results.filter(r => r.found).length;
  const requiredMissing = results.filter(r => r.required && !r.found);
  const score = results.length > 0 ? Math.round((passCount / results.length) * 100) : 0;

  const framework = complianceRules[selectedFramework];

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6" id="compliance">
      <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        Compliance Check
      </h2>
      <p className="text-slate-500 text-sm mb-4">Check contract against regulatory frameworks</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(complianceRules).map(([key, fw]) => (
          <button
            key={key}
            onClick={() => setSelectedFramework(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedFramework === key
                ? 'bg-teal-400/10 text-teal-400 border border-teal-500/30'
                : 'bg-navy-800 text-slate-400 border border-navy-700 hover:text-white'
            }`}
          >
            {fw.name}
          </button>
        ))}
      </div>

      <div className="mb-4 p-4 rounded-lg bg-navy-800/30 border border-navy-700">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white font-medium text-sm">{framework.fullName}</p>
            <p className="text-slate-500 text-xs">{framework.description}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${score >= 70 ? 'text-green-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{score}%</p>
            <p className="text-slate-600 text-xs">{passCount}/{results.length} checks</p>
          </div>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${score >= 70 ? 'bg-green-400' : score >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {requiredMissing.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
          <p className="text-red-400 text-sm font-medium mb-1">Missing Required Provisions</p>
          <ul className="space-y-1">
            {requiredMissing.map(r => (
              <li key={r.id} className="text-red-400/80 text-sm flex items-center gap-2">
                <span>!</span> {r.rule}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-1.5">
        {results.map(check => (
          <div
            key={check.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              check.found ? 'bg-green-500/5' : 'bg-navy-800/30'
            }`}
          >
            <span className={`text-sm ${check.found ? 'text-green-400' : 'text-slate-600'}`}>
              {check.found ? '✓' : '○'}
            </span>
            <span className={`text-sm flex-1 ${check.found ? 'text-slate-300' : 'text-slate-500'}`}>
              {check.rule}
            </span>
            {check.required && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">Required</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
