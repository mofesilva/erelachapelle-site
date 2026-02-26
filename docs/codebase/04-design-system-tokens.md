# 04 — Design System & Tokens

## Overview

The design system uses a church-inspired visual identity with burgundy, gold, and parchment tones. All tokens are defined as CSS custom properties in `src/app/globals.css` and mapped to Tailwind CSS 4 theme classes via `@theme inline`.

## Color Palette

### Base Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|---------------|-------|
| `--carbon-black` | `#171717` | `bg-carbon-black`, `text-carbon-black` | Body text, dark backgrounds |
| `--rich-mahogany` | `#3D0008` | `bg-rich-mahogany`, `text-rich-mahogany` | Deep accents, overlays |
| `--night-bordeaux` | `#520014` | `bg-night-bordeaux`, `text-night-bordeaux` | Dark burgundy |
| `--night-bordeaux-2` | `#660019` | `bg-night-bordeaux-2`, `text-night-bordeaux-2` | Primary brand color |
| `--coffee-bean` | `#76522E` | `bg-coffee-bean`, `text-coffee-bean` | Muted text |
| `--olive-wood` | `#845C33` | `bg-olive-wood`, `text-olive-wood` | Button hover states |
| `--toffee-brown` | `#936639` | `bg-toffee-brown`, `text-toffee-brown` | Gold accent, icons, dividers |
| `--powder-petal` | `#E2D4CB` | `bg-powder-petal`, `text-powder-petal` | Muted backgrounds |
| `--dust-grey` | `#E9DFD8` | `bg-dust-grey`, `text-dust-grey` | Borders, secondary backgrounds |
| `--parchment` | `#F9F4F1` | `bg-parchment`, `text-parchment` | Page background |
| `--scarlet-red` | `#EF4444` | `bg-scarlet-red`, `text-scarlet-red` | Destructive/error states |

### Semantic Aliases (shadcn/ui)

| Alias | Maps To | Usage |
|-------|---------|-------|
| `--background` | `--parchment` | Page background |
| `--foreground` | `--carbon-black` | Default text |
| `--primary` | `--night-bordeaux-2` | Primary buttons, headings |
| `--primary-foreground` | `--parchment` | Text on primary |
| `--secondary` | `--dust-grey` | Secondary surfaces |
| `--muted` | `--powder-petal` | Muted surfaces |
| `--muted-foreground` | `--coffee-bean` | Muted text |
| `--accent` | `--toffee-brown` | Accent elements |
| `--destructive` | `--scarlet-red` | Error states |
| `--border` | `--dust-grey` | Default borders |
| `--ring` | `--night-bordeaux` | Focus rings |

## Typography

### Fonts

| Font | Variable | Usage |
|------|----------|-------|
| **Noto Sans** | `--font-sans` | Body text, UI elements (weights 100–900) |
| **Libre Baskerville** | `--font-serif` | Headings, quotes, decorative text (400, 700, italic) |

Loaded via `next/font/google` in the locale layout. Applied with:
```css
body { font-family: var(--font-sans); }
.font-serif { font-family: var(--font-serif); }
```

### Typographic Scale (1.25 ratio)

**Mobile:**

| Element | Size | Line Height | Letter Spacing |
|---------|------|------------|----------------|
| `p` | 1rem (16px) | 1.5 | — |
| `h6` | 1.125rem (18px) | 1.45 | -0.005em |
| `h5` | 1.25rem (20px) | 1.4 | -0.0075em |
| `h4` | 1.5rem (24px) | 1.3 | -0.01em |
| `h3` | 1.75rem (28px) | 1.2 | -0.015em |
| `h2` | 2rem (32px) | 1.1 | -0.0175em |
| `h1` | 2.5rem (40px) | 1.0 | -0.02em |

**Desktop (≥768px):**

| Element | Size |
|---------|------|
| `h6` | 1.25rem (20px) |
| `h5` | 1.563rem (25px) |
| `h4` | 1.953rem (31px) |
| `h3` | 2.441rem (39px) |
| `h2` | 3.052rem (49px) |
| `h1` | 3.815rem (61px) |

## Border Radius

| Token | Value |
|-------|-------|
| `--radius` | `0.5rem` (8px) |
| `--radius-sm` | `calc(var(--radius) - 4px)` = 4px |
| `--radius-md` | `calc(var(--radius) - 2px)` = 6px |
| `--radius-lg` | `var(--radius)` = 8px |
| `--radius-xl` | `calc(var(--radius) + 4px)` = 12px |

## Custom Utility Classes

Defined in `@layer utilities` in `globals.css`:

| Class | Effect |
|-------|--------|
| `.transition-fast` | `all 200ms ease-in-out` — for links, buttons |
| `.transition-medium` | `all 250ms ease-in-out` — for simple cards |
| `.transition-smooth` | `all 300ms cubic-bezier(0.4, 0, 0.2, 1)` — for interactive cards |
| `.animate-bounce-3x` | Y-axis bounce animation (keyframe `bounce-3x`) |
| `.hover-elevation-sm` | Hover: `box-shadow: 0 8px 24px rgba(0,0,0,0.12)` |
| `.hover-elevation-md` | Hover: `box-shadow: 0 12px 32px rgba(0,0,0,0.16)` |
| `.hover-scale` | Hover: `transform: scale(1.02)` |

## Reduced Motion

All animations and transitions are disabled when `prefers-reduced-motion: reduce` is active:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .animate-bounce-3x { animation: none; }
}
```

## Decorative Patterns

The codebase uses several decorative elements consistent with the church theme:

| Element | Component | Symbol |
|---------|-----------|--------|
| Cross divider | `CrossDivider` | `✟` with horizontal lines |
| Diamond divider | `DiamondDivider` | `◆` with horizontal lines |
| Star separator | Inline | `✦` between lines |
| Diamond pattern | `DiamondPatternBackground` | SVG cross pattern at 3% opacity |

Each divider supports variants: `gold`, `white`, `black`, `burgundy`.

## shadcn/ui Configuration

Configured in `components.json`:
- **Style**: New York
- **RSC**: Enabled
- **CSS Variables**: Enabled
- **Base Color**: Neutral
- **Icon Library**: Lucide
- **Component alias**: `@/components` → `src/_components`
- **UI alias**: `@/components/ui` → `src/_components/ui`
