# Codebase Documentation — Église Réformée Évangélique La Chapelle

> Complete technical documentation for the `erelachapelle-site` codebase.
> Auto-generated on 2026-02-26.

---

## Table of Contents

| # | Document | Description |
|---|----------|-------------|
| 1 | [Getting Started](./01-getting-started.md) | Prerequisites, installation, environment variables, dev/build commands |
| 2 | [Architecture Overview](./02-architecture.md) | Tech stack, project structure, design decisions, architectural layers |
| 3 | [Routing & Internationalization](./03-routing-i18n.md) | Next.js App Router layout, `next-intl` setup, locale handling, middleware |
| 4 | [Design System & Tokens](./04-design-system-tokens.md) | Color palette, typography, CSS custom properties, Tailwind theme, utility classes |
| 5 | [Type System](./05-type-system.md) | All TypeScript interfaces & enums (`src/types/`) |
| 6 | [Data Layer](./06-data-layer.md) | Static data modules (`src/lib/data/`), query/filter functions |
| 7 | [Server Actions & Validation](./07-server-actions.md) | Form actions, Zod schemas, honeypot anti-spam pattern |
| 8 | [Shared Components](./08-shared-components.md) | Reusable UI primitives in `src/_components/` |
| 9 | [Layout Components](./09-layout-components.md) | Header, Footer, MobileMenu, LanguageSwitcher |
| 10 | [Homepage Sections](./10-homepage-sections.md) | HeroSection, FaithStatement, Gathering, Community, Events, Blog, Sermons |
| 11 | [Public Pages](./11-public-pages.md) | About, Blog, Sermons, Events, Community, Contact — list & detail pages |
| 12 | [Integrations](./12-integrations.md) | Google Maps, YouTube, Cappuccino SDK, structured data (JSON-LD) |
| 13 | [SEO & Metadata](./13-seo-metadata.md) | Sitemap, robots.txt, Open Graph, JSON-LD structured data |
| 14 | [Utilities](./14-utilities.md) | `cn()`, date formatting, `getLocalizedContent()`, `slugify()` |

---

## Quick Reference

- **Framework**: Next.js 16.1 (App Router, React 19, React Compiler)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style)
- **i18n**: `next-intl` 4.8 — French (default), Portuguese, English
- **Forms**: React Hook Form 7 + Zod 4 validation
- **Icons**: Lucide React + Solar Icon Set
- **Data**: Static in-memory data (Phase 1) — planned migration to Cappuccino Cloud API
- **Deployment target**: `https://erelachapelle.fr`
