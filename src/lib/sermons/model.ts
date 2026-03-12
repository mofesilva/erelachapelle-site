import type { BibleRef, MultilingualText } from "@/types/common";

export interface Sermon {
    _id: string;
    title: MultilingualText;
    description?: MultilingualText;
    preacher: string;
    date: string;
    biblicalReference?: BibleRef;
    series?: string;
    seriesOrder?: number;
    youtubeVideoId: string;
    pdfNotesUrl?: string;
    tags: string[];
    duration?: number;
    slug: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}
