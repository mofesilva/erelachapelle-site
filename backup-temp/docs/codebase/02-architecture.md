# 02 — Architecture Overview

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.4 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5.x (strict) |
| Styling | Tailwind CSS | 4.x |
| Component Library | shadcn/ui (New York) | — |
| i18n | next-intl | 4.8.2 |
| Form Management | React Hook Form | 7.71.1 |
| Validation | Zod | 4.3.6 |
| Icons | Lucide React / Solar Icon Set | — |
| Date Utilities | date-fns | 4.1.0 |
| CSS Utilities | clsx + tailwind-merge | — |
| Radix Primitives | radix-ui | 1.4.3 |
| Compiler | React Compiler (babel-plugin) | 1.0.0 |

## Architectural Layers

```
┌─────────────────────────────────────┐
│           Presentation              │  Next.js pages, layouts, components
│    (src/app/, src/_components/)      │  Server Components by default
├─────────────────────────────────────┤
│         Server Actions              │  Form handling with Zod validation
│         (src/app/actions/)          │  "use server" directive
├─────────────────────────────────────┤
│          Data Layer                 │  Static data + query functions
│         (src/lib/data/)             │  Phase 2: Cappuccino SDK calls
├─────────────────────────────────────┤
│         Integrations                │  Google Maps, YouTube
│     (src/lib/integrations/)         │  URL builders, embed helpers
├─────────────────────────────────────┤
│        Type Definitions             │  Domain models, shared types
│          (src/types/)               │  Multilingual text, filters
└─────────────────────────────────────┘
```

## Design Decisions

### 1. Server Components by Default
All components are Server Components (RSC) unless they need browser APIs (state, effects, event handlers). Client components are marked with `"use client"` at the top. This minimizes JavaScript sent to the client.

**Server Components:** Header behavior split — the `Header.tsx` is a client component (needs scroll state), while `Footer.tsx` is a server component.

### 2. Static Data (Phase 1)
Data is stored as TypeScript arrays in `src/lib/data/`. Each module exports:
- A constant array (e.g., `EVENTS`, `SERMONS`)
- Query/filter functions (e.g., `getRecentEvents()`, `filterSermons()`)

This will be replaced with Cappuccino Cloud API calls in Phase 2, using the already-installed `@cappuccino/web-sdk`.

### 3. Multilingual-First
Every text-bearing entity uses the `MultilingualText` interface (`{ fr, pt, en }`). The `getLocalizedContent(content, locale)` utility extracts the right language, falling back to French.

### 4. React Compiler
The React Compiler (`babel-plugin-react-compiler`) is enabled in `next.config.ts` via `reactCompiler: true`. This automatically memoizes components and hooks, removing the need for manual `useMemo`/`useCallback` in most cases.

### 5. Route Groups
The `(public)` route group in `src/app/[locale]/(public)/` is used to organize public-facing pages without affecting the URL structure. This keeps the routing clean while allowing shared layout potential.

## Project Structure — Full Tree

```
src/
├── app/
│   ├── globals.css                    # Tailwind imports + design tokens + utilities
│   ├── layout.tsx                     # Root layout (metadata only, children passthrough)
│   ├── page.tsx                       # Root page — redirects to /fr
│   ├── robots.ts                      # robots.txt generation
│   ├── sitemap.ts                     # Dynamic sitemap.xml generation
│   ├── favicon.ico
│   ├── actions/                       # Server Actions (form handlers)
│   │   ├── contact.ts
│   │   ├── events.ts
│   │   ├── groups.ts
│   │   └── newsletter.ts
│   └── [locale]/                      # Dynamic locale segment
│       ├── layout.tsx                 # Locale layout (fonts, i18n provider, header/footer)
│       ├── page.tsx                   # Homepage
│       ├── _components/              # Homepage-scoped components
│       │   ├── Header.tsx            # Fixed header with scroll effect (client)
│       │   ├── Footer.tsx            # Site footer (server)
│       │   ├── MobileMenu.tsx        # Full-screen slide-in menu (client)
│       │   ├── LanguageSwitcher.tsx   # FR/PT/EN toggle (client)
│       │   ├── EventCard.tsx         # Event card for homepage preview
│       │   ├── SermonCard.tsx        # Sermon card for homepage preview
│       │   ├── LocationCard.tsx      # Location display card
│       │   ├── hero/
│       │   │   ├── HeroSection.tsx   # Full-viewport hero (server)
│       │   │   └── HeroBanner.tsx    # Background image with SVG gradient map
│       │   ├── faith-statement/
│       │   │   ├── FaithStatementSection.tsx  # Faith quote section (server)
│       │   │   └── ScrollReveal.tsx  # Scroll-driven animation (client)
│       │   ├── GatheringSection.tsx   # Church location/schedule section
│       │   ├── CommunitySection.tsx   # Community groups preview
│       │   ├── EventsPreviewSection.tsx # Upcoming events preview
│       │   ├── BlogPreviewSection.tsx # Latest blog articles preview
│       │   ├── SermonsPreviewSection.tsx # Latest sermons preview
│       │   └── AboutSection.tsx      # About teaser section
│       └── (public)/                 # Route group — no URL impact
│           ├── about/                # /[locale]/about
│           ├── blog/                 # /[locale]/blog + /[locale]/blog/[slug]
│           ├── sermons/              # /[locale]/sermons + /[locale]/sermons/[slug]
│           ├── events/               # /[locale]/events + /[locale]/events/[slug]
│           ├── community/            # /[locale]/community + groups sub-routes
│           └── contact/              # /[locale]/contact
├── _components/                      # Shared components (used across pages)
│   ├── ui/                           # shadcn/ui primitives
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   └── textarea.tsx
│   ├── CrossDivider.tsx              # ✟ cross with lines
│   ├── DiamondDivider.tsx            # ◆ diamond with lines
│   ├── DiamondPatternBackground.tsx  # SVG pattern overlay
│   ├── GoogleMapEmbed.tsx            # Google Maps iframe + directions link
│   ├── NewsletterSignup.tsx          # Newsletter form (client)
│   ├── SectionLabel.tsx              # ◆—— Label ——◆ section header
│   ├── ShareButtons.tsx              # Facebook, WhatsApp, Email share (client)
│   ├── SplitButton.tsx               # Two-tone CTA button with arrow
│   ├── TeamMemberCard.tsx            # Leadership member card
│   └── YouTubeEmbed.tsx              # Privacy-friendly YouTube embed
├── i18n/
│   ├── routing.ts                    # Locale definitions (fr, pt, en)
│   └── request.ts                    # Server-side locale resolution
├── lib/
│   ├── utils.ts                      # cn(), formatDate(), getLocalizedContent(), slugify()
│   ├── structured-data.ts            # JSON-LD generators (Church, Event, Article, Video)
│   ├── constants/index.ts            # Site config, locale list, re-exports
│   ├── data/                         # Static data modules
│   │   ├── blog.ts
│   │   ├── events.ts
│   │   ├── groups.ts
│   │   ├── leadership.ts
│   │   ├── locations.ts
│   │   └── sermons.ts
│   ├── integrations/
│   │   ├── maps.ts                   # Google Maps URL builders
│   │   └── youtube.ts                # YouTube thumbnail/embed URL builders
│   └── validations/                  # Zod schemas
│       ├── contact.schema.ts
│       ├── event.schema.ts
│       ├── group.schema.ts
│       └── newsletter.schema.ts
├── messages/                         # Translation files
│   ├── fr.json                       # French (default)
│   ├── pt.json                       # Portuguese
│   └── en.json                       # English
└── types/                            # TypeScript type definitions
    ├── common.ts                     # MultilingualText, Locale, Coordinates, etc.
    ├── blog.ts                       # BlogArticle
    ├── event.ts                      # Event, EventFilter, EventRegistration
    ├── group.ts                      # CommunityGroup, GroupInterest
    ├── leader.ts                     # LeadershipMember
    ├── location.ts                   # Location
    └── sermon.ts                     # Sermon, SermonFilter, SermonSeries
```

## Component Rendering Strategy

| Component | Type | Reason |
|-----------|------|--------|
| `Header` | Client | `useState` for menu open/scroll state, `useEffect` for scroll listener |
| `MobileMenu` | Client | `createPortal`, animation state, body scroll lock |
| `LanguageSwitcher` | Client | `useRouter` for navigation, `useLocale` |
| `Footer` | Server | Static content, uses `getTranslations()` |
| `HeroSection` | Server | Uses `getTranslations()`, no interactivity |
| `HeroBanner` | Server | Static SVG filter + Image |
| `FaithStatementSection` | Server | Wrapper for scroll reveal content |
| `ScrollReveal` | Client | `IntersectionObserver`-like scroll animation |
| `GatheringSection` | Server | Data fetching, static rendering |
| `CommunitySection` | Server | Data fetching, static rendering |
| `EventsPreviewSection` | Server | Data fetching, static rendering |
| `BlogPreviewSection` | Server | Data fetching, static rendering |
| `SermonsPreviewSection` | Server | Data fetching, static rendering |
| `NewsletterSignup` | Client | `useActionState` for form submission |
| `ShareButtons` | Client | `useTranslations` |
| `ContactForm` | Client | React Hook Form + `useActionState` |
| `EventRegistrationForm` | Client | React Hook Form + `useActionState` |
| `JoinGroupForm` | Client | React Hook Form + `useActionState` |
| All other components | Server | Default — no client-side state needed |
