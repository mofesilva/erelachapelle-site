import type { Sermon } from "./model";
import { sermonsCollection } from "./collection";
import { getServerClient } from "@/lib/cappuccino/server";

export async function getSermons(): Promise<Sermon[]> {
    const { apiClient } = await getServerClient();
    const snap = await sermonsCollection(apiClient).find({
        query: { active: true },
        sort: { date: -1 },
    });
    return snap.documents ?? [];
}

export async function getRecentSermons(limit = 3): Promise<Sermon[]> {
    const { apiClient } = await getServerClient();
    const snap = await sermonsCollection(apiClient).find({
        query: { active: true },
        sort: { date: -1 },
        limit,
    });
    return snap.documents ?? [];
}

export async function getAllSermons(): Promise<Sermon[]> {
    return getSermons();
}

export async function getSermonBySlug(slug: string): Promise<Sermon | null> {
    const { apiClient } = await getServerClient();
    const snap = await sermonsCollection(apiClient).findOne({
        query: { slug, active: true },
    });
    return snap.document ?? null;
}

export async function filterSermons(filters: {
    preacher?: string;
    series?: string;
}): Promise<Sermon[]> {
    const query: Record<string, unknown> = { active: true };
    if (filters.preacher) query.preacher = filters.preacher;
    if (filters.series) query.series = filters.series;

    const { apiClient } = await getServerClient();
    const snap = await sermonsCollection(apiClient).find({
        query,
        sort: { date: -1 },
    });
    return snap.documents ?? [];
}

export async function getSermonPreachers(): Promise<string[]> {
    const sermons = await getSermons();
    const preachers = new Set(sermons.map((s) => s.preacher));
    return Array.from(preachers).sort();
}

export async function getSermonSeries(): Promise<string[]> {
    const sermons = await getSermons();
    const series = new Set(
        sermons.filter((s) => s.series).map((s) => s.series!)
    );
    return Array.from(series).sort();
}

export async function createSermon(data: Partial<Sermon>): Promise<Sermon | null> {
    const { apiClient } = await getServerClient();
    const now = new Date().toISOString();
    const snap = await sermonsCollection(apiClient).insertOne({
        ...data,
        active: true,
        createdAt: now,
        updatedAt: now,
    });
    return snap.document ?? null;
}

export async function updateSermon(id: string, data: Partial<Sermon>): Promise<Sermon | null> {
    const { apiClient } = await getServerClient();
    const snap = await sermonsCollection(apiClient).updateOne(id, {
        ...data,
        updatedAt: new Date().toISOString(),
    });
    return snap.document ?? null;
}

export async function deleteSermon(id: string): Promise<boolean> {
    const { apiClient } = await getServerClient();
    const snap = await sermonsCollection(apiClient).updateOne(id, {
        active: false,
        updatedAt: new Date().toISOString(),
    });
    return !snap.error;
}
