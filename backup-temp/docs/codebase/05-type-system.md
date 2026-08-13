# 05 — Type System

All domain types are defined in `src/types/`. Every multilingual field uses the shared `MultilingualText` interface.

## Common Types (`src/types/common.ts`)

```typescript
// Core multilingual text — used by every content entity
interface MultilingualText {
  fr: string;
  pt: string;
  en: string;
}

// Bible verse reference
interface BibleRef {
  book: string;
  chapter: number;
  verses?: string;
}

// GPS coordinates for locations
interface Coordinates {
  lat: number;
  lng: number;
}

// Paginated API response (Phase 2)
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// SEO metadata
interface SEOMeta {
  title: string;
  description: string;
  ogImage?: string;
}

// Locale union type
type Locale = "fr" | "pt" | "en";
```

## Blog Article (`src/types/blog.ts`)

```typescript
interface BlogArticle {
  _id: string;
  title: MultilingualText;
  content: MultilingualText;
  excerpt: MultilingualText;
  author: string;
  authorBio?: string;
  publishedAt: string;          // ISO date
  featuredImage?: string;       // URL
  categories: string[];         // e.g. ["community", "devotional"]
  tags: string[];
  slug: string;                 // URL-safe identifier
  published: boolean;
  active: boolean;              // Soft delete flag
  createdAt: string;
  updatedAt: string;
}
```

## Event (`src/types/event.ts`)

```typescript
// Enumerated event types
const EVENT_TYPES = [
  "service", "conference", "community",
  "youth", "outreach", "prayer", "other"
] as const;
type EventType = typeof EVENT_TYPES[number];

interface Event {
  _id: string;
  title: MultilingualText;
  description: MultilingualText;
  eventType: EventType;
  startDate: string;            // ISO datetime
  endDate?: string;
  locationId: string;           // FK to Location._id
  customAddress?: string;       // Override location
  featuredImage?: string;
  registrationEnabled: boolean;
  capacity?: number;
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Filter parameters for event queries
interface EventFilter {
  eventType?: EventType;
  locationId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Event registration submission
interface EventRegistration {
  _id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  attendees: number;
  createdAt: string;
}
```

## Community Group (`src/types/group.ts`)

```typescript
const GROUP_TYPES = [
  "bible_study", "prayer", "youth", "women",
  "men", "seniors", "worship", "outreach", "other"
] as const;
type GroupType = typeof GROUP_TYPES[number];

const DAYS_OF_WEEK = [
  "monday", "tuesday", "wednesday", "thursday",
  "friday", "saturday", "sunday"
] as const;
type DayOfWeek = typeof DAYS_OF_WEEK[number];

interface CommunityGroup {
  _id: string;
  name: MultilingualText;
  description: MultilingualText;
  groupType: GroupType;
  leaderName: string;
  leaderContact?: string;
  meetingDay: DayOfWeek;
  meetingTime: string;          // e.g. "20:00"
  locationId?: string;
  customAddress?: string;
  maxCapacity?: number;
  featuredImage?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Group interest submission
interface GroupInterest {
  _id: string;
  groupId: string;
  name: string;
  email: string;
  message?: string;
  createdAt: string;
}
```

## Leadership Member (`src/types/leader.ts`)

```typescript
interface LeadershipMember {
  _id: string;
  fullName: string;
  role: MultilingualText;
  bio: MultilingualText;
  photoUrl?: string;
  email?: string;
  ministryAreas: string[];      // e.g. ["teaching", "worship"]
  order: number;                // Display order
  active: boolean;
}
```

## Location (`src/types/location.ts`)

```typescript
interface Location {
  _id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: Coordinates;     // { lat, lng }
  worshipSchedule: MultilingualText;
  contactPhone?: string;
  contactEmail?: string;
  active: boolean;
}
```

## Sermon (`src/types/sermon.ts`)

```typescript
interface Sermon {
  _id: string;
  title: MultilingualText;
  description?: MultilingualText;
  preacher: string;
  date: string;                 // ISO date
  biblicalReference?: BibleRef;
  series?: string;              // Sermon series name
  seriesOrder?: number;
  youtubeVideoId: string;
  pdfNotesUrl?: string;
  tags: string[];
  duration?: number;            // Minutes
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SermonFilter {
  preacher?: string;
  series?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

interface SermonSeries {
  name: string;
  count: number;
}
```

## Type Design Patterns

1. **`_id` field**: All entities use `_id` (MongoDB-style) for future Cappuccino API compatibility.
2. **`active` flag**: Soft-delete pattern — data is filtered with `.filter(e => e.active)`.
3. **`slug` field**: URL-friendly identifier for detail pages.
4. **`MultilingualText`**: All human-facing text is trilingual.
5. **`createdAt` / `updatedAt`**: Audit timestamps as ISO strings.
6. **Const arrays + typeof**: Event types, group types, and days are defined as `const` arrays and their union types derived with `typeof ... [number]`.
