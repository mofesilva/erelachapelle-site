import type { MediaAsset } from "@/types/media-asset";
import { fetchPage } from "@/lib/api/client";

const PAGE_SIZE = 24;

// `/media-assets` já pagina por cursor e filtra no servidor (`fileType`, `documentType`) —
// diferente de sermons/podcasts, não precisa buscar tudo e paginar em memória aqui.
export async function getFilesPage(
  opts: { cursor?: string; documentType?: string } = {}
): Promise<{ files: MediaAsset[]; nextCursor: string | null }> {
  const params = new URLSearchParams({ fileType: "pdf", limit: String(PAGE_SIZE) });
  if (opts.cursor) params.set("cursor", opts.cursor);
  if (opts.documentType) params.set("documentType", opts.documentType);

  const { items, nextCursor } = await fetchPage<MediaAsset>(`/media-assets?${params}`);
  return { files: items, nextCursor };
}
