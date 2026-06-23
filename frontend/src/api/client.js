export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Upload failed');
  }

  return res.json();
}

export async function analyzeDocument(filename) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Analysis failed');
  }

  return res.json();
}

export async function compareDocuments(filenameA, filenameB) {
  const res = await fetch('/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename_a: filenameA, filename_b: filenameB }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Comparison failed');
  }

  return res.json();
}

export async function chatAboutContract(filename, question, history = []) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, question, history }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Chat failed');
  }

  return res.json();
}

export async function fetchSampleDocument() {
  const res = await fetch('/api/sample');
  if (!res.ok) throw new Error('Failed to fetch sample document');
  const blob = await res.blob();
  return new File([blob], 'sample-nda.pdf', { type: 'application/pdf' });
}
