import { useState, useRef, useEffect } from 'react';
import { chatAboutContract } from '../api/client';

const SUGGESTED_QUESTIONS = [
  'What are the main obligations for each party?',
  'Are there any unusual or one-sided clauses?',
  'What happens if either party wants to terminate?',
  'What are the key deadlines I should be aware of?',
  'Is there a liability cap? What is it?',
];

export default function ContractChat({ filename }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(question) {
    const q = question || input.trim();
    if (!q || loading) return;

    const history = messages.map(m => ({ question: m.question, response: m.response }));
    setMessages(prev => [...prev, { role: 'user', question: q }]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatAboutContract(filename, q, history);
      setMessages(prev => [...prev, { role: 'assistant', question: q, response }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        question: q,
        response: { answer: err.message, references: [] },
        isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-20 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center hover:scale-105 transition-transform no-print"
        aria-label="Open contract chat"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[520px] rounded-2xl border border-navy-700 bg-navy-900 shadow-2xl shadow-black/40 flex flex-col no-print">
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">Ask about this contract</span>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="p-1 rounded hover:bg-navy-800 text-slate-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px] max-h-[340px]">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-slate-500 text-xs mb-2">Suggested questions:</p>
            {SUGGESTED_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="block w-full text-left px-3 py-2 rounded-lg bg-navy-800/50 text-slate-400 text-xs hover:bg-navy-800 hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.filter(m => m.role === 'assistant').map((msg, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-end">
              <div className="max-w-[80%] px-3 py-2 rounded-xl bg-teal-500/10 text-teal-300 text-sm">
                {msg.question}
              </div>
            </div>
            <div className={`px-3 py-2 rounded-xl text-sm ${msg.isError ? 'bg-red-500/10 text-red-400' : 'bg-navy-800/50 text-slate-300'}`}>
              <p>{msg.response.answer}</p>
              {msg.response.references?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {msg.response.references.map((ref, j) => (
                    <span key={j} className="px-1.5 py-0.5 rounded bg-navy-700 text-slate-500 text-xs">{ref}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-3 py-3 border-t border-navy-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about this contract..."
            className="flex-1 px-3 py-2 rounded-lg bg-navy-800 border border-navy-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="px-3 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-white transition-colors disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
