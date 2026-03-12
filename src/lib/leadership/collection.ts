import { Collection, type ApiClient } from "@cappuccino/web-sdk";
import type { LeadershipMember } from "./model";

export const LEADERSHIP_COLLECTION = "leadership";

export function leadershipCollection(apiClient: ApiClient) {
    return new Collection<LeadershipMember>({
        apiClient,
        name: LEADERSHIP_COLLECTION,
    });
}
