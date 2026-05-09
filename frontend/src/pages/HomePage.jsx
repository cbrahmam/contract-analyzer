import FileUpload from '../components/FileUpload';
import UploadProgress from '../components/UploadProgress';
import { fetchSampleDocument } from '../api/client';

export default function HomePage({ stage, error, onFileSelect, onRetry }) {
  const isProcessing = stage === 'uploading' || stage === 'analyzing';

  async function handleSample() {
    try {
      const file = await fetchSampleDocument();
      onFileSelect(file);
    } catch {
      // Sample fetch failed — ignore silently
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          AI-powered contract analysis
          <br />
          <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            in seconds
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">
          Upload any contract, NDA, or agreement. Our AI extracts key terms,
          flags risks, and identifies every obligation so nothing gets missed.
        </p>
      </div>

      {isProcessing || stage === 'error' ? (
        <UploadProgress stage={stage} error={error} onRetry={onRetry} />
      ) : (
        <>
          <FileUpload onFileSelect={onFileSelect} disabled={isProcessing} />
          <div className="mt-4 text-center">
            <button
              onClick={handleSample}
              className="text-sm text-slate-500 hover:text-teal-400 transition-colors underline underline-offset-4"
            >
              Try with a sample NDA
            </button>
          </div>
        </>
      )}

      {!isProcessing && stage !== 'error' && (
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { title: 'Risk Detection', desc: 'Identifies one-sided clauses, missing protections, and unusual terms', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z' },
            { title: 'Key Terms', desc: 'Extracts payment terms, deadlines, obligations, and financial details', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
            { title: 'Instant Report', desc: 'Get a structured analysis report you can export and share', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-xl border border-navy-700 bg-navy-900/50 p-6 text-left">
              <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
