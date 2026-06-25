import { useState, useCallback } from 'react';
import { getAmendments, addAmendment, deleteAmendment, updateAmendmentStatus } from '../utils/amendments';

const STATUS_COLORS = {
  proposed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  approved: 'bg-green-500/10 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

const STATUSES = ['proposed', 'pending', 'approved', 'rejected'];

export default function AmendmentTracker({ filename }) {
  const [amendments, setAmendments] = useState(() => getAmendments(filename));
  const [showForm, setShowForm] = useState(false);
  const [section, setSection] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');

  const handleAdd = useCallback(() => {
    if (!section.trim() || !description.trim()) return;
    const updated = addAmendment(filename, {
      section: section.trim(),
      description: description.trim(),
      reason: reason.trim(),
      status: 'proposed',
    });
    setAmendments(updated);
    setSection('');
    setDescription('');
    setReason('');
    setShowForm(false);
  }, [filename, section, description, reason]);

  const handleDelete = useCallback((id) => {
    const updated = deleteAmendment(filename, id);
    setAmendments(updated);
  }, [filename]);

  const handleStatusChange = useCallback((id, status) => {
    const updated = updateAmendmentStatus(filename, id, status);
    setAmendments(updated);
  }, [filename]);

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6" id="amendments">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Amendment Tracker
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Amendment'}
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-4">{amendments.length} proposed change{amendments.length !== 1 ? 's' : ''}</p>

      {showForm && (
        <div className="mb-4 p-4 rounded-lg bg-navy-800/30 border border-navy-700 space-y-3">
          <input
            value={section}
            onChange={e => setSection(e.target.value)}
            placeholder="Section or clause (e.g., Section 4.2 - Termination)"
            className="w-full px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Proposed change..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 resize-none"
          />
          <input
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason for change (optional)"
            className="w-full px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={handleAdd}
            disabled={!section.trim() || !description.trim()}
            className="px-4 py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-sm font-medium transition-colors border border-teal-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Amendment
          </button>
        </div>
      )}

      {amendments.length === 0 ? (
        <p className="text-slate-600 text-sm text-center py-4">No amendments tracked yet.</p>
      ) : (
        <div className="space-y-3">
          {amendments.map(a => (
            <div key={a.id} className="p-3 rounded-lg bg-navy-800/30 border border-navy-700">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm font-medium text-white">{a.section}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{a.description}</p>
                  {a.reason && <p className="text-xs text-slate-600 mt-1">Reason: {a.reason}</p>}
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-slate-700 hover:text-red-400 transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(a.id, s)}
                    className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                      a.status === s ? STATUS_COLORS[s] : 'bg-navy-800 text-slate-600 border-navy-700 hover:text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <span className="text-xs text-slate-700 ml-auto">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
