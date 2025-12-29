import { portfolioData } from '../server-data.js';

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

function normalizeRepo(r) {
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

async function fetchUserRepos(username, signal) {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`,
    { headers: buildGithubHeaders(), signal }
  );
  if (!res.ok) throw new Error(`GitHub API error (${res.status})`);
  const data = await res.json();
  return (Array.isArray(data) ? data : []).map(normalizeRepo);
}

async function fetchRepo(owner, name, signal) {
  const res = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
    { headers: buildGithubHeaders(), signal }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return normalizeRepo(data);
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const username =
      String(req.query?.username || '').trim() ||
      getGithubUsername(portfolioData?.profile?.socials?.github) ||
      '';
    if (!username) return res.status(400).json({ error: 'Missing GitHub username' });

    const curated = portfolioData?.github?.curatedRepos || [];
    const owners = portfolioData?.github?.repoOwners || {};

    const repos = await fetchUserRepos(username);
    const visible = repos.filter((r) => r && !r.private);

    const have = new Set(visible.map((r) => String(r.name).toLowerCase()));
    const missing = curated.filter((name) => !have.has(String(name).toLowerCase()));
    if (missing.length) {
      const extras = await Promise.all(
        missing.map(async (name) => {
          const owner = owners?.[name] || username;
          return await fetchRepo(owner, name);
        })
      );
      extras.filter(Boolean).forEach((r) => visible.push(r));
    }

    return res.status(200).json({ repos: visible });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Failed to load GitHub repos' });
  }
}

