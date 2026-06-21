const STORAGE_KEY = 'contractiq_notes';

export function getNotes(filename) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return all[filename] || [];
}

export function addNote(filename, section, text) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (!all[filename]) all[filename] = [];
  all[filename].push({
    id: Date.now().toString(36),
    section,
    text,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all[filename];
}

export function deleteNote(filename, noteId) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (all[filename]) {
    all[filename] = all[filename].filter(n => n.id !== noteId);
    if (all[filename].length === 0) delete all[filename];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
  return all[filename] || [];
}
