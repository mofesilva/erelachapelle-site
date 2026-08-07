# Research: Igreja Cévennes Multilingual Website

**Date**: 2026-02-11 | **Phase**: 0 - Outline & Research

## R-001: Testing Framework

**Decision**: Vitest + React Testing Library

**Rationale**: Vitest é mencionado nos guidelines do projeto e é o padrão do Cappuccino SDK. Compatibilidade nativa com TypeScript, ESM, e tem performance superior ao Jest para projetos Vite/Next.js modernos.

**Alternatives Considered**:
- Jest: Mais maduro mas config mais pesada com TypeScript/ESM. Vitest é drop-in replacement.
- Playwright: Para E2E (complementar, não substituto). Pode ser adicionado depois.

**Action**: Instalar `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.

---

## R-002: Cappuccino SDK Integration Pattern

**Decision**: Usar `createCappuccinoClient` facade + `createCappuccinoServerClient` para SSR

**Rationale**: O SDK já oferece:
- **Server-side**: `createCappuccinoServerClient` com cookie-based auth para App Router SSR
- **Client-side**: `CappuccinoProvider` + `useAuth` + `useApiClient` hooks React
- **Collections**: `Collection<T>` com `find()`, `query`, `sort`, `limit`, converters
- **Media**: `MediaStorageModule` para upload de imagens
- Hidratação SSR → Client via `serializeAuthState`/`deserializeAuthState`

**Pattern para Server Components**:
```typescript
// lib/cappuccino.ts (server)
import { createCappuccinoServerClient } from '@cappuccino/web-sdk';
import { cookies } from 'next/headers';

export function getCappuccinoServer() {
  return createCappuccinoServerClient({
    baseUrl: process.env.CAPPUCCINO_API_URL!,
    apiKey: process.env.CAPPUCCINO_API_KEY!,
    cookies: cookies()
  });
}
```

**Pattern para Client Components**:
```typescript
// Wrapper CappuccinoProvider no layout com hidratação
// Componentes client usam useApiClient() do provider
```

**Alternatives Considered**:
- ApiClient direto: Mais verboso, sem hooks React, sem hidratação SSR automática
- fetch() nativo: Perderia tipagem, auth management, e refresh token do SDK

---

## R-003: next-intl Setup Strategy

**Decision**: next-intl com App Router, middleware routing, e messages JSON files

**Rationale**: next-intl é a lib recomendada nos guidelines. Suporte nativo ao App Router do Next.js 14+, routing baseado em `[locale]`, e Server Component rendering.

**Setup necessário**:
1. `npm install next-intl` 
2. `middleware.ts` com locale detection e redirect
3. `i18n.ts` config com `getRequestConfig`
4. `messages/fr.json`, `messages/pt.json`, `messages/en.json`
5. `app/[locale]/layout.tsx` com `NextIntlClientProvider`
6. `next.config.ts` com plugin next-intl (createNextIntlPlugin)

**Locales**: `fr` (default), `pt`, `en`

**Alternatives Considered**:
- next-translate: Menos ativo, menor comunidade
- i18next/react-i18next: Funciona mas não tem integração nativa com App Router/Server Components

---

## R-004: shadcn/ui Setup with Tailwind CSS 4

**Decision**: shadcn/ui CLI init com Tailwind CSS 4 (CSS-first config)

**Rationale**: shadcn/ui é mandatório na constitution. Tailwind CSS 4 já está instalado com `@tailwindcss/postcss`. shadcn/ui suporta Tailwind v4 com CSS variables.

**Setup necessário**:
1. `npx shadcn@latest init` (configura components.json, utils.ts, CSS variables)
2. Instalar componentes conforme necessário: `npx shadcn@latest add button card input form`
3. Dependências automáticas: `class-variance-authority`, `clsx`, `tailwind-merge`

**Design tokens a configurar no CSS**:
```css
:root {
  --primary: 345 52% 33%;     /* Borgonha #722F37 */
  --accent-marigold: 28 88% 67%;
  --accent-coral: 8 72% 66%;
  --accent-salmon: 5 80% 79%;
}
```

**Alternatives Considered**:
- Radix UI direto: shadcn já é construído sobre Radix, com melhor DX
- Headless UI: Menos componentes, comunidade menor no ecossistema Next.js

---

## R-005: YouTube Integration Strategy

**Decision**: YouTube IFrame Embed API (client-side) com metadados no Cappuccino DB

**Rationale**: Sermões referenciam vídeos do YouTube existentes. Não precisamos da YouTube Data API v3 para o MVP — os metadados (título, pregador, data, thumbnail) são armazenados no Cappuccino. O embed usa apenas o video ID.

**Pattern**:
```typescript
// Componente shared YouTubeEmbed (client component)
'use client'
function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
      allowFullScreen
    />
  );
}
```

**Rationale contra YouTube Data API v3**:
- Quota limits (10,000 units/day) desnecessários quando metadados estão no DB
- Complexidade adicional de API key management
- Performance: evita chamadas externas em Server Components

**Alternatives Considered**:
- YouTube Data API v3: Para buscar metadados automaticamente. Reservar para Fase 2 (CMS) quando admin precisar importar sermões por URL.
- Vimeo/Video.js: Fora de escopo, cliente usa YouTube exclusivamente.

---

## R-006: Google Maps Integration Strategy

**Decision**: Google Maps Embed API (iframe) para localizações e eventos

**Rationale**: Para o MVP, iframe embed é suficiente. Não requer JavaScript API nem billing complexo. Gratuito para embeds básicos com "Get Directions".

**Pattern**:
```typescript
// Componente shared GoogleMapEmbed
function GoogleMapEmbed({ lat, lng, query }: MapProps) {
  return (
    <iframe
      src={`https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${query}&center=${lat},${lng}`}
      allowFullScreen
      loading="lazy"
    />
  );
}
```

**Alternatives Considered**:
- Google Maps JavaScript API: Over-engineering para MVP. Reservar para features interativas futuras.
- OpenStreetMap/Leaflet: Gratuito mas sem "Get Directions" nativo e menos familiar para usuários.

---

## R-007: Form Submission Strategy (Phase 1 - No CMS)

**Decision**: Server Actions com Cappuccino `Collection.insertOne()` + React Hook Form + Zod

**Rationale**: Formulários do MVP (contact, event registration, group interest) salvam diretamente no Cappuccino via Server Actions. Sem necessidade de API routes separadas.

**Pattern**:
```typescript
// app/actions/contact.ts
'use server'
export async function submitContactForm(data: ContactFormData) {
  const validated = contactSchema.parse(data);
  const { apiClient } = getCappuccinoServer();
  const collection = new Collection({ apiClient, name: 'contact_submissions' });
  await collection.insertOne({ ...validated, createdAt: new Date() });
  return { success: true };
}
```

**Spam Protection**: Honeypot field (campo hidden) — simples, sem dependência externa (não CAPTCHA).

**Alternatives Considered**:
- API Routes: Desnecessário quando Server Actions resolvem. Mais complexidade.
- Formspree/Netlify Forms: Dependência externa desnecessária com Cappuccino disponível.

---

## R-008: Image Optimization Strategy

**Decision**: next/image com Vercel Image Optimization + WebP automático

**Rationale**: Next.js `<Image>` component já otimiza automaticamente no Vercel: lazy loading, responsive srcset, WebP/AVIF conversion, blur placeholder.

**Imagens estáticas** (hero, logos): em `/public/images/`
**Imagens dinâmicas** (leadership photos, event images): servidas via Cappuccino MediaStorage URL → next/image `remotePatterns`

**Alternatives Considered**:
- Cloudinary: Over-engineering, custo adicional. Vercel Image Optimization é grátis no tier.
- Sharp manual: next/image já usa Sharp internamente.

---

## R-009: SEO Implementation Strategy

**Decision**: Next.js Metadata API + generateMetadata() + schema.org JSON-LD

**Rationale**: Next.js 14+ tem Metadata API nativa. `generateMetadata()` gera meta tags dinâmicas por página. JSON-LD para structured data (Church, Event, Article, VideoObject).

**Sitemap**: `app/sitemap.ts` com `MetadataRoute.Sitemap` (automático)
**Robots**: `app/robots.ts` com `MetadataRoute.Robots` (automático)
**Open Graph**: Via `generateMetadata()` com imagens dinâmicas

**Alternatives Considered**:
- next-seo: Redundante com Metadata API nativa do Next.js 14+
- Manual meta tags: Mais verboso e propenso a erros
