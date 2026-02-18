import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import type { Event } from "@/types/event";
import { Calendar } from "lucide-react";

interface EventCardProps {
  event: Event;
  locale: Locale;
  typeLabel: string;
}

export function EventCard({ event, locale, typeLabel }: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            {formatDate(event.startDate, locale)}
          </span>
        </div>
        <CardTitle className="font-serif text-lg">
          <Link
            href={`/${locale}/events/${event.slug}`}
            className="hover:text-primary"
          >
            {getLocalizedContent(event.title, locale)}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {getLocalizedContent(event.description, locale)}
        </p>
        <Badge variant="secondary" className="mt-3">
          {typeLabel}
        </Badge>
      </CardContent>
    </Card>
  );
}
