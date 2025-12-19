import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Search, X } from 'lucide-react';
import { portfolioData } from '../constants';

function inferLanguageFromTopics(topics = []) {
  const text = topics.join(' ').toLowerCase();
  if (/\b(java|spring)\b/.test(text)) return 'Java';
  if (/\btypescript\b/.test(text)) return 'TypeScript';
  if (/\bjavascript\b/.test(text)) return 'JavaScript';
  if (/\bpython\b/.test(text)) return 'Python';
  if (/\bnode(\.js)?\b/.test(text)) return 'JavaScript';
  if (/\breact\b/.test(text)) return 'JavaScript';
  return null;
}

function getGithubUsername(urlOrUsername) {
  if (!urlOrUsername) return '';
  try {
    const u = new URL(urlOrUsername);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[0] || '';
  } catch {
    return String(urlOrUsername).replace(/^@/, '').trim();
  }
}

const KEYWORD_FILTERS = [
  { id: 'react', label: 'React', regex: /\breact\b/i },
  { id: 'node', label: 'Node.js', regex: /\bnode(\.js)?\b/i },
  { id: 'spring', label: 'Spring', regex: /\bspring\b/i },
  { id: 'java', label: 'Java', regex: /\bjava\b/i },
  { id: 'python', label: 'Python', regex: /\bpython\b/i },
  { id: 'fastapi', label: 'FastAPI', regex: /\bfastapi\b/i },
  { id: 'docker', label: 'Docker', regex: /\bdocker\b/i },
  { id: 'k8s', label: 'Kubernetes', regex: /\b(kubernetes|k8s)\b/i },
  { id: 'security', label: 'Security', regex: /\b(jwt|oauth|security|auth)\b/i },
  { id: 'ai', label: 'AI/ML', regex: /\b(ai|ml|llm|rag|agent|openai|gemini)\b/i },
  { id: 'mobile', label: 'Mobile', regex: /\b(android|ios|react native|mobile)\b/i },
  { id: 'db', label: 'Database', regex: /\b(sql|postgres|mysql|mongodb|sqlite|redis|sequelize)\b/i },
];

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

export default function GitHubProjects() {
  const username = getGithubUsername(portfolioData?.profile?.socials?.github);

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('All');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError('');

      const cacheKey = `gh_repos_${username}`;
      const ttlMs = 1000 * 60 * 60 * 6; // 6h

      try {
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (cached?.ts && Array.isArray(cached?.data) && Date.now() - cached.ts < ttlMs) {
            if (isMounted) setRepos(cached.data);
            if (isMounted) setLoading(false);
            return;
          }
        }
      } catch {
        // ignore cache issues
      }

      try {
        const res = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/vnd.github+json',
            },
          }
        );

        if (!res.ok) {
          throw new Error(`GitHub API error (${res.status})`);
        }

        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : [])
          .filter((r) => r && !r.private)
          .map((r) => ({
            id: r.id,
            name: r.name,
            full_name: r.full_name,
            html_url: r.html_url,
            description: r.description || 'No description provided.',
            language: r.language || inferLanguageFromTopics(r.topics),
            stargazers_count: r.stargazers_count,
            forks_count: r.forks_count,
            updated_at: r.updated_at,
            topics: r.topics || [],
            fork: r.fork,
            archived: r.archived,
          }));

        // Add missing curated repos that are under other owners
        const curated = portfolioData?.github?.curatedRepos || [];
        const owners = portfolioData?.github?.repoOwners || {};
        const have = new Set(normalized.map((r) => String(r.name).toLowerCase()));

        const missing = curated.filter((name) => !have.has(String(name).toLowerCase()));

        if (missing.length) {
          const extras = await Promise.all(
            missing.map(async (name) => {
              const owner = owners?.[name] || username;
              try {
                const resRepo = await fetch(
                  `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
                  {
                    signal: controller.signal,
                    headers: { Accept: 'application/vnd.github+json' }
                  }
                );
                if (!resRepo.ok) return null;
                const r = await resRepo.json();
                return {
                  id: r.id,
                  name: r.name,
                  full_name: r.full_name,
                  html_url: r.html_url,
                  description: r.description || 'No description provided.',
                  language: r.language || inferLanguageFromTopics(r.topics),
                  stargazers_count: r.stargazers_count,
                  forks_count: r.forks_count,
                  updated_at: r.updated_at,
                  topics: r.topics || [],
                  fork: r.fork,
                  archived: r.archived,
                };
              } catch {
                return null;
              }
            })
          );

          extras.filter(Boolean).forEach((r) => normalized.push(r));
        }

        if (isMounted) setRepos(normalized);

        try {
          localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: normalized }));
        } catch {
          // ignore cache write issues
        }
      } catch (e) {
        if (e?.name === 'AbortError') return;
        if (isMounted) setError(e?.message || 'Failed to load GitHub projects');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (!username) {
      setLoading(false);
      setError('Missing GitHub username in profile.socials.github');
      return () => {};
    }

    load();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [username]);

  const languages = useMemo(() => {
    const set = new Set();
    repos.forEach((r) => r.language && set.add(r.language));
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [repos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const activeKeywordDefs = KEYWORD_FILTERS.filter((k) => selectedKeywords.includes(k.id));

    let list = repos.slice();

    // Always hide forks + archived (keeps signal high)
    list = list.filter((r) => !r.fork && !r.archived);

    // Curate: only show what you’d be proud to explain in an interview
    const curated = portfolioData?.github?.curatedRepos || [];
    const hidden = new Set((portfolioData?.github?.hiddenRepos || []).map((x) => String(x).toLowerCase()));
    const curatedSet = new Set(curated.map((x) => String(x).toLowerCase()));

    if (curatedSet.size) {
      list = list.filter((r) => curatedSet.has(String(r.name || '').toLowerCase()));
      // keep curated ordering
      const order = new Map(curated.map((name, i) => [String(name).toLowerCase(), i]));
      list.sort((a, b) => (order.get(String(a.name).toLowerCase()) ?? 9999) - (order.get(String(b.name).toLowerCase()) ?? 9999));
    } else if (hidden.size) {
      list = list.filter((r) => !hidden.has(String(r.name || '').toLowerCase()));
      // default sort: recently updated
      list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      // cap to best ~8 if no curated list provided
      list = list.slice(0, 8);
    } else {
      // fallback: recently updated
      list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      list = list.slice(0, 8);
    }

    if (language !== 'All') {
      list = list.filter((r) => (r.language || 'Unknown') === language);
    }

    if (q) {
      list = list.filter((r) => {
        const text = `${r.name || ''} ${r.description || ''} ${(r.topics || []).join(' ')} ${r.language || ''}`.toLowerCase();
        return text.includes(q);
      });
    }

    if (activeKeywordDefs.length) {
      list = list.filter((r) => {
        const text = `${r.name || ''} ${r.description || ''} ${(r.topics || []).join(' ')} ${r.language || ''}`;
        return activeKeywordDefs.every((k) => k.regex.test(text));
      });
    }

    return list;
  }, [repos, query, language, selectedKeywords]);

  return (
    <section
      id="all-projects"
      aria-label="Curated GitHub Projects"
      className="py-20 bg-white relative overflow-hidden scroll-mt-24"
    >
      <div className="absolute inset-0 section-glow pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            More Projects (Curated GitHub)
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Only repositories I’d confidently walk through in an interview.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="glass-panel rounded-2xl p-4 md:p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search repos (name, description, language)…"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 text-slate-500"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Language */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              aria-label="Filter by language"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {KEYWORD_FILTERS.map((k) => {
              const active = selectedKeywords.includes(k.id);
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() =>
                    setSelectedKeywords((prev) =>
                      prev.includes(k.id) ? prev.filter((x) => x !== k.id) : [...prev, k.id]
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {k.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{Math.min(visibleCount, filtered.length)}</span> of{' '}
            <span className="font-semibold text-slate-700">{filtered.length}</span> curated repos.
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-slate-500 py-10">Loading GitHub projects…</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-500 py-10">No repos match your filters.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(0, visibleCount).map((r, idx) => (
                <motion.a
                  key={r.id}
                  href={r.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: Math.min(idx, 8) * 0.04 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow p-5 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-lg font-bold text-slate-900 truncate">{r.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {r.description || 'No description provided.'}
                      </p>
                      {r.topics?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {r.topics.slice(0, 6).map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ExternalLink className="text-slate-400 flex-shrink-0" size={18} />
                  </div>
                </motion.a>
              ))}
            </div>

            {filtered.length > visibleCount && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((n) => Math.min(filtered.length, n + 6))}
                  className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}


