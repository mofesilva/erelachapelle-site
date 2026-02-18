# Implementation Plan: Igreja Cévennes Multilingual Website (MVP)

**Branch**: `001-church-website` | **Date**: 2026-02-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-church-website/spec.md`

## Summary

Site institucional multilíngue (FR/PT/EN) para a Igreja Cévennes usando Next.js 16 com App Router e Server Components. O MVP (Fase 1) inclui homepage com 8 seções, arquivo de sermões com YouTube, sistema de eventos com Google Maps, grupos comunitários, blog, e páginas institucionais. Dados servidos via Cappuccino Cloud (MongoDB), estilização com Tailwind CSS 4 e shadcn/ui, i18n com next-intl.

## Technical Context

**Language/Version**: TypeScript 5+ / Node.js 18.17+  
**Framework/Version**: Next.js 16.1.4 (App Router) / React 19.2.3  
**Primary Dependencies**: next-intl, @cappuccino/web-sdk, shadcn/ui, react-hook-form, zod, date-fns, lucide-react  
**Storage**: Cappuccino Cloud (MongoDB) via @cappuccino/web-sdk  
**Styling**: Tailwind CSS 4+ com @tailwindcss/postcss  
**Testing**: NEEDS CLARIFICATION (Vitest mencionado nos docs mas não instalado)  
**Target Platform**: Web (Vercel deployment, CDN global)  
**Project Type**: Web application (Next.js fullstack)  
**Performance Goals**: Lighthouse 90+, LCP < 2.5s, FID < 100ms, CLS < 0.1, FCP < 1.5s em 3G  
**Constraints**: Mobile-first (320px-4K), 500 concurrent users, <2s page response  
**Scale/Scope**: ~15 páginas/rotas, 500-2000 monthly visitors, 3 localizações, 3 idiomas, 500+ sermões

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | KISS (Prioridade #1) | ✅ PASS | CRUD simples, sem abstrações desnecessárias. Cappuccino Client é a camada de dados direta. |
| II | DRY | ✅ PASS | Componentes compartilhados em `components/shared/`, hooks reutilizáveis em `hooks/`, validações em `lib/validations/` |
| III | SOLID (Pragmático) | ✅ PASS | SRP em componentes (EventCard só renderiza), DI via hooks/clients, ISP com Props específicas |
| IV | Clean Code Pragmático | ✅ PASS | Naming: `{Feature}{Type}`, hooks: `use{Action}{Entity}`, funções: `{verb}{Object}`. Max 20-30 linhas por função |
| V | Clean Architecture Pragmática | ✅ PASS | 4 camadas: Presentation → Application → Infrastructure → Domain. Sem camadas extras para CRUDs. |
| VI | Feature-Based Organization | ✅ PASS | UI features em `app/[locale]/(public)/`. Types em `types/`, hooks em `hooks/`, validations em `lib/validations/`, actions em `app/actions/`. Types NÃO no diretório da feature UI. |
| VII | Server-First (NON-NEGOTIABLE) | ✅ PASS | Server Components padrão. `'use client'` apenas para: filtros interativos, formulários, player YouTube, language switcher |
| VIII | Multilingual-Native | ✅ PASS | FR/PT/EN via next-intl. Roteamento `[locale]`. Conteúdo DB: `{ fr, pt, en }`. FR como padrão. |
| IX | Design System Consistente | ✅ PASS | Borgonha (#722F37), Playfair Display + Inter, grid 12 colunas 40/60, decorativos (◆────◆) |
| X | Performance First | ✅ PASS | Server Components, next/image, lazy loading, paginação em sermões (500+), React Suspense |

**Gate Result**: ✅ ALL PASSED — Proceed to Phase 0

**Post-Design Re-check (Phase 1)**: ✅ ALL STILL PASS
- Data model uses direct Cappuccino Collections (KISS ✅)
- Shared types in `types/`, validations in `lib/validations/` (DRY ✅, Feature-Based ✅)
- Server Actions pattern is simple (no extra layers, no repositories) (Clean Architecture ✅)
- Data fetching via `unstable_cache` in Server Components (Server-First ✅, Performance ✅)
- All entities use `MultilingualText { fr, pt, en }` (Multilingual-Native ✅)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx                  # Homepage (8 seções)
│   │   ├── (public)/
│   │   │   ├── events/
│   │   │   │   ├── page.tsx          # Events listing
│   │   │   │   ├── [id]/page.tsx     # Event detail
│   │   │   │   └── _components/     # EventCard, EventFilters, EventRegistration
│   │   │   ├── sermons/
│   │   │   │   ├── page.tsx          # Sermons archive listing
│   │   │   │   ├── [slug]/page.tsx   # Sermon detail (YouTube player)
│   │   │   │   └── _components/     # SermonCard, SermonPlayer, SermonFilters
│   │   │   ├── community/
│   │   │   │   ├── page.tsx          # Community overview
│   │   │   │   ├── groups/
│   │   │   │   │   ├── page.tsx      # Groups directory
│   │   │   │   │   └── [id]/page.tsx # Group detail
│   │   │   │   └── _components/     # GroupCard, JoinGroupForm
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx          # Blog listing
│   │   │   │   ├── [slug]/page.tsx   # Article detail
│   │   │   │   └── _components/     # ArticleCard, ArticleFilters
│   │   │   ├── about/
│   │   │   │   └── page.tsx          # About (mission, vision, history, faith)
│   │   │   └── contact/
│   │   │       ├── page.tsx          # Contact + map
│   │   │       └── _components/     # ContactForm, MapEmbed
│   │   └── (backoffice)/             # Phase 2 (placeholder)
│   ├── actions/
│   │   ├── events.ts                 # Event registration Server Action
│   │   ├── contact.ts                # Contact form Server Action
│   │   ├── groups.ts                 # Group interest Server Action
│   │   └── newsletter.ts            # Newsletter subscription Server Action
│   ├── api/                          # API Routes (if needed)
│   └── globals.css                   # Global styles + design tokens
├── components/
│   ├── ui/                           # shadcn/ui base (Button, Card, Input, etc.)
│   ├── shared/                       # Cross-feature (SectionLabel, YouTubeEmbed, GoogleMap, ShareButtons)
│   ├── layout/                       # Header, Footer, Navigation, LanguageSwitcher
│   └── sections/                     # Homepage sections (Hero, Gathering, About, Team, Events, Blog, etc.)
├── hooks/
│   ├── use-events.ts                 # Event fetching/filtering
│   ├── use-sermons.ts                # Sermon fetching/search
│   ├── use-groups.ts                 # Group fetching/filtering
│   └── use-locale.ts                 # i18n helpers
├── lib/
│   ├── cappuccino.ts                 # Cappuccino SDK client setup
│   ├── utils.ts                      # Utility functions (cn, formatDate, etc.)
│   ├── constants/                    # App constants (EVENT_TYPES, GROUP_TYPES, LOCALES)
│   ├── validations/
│   │   ├── event.schema.ts           # Event registration Zod schema
│   │   ├── contact.schema.ts         # Contact form Zod schema
│   │   └── group.schema.ts           # Group interest Zod schema
│   └── integrations/
│       ├── youtube.ts                # YouTube API helpers
│       └── maps.ts                   # Google Maps helpers
├── types/
│   ├── event.ts                      # Event, EventFilter types
│   ├── sermon.ts                     # Sermon, SermonFilter, SermonSeries types
│   ├── group.ts                      # CommunityGroup types
│   ├── blog.ts                       # BlogArticle types
│   ├── location.ts                   # Location types
│   ├── leader.ts                     # LeadershipMember types
│   └── common.ts                     # Multilingual, Pagination, SEOMeta shared types
├── messages/
│   ├── fr.json                       # French translations (default)
│   ├── pt.json                       # Portuguese translations
│   └── en.json                       # English translations
└── middleware.ts                      # next-intl locale detection/redirect

public/
├── images/                           # Static images
├── icons/                            # Favicons
└── logos/                            # Church logos
```

**Structure Decision**: Next.js App Router com Feature-Based UI organization. Features de UI em `app/[locale]/(public)/` com `_components/` privados. Outras camadas (types, hooks, validations, actions) são feature-based dentro de seus próprios diretórios em `src/`. Conforme Constitution Principle VI.

## Complexity Tracking

> No Constitution violations detected. All principles pass without justification needed.
