function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '');
}

function shouldTryLocalApiFallback() {
  return (
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    window.location?.hostname === 'localhost'
  );
}

export async function apiFetch(path, init) {
  const configuredBase = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL);
  const primaryUrl = configuredBase ? `${configuredBase}${path}` : path;
  const fallbackBase = trimTrailingSlash(
    import.meta.env.VITE_API_FALLBACK_URL ||
      import.meta.env.VITE_API_PROXY_TARGET ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:8001'
  );

  try {
    const res = await fetch(primaryUrl, init);
    if (res.status !== 404 || configuredBase || !shouldTryLocalApiFallback()) return res;

    // Dev fallback: if Vite proxy isn't running, hit the local API server directly.
    return await fetch(`${fallbackBase}${path}`, init);
  } catch (err) {
    if (!configuredBase && shouldTryLocalApiFallback()) {
      return await fetch(`${fallbackBase}${path}`, init);
    }
    throw err;
  }
}
