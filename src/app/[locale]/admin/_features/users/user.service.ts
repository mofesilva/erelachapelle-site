import { apiFetch } from "../../_lib/http-client";
import type { UserFormValues } from "./user.schema";
import type { User } from "./user.type";

/** Admin-only na API. Sem envelope de paginação: devolve o array inteiro. */
export function listUsers(token: string) {
  return apiFetch<User[]>("/users", { token });
}

export function createUser(values: UserFormValues, token: string) {
  return apiFetch<User>("/users", {
    method: "POST",
    token,
    body: {
      name: values.name,
      email: values.email,
      role: values.role,
      password: values.password,
    },
  });
}

/** PUT aceita corpo parcial; só manda `password` se o usuário digitou uma nova. */
export function updateUser(id: string, values: UserFormValues, token: string) {
  const body: Record<string, unknown> = {
    name: values.name,
    email: values.email,
    role: values.role,
  };
  if (values.password) body.password = values.password;
  return apiFetch<User>(`/users/${id}`, { method: "PUT", token, body });
}

/** Usado só pelo Switch da tabela — não passa pelo formulário. */
export function setUserActive(id: string, active: boolean, token: string) {
  return apiFetch<User>(`/users/${id}`, { method: "PUT", token, body: { active } });
}

/** Soft delete: a API seta active=false/deletedAt, sem apagar o documento. */
export function deleteUser(id: string, token: string) {
  return apiFetch<void>(`/users/${id}`, { method: "DELETE", token });
}
