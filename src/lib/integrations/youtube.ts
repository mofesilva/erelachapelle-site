// O formulário recebe o link colado pelo usuário; o banco de dados guarda só o ID.
// Essa função extrai o ID tanto pra salvar (form) quanto pra montar miniatura/embed.
export function extractYouTubeVideoId(youtubeUrlOrId: string): string {
  const trimmed = youtubeUrlOrId.trim();
  const idMatch = trimmed.match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return idMatch ? idMatch[1] : trimmed;
}

/** Reconstrói um link normal a partir do ID salvo — usado pra reexibir no formulário de edição. */
export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * `hqdefault` é 480×360 (4:3): o YouTube preenche o vídeo 16:9 com tarjas pretas em cima e
 * embaixo, que aparecem dentro do card. `mqdefault` (320×180) e `maxresdefault` (1280×720)
 * são 16:9 puros — daí o padrão ser `mqdefault`. Use `maxresdefault` em imagem grande
 * (destaque, página de detalhe), onde 320px de largura ficaria suave demais.
 */
export function getYouTubeThumbnailUrl(
  youtubeUrlOrId: string,
  quality: "default" | "mqdefault" | "hqdefault" | "maxresdefault" = "mqdefault",
): string {
  return `https://img.youtube.com/vi/${extractYouTubeVideoId(youtubeUrlOrId)}/${quality}.jpg`;
}

export function getYouTubeEmbedUrl(youtubeUrlOrId: string): string {
  return `https://www.youtube-nocookie.com/embed/${extractYouTubeVideoId(youtubeUrlOrId)}`;
}
