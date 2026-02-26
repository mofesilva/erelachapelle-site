# 13 — SEO & Metadata

## Metadata Architecture

### Root Layout (`src/app/layout.tsx`)

Sets base metadata used when no page overrides:

```typescript
export const metadata: Metadata = {
  title: "Église Réformée Évangélique La Chapelle",
  description: "Communauté chrétienne dans les Cévennes",
};
```

### Locale Layout (`src/app/[locale]/layout.tsx`)

Extends with template and Open Graph:

```typescript
export const metadata: Metadata = {
  title: {
    default: "Église Réformée Évangélique La Chapelle",
    template: "%s | Église Réformée Évangélique La Chapelle",
  },
  description: "Communauté chrétienne dans les Cévennes",
  metadataBase: new URL("https://erelachapelle.fr"),
  openGraph: {
    type: "website",
    siteName: "Église Réformée Évangélique La Chapelle",
    locale: "fr_FR",
    alternateLocale: ["pt_BR", "en_US"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
```

**Title template:** Child pages set their own `title` strings (e.g., "Contact"), which are inserted into the template: `"Contact | Église Réformée Évangélique La Chapelle"`.

### Page-Level Metadata

Each page defines `generateMetadata()` using translated strings:

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("homepage.hero");
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
    },
  };
}
```

---

## Robots.txt

**File:** `src/app/robots.ts`

Generated at build time:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://erelachapelle.fr/sitemap.xml
```

---

## Sitemap

**File:** `src/app/sitemap.ts`

Dynamically generated sitemap covering all pages in all 3 locales.

### Static Pages

| Path | Priority | Change Frequency |
|------|----------|-----------------|
| `/[locale]` (homepage) | 1.0 | weekly |
| `/[locale]/about` | 0.8 | monthly |
| `/[locale]/sermons` | 0.9 | weekly |
| `/[locale]/events` | 0.9 | weekly |
| `/[locale]/community` | 0.7 | monthly |
| `/[locale]/community/groups` | 0.7 | monthly |
| `/[locale]/blog` | 0.8 | weekly |
| `/[locale]/contact` | 0.7 | monthly |

### Dynamic Pages

| Content Type | Priority | Change Frequency | URL Pattern |
|-------------|----------|-----------------|-------------|
| Sermons | 0.6 | monthly | `/[locale]/sermons/[slug]` |
| Events | 0.7 | weekly | `/[locale]/events/[slug]` |
| Blog Articles | 0.6 | monthly | `/[locale]/blog/[slug]` |
| Community Groups | 0.5 | monthly | `/[locale]/community/groups/[id]` |

### Entry Count
For each content item, 3 entries are created (one per locale). With current data:
- Static: 8 pages × 3 locales = 24 entries
- Sermons: 4 × 3 = 12 entries
- Events: 4 × 3 = 12 entries
- Articles: 2 × 3 = 6 entries
- Groups: 4 × 3 = 12 entries
- **Total: 66 sitemap entries**

---

## JSON-LD Structured Data

See [12-integrations.md](./12-integrations.md#structured-data-json-ld) for full details.

| Page | Schema Type | Function |
|------|-----------|----------|
| Homepage | `Church` | `churchJsonLd(locations)` |
| Event detail | `Event` | `eventJsonLd(event, locale)` |
| Blog detail | `Article` | `articleJsonLd(article, locale)` |
| Sermon detail | `VideoObject` | `videoJsonLd(sermon, locale)` |

---

## Open Graph

Set at the locale layout level:
- `og:type` = `"website"`
- `og:site_name` = `"Église Réformée Évangélique La Chapelle"`
- `og:locale` = `"fr_FR"`
- `og:alternate_locale` = `["pt_BR", "en_US"]`

Child pages can override `og:title` and `og:description` in their `generateMetadata()`.

---

## HTML `lang` Attribute

Set dynamically on the `<html>` element in the locale layout:

```tsx
<html lang={locale}>
```

This ensures correct language identification for search engines and screen readers.
