import type { MultilingualText } from "@/types/common";
import { z } from "zod";

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

export const groupInterestSchema = z.object({
    groupId: z.string().min(1),
    name: z.string().min(2).max(100),
    email: z.string().email(),
    message: z.string().max(500).optional(),
    honeypot: z.string().max(0).optional(),
});

export type GroupInterestResult = {
    success: boolean;
    message: string;
};
