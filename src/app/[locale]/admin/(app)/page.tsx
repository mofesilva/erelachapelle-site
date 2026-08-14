"use client";

import { useAdminAuth } from "../_lib/auth-context";

export default function AdminHomePage() {
  const { user } = useAdminAuth();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl">Bem-vindo, {user?.name}</h1>
      <p className="mt-2 text-muted-foreground">Papel: {user?.role}</p>
    </div>
  );
}
