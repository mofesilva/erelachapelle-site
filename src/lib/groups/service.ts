import type { CommunityGroup } from "./model";
import { groupsCollection } from "./collection";
import { getServerClient } from "@/lib/cappuccino/server";

export async function getGroups(): Promise<CommunityGroup[]> {
    const { apiClient } = await getServerClient();
    const snap = await groupsCollection(apiClient).find({
        query: { active: true },
    });
    return snap.documents ?? [];
}

export async function getGroupById(
    id: string
): Promise<CommunityGroup | null> {
    const { apiClient } = await getServerClient();
    const snap = await groupsCollection(apiClient).findById(id);
    return snap.document ?? null;
}

export async function createGroup(data: Partial<CommunityGroup>): Promise<CommunityGroup | null> {
    const { apiClient } = await getServerClient();
    const now = new Date().toISOString();
    const snap = await groupsCollection(apiClient).insertOne({
        ...data,
        active: true,
        createdAt: now,
        updatedAt: now,
    });
    return snap.document ?? null;
}

export async function updateGroup(id: string, data: Partial<CommunityGroup>): Promise<CommunityGroup | null> {
    const { apiClient } = await getServerClient();
    const snap = await groupsCollection(apiClient).updateOne(id, {
        ...data,
        updatedAt: new Date().toISOString(),
    });
    return snap.document ?? null;
}

export async function deleteGroup(id: string): Promise<boolean> {
    const { apiClient } = await getServerClient();
    const snap = await groupsCollection(apiClient).updateOne(id, {
        active: false,
        updatedAt: new Date().toISOString(),
    });
    return !snap.error;
}
