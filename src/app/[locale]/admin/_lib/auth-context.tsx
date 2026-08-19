"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LoginResponse } from "@/lib/admin-api";

type AdminAuth = {
  accessToken: string | null;
  user: LoginResponse["user"] | null;
  setSession: (session: LoginResponse) => void;
  clearSession: () => void;
};

const AdminAuthContext = createContext<AdminAuth | null>(null);

/**
 * Ponte entre o `apiFetch` (fora da árvore React) e o estado do provider: permite
 * renovar o access token em silêncio após um 401 e encerrar a sessão se o refresh
 * também falhar, sem precisar passar callbacks por toda a cadeia de services.
 */
export const authTokenBridge = {
  getToken: (): string | null => null,
  setToken: (token: string) => {
    void token;
  },
  onSessionExpired: () => {},
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<LoginResponse["user"] | null>(null);

  function setSession(session: LoginResponse) {
    setAccessToken(session.accessToken);
    setUser(session.user);
  }

  function clearSession() {
    setAccessToken(null);
    setUser(null);
  }

  useEffect(() => {
    authTokenBridge.getToken = () => accessToken;
    authTokenBridge.setToken = setAccessToken;
    authTokenBridge.onSessionExpired = clearSession;
  }, [accessToken]);

  return (
    <AdminAuthContext.Provider value={{ accessToken, user, setSession, clearSession }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth precisa estar dentro de AdminAuthProvider");
  return ctx;
}
