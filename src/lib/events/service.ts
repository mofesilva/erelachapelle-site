import type { Event } from "./model";
import { eventsCollection } from "./collection";
import { getServerClient } from "@/lib/cappuccino/server";

export async function getEvents(): Promise<Event[]> {
    const { apiClient } = await getServerClient();
    const snap = await eventsCollection(apiClient).find({
        query: { active: true },
        sort: { startDate: -1 },
    });
    return snap.documents ?? [];
}

export async function getRecentEvents(limit = 3): Promise<Event[]> {
    const { apiClient } = await getServerClient();
    const snap = await eventsCollection(apiClient).find({
        query: { active: true },
        sort: { startDate: -1 },
        limit,
    });
    return snap.documents ?? [];
}

export async function getAllEvents(): Promise<Event[]> {
    return getEvents();
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
    const { apiClient } = await getServerClient();
    const snap = await eventsCollection(apiClient).findOne({
        query: { slug, active: true },
    });
    return snap.document ?? null;
}

export async function getEventById(id: string): Promise<Event | null> {
    const { apiClient } = await getServerClient();
    const snap = await eventsCollection(apiClient).findById(id);
    return snap.document ?? null;
}

export async function filterEvents(filters: {
    eventType?: string;
    locationId?: string;
}): Promise<Event[]> {
    const query: Record<string, unknown> = { active: true };
    if (filters.eventType) query.eventType = filters.eventType;
    if (filters.locationId) query.locationId = filters.locationId;

    const { apiClient } = await getServerClient();
    const snap = await eventsCollection(apiClient).find({
        query,
        sort: { startDate: -1 },
    });
    return snap.documents ?? [];
}

export async function getEventTypes(): Promise<string[]> {
    const events = await getEvents();
    const types = new Set(events.map((e) => e.eventType));
    return Array.from(types).sort();
}

export async function createEvent(data: Partial<Event>): Promise<Event | null> {
    const { apiClient } = await getServerClient();
    const now = new Date().toISOString();
    const snap = await eventsCollection(apiClient).insertOne({
        ...data,
        active: true,
        createdAt: now,
        updatedAt: now,
    });
    return snap.document ?? null;
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<Event | null> {
    const { apiClient } = await getServerClient();
    const snap = await eventsCollection(apiClient).updateOne(id, {
        ...data,
        updatedAt: new Date().toISOString(),
    });
    return snap.document ?? null;
}

export async function deleteEvent(id: string): Promise<boolean> {
    const { apiClient } = await getServerClient();
    const snap = await eventsCollection(apiClient).updateOne(id, {
        active: false,
        updatedAt: new Date().toISOString(),
    });
    return !snap.error;
}
