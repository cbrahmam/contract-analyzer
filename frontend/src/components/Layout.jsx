import Header from './Header';
import { useTheme } from '../context/ThemeContext';

export default function Layout({ children, onNavigate, currentPage }) {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-navy-950'}`}>
      <Header onNavigate={onNavigate} currentPage={currentPage} />
      <main>{children}</main>
    </div>
  );
}
