"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { LoginResponse } from "@/lib/admin-api";

type AdminAuth = {
  accessToken: string | null;
  user: LoginResponse["user"] | null;
  setSession: (session: LoginResponse) => void;
  clearSession: () => void;
};

const AdminAuthContext = createContext<AdminAuth | null>(null);

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
