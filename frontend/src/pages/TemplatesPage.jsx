import { useState } from 'react';
import templates from '../data/templates';
import TemplatePreview from '../components/TemplatePreview';

const categories = ['All', ...new Set(templates.map(t => t.category))];

const riskDot = { Low: 'bg-green-400', Medium: 'bg-amber-400', High: 'bg-red-400' };

export default function TemplatesPage({ onBack }) {
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = filter === 'All' ? templates : templates.filter(t => t.category === filter);
  const selected = templates.find(t => t.id === selectedId);

  if (selected) {
    return <TemplatePreview template={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={onBack} className="text-slate-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-bold text-white mb-2">Contract Templates</h1>
      <p className="text-slate-400 mb-8">Browse and download standard contract templates to use as starting points.</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-teal-400/10 text-teal-400 border border-teal-500/30'
                : 'bg-navy-800 text-slate-400 border border-navy-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(tmpl => (
          <div
            key={tmpl.id}
            onClick={() => setSelectedId(tmpl.id)}
            className="rounded-xl border border-navy-700 bg-navy-900/50 p-6 hover:bg-navy-800/50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-0.5 rounded-full bg-teal-400/10 text-teal-400 text-xs font-medium">
                {tmpl.category}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${riskDot[tmpl.riskLevel]}`} />
                <span className="text-slate-500 text-xs">{tmpl.riskLevel} Risk</span>
              </div>
            </div>
            <h3 className="text-white font-semibold mb-1 group-hover:text-teal-400 transition-colors">{tmpl.name}</h3>
            <p className="text-slate-400 text-sm mb-3">{tmpl.description}</p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>{tmpl.sections.length} sections</span>
              <span>·</span>
              <span>{tmpl.parties.join(' & ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
