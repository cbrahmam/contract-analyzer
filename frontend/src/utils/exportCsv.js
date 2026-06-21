function escapeCell(val) {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(headers, rows) {
  const lines = [headers.map(escapeCell).join(',')];
  for (const row of rows) {
    lines.push(row.map(escapeCell).join(','));
  }
  return lines.join('\n');
}

export function exportKeyTermsCsv(data, filename) {
  const csv = toCsv(
    ['Term', 'Summary', 'Section Reference'],
    data.key_terms.map(t => [t.term, t.summary, t.section_ref]),
  );
  download(csv, `${filename}-key-terms.csv`);
}

export function exportObligationsCsv(data, filename) {
  const csv = toCsv(
    ['Party', 'Description', 'Deadline', 'Priority'],
    data.obligations.map(o => [o.party, o.description, o.deadline, o.priority]),
  );
  download(csv, `${filename}-obligations.csv`);
}

export function exportRisksCsv(data, filename) {
  const csv = toCsv(
    ['Risk', 'Description', 'Severity', 'Recommendation'],
    data.risk_flags.map(r => [r.risk, r.description, r.severity, r.recommendation]),
  );
  download(csv, `${filename}-risks.csv`);
}

export function exportAllCsv(data, filename) {
  let csv = '=== KEY TERMS ===\n';
  csv += toCsv(
    ['Term', 'Summary', 'Section'],
    data.key_terms.map(t => [t.term, t.summary, t.section_ref]),
  );
  csv += '\n\n=== OBLIGATIONS ===\n';
  csv += toCsv(
    ['Party', 'Description', 'Deadline', 'Priority'],
    data.obligations.map(o => [o.party, o.description, o.deadline, o.priority]),
  );
  csv += '\n\n=== RISK FLAGS ===\n';
  csv += toCsv(
    ['Risk', 'Description', 'Severity', 'Recommendation'],
    data.risk_flags.map(r => [r.risk, r.description, r.severity, r.recommendation]),
  );
  csv += '\n\n=== KEY DATES ===\n';
  csv += toCsv(
    ['Date', 'Description'],
    data.key_dates.map(d => [d.date, d.description]),
  );
  csv += '\n\n=== FINANCIAL TERMS ===\n';
  csv += toCsv(
    ['Item', 'Amount', 'Conditions'],
    data.financial_terms.map(f => [f.item, f.amount, f.conditions]),
  );
  download(csv, `${filename}-full-analysis.csv`);
}

function download(csv, name) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
