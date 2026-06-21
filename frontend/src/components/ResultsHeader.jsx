import generateShareText from '../utils/shareText';
import { showToast } from './Toast';

const scoreColors = {
  Low: 'bg-green-500/10 text-green-400 border-green-500/30',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  High: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const dotColors = {
  Low: 'bg-green-400',
  Medium: 'bg-amber-400',
  High: 'bg-red-400',
};

export default function ResultsHeader({ data, filename, onReset }) {
  const scoreClass = scoreColors[data.overall_risk_score] || scoreColors.Medium;
  const dotClass = dotColors[data.overall_risk_score] || dotColors.Medium;

  return (
    <div className="sticky top-[65px] z-40 bg-navy-950/95 backdrop-blur-md border-b border-navy-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <span className="shrink-0 px-3 py-1 rounded-full bg-teal-400/10 text-teal-400 text-sm font-medium">
            {data.document_type}
          </span>
          <h2 className="text-lg font-semibold text-white truncate">{filename}</h2>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${scoreClass}`}>
            <span className={`w-2 h-2 rounded-full ${dotClass}`} />
            <span className="text-sm font-medium">{data.overall_risk_score} Risk</span>
          </div>
          <button
            onClick={() => {
              const text = generateShareText(data, filename);
              navigator.clipboard.writeText(text);
              showToast('Summary copied to clipboard');
            }}
            className="px-3 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-sm transition-colors"
            aria-label="Copy analysis summary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-sm font-medium transition-colors"
          >
            New Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
