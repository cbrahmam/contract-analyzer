import { parseDate } from './calendar';

export function buildTimeline(data) {
  const events = [];

  (data.key_dates || []).forEach(d => {
    const parsed = parseDate(d.date);
    events.push({
      type: 'date',
      label: d.description,
      date: d.date,
      parsed,
      significance: d.significance,
      color: significanceColor(d.significance),
    });
  });

  (data.obligations || []).forEach(o => {
    if (o.deadline && o.deadline.toLowerCase() !== 'ongoing') {
      const parsed = parseDate(o.deadline);
      events.push({
        type: 'obligation',
        label: o.description,
        date: o.deadline,
        parsed,
        party: o.party,
        priority: o.priority,
        color: priorityColor(o.priority),
      });
    }
  });

  const withDates = events.filter(e => e.parsed);
  const withoutDates = events.filter(e => !e.parsed);

  withDates.sort((a, b) => a.parsed - b.parsed);

  return { dated: withDates, undated: withoutDates };
}

function significanceColor(sig) {
  if (!sig) return 'teal';
  const s = sig.toLowerCase();
  if (s.includes('critical') || s.includes('high')) return 'red';
  if (s.includes('important') || s.includes('medium')) return 'amber';
  return 'teal';
}

function priorityColor(priority) {
  if (!priority) return 'slate';
  const p = priority.toLowerCase();
  if (p === 'high') return 'red';
  if (p === 'medium') return 'amber';
  return 'green';
}

export function getTimelineSpan(events) {
  if (events.length === 0) return null;
  const first = events[0].parsed;
  const last = events[events.length - 1].parsed;
  const diffMs = last - first;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return { first, last, diffDays };
}
