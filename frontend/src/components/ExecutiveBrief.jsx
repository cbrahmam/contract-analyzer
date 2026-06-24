import { useState, useMemo } from 'react';
import { generateExecutiveBrief, briefToText } from '../utils/briefGenerator';

export default function ExecutiveBrief({ data, filename }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sections = useMemo(() => generateExecutiveBrief(data, filename), [data, filename]);

  function handleCopy() {
    const text = briefToText(sections);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const text = briefToText(sections);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive-brief-${filename.replace(/\.[^.]+$/, '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6" id="brief">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          Executive Brief
        </h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          {open ? 'Collapse' : 'Generate Brief'}
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-4">Auto-generated summary for stakeholders</p>

      {open && (
        <>
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-sm transition-colors border border-navy-700"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-sm transition-colors border border-navy-700"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((section, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-teal-400 mb-1.5">{section.title}</h3>
                <div className="space-y-1">
                  {section.content.map((line, j) => (
                    <p key={j} className={`text-sm ${line.startsWith('[High]') ? 'text-red-400' : line.startsWith('[Medium]') ? 'text-amber-400' : 'text-slate-300'} ${line === '' ? 'h-2' : ''}`}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
