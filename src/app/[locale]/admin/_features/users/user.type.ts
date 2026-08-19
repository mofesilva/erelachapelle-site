export const ROLES = ["admin", "editor"] as const;

export type Role = (typeof ROLES)[number];

/** O documento como `GET /users` devolve (já sem `passwordHash`, datas em string ISO). */
export type User = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  deleted: boolean;
  deletedAt: string | null;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
};
