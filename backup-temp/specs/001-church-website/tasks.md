# Tasks: Igreja Cévennes Multilingual Website (MVP)

**Input**: Design documents from `/specs/001-church-website/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not included (not requested in spec). Add with `/speckit.tasks --tdd` if desired.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Install dependencies, configure tooling, create project skeleton

- [x] T001 Install missing dependencies: `npm install next-intl react-hook-form zod @hookform/resolvers`
- [x] T002 Initialize shadcn/ui with Borgonha design tokens: `npx shadcn@latest init` and configure `src/app/globals.css` with CSS variables (--primary: Borgonha #722F37, --accent-marigold, --accent-coral, --accent-salmon)
- [x] T003 [P] Install shadcn/ui components: `npx shadcn@latest add button card input textarea form label separator sheet badge navigation-menu`
- [x] T004 [P] Configure next-intl plugin in `src/next.config.ts` with createNextIntlPlugin
- [x] T005 [P] Create environment variables template in `.env.example` (CAPPUCCINO_API_URL, CAPPUCCINO_API_KEY, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
- [x] T006 Create directory structure per plan.md: `src/components/{ui,shared,layout,sections}`, `src/hooks/`, `src/lib/{constants,validations,integrations}`, `src/types/`, `src/messages/`, `src/app/actions/`, `src/app/[locale]/(public)/`

**Checkpoint**: Project compiles with `npm run build`, all dependencies installed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Types & Domain Layer

- [x] T007 [P] Create shared types in `src/types/common.ts`: MultilingualText, BibleRef, PaginatedResponse, Coordinates, SEOMeta
- [x] T008 [P] Create Location types in `src/types/location.ts`: Location interface
- [x] T009 [P] Create Event types in `src/types/event.ts`: Event, EventType enum, EventFilter, EventRegistration
- [x] T010 [P] Create Sermon types in `src/types/sermon.ts`: Sermon, SermonFilter, SermonSeries
- [x] T011 [P] Create Group types in `src/types/group.ts`: CommunityGroup, GroupType enum, DayOfWeek enum, GroupInterest
- [x] T012 [P] Create Blog types in `src/types/blog.ts`: BlogArticle
- [x] T013 [P] Create Leader types in `src/types/leader.ts`: LeadershipMember
- [x] T014 [P] Create constants in `src/lib/constants/index.ts`: EVENT_TYPES, GROUP_TYPES, DAYS_OF_WEEK, LOCALES, SITE_CONFIG

### Infrastructure Layer

- [x] T015 Configure Cappuccino server client in `src/lib/cappuccino.ts`: getCappuccinoServer() using createCappuccinoServerClient with cookie-based auth
- [x] T016 [P] Create utility functions in `src/lib/utils.ts`: cn(), formatDate(), getLocalizedContent(), slugify()
- [x] T017 [P] Create YouTube helper in `src/lib/integrations/youtube.ts`: getYouTubeThumbnailUrl(), getYouTubeEmbedUrl()
- [x] T018 [P] Create Google Maps helper in `src/lib/integrations/maps.ts`: getGoogleMapsEmbedUrl(), getDirectionsUrl()

### i18n Foundation

- [x] T019 Create next-intl request config in `src/i18n/request.ts` with getRequestConfig for FR/PT/EN, default FR
- [x] T020 [P] Create i18n routing config in `src/i18n/routing.ts` with defineRouting (locales: fr, pt, en, defaultLocale: fr)
- [x] T021 Create locale middleware in `src/middleware.ts` with createMiddleware from next-intl
- [x] T022 [P] Create base translation file `src/messages/fr.json` with namespaces: common, navigation, homepage, events, sermons, community, blog, about, contact, forms
- [x] T023 [P] Create base translation file `src/messages/pt.json` (same structure as fr.json)
- [x] T024 [P] Create base translation file `src/messages/en.json` (same structure as fr.json)

### Layout Foundation

- [x] T025 Create root locale layout in `src/app/[locale]/layout.tsx`: NextIntlClientProvider, Playfair Display + Inter fonts via next/font, metadata, CappuccinoProvider hydration
- [x] T026 [P] Create LanguageSwitcher component in `src/components/layout/LanguageSwitcher.tsx` ('use client'): FR/PT/EN selector using useRouter + usePathname from next-intl
- [x] T027 Create Header component in `src/components/layout/Header.tsx`: church logo, navigation menu, LanguageSwitcher, mobile hamburger menu (Sheet)
- [x] T028 [P] Create Footer component in `src/components/layout/Footer.tsx`: church info, locations, social links, copyright
- [x] T029 [P] Create SectionLabel component in `src/components/shared/SectionLabel.tsx`: diamond divider pattern (◆────◆) used across all sections

### Data Fetching Layer

- [x] T030 [P] Create data fetching functions in `src/lib/data/locations.ts`: getLocations(), getLocationById() with unstable_cache (1h TTL)
- [x] T031 [P] Create data fetching functions in `src/lib/data/leadership.ts`: getLeadershipTeam() with unstable_cache (1h TTL)
- [x] T032 [P] Create data fetching functions in `src/lib/data/sermons.ts`: getSermons(), getSermonBySlug(), getSermonSeries(), getSermonPreachers(), getRecentSermons() with unstable_cache (5min TTL)
- [x] T033 [P] Create data fetching functions in `src/lib/data/events.ts`: getUpcomingEvents(), getEventBySlug(), getRecentEvents() with unstable_cache (5min TTL)
- [x] T034 [P] Create data fetching functions in `src/lib/data/groups.ts`: getGroups(), getGroupById() with unstable_cache (15min TTL)
- [x] T035 [P] Create data fetching functions in `src/lib/data/blog.ts`: getBlogArticles(), getArticleBySlug(), getBlogCategories(), getRecentArticles() with unstable_cache (5min TTL)

**Checkpoint**: Foundation ready — `npm run build` passes, locale routing works, Cappuccino client connects, all types defined, data fetching functions ready. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Visitor Discovers Church Information (Priority: P1) 🎯 MVP

**Goal**: First-time visitor lands on website, finds service times/locations, learns about the church, sees leadership team, can navigate in FR/PT/EN.

**Independent Test**: Navigate to homepage → see 8 sections → switch language to PT → view About page → locate service times for 3 locations → see leadership team.

### Implementation for User Story 1

- [x] T036 [P] [US1] Create HeroSection component in `src/components/sections/HeroSection.tsx`: church name, mission statement, CTA button, hero image with 40/60 grid, arrow (→) decorative
- [x] T037 [P] [US1] Create GatheringSection component in `src/components/sections/GatheringSection.tsx`: worship times for Saint-Hippolyte, Lasalle, Monoblet with addresses and schedules
- [x] T038 [P] [US1] Create AboutSection component in `src/components/sections/AboutSection.tsx`: church mission/vision summary with CTA to full About page
- [x] T039 [P] [US1] Create TeamSection component in `src/components/sections/TeamSection.tsx`: leadership team grid with photos, names, roles (Server Component fetching from Cappuccino)
- [x] T040 [P] [US1] Create EventsPreviewSection component in `src/components/sections/EventsPreviewSection.tsx`: 3 upcoming events cards with "See All" link
- [x] T041 [P] [US1] Create SermonsPreviewSection component in `src/components/sections/SermonsPreviewSection.tsx`: 3 latest sermons cards with "See All" link
- [x] T042 [P] [US1] Create CommunitySection component in `src/components/sections/CommunitySection.tsx`: community groups overview with "Join a Group" CTA
- [x] T043 [P] [US1] Create BlogPreviewSection component in `src/components/sections/BlogPreviewSection.tsx`: 3 recent articles with "Read More" link
- [x] T044 [US1] Create Homepage in `src/app/[locale]/page.tsx`: compose all 8 sections (Hero, Gathering, About, Team, Events, Sermons, Community, Blog), Server Component with data fetching, generateMetadata()
- [x] T045 [P] [US1] Create About page in `src/app/[locale]/(public)/about/page.tsx`: mission, vision, history, statement of faith sections, generateMetadata()
- [x] T046 [P] [US1] Create Leadership page or section: integrate TeamSection with full bios, fetching getLeadershipTeam()
- [x] T047 [US1] Add FR/PT/EN translations for US1 pages in `src/messages/{fr,pt,en}.json`: homepage, navigation, about, common namespaces

**Checkpoint**: Homepage fully functional with 8 sections, About page complete, language switching works across all pages, service times visible for 3 locations.

---

## Phase 4: User Story 2 — Member Watches Sermon Archive (Priority: P1)

**Goal**: Church member can browse sermon archive, search/filter by preacher/series/theme/date, watch YouTube video, download PDF notes.

**Independent Test**: Navigate to Sermons → see listing with cards → filter by preacher → click sermon → watch YouTube video → download PDF notes.

### Implementation for User Story 2

- [x] T048 [P] [US2] Create YouTubeEmbed component in `src/components/shared/YouTubeEmbed.tsx` ('use client'): responsive iframe with youtube-nocookie.com, lazy loading, title attribute for a11y
- [x] T049 [P] [US2] Create SermonCard component in `src/app/[locale]/(public)/sermons/_components/SermonCard.tsx`: thumbnail, title, preacher, date, biblical reference, series badge
- [x] T050 [P] [US2] Create SermonFilters component in `src/app/[locale]/(public)/sermons/_components/SermonFilters.tsx` ('use client'): search by preacher, series, tag, date range with URL params
- [x] T051 [US2] Create Sermons listing page in `src/app/[locale]/(public)/sermons/page.tsx`: Server Component fetching getSermons() with filters from searchParams, pagination, generateMetadata()
- [x] T052 [US2] Create Sermon detail page in `src/app/[locale]/(public)/sermons/[slug]/page.tsx`: YouTubeEmbed, description, biblical references, PDF download link, series navigation, generateMetadata() with VideoObject JSON-LD
- [x] T053 [US2] Add FR/PT/EN translations for sermons in `src/messages/{fr,pt,en}.json`: sermons namespace (archive title, filter labels, no results, download notes, etc.)

**Checkpoint**: Sermon archive browsable, filters work, YouTube videos play, PDF notes downloadable, paginated for 500+ sermons.

---

## Phase 5: User Story 3 — User Explores Upcoming Events (Priority: P2)

**Goal**: User can view upcoming events, filter by date/location/type, see event details with Google Maps, register for events, share on social media.

**Independent Test**: Navigate to Events → see upcoming events → filter by location → click event → see map → fill registration form → share event.

### Implementation for User Story 3

- [x] T054 [P] [US3] Create GoogleMapEmbed component in `src/components/shared/GoogleMapEmbed.tsx`: iframe embed with Google Maps API, lazy loading, "Get Directions" link
- [x] T055 [P] [US3] Create ShareButtons component in `src/components/shared/ShareButtons.tsx` ('use client'): Facebook, WhatsApp, Email share with pre-formatted messages
- [x] T056 [P] [US3] Create Zod validation schema in `src/lib/validations/event.schema.ts`: eventRegistrationSchema (name, email, phone?, attendees 1-20, honeypot)
- [x] T057 [P] [US3] Create Server Action in `src/app/actions/events.ts`: registerForEvent() with Zod validation, honeypot spam check, capacity check, Cappuccino insert to event_registrations
- [x] T058 [P] [US3] Create EventCard component in `src/app/[locale]/(public)/events/_components/EventCard.tsx`: title, date, location, featured image, event type badge
- [x] T059 [P] [US3] Create EventFilters component in `src/app/[locale]/(public)/events/_components/EventFilters.tsx` ('use client'): filter by date range, location, event type with URL params
- [x] T060 [P] [US3] Create EventRegistrationForm component in `src/app/[locale]/(public)/events/_components/EventRegistrationForm.tsx` ('use client'): React Hook Form + Zod, name/email/phone/attendees, success/error states, honeypot field
- [x] T061 [US3] Create Events listing page in `src/app/[locale]/(public)/events/page.tsx`: Server Component with getUpcomingEvents(), filters from searchParams, pagination, generateMetadata()
- [x] T062 [US3] Create Event detail page in `src/app/[locale]/(public)/events/[slug]/page.tsx`: full description, date/time, GoogleMapEmbed, EventRegistrationForm, ShareButtons, generateMetadata() with Event JSON-LD
- [x] T063 [US3] Add FR/PT/EN translations for events in `src/messages/{fr,pt,en}.json`: events namespace (listing title, filter labels, registration form labels, success messages)

**Checkpoint**: Events listing with filters, event detail with map, registration form submits to Cappuccino, social sharing works.

---

## Phase 6: User Story 4 — Member Finds Community Group (Priority: P2)

**Goal**: Church member browses groups directory, filters by type/day, views group details with leader info, expresses interest via form.

**Independent Test**: Navigate to Community → see groups directory → filter by type → click group → see leader info/schedule → submit interest form.

### Implementation for User Story 4

- [x] T064 [P] [US4] Create Zod validation schema in `src/lib/validations/group.schema.ts`: groupInterestSchema (name, email, message?, honeypot)
- [x] T065 [P] [US4] Create Server Action in `src/app/actions/groups.ts`: expressGroupInterest() with Zod validation, honeypot check, Cappuccino insert to group_interests
- [x] T066 [P] [US4] Create GroupCard component in `src/app/[locale]/(public)/community/_components/GroupCard.tsx`: group name, type badge, meeting day/time, location, leader name
- [x] T067 [P] [US4] Create GroupFilters component in `src/app/[locale]/(public)/community/_components/GroupFilters.tsx` ('use client'): filter by GroupType and DayOfWeek
- [x] T068 [P] [US4] Create JoinGroupForm component in `src/app/[locale]/(public)/community/_components/JoinGroupForm.tsx` ('use client'): React Hook Form + Zod, name/email/message, success/error states
- [x] T069 [US4] Create Groups directory page in `src/app/[locale]/(public)/community/groups/page.tsx`: Server Component with getGroups(), filters from searchParams, generateMetadata()
- [x] T070 [US4] Create Group detail page in `src/app/[locale]/(public)/community/groups/[id]/page.tsx`: description, leader info, meeting schedule, location, JoinGroupForm, generateMetadata()
- [x] T071 [P] [US4] Create Community overview page in `src/app/[locale]/(public)/community/page.tsx`: intro text, links to groups directory, generateMetadata()
- [x] T072 [US4] Add FR/PT/EN translations for community in `src/messages/{fr,pt,en}.json`: community namespace (groups title, filter labels, interest form labels, day names)

**Checkpoint**: Groups directory with filters, group detail with leader info, interest form submits to Cappuccino.

---

## Phase 7: User Story 5 — User Reads Blog and News (Priority: P3)

**Goal**: User browses blog articles, filters by category/tag, reads full article with author bio, shares on social media.

**Independent Test**: Navigate to Blog → see article cards → filter by category → click article → read full content → share article.

### Implementation for User Story 5

- [x] T073 [P] [US5] Create ArticleCard component in `src/app/[locale]/(public)/blog/_components/ArticleCard.tsx`: title, featured image, excerpt, author, date, category tags
- [x] T074 [P] [US5] Create ArticleFilters component in `src/app/[locale]/(public)/blog/_components/ArticleFilters.tsx` ('use client'): filter by category with URL params
- [x] T075 [US5] Create Blog listing page in `src/app/[locale]/(public)/blog/page.tsx`: Server Component with getBlogArticles(), category filters from searchParams, pagination, generateMetadata()
- [x] T076 [US5] Create Article detail page in `src/app/[locale]/(public)/blog/[slug]/page.tsx`: full rich text content, author bio, publish date, ShareButtons, generateMetadata() with Article JSON-LD
- [x] T077 [US5] Add FR/PT/EN translations for blog in `src/messages/{fr,pt,en}.json`: blog namespace (listing title, filter labels, read more, share labels)

**Checkpoint**: Blog listing with category filters, full article view, social sharing, paginated.

---

## Phase 8: User Story 6 — User Contacts Church (Priority: P3)

**Goal**: User finds contact info, sees location on map, submits contact form, gets directions to church.

**Independent Test**: Navigate to Contact → see address/phone/email/hours → see Google Map → fill contact form → receive confirmation → click "Get Directions".

### Implementation for User Story 6

- [x] T078 [P] [US6] Create Zod validation schema in `src/lib/validations/contact.schema.ts`: contactSchema (name, email, subject, message min 10 chars, honeypot)
- [x] T079 [P] [US6] Create Server Action in `src/app/actions/contact.ts`: submitContactForm() with Zod validation, honeypot check, Cappuccino insert to contact_submissions
- [x] T080 [P] [US6] Create ContactForm component in `src/app/[locale]/(public)/contact/_components/ContactForm.tsx` ('use client'): React Hook Form + Zod, name/email/subject/message, success/error states, honeypot
- [x] T081 [US6] Create Contact page in `src/app/[locale]/(public)/contact/page.tsx`: church info (address, phone, email, office hours), GoogleMapEmbed for main location, ContactForm, generateMetadata()
- [x] T082 [US6] Add FR/PT/EN translations for contact in `src/messages/{fr,pt,en}.json`: contact namespace (page title, form labels, success/error messages, office hours)

**Checkpoint**: Contact page with all info, map embed, form submits to Cappuccino, "Get Directions" works.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: SEO, performance, accessibility, and final refinements across all stories

### SEO & Metadata

- [x] T083 [P] Create sitemap generator in `src/app/sitemap.ts`: MetadataRoute.Sitemap with all public pages in FR/PT/EN
- [x] T084 [P] Create robots.txt in `src/app/robots.ts`: MetadataRoute.Robots allowing all public pages
- [x] T085 [P] Create JSON-LD schemas in `src/lib/structured-data.ts`: Church, Event, Article, VideoObject schema.org helpers
- [x] T086 Ensure generateMetadata() with Open Graph tags on all pages (verify homepage, sermons, events, blog, about, contact)

### Performance

- [x] T087 [P] Add React Suspense boundaries with loading skeletons on listing pages: sermons/page.tsx, events/page.tsx, blog/page.tsx, community/groups/page.tsx
- [x] T088 [P] Ensure all images use next/image with responsive sizes, WebP, blur placeholder, lazy loading
- [x] T089 Verify Lighthouse score 90+ on homepage and key pages (sermons, events)

### Accessibility

- [x] T090 [P] Audit and add ARIA labels to all interactive elements: navigation, language switcher, forms, filters, share buttons
- [x] T091 [P] Verify heading hierarchy (h1-h6) across all pages for screen readers
- [x] T092 Verify keyboard navigation works on all interactive elements and forms

### Newsletter (Cross-cutting)

- [x] T093 [P] Create Zod validation schema in `src/lib/validations/newsletter.schema.ts`: newsletterSchema (email, locale, honeypot)
- [x] T094 [P] Create Server Action in `src/app/actions/newsletter.ts`: subscribeNewsletter() with duplicate check, Cappuccino insert to newsletter_subscribers
- [x] T095 Create newsletter signup component in `src/components/shared/NewsletterSignup.tsx` ('use client'): email input + locale, embed in Footer or dedicated section

### Final Validation

- [x] T096 Run `npm run build` — verify zero build errors
- [x] T097 Run `npm run lint` — verify zero lint errors
- [x] T098 Verify full language switching flow: FR → PT → EN on all pages (content, forms, navigation, metadata)
- [x] T099 Validate all forms submit correctly to Cappuccino collections (contact, event registration, group interest, newsletter)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Phase 2 completion
  - US1 + US2 (both P1) can proceed in parallel
  - US3 + US4 (both P2) can proceed in parallel after US1/US2 or alongside them
  - US5 + US6 (both P3) can proceed in parallel after higher priority stories
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Foundation only — no dependencies on other stories
- **US2 (P1)**: Foundation only — shares YouTubeEmbed (can be created in parallel)
- **US3 (P2)**: Foundation + GoogleMapEmbed + ShareButtons (created in US3, reused by US6)
- **US4 (P2)**: Foundation only — independent
- **US5 (P3)**: Foundation + ShareButtons (already created in US3)
- **US6 (P3)**: Foundation + GoogleMapEmbed (already created in US3) + ContactForm

### Within Each User Story

- Types/schemas before data fetching functions (already in Phase 2)
- Components before pages
- Server Actions before forms that use them
- Pages compose components last

### Parallel Opportunities

- **Phase 2**: All T007-T014 (types) in parallel, all T030-T035 (data fetching) in parallel, T022-T024 (translations) in parallel
- **Phase 3**: All 8 section components (T036-T043) in parallel, then homepage composition (T044)
- **Phase 4**: SermonCard + SermonFilters + YouTubeEmbed in parallel, then pages
- **Phase 5**: EventCard + EventFilters + EventRegistrationForm + GoogleMapEmbed + ShareButtons in parallel, then pages
- **Phase 6**: GroupCard + GroupFilters + JoinGroupForm in parallel, then pages
- **Phase 7**: ArticleCard + ArticleFilters in parallel, then pages
- **Phase 8**: ContactForm + validation in parallel, then page

---

## Parallel Example: Phase 2 (Foundation)

```
# All types can be created simultaneously:
T007: src/types/common.ts
T008: src/types/location.ts
T009: src/types/event.ts
T010: src/types/sermon.ts
T011: src/types/group.ts
T012: src/types/blog.ts
T013: src/types/leader.ts
T014: src/lib/constants/index.ts

# All data fetching functions simultaneously (after types):
T030: src/lib/data/locations.ts
T031: src/lib/data/leadership.ts
T032: src/lib/data/sermons.ts
T033: src/lib/data/events.ts
T034: src/lib/data/groups.ts
T035: src/lib/data/blog.ts

# All translation files simultaneously:
T022: src/messages/fr.json
T023: src/messages/pt.json
T024: src/messages/en.json
```

## Parallel Example: Phase 3 (US1 - Homepage)

```
# All 8 homepage sections simultaneously:
T036: HeroSection.tsx
T037: GatheringSection.tsx
T038: AboutSection.tsx
T039: TeamSection.tsx
T040: EventsPreviewSection.tsx
T041: SermonsPreviewSection.tsx
T042: CommunitySection.tsx
T043: BlogPreviewSection.tsx

# Then compose into homepage:
T044: src/app/[locale]/page.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (~15 min)
2. Complete Phase 2: Foundation (types, i18n, layout, data fetching)
3. Complete Phase 3: US1 — Homepage + About + Leadership
4. **STOP and VALIDATE**: Homepage renders 8 sections, language switching works, service times visible
5. Deploy to Vercel preview

### Incremental Delivery

1. Setup + Foundation → Framework ready
2. US1 (Homepage + About) → **MVP Deploy** — visitors can discover the church
3. US2 (Sermons) → Deploy — members can watch sermon archive
4. US3 (Events) → Deploy — users can discover and register for events
5. US4 (Groups) → Deploy — members can find and join community groups
6. US5 (Blog) → Deploy — users can read articles
7. US6 (Contact) → Deploy — users can contact the church
8. Polish → Final launch

### Parallel Team Strategy

With 2 developers:
1. Both complete Setup + Foundation
2. Dev A: US1 (Homepage) → US3 (Events) → US5 (Blog) → Polish SEO
3. Dev B: US2 (Sermons) → US4 (Groups) → US6 (Contact) → Polish A11y

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All components are Server Components unless marked ('use client')
- Types in `src/types/`, NOT inside feature UI directories (Constitution Principle VI)
