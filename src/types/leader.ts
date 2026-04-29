import type { MultilingualText } from "./common";

export interface LeadershipMember {
  _id: string;
  slug: string;
  fullName: string;
  role: MultilingualText;
  bio: MultilingualText;
  fullBio: MultilingualText;
  photoUrl?: string;
  email?: string;
  ministryAreas: string[];
  order: number;
  active: boolean;
}
