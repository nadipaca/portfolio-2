import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, GitFork, Search, Star, X } from 'lucide-react';
import { portfolioData } from '../constants';

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
  const [sort, setSort] = useState('updated'); // updated | stars | name
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [includeForks, setIncludeForks] = useState(false);

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
            description: r.description,
            language: r.language,
            stargazers_count: r.stargazers_count,
            forks_count: r.forks_count,
            updated_at: r.updated_at,
            topics: r.topics || [],
            fork: r.fork,
            archived: r.archived,
          }));

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

    if (!includeForks) list = list.filter((r) => !r.fork);
    list = list.filter((r) => !r.archived);

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

    if (sort === 'stars') {
      list.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
    } else if (sort === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else {
      list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }

    return list;
  }, [repos, query, language, sort, selectedKeywords, includeForks]);

  return (
    <section aria-label="GitHub Projects" className="mt-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h3 className="text-3xl font-bold text-slate-900 mb-2">All Projects (GitHub)</h3>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Browse my public repositories. Search and filter by tech keywords.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="glass-panel rounded-2xl p-4 md:p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_160px_auto] gap-3 items-center">
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

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full py-2.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            aria-label="Sort"
          >
            <option value="updated">Sort: Recently updated</option>
            <option value="stars">Sort: Stars</option>
            <option value="name">Sort: Name</option>
          </select>

          {/* Include forks */}
          <label className="flex items-center gap-2 text-sm text-slate-700 select-none">
            <input
              type="checkbox"
              checked={includeForks}
              onChange={(e) => setIncludeForks(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/40"
            />
            Include forks
          </label>
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
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{repos.length}</span> repos
          {includeForks ? ' (including forks)' : ''}.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, idx) => (
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
                </div>
                <ExternalLink className="text-slate-400 flex-shrink-0" size={18} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200">
                  {r.language || 'Unknown'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <Star size={14} className="text-amber-500" />
                  {r.stargazers_count ?? 0}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <GitFork size={14} className="text-slate-500" />
                  {r.forks_count ?? 0}
                </span>
                <span className="ml-auto text-xs text-slate-500">Updated {formatDate(r.updated_at)}</span>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
}


