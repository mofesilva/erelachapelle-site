# Project Structure - Igreja Cévennes

> Organização arquitetural do projeto Next.js 14+ com Clean Architecture pragmática
> Baseado em `project_guidelines.json` e `design-system.md`

---

## 📁 Visão Geral da Arquitetura

### Estrutura do Projeto

```
cevennes-site/                        # Projeto Igreja Cévennes (Next.js 14+)
├── src/                              # Source code
├── public/                           # Static assets  
├── docs/                             # Documentação
├── package.json                      # Dependencies (inclui cappuccino-js-sdk)
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind + Design tokens
└── tsconfig.json                     # TypeScript configuration
```

### Dependências Externas

- **cappuccino-js-sdk**: Acessado via git/npm como dependência externa
- **shadcn/ui**: Componentes UI base
- **next-intl**: Multilingual support

### Princípios Arquiteturais

- **Clean Architecture Pragmática**: 4 camadas simplificadas
- **Feature-Based Structure**: Organização por domínio de negócio
- **Component-Driven Development**: Baseado no design system
- **Multilingual-First**: FR/PT/EN desde o início
- **Server-First**: Server Components como padrão

---

## 🏗️ Estrutura do Projeto (`cevennes-site/`)

### Organização Principal

```
cevennes-site/
├── src/
│   ├── app/                          # App Router (Next.js 14+)
│   │   ├── [locale]/                 # Multilingual routing
│   │   │   ├── layout.tsx            # Root layout with fonts/metadata
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── (public)/             # Site público agrupado
│   │   │   │   ├── community/        # Feature: Comunidade
│   │   │   │   ├── events/           # Feature: Eventos
│   │   │   │   ├── sermons/          # Feature: Sermões
│   │   │   │   ├── about/            # Feature: Sobre nós
│   │   │   │   └── contact/          # Feature: Contato
│   │   │   └── (backoffice)/         # CMS Admin (Fase 2)
│   │   │       ├── dashboard/
│   │   │       └── content/
│   │   ├── api/                      # API Routes (se necessário)
│   │   └── globals.css               # Global styles
│   ├── components/                   # Componentes React
│   │   ├── ui/                       # shadcn/ui base components
│   │   ├── shared/                   # Shared between features
│   │   ├── layout/                   # Header, Footer, Nav
│   │   └── sections/                 # Homepage sections
│   ├── hooks/                        # Custom React hooks
│   ├── lib/                          # Utilities & configurations
│   │   ├── validations/              # Zod schemas
│   │   ├── utils.ts                  # Utility functions
│   │   └── cappuccino.ts             # Cappuccino SDK client setup
│   ├── types/                        # TypeScript definitions
│   └── messages/                     # i18n translations
│       ├── fr.json                   # French translations
│       ├── pt.json                   # Portuguese translations
│       └── en.json                   # English translations
├── public/                           # Static assets
│   ├── images/                       # Images
│   ├── icons/                        # Icons/favicons
│   └── logos/                        # Church logos
├── docs/                             # Documentation
│   ├── design-system.md              # Design system guide
│   ├── project-structure.md          # This file
│   ├── project_guidelines.json       # Architectural guidelines
│   └── ui-reference-images/          # Design references
└── Configuration files
    ├── next.config.ts                # Next.js configuration
    ├── tailwind.config.ts            # Tailwind + Design tokens
    ├── tsconfig.json                 # TypeScript configuration
    ├── package.json                  # Dependencies (cappuccino-js-sdk via git)
    └── eslint.config.mjs             # Linting rules
```

---

## 🎯 Clean Architecture - 4 Camadas

### 1. Presentation Layer (`components/`)

**Localização**: `src/components/`

**Responsabilidade**: Renderização pura de UI

```
components/
├── ui/                               # shadcn/ui base components
│   ├── button.tsx                    # CVA-based Button variations
│   ├── card.tsx                      # Base Card component
│   ├── input.tsx                     # Form inputs
│   └── ...                          # Other shadcn components
├── shared/                           # Shared between features
│   ├── SectionLabel.tsx              # ◆──── LABEL ────◆ component
│   ├── YouTubeEmbed.tsx              # YouTube video integration
│   └── EventCard.tsx                 # Reusable event card
├── layout/                           # Layout components
│   ├── Header.tsx                    # Navigation + language switcher
│   ├── Footer.tsx                    # Church information
│   └── Navigation.tsx                # Main navigation
└── sections/                         # Homepage sections
    ├── HeroSection.tsx               # Hero with CTA
    ├── GatheringSection.tsx          # Meeting times/locations
    ├── AboutSection.tsx              # Church mission
    ├── TeamSection.tsx               # Leadership team
    ├── EventsSection.tsx             # Upcoming events
    └── BlogSection.tsx               # Latest articles
```

**Regras**:
- ✅ Apenas renderização e estado UI local
- ✅ Recebe dados via props, emite eventos via callbacks
- ❌ Não faz fetching de dados diretamente
- ❌ Não acessa localStorage/sessionStorage

### 2. Application Layer (`hooks/`, `app/actions/`)

**Localização**: `src/hooks/` + `src/app/actions/`

**Responsabilidade**: Orquestração de lógica e mutações

```
hooks/
├── use-events.ts                     # Event-related state logic
├── use-sermons.ts                    # Sermon fetching & management
├── use-auth.ts                       # Authentication state
└── use-i18n.ts                       # Internationalization helpers

app/actions/
├── events.ts                         # Server Actions for events
├── sermons.ts                        # Server Actions for sermons
└── newsletter.ts                     # Newsletter subscription
```

**Padrões**:
- **Hooks**: `return { data, loading, error, ...methods }`
- **Server Actions**: `return { success: boolean, data?: T, error?: string }`

### 3. Infrastructure Layer (SDK Externo)

**Localização**: `src/lib/cappuccino.ts` + `node_modules/cappuccino-js-sdk`

**Responsabilidade**: Configuração e wrappers para serviços externos

```
lib/
├── cappuccino.ts                     # SDK client configuration  
└── integrations/
    ├── youtube.ts                    # YouTube API wrapper
    └── maps.ts                       # Google Maps integration
```

**Regras**:
- ✅ Configure Cappuccino SDK via package.json dependency
- ✅ Wrapper functions para APIs externas
- ✅ Tratamento de erros de rede
- ❌ Não contém lógica de negócio

### 4. Domain Layer (`types/`, `lib/validations/`)

**Localização**: `src/types/` + `src/lib/validations/`

**Responsabilidade**: Definições de tipos e schemas

```
types/
├── event.ts                          # Event entity definitions
├── sermon.ts                         # Sermon types
├── user.ts                           # User/Member types
└── common.ts                         # Shared types

lib/validations/
├── event.schema.ts                   # Zod schemas for events
├── sermon.schema.ts                  # Sermon validation
└── contact.schema.ts                 # Contact form validation
```

---

## 🎨 Design System Integration

### Token Structure

**Localização**: `tailwind.config.ts` + `src/styles/globals.css`

```
Design Tokens Integration:
├── tailwind.config.ts                # CSS custom properties mapping
│   ├── colors: { primary: '#722F37' }  # Borgonha theme
│   ├── fontFamily: { serif: 'Playfair Display' }
│   └── spacing: { section: '5rem' }
└── globals.css                       # CSS variables + reset
    ├── :root variables               # Light theme tokens
    └── [data-theme="dark"]           # Dark theme (future)
```

### Component-Token Mapping

| Design System Concept | Implementation Location |
|----------------------|-------------------------|
| **Typography Scale** | `tailwind.config.ts` → `text-*` classes |
| **Color Palette** | `tailwind.config.ts` → `bg-primary`, `text-*` |
| **Spacing Rhythm** | `tailwind.config.ts` → `space-*` tokens |
| **Component Variants** | `components/ui/*.tsx` → CVA patterns |
| **Decorative Elements** | `components/shared/SectionLabel.tsx` |

---

## 📱 Feature-Based Organization

### Feature Structure Pattern

Cada feature segue esta estrutura consistente:

```
feature-name/
├── page.tsx                          # Route component (Server)
├── _components/                      # Private to this feature
│   ├── FeatureForm.tsx              # Specific forms
│   ├── FeatureCard.tsx              # Custom card layouts
│   └── FeatureFilters.tsx           # Filter components
├── _hooks/                           # Feature-specific hooks
│   └── use-feature-data.ts          # Custom data logic
└── _types/                           # Feature-specific types
    └── feature.types.ts             # Local type definitions
```

### Exemplos de Features

#### 🗓️ Events Feature

```
events/
├── page.tsx                          # Events listing page
├── [id]/
│   └── page.tsx                      # Event detail page
├── _components/
│   ├── EventCard.tsx                 # → será shared/EventCard.tsx
│   ├── EventFilters.tsx              # Category/date filters
│   └── EventRegistration.tsx         # Registration form
└── _hooks/
    └── use-event-registration.ts     # Registration logic
```

#### 🎤 Sermons Feature

```
sermons/
├── page.tsx                          # Sermons listing
├── [slug]/
│   └── page.tsx                      # Individual sermon
├── _components/
│   ├── SermonPlayer.tsx              # YouTube integration
│   ├── SermonCard.tsx                # Grid item
│   └── SermonSeries.tsx              # Series navigation
└── _hooks/
    └── use-sermon-progress.ts        # Play progress tracking
```

#### 👥 Community Feature

```
community/
├── page.tsx                          # Community overview
├── groups/
│   ├── page.tsx                      # Groups listing
│   └── [id]/page.tsx                 # Group details
├── testimonies/
│   └── page.tsx                      # Testimonies collection
├── _components/
│   ├── GroupCard.tsx                 # Group display
│   ├── TestimonyCard.tsx             # Testimony item
│   └── JoinGroupForm.tsx             # Group registration
└── _hooks/
    └── use-group-membership.ts       # Membership logic
```

---

## 🌐 Internationalization Structure

### File Organization

```
messages/
├── fr.json                           # French (default locale)
│   ├── common: { ... }               # Shared translations
│   ├── navigation: { ... }           # Menu items
│   ├── events: { ... }               # Events feature
│   ├── sermons: { ... }              # Sermons feature
│   └── forms: { ... }                # Form labels/errors
├── pt.json                           # Portuguese
└── en.json                           # English
```

### Usage Patterns

```typescript
// In components
const t = useTranslations('events')
const title = t('card.readMore')

// In database content
interface Event {
  title: {
    fr: string
    pt: string  
    en: string
  }
  description: {
    fr: string
    pt: string
    en: string
  }
}

// Display current locale
const locale = useLocale()
const title = event.title[locale]
```

---

## 🔧 Configuration Files

### Core Configuration

| File | Purpose | Key Settings |
|------|---------|-------------|
| **package.json** | Dependencies | Next.js, React, Tailwind, cappuccino-js-sdk (via git) |
| **next.config.ts** | Next.js setup | i18n, images, redirects |
| **tailwind.config.ts** | Design system | colors, fonts, spacing |
| **tsconfig.json** | TypeScript | strict mode, path aliases |
| **eslint.config.mjs** | Code quality | React hooks, imports |

### Path Aliases

```json
// tsconfig.json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/hooks/*": ["./src/hooks/*"],
    "@/lib/*": ["./src/lib/*"],
    "@/types/*": ["./src/types/*"]
  }
}
```

---

## 📊 Database Collections Structure

### Cappuccino Collections

Baseado no `project_guidelines.json`:

```typescript
// Main Collections
├── site_config           # Site-wide settings
├── events               # Church events & activities
├── sermons              # YouTube sermon references  
├── blog_posts           # Articles & announcements
├── groups               # Small groups & ministries
├── testimonies          # Member testimonies
├── prayer_requests      # Prayer list
├── newsletter_subscribers # Email subscriptions
├── users                # Members & administrators
└── mission_partners     # Missionary partnerships
```

### Data Model Patterns

```typescript
// Multilingual Content Pattern
interface MultilingualEvent {
  title: { fr: string; pt: string; en: string }
  description: { fr: string; pt: string; en: string }
  location: 'Saint-Hippolyte' | 'Lasalle' | 'Monoblet'
  date: Date
  createdAt: Date
  updatedAt: Date
  active: boolean  // Soft delete pattern
}
```

---

## 🚀 Development Workflow

### Component Creation Workflow

1. **Analyze**: Verificar componentes existentes reutilizáveis
2. **Plan**: Definir responsabilidade única do componente
3. **Design**: Mapear para design system tokens
4. **Implement**: Seguir padrão established
5. **Test**: Testar isoladamente
6. **Document**: JSDoc se necessário
7. **Export**: Adicionar ao index apropriado

### File Creation Checklist

- [ ] ✅ Nome em PascalCase para componentes
- [ ] ✅ Props interface com `{Component}Props` suffix
- [ ] ✅ Usar design system tokens (não valores hardcoded)
- [ ] ✅ Multilingual (useTranslations) se relevante
- [ ] ✅ Server Component por padrão
- [ ] ✅ 'use client' apenas quando necessário
- [ ] ✅ Imports organizados (React → External → Internal → Types)

### Feature Addition Process

1. **Feature Planning**: Definir escopo e responsabilidades
2. **Route Structure**: Criar estrutura de páginas
3. **Components**: Implementar componentes específicos
4. **Shared Extraction**: Mover componentes reutilizáveis para `shared/`
5. **Hooks**: Implementar lógica de estado
6. **Actions**: Criar Server Actions para mutações
7. **Types**: Definir types específicos da feature
8. **Tests**: Implementar testes críticos
9. **i18n**: Adicionar traduções
10. **Documentation**: Atualizar docs relevantes

---

## ⚡ Performance & Optimization

### Bundle Optimization

```typescript
// Dynamic imports for heavy components
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <Skeleton />
})

// Separação client/server strategic
// Server Components (default)
export default function EventsPage() { }

// Client Components (only when needed)
'use client'
export function InteractiveFilter() { }
```

### Data Fetching Strategy

```typescript
// Server Components - Direct fetching
async function EventsPage() {
  const events = await cappuccino.collections('events').find()
  return <EventsList events={events} />
}

// Client - via hooks
function EventsClient() {
  const { events, loading } = useEvents()
  return <EventsList events={events} />
}
```

---

## 🎯 Guidelines de Uso

### Para Desenvolvedores

1. **Antes de criar qualquer código**: Analisar código existente para reutilização
2. **Feature-first**: Organizar por domínio, não por tipo de arquivo
3. **Server-first**: Usar Server Components como padrão
4. **Simple-first**: Escolher sempre a solução mais simples
5. **Clean-first**: Limpar imports/código não usado proativamente

### Para Design System

1. **Token-first**: Usar design tokens, não valores mágicos
2. **Component-driven**: Compor componentes existentes
3. **Consistent**: Manter padrões visuais e interaction
4. **Accessible**: Seguir WCAG guidelines
5. **Responsive**: Mobile-first approach

### Para Multilingual

1. **i18n-first**: Pensar em traduções desde o início
2. **Key-semantic**: Chaves descritivas `events.card.readMore`
3. **Context-aware**: Namespaces por feature
4. **Database-multilingual**: Campos `{ fr, pt, en }`
5. **Locale-dynamic**: Display baseado no locale atual

---

Este documento serve como guia prático para navegar e contribuir com o projeto Igreja Cévennes, mantendo consistência arquitetural e eficiência de desenvolvimento.

---

## 📚 Referências

- [project_guidelines.json](./project_guidelines.json) - Guidelines completos
- [design-system.md](./design-system.md) - Sistema de design detalhado  
- [Next.js App Router](https://nextjs.org/docs/app) - Documentação oficial
- [Tailwind CSS](https://tailwindcss.com/docs) - Design system framework
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Princípios arquiteturais