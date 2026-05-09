export default function FinancialTerms({ terms }) {
  if (terms.length === 0) return null;

  return (
    <section id="financial" className="animate-fadeIn">
      <div className="rounded-xl border border-navy-700 bg-navy-900/50 overflow-hidden">
        <div className="p-6 border-b border-navy-800">
          <h3 className="text-white font-semibold">Financial Terms</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-800">
                <th className="text-left p-4 text-slate-400 font-medium">Item</th>
                <th className="text-left p-4 text-slate-400 font-medium">Amount</th>
                <th className="text-left p-4 text-slate-400 font-medium">Conditions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {terms.map((t, i) => (
                <tr key={i} className="hover:bg-navy-800/30 transition-colors">
                  <td className="p-4 text-white font-medium">{t.item}</td>
                  <td className="p-4 text-teal-400">{t.amount}</td>
                  <td className="p-4 text-slate-400">{t.conditions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
