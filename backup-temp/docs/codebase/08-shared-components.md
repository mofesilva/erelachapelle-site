# 08 — Shared Components

All shared (cross-page) components live in `src/_components/`. They are stateless server components unless noted otherwise.

> Note: shadcn/ui primitives (`badge`, `button`, `card`, `form`, `input`, `label`, `separator`, `sheet`, `textarea`) are in `src/_components/ui/` and follow standard shadcn/ui conventions. They are not documented individually here.

---

## SplitButton

**File:** `src/_components/SplitButton.tsx`  
**Type:** Server Component  
**Purpose:** Two-tone CTA button with text on the left and an arrow icon on the right. Used as the primary call-to-action throughout the site.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | Required | Link destination |
| `children` | `ReactNode` | Required | Button label text |
| `variant` | `"gold" \| "burgundy" \| "white"` | `"gold"` | Color variant |
| `external` | `boolean` | `false` | Opens in new tab when true |

### Variants

| Variant | Main Color | Arrow Color | Text |
|---------|-----------|-------------|------|
| `gold` | `bg-toffee-brown` | `bg-olive-wood` | white |
| `burgundy` | `bg-night-bordeaux-2` | `bg-night-bordeaux` | white |
| `white` | `bg-white` | `bg-white/80` | rich-mahogany |

### Behavior
- Renders as a Next.js `<Link>` component.
- Hover: slight upward translate, shadow increase, color shift.
- Uses `group/btn` for coordinated hover effects.

---

## CrossDivider

**File:** `src/_components/CrossDivider.tsx`  
**Type:** Server Component  
**Purpose:** Decorative divider with a cross symbol (`✟`) between two horizontal lines.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"gold" \| "white" \| "black" \| "burgundy"` | `"white"` | Color variant |
| `className` | `string?` | — | Additional CSS classes |

Used in `HeroSection` and `FaithStatementSection`.

---

## DiamondDivider

**File:** `src/_components/DiamondDivider.tsx`  
**Type:** Server Component  
**Purpose:** Decorative divider with a diamond symbol (`◆`) between two horizontal lines.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"gold" \| "white" \| "black" \| "burgundy"` | `"gold"` | Color variant |
| `className` | `string?` | — | Additional CSS classes |

---

## SectionLabel

**File:** `src/_components/SectionLabel.tsx`  
**Type:** Server Component  
**Purpose:** Centered section header with diamond symbols and gradient lines: `◆—— Label ——◆`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Label text (usually translated) |
| `className` | `string?` | — | Additional CSS classes |

The label text is styled as uppercase, 10px, bold, with wide letter spacing. Used in `SermonsPreviewSection`, `AboutSection`, and various pages.

---

## DiamondPatternBackground

**File:** `src/_components/DiamondPatternBackground.tsx`  
**Type:** Server Component  
**Purpose:** Full-area SVG pattern overlay at 3% opacity, creating a subtle cross-pattern texture.

No props. Renders an absolutely positioned `<div>` with an inline SVG `backgroundImage`.

---

## NewsletterSignup

**File:** `src/_components/NewsletterSignup.tsx`  
**Type:** Client Component (`"use client"`)  
**Purpose:** Email subscription form for the newsletter, rendered in the footer.

### Behavior
1. Uses `useActionState` with the `subscribeNewsletter` server action.
2. Includes a hidden honeypot field.
3. Shows a success message after subscription.
4. Sends the current `locale` as a hidden field.
5. Uses a `Mail` icon in the email input.

### Dependencies
- `subscribeNewsletter` server action
- `useTranslations("newsletter")` for i18n
- shadcn/ui `Button` and `Input`

---

## GoogleMapEmbed

**File:** `src/_components/GoogleMapEmbed.tsx`  
**Type:** Server Component  
**Purpose:** Google Maps embed iframe with a directions link.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `address` | `string` | Required | Address to search on map |
| `coordinates` | `Coordinates` | Required | `{ lat, lng }` for directions URL |
| `directionsLabel` | `string` | `"Itinéraire"` | Link text |

Renders a 16:9 aspect ratio iframe and an `<a>` link to Google Maps directions.

---

## ShareButtons

**File:** `src/_components/ShareButtons.tsx`  
**Type:** Client Component (`"use client"`)  
**Purpose:** Social sharing buttons for Facebook, WhatsApp, and Email.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `url` | `string` | URL to share |
| `title` | `string` | Title/subject for the share |

Renders circular 32px buttons with platform icons. Used on blog article and sermon detail pages.

---

## TeamMemberCard

**File:** `src/_components/TeamMemberCard.tsx`  
**Type:** Server Component  
**Purpose:** Card displaying a leadership team member with photo (or initials fallback), name, role, and bio.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `photo` | `string?` | — | Photo URL |
| `name` | `string` | Required | Full name |
| `role` | `string` | Required | Role/title (localized) |
| `bio` | `string` | Required | Biography (localized) |
| `className` | `string?` | — | Additional CSS classes |

When no photo is provided, shows initials derived from the name in a primary-colored circle.

---

## YouTubeEmbed

**File:** `src/_components/YouTubeEmbed.tsx`  
**Type:** Server Component  
**Purpose:** Privacy-friendly YouTube embed using `youtube-nocookie.com`.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `videoId` | `string` | YouTube video ID |
| `title` | `string` | iframe title for accessibility |

Renders a 16:9 aspect ratio iframe with lazy loading and `no-referrer-when-downgrade` policy.

---

## shadcn/ui Components (`src/_components/ui/`)

Standard shadcn/ui components (New York style) used throughout:

| Component | File | Usage |
|-----------|------|-------|
| `Badge` | `badge.tsx` | Event type badges, category labels |
| `Button` | `button.tsx` | Form submit buttons, CTAs |
| `Card` | `card.tsx` | Content containers (about page, detail pages) |
| `Form` | `form.tsx` | React Hook Form integration wrapper |
| `Input` | `input.tsx` | Text inputs in forms |
| `Label` | `label.tsx` | Form field labels |
| `Separator` | `separator.tsx` | Visual dividers |
| `Sheet` | `sheet.tsx` | Slide-over panels (available but not currently in use) |
| `Textarea` | `textarea.tsx` | Multi-line text inputs (contact form) |
