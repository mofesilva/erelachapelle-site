import type { MultilingualText } from "@/types/common";
import type { Sermon } from "@/types/sermon";
import { fetchList } from "@/lib/api/client";

// Volume baixo (poucos sermões por mês, ver docs/contexto-e-referencia.md) — uma busca
// de até 100 cobre a base inteira numa requisição só; a paginação de 24 por página é
// feita aqui, em memória, sobre esse resultado. Simples e suficiente pro volume real.
const FETCH_SIZE = 100;
const PAGE_SIZE = 24;

// A API guarda `series` como MultilingualText (indexado por `series.fr`, ver
// docs/decisoes-arquitetura.md §5), mas as telas do site tratam série como um rótulo
// simples. Achata aqui, no ponto de leitura, pra nenhum componente precisar saber disso.
type ApiSermon = Omit<Sermon, "series"> & { series?: MultilingualText };

function normalize(sermon: ApiSermon): Sermon {
  return { ...sermon, series: sermon.series?.fr };
}

export async function getAllSermons(): Promise<Sermon[]> {
  const sermons = await fetchList<ApiSermon>(`/sermons?limit=${FETCH_SIZE}`);
  return sermons.map(normalize);
}

export async function getSermonsPage(
  page = 1
): Promise<{ sermons: Sermon[]; totalPages: number }> {
  const all = await getAllSermons();
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  return { sermons: all.slice(start, start + PAGE_SIZE), totalPages };
}

export async function getRecentSermons(limit = 3): Promise<Sermon[]> {
  const sermons = await fetchList<ApiSermon>(`/sermons?limit=${limit}`);
  return sermons.map(normalize);
}

export async function getSermonBySlug(slug: string): Promise<Sermon | null> {
  const sermons = await getAllSermons();
  return sermons.find((s) => s.slug === slug) ?? null;
}

export async function getSermonSeries(): Promise<string[]> {
  const sermons = await getAllSermons();
  return Array.from(new Set(sermons.flatMap((s) => (s.series ? [s.series] : [])))).sort();
}

export async function filterSermons(filters: { series?: string }): Promise<Sermon[]> {
  const sermons = await getAllSermons();
  return sermons.filter((s) => !filters.series || s.series === filters.series);
}
