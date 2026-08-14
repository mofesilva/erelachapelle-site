const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type LoginResponse = {
  accessToken: string;
  user: { id: string; name: string; email: string; role: "admin" | "editor" };
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // necessário pro navegador aceitar o cookie do refresh token
    body: JSON.stringify({ email, password }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? "Erro desconhecido");
  }

  return body as LoginResponse;
}
