# Quickstart: Igreja Cévennes Website

**Date**: 2026-02-11 | **Branch**: `001-church-website`

## Pré-requisitos

- Node.js 18.17+
- npm 9+
- Conta Cappuccino Cloud com tenant configurado
- Google Maps API Key

## Setup Rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Instalar dependências faltantes

```bash
# i18n
npm install next-intl

# Forms + Validation
npm install react-hook-form zod @hookform/resolvers

# shadcn/ui (inicializar)
npx shadcn@latest init

# shadcn components necessários
npx shadcn@latest add button card input textarea form label separator sheet badge
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

```env
# .env.local
CAPPUCCINO_API_URL=https://api.cappuccino.app
CAPPUCCINO_API_KEY=your-tenant-api-key
NEXT_PUBLIC_CAPPUCCINO_API_URL=https://api.cappuccino.app
NEXT_PUBLIC_CAPPUCCINO_API_KEY=your-tenant-api-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

## Estrutura de Implementação (Ordem Recomendada)

### Fase A: Foundation

1. **Configurar next-intl** — middleware, i18n config, `[locale]` routing
2. **Configurar shadcn/ui** — components.json, design tokens (Borgonha), utils.ts
3. **Configurar Cappuccino** — client setup (`lib/cappuccino.ts`), server client
4. **Criar types base** — `types/common.ts` (MultilingualText, BibleRef, Pagination)
5. **Criar layout root** — `app/[locale]/layout.tsx` com fonts, metadata, providers
6. **Criar componentes layout** — Header, Footer, Navigation, LanguageSwitcher

### Fase B: Homepage + Páginas Institucionais

7. **Homepage** — 8 seções (Hero, Gathering, About, Team, Events, Blog, Groups, Contact)
8. **Componentes sections** — HeroSection, GatheringSection, AboutSection, etc.
9. **Página About** — Mission, Vision, History, Statement of Faith
10. **Página Contact** — ContactForm + GoogleMapEmbed + Church info
11. **Página Leadership** — Team grid com fotos e bios

### Fase C: Features de Conteúdo

12. **Sermon Archive** — Listagem + filtros + paginação
13. **Sermon Detail** — YouTubeEmbed + notas PDF + biblical ref
14. **Events Listing** — Cards + filtros + calendar
15. **Event Detail** — Description + GoogleMap + Registration form
16. **Groups Directory** — Cards + filtros + Interest form
17. **Blog Listing** — Cards + categorias
18. **Blog Article** — Full content + share buttons

### Fase D: Polish

19. **SEO** — generateMetadata, JSON-LD, sitemap, robots, Open Graph
20. **Performance** — next/image optimization, lazy loading, Suspense boundaries
21. **Accessibility** — ARIA labels, keyboard navigation, color contrast
22. **Traduções completas** — FR/PT/EN para todas as páginas

## Convenções de Desenvolvimento

```
- Server Components por padrão (sem 'use client' exceto interatividade)
- Types em src/types/ (NÃO dentro da feature de UI)
- Hooks em src/hooks/ (feature-based por nome de arquivo)
- Validations em src/lib/validations/
- Actions em src/app/actions/
- Componentes privados em _components/ dentro da feature
- Naming: PascalCase (componentes), camelCase (funções), use{Action}{Entity} (hooks)
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento local |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm start` | Servidor de produção |
