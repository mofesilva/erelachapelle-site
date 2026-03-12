import { Collection, type ApiClient } from "@cappuccino/web-sdk";
import type { Sermon } from "./model";

export const SERMONS_COLLECTION = "sermons";

export function sermonsCollection(apiClient: ApiClient) {
    return new Collection<Sermon>({ apiClient, name: SERMONS_COLLECTION });
}
