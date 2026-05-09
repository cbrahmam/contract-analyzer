export default function KeyTermsTable({ terms }) {
  if (terms.length === 0) return null;

  return (
    <section id="terms" className="animate-fadeIn">
      <div className="rounded-xl border border-navy-700 bg-navy-900/50 overflow-hidden">
        <div className="p-6 border-b border-navy-800">
          <h3 className="text-white font-semibold">Key Terms</h3>
        </div>
        <div className="divide-y divide-navy-800">
          {terms.map((t, i) => (
            <div key={i} className="p-5 hover:bg-navy-800/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white font-medium mb-1">{t.term}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{t.summary}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-500 bg-navy-800 px-2 py-1 rounded">
                  {t.section_ref}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
