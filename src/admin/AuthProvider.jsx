import { createContext, useContext, useEffect, useState } from "react";
import { loginAdmin, getAdminSession, logoutAdmin } from "../api/endpoints";
const mock = import.meta.env.VITE_USE_MOCK_DATA !== "false";
const KEY = "adliens-admin-auth";
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (!mock) return null;
    try {
      return JSON.parse(localStorage.getItem(KEY))?.user || null;
    } catch {
      return null;
    }
  });
  const [isLoading, setLoading] = useState(!mock);
  useEffect(() => {
    let active = true;
    const expired = () => setUser(null);
    window.addEventListener("adliens:session-expired", expired);
    if (!mock) {
      localStorage.removeItem(KEY);
      getAdminSession()
        .then((s) => {
          if (active) setUser(s.user);
        })
        .catch(() => {
          if (active) setUser(null);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }
    return () => {
      active = false;
      window.removeEventListener("adliens:session-expired", expired);
    };
  }, []);
  const login = async (data) => {
    const result = await loginAdmin(data);
    const next = mock ? result : await getAdminSession();
    setUser(next.user);
    if (mock) localStorage.setItem(KEY, JSON.stringify(result));
  };
  const logout = async () => {
    if (!mock) await logoutAdmin();
    setUser(null);
    localStorage.removeItem(KEY);
  };
  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
