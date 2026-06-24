const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }
  return days;
}

export function getMonthName(month) {
  return MONTHS[month];
}

export function parseDate(dateStr) {
  if (!dateStr) return null;
  const cleaned = dateStr.replace(/[^\d\-\/]/g, ' ').trim();
  const date = new Date(cleaned);
  if (isNaN(date.getTime())) return null;
  return date;
}

export function formatDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function groupEventsByDate(obligations, dates) {
  const events = {};

  obligations.forEach(o => {
    const parsed = parseDate(o.deadline);
    if (parsed) {
      const key = formatDateKey(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      if (!events[key]) events[key] = [];
      events[key].push({ type: 'obligation', label: o.description, party: o.party, priority: o.priority });
    }
  });

  dates.forEach(d => {
    const parsed = parseDate(d.date);
    if (parsed) {
      const key = formatDateKey(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      if (!events[key]) events[key] = [];
      events[key].push({ type: 'date', label: d.description, significance: d.significance });
    }
  });

  return events;
}
