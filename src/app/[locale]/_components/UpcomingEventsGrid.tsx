"use client";

import { useEffect, useState } from "react";
import { EventCard } from "@/_components/EventCard";
import { CalendarBoldDuotone } from "solar-icon-set";

export interface UpcomingEventItem {
  id: string;
  startDate: string;
  type: "culte" | "conference" | "jeunesse" | "autre";
  title: string;
  location: string;
  description?: string;
  href: string;
  typeLabel: string;
}

interface UpcomingEventsGridProps {
  events: UpcomingEventItem[];
  locale: string;
  limit?: number;
  emptyLabel: string;
}

export function UpcomingEventsGrid({
  events,
  locale,
  limit = 3,
  emptyLabel,
}: UpcomingEventsGridProps) {
  const [upcoming, setUpcoming] = useState<UpcomingEventItem[] | null>(null);

  useEffect(() => {
    const now = new Date();
    const filtered = events
      .filter((event) => new Date(event.startDate).getTime() >= now.getTime())
      .sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, limit);
    setUpcoming(filtered);
  }, [events, limit]);

  if (upcoming === null) {
    return (
      <div
        className="mt-12 md:mt-14 grid gap-8 md:grid-cols-3"
        aria-hidden="true"
      >
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="h-64 animate-pulse bg-rich-mahogany/5" />
        ))}
      </div>
    );
  }

  if (upcoming.length === 0) {
    return (
      <div className="mt-14 flex flex-col items-center gap-4 text-rich-mahogany/30">
        <CalendarBoldDuotone size={48} />
        <p className="font-light">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="mt-12 md:mt-14 space-y-8 md:space-y-0 md:grid md:gap-8 md:grid-cols-3">
      {upcoming.map((event) => (
        <EventCard
          key={event.id}
          date={new Date(event.startDate)}
          type={event.type}
          title={event.title}
          location={event.location}
          description={event.description}
          href={event.href}
          locale={locale}
          typeLabel={event.typeLabel}
        />
      ))}
    </div>
  );
}
