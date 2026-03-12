import Link from "next/link";
import { Badge } from "@/_components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { formatDate, getLocalizedContent } from "@/lib/utils";
import type { Locale } from "@/types/common";
import type { Event } from "@/lib/events";
import { CalendarBold } from "solar-icon-set";

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
          <CalendarBold size={16} color="var(--primary)" />
          <p className="text-muted-foreground">
            {formatDate(event.startDate, locale)}
          </p>
        </div>
        <CardTitle className="font-serif">
          <Link
            href={`/${locale}/events/${event.slug}`}
            className="hover:text-primary"
          >
            {getLocalizedContent(event.title, locale)}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-muted-foreground">
          {getLocalizedContent(event.description, locale)}
        </p>
        <Badge variant="secondary" className="mt-3">
          {typeLabel}
        </Badge>
      </CardContent>
    </Card>
  );
}
