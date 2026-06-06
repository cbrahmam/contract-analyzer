import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }

  function handleClear() {
    setQuery('');
    onSearch('');
  }

  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search analysis results..."
        className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-navy-800 border border-navy-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-colors"
      />
      {query && (
        <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
