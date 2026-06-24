import { useState, useMemo } from 'react';
import { getCalendarDays, getMonthName, formatDateKey, groupEventsByDate } from '../utils/calendar';

export default function ObligationCalendar({ obligations = [], dates = [] }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const events = useMemo(() => groupEventsByDate(obligations, dates), [obligations, dates]);
  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  const today = formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }

  const selectedKey = selectedDay ? formatDateKey(year, month, selectedDay) : null;
  const selectedEvents = selectedKey ? (events[selectedKey] || []) : [];

  const totalEvents = Object.values(events).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6" id="calendar">
      <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        Obligation Calendar
      </h2>
      <p className="text-slate-500 text-sm mb-4">{totalEvents} events from obligations and key dates</p>

      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h3 className="text-white font-semibold">{getMonthName(month)} {year}</h3>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs text-slate-600 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const key = formatDateKey(year, month, day);
          const hasEvents = !!events[key];
          const isToday = key === today;
          const isSelected = day === selectedDay;

          return (
            <button
              key={key}
              onClick={() => setSelectedDay(day === selectedDay ? null : day)}
              className={`relative p-2 rounded-lg text-sm text-center transition-colors ${
                isSelected
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : isToday
                    ? 'bg-navy-700 text-white border border-navy-600'
                    : 'hover:bg-navy-800/50 text-slate-400'
              }`}
            >
              {day}
              {hasEvents && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-400" />
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="mt-4 border-t border-navy-700 pt-4">
          <h4 className="text-sm font-medium text-white mb-2">
            {getMonthName(month)} {selectedDay}, {year}
          </h4>
          {selectedEvents.length === 0 ? (
            <p className="text-slate-600 text-sm">No events on this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-navy-800/30">
                  <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${ev.type === 'obligation' ? 'bg-amber-400' : 'bg-teal-400'}`} />
                  <div>
                    <p className="text-sm text-white">{ev.label}</p>
                    <p className="text-xs text-slate-500">
                      {ev.type === 'obligation' ? `${ev.party} · ${ev.priority} priority` : ev.significance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
