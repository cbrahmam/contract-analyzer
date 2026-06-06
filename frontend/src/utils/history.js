const STORAGE_KEY = 'contractiq_history';
const MAX_ENTRIES = 20;

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(filename, data) {
  const history = getHistory();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    filename,
    documentType: data.document_type,
    riskScore: data.overall_risk_score,
    summary: data.executive_summary,
    analyzedAt: new Date().toISOString(),
    data,
  };

  history.unshift(entry);
  if (history.length > MAX_ENTRIES) history.pop();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return entry;
}

export function getHistoryEntry(id) {
  const history = getHistory();
  return history.find(e => e.id === id) || null;
}

export function deleteHistoryEntry(id) {
  const history = getHistory().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
