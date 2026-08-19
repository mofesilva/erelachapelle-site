"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "../../_lib/auth-context";
import {
  createUser,
  deleteUser,
  listUsers,
  setUserActive,
  updateUser,
} from "./user.service";
import type { UserFormValues } from "./user.schema";
import type { User } from "./user.type";

// A API local responde rápido demais pro shimmer do skeleton dar sequer pra perceber — o
// que também seria verdade em produção numa rede boa. Garantir um tempo mínimo de loading
// evita esse "flash" e deixa o carregamento sempre parecer intencional, não quebrado.
const MIN_LOADING_MS = 400;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useUsers() {
  const { accessToken, user: currentUser } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    const startedAt = Date.now();
    try {
      if (!accessToken) throw new Error("Sessão ausente");
      setUsers(await listUsers(accessToken));
    } catch {
      setLoadFailed(true);
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LOADING_MS) await sleep(MIN_LOADING_MS - elapsed);
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function requireToken() {
    if (!accessToken) throw new Error("Sessão ausente");
    return accessToken;
  }

  /** Deixa o erro subir: quem chama é o formulário, que sabe traduzir por status. */
  async function create(values: UserFormValues) {
    await createUser(values, requireToken());
    await fetchUsers();
  }

  async function update(id: string, values: UserFormValues) {
    await updateUser(id, values, requireToken());
    await fetchUsers();
  }

  async function remove(id: string) {
    await deleteUser(id, requireToken());
    // Sem paginação pra "recuar" — só tira da lista local.
    setUsers((prev) => prev.filter((u) => u._id !== id));
  }

  // Atualização otimista sem refetch: mais rápido que recarregar a lista inteira só pra
  // refletir um campo. Reverte se a chamada falhar.
  async function toggleActive(target: User) {
    const nextActive = !target.active;
    setUsers((prev) =>
      prev.map((u) => (u._id === target._id ? { ...u, active: nextActive } : u))
    );
    try {
      await setUserActive(target._id, nextActive, requireToken());
    } catch (err) {
      setUsers((prev) =>
        prev.map((u) => (u._id === target._id ? { ...u, active: target.active } : u))
      );
      throw err;
    }
  }

  return {
    users,
    loading,
    loadFailed,
    currentUserId: currentUser?.id ?? null,
    create,
    update,
    remove,
    toggleActive,
  };
}
