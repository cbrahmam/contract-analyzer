const STORAGE_KEY = 'contractiq_filter_presets';

export const DEFAULT_PRESETS = [
  { name: 'High Risk Only', filters: { severity: 'high', priority: 'all', sort: 'default' } },
  { name: 'Critical Items', filters: { severity: 'high', priority: 'high', sort: 'severity-desc' } },
  { name: 'Alphabetical', filters: { severity: 'all', priority: 'all', sort: 'alpha' } },
];

export function getSavedPresets() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function savePreset(name, filters) {
  const presets = getSavedPresets();
  presets.push({ name, filters });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return presets;
}

export function deletePreset(index) {
  const presets = getSavedPresets();
  presets.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return presets;
}
