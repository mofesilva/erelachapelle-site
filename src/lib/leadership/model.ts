import type { MultilingualText } from "@/types/common";

export interface LeadershipMember {
    _id: string;
    fullName: string;
    role: MultilingualText;
    bio: MultilingualText;
    photoUrl?: string;
    email?: string;
    ministryAreas: string[];
    order: number;
    active: boolean;
}
