export function generateExecutiveBrief(data, filename) {
  const sections = [];

  sections.push({
    title: 'Document Overview',
    content: [
      `Document: ${filename}`,
      `Type: ${data.document_type || 'Contract'}`,
      `Parties: ${(data.parties || []).join(', ') || 'Not identified'}`,
      `Overall Risk: ${data.risk_score}/10 — ${data.risk_score_explanation || 'N/A'}`,
    ],
  });

  sections.push({
    title: 'Executive Summary',
    content: [data.executive_summary || 'No summary available.'],
  });

  if (data.risk_flags?.length > 0) {
    const high = data.risk_flags.filter(r => r.severity === 'High');
    const medium = data.risk_flags.filter(r => r.severity === 'Medium');
    sections.push({
      title: 'Risk Assessment',
      content: [
        `Total Risks: ${data.risk_flags.length} (${high.length} high, ${medium.length} medium)`,
        '',
        ...data.risk_flags.slice(0, 5).map(r =>
          `[${r.severity}] ${r.risk}: ${r.description}`
        ),
        ...(data.risk_flags.length > 5 ? [`... and ${data.risk_flags.length - 5} more`] : []),
      ],
    });
  }

  if (data.obligations?.length > 0) {
    sections.push({
      title: 'Key Obligations',
      content: data.obligations.slice(0, 5).map(o =>
        `- ${o.party}: ${o.description} (Deadline: ${o.deadline || 'Ongoing'})`
      ),
    });
  }

  if (data.financial_terms?.length > 0) {
    sections.push({
      title: 'Financial Terms',
      content: data.financial_terms.map(f =>
        `- ${f.item}: ${f.amount}${f.conditions ? ` (${f.conditions})` : ''}`
      ),
    });
  }

  if (data.key_dates?.length > 0) {
    sections.push({
      title: 'Important Dates',
      content: data.key_dates.map(d =>
        `- ${d.date}: ${d.description} (${d.significance})`
      ),
    });
  }

  sections.push({
    title: 'Recommendations',
    content: generateRecommendations(data),
  });

  return sections;
}

function generateRecommendations(data) {
  const recs = [];

  const highRisks = (data.risk_flags || []).filter(r => r.severity === 'High');
  if (highRisks.length > 0) {
    recs.push(`Address ${highRisks.length} high-severity risk(s) before signing.`);
  }

  const highPriority = (data.obligations || []).filter(o => o.priority === 'High');
  if (highPriority.length > 0) {
    recs.push(`Track ${highPriority.length} high-priority obligation(s) with calendar reminders.`);
  }

  if (data.risk_score >= 7) {
    recs.push('Consider legal counsel review due to elevated risk score.');
  } else if (data.risk_score >= 4) {
    recs.push('Review flagged risks with stakeholders before proceeding.');
  }

  if ((data.financial_terms || []).length > 0) {
    recs.push('Verify all financial terms and payment schedules with finance team.');
  }

  if (recs.length === 0) {
    recs.push('No critical issues identified. Standard review recommended before signing.');
  }

  return recs.map(r => `- ${r}`);
}

export function briefToText(sections) {
  const lines = ['EXECUTIVE BRIEF', '='.repeat(50), ''];
  for (const section of sections) {
    lines.push(section.title.toUpperCase());
    lines.push('-'.repeat(section.title.length));
    lines.push(...section.content);
    lines.push('');
  }
  lines.push(`Generated: ${new Date().toLocaleDateString()}`);
  return lines.join('\n');
}
