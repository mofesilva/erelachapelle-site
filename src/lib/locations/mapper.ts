import type { Location } from "./model";
import { mapKeysSnakeToCamel, mapKeysCamelToSnake } from "@/lib/utils/case-conversion";

export function mapLocation(raw: Record<string, unknown>): Location {
  return mapKeysSnakeToCamel<Location>(raw);
}

export function mapLocations(raw: Record<string, unknown>[]): Location[] {
  return raw.map(mapLocation);
}

export function mapLocationToDb(location: Partial<Location>): Record<string, unknown> {
  return mapKeysCamelToSnake(location) as Record<string, unknown>;
}
