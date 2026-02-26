"use client";

import { getYouTubeEmbedUrl } from "@/lib/integrations/youtube";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  return (
    <div className="aspect-video overflow-hidden rounded-lg">
      <iframe
        src={getYouTubeEmbedUrl(videoId)}
        title={title}
        className="h-full w-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
