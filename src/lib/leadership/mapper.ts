import type { LeadershipMember } from "./model";
import { mapKeysSnakeToCamel, mapKeysCamelToSnake } from "@/lib/utils/case-conversion";

export function mapLeader(raw: Record<string, unknown>): LeadershipMember {
  return mapKeysSnakeToCamel<LeadershipMember>(raw);
}

export function mapLeaders(
  raw: Record<string, unknown>[]
): LeadershipMember[] {
  return raw.map(mapLeader);
}

export function mapLeaderToDb(leader: Partial<LeadershipMember>): Record<string, unknown> {
  return mapKeysCamelToSnake(leader) as Record<string, unknown>;
}
