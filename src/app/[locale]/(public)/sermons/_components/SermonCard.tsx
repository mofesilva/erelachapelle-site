import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import { getYouTubeThumbnailUrl } from "@/lib/integrations/youtube";
import type { Locale } from "@/types/common";
import type { Sermon } from "@/types/sermon";

interface SermonCardProps {
  sermon: Sermon;
  locale: Locale;
}

export function SermonCard({ sermon, locale }: SermonCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted">
        <Image
          src={getYouTubeThumbnailUrl(sermon.youtubeVideoId)}
          alt={getLocalizedContent(sermon.title, locale)}
          width={480}
          height={270}
          className="h-full w-full object-cover"
          loading="lazy"
          unoptimized
        />
      </div>
      <CardHeader>
        <span className="text-xs text-muted-foreground">
          {formatDate(sermon.date, locale)} · {sermon.preacher}
        </span>
        <CardTitle className="font-serif text-lg">
          <Link
            href={`/${locale}/sermons/${sermon.slug}`}
            className="hover:text-primary"
          >
            {getLocalizedContent(sermon.title, locale)}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sermon.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {getLocalizedContent(sermon.description, locale)}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {sermon.series && (
            <Badge variant="secondary">{sermon.series}</Badge>
          )}
          {sermon.biblicalReference && (
            <Badge variant="outline">
              {sermon.biblicalReference.book} {sermon.biblicalReference.chapter}
              {sermon.biblicalReference.verses &&
                `:${sermon.biblicalReference.verses}`}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
