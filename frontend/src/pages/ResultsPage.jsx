export default function ResultsPage({ data, filename, onReset }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-teal-400/10 text-teal-400 text-sm font-medium mb-2">
            {data.document_type}
          </span>
          <h2 className="text-2xl font-bold text-white">{filename}</h2>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-sm font-medium transition-colors"
        >
          Upload New Document
        </button>
      </div>

      <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6">
        <h3 className="text-white font-semibold mb-3">Executive Summary</h3>
        <p className="text-slate-300 leading-relaxed">{data.executive_summary}</p>
      </div>

      <p className="mt-8 text-center text-slate-500">Full results dashboard coming in Block 4</p>
    </div>
  );
}
