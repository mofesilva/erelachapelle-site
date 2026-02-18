import type { MultilingualText } from "./common";

export const GROUP_TYPES = [
  "bible_study",
  "prayer",
  "youth",
  "women",
  "men",
  "seniors",
  "worship",
  "outreach",
  "other",
] as const;

export type GroupType = (typeof GROUP_TYPES)[number];

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export interface CommunityGroup {
  _id: string;
  name: MultilingualText;
  description: MultilingualText;
  groupType: GroupType;
  leaderName: string;
  leaderContact?: string;
  meetingDay: DayOfWeek;
  meetingTime: string;
  locationId?: string;
  customAddress?: string;
  maxCapacity?: number;
  featuredImage?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GroupInterest {
  _id: string;
  groupId: string;
  name: string;
  email: string;
  message?: string;
  createdAt: string;
}
