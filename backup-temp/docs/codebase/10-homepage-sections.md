# 10 — Homepage Sections

The homepage (`src/app/[locale]/page.tsx`) is composed of six server-rendered sections displayed in this order:

```
HeroSection
FaithStatementSection
GatheringSection
CommunitySection
EventsPreviewSection
BlogPreviewSection
```

> `SermonsPreviewSection` and `AboutSection` exist as components but are **not currently rendered** on the homepage.

The homepage also injects JSON-LD structured data (`churchJsonLd`) in a `<script>` tag.

---

## 1. HeroSection

**File:** `src/app/[locale]/_components/hero/HeroSection.tsx`  
**Type:** Server Component  
**Purpose:** Full-viewport hero with background image, title, subtitle, and CTA.

### Structure

```
<section> (height: 100svh)
├── HeroBanner (background image with SVG gradient-map filter)
├── Bottom gradient fade (transparent → night-bordeaux-2)
├── Content overlay (vertically centered)
│   ├── CrossDivider (white)
│   ├── <h1> title (serif, 3xl–6xl, white, golden-ratio max-width on desktop)
│   ├── <p> subtitle (white/85)
│   └── SplitButton (gold variant, links to /about)
└── Scroll indicator (ChevronDown, bounce animation)
```

### HeroBanner Sub-component

**File:** `src/app/[locale]/_components/hero/HeroBanner.tsx`  
**Type:** Server Component

Uses an inline SVG `<filter>` element (`gradient-map-borgonha`) to apply a burgundy gradient map to the background photo. This creates the distinctive branded look without image editing:

1. Desaturates the image to grayscale (`feColorMatrix type="saturate" values="0"`).
2. Remaps luminosity to burgundy tones (`feComponentTransfer`).
3. Adds a `rich-mahogany/30` overlay for further softening.

### Responsive Design
- Mobile: centered text, smaller font sizes.
- Desktop: left-aligned text, golden-ratio max-width (`max-w-[61.8%]` for h1, `max-w-[50%]` for subtitle).

---

## 2. FaithStatementSection

**File:** `src/app/[locale]/_components/faith-statement/FaithStatementSection.tsx`  
**Type:** Server Component  
**Purpose:** Church faith statement quote with image, on a night-bordeaux background.

### Structure

```
<section> (bg-night-bordeaux-2, py-20 md:py-32)
├── Flex row (column on mobile, row on desktop)
│   ├── ScrollReveal (from="left") — Text side
│   │   ├── Opening quote mark (serif, toffee-brown)
│   │   └── <p> faith statement (serif, italic, white)
│   │
│   └── ScrollReveal (from="right") — Image side
│       ├── Mobile: landscape aspect-video image
│       └── Desktop: full-height image (h-full)
│
└── CrossDivider (white, centered)
```

### ScrollReveal Sub-component

**File:** `src/app/[locale]/_components/faith-statement/ScrollReveal.tsx`  
**Type:** Client Component (`"use client"`)

A scroll-driven reveal animation:
- **Direction:** `from="left"` or `from="right"` — controls initial offset.
- **Progress calculation:** Linear from viewport bottom (progress=0) to 30% from top (progress=1).
- **Effect:** `opacity: progress` and `translateX: (1-progress) * offset`.
- **Performance:** Uses `requestAnimationFrame`, `will-change`, and `{ passive: true }` scroll listener.
- **Default offset:** 96px (6rem).

---

## 3. GatheringSection

**File:** `src/app/[locale]/_components/GatheringSection.tsx`  
**Type:** Server Component  
**Purpose:** Full-bleed church location section with address, schedule, email, and directions.

### Structure

```
<section> (relative, min-h-150 md:min-h-175)
├── Background Image (fill, object-cover)
├── Overlays (3 layers: mahogany/70, gradient-to-t, gradient-to-r)
├── Content (bottom-aligned)
│   ├── Label ("Notre église")
│   ├── <h2> church name (serif, 4xl–7xl, parchment)
│   ├── Gold accent line
│   ├── Info row (3 columns with dividers)
│   │   ├── Address (MapPointBold icon)
│   │   ├── Schedule (ClockCircleBold icon)
│   │   └── Email (LetterBold icon)
│   └── Directions button (SplitButton style, gold, external link to Google Maps)
```

### Data Source
- Loads from `getLocations()` — uses the first location.
- Generates Google Maps directions URL via `getDirectionsUrl()`.
- Localizes worship schedule via `getLocalizedContent()`.

### Icons
Uses Solar Icon Set (`solar-icon-set`) for bold map/clock/letter icons with `var(--toffee-brown)` color.

---

## 4. CommunitySection

**File:** `src/app/[locale]/_components/CommunitySection.tsx`  
**Type:** Server Component  
**Purpose:** Preview of community groups, showing up to 4 groups.

### Structure

```
<section> (bg-parchment, py-24 md:py-32)
├── Header (centered)
│   ├── Label (uppercase, toffee-brown)
│   ├── <h2> title (serif, 3xl–5xl)
│   └── Diamond separator
├── Groups grid (2 columns on desktop)
│   └── For each group:
│       ├── Icon circle (from rotating set: Users, Heart, BookOpen, Music)
│       ├── Group name (serif, xl)
│       └── Description (coffee-bean/70)
```

### Data Source
- `getGroups().slice(0, 4)` — first 4 active groups.
- Icons cycle through `[Users, Heart, BookOpen, Music]` based on index.

---

## 5. EventsPreviewSection

**File:** `src/app/[locale]/_components/EventsPreviewSection.tsx`  
**Type:** Server Component  
**Purpose:** Upcoming events preview with up to 3 event cards.

### Structure

```
<section> (bg-parchment)
├── Section separator (star ✦ divider)
├── Header (centered)
│   ├── Label
│   ├── <h2> title (rich-mahogany)
│   └── Diamond separator
├── Events grid (3 columns on desktop)
│   └── EventCard × 3
└── SplitButton → /events
```

### Empty State
When no events exist, shows a `Calendar` icon with the `empty` translation message.

### EventCard Component

**File:** `src/app/[locale]/_components/EventCard.tsx`  
**Type:** Server Component

Props: `date`, `type`, `title`, `location`, `description`, `href`, `locale`, `typeLabel`.

Features:
- Large date number (day) with abbreviated month.
- Color-coded type badge (culte=gold, conference=powder-petal, jeunesse=night-bordeaux, autre=rich-mahogany).
- Title, location with MapPin icon, truncated description.
- Rounded card with shadow and hover elevation.

### Event Type Mapping
Internal → display: `service→culte`, `conference→conference`, `youth→jeunesse`, `community/outreach/other→autre`, `prayer→culte`.

---

## 6. BlogPreviewSection

**File:** `src/app/[locale]/_components/BlogPreviewSection.tsx`  
**Type:** Server Component  
**Purpose:** Latest blog articles preview with up to 3 article cards.

### Structure

```
<section> (bg-parchment)
├── Section separator
├── Header (centered)
├── Articles grid (3 columns on desktop)
│   └── For each article:
│       ├── Image (or gradient placeholder with ✦ symbol)
│       ├── Date + author meta
│       ├── Title (serif, rich-mahogany)
│       ├── Excerpt
│       └── "Read more" with ArrowUpRight (opacity on hover)
└── SplitButton (burgundy) → /blog
```

Returns `null` if no articles exist.

---

## 7. SermonsPreviewSection (Not on homepage)

**File:** `src/app/[locale]/_components/SermonsPreviewSection.tsx`  
**Type:** Server Component  
**Purpose:** Latest sermons preview with YouTube thumbnail cards.

### Structure

```
<section> (bg-dust-grey)
├── Decorative top border (gradient line)
├── SectionLabel
├── <h2> title
├── Sermons grid (3 columns)
│   └── SermonCard × 3
└── SplitButton (burgundy) → /sermons
```

### SermonCard Component

**File:** `src/app/[locale]/_components/SermonCard.tsx`  
**Type:** Server Component

Props: `thumbnail`, `date`, `preacher`, `series`, `title`, `videoUrl`, `locale`.

Features:
- 16:9 YouTube thumbnail with play button overlay.
- Series badge on the image.
- Date, title, preacher name.
- Expanding gold accent line on hover.
- Links externally to YouTube video.

---

## 8. AboutSection (Not on homepage)

**File:** `src/app/[locale]/_components/AboutSection.tsx`  
**Type:** Server Component  
**Purpose:** Simple about teaser with mission text and CTA.

Two-column layout: text on left, SplitButton on right. Uses `SectionLabel` for the header.
