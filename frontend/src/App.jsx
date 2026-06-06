import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import ComparePage from './pages/ComparePage';
import ToastContainer from './components/Toast';
import { uploadDocument, analyzeDocument } from './api/client';
import { addToHistory } from './utils/history';

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

      addToHistory(uploadRes.filename, analysisRes);
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

  function handleViewHistoryResult(entry) {
    setResult(entry.data);
    setFilename(entry.filename);
    setPage('results');
  }

  return (
    <ThemeProvider>
      <Layout
        onNavigate={setPage}
        currentPage={page}
      >
        {page === 'home' && (
          <HomePage
            stage={stage}
            error={error}
            onFileSelect={handleFileSelect}
            onRetry={handleReset}
          />
        )}
        {page === 'results' && (
          <ResultsPage
            data={result}
            filename={filename}
            onReset={handleReset}
          />
        )}
        {page === 'history' && (
          <HistoryPage
            onViewResult={handleViewHistoryResult}
            onBack={() => setPage('home')}
          />
        )}
        {page === 'compare' && (
          <ComparePage onBack={() => setPage('home')} />
        )}
        <ToastContainer />
      </Layout>
    </ThemeProvider>
  );
}
