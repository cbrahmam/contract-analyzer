import { useState, useEffect } from 'react';

const shortcuts = [
  { keys: ['Esc'], description: 'Go to home' },
  { keys: ['Ctrl', '1'], description: 'Analyze page' },
  { keys: ['Ctrl', '2'], description: 'Compare page' },
  { keys: ['Ctrl', '3'], description: 'History page' },
  { keys: ['?'], description: 'Toggle this help' },
];

export default function KeyboardShortcutsHelp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function toggle() {
      setVisible(v => !v);
    }
    document.addEventListener('toggle-shortcuts-help', toggle);
    return () => document.removeEventListener('toggle-shortcuts-help', toggle);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center"
      onClick={() => setVisible(false)}
    >
      <div
        className="bg-navy-900 border border-navy-700 rounded-2xl p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-white font-bold text-lg mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-3">
          {shortcuts.map(s => (
            <div key={s.description} className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">{s.description}</span>
              <div className="flex gap-1">
                {s.keys.map(k => (
                  <kbd
                    key={k}
                    className="px-2 py-1 rounded bg-navy-800 border border-navy-700 text-xs text-slate-300 font-mono"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-4 text-center">Press ? or click outside to close</p>
      </div>
    </div>
  );
}
