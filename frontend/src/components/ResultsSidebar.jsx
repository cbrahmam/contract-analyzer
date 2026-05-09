const sections = [
  { id: 'summary', label: 'Summary' },
  { id: 'terms', label: 'Key Terms' },
  { id: 'obligations', label: 'Obligations' },
  { id: 'risks', label: 'Risk Flags' },
  { id: 'dates', label: 'Key Dates' },
  { id: 'financial', label: 'Financial' },
];

export default function ResultsSidebar({ activeSection }) {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="hidden lg:block w-48 shrink-0">
      <div className="sticky top-[140px] space-y-1">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === s.id
                ? 'bg-teal-400/10 text-teal-400'
                : 'text-slate-500 hover:text-slate-300 hover:bg-navy-800/50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
