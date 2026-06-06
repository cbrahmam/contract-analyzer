import { useState, useRef } from 'react';
import { uploadDocument, compareDocuments } from '../api/client';

const significanceColors = {
  high: 'border-red-500/30 bg-red-500/5',
  medium: 'border-amber-500/30 bg-amber-500/5',
  low: 'border-green-500/30 bg-green-500/5',
};

const significanceBadge = {
  high: 'bg-red-500/10 text-red-400',
  medium: 'bg-amber-500/10 text-amber-400',
  low: 'bg-green-500/10 text-green-400',
};

const riskDot = {
  Low: 'bg-green-400',
  Medium: 'bg-amber-400',
  High: 'bg-red-400',
};

export default function ComparePage({ onBack }) {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const inputA = useRef(null);
  const inputB = useRef(null);

  async function handleCompare() {
    if (!fileA || !fileB) return;
    setLoading(true);
    setError('');

    try {
      const [resA, resB] = await Promise.all([
        uploadDocument(fileA),
        uploadDocument(fileB),
      ]);
      const comparison = await compareDocuments(resA.filename, resB.filename);
      setResult(comparison);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFileA(null);
    setFileB(null);
    setResult(null);
    setError('');
  }

  if (result) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={handleReset} className="text-slate-500 hover:text-white text-sm mb-2 flex items-center gap-1 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Compare Again
            </button>
            <h1 className="text-3xl font-bold text-white">Comparison Results</h1>
          </div>
          <button onClick={onBack} className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-sm font-medium transition-colors">
            Back to Home
          </button>
        </div>

        <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6 mb-6">
          <h3 className="text-white font-semibold mb-3">Summary</h3>
          <p className="text-slate-300 leading-relaxed">{result.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-5">
            <p className="text-sm text-slate-500 mb-1">Document A</p>
            <p className="text-white font-medium">{result.document_a_type}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${riskDot[result.risk_comparison.document_a_risk] || ''}`} />
              <span className="text-sm text-slate-400">{result.risk_comparison.document_a_risk} Risk</span>
            </div>
          </div>
          <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-5">
            <p className="text-sm text-slate-500 mb-1">Document B</p>
            <p className="text-white font-medium">{result.document_b_type}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${riskDot[result.risk_comparison.document_b_risk] || ''}`} />
              <span className="text-sm text-slate-400">{result.risk_comparison.document_b_risk} Risk</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6 mb-6">
          <h3 className="text-white font-semibold mb-3">Risk Comparison</h3>
          <p className="text-slate-300 text-sm">{result.risk_comparison.explanation}</p>
        </div>

        <div className="rounded-xl border border-navy-700 bg-navy-900/50 overflow-hidden mb-6">
          <div className="p-6 border-b border-navy-800">
            <h3 className="text-white font-semibold">Key Differences</h3>
          </div>
          <div className="p-4 space-y-3">
            {result.key_differences.map((d, i) => (
              <div key={i} className={`rounded-lg border p-5 ${significanceColors[d.significance] || ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">{d.category}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${significanceBadge[d.significance] || ''}`}>
                    {d.significance}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Document A</p>
                    <p className="text-slate-300 text-sm">{d.document_a}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Document B</p>
                    <p className="text-slate-300 text-sm">{d.document_b}</p>
                  </div>
                </div>
                <p className="text-teal-400 text-sm"><span className="font-medium">Recommendation:</span> {d.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {(result.missing_in_a.length > 0 || result.missing_in_b.length > 0) && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {result.missing_in_a.length > 0 && (
              <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-5">
                <h4 className="text-white font-medium mb-3 text-sm">Missing in Document A</h4>
                <ul className="space-y-2">
                  {result.missing_in_a.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-red-400 mt-0.5">-</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.missing_in_b.length > 0 && (
              <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-5">
                <h4 className="text-white font-medium mb-3 text-sm">Missing in Document B</h4>
                <ul className="space-y-2">
                  {result.missing_in_b.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-red-400 mt-0.5">-</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-6">
          <h3 className="text-teal-400 font-semibold mb-2">Overall Recommendation</h3>
          <p className="text-slate-300">{result.recommendation}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={onBack} className="text-slate-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-bold text-white mb-2">Compare Contracts</h1>
      <p className="text-slate-400 mb-8">Upload two contracts to get a detailed comparison of terms, risks, and obligations.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          onClick={() => inputA.current?.click()}
          className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
            fileA ? 'border-teal-400/50 bg-teal-400/5' : 'border-navy-600 bg-navy-900/50 hover:border-navy-500'
          }`}
        >
          <input ref={inputA} type="file" accept=".pdf,.docx" onChange={e => setFileA(e.target.files[0])} className="hidden" />
          <p className="text-slate-400 text-sm mb-1">Document A</p>
          <p className="text-white font-medium">{fileA ? fileA.name : 'Click to select'}</p>
        </div>
        <div
          onClick={() => inputB.current?.click()}
          className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
            fileB ? 'border-teal-400/50 bg-teal-400/5' : 'border-navy-600 bg-navy-900/50 hover:border-navy-500'
          }`}
        >
          <input ref={inputB} type="file" accept=".pdf,.docx" onChange={e => setFileB(e.target.files[0])} className="hidden" />
          <p className="text-slate-400 text-sm mb-1">Document B</p>
          <p className="text-white font-medium">{fileB ? fileB.name : 'Click to select'}</p>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

      <button
        onClick={handleCompare}
        disabled={!fileA || !fileB || loading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Comparing...
          </span>
        ) : 'Compare Contracts'}
      </button>
    </div>
  );
}
