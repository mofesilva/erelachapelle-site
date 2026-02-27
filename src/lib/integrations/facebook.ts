import type { FacebookPhoto } from "@/types/common";

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID ?? "erelachapelle";
const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

/** App Access Token — no user/page owner involvement needed */
function getAppToken(): string {
    return `${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;
}

interface GraphImage {
    source: string;
    width: number;
    height: number;
}

interface GraphPhoto {
    id: string;
    images: GraphImage[];
    name?: string;
    created_time: string;
}

interface GraphResponse {
    data: GraphPhoto[];
    paging?: {
        cursors: { after: string };
        next?: string;
    };
}

function pickBestImage(images: GraphImage[]): GraphImage {
    // Pick the largest image that's not absurdly huge (prefer ~1080px range)
    const sorted = [...images].sort((a, b) => b.width - a.width);
    return sorted.find((img) => img.width <= 1200) ?? sorted[0];
}

function toFacebookPhoto(photo: GraphPhoto): FacebookPhoto {
    const best = pickBestImage(photo.images);
    return {
        id: photo.id,
        imageUrl: best.source,
        alt: photo.name ?? "",
        createdAt: photo.created_time,
        width: best.width,
        height: best.height,
    };
}

/**
 * Fetches ALL uploaded photos from the Facebook page.
 * Follows pagination automatically. Cached via Next.js ISR (revalidate = 7 days).
 * Returns empty array on any error (graceful fallback).
 */
export async function getAllPagePhotos(): Promise<FacebookPhoto[]> {
    if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
        console.warn("[Facebook] Missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET env vars");
        return [];
    }

    const photos: FacebookPhoto[] = [];
    const token = getAppToken();
    let url: string | null =
        `${GRAPH_API_BASE}/${FACEBOOK_PAGE_ID}/photos?type=uploaded&fields=images,name,created_time&limit=100&access_token=${token}`;

    try {
        while (url) {
            const res = await fetch(url, {
                next: { revalidate: 604800 }, // 7 days
            });

            if (!res.ok) {
                console.error("[Facebook] Graph API error:", res.status, await res.text());
                return photos; // return what we have so far
            }

            const json: GraphResponse = await res.json();

            for (const photo of json.data) {
                if (photo.images?.length) {
                    photos.push(toFacebookPhoto(photo));
                }
            }

            url = json.paging?.next ?? null;
        }

        return photos;
    } catch (error) {
        console.error("[Facebook] Failed to fetch photos:", error);
        return [];
    }
}
