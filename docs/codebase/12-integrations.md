# 12 — Integrations

## Google Maps

**File:** `src/lib/integrations/maps.ts`

Two URL builder functions for Google Maps:

### `getGoogleMapsEmbedUrl(query: string): string`

Builds a Google Maps Embed API URL for iframe embedding.

```
https://www.google.com/maps/embed/v1/place?key={API_KEY}&q={encoded_query}
```

Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable.

### `getDirectionsUrl(lat: number, lng: number): string`

Builds a Google Maps directions URL (no API key needed):

```
https://www.google.com/maps/dir/?api=1&destination={lat},{lng}
```

Used in `GatheringSection` and `GoogleMapEmbed` component.

---

## YouTube

**File:** `src/lib/integrations/youtube.ts`

### `getYouTubeThumbnailUrl(videoId: string, quality?): string`

Returns a YouTube thumbnail image URL.

| Quality | URL Pattern |
|---------|-------------|
| `"default"` | `https://img.youtube.com/vi/{id}/default.jpg` |
| `"hqdefault"` | `https://img.youtube.com/vi/{id}/hqdefault.jpg` (default) |
| `"maxresdefault"` | `https://img.youtube.com/vi/{id}/maxresdefault.jpg` |

### `getYouTubeEmbedUrl(videoId: string): string`

Returns a privacy-enhanced YouTube embed URL:

```
https://www.youtube-nocookie.com/embed/{videoId}
```

Uses `youtube-nocookie.com` to avoid tracking cookies on the church website.

Used in `YouTubeEmbed` component and `SermonCard`.

---

## Cappuccino SDK

**Package:** `@cappuccino/web-sdk` (installed from `github:mofesilva/cappuccino-js-sdk`)

**Status:** Installed as a dependency but **not yet integrated** in Phase 1.

**Purpose:** Cloud backend-as-a-service for the church website. Will replace the static data layer in Phase 2.

**Environment variables (Phase 2):**
- `NEXT_PUBLIC_CAPPUCCINO_API_URL` — API base URL
- `NEXT_PUBLIC_CAPPUCCINO_API_KEY` — Tenant API key

**Planned usage:** Server actions will call the Cappuccino API to:
- Read content (events, sermons, blog articles, groups, leadership)
- Submit form data (contact, event registration, group interest, newsletter)

---

## Structured Data (JSON-LD)

**File:** `src/lib/structured-data.ts`

Generates Schema.org JSON-LD objects for SEO. Injected via `<script type="application/ld+json">` in pages.

### `churchJsonLd(locations: Location[])`

**Schema type:** `Church`  
**Used in:** Homepage (`page.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "Church",
  "name": "Église Réformée Évangélique La Chapelle",
  "url": "https://erelachapelle.fr",
  "description": "Communauté de foi chrétienne protestante dans les Cévennes, France",
  "address": { "@type": "PostalAddress", ... },
  "telephone": "...",
  "email": "...",
  "geo": { "@type": "GeoCoordinates", "latitude": ..., "longitude": ... }
}
```

### `eventJsonLd(event: Event, locale: Locale)`

**Schema type:** `Event`  
**Used in:** Event detail pages

Includes: name, description, dates, URL, attendance mode (offline), organizer.

### `articleJsonLd(article: BlogArticle, locale: Locale)`

**Schema type:** `Article`  
**Used in:** Blog detail pages

Includes: headline, description, author, dates, URL, publisher.

### `videoJsonLd(sermon: Sermon, locale: Locale)`

**Schema type:** `VideoObject`  
**Used in:** Sermon detail pages

Includes: name, description, upload date, URL, YouTube embed URL.

---

## Remote Images

The Next.js config allows remote images from:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "erelachapelle.dzign-e.app",
    },
  ],
}
```

This is the CDN host for church photos and assets. Images from this domain can be used with `next/image`.

Currently used URLs:
- `https://erelachapelle.dzign-e.app/igreja-lachappelle.jpg` — Church exterior (hero, gathering section)
- `https://erelachapelle.dzign-e.app/top-view-crown-thorns-bible-arrangement.jpg` — Bible image (faith statement, mobile)
- `https://erelachapelle.dzign-e.app/top-view-crown-thorns-bible.jpg` — Bible image (faith statement, desktop)
