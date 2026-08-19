import { slugify } from "@/lib/utils";
import { apiFetch } from "../../_lib/http-client";
import type { CategoryFormValues } from "./category.schema";
import type { Category } from "./category.type";

export type CategoryPage = {
  items: Category[];
  /** _id do último item da página — manda de volta como `cursor` pra pegar a próxima. `null` = não tem mais. */
  nextCursor: string | null;
};

type ListParams = {
  cursor?: string;
  limit?: number;
};

/**
 * Público na API. Paginação por keyset (cursor = _id), não por página numerada — sem
 * `?cursor`, devolve a primeira página, ordenada do mais recente pro mais antigo.
 */
export function listCategories({ cursor, limit }: ListParams = {}) {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  if (limit) query.set("limit", String(limit));
  const qs = query.toString();
  return apiFetch<CategoryPage>(`/categories${qs ? `?${qs}` : ""}`);
}

/** Exige role editor/admin. `createdBy`/`updatedBy` são preenchidos pelo servidor a partir do JWT. */
export function createCategory(values: CategoryFormValues, token: string) {
  return apiFetch<Category>("/categories", {
    method: "POST",
    token,
    body: {
      name: { fr: values.name.fr },
      slug: slugify(values.name.fr),
    },
  });
}

/** PUT aceita corpo parcial — só mandamos o que a tela edita, o resto fica intacto. */
export function updateCategory(id: string, values: CategoryFormValues, token: string) {
  return apiFetch<Category>(`/categories/${id}`, {
    method: "PUT",
    token,
    body: {
      name: { fr: values.name.fr },
      slug: slugify(values.name.fr),
    },
  });
}

/** Hard delete: a API remove o documento de vez, sem lixeira nem restore. */
export function deleteCategory(id: string, token: string) {
  return apiFetch<void>(`/categories/${id}`, { method: "DELETE", token });
}
