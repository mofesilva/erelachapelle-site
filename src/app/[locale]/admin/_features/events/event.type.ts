import type { LocalizedText, UserRef } from "../../_lib/localized-text";

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

export type EventLocation = {
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
};

export const RECURRENCE_FREQUENCIES = ["daily", "weekly", "monthly", "yearly", "custom"] as const;
export type RecurrenceFrequency = (typeof RECURRENCE_FREQUENCIES)[number];

export type RecurrenceEnd =
  | { type: "never" }
  | { type: "until"; until: string }
  | { type: "count"; count: number };

/** Extended Reference Pattern (mesmo formato de `AlbumImage`): `id` do MediaAsset + cópia de
 *  `url`/`altText` no momento da escolha, pra não precisar de join pra exibir o banner. */
export type EventFeaturedImage = {
  id: string;
  url: string;
  altText?: LocalizedText;
};

/** `weekdays` (0=domingo..6=sábado) só existe quando `frequency === "custom"`. */
export type EventRecurrence = {
  frequency: RecurrenceFrequency;
  weekdays?: number[];
  end: RecurrenceEnd;
};

/** O documento como `GET /events` devolve (datas chegam como string ISO no JSON). */
export type Event = {
  _id: string;
  title: LocalizedText;
  description: LocalizedText;
  eventType: EventType;
  startDate: string;
  endDate?: string;
  location: EventLocation;
  customAddress?: string;
  featuredImage?: EventFeaturedImage;
  capacity?: number;
  slug: string;
  active?: boolean;
  recurrence?: EventRecurrence | null;
  /**
   * Só presentes numa ocorrência virtual de uma série recorrente (ver expansão no backend,
   * `GET /events?from&to`): a data real do documento-mãe. O formulário de edição precisa
   * usar essas, não `startDate`/`endDate`, senão editar uma ocorrência do meio da série
   * reescreveria a data de início da série toda pra data daquela ocorrência.
   */
  seriesStartDate?: string;
  seriesEndDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: UserRef;
  updatedBy: UserRef;
};
