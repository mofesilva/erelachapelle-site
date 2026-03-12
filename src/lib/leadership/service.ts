import type { LeadershipMember } from "./model";
import { leadershipCollection } from "./collection";
import { getServerClient } from "@/lib/cappuccino/server";

export async function getLeadershipTeam(): Promise<LeadershipMember[]> {
    const { apiClient } = await getServerClient();
    const snap = await leadershipCollection(apiClient).find({
        query: { active: true },
        sort: { order: 1 },
    });
    return snap.documents ?? [];
}

export async function createLeader(data: Partial<LeadershipMember>): Promise<LeadershipMember | null> {
    const { apiClient } = await getServerClient();
    const snap = await leadershipCollection(apiClient).insertOne({
        ...data,
        active: true,
    });
    return snap.document ?? null;
}

export async function updateLeader(id: string, data: Partial<LeadershipMember>): Promise<LeadershipMember | null> {
    const { apiClient } = await getServerClient();
    const snap = await leadershipCollection(apiClient).updateOne(id, data);
    return snap.document ?? null;
}

export async function deleteLeader(id: string): Promise<boolean> {
    const { apiClient } = await getServerClient();
    const snap = await leadershipCollection(apiClient).updateOne(id, {
        active: false,
    });
    return !snap.error;
}
