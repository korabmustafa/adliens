const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith("/auth/sign-in"))
      window.dispatchEvent(new Event("adliens:session-expired"));
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}
