import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Search, X } from 'lucide-react';
import { portfolioData } from '../constants';
import { caseStudies } from '../data/caseStudies';
import CaseStudyCard from './CaseStudyCard';
import SectionWrapper from './ui/SectionWrapper';
import SectionHeader from './ui/SectionHeader';
import Button from './ui/Button';

function normalizeText(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const QUERY_SYNONYMS = {
  // AI/ML
  rag: ['retrieval augmented generation', 'vector', 'vectors', 'embedding', 'embeddings', 'pinecone', 'faiss', 'chroma', 'weaviate'],
  llm: ['large language model', 'openai', 'gemini', 'prompt', 'agent', 'agents', 'langchain'],
  agent: ['agents', 'agentic', 'multi agent', 'orchestration', 'tool calling'],
  ai: ['ml', 'machine learning', 'llm', 'rag', 'nlp', 'embedding', 'vector'],
  ml: ['machine learning', 'ai', 'pytorch', 'tensorflow'],

  // Mobile
  mobile: ['android', 'ios', 'react native', 'flutter', 'kotlin', 'swift'],
  android: ['mobile'],
  ios: ['mobile'],

  // Web / full-stack
  web: ['frontend', 'backend', 'full stack', 'fullstack', 'react', 'next', 'node', 'spring', 'api'],
  frontend: ['web', 'react', 'next', 'vue', 'angular'],
  backend: ['api', 'node', 'spring', 'fastapi', 'microservices'],
  fullstack: ['full stack', 'web', 'frontend', 'backend'],

  // Infra / architecture
  k8s: ['kubernetes', 'eks'],
  kubernetes: ['k8s', 'eks'],
  aws: ['ec2', 'eks', 's3', 'lambda', 'iam', 'cloudwatch'],
  docker: ['container', 'containers'],
  microservices: ['microservice', 'service', 'services', 'kafka'],
};

function buildQueryGroups(query) {
  const raw = normalizeText(query);
  if (!raw) return [];
  const tokens = raw.split(' ').filter(Boolean).filter((t) => t.length >= 2);
  // Deduplicate while preserving order
  const seen = new Set();
  const uniq = tokens.filter((t) => (seen.has(t) ? false : (seen.add(t), true)));

  return uniq.map((t) => {
    const syn = QUERY_SYNONYMS[t] || [];
    const group = [t, ...syn.map(normalizeText)].filter(Boolean);
    // remove duplicates inside group
    const gSeen = new Set();
    return group.filter((x) => (gSeen.has(x) ? false : (gSeen.add(x), true)));
  });
}

function scoreTextMatch(text, groups) {
  const t = normalizeText(text);
  if (!t) return 0;
  let score = 0;
  for (const g of groups) {
    let best = 0;
    for (const term of g) {
      if (!term) continue;
      const idx = t.indexOf(term);
      if (idx === -1) continue;
      // Heuristic: exact token/phrase present scores; earlier matches score higher.
      const base = term.length >= 6 ? 6 : term.length >= 4 ? 4 : 2;
      const posBoost = idx === 0 ? 4 : idx < 20 ? 2 : 0;
      best = Math.max(best, base + posBoost);
    }
    score += best;
  }
  return score;
}

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
  // Match: node, nodejs, node.js, node-js, NodeJS
  { id: 'node', label: 'Node.js', regex: /\b(node(\.js)?|nodejs|node-js)\b/i },
  { id: 'spring', label: 'Spring', regex: /\bspring\b/i },
  { id: 'java', label: 'Java', regex: /\bjava\b/i },
  { id: 'python', label: 'Python', regex: /\bpython\b/i },
  { id: 'fastapi', label: 'FastAPI', regex: /\bfastapi\b/i },
  { id: 'docker', label: 'Docker', regex: /\bdocker\b/i },
  { id: 'k8s', label: 'Kubernetes', regex: /\b(kubernetes|k8s)\b/i },
  { id: 'security', label: 'Security', regex: /\b(jwt|oauth|security|auth)\b/i },
  { id: 'ai', label: 'AI/ML', regex: /\b(ai|ml|llm|rag|agent|openai|gemini)\b/i },
  { id: 'mobile', label: 'Mobile', regex: /\b(android|ios|react native|mobile)\b/i },
  // Match common DB names + "db/database" + common typos seen in topics
  {
    id: 'db',
    label: 'Database',
    regex: /\b(db|database|sql|postgres(ql)?|postgressql|mysql|mariadb|mongo(db)?|mongodb|sqlite|redis|sequelize|orm)\b/i
  },
];

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

const CATEGORY_OPTIONS = ['All', 'AI/ML', 'Mobile', 'Web'];

function inferRepoCategory(repo, overrides) {
  const nameKey = String(repo?.name || '').toLowerCase();
  const override = overrides?.[nameKey];
  if (override === 'AI/ML' || override === 'Mobile' || override === 'Web') return override;

  const text = normalizeText(
    `${repo?.name || ''} ${repo?.full_name || ''} ${repo?.description || ''} ${(repo?.topics || []).join(' ')} ${repo?.language || ''}`
  );

  const isAi = /\b(rag|llm|agent|agents|agentic|openai|gemini|langchain|vector|embedding|embeddings|ml|ai|nlp|pytorch|tensorflow)\b/.test(text);
  if (isAi) return 'AI/ML';

  const isMobile = /\b(android|ios|react native|flutter|kotlin|swift|mobile)\b/.test(text);
  if (isMobile) return 'Mobile';

  return 'Web';
}

export default function GitHubProjects() {
  const username = getGithubUsername(portfolioData?.profile?.socials?.github);
  const repoCategoryOverrides = portfolioData?.github?.repoCategories || {};

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window === 'undefined') return 6;
    // Tailwind md breakpoint is 768px; treat <768 as mobile.
    return window.matchMedia?.('(max-width: 767px)')?.matches ? 3 : 6;
  });
  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window === 'undefined') return 6;
    return window.matchMedia?.('(max-width: 767px)')?.matches ? 3 : 6;
  });

  useEffect(() => {
    // Responsive paging: 3 on mobile, 6 on desktop. Keep it in sync on resize.
    if (typeof window === 'undefined' || !window.matchMedia) return () => {};
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => {
      const next = mq.matches ? 3 : 6;
      setPageSize(next);
      setVisibleCount(next); // collapse on breakpoint change to avoid confusion
    };
    apply();
    // Safari <14 uses addListener/removeListener
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else mq.addListener(apply);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', apply);
      else mq.removeListener(apply);
    };
  }, []);

  useEffect(() => {
    // Any filter change should reset pagination for clarity
    setVisibleCount(pageSize);
  }, [query, category, selectedKeywords, pageSize]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function load() {
      setError('');

      const cacheKey = `gh_repos_${username}`;
      const ttlMs = 1000 * 60 * 60 * 6; // 6h

      let cachedData = null;
      let cacheFresh = false;
      try {
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (cached?.ts && Array.isArray(cached?.data)) {
            cachedData = cached.data;
            cacheFresh = Date.now() - cached.ts < ttlMs;
            if (isMounted) setRepos(cached.data); // show cache immediately
          }
        }
      } catch {
        // ignore cache issues
      }

      if (isMounted) {
        // If we have something cached, don't block UI with a full-screen loading state.
        setLoading(!cachedData);
        setRefreshing(Boolean(cachedData) && !cacheFresh);
      }

      if (cacheFresh) {
        if (isMounted) {
          setLoading(false);
          setRefreshing(false);
        }
        return;
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
        if (isMounted) {
          setLoading(false);
          setRefreshing(false);
        }
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

  const preparedRepos = useMemo(() => {
    // Attach derived fields once so filtering is cheaper + consistent.
    return (Array.isArray(repos) ? repos : []).map((r) => ({
      ...r,
      _category: inferRepoCategory(r, repoCategoryOverrides),
    }));
  }, [repos, repoCategoryOverrides]);

  const filtered = useMemo(() => {
    const q = query.trim();
    const groups = buildQueryGroups(q);
    const activeKeywordDefs = KEYWORD_FILTERS.filter((k) => selectedKeywords.includes(k.id));

    let list = preparedRepos.slice();

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

    if (category !== 'All') {
      list = list.filter((r) => (r._category || 'Web') === category);
    }

    if (activeKeywordDefs.length) {
      list = list.filter((r) => {
        const text = `${r.name || ''} ${r.description || ''} ${(r.topics || []).join(' ')} ${r.language || ''}`;
        return activeKeywordDefs.every((k) => k.regex.test(text));
      });
    }

    if (groups.length) {
      list = list
        .map((r) => {
          const haystack = `${r.name || ''} ${r.full_name || ''} ${r.description || ''} ${(r.topics || []).join(' ')} ${r.language || ''} ${r._category || ''}`;
          const score = scoreTextMatch(haystack, groups);
          return { ...r, _score: score };
        })
        .filter((r) => r._score > 0)
        .sort((a, b) => {
          // Highest relevance first; fallback to curated order / updated_at where applicable
          if (b._score !== a._score) return b._score - a._score;
          return String(a.name || '').localeCompare(String(b.name || ''));
        });
    }

    return list;
  }, [preparedRepos, query, category, selectedKeywords]);

  // Convert GitHub repos to case study format
  const reposAsCaseStudies = useMemo(() => {
    return filtered.map((repo) => {
      // Try to find matching case study by repo name
      const repoNameLower = String(repo.name || '').toLowerCase();
      const matchingCaseStudy = caseStudies.find((cs) => {
        const csRepoName = cs.links?.repo?.split('/').pop()?.toLowerCase();
        return csRepoName === repoNameLower;
      });

      if (matchingCaseStudy) {
        // Use existing case study data
        return matchingCaseStudy;
      }

      // Create a simplified case study from GitHub repo data
      const stack = [
        repo.language || '',
        ...(repo.topics || []).slice(0, 4)
      ].filter(Boolean);

      return {
        id: `github-${repo.id}`,
        slug: `github-${repoNameLower}`,
        title: repo.name || 'Untitled Project',
        subtitle: repo.description || 'GitHub repository',
        category: repo._category || 'Web',
        oneLiner: repo.description || 'No description provided.',
        readTime: '2 min read',
        role: 'Repo Owner',
        stack: stack.length > 0 ? stack : ['Code'],
        impactChips: repo.stargazers_count > 0 ? [
          { label: 'Stars', value: `${repo.stargazers_count}` }
        ] : [],
        videoUrl: null,
        problem: ['Project details available in repository'],
        myRole: ['Repository owner and primary contributor'],
        architecture: {
          description: repo.description || 'See repository for architecture details.',
          components: stack.slice(0, 4)
        },
        keyDecisions: ['See repository for implementation details'],
        results: repo.stargazers_count > 0 ? [
          { label: 'GitHub Stars', value: `${repo.stargazers_count}` }
        ] : [],
        improvements: ['See repository for future improvements'],
        links: {
          demo: null,
          repo: repo.html_url,
          caseStudy: `#github-${repoNameLower}`
        }
      };
    });
  }, [filtered]);

  return (
    <SectionWrapper id="all-projects" aria-label="Projects">
      <SectionHeader
        title="More Projects"
      />

        {/* Controls */}
        <div className="bg-slate-900/90 rounded-2xl p-4 md:p-5 mb-6 shadow-sm border border-orange-400/20">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search (tags/skills: rag, agent, spring, k8s, mobile, web…)"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-white/10 bg-slate-800/50 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400/40"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-white/10 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400/40"
              aria-label="Filter by category"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c} className="bg-slate-800">
                  {c}
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
                      ? 'bg-orange-400 text-white border-orange-400 hover:bg-orange-300'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-orange-400/30 hover:text-white'
                  }`}
                >
                  {k.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-xs text-slate-400">
            Showing <span className="font-semibold text-white">{Math.min(visibleCount, reposAsCaseStudies.length)}</span> of{' '}
            <span className="font-semibold text-white">{reposAsCaseStudies.length}</span> curated repos.
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-slate-400 py-10">Loading GitHub projects…</div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-10">No repos match your filters.</div>
        ) : (
          <>
            {refreshing ? (
              <div className="text-center text-slate-400 text-xs -mt-2 mb-4">Updating from GitHub…</div>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-6">
              {reposAsCaseStudies.slice(0, visibleCount).map((caseStudy, idx) => (
                <motion.div
                  key={caseStudy.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(idx, 8) * 0.04 }}
                >
                  <CaseStudyCard caseStudy={caseStudy} />
                </motion.div>
              ))}
            </div>

            {(reposAsCaseStudies.length > visibleCount || visibleCount > pageSize) && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                {reposAsCaseStudies.length > visibleCount ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => setVisibleCount((n) => Math.min(reposAsCaseStudies.length, n + pageSize))}
                    className="rounded-full shadow-sm"
                  >
                    Load more
                  </Button>
                ) : null}

                {visibleCount > pageSize ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setVisibleCount(pageSize)}
                    className="rounded-full shadow-sm"
                  >
                    Show less
                  </Button>
                ) : null}
              </div>
            )}
          </>
        )}
    </SectionWrapper>
  );
}


