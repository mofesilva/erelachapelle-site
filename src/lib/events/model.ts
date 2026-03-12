import type { MultilingualText } from "@/types/common";
import { z } from "zod";

export const EVENT_TYPES = [
    "service",
    "conference",
    "community",
    "youth",
    "outreach",
    "prayer",
    "other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface Event {
    _id: string;
    title: MultilingualText;
    description: MultilingualText;
    eventType: EventType;
    startDate: string;
    endDate?: string;
    locationId: string;
    customAddress?: string;
    featuredImage?: string;
    registrationEnabled: boolean;
    capacity?: number;
    slug: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export const eventRegistrationSchema = z.object({
    eventId: z.string().min(1),
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().optional(),
    attendees: z.number().int().min(1).max(20),
    honeypot: z.string().max(0).optional(),
});

export type RegistrationResult = {
    success: boolean;
    message: string;
};
