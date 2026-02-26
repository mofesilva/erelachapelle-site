# 09 — Layout Components

Layout components live in `src/app/[locale]/_components/` and provide the site-wide chrome: header navigation, mobile menu, language switching, and footer.

---

## Header

**File:** `src/app/[locale]/_components/Header.tsx`  
**Type:** Client Component (`"use client"`)  
**Purpose:** Fixed top navigation bar that changes appearance on scroll.

### Behavior

1. **Transparent → Solid:** The header starts with `bg-transparent` and transitions to `bg-rich-mahogany` after scrolling 50px.
2. **Height transition:** Shrinks from `h-24` (96px) to `h-16` (64px) on scroll.
3. **Logo scaling:** Logo shrinks from `h-14 md:h-20` to `h-8 md:h-10`.
4. **Desktop nav:** Hidden on mobile (`hidden md:flex`). Shows all 7 nav items.
5. **Mobile hamburger:** Visible only on mobile (`md:hidden`). Opens the `MobileMenu`.

### Nav Items

```
home → /[locale]
about → /[locale]/about
sermons → /[locale]/sermons
events → /[locale]/events
community → /[locale]/community/groups
blog → /[locale]/blog
contact → /[locale]/contact
```

Note: "community" links to `/community/groups` directly (not `/community`).

### State

| State | Type | Purpose |
|-------|------|---------|
| `open` | `boolean` | Controls `MobileMenu` visibility |
| `scrolled` | `boolean` | Toggles solid header background |

The scroll listener uses `{ passive: true }` for performance.

### Sub-components Used
- `LanguageSwitcher` (variant `"light"`)
- `MobileMenu`
- Lucide `Menu` icon

---

## MobileMenu

**File:** `src/app/[locale]/_components/MobileMenu.tsx`  
**Type:** Client Component (`"use client"`)  
**Purpose:** Full-screen overlay slide-in menu for mobile navigation.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Whether menu is visible |
| `onClose` | `() → void` | Close callback |
| `locale` | `string` | Current locale for building links |
| `navItems` | `readonly string[]` | Navigation item keys |
| `labels` | `Record<string, string>` | Translated labels for each nav item |

### Key Implementation Details

1. **Portal rendering:** Uses `createPortal(…, document.body)` to render outside the DOM hierarchy.
2. **Animation:** CSS `transform: translateX(100%)` → `translateX(0)` with 500ms cubic-bezier easing.
3. **Staggered link animation:** Each nav link has a cascading entrance delay: `150 + i * 60` ms.
4. **Scroll lock:** Sets `document.body.style.overflow = "hidden"` while open.
5. **Mount/unmount:** Uses `mounted` and `visible` states for proper CSS transition lifecycle.
6. **Inline styles:** Uses inline `style` objects instead of Tailwind to avoid SSR hydration issues with the portal.

### Visual Design
- Full-screen `rich-mahogany` background.
- White horizontal logo at top.
- Decorative gold diamond accent line.
- Large uppercase gold (`toffee-brown`) navigation links.
- `LanguageSwitcher` at the bottom.
- `X` close button in top right.

---

## LanguageSwitcher

**File:** `src/app/[locale]/_components/LanguageSwitcher.tsx`  
**Type:** Client Component (`"use client"`)  
**Purpose:** Horizontal FR / PT / EN toggle buttons.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "light"` | `"default"` | Color scheme |

### Variants

| Variant | Active | Inactive |
|---------|--------|----------|
| `default` | `text-primary` | `text-muted-foreground` → hover `text-foreground` |
| `light` | `text-white` | `text-white/60` → hover `text-white` |

### Behavior
1. Reads `useLocale()` for current locale.
2. Reads `usePathname()` to get the current URL.
3. On click, replaces the locale segment in the path and calls `router.push()`.

Example: clicking "PT" on `/fr/events/culte-special` navigates to `/pt/events/culte-special`.

---

## Footer

**File:** `src/app/[locale]/_components/Footer.tsx`  
**Type:** Server Component (async)  
**Purpose:** Site footer with navigation links, location info, newsletter signup, and copyright.

### Layout (4-column grid on desktop)

| Column | Content |
|--------|---------|
| 1. Brand | Church name + description from `SITE_CONFIG` |
| 2. Navigation | Links to About, Sermons, Events, Contact |
| 3. Locations | List from `SITE_CONFIG.locations` (currently "Saint-Hippolyte") |
| 4. Newsletter | Title + `NewsletterSignup` form component |

### Footer Bottom
Centered copyright: `© {year} Église Réformée Évangélique La Chapelle`

### Dependencies
- `getTranslations("navigation")` — nav link labels
- `getTranslations("newsletter")` — newsletter section title
- `getLocale()` — locale-prefixed links
- `SITE_CONFIG` from constants
- `NewsletterSignup` client component

---

## Component Hierarchy

```
LocaleLayout
├── Header (client)
│   ├── Logo (Image)
│   ├── Desktop Nav (7 links)
│   ├── LanguageSwitcher (client, variant="light")
│   └── Hamburger button → opens MobileMenu
│
├── MobileMenu (client, portal)
│   ├── Close button (X)
│   ├── Logo (Image)
│   ├── Decorative divider
│   ├── Nav links (7, staggered animation)
│   └── LanguageSwitcher (client, variant="light")
│
├── <main> (page content)
│
└── Footer (server)
    ├── Brand column
    ├── Navigation column
    ├── Locations column
    ├── Newsletter column
    │   └── NewsletterSignup (client)
    └── Copyright bar
```
