export function buildPartyMatrix(obligations, parties) {
  const partySet = new Set(parties || []);
  const matrix = {};

  for (const o of obligations) {
    const party = o.party || 'Unknown';
    partySet.add(party);
    if (!matrix[party]) {
      matrix[party] = { high: [], medium: [], low: [], total: 0 };
    }
    const priority = (o.priority || 'medium').toLowerCase();
    if (priority === 'high') matrix[party].high.push(o);
    else if (priority === 'low') matrix[party].low.push(o);
    else matrix[party].medium.push(o);
    matrix[party].total++;
  }

  return { matrix, parties: [...partySet] };
}

export function getPartyRiskLevel(partyData) {
  if (!partyData) return 'none';
  if (partyData.high.length >= 3) return 'critical';
  if (partyData.high.length >= 1) return 'elevated';
  if (partyData.medium.length >= 3) return 'moderate';
  return 'low';
}

export function getPartyStats(matrix) {
  const entries = Object.entries(matrix);
  const mostObligated = entries.sort((a, b) => b[1].total - a[1].total)[0];
  const totalObligations = entries.reduce((sum, [, v]) => sum + v.total, 0);

  return {
    partyCount: entries.length,
    totalObligations,
    mostObligated: mostObligated ? mostObligated[0] : null,
    mostObligatedCount: mostObligated ? mostObligated[1].total : 0,
  };
}
