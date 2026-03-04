const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

function buildHeaders(customHeaders = {}) {
  return {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: buildHeaders(options.headers),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}
