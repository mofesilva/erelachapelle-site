# 14 — Utilities

**File:** `src/lib/utils.ts`

Core utility functions used throughout the application.

---

## `cn(...inputs: ClassValue[]): string`

Combines multiple CSS class values using `clsx` and deduplicates Tailwind classes with `tailwind-merge`.

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage:**
```tsx
<div className={cn("bg-primary p-4", isActive && "bg-accent", className)} />
```

This is the standard shadcn/ui pattern. `clsx` handles conditional classes and `twMerge` resolves Tailwind conflicts (e.g., `bg-primary bg-accent` → `bg-accent`).

---

## `formatDate(dateStr: string, locale?: Locale): string`

Formats an ISO date string into a localized long date.

```typescript
formatDate("2026-02-09", "fr")  // → "9 février 2026"
formatDate("2026-02-09", "pt")  // → "9 fevereiro 2026"
formatDate("2026-02-09", "en")  // → "9 February 2026"
```

Uses `date-fns/format` with locale-specific formatters (`fr`, `pt`, `enUS`).

**Format pattern:** `"d MMMM yyyy"`

---

## `formatDateTime(dateStr: string, locale?: Locale): string`

Formats an ISO datetime string into a localized date with time.

```typescript
formatDateTime("2026-03-15T10:30:00", "fr")  // → "15 mars 2026 à 10:30"
```

**Format pattern:** `"d MMMM yyyy 'à' HH:mm"`

---

## `getLocalizedContent(content: MultilingualText, locale: Locale): string`

Extracts the text for the given locale. Falls back to French if the requested locale is empty.

```typescript
const title = { fr: "Bonjour", pt: "Olá", en: "Hello" };

getLocalizedContent(title, "pt")  // → "Olá"
getLocalizedContent(title, "fr")  // → "Bonjour"
```

This is the primary localization utility for data-layer content (as opposed to `useTranslations()` which handles UI text).

---

## `slugify(text: string): string`

Converts a text string to a URL-safe slug.

```typescript
slugify("Retour sur notre retraite spirituelle")
// → "retour-sur-notre-retraite-spirituelle"

slugify("Événements à venir")
// → "evenements-a-venir"
```

**Algorithm:**
1. Lowercase.
2. NFD Unicode normalization (decomposes accented characters).
3. Strip combining diacritical marks (`\u0300-\u036f`).
4. Replace non-alphanumeric sequences with hyphens.
5. Trim leading/trailing hyphens.

---

## Date Locale Map

```typescript
const dateLocales = { fr, pt, en: enUS } as const;
```

Maps the app's locale codes to `date-fns` locale objects. Used by both `formatDate` and `formatDateTime`.

---

## Import Pattern

All utilities are imported from the `@/lib/utils` path alias:

```typescript
import { cn, formatDate, getLocalizedContent } from "@/lib/utils";
```
