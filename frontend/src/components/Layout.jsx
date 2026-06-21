import Header from './Header';
import { useTheme } from '../context/ThemeContext';

export default function Layout({ children, onNavigate, currentPage }) {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-navy-950'}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-teal-500 focus:text-white focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <Header onNavigate={onNavigate} currentPage={currentPage} />
      <main id="main-content" role="main">{children}</main>
    </div>
  );
}
