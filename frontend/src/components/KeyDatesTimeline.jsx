export default function KeyDatesTimeline({ dates }) {
  if (dates.length === 0) return null;

  return (
    <section id="dates" className="animate-fadeIn">
      <div className="rounded-xl border border-navy-700 bg-navy-900/50 overflow-hidden">
        <div className="p-6 border-b border-navy-800">
          <h3 className="text-white font-semibold">Key Dates & Deadlines</h3>
        </div>
        <div className="p-6">
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-navy-700" />
            <div className="space-y-6">
              {dates.map((d, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="relative shrink-0 mt-1.5">
                    <div className="w-[15px] h-[15px] rounded-full border-2 border-teal-400 bg-navy-950" />
                  </div>
                  <div>
                    <p className="text-teal-400 text-sm font-medium">{d.date}</p>
                    <p className="text-slate-300 text-sm mt-0.5">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
