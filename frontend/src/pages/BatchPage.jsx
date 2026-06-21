import { useState, useRef } from 'react';
import { uploadDocument, analyzeDocument } from '../api/client';
import { addToHistory } from '../utils/history';

const statusIcons = {
  pending: '○',
  uploading: '◌',
  analyzing: '◑',
  done: '●',
  error: '✕',
};

const statusColors = {
  pending: 'text-slate-600',
  uploading: 'text-amber-400',
  analyzing: 'text-teal-400',
  done: 'text-green-400',
  error: 'text-red-400',
};

export default function BatchPage({ onBack, onViewResult }) {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState({});
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef(null);

  function handleFiles(e) {
    const selected = Array.from(e.target.files).filter(f =>
      f.type === 'application/pdf' ||
      f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    setFiles(prev => [...prev, ...selected]);
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function processAll() {
    setProcessing(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const key = `${file.name}-${i}`;

      try {
        setResults(prev => ({ ...prev, [key]: { status: 'uploading' } }));
        const uploadRes = await uploadDocument(file);

        setResults(prev => ({ ...prev, [key]: { status: 'analyzing' } }));
        const analysis = await analyzeDocument(uploadRes.filename);

        addToHistory(uploadRes.filename, analysis);
        setResults(prev => ({
          ...prev,
          [key]: { status: 'done', data: analysis, filename: uploadRes.filename },
        }));
      } catch (err) {
        setResults(prev => ({
          ...prev,
          [key]: { status: 'error', error: err.message },
        }));
      }
    }

    setProcessing(false);
  }

  const completedCount = Object.values(results).filter(r => r.status === 'done').length;
  const errorCount = Object.values(results).filter(r => r.status === 'error').length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={onBack} className="text-slate-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-bold text-white mb-2">Batch Analysis</h1>
      <p className="text-slate-400 mb-8">Upload multiple contracts to analyze them all at once.</p>

      <div
        onClick={() => inputRef.current?.click()}
        className="rounded-xl border-2 border-dashed border-navy-600 bg-navy-900/50 p-8 text-center cursor-pointer hover:border-navy-500 transition-colors mb-6"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
        <p className="text-slate-400">Click to select PDF or DOCX files</p>
        <p className="text-slate-600 text-sm mt-1">You can select multiple files at once</p>
      </div>

      {files.length > 0 && (
        <>
          <div className="rounded-xl border border-navy-700 bg-navy-900/50 overflow-hidden mb-6">
            <div className="p-4 border-b border-navy-800 flex items-center justify-between">
              <span className="text-white font-medium">{files.length} file{files.length !== 1 ? 's' : ''} selected</span>
              {completedCount > 0 && (
                <span className="text-sm text-green-400">{completedCount} completed{errorCount > 0 ? `, ${errorCount} failed` : ''}</span>
              )}
            </div>
            <div className="divide-y divide-navy-800">
              {files.map((file, i) => {
                const key = `${file.name}-${i}`;
                const result = results[key];
                const status = result?.status || 'pending';

                return (
                  <div key={key} className="px-4 py-3 flex items-center gap-3">
                    <span className={`text-lg ${statusColors[status]}`}>{statusIcons[status]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{file.name}</p>
                      {result?.error && <p className="text-red-400 text-xs mt-0.5">{result.error}</p>}
                    </div>
                    {status === 'done' && onViewResult && (
                      <button
                        onClick={() => onViewResult({ data: result.data, filename: result.filename })}
                        className="text-teal-400 text-xs hover:underline"
                      >
                        View
                      </button>
                    )}
                    {status === 'pending' && !processing && (
                      <button
                        onClick={() => removeFile(i)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={processAll}
            disabled={processing || files.length === 0}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing {completedCount + errorCount + 1} of {files.length}...
              </span>
            ) : completedCount === files.length && files.length > 0 ? (
              'All Done!'
            ) : (
              `Analyze ${files.length} Contract${files.length !== 1 ? 's' : ''}`
            )}
          </button>
        </>
      )}
    </div>
  );
}
