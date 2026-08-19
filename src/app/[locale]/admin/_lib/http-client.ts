import { ApiError } from "@/lib/admin-api";
import { authTokenBridge } from "./auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RequestOptions = {
  method?: string;
  /** FormData (upload) vai direto, sem JSON.stringify — o browser seta o boundary do multipart sozinho. */
  body?: unknown | FormData;
  /** Só nas rotas protegidas — GET das taxonomias é público na API. */
  token?: string;
};

// Compartilhada entre chamadas concorrentes: se duas requisições levam 401 ao mesmo
// tempo, só a primeira bate em /auth/refresh — as demais esperam a mesma promise.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // cookie httpOnly do refresh token
    })
      .then(async (res) => {
        const payload = await res.json().catch(() => null);
        if (!res.ok) throw new ApiError(res.status, payload?.error ?? "Sessão expirada");
        return (payload as { accessToken: string }).accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function send(
  path: string,
  { method = "GET", body, token }: RequestOptions
): Promise<{ res: Response; payload: unknown }> {
  const isFormData = body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include", // o refresh token é cookie httpOnly
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  // DELETE responde 204 sem corpo — .json() aqui estouraria.
  const payload = res.status === 204 ? null : await res.json().catch(() => null);
  return { res, payload };
}

/**
 * Base HTTP do backoffice: monta a URL, injeta o Bearer e converte resposta não-ok
 * em ApiError, pra nenhuma camada acima precisar mexer em `res.ok`/status.
 *
 * Um 401 numa rota protegida costuma só significar access token vencido (dura 15min)
 * — nesse caso renova em silêncio via /auth/refresh e repete a chamada original uma
 * única vez. O usuário só percebe algo se o refresh token (cookie, 30 dias) também
 * tiver expirado: aí a sessão é encerrada e o layout redireciona pro login.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { res, payload } = await send(path, options);

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    if (res.status === 401 && options.token) {
      // Só o refresh falhando significa que a sessão de fato acabou (cookie
      // vencido/inválido) — um erro do retry em si não deve derrubar a sessão.
      let newToken: string;
      try {
        newToken = await refreshAccessToken();
      } catch (err) {
        authTokenBridge.onSessionExpired();
        throw err;
      }

      authTokenBridge.setToken(newToken);
      const retry = await send(path, { ...options, token: newToken });
      if (retry.res.status === 204) return undefined as T;
      if (!retry.res.ok) {
        if (retry.res.status === 401) authTokenBridge.onSessionExpired();
        throw new ApiError(
          retry.res.status,
          (retry.payload as { error?: string } | null)?.error ?? "Erro desconhecido"
        );
      }
      return retry.payload as T;
    }
    throw new ApiError(res.status, (payload as { error?: string } | null)?.error ?? "Erro desconhecido");
  }

  return payload as T;
}
