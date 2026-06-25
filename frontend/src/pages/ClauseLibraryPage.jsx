import { useState, useMemo } from 'react';
import { getSavedClauses, getCategories, saveClause, deleteClause } from '../utils/clauseManager';

export default function ClauseLibraryPage() {
  const [clauses, setClauses] = useState(() => getSavedClauses());
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [text, setText] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const categories = useMemo(() => ['All', ...getCategories()], [clauses]);

  const filtered = useMemo(() => {
    let result = clauses;
    if (filter !== 'All') result = result.filter(c => c.category === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q) || c.text.toLowerCase().includes(q));
    }
    return result;
  }, [clauses, filter, search]);

  function handleAdd() {
    if (!title.trim() || !text.trim()) return;
    const updated = saveClause({ title: title.trim(), category, text: text.trim() });
    setClauses(updated);
    setTitle('');
    setText('');
    setShowForm(false);
  }

  function handleDelete(id) {
    const updated = deleteClause(id);
    setClauses(updated);
  }

  function handleCopy(clause) {
    navigator.clipboard.writeText(clause.text);
    setCopiedId(clause.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Clause Library</h1>
          <p className="text-slate-500 text-sm mt-1">Reusable contract clauses for quick reference</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-sm font-medium transition-colors border border-teal-500/30"
        >
          {showForm ? 'Cancel' : '+ New Clause'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-5 rounded-xl bg-navy-900/50 border border-navy-700 space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Clause title..."
            className="w-full px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
          />
          <div className="flex gap-3">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white focus:outline-none focus:border-teal-500"
            >
              {['General', 'Liability', 'Confidentiality', 'IP Rights', 'Termination', 'Financial', 'Compliance', 'Data Protection'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Clause text..."
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 resize-none"
          />
          <button
            onClick={handleAdd}
            disabled={!title.trim() || !text.trim()}
            className="px-4 py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-sm font-medium transition-colors border border-teal-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Clause
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search clauses..."
          className="flex-1 px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
        />
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === c
                  ? 'bg-teal-400/10 text-teal-400 border border-teal-500/30'
                  : 'bg-navy-800 text-slate-500 border border-navy-700 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-3">{filtered.length} clause{filtered.length !== 1 ? 's' : ''}</p>

      <div className="space-y-3">
        {filtered.map(clause => (
          <div key={clause.id} className="rounded-xl border border-navy-700 bg-navy-900/50 p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="text-sm font-semibold text-white">{clause.title}</h3>
                <span className="text-xs text-teal-400">{clause.category}</span>
                {clause.isDefault && <span className="text-xs text-slate-600 ml-2">Built-in</span>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopy(clause)}
                  className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white text-xs transition-colors border border-navy-700"
                >
                  {copiedId === clause.id ? 'Copied!' : 'Copy'}
                </button>
                {!clause.isDefault && (
                  <button
                    onClick={() => handleDelete(clause.id)}
                    className="p-1 rounded-lg hover:bg-red-500/10 text-slate-700 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{clause.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
