import { useEffect } from 'react';

export default function useKeyboardShortcuts(onNavigate) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        onNavigate('home');
      }

      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        onNavigate('home');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault();
        onNavigate('compare');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '3') {
        e.preventDefault();
        onNavigate('history');
      }

      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        document.dispatchEvent(new CustomEvent('toggle-shortcuts-help'));
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);
}
