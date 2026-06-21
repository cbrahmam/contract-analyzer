import { useState } from 'react';
import { getNotes, addNote, deleteNote } from '../utils/notes';

export default function NotesPanel({ filename }) {
  const [notes, setNotes] = useState(() => getNotes(filename));
  const [text, setText] = useState('');
  const [section, setSection] = useState('General');

  const sections = ['General', 'Summary', 'Key Terms', 'Obligations', 'Risks', 'Dates', 'Financial'];

  function handleAdd() {
    if (!text.trim()) return;
    const updated = addNote(filename, section, text.trim());
    setNotes(updated);
    setText('');
  }

  function handleDelete(noteId) {
    const updated = deleteNote(filename, noteId);
    setNotes(updated);
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6" id="notes">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
        Notes & Annotations
      </h2>

      <div className="flex gap-2 mb-3">
        <select
          value={section}
          onChange={e => setSection(e.target.value)}
          className="px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
        >
          {sections.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a note..."
          className="flex-1 px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
        />
        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          className="px-4 py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-sm font-medium transition-colors border border-teal-500/30 disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="text-slate-600 text-sm py-4 text-center">No notes yet. Add annotations as you review.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {notes.map(note => (
            <div key={note.id} className="flex items-start gap-3 p-3 rounded-lg bg-navy-800/50 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-teal-400/10 text-teal-400 text-xs font-medium">{note.section}</span>
                  <span className="text-slate-600 text-xs">{formatDate(note.createdAt)}</span>
                </div>
                <p className="text-slate-300 text-sm">{note.text}</p>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                className="shrink-0 p-1 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
