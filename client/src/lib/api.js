const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

function buildHeaders(customHeaders = {}) {
  return {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
}

export async function apiRequest(path, options = {}) {
  const { timeoutMs, ...fetchOptions } = options;

  const controller =
    !fetchOptions.signal && typeof timeoutMs === 'number' ? new AbortController() : null;
  const timeoutId =
    controller && timeoutMs > 0 ? window.setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      credentials: 'include',
      headers: buildHeaders(fetchOptions.headers),
      signal: fetchOptions.signal ?? controller?.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
}

export async function warmupApi({ timeoutMs = 8000 } = {}) {
  try {
    await apiRequest('/health', { method: 'GET', timeoutMs });
  } catch (_error) {
    // Best-effort: only used to wake sleeping backends (e.g., Render free tier).
  }
}
