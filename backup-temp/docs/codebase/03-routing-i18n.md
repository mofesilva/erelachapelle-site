# 03 — Routing & Internationalization

## Overview

The application uses **next-intl v4.8** for full internationalization with Next.js App Router. Every public URL is prefixed with a locale segment (`/fr`, `/pt`, `/en`).

## Supported Locales

| Locale | Language | Default? |
|--------|----------|----------|
| `fr` | French | Yes |
| `pt` | Portuguese | No |
| `en` | English | No |

Defined in `src/i18n/routing.ts`:

```typescript
export const routing = defineRouting({
  locales: ["fr", "pt", "en"],
  defaultLocale: "fr",
  localeDetection: false,   // No automatic detection — always starts at /fr
});
```

## Middleware

`src/middleware.ts` intercepts all non-asset requests and applies locale routing:

```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

**Behavior:**
- Requests to `/` are redirected to `/fr` (the default locale).
- Requests without a valid locale prefix are redirected.
- Static files (`/_next/`, `/api/`, files with extensions) are excluded.
- `localeDetection: false` means the browser's `Accept-Language` header is **not** used.

## Request Configuration

`src/i18n/request.ts` resolves the locale at the server level and loads the corresponding message file:

```typescript
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "fr" | "pt" | "en")) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

This is referenced by the Next.js config:
```typescript
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
```

## Locale Layout

`src/app/[locale]/layout.tsx` is the main locale-aware layout:

1. **Validates** the locale parameter — calls `notFound()` if invalid.
2. **Loads messages** via `getMessages()`.
3. **Wraps children** in `<NextIntlClientProvider>` so client components access translations.
4. **Sets** `<html lang={locale}>`.
5. **Renders** the `<Header />` and `<Footer />` around `<main>`.

## Root Page Redirect

`src/app/page.tsx` simply redirects to the default locale:

```typescript
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/constants";

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
```

## Translation Files

Located in `src/messages/`:

| File | Language |
|------|----------|
| `fr.json` | French (primary, most complete) |
| `pt.json` | Portuguese (Brazilian) |
| `en.json` | English |

### Key Namespaces

| Namespace | Usage |
|-----------|-------|
| `common` | Shared labels: readMore, seeAll, loading, error, submit, cancel, share, etc. |
| `navigation` | Nav items: home, about, sermons, events, community, blog, contact |
| `homepage.hero` | Hero section: title, subtitle, cta |
| `homepage.gathering` | Church location section |
| `homepage.faith` | Faith statement section |
| `homepage.events` | Events preview section |
| `homepage.sermons` | Sermons preview section |
| `homepage.community` | Community section |
| `homepage.blog` | Blog preview section |
| `events` | Events list/detail page |
| `events.types` | Event type labels (service, conference, youth, etc.) |
| `sermons` | Sermons list/detail page |
| `community` | Community/groups pages |
| `community.groups.types` | Group type labels |
| `community.groups.days` | Day-of-week labels |
| `blog` | Blog list/detail page |
| `blog.categories` | Article category labels |
| `about` | About page content |
| `contact` | Contact page + form |
| `forms.validation` | Form validation messages |
| `newsletter` | Newsletter signup |

## Using Translations

### In Server Components

```typescript
import { getTranslations, getLocale } from "next-intl/server";

const t = await getTranslations("homepage.hero");
const locale = await getLocale();

return <h1>{t("title")}</h1>;
```

### In Client Components

```typescript
"use client";
import { useTranslations, useLocale } from "next-intl";

const t = useTranslations("navigation");
const locale = useLocale();

return <span>{t("home")}</span>;
```

## Language Switching

The `LanguageSwitcher` component (`src/app/[locale]/_components/LanguageSwitcher.tsx`) handles locale changes:

1. Gets the current pathname via `usePathname()`.
2. Replaces the locale segment (index 1) in the URL path.
3. Navigates using `router.push()`.

This preserves the current page while switching languages (e.g., `/fr/events` → `/pt/events`).

## URL Structure

```
/                          → redirects to /fr
/fr                        → French homepage
/pt                        → Portuguese homepage
/en                        → English homepage
/fr/about                  → About page (French)
/fr/sermons                → Sermons list
/fr/sermons/:slug          → Sermon detail
/fr/events                 → Events list
/fr/events/:slug           → Event detail
/fr/community              → Community landing (redirects to groups)
/fr/community/groups       → Groups list
/fr/community/groups/:id   → Group detail
/fr/blog                   → Blog list
/fr/blog/:slug             → Article detail
/fr/contact                → Contact page
```
