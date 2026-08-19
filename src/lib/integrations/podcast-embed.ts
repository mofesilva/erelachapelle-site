import { extractYouTubeVideoId, getYouTubeEmbedUrl } from "./youtube";

// Share link do Spotify: open.spotify.com/episode/<id> (às vezes com /intl-xx/). O player
// embutido só funciona no formato /embed/episode/<id> — sem isso o iframe carrega a página
// cheia do Spotify em vez do player compacto.
const SPOTIFY_SHARE_RE = /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(episode|show)\/([a-zA-Z0-9]+)/;

/**
 * Converte o link que o admin colou (share link do Spotify, YouTube, etc.) na URL de iframe
 * correspondente, pra tocar o episódio embutido no site em vez de mandar o visitante pra
 * fora. Plataformas não reconhecidas (SoundCloud, Anchor...) já fornecem links de embed
 * prontos — usa a URL como veio.
 */
export function toPodcastEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  if (trimmed.includes("open.spotify.com")) {
    if (trimmed.includes("/embed/")) return trimmed;
    const match = trimmed.match(SPOTIFY_SHARE_RE);
    if (match) return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
  }

  if (trimmed.includes("youtube.com") || trimmed.includes("youtu.be")) {
    const id = extractYouTubeVideoId(trimmed);
    if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return getYouTubeEmbedUrl(id);
  }

  return trimmed;
}
