# 06 — Data Layer

## Overview

All data is currently stored as static TypeScript arrays in `src/lib/data/`. Each module follows the same pattern:

1. A **constant array** of typed entities (e.g., `EVENTS`, `SERMONS`).
2. **Query functions** that filter and sort the array.
3. All functions filter out inactive items (`active === false`).

> **Phase 2 Migration:** These modules will be replaced with Cappuccino Cloud API calls using `@cappuccino/web-sdk`. The function signatures will remain the same, making the migration transparent to consuming components.

## Module Index

| Module | File | Entity Type | Count |
|--------|------|-------------|-------|
| Blog | `src/lib/data/blog.ts` | `BlogArticle` | 2 articles |
| Events | `src/lib/data/events.ts` | `Event` | 4 events |
| Groups | `src/lib/data/groups.ts` | `CommunityGroup` | 4 groups |
| Leadership | `src/lib/data/leadership.ts` | `LeadershipMember` | 3 members |
| Locations | `src/lib/data/locations.ts` | `Location` | 1 location |
| Sermons | `src/lib/data/sermons.ts` | `Sermon` | 4 sermons |

---

## Blog (`src/lib/data/blog.ts`)

### Data: `BLOG_ARTICLES`
Two sample articles with French/Portuguese/English content, categories, and slugs.

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `getRecentArticles` | `(limit = 3) → BlogArticle[]` | Returns the most recent published active articles, sorted by `publishedAt` DESC |
| `getAllArticles` | `() → BlogArticle[]` | All active & published articles, sorted by date DESC |
| `getArticleBySlug` | `(slug: string) → BlogArticle \| null` | Find a single article by slug |
| `getArticleCategories` | `() → string[]` | Unique sorted category list |
| `filterArticles` | `(filters: { category? }) → BlogArticle[]` | Filter by category, sorted by date DESC |

---

## Events (`src/lib/data/events.ts`)

### Data: `EVENTS`
Four upcoming events: worship service, family conference, youth night, community picnic. All at `loc-saint-hippolyte`.

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `getRecentEvents` | `(limit = 3) → Event[]` | Closest upcoming events, sorted by `startDate` ASC |
| `getAllEvents` | `() → Event[]` | All active events, sorted by date ASC |
| `getEventBySlug` | `(slug: string) → Event \| null` | Find by slug |
| `getEventTypes` | `() → string[]` | Unique active event types |
| `filterEvents` | `(filters: { eventType?, locationId? }) → Event[]` | Filter by type and/or location |

---

## Groups (`src/lib/data/groups.ts`)

### Data: `GROUPS`
Four community groups: Adult Bible Study (Wednesday), Youth Group (Friday), Prayer Group (Tuesday), Worship Team (Saturday).

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `getGroups` | `() → CommunityGroup[]` | All active groups |
| `getGroupById` | `(id: string) → CommunityGroup \| null` | Find by `_id` |
| `getGroupTypes` | `() → string[]` | Unique active group types |
| `filterGroups` | `(filters: { groupType? }) → CommunityGroup[]` | Filter by type |

---

## Leadership (`src/lib/data/leadership.ts`)

### Data: `LEADERSHIP_TEAM`
Three team members: Senior Pastor (Jean-Marc Dupont), Worship Leader (Marie-Claire Fontaine), Youth Leader (Pierre Moreau).

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `getLeadershipTeam` | `() → LeadershipMember[]` | Active members sorted by `order` ASC |

---

## Locations (`src/lib/data/locations.ts`)

### Data: `LOCATIONS`
Single location: "La Chapelle" in Saint-Hippolyte-du-Fort, France (30170). Includes GPS coordinates, worship schedule, phone, and email.

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `getLocations` | `() → Location[]` | All active locations |
| `getLocationById` | `(id: string) → Location \| null` | Find by `_id` |

---

## Sermons (`src/lib/data/sermons.ts`)

### Data: `SERMONS`
Four sermons with YouTube video IDs, biblical references, series grouping, and preacher info.

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `getRecentSermons` | `(limit = 3) → Sermon[]` | Latest sermons, sorted by `date` DESC |
| `getAllSermons` | `() → Sermon[]` | All active sermons, sorted by date DESC |
| `getSermonBySlug` | `(slug: string) → Sermon \| null` | Find by slug |
| `getSermonPreachers` | `() → string[]` | Unique preacher names |
| `getSermonSeries` | `() → string[]` | Unique series names |
| `filterSermons` | `(filters: { preacher?, series? }) → Sermon[]` | Filter by preacher and/or series |

---

## Constants (`src/lib/constants/index.ts`)

```typescript
const LOCALES: Locale[] = ["fr", "pt", "en"];
const DEFAULT_LOCALE: Locale = "fr";

const SITE_CONFIG = {
  name: "Église Réformée Évangélique La Chapelle",
  description: "Igreja Cévennes - Communauté chrétienne",
  url: "https://erelachapelle.org",
  locations: ["Saint-Hippolyte"] as const,
};
```

Also re-exports `EVENT_TYPES`, `GROUP_TYPES`, and `DAYS_OF_WEEK` from type files for convenience.

---

## Data Flow Pattern

```
Page Component (Server)
  ↓  calls data function
Data Module (src/lib/data/*.ts)
  ↓  filters static array
Typed Entity (src/types/*.ts)
  ↓  getLocalizedContent(entity.field, locale)
Rendered JSX with localized text
```

All data functions are synchronous (Phase 1). In Phase 2 they will become async when migrated to API calls.
