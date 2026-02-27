import type { MultilingualText } from "./common";

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

export interface Event {
  _id: string;
  title: MultilingualText;
  description: MultilingualText;
  eventType: EventType;
  startDate: string;
  endDate?: string;
  locationId: string;
  customAddress?: string;
  featuredImage?: string;
  registrationEnabled: boolean;
  capacity?: number;
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
