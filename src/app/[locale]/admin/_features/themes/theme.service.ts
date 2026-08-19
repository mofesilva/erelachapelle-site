import { apiFetch } from "../../_lib/http-client";
import type { Theme } from "./theme.type";

/** Público na API, sem paginação — `GET /themes` devolve todos, ordenados por nome. */
export function listThemes() {
  return apiFetch<Theme[]>("/themes");
}

/**
 * Criação inline (estilo Notion) a partir do combobox de temas: manda só o nome em
 * francês, o servidor gera o slug. Exige role editor/admin.
 */
export function createTheme(name: string, token: string) {
  return apiFetch<Theme>("/themes", {
    method: "POST",
    token,
    body: { name: { fr: name } },
  });
}
