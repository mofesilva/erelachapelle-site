# 11 — Public Pages

All public pages are located under `src/app/[locale]/(public)/`. The `(public)` route group has no URL effect — it's purely organizational.

Each page follows a common pattern:
1. **`generateMetadata()`** — async function for SEO metadata.
2. **Server Component** default export — fetches data, resolves locale, renders content.
3. **`_components/`** subfolder — page-specific components (cards, filters, forms).

---

## About Page

**Route:** `/[locale]/about`  
**File:** `src/app/[locale]/(public)/about/page.tsx`

### Sections (in order)

| Section | Background | Content |
|---------|-----------|---------|
| Title banner | `bg-primary` | Page title |
| Mission | White | Mission statement |
| Vision | `bg-muted/50` | Vision text |
| History | White | Church history |
| Values | `bg-muted/50` | Core values |
| Faith | White | Faith declaration |
| Leadership | `bg-muted/50` | Team member cards |

### Leadership Team Display
Renders `getLeadershipTeam()` results using shadcn `Card` components. Each card shows:
- Photo (or initials placeholder via `TeamMemberCard`)
- Name, localized role, localized bio, email link, ministry area badges.

### Additional Files
- `AboutPageContent.tsx` — Alternative content component (exists but the main page renders inline).
- `_components/TeamSection.tsx` — Team section component.

---

## Blog Pages

### Blog List

**Route:** `/[locale]/blog`  
**File:** `src/app/[locale]/(public)/blog/page.tsx`

- Header banner with page title.
- `ArticleFilters` component for category filtering.
- Grid of `ArticleCard` components (responsive: 1–3 columns).
- Empty state when no articles match.

### Blog Detail

**Route:** `/[locale]/blog/[slug]`  
**File:** `src/app/[locale]/(public)/blog/[slug]/page.tsx`

- Fetches article by slug via `getArticleBySlug()`.
- Returns `notFound()` if not found.
- Injects `articleJsonLd` structured data.
- Shows featured image (or gradient placeholder), date, author, categories.
- Full article content.
- `ShareButtons` for social sharing.

### Blog Components

| Component | File | Description |
|-----------|------|-------------|
| `ArticleCard` | `_components/ArticleCard.tsx` | Card with image, date, title, excerpt, category badges |
| `ArticleFilters` | `_components/ArticleFilters.tsx` | Client-side category filter (updates URL search params) |

---

## Sermons Pages

### Sermons List

**Route:** `/[locale]/sermons`  
**File:** `src/app/[locale]/(public)/sermons/page.tsx`

- Header banner.
- `SermonFilters` for filtering by preacher and series.
- Grid of sermon cards.
- Empty state.

### Sermon Detail

**Route:** `/[locale]/sermons/[slug]`  
**File:** `src/app/[locale]/(public)/sermons/[slug]/page.tsx`

- Fetches by slug.
- Injects `videoJsonLd` structured data.
- `YouTubeEmbed` component for the video.
- Sermon metadata: date, preacher, series, biblical reference.
- `ShareButtons`.

### Sermon Components

| Component | File | Description |
|-----------|------|-------------|
| `SermonCard` | `_components/SermonCard.tsx` | YouTube thumbnail card with play overlay |
| `SermonFilters` | `_components/SermonFilters.tsx` | Client-side filters (preacher, series) |

---

## Events Pages

### Events List

**Route:** `/[locale]/events`  
**File:** `src/app/[locale]/(public)/events/page.tsx`

- Header banner.
- `EventFilters` for type and location filtering.
- Grid of event cards.
- Empty state.

### Event Detail

**Route:** `/[locale]/events/[slug]`  
**File:** `src/app/[locale]/(public)/events/[slug]/page.tsx`

- Fetches by slug.
- Injects `eventJsonLd` structured data.
- Event info: date/time, type, location, description.
- `GoogleMapEmbed` if location has coordinates.
- `EventRegistrationForm` if `registrationEnabled` is true.
- `ShareButtons`.

### Event Components

| Component | File | Description |
|-----------|------|-------------|
| `EventCard` | `_components/EventCard.tsx` | Date-prominent card with type badge |
| `EventFilters` | `_components/EventFilters.tsx` | Client-side filters (event type, location) |
| `EventRegistrationForm` | `_components/EventRegistrationForm.tsx` | Registration form using React Hook Form + `registerForEvent` action |

---

## Community Pages

### Community Landing

**Route:** `/[locale]/community`  
**File:** `src/app/[locale]/(public)/community/page.tsx`

Redirects to or renders the community overview. Links to the groups subpage.

### Groups List

**Route:** `/[locale]/community/groups`  
**File:** `src/app/[locale]/(public)/community/groups/page.tsx`

- Header banner.
- `GroupFilters` for group type filtering.
- Grid of `GroupCard` components.
- Empty state.

### Group Detail

**Route:** `/[locale]/community/groups/[id]`  
**File:** `src/app/[locale]/(public)/community/groups/[id]/page.tsx`

- Fetches by `_id` via `getGroupById()`.
- Group info: type, meeting day/time, leader, location.
- `JoinGroupForm` for expressing interest.

### Community Components

| Component | File | Description |
|-----------|------|-------------|
| `GroupCard` | `_components/GroupCard.tsx` | Group card with type, schedule, leader info |
| `GroupFilters` | `_components/GroupFilters.tsx` | Client-side type filter |
| `JoinGroupForm` | `_components/JoinGroupForm.tsx` | Interest form using `submitGroupInterest` action |

---

## Contact Page

**Route:** `/[locale]/contact`  
**File:** `src/app/[locale]/(public)/contact/page.tsx`

### Layout
Two-column layout:
1. **Left:** `ContactForm` component.
2. **Right:** Location details (address, phone, email, map embed).

### Contact Components

| Component | File | Description |
|-----------|------|-------------|
| `ContactForm` | `_components/ContactForm.tsx` | React Hook Form + `submitContactForm` action, with honeypot |

---

## Common Page Patterns

### Header Banner
Every page starts with a colored banner:
```jsx
<section className="bg-primary py-20 text-primary-foreground">
  <div className="mx-auto max-w-7xl px-4 text-center">
    <h1 className="font-serif text-4xl font-bold md:text-5xl">{title}</h1>
  </div>
</section>
```

### Filter Pattern
All list pages use a client-side filter component that:
1. Reads search params from the URL.
2. Renders filter buttons/selects.
3. Updates URL search params on change (no page reload).
4. The parent server component reads the params and passes filtered data.

### Detail Page Pattern
```typescript
const entity = getEntityBySlug(slug);
if (!entity) notFound();
// Render with structured data, content, share buttons
```

### Metadata Pattern
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("namespace");
  return {
    title: t("title"),
    description: t("description"),
  };
}
```
