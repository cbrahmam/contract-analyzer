export function computeDiff(oldText, newText) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const result = [];

  const maxLen = Math.max(oldLines.length, newLines.length);

  let oi = 0;
  let ni = 0;

  while (oi < oldLines.length || ni < newLines.length) {
    if (oi >= oldLines.length) {
      result.push({ type: 'added', content: newLines[ni], lineNew: ni + 1 });
      ni++;
    } else if (ni >= newLines.length) {
      result.push({ type: 'removed', content: oldLines[oi], lineOld: oi + 1 });
      oi++;
    } else if (oldLines[oi] === newLines[ni]) {
      result.push({ type: 'unchanged', content: oldLines[oi], lineOld: oi + 1, lineNew: ni + 1 });
      oi++;
      ni++;
    } else {
      const lookAheadNew = newLines.indexOf(oldLines[oi], ni);
      const lookAheadOld = oldLines.indexOf(newLines[ni], oi);

      if (lookAheadNew !== -1 && (lookAheadOld === -1 || lookAheadNew - ni <= lookAheadOld - oi)) {
        while (ni < lookAheadNew) {
          result.push({ type: 'added', content: newLines[ni], lineNew: ni + 1 });
          ni++;
        }
      } else if (lookAheadOld !== -1) {
        while (oi < lookAheadOld) {
          result.push({ type: 'removed', content: oldLines[oi], lineOld: oi + 1 });
          oi++;
        }
      } else {
        result.push({ type: 'removed', content: oldLines[oi], lineOld: oi + 1 });
        result.push({ type: 'added', content: newLines[ni], lineNew: ni + 1 });
        oi++;
        ni++;
      }
    }
  }

  return result;
}

export function getDiffStats(diff) {
  const added = diff.filter(d => d.type === 'added').length;
  const removed = diff.filter(d => d.type === 'removed').length;
  const unchanged = diff.filter(d => d.type === 'unchanged').length;
  return { added, removed, unchanged, total: diff.length };
}
