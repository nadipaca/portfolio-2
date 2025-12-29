import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { z } from 'zod';
import Groq from 'groq-sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { portfolioData } from './server-data.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8001;

// Trust proxy for correct IP detection
app.set('trust proxy', true);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Resend (only if API key is available)
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('⚠️  RESEND_API_KEY not set. Contact form emails will not be sent.');
}

// Zod schema for contact form validation
const contactSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email().max(120),
  message: z.string().min(10).max(2000),
  company: z.string().max(120).optional(),
  website: z.string().optional(), // Honeypot field
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const json = req.body;
    
    // Validate with Zod
    const data = contactSchema.parse(json);

    // Honeypot: if filled, it's a bot - silently return success
    if (data.website && data.website.trim().length > 0) {
      return res.status(200).json({ ok: true });
    }

    // Check if Resend is configured
    if (!resend || !process.env.RESEND_API_KEY) {
      console.error('Resend API key missing. Please set RESEND_API_KEY in .env file');
      // In development, log the submission instead of failing
      console.log('Contact form submission (email not sent):', {
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message
      });
      return res.status(200).json({ 
        ok: true,
        message: 'Message received (email service not configured - check server logs)' 
      });
    }

    const to = process.env.CONTACT_TO_EMAIL || process.env.EMAIL_USER || 'nadipaca@mail.uc.edu';
    const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';

    // Send email via Resend
    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Portfolio Contact: ${data.name}${data.company ? ` (${data.company})` : ''}`,
      text:
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        (data.company ? `Company: ${data.company}\n` : '') +
        `\nMessage:\n${data.message}\n`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #fb923c;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
    });

    console.log(`Contact form submission received from ${data.name} (${data.email})`);

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false,
        error: 'Invalid form data. Please check your inputs.' 
      });
    }
    
    return res.status(400).json({ 
      ok: false,
      error: 'Failed to send message' 
    });
  }
});

// Initialize Groq (only if API key is available)
let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
} else {
  console.warn('⚠️  GROQ_API_KEY not set. Chat functionality will not work.');
}

// ---------- Chat functionality (adapted from api/chat.js) ----------
const CACHE_TTL_MS = 1000 * 60 * 60; // 1h
const cache = globalThis.__PORTFOLIO_CHAT_CACHE__ || new Map();
globalThis.__PORTFOLIO_CHAT_CACHE__ = cache;

const RATE_WINDOW_MS = 1000 * 60; // 1m
const RATE_MAX = 12; // per IP per minute
const rate = globalThis.__PORTFOLIO_CHAT_RATE__ || new Map();
globalThis.__PORTFOLIO_CHAT_RATE__ = rate;

function getClientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length) return xf.split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || 'unknown';
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
    const skillData = items.primary || items.secondary || items;
    docs.push({
      id: `skills-${cat}`,
      source: `Skills: ${cat}`,
      url: '#skills',
      text: `${cat}: ${(Array.isArray(skillData) ? skillData : []).join(', ')}`,
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
  try {
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
  } catch {
    return [];
  }
}

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
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

function buildGithubHeaders() {
  const headers = { Accept: 'application/vnd.github+json' };
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function normalizeGithubRepoForClient(r) {
  return {
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    html_url: r.html_url,
    description: r.description || 'No description provided.',
    language: r.language || null,
    stargazers_count: r.stargazers_count || 0,
    forks_count: r.forks_count || 0,
    updated_at: r.updated_at,
    topics: r.topics || [],
    fork: Boolean(r.fork),
    archived: Boolean(r.archived),
    private: Boolean(r.private),
  };
}

async function fetchGithubReposForClient(username) {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`,
    { headers: buildGithubHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub API error (${res.status})`);
  const data = await res.json();
  return (Array.isArray(data) ? data : []).map(normalizeGithubRepoForClient);
}

async function fetchGithubRepoForClient(owner, name) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
      { headers: buildGithubHeaders() }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return normalizeGithubRepoForClient(data);
  } catch {
    return null;
  }
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    if (!groq || !process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Missing GROQ_API_KEY' });
    }

    const portfolioName = portfolioData?.profile?.name || 'this developer';
    const portfolioFirstName = String(portfolioName).split(' ').filter(Boolean)[0] || portfolioName;

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

    const system = `You are an assistant for ${portfolioFirstName}'s developer portfolio (${portfolioName}).
If the user says "hello" or greets you, reply that you're here to help with ${portfolioFirstName}'s portfolio (not a generic developer portfolio greeting).
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
    console.error('Chat error:', e);
    // Never return secrets; only a safe message
    const message =
      e?.message?.includes('401') ? 'Groq auth failed (check GROQ_API_KEY).' :
      e?.message?.includes('429') ? 'Groq rate limit hit. Try again later.' :
      e?.message || 'Unexpected server error';

    return res.status(500).json({ error: message });
  }
});

// GitHub repos endpoint (server-side proxy to avoid browser CORS/rate-limit issues)
app.get('/api/github', async (req, res) => {
  try {
    const username =
      String(req.query?.username || '').trim() ||
      getGithubUsername(portfolioData?.profile?.socials?.github) ||
      '';
    if (!username) return res.status(400).json({ error: 'Missing GitHub username' });

    const curated = portfolioData?.github?.curatedRepos || [];
    const owners = portfolioData?.github?.repoOwners || {};

    const repos = await fetchGithubReposForClient(username);
    const visible = repos.filter((r) => r && !r.private);

    const have = new Set(visible.map((r) => String(r.name).toLowerCase()));
    const missing = curated.filter((name) => !have.has(String(name).toLowerCase()));
    if (missing.length) {
      const extras = await Promise.all(
        missing.map(async (name) => {
          const owner = owners?.[name] || username;
          return await fetchGithubRepoForClient(owner, name);
        })
      );
      extras.filter(Boolean).forEach((r) => visible.push(r));
    }

    return res.status(200).json({ repos: visible });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Failed to load GitHub repos' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    hasGroqKey: Boolean(process.env.GROQ_API_KEY)
  });
});

// Test endpoint to verify routing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API routing is working!' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

server.on('error', (err) => {
  if (err?.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the other process using it, or set PORT in .env.local (and optionally VITE_API_PROXY_TARGET / VITE_API_BASE_URL).`
    );
    process.exit(1);
  }
  throw err;
});
