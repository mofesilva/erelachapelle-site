import { Collection, type ApiClient } from "@cappuccino/web-sdk";
import type { CommunityGroup } from "./model";

export const GROUPS_COLLECTION = "groups";

export function groupsCollection(apiClient: ApiClient) {
    return new Collection<CommunityGroup>({
        apiClient,
        name: GROUPS_COLLECTION,
    });
}
