const STORAGE_KEY = 'contractiq_deadlines';

export function getAllDeadlines() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function saveDeadlinesFromAnalysis(filename, data) {
  const all = getAllDeadlines();

  const newDeadlines = [];

  for (const d of data.key_dates || []) {
    newDeadlines.push({
      id: `${filename}-date-${newDeadlines.length}`,
      filename,
      type: 'date',
      title: d.description,
      date: d.date,
      source: 'Key Dates',
    });
  }

  for (const o of data.obligations || []) {
    if (o.deadline && o.deadline.toLowerCase() !== 'not specified') {
      newDeadlines.push({
        id: `${filename}-obl-${newDeadlines.length}`,
        filename,
        type: 'obligation',
        title: `${o.party}: ${o.description}`,
        date: o.deadline,
        priority: o.priority,
        source: 'Obligations',
      });
    }
  }

  const existing = all.filter(d => d.filename !== filename);
  const merged = [...existing, ...newDeadlines];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

export function deleteDeadline(id) {
  const all = getAllDeadlines().filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all;
}

export function clearDeadlinesForFile(filename) {
  const all = getAllDeadlines().filter(d => d.filename !== filename);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all;
}

export function exportToICS(deadlines) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ContractIQ//Deadlines//EN',
  ];

  for (const d of deadlines) {
    const dateStr = d.date.replace(/[^0-9]/g, '').slice(0, 8) || '20260101';
    lines.push('BEGIN:VEVENT');
    lines.push(`DTSTART;VALUE=DATE:${dateStr}`);
    lines.push(`SUMMARY:${d.title}`);
    lines.push(`DESCRIPTION:Source: ${d.filename} (${d.source})`);
    lines.push(`UID:${d.id}@contractiq`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contract-deadlines.ics';
  a.click();
  URL.revokeObjectURL(url);
}
