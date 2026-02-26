import type { Event } from "@/types/event";

export const EVENTS: Event[] = [
  {
    _id: "event-1",
    title: {
      fr: "Culte de louange spécial",
      pt: "Culto de louvor especial",
      en: "Special Worship Service",
    },
    description: {
      fr: "Un temps de louange et d'adoration exceptionnel avec des musiciens invités de toute la région.",
      pt: "Um tempo de louvor e adoração excepcional com músicos convidados de toda a região.",
      en: "An exceptional time of praise and worship with guest musicians from across the region.",
    },
    slug: "culte-louange-special",
    startDate: "2026-03-15T10:30:00",
    endDate: "2026-03-15T12:30:00",
    eventType: "service",
    locationId: "loc-saint-hippolyte",
    registrationEnabled: false,
    active: true,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01",
  },
  {
    _id: "event-2",
    title: {
      fr: "Conférence sur la famille",
      pt: "Conferência sobre a família",
      en: "Family Conference",
    },
    description: {
      fr: "Une journée consacrée au renforcement des liens familiaux à la lumière de la Parole de Dieu.",
      pt: "Um dia dedicado ao fortalecimento dos laços familiares à luz da Palavra de Deus.",
      en: "A day dedicated to strengthening family bonds in the light of God's Word.",
    },
    slug: "conference-famille",
    startDate: "2026-03-22T09:00:00",
    endDate: "2026-03-22T17:00:00",
    eventType: "conference",
    locationId: "loc-saint-hippolyte",
    registrationEnabled: true,
    active: true,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01",
  },
  {
    _id: "event-3",
    title: {
      fr: "Soirée jeunesse",
      pt: "Noite da juventude",
      en: "Youth Night",
    },
    description: {
      fr: "Soirée conviviale pour les jeunes de 15 à 25 ans avec jeux, louange et enseignement.",
      pt: "Noite de convívio para jovens de 15 a 25 anos com jogos, louvor e ensino.",
      en: "A fun evening for youth ages 15-25 with games, worship and teaching.",
    },
    slug: "soiree-jeunesse",
    startDate: "2026-03-28T19:00:00",
    endDate: "2026-03-28T22:00:00",
    eventType: "youth",
    locationId: "loc-saint-hippolyte",
    registrationEnabled: false,
    active: true,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01",
  },
  {
    _id: "event-4",
    title: {
      fr: "Pique-nique communautaire",
      pt: "Piquenique comunitário",
      en: "Community Picnic",
    },
    description: {
      fr: "Venez partager un repas en plein air avec toute la communauté. Chacun apporte un plat à partager !",
      pt: "Venha compartilhar uma refeição ao ar livre com toda a comunidade. Cada um traz um prato para compartilhar!",
      en: "Come share an outdoor meal with the whole community. Everyone brings a dish to share!",
    },
    slug: "pique-nique-communautaire",
    startDate: "2026-04-05T12:00:00",
    endDate: "2026-04-05T16:00:00",
    eventType: "community",
    locationId: "loc-saint-hippolyte",
    registrationEnabled: false,
    active: true,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01",
  },
];

export function getRecentEvents(limit = 3): Event[] {
  return EVENTS.filter((e) => e.active)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .slice(0, limit);
}

export function getAllEvents(): Event[] {
  return EVENTS.filter((e) => e.active).sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

export function getEventBySlug(slug: string): Event | null {
  return EVENTS.find((e) => e.slug === slug && e.active) ?? null;
}

export function getEventTypes(): string[] {
  const types = new Set(EVENTS.filter((e) => e.active).map((e) => e.eventType));
  return Array.from(types).sort();
}

export function filterEvents(filters: {
  eventType?: string;
  locationId?: string;
}): Event[] {
  return EVENTS.filter((e) => {
    if (!e.active) return false;
    if (filters.eventType && e.eventType !== filters.eventType) return false;
    if (filters.locationId && e.locationId !== filters.locationId) return false;
    return true;
  }).sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}
