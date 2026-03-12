import type { Sermon } from "./model";
import { mapKeysSnakeToCamel, mapKeysCamelToSnake } from "@/lib/utils/case-conversion";

export function mapSermon(raw: Record<string, unknown>): Sermon {
  return mapKeysSnakeToCamel<Sermon>(raw);
}

export function mapSermons(raw: Record<string, unknown>[]): Sermon[] {
  return raw.map(mapSermon);
}

export function mapSermonToDb(sermon: Partial<Sermon>): Record<string, unknown> {
  return mapKeysCamelToSnake(sermon) as Record<string, unknown>;
}
