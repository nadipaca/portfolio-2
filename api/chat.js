import Groq from 'groq-sdk';
import { portfolioData } from '../src/constants.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ---------- Simple in-memory cache + rate limit (best-effort on serverless) ----------
const CACHE_TTL_MS = 1000 * 60 * 60; // 1h
const cache = globalThis.__PORTFOLIO_CHAT_CACHE__ || new Map();
globalThis.__PORTFOLIO_CHAT_CACHE__ = cache;

const RATE_WINDOW_MS = 1000 * 60; // 1m
const RATE_MAX = 12; // per IP per minute (tune)
const rate = globalThis.__PORTFOLIO_CHAT_RATE__ || new Map();
globalThis.__PORTFOLIO_CHAT_RATE__ = rate;

function getClientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length) return xf.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function rateLimit(ip) {
  const now = Date.now();
  const entry = rate.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }
  entry.count += 1;
  rate.set(ip, entry);
  return { allowed: entry.count <= RATE_MAX, remaining: Math.max(0, RATE_MAX - entry.count), resetAt: entry.resetAt };
}

function normalizeText(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[`"'(){}\[\],.:;!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SYNONYMS = [
  ['aws', ['ec2', 'eks', 's3', 'lambda', 'iam', 'cloudwatch']],
  ['ai', ['ml', 'llm', 'rag', 'agent', 'agents', 'openai', 'gemini', 'vector', 'pinecone', 'langchain']],
  ['spring', ['spring boot', 'java spring', 'oauth', 'jwt']],
  ['node', ['node.js', 'express', 'bff']],
  ['react', ['frontend', 'ui', 'spa']],
  ['kafka', ['event', 'events', 'stream']],
  ['docker', ['container', 'containers']],
  ['kubernetes', ['k8s', 'eks']],
  ['postgres', ['postgresql', 'sql']],
];

function expandQueryTokens(q) {
  const base = new Set(normalizeText(q).split(' ').filter(Boolean));
  for (const [k, list] of SYNONYMS) {
    if (base.has(k)) list.forEach((x) => base.add(x));
  }
  return Array.from(base);
}

function buildDocs({ githubRepos }) {
  const docs = [];

  // Profile / education
  docs.push({
    id: 'profile',
    source: 'Profile',
    url: '#',
    text: `${portfolioData.profile.name}. ${portfolioData.profile.role}. ${portfolioData.profile.bio}. Availability: ${portfolioData.profile.availability}. Experience: ${portfolioData.profile.experience_years} years.`,
  });

  if (portfolioData.education) {
    const e = portfolioData.education;
    docs.push({
      id: 'education',
      source: 'Education',
      url: '#',
      text: `${e.degree} at ${e.school}, ${e.location}. ${e.meta || ''}. Coursework: ${(e.coursework || []).join(', ')}`,
    });
  }

  // Skills
  Object.entries(portfolioData.skills || {}).forEach(([cat, items]) => {
    docs.push({
      id: `skills-${cat}`,
      source: `Skills: ${cat}`,
      url: '#skills',
      text: `${cat}: ${(items || []).join(', ')}`,
    });
  });

  // Featured projects
  (portfolioData.projects || []).forEach((p) => {
    docs.push({
      id: `project-${p.id}`,
      source: `Project: ${p.title}`,
      url: '#projects',
      text: `${p.title}. Category: ${p.category}. Tech: ${(p.tech || []).join(', ')}. Summary: ${p.summary}. Results: ${(p.results || []).join('; ')}. Situation: ${p.situation || ''} Task: ${p.task || ''} Action: ${p.action || ''} Result: ${p.result || ''}`,
    });
  });

  // Experience
  (portfolioData.experience || []).forEach((x) => {
    docs.push({
      id: `experience-${x.id}`,
      source: `Experience: ${x.company} — ${x.role}`,
      url: '#experience',
      text: `${x.role} at ${x.company} (${x.period}). Summary: ${x.summary}. Problem: ${x.problem || ''}. Solution: ${x.solution || ''}. Metrics: ${(x.impact_metrics || []).map((m) => `${m.label}: ${m.value}`).join('; ')}. Architecture flow: ${(x.tech_stack_flow || []).join(' -> ')}`,
    });
  });

  // GitHub repos (optional)
  (githubRepos || []).forEach((r) => {
    docs.push({
      id: `repo-${r.full_name || r.name}`,
      source: `GitHub Repo: ${r.name}`,
      url: r.html_url,
      text: `${r.name}. Language: ${r.language || 'Unknown'}. ${r.description || ''}. Topics: ${(r.topics || []).join(', ')}`,
    });
  });

  return docs;
}

function scoreDoc(doc, tokens) {
  const t = normalizeText(doc.text);
  let score = 0;
  for (const tok of tokens) {
    if (!tok || tok.length < 2) continue;
    if (t.includes(tok)) score += tok.length >= 5 ? 3 : 2;
  }
  // prefer experience/projects slightly
  if (doc.id.startsWith('experience-')) score += 2;
  if (doc.id.startsWith('project-')) score += 1;
  return score;
}

async function fetchGithubRepos(username) {
  // best-effort fetch; can fail due to rate limiting; we still answer from portfolioData
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=50&sort=updated&type=owner`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (Array.isArray(data) ? data : []).filter((r) => r && !r.private).map((r) => ({
    name: r.name,
    full_name: r.full_name,
    html_url: r.html_url,
    description: r.description,
    language: r.language,
    topics: r.topics || [],
  }));
}

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'Missing GROQ_API_KEY' });

    const ip = getClientIp(req);
    const rl = rateLimit(ip);
    if (!rl.allowed) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    const { message } = req.body || {};
    const userMessage = String(message || '').trim();
    if (!userMessage) return res.status(400).json({ error: 'Missing message' });

    const cacheKey = normalizeText(userMessage);
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && now - cached.ts < CACHE_TTL_MS) {
      return res.status(200).json({ ...cached.value, cached: true });
    }

    // Lightweight retrieval
    const username = (portfolioData?.profile?.socials?.github || '').split('/').filter(Boolean).pop() || 'nadipaca';
    let githubRepos = [];
    try {
      githubRepos = await fetchGithubRepos(username);
    } catch {
      githubRepos = [];
    }
    const docs = buildDocs({ githubRepos });
    const tokens = expandQueryTokens(userMessage);
    const scored = docs
      .map((d) => ({ d, s: scoreDoc(d, tokens) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .filter((x) => x.s > 0);

    const context = scored.length
      ? scored
          .map(
            ({ d }) =>
              `SOURCE: ${d.source}\nURL: ${d.url}\nCONTENT: ${d.text}`
          )
          .join('\n\n---\n\n')
      : 'No relevant context found.';

    const system = `You are an assistant for a developer portfolio.
You MUST answer using ONLY the provided CONTEXT.
If the answer is not in the context, say: "I don't have enough information in this portfolio to answer that."

Return STRICT JSON (no markdown) with keys:
- answer: string (concise, helpful)
- citations: array of { source: string, url: string }
Keep citations limited to items you used.`;

    const prompt = `CONTEXT:\n${context}\n\nQUESTION:\n${userMessage}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    });

    const raw = completion?.choices?.[0]?.message?.content || '';
    const parsed = safeJsonParse(raw);
    const value =
      parsed && typeof parsed.answer === 'string'
        ? {
            answer: parsed.answer,
            citations: Array.isArray(parsed.citations) ? parsed.citations.slice(0, 6) : [],
          }
        : {
            answer: raw || "I couldn't generate a response.",
            citations: scored.map(({ d }) => ({ source: d.source, url: d.url })).slice(0, 4),
          };

    cache.set(cacheKey, { ts: now, value });
    return res.status(200).json({ ...value, cached: false });
  } catch (e) {
    // Never return secrets; only a safe message
    const message =
      e?.message?.includes('401') ? 'Groq auth failed (check GROQ_API_KEY).' :
      e?.message?.includes('429') ? 'Groq rate limit hit. Try again later.' :
      e?.message || 'Unexpected server error';

    return res.status(500).json({ error: message });
  }
}


