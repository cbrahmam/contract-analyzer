const STORAGE_KEY = 'contractiq_saved_clauses';

const DEFAULT_CLAUSES = [
  { id: 'default-1', title: 'Standard Indemnification', category: 'Liability', text: 'Each party shall indemnify, defend, and hold harmless the other party from and against any and all claims, damages, losses, costs, and expenses arising out of or relating to any breach of this Agreement.', isDefault: true },
  { id: 'default-2', title: 'Mutual Confidentiality', category: 'Confidentiality', text: 'Each party agrees to maintain the confidentiality of all Confidential Information received from the other party and shall not disclose such information to any third party without prior written consent.', isDefault: true },
  { id: 'default-3', title: 'Force Majeure', category: 'General', text: 'Neither party shall be liable for any failure or delay in performing its obligations where such failure or delay results from force majeure events including but not limited to natural disasters, war, pandemic, or government actions.', isDefault: true },
  { id: 'default-4', title: 'Limitation of Liability', category: 'Liability', text: 'In no event shall either party be liable for any indirect, incidental, special, consequential, or punitive damages, regardless of the cause of action or the theory of liability.', isDefault: true },
  { id: 'default-5', title: 'Governing Law', category: 'General', text: 'This Agreement shall be governed by and construed in accordance with the laws of the State of [STATE], without regard to its conflict of laws principles.', isDefault: true },
];

export function getSavedClauses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return [...DEFAULT_CLAUSES, ...saved];
  } catch {
    return [...DEFAULT_CLAUSES];
  }
}

export function getCategories() {
  const clauses = getSavedClauses();
  return [...new Set(clauses.map(c => c.category))].sort();
}

export function saveClause(clause) {
  const saved = getUserClauses();
  const newClause = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    ...clause,
    isDefault: false,
    createdAt: new Date().toISOString(),
  };
  saved.push(newClause);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return getSavedClauses();
}

export function deleteClause(id) {
  const saved = getUserClauses().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return getSavedClauses();
}

export function updateClause(id, updates) {
  const saved = getUserClauses();
  const clause = saved.find(c => c.id === id);
  if (clause) Object.assign(clause, updates);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return getSavedClauses();
}

function getUserClauses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
