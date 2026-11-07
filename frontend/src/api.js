const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export function setAuthSession(token, user) {
  localStorage.setItem('zipbet_token', token);
  localStorage.setItem('zipbet_user', JSON.stringify(user));
  window.dispatchEvent(new Event('zipbet-auth-change'));
}

export function clearAuthSession() {
  localStorage.removeItem('zipbet_token');
  localStorage.removeItem('zipbet_user');
  window.dispatchEvent(new Event('zipbet-auth-change'));
}

export async function fetchAPI(path, options = {}) {
  const token = localStorage.getItem('zipbet_token');
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const response = await fetch(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}
