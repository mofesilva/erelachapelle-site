const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Conteúdo do backoffice muda pouco (poucos itens por mês, ver docs/contexto-e-referencia.md)
// — 5 min de cache mantém as páginas rápidas sem atrasar demais uma publicação nova.
const DEFAULT_REVALIDATE = 300;

type ListResponse<T> = { items: T[]; nextCursor: string | null };

async function request<T>(path: string, revalidate: number): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });

  if (!res.ok) {
    throw new ApiError(res.status, `Falha ao buscar ${path} (${res.status})`);
  }

  return res.json() as Promise<T>;
}

/** Endpoints paginados por cursor (`{ items, nextCursor }`) — sermons, podcasts, posts. */
export async function fetchList<T>(path: string, revalidate = DEFAULT_REVALIDATE): Promise<T[]> {
  const data = await request<ListResponse<T>>(path, revalidate);
  return data.items;
}

/** Como `fetchList`, mas devolve o `nextCursor` também — pra paginação de verdade na tela
 * (24 por página, "carregar mais"/"próxima"), em vez de buscar tudo de uma vez. */
export async function fetchPage<T>(
  path: string,
  revalidate = DEFAULT_REVALIDATE
): Promise<ListResponse<T>> {
  return request<ListResponse<T>>(path, revalidate);
}

/** Endpoints que devolvem array direto, sem paginação — albums, themes. */
export async function fetchArray<T>(path: string, revalidate = DEFAULT_REVALIDATE): Promise<T[]> {
  return request<T[]>(path, revalidate);
}

/** Busca por id/slug — 404 vira `null` em vez de lançar, pra `notFound()` do Next decidir. */
export async function fetchOne<T>(path: string, revalidate = DEFAULT_REVALIDATE): Promise<T | null> {
  try {
    return await request<T>(path, revalidate);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
