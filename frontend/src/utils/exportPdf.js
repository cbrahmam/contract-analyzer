import jsPDF from 'jspdf';

const COLORS = {
  bg: [2, 6, 23],
  card: [15, 23, 42],
  border: [51, 65, 85],
  white: [255, 255, 255],
  slate300: [203, 213, 225],
  slate400: [148, 163, 184],
  teal: [45, 212, 191],
  red: [239, 68, 68],
  amber: [245, 158, 11],
  green: [34, 197, 94],
};

function severityColor(severity) {
  if (severity === 'high') return COLORS.red;
  if (severity === 'medium') return COLORS.amber;
  return COLORS.green;
}

export default function exportPdf(data, filename) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  const margin = 20;
  const contentW = W - margin * 2;
  let y = 0;

  function addPage() {
    doc.addPage();
    doc.setFillColor(...COLORS.bg);
    doc.rect(0, 0, W, 297, 'F');
    y = margin;
  }

  function checkSpace(needed) {
    if (y + needed > 277) addPage();
  }

  function heading(text) {
    checkSpace(14);
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += 8;
    doc.setDrawColor(...COLORS.border);
    doc.line(margin, y, W - margin, y);
    y += 6;
  }

  function bodyText(text, indent = 0) {
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.slate300);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentW - indent);
    for (const line of lines) {
      checkSpace(5);
      doc.text(line, margin + indent, y);
      y += 5;
    }
  }

  // --- Cover page ---
  doc.setFillColor(...COLORS.bg);
  doc.rect(0, 0, W, 297, 'F');

  doc.setFillColor(...COLORS.teal);
  doc.roundedRect(margin, 40, 40, 8, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.bg);
  doc.setFont('helvetica', 'bold');
  doc.text('ContractIQ', margin + 5, 46);

  doc.setFontSize(28);
  doc.setTextColor(...COLORS.white);
  doc.text('Contract Analysis Report', margin, 70);

  doc.setFontSize(12);
  doc.setTextColor(...COLORS.slate400);
  doc.text(filename, margin, 82);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 90);

  const riskColor = severityColor(data.overall_risk_score.toLowerCase());
  doc.setFontSize(16);
  doc.setTextColor(...riskColor);
  doc.text(`Overall Risk: ${data.overall_risk_score}`, margin, 106);

  doc.setFontSize(10);
  doc.setTextColor(...COLORS.slate400);
  doc.text(`Document Type: ${data.document_type}`, margin, 116);

  // --- Content pages ---
  addPage();

  heading('Executive Summary');
  bodyText(data.executive_summary);
  y += 4;

  heading('Parties');
  for (const p of data.parties) {
    checkSpace(8);
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.text(`${p.name}`, margin + 4, y);
    doc.setTextColor(...COLORS.slate400);
    doc.setFont('helvetica', 'normal');
    doc.text(` - ${p.role}`, margin + 4 + doc.getTextWidth(`${p.name}`), y);
    y += 6;
  }
  y += 4;

  if (data.key_terms.length > 0) {
    heading('Key Terms');
    for (const t of data.key_terms) {
      checkSpace(14);
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.teal);
      doc.setFont('helvetica', 'bold');
      doc.text(t.term, margin + 4, y);
      y += 5;
      bodyText(t.summary, 4);
      y += 3;
    }
  }

  if (data.obligations.length > 0) {
    heading('Obligations');
    for (const o of data.obligations) {
      checkSpace(16);
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.white);
      doc.setFont('helvetica', 'bold');
      doc.text(o.party, margin + 4, y);
      const pColor = severityColor(o.priority);
      doc.setTextColor(...pColor);
      doc.text(` [${o.priority}]`, margin + 4 + doc.getTextWidth(o.party + ' '), y);
      y += 5;
      bodyText(o.description, 4);
      doc.setTextColor(...COLORS.slate400);
      doc.text(`Deadline: ${o.deadline}`, margin + 4, y);
      y += 6;
    }
  }

  if (data.risk_flags.length > 0) {
    heading('Risk Flags');
    for (const r of data.risk_flags) {
      checkSpace(20);
      const sColor = severityColor(r.severity);
      doc.setFontSize(10);
      doc.setTextColor(...sColor);
      doc.setFont('helvetica', 'bold');
      doc.text(`[${r.severity.toUpperCase()}] ${r.risk}`, margin + 4, y);
      y += 5;
      bodyText(r.description, 4);
      doc.setTextColor(...COLORS.teal);
      doc.setFont('helvetica', 'italic');
      const recLines = doc.splitTextToSize(`Recommendation: ${r.recommendation}`, contentW - 4);
      for (const line of recLines) {
        checkSpace(5);
        doc.text(line, margin + 4, y);
        y += 5;
      }
      y += 3;
    }
  }

  if (data.key_dates.length > 0) {
    heading('Key Dates');
    for (const d of data.key_dates) {
      checkSpace(10);
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.teal);
      doc.setFont('helvetica', 'bold');
      doc.text(d.date, margin + 4, y);
      y += 5;
      bodyText(d.description, 4);
      y += 3;
    }
  }

  if (data.financial_terms.length > 0) {
    heading('Financial Terms');
    for (const f of data.financial_terms) {
      checkSpace(14);
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.white);
      doc.setFont('helvetica', 'bold');
      doc.text(f.item, margin + 4, y);
      doc.setTextColor(...COLORS.teal);
      doc.setFont('helvetica', 'normal');
      doc.text(` — ${f.amount}`, margin + 4 + doc.getTextWidth(f.item + ' '), y);
      y += 5;
      if (f.conditions) {
        bodyText(f.conditions, 4);
      }
      y += 3;
    }
  }

  doc.save(`ContractIQ-Report-${filename.replace('.pdf', '')}.pdf`);
}
