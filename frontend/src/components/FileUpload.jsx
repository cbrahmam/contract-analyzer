import { useState, useRef } from 'react';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload({ onFileSelect, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const ACCEPTED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  function handleFile(file) {
    setError('');
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only PDF and DOCX files are accepted.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleChange(e) {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }

  function handleUpload() {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer
          transition-all duration-300 ease-out
          ${dragActive
            ? 'border-teal-400 bg-teal-400/5 scale-[1.02]'
            : 'border-navy-600 bg-navy-900/50 hover:border-navy-500 hover:bg-navy-800/50'
          }
          ${disabled ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300 ${dragActive ? 'bg-teal-400/10' : 'bg-navy-800'}`}>
            <svg className={`w-8 h-8 transition-colors duration-300 ${dragActive ? 'text-teal-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>

          {selectedFile ? (
            <div className="space-y-1">
              <p className="text-white font-medium">{selectedFile.name}</p>
              <p className="text-sm text-slate-400">{formatSize(selectedFile.size)}</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-slate-300 font-medium">Drop your contract here or click to upload</p>
              <p className="text-sm text-slate-500">PDF or DOCX files, up to 20 MB</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
      )}

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={disabled}
          className="mt-6 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-semibold text-lg transition-all duration-200 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze Contract
        </button>
      )}
    </div>
  );
}
