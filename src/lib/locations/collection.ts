import { Collection, type ApiClient } from "@cappuccino/web-sdk";
import type { Location } from "./model";

export const LOCATIONS_COLLECTION = "locations";

export function locationsCollection(apiClient: ApiClient) {
    return new Collection<Location>({ apiClient, name: LOCATIONS_COLLECTION });
}
