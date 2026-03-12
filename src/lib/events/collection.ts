import { Collection, type ApiClient } from "@cappuccino/web-sdk";
import type { Event } from "./model";

export const EVENTS_COLLECTION = "events";

export function eventsCollection(apiClient: ApiClient) {
    return new Collection<Event>({ apiClient, name: EVENTS_COLLECTION });
}
