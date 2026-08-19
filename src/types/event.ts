import type { Coordinates, MultilingualText } from "./common";

export const EVENT_TYPES = [
  "service",
  "conference",
  "community",
  "youth",
  "outreach",
  "prayer",
  "other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface EventLocation {
  name: string;
  address: string;
  coordinates: Coordinates;
}

/** Formato devolvido por `GET /events` da API (ver erelachapelle-api/src/schemas/event.ts). */
export interface Event {
  _id: string;
  title: MultilingualText;
  description: MultilingualText;
  eventType: EventType;
  startDate: string;
  endDate?: string;
  location: EventLocation;
  customAddress?: string;
  featuredImage?: { id: string; url: string; altText?: MultilingualText };
  capacity?: number;
  slug: string;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}
