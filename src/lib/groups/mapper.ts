import type { CommunityGroup } from "./model";
import { mapKeysSnakeToCamel, mapKeysCamelToSnake } from "@/lib/utils/case-conversion";

export function mapGroup(raw: Record<string, unknown>): CommunityGroup {
  return mapKeysSnakeToCamel<CommunityGroup>(raw);
}

export function mapGroups(raw: Record<string, unknown>[]): CommunityGroup[] {
  return raw.map(mapGroup);
}

export function mapGroupToDb(group: Partial<CommunityGroup>): Record<string, unknown> {
  return mapKeysCamelToSnake(group) as Record<string, unknown>;
}
