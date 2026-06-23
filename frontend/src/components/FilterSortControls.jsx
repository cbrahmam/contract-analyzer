const SEVERITY_OPTIONS = ['all', 'high', 'medium', 'low'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'severity-desc', label: 'Severity (High first)' },
  { value: 'severity-asc', label: 'Severity (Low first)' },
  { value: 'alpha', label: 'Alphabetical' },
];

export default function FilterSortControls({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl bg-navy-800/30 border border-navy-700">
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 font-medium">Severity:</label>
        <select
          value={filters.severity || 'all'}
          onChange={e => onFilterChange({ ...filters, severity: e.target.value })}
          className="px-2 py-1 rounded-lg bg-navy-800 border border-navy-700 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
        >
          {SEVERITY_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt === 'all' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 font-medium">Priority:</label>
        <select
          value={filters.priority || 'all'}
          onChange={e => onFilterChange({ ...filters, priority: e.target.value })}
          className="px-2 py-1 rounded-lg bg-navy-800 border border-navy-700 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
        >
          {SEVERITY_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt === 'all' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500 font-medium">Sort:</label>
        <select
          value={filters.sort || 'default'}
          onChange={e => onFilterChange({ ...filters, sort: e.target.value })}
          className="px-2 py-1 rounded-lg bg-navy-800 border border-navy-700 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {(filters.severity !== 'all' || filters.priority !== 'all' || filters.sort !== 'default') && (
        <button
          onClick={() => onFilterChange({ severity: 'all', priority: 'all', sort: 'default' })}
          className="text-xs text-slate-500 hover:text-teal-400 transition-colors ml-auto"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };

export function applyFiltersAndSort(data, filters) {
  let risks = [...(data.risk_flags || [])];
  let obligations = [...(data.obligations || [])];

  if (filters.severity && filters.severity !== 'all') {
    risks = risks.filter(r => r.severity === filters.severity);
  }

  if (filters.priority && filters.priority !== 'all') {
    obligations = obligations.filter(o => o.priority === filters.priority);
  }

  if (filters.sort === 'severity-desc') {
    risks.sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3));
    obligations.sort((a, b) => (SEVERITY_ORDER[a.priority] ?? 3) - (SEVERITY_ORDER[b.priority] ?? 3));
  } else if (filters.sort === 'severity-asc') {
    risks.sort((a, b) => (SEVERITY_ORDER[b.severity] ?? 3) - (SEVERITY_ORDER[a.severity] ?? 3));
    obligations.sort((a, b) => (SEVERITY_ORDER[b.priority] ?? 3) - (SEVERITY_ORDER[a.priority] ?? 3));
  } else if (filters.sort === 'alpha') {
    risks.sort((a, b) => a.risk.localeCompare(b.risk));
    obligations.sort((a, b) => a.description.localeCompare(b.description));
  }

  return { ...data, risk_flags: risks, obligations };
}
