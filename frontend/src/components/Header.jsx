import ThemeToggle from './ThemeToggle';

export default function Header({ onNavigate, currentPage }) {
  const navItems = [
    { key: 'home', label: 'Analyze' },
    { key: 'compare', label: 'Compare' },
    { key: 'history', label: 'History' },
    { key: 'stats', label: 'Analytics' },
  ];

  return (
    <header className="border-b border-navy-800 bg-navy-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ContractIQ</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.key
                    ? 'bg-teal-400/10 text-teal-400'
                    : 'text-slate-400 hover:text-white hover:bg-navy-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
