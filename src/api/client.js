const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

function getAuthToken() {
  const raw = localStorage.getItem('adliens-admin-auth');
  if (!raw) return null;
  try {
    return JSON.parse(raw)?.token || null;
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}
