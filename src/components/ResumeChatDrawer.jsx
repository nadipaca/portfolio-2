import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Loader2, MessageCircle, Send, X } from 'lucide-react';

const SUGGESTIONS = [
  'Do you have experience with AWS?',
  'Show me projects that use Spring Boot.',
  'What AI/RAG work have you done?',
  'What did you build at ITSC?',
  'Show me Node.js + Redis experience.',
];

function isExternalUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url);
}

const ResumeChatDrawer = forwardRef(function ResumeChatDrawer(_props, ref) {
  const [open, setOpen] = useState(false);
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen((v) => !v),
  }));
  const [apiStatus, setApiStatus] = useState({ state: 'unknown', hasGroqKey: null });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Ask me anything about my experience, projects, or tech stack. I’ll answer from the portfolio and cite sources.",
      citations: [],
    },
  ]);

  const listRef = useRef(null);
  const inputRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) throw new Error('Health check failed');
        setApiStatus({
          state: 'ok',
          hasGroqKey: Boolean(data?.hasGroqKey),
        });
      } catch {
        if (cancelled) return;
        setApiStatus({ state: 'down', hasGroqKey: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [open, messages.length]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
      // Cmd/Ctrl + K to toggle
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setError('');
    setLoading(true);
    setInput('');

    setMessages((prev) => [...prev, { role: 'user', content: trimmed, citations: [] }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const statusHint =
          res.status === 404
            ? 'API not found (local dev). Deploy to Vercel or run `vercel dev`.'
            : `HTTP ${res.status}`;
        throw new Error(data?.error || statusHint || 'Chat request failed');
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data?.answer || data?.content || 'No response.',
          citations: Array.isArray(data?.citations) ? data.citations : [],
          cached: Boolean(data?.cached),
        },
      ]);
    } catch (e) {
      setError(e?.message || 'Something went wrong.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I couldn't reach the AI service.\n\nReason: ${e?.message || 'Unknown error'}`,
          citations: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button (icon-only on mobile, text on md+) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
        aria-label="Open resume chat"
      >
        <MessageCircle size={18} />
        <span className="hidden md:inline text-sm font-semibold">Ask my resume</span>
        <span className="hidden md:inline text-xs text-white/80 ml-2">Ctrl/⌘K</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close chat"
              className="fixed inset-0 z-[59] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed top-0 right-0 z-[60] h-full w-full sm:w-[420px] bg-white shadow-2xl border-l border-slate-200 flex flex-col"
              initial={{ x: 480 }}
              animate={{ x: 0 }}
              exit={{ x: 480 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label="Resume chat drawer"
            >
              {/* Header */}
              <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">Resume Chat</div>
                    <div className="text-xs text-slate-500 leading-tight">
                      Grounded answers with citations
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`text-[11px] px-2 py-1 rounded-full border ${
                      apiStatus.state === 'ok'
                        ? apiStatus.hasGroqKey
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                        : apiStatus.state === 'down'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                    title={
                      apiStatus.state === 'ok'
                        ? apiStatus.hasGroqKey
                          ? 'API connected'
                          : 'API connected but GROQ_API_KEY missing'
                        : apiStatus.state === 'down'
                        ? 'API not reachable'
                        : 'Checking API…'
                    }
                  >
                    {apiStatus.state === 'ok'
                      ? apiStatus.hasGroqKey
                        ? 'Connected'
                        : 'Missing key'
                      : apiStatus.state === 'down'
                      ? 'Offline'
                      : 'Checking…'}
                  </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-md hover:bg-slate-100 text-slate-700"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={listRef} className="flex-1 overflow-auto px-4 py-4 space-y-4">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-900 border-slate-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>

                      {m.role !== 'user' && m.cached ? (
                        <div className="mt-2 text-[11px] text-slate-500">Cached response</div>
                      ) : null}

                      {m.role !== 'user' && Array.isArray(m.citations) && m.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200/70">
                          <div className="text-[11px] font-semibold text-slate-600 mb-2">Citations</div>
                          <div className="flex flex-col gap-1">
                            {m.citations.slice(0, 6).map((c, cIdx) => (
                              <a
                                key={cIdx}
                                href={c?.url || '#'}
                                target={isExternalUrl(c?.url) ? '_blank' : undefined}
                                rel={isExternalUrl(c?.url) ? 'noopener noreferrer' : undefined}
                                className="text-[11px] text-blue-700 hover:underline"
                                onClick={(e) => {
                                  if (!c?.url) return;
                                  if (c.url.startsWith('#')) {
                                    e.preventDefault();
                                    setOpen(false);
                                    const el = document.querySelector(c.url);
                                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }
                                }}
                              >
                                {c?.source || 'Source'}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      disabled={loading}
                      className="text-xs px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-white transition-colors disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-200">
                {error ? <div className="text-xs text-red-600 mb-2">{error}</div> : null}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (canSend) sendMessage(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about my projects, experience, AI work…"
                    className="flex-1 py-2.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  <button
                    type="submit"
                    disabled={!canSend}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2.5 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

export default ResumeChatDrawer;


