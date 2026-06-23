import { showToast } from './Toast';

const riskColors = {
  Low: 'text-green-400 bg-green-500/10',
  Medium: 'text-amber-400 bg-amber-500/10',
  High: 'text-red-400 bg-red-500/10',
};

export default function TemplatePreview({ template, onBack }) {
  function handleCopy() {
    navigator.clipboard.writeText(template.content);
    showToast('Template copied to clipboard');
  }

  function handleDownload() {
    const blob = new Blob([template.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Template downloaded');
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={onBack} className="text-slate-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Templates
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-teal-400/10 text-teal-400 text-xs font-medium">
              {template.category}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskColors[template.riskLevel]}`}>
              {template.riskLevel} Risk
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">{template.name}</h1>
          <p className="text-slate-400 mt-1">{template.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-sm font-medium transition-colors border border-navy-700"
          >
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-sm font-medium transition-colors border border-teal-500/30"
          >
            Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-5">
          <p className="text-xs text-slate-500 mb-2">Parties</p>
          <div className="flex flex-wrap gap-2">
            {template.parties.map(p => (
              <span key={p} className="px-2 py-1 rounded-lg bg-navy-800 text-slate-300 text-sm">{p}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-5">
          <p className="text-xs text-slate-500 mb-2">Sections ({template.sections.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {template.sections.map(s => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-navy-800 text-slate-400 text-xs">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6">
        <h3 className="text-white font-semibold mb-4">Template Content</h3>
        <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed max-h-[600px] overflow-y-auto">
          {template.content}
        </pre>
      </div>
    </div>
  );
}
