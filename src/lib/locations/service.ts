import type { Location } from "./model";
import { locationsCollection } from "./collection";
import { getServerClient } from "@/lib/cappuccino/server";

export async function getLocations(): Promise<Location[]> {
    const { apiClient } = await getServerClient();
    const snap = await locationsCollection(apiClient).find({
        query: { active: true },
    });
    return snap.documents ?? [];
}

export async function getLocationById(
    id: string
): Promise<Location | null> {
    const { apiClient } = await getServerClient();
    const snap = await locationsCollection(apiClient).findOne({
        query: { _id: id, active: true },
    });
    return snap.document ?? null;
}

export async function createLocation(data: Partial<Location>): Promise<Location | null> {
    const { apiClient } = await getServerClient();
    const snap = await locationsCollection(apiClient).insertOne({
        ...data,
        active: true,
    });
    return snap.document ?? null;
}

export async function updateLocation(id: string, data: Partial<Location>): Promise<Location | null> {
    const { apiClient } = await getServerClient();
    const snap = await locationsCollection(apiClient).updateOne(id, data);
    return snap.document ?? null;
}

export async function deleteLocation(id: string): Promise<boolean> {
    const { apiClient } = await getServerClient();
    const snap = await locationsCollection(apiClient).updateOne(id, {
        active: false,
    });
    return !snap.error;
}
