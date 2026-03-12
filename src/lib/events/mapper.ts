import type { Event } from "./model";
import { mapKeysSnakeToCamel, mapKeysCamelToSnake } from "@/lib/utils/case-conversion";

export function mapEvent(raw: Record<string, unknown>): Event {
  return mapKeysSnakeToCamel<Event>(raw);
}

export function mapEvents(raw: Record<string, unknown>[]): Event[] {
  return raw.map(mapEvent);
}

export function mapEventToDb(event: Partial<Event>): Record<string, unknown> {
  return mapKeysCamelToSnake(event) as Record<string, unknown>;
}
