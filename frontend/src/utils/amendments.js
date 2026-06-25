const STORAGE_KEY = 'contractiq_amendments';

export function getAmendments(filename) {
  const all = getAllAmendments();
  return all[filename] || [];
}

export function getAllAmendments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function addAmendment(filename, amendment) {
  const all = getAllAmendments();
  if (!all[filename]) all[filename] = [];
  all[filename].push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    ...amendment,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all[filename];
}

export function deleteAmendment(filename, amendmentId) {
  const all = getAllAmendments();
  if (!all[filename]) return [];
  all[filename] = all[filename].filter(a => a.id !== amendmentId);
  if (all[filename].length === 0) delete all[filename];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all[filename] || [];
}

export function updateAmendmentStatus(filename, amendmentId, status) {
  const all = getAllAmendments();
  if (!all[filename]) return [];
  const amendment = all[filename].find(a => a.id === amendmentId);
  if (amendment) {
    amendment.status = status;
    amendment.updatedAt = new Date().toISOString();
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all[filename];
}
