import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import ComparePage from './pages/ComparePage';
import StatsPage from './pages/StatsPage';
import BatchPage from './pages/BatchPage';
import TemplatesPage from './pages/TemplatesPage';
import DeadlinesPage from './pages/DeadlinesPage';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import OnboardingTutorial from './components/OnboardingTutorial';
import ScrollToTop from './components/ScrollToTop';
import ToastContainer from './components/Toast';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { uploadDocument, analyzeDocument } from './api/client';
import { addToHistory } from './utils/history';
import { saveDeadlinesFromAnalysis } from './utils/deadlines';

export default function App() {
  const [page, setPage] = useState('home');
  const [stage, setStage] = useState('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [filename, setFilename] = useState('');

  useKeyboardShortcuts(setPage);

  async function handleFileSelect(file) {
    setStage('uploading');
    setError('');

    try {
      const uploadRes = await uploadDocument(file);
      setFilename(uploadRes.filename);

      setStage('analyzing');
      const analysisRes = await analyzeDocument(uploadRes.filename);

      addToHistory(uploadRes.filename, analysisRes);
      saveDeadlinesFromAnalysis(uploadRes.filename, analysisRes);
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
    <ErrorBoundary>
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
        {page === 'stats' && (
          <StatsPage onBack={() => setPage('home')} />
        )}
        {page === 'templates' && (
          <TemplatesPage onBack={() => setPage('home')} />
        )}
        {page === 'deadlines' && (
          <DeadlinesPage onBack={() => setPage('home')} />
        )}
        {page === 'batch' && (
          <BatchPage
            onBack={() => setPage('home')}
            onViewResult={handleViewHistoryResult}
          />
        )}
        <ToastContainer />
        <KeyboardShortcutsHelp />
        <ScrollToTop />
        <OnboardingTutorial />
      </Layout>
    </ThemeProvider>
    </ErrorBoundary>
  );
}
