import { toPodcastEmbedUrl } from "@/lib/integrations/podcast-embed";

interface PodcastEmbedProps {
  url: string;
  title: string;
}

/** Player compacto do Spotify — único formato usado no podcast (sem vídeo do YouTube aqui). */
export function PodcastEmbed({ url, title }: PodcastEmbedProps) {
  return (
    <iframe
      src={toPodcastEmbedUrl(url)}
      title={title}
      style={{ borderRadius: 12 }}
      width="100%"
      height={152}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
