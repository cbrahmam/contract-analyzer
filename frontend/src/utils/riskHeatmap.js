const SEVERITY_ORDER = ['High', 'Medium', 'Low'];

export function categorizeRisks(risks) {
  const categories = {};

  for (const risk of risks) {
    const category = detectCategory(risk.risk, risk.description);
    if (!categories[category]) {
      categories[category] = { High: 0, Medium: 0, Low: 0 };
    }
    const sev = SEVERITY_ORDER.includes(risk.severity) ? risk.severity : 'Medium';
    categories[category][sev]++;
  }

  return categories;
}

function detectCategory(risk, description) {
  const text = `${risk} ${description}`.toLowerCase();

  if (text.match(/liab|indemn|damage|penalty|fine/)) return 'Liability';
  if (text.match(/termin|cancel|exit|expir/)) return 'Termination';
  if (text.match(/confiden|nda|non-disclos|secret|privacy/)) return 'Confidentiality';
  if (text.match(/ip|intellect|patent|copyright|trademark/)) return 'IP Rights';
  if (text.match(/pay|fee|cost|price|financ|invoice/)) return 'Financial';
  if (text.match(/compli|regulat|law|legal|govern/)) return 'Compliance';
  if (text.match(/data|gdpr|ccpa|breach|security/)) return 'Data Protection';
  if (text.match(/perform|sla|uptime|deliver|deadline/)) return 'Performance';
  return 'General';
}

export function getHeatmapColor(count, maxCount) {
  if (count === 0) return { bg: 'bg-navy-800/30', text: 'text-slate-700' };
  const intensity = count / Math.max(maxCount, 1);
  if (intensity > 0.66) return { bg: 'bg-red-500/20', text: 'text-red-400' };
  if (intensity > 0.33) return { bg: 'bg-amber-500/15', text: 'text-amber-400' };
  return { bg: 'bg-green-500/10', text: 'text-green-400' };
}

export function getRiskSummary(categories) {
  let totalHigh = 0, totalMedium = 0, totalLow = 0;
  for (const cat of Object.values(categories)) {
    totalHigh += cat.High;
    totalMedium += cat.Medium;
    totalLow += cat.Low;
  }
  const hotspot = Object.entries(categories)
    .sort((a, b) => (b[1].High * 3 + b[1].Medium * 2 + b[1].Low) - (a[1].High * 3 + a[1].Medium * 2 + a[1].Low))[0];

  return {
    totalHigh,
    totalMedium,
    totalLow,
    hotspotCategory: hotspot ? hotspot[0] : null,
    categoryCount: Object.keys(categories).length,
  };
}
