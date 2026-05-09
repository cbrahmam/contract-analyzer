import { useState } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import { uploadDocument, analyzeDocument } from './api/client';

export default function App() {
  const [page, setPage] = useState('home');
  const [stage, setStage] = useState('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [filename, setFilename] = useState('');

  async function handleFileSelect(file) {
    setStage('uploading');
    setError('');

    try {
      const uploadRes = await uploadDocument(file);
      setFilename(uploadRes.filename);

      setStage('analyzing');
      const analysisRes = await analyzeDocument(uploadRes.filename);

      setResult(analysisRes);
      setPage('results');
      setStage('idle');
    } catch (err) {
      setError(err.message);
      setStage('error');
    }
  }

  function handleReset() {
    setPage('home');
    setStage('idle');
    setError('');
    setResult(null);
    setFilename('');
  }

  return (
    <Layout>
      {page === 'home' ? (
        <HomePage
          stage={stage}
          error={error}
          onFileSelect={handleFileSelect}
          onRetry={handleReset}
        />
      ) : (
        <ResultsPage
          data={result}
          filename={filename}
          onReset={handleReset}
        />
      )}
    </Layout>
  );
}
