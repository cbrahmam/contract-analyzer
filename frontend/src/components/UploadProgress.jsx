export default function UploadProgress({ stage, error, onRetry }) {
  if (stage === 'error') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-red-400 font-medium mb-1">Analysis Failed</p>
          <p className="text-sm text-slate-400 mb-6">{error}</p>
          <button
            onClick={onRetry}
            className="px-6 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stages = [
    { key: 'uploading', label: 'Uploading document...', icon: 'upload' },
    { key: 'analyzing', label: 'Analyzing contract with AI...', icon: 'analyze' },
  ];

  const currentIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border border-navy-700 bg-navy-900/50 p-8">
        <div className="space-y-6">
          {stages.map((s, i) => {
            const isActive = i === currentIndex;
            const isDone = i < currentIndex;

            return (
              <div key={s.key} className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                  ${isDone ? 'bg-teal-500/20' : isActive ? 'bg-teal-400/10' : 'bg-navy-800'}
                `}>
                  {isDone ? (
                    <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : isActive ? (
                    <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-navy-600" />
                  )}
                </div>
                <span className={`font-medium transition-colors duration-300 ${
                  isDone ? 'text-teal-400' : isActive ? 'text-white' : 'text-slate-600'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {stage === 'analyzing' && (
          <div className="mt-6 pt-6 border-t border-navy-800">
            <p className="text-sm text-slate-500 text-center">
              This typically takes 10-30 seconds depending on document length
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
