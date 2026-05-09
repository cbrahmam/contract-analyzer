import { useState, useEffect, useCallback } from 'react';

let addToastFn = null;

export function showToast(message, type = 'success') {
  addToastFn?.({ message, type, id: Date.now() });
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 2500);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-fadeIn ${
            t.type === 'error'
              ? 'bg-red-500/90 text-white'
              : 'bg-teal-500/90 text-white'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
