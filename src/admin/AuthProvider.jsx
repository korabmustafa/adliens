import { createContext, useContext, useMemo, useState } from 'react';
import { loginAdmin } from '../api/endpoints';

const KEY = 'adliens-admin-auth';

const AuthContext = createContext({
  token: null,
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  });

  const value = useMemo(
    () => ({
      ...session,
      isAuthenticated: Boolean(session.token),
      login: async (payload) => {
        const next = await loginAdmin(payload);
        setSession(next);
        localStorage.setItem(KEY, JSON.stringify(next));
      },
      logout: () => {
        const blank = { token: null, user: null };
        setSession(blank);
        localStorage.removeItem(KEY);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
