# PROJETO COMPLETO - Igreja Cévennes

> Documento master com todas as fases, schemas e requisitos do projeto
> Site multilíngue (FR/PT/EN) + CMS para Igreja nas Cévennes, França

**Versão:** 1.0  
**Data:** Janeiro 2026  
**Baseado em:** [project_guidelines.json](./project_guidelines.json), [design-system.md](./design-system.md), [project-structure.md](./project-structure.md)

---

## 📋 Índice

1. [Visão Geral do Projeto](#-visão-geral-do-projeto)
2. [Especificações Técnicas](#-especificações-técnicas)
3. [Arquitetura do Sistema](#-arquitetura-do-sistema)
4. [Schemas de Collections](#-schemas-de-collections)
5. [Fases de Desenvolvimento](#-fases-de-desenvolvimento)
6. [Features Detalhadas](#-features-detalhadas)
7. [Design System & UI](#-design-system--ui)
8. [Internacionalização](#-internacionalização)
9. [Performance & SEO](#-performance--seo)
10. [Segurança](#-segurança)
11. [Deploy & DevOps](#-deploy--devops)
12. [Testes](#-testes)
13. [Documentação](#-documentação)
14. [Timeline & Milestones](#-timeline--milestones)

---

## 🎯 Visão Geral do Projeto

### Contexto e Objetivos

A **Igreja Cévennes** é uma comunidade cristã localizada na região das Cévennes, França, com **três localizações**: Saint-Hippolyte, Lasalle e Monoblet. O projeto visa criar uma **plataforma web moderna** que sirva como:

- **Site público** para visitantes e membros
- **Sistema de gestão de conteúdo (CMS)** para administradores
- **Hub de comunicação** multilíngue (Francês, Português, Inglês)
- **Centro de recursos** espirituais e comunitários

### Público-Alvo

| Persona | Descrição | Necessidades |
|---------|-----------|-------------|
| **Visitantes** | Pessoas interessadas na igreja | Informações sobre cultos, localização, doutrina |
| **Membros** | Congregação regular | Eventos, sermões, grupos, pedidos de oração |
| **Líderes** | Pastores e liderança | Gestão de conteúdo, comunicação, estatísticas |
| **Multilíngues** | Falantes FR/PT/EN | Interface e conteúdo na língua nativa |

### Proposta de Valor

- ✅ **Presença digital moderna** e profissional
- ✅ **Comunicação eficaz** em 3 idiomas
- ✅ **Gestão centralizada** de conteúdo
- ✅ **Experiência mobile-first** otimizada
- ✅ **Integração com serviços** (YouTube, Maps)
- ✅ **Performance excepcional** (Core Web Vitals)

---

## 🛠️ Especificações Técnicas

### Stack Tecnológico

#### Frontend Core
```typescript
// Framework & Language
Next.js: "14+" // App Router, Server Components
React: "18+"   // Server & Client Components  
TypeScript: "5+" // Strict mode, type safety

// Styling & UI
"Tailwind CSS": "4+"     // Utility-first framework
"shadcn/ui": "latest"    // Component library base
"Lucide React": "latest" // Icon system

// Forms & Validation
"React Hook Form": "7+" // Form management
"Zod": "3+"            // Schema validation

// Internationalization  
"next-intl": "3+"      // i18n for Next.js 14+
```

#### Backend & Database
```typescript
// Backend as a Service
"Cappuccino Cloud": "latest" // MongoDB multi-tenant
"Cappuccino SDK": "via git"  // Database client

// External APIs
"YouTube API": "v3"     // Video embedding
"Google Maps": "latest" // Location services
"Vercel Analytics": "latest" // Performance monitoring
```

#### Development Tools
```typescript
// Quality & Linting
"ESLint": "9+" // Code linting
"Prettier": "3+" // Code formatting  
"TypeScript": "5+" // Type checking

// Testing
"Vitest": "2+" // Unit & integration testing
"React Testing Library": "latest" // Component testing

// Deployment
"Vercel": "latest" // Platform as a Service
```

### Arquitetura Técnica

**Clean Architecture Pragmática** com 4 camadas:

1. **🎨 Presentation Layer** (`components/`) - UI pura, sem lógica de negócio
2. **🔄 Application Layer** (`hooks/`, `actions/`) - Orquestração e lógica
3. **🔌 Infrastructure Layer** (`lib/`) - Cappuccino SDK, API wrappers
4. **🏛️ Domain Layer** (`types/`, `validations/`) - Schemas e tipos

### Estrutura de Diretórios

```
cevennes-site/
├── src/
│   ├── app/[locale]/                 # App Router multilíngue
│   │   ├── (public)/                 # Site público
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── events/               # Eventos
│   │   │   ├── sermons/              # Sermões  
│   │   │   ├── community/            # Comunidade
│   │   │   ├── about/                # Sobre
│   │   │   └── contact/              # Contato
│   │   └── (backoffice)/             # CMS Admin
│   │       ├── dashboard/            # Dashboard
│   │       └── content/              # Gestão
│   ├── components/                   # Componentes React
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── shared/                   # Compartilhados
│   │   ├── layout/                   # Header, Footer
│   │   └── sections/                 # Seções homepage
│   ├── hooks/                        # Custom React hooks
│   ├── lib/                          # Utilities & config
│   │   ├── validations/              # Zod schemas
│   │   ├── utils.ts                  # Helper functions
│   │   └── cappuccino.ts             # DB client
│   ├── types/                        # TypeScript definitions
│   └── messages/                     # i18n translations
├── public/                           # Static assets
├── docs/                             # Documentação
└── Configuration files
```

---

## 🏗️ Arquitetura do Sistema

### Diagrama de Arquitetura

![Architecture Diagram](./architecture-diagram.svg)

### Fluxo de Dados

```
👤 User → 🚀 Next.js → 🔄 Hooks → ⚡ Actions → 🔌 Cappuccino SDK → ☁️ MongoDB
```

### Princípios Arquiteturais

#### 1. Server-First Approach
- **Server Components** como padrão
- **Client Components** apenas quando necessário (interatividade)
- **Server Actions** para mutações

#### 2. Clean Architecture Pragmática
- **Separation of Concerns** clara entre camadas
- **Dependency Inversion** - UI não depende de implementações
- **Single Responsibility** - Cada módulo tem uma função

#### 3. Feature-Based Structure
- Organização por **domínio de negócio**
- **Co-location** de arquivos relacionados
- **Modularidade** para escalabilidade

#### 4. Performance-First
- **Static Generation** + **ISR**
- **Edge Caching** global
- **Code Splitting** automático
- **Image Optimization** nativa

---

## 📊 Schemas de Collections

### Site Configuration
```typescript
interface SiteConfig {
  id: string
  church_name: { fr: string; pt: string; en: string }
  description: { fr: string; pt: string; en: string }
  contact: {
    email: string
    phone: string
    address: { fr: string; pt: string; en: string }
  }
  social_links: {
    facebook?: string
    youtube?: string
    instagram?: string
  }
  locations: Array<{
    name: 'Saint-Hippolyte' | 'Lasalle' | 'Monoblet'
    address: string
    coordinates: { lat: number; lng: number }
    service_times: { fr: string; pt: string; en: string }
  }>
  active: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Events
```typescript
interface Event {
  id: string
  title: { fr: string; pt: string; en: string }
  description: { fr: string; pt: string; en: string }
  slug: { fr: string; pt: string; en: string }
  
  // Event Details
  type: 'service' | 'conference' | 'workshop' | 'social' | 'prayer' | 'other'
  date: Date
  end_date?: Date
  time: string
  location: 'Saint-Hippolyte' | 'Lasalle' | 'Monoblet' | 'online'
  address?: string
  
  // Content
  image?: {
    url: string
    alt: { fr: string; pt: string; en: string }
  }
  featured: boolean
  registration_required: boolean
  registration_url?: string
  max_participants?: number
  
  // SEO & Meta
  meta_description?: { fr: string; pt: string; en: string }
  
  // System
  status: 'draft' | 'published' | 'cancelled'
  author_id: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}
```

### Sermons
```typescript
interface Sermon {
  id: string
  title: { fr: string; pt: string; en: string }
  description: { fr: string; pt: string; en: string }
  slug: { fr: string; pt: string; en: string }
  
  // Sermon Details
  date: Date
  speaker: string
  series?: { fr: string; pt: string; en: string }
  bible_passage?: string
  location: 'Saint-Hippolyte' | 'Lasalle' | 'Monoblet'
  
  // Media
  youtube_url: string
  youtube_id: string
  thumbnail?: string
  duration?: number
  
  // Content
  summary?: { fr: string; pt: string; en: string }
  notes_url?: string
  transcript?: { fr: string; pt: string; en: string }
  
  // Organization
  featured: boolean
  tags?: string[]
  category?: 'sunday' | 'conference' | 'special' | 'youth'
  
  // SEO
  meta_description?: { fr: string; pt: string; en: string }
  
  // System
  status: 'draft' | 'published' | 'archived'
  author_id: string
  createdAt: Date
  updatedAt: Date
}
```

### Blog Posts
```typescript
interface BlogPost {
  id: string
  title: { fr: string; pt: string; en: string }
  content: { fr: string; pt: string; en: string }
  excerpt: { fr: string; pt: string; en: string }
  slug: { fr: string; pt: string; en: string }
  
  // Content Details
  author: {
    name: string
    avatar?: string
    bio?: { fr: string; pt: string; en: string }
  }
  category: {
    name: { fr: string; pt: string; en: string }
    slug: string
    color: string
  }
  
  // Media
  featured_image?: {
    url: string
    alt: { fr: string; pt: string; en: string }
  }
  gallery?: Array<{
    url: string
    alt: { fr: string; pt: string; en: string }
  }>
  
  // Publication
  published_date: Date
  featured: boolean
  tags?: string[]
  reading_time?: number
  
  // SEO
  meta_description?: { fr: string; pt: string; en: string }
  meta_keywords?: string[]
  
  // System
  status: 'draft' | 'published' | 'archived'
  views: number
  createdAt: Date
  updatedAt: Date
}
```

### Community Groups
```typescript
interface Group {
  id: string
  name: { fr: string; pt: string; en: string }
  description: { fr: string; pt: string; en: string }
  slug: { fr: string; pt: string; en: string }
  
  // Group Details
  type: 'bible_study' | 'prayer' | 'youth' | 'women' | 'men' | 'seniors' | 'children'
  leader: {
    name: string
    email?: string
    phone?: string
    bio?: { fr: string; pt: string; en: string }
  }
  
  // Meetings
  meeting_day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  meeting_time: string
  location: 'Saint-Hippolyte' | 'Lasalle' | 'Monoblet' | 'online' | 'rotating'
  address?: string
  
  // Details
  age_range?: string
  max_members?: number
  current_members?: number
  is_open: boolean
  requirements?: { fr: string; pt: string; en: string }
  
  // Content
  image?: {
    url: string
    alt: { fr: string; pt: string; en: string }
  }
  
  // Contact
  contact_email?: string
  contact_phone?: string
  registration_required: boolean
  
  // System
  status: 'active' | 'paused' | 'full' | 'inactive'
  featured: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Prayer Requests
```typescript
interface PrayerRequest {
  id: string
  title: { fr: string; pt: string; en: string }
  description: { fr: string; pt: string; en: string }
  
  // Request Details
  category: 'healing' | 'guidance' | 'protection' | 'provision' | 'salvation' | 'other'
  urgency: 'low' | 'medium' | 'high'
  is_anonymous: boolean
  
  // Requester (if not anonymous)
  requester?: {
    name: string
    email?: string
    phone?: string
  }
  
  // Status
  status: 'active' | 'answered' | 'ongoing' | 'closed'
  answer?: { fr: string; pt: string; en: string }
  answered_date?: Date
  
  // Privacy
  is_public: boolean
  show_on_website: boolean
  
  // System
  prayer_count: number
  createdAt: Date
  updatedAt: Date
  expires_at?: Date
}
```

### Newsletter Subscribers
```typescript
interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  
  // Preferences
  language: 'fr' | 'pt' | 'en'
  frequency: 'daily' | 'weekly' | 'monthly'
  topics: Array<'events' | 'sermons' | 'blog' | 'prayer' | 'news'>
  
  // Status
  status: 'active' | 'pending' | 'unsubscribed'
  confirmed: boolean
  confirmation_token?: string
  confirmation_sent_at?: Date
  confirmed_at?: Date
  
  // Engagement
  last_email_sent?: Date
  last_email_opened?: Date
  total_emails_sent: number
  total_emails_opened: number
  
  // Privacy
  gdpr_consent: boolean
  gdpr_consent_date: Date
  
  // System
  subscribe_source: 'website' | 'event' | 'manual' | 'import'
  unsubscribe_reason?: string
  createdAt: Date
  updatedAt: Date
}
```

### Users (Admin/CMS)
```typescript
interface User {
  id: string
  email: string
  name: string
  
  // Authentication
  password_hash: string
  last_login?: Date
  login_attempts: number
  locked_until?: Date
  
  // Profile
  avatar?: string
  bio?: { fr: string; pt: string; en: string }
  phone?: string
  
  // Permissions
  role: 'super_admin' | 'admin' | 'editor' | 'contributor'
  permissions: Array<'create_events' | 'edit_events' | 'delete_events' | 'manage_users' | 'manage_site' | 'view_analytics'>
  locations: Array<'Saint-Hippolyte' | 'Lasalle' | 'Monoblet'> // Locations they can manage
  
  // Preferences
  language: 'fr' | 'pt' | 'en'
  timezone: string
  notifications: {
    email: boolean
    events: boolean
    comments: boolean
    system: boolean
  }
  
  // System
  status: 'active' | 'inactive' | 'suspended'
  email_verified: boolean
  email_verification_token?: string
  password_reset_token?: string
  password_reset_expires?: Date
  
  createdAt: Date
  updatedAt: Date
  lastModifiedBy?: string
}
```

---

## 🚀 Fases de Desenvolvimento

### Fase 1: MVP Site Público (8-10 semanas)
**Objetivo:** Lançar site público funcional com features essenciais

#### Semana 1-2: Setup & Fundação
- ✅ Configuração inicial do Next.js 14+ 
- ✅ Setup Tailwind CSS + shadcn/ui
- ✅ Configuração next-intl (FR/PT/EN)
- ✅ Integração Cappuccino SDK
- ✅ Design system base

#### Semana 3-4: Componentes Core
- 🎯 Header com navegação e seletor idioma
- 🎯 Footer com informações da igreja
- 🎯 Homepage com seções principais
- 🎯 Componentes UI reutilizáveis

#### Semana 5-6: Pages Públicas
- 🎯 Página de eventos (listagem + detalhes)
- 🎯 Página de sermões (YouTube integration)
- 🎯 Página sobre nós
- 🎯 Página de contato
- 🎯 Páginas de grupos/comunidade

#### Semana 7-8: Integrações & Performance
- 🎯 YouTube API para sermões
- 🎯 Google Maps para localizações
- 🎯 Otimização de imagens
- 🎯 SEO básico

#### Semana 9-10: Testes & Deploy
- 🎯 Testes de componentes críticos
- 🎯 Deploy na Vercel
- 🎯 Configuração de domínio
- 🎯 Monitoring e analytics

**Entregáveis Fase 1:**
- ✅ Site público responsivo (desktop + mobile)
- ✅ Multilíngue (FR/PT/EN) completo
- ✅ Integração YouTube para sermões
- ✅ Google Maps para localizações
- ✅ Performance otimizada (Lighthouse 90+)
- ✅ SEO básico implementado

### Fase 2: CMS Admin (6-8 semanas)
**Objetivo:** Sistema de gestão de conteúdo para administradores

#### Semana 1-2: Autenticação & Autorização
- 🔒 Login/logout de administradores
- 🔒 Gestão de sessões
- 🔒 Roles e permissões
- 🔒 Proteção de rotas admin

#### Semana 3-4: Gestão de Conteúdo
- 📝 CRUD completo para eventos
- 📝 CRUD completo para sermões
- 📝 CRUD completo para posts de blog
- 📝 Upload e gestão de imagens

#### Semana 5-6: Features Avançadas
- 📊 Dashboard com estatísticas
- 📋 Gestão de pedidos de oração
- 👥 Gestão de grupos
- 📧 Gestão de newsletter

#### Semana 7-8: Refinamentos
- 🎨 UI/UX polimento
- 🧪 Testes extensivos
- 📈 Analytics avançadas
- 🔧 Otimizações finais

**Entregáveis Fase 2:**
- ✅ Backoffice completo e funcional
- ✅ Gestão de todo o conteúdo do site
- ✅ Sistema de usuários e permissões
- ✅ Dashboard com métricas
- ✅ Workflows de aprovação de conteúdo

### Fase 3: Features Avançadas (4-6 semanas)
**Objetivo:** Funcionalidades adicionais para engajamento

#### Features Prioritárias
- 💌 Sistema de newsletter avançado
- 📱 PWA (Progressive Web App)
- 🔔 Notificações push
- 🎥 Streaming ao vivo de cultos
- 💳 Integração doações online
- 📊 Analytics avançadas

### Fase 4: Otimização & Escala (2-4 semanas)
**Objetivo:** Performance máxima e preparação para crescimento

#### Otimizações
- ⚡ Performance tuning avançado
- 🔍 SEO avançado (Schema.org, sitemap)
- 🛡️ Segurança hardening
- 📊 Monitoring e alertas
- 🌐 CDN otimização
- 🧪 A/B testing framework

---

## 🎯 Features Detalhadas

### 1. Homepage
**Objetivo:** Primeira impressão poderosa e navegação clara

#### Seções Principais
1. **Hero Section**
   - Mensagem de boas-vindas multilíngue
   - CTA principal ("Visite-nos", "Join Us")
   - Imagem impactante da comunidade
   - Background video opcional

2. **Gathering Times**
   - Horários de culto nas 3 localizações
   - Próximos eventos destacados
   - Link para Google Maps
   - Informações de contato rápido

3. **Latest Sermons**
   - 3-4 sermões mais recentes
   - Player YouTube integrado
   - Categorização por série/tema
   - Link para arquivo completo

4. **About Section**
   - Missão e visão da igreja (resumida)
   - Valores fundamentais
   - História breve
   - Link para página completa

5. **Team Highlights**
   - Pastores e liderança principal
   - Fotos e biografias curtas
   - Contatos diretos
   - Link para equipe completa

6. **Upcoming Events**
   - Próximos 3-5 eventos
   - Cards visuais atraentes
   - Filtro por localização
   - CTA para página de eventos

7. **Community Life**
   - Grupos pequenos em destaque
   - Ministérios ativos
   - Oportunidades de voluntariado
   - Galeria de fotos comunitárias

8. **Blog/News Preview**
   - Últimas 3-4 publicações
   - Categorias variadas
   - Thumbnails atrativas
   - Link para blog completo

### 2. Events System
**Objetivo:** Gestão completa de eventos da igreja

#### Features Públicas
- **Listagem de eventos** com filtros:
  - Por data (próximos, este mês, etc.)
  - Por localização (Saint-Hippolyte, Lasalle, Monoblet)
  - Por tipo (culto, conferência, social, etc.)
  - Por público-alvo (adultos, jovens, crianças)

- **Página de detalhes** do evento:
  - Informações completas (data, hora, local, descrição)
  - Galeria de imagens
  - Mapa de localização integrado
  - Formulário de inscrição (se necessário)
  - Compartilhamento nas redes sociais
  - Adicionar ao calendário (Google, Outlook, etc.)

#### Features Admin
- **CRUD completo** para eventos
- **Editor rich-text** para descrições
- **Upload múltiplo** de imagens
- **Gestão de inscrições** (se aplicável)
- **Templates** para eventos recorrentes
- **Aprovação em múltiplas etapas**
- **Notificações** para inscritos

### 3. Sermons Archive
**Objetivo:** Biblioteca completa de sermões acessível e pesquisável

#### Features Públicas
- **Listagem de sermões**:
  - Filtro por data, pregador, série, tema
  - Busca por texto (título, descrição, transcrição)
  - Visualização em grade ou lista
  - Player YouTube integrado

- **Página do sermão**:
  - Video player principal
  - Notas do sermão (PDF download)
  - Passagem bíblica referenciada
  - Séries relacionadas
  - Comentários (opcional)
  - Compartilhamento

#### Features Admin
- **Integração YouTube**:
  - Importação automática de vídeos
  - Extração de metadata
  - Sincronização de thumbnails
- **Gestão de séries** de sermões
- **Tags e categorização**
- **Transcrições** (manual ou automática)
- **Analytics** de visualizações

### 4. Community Groups
**Objetivo:** Facilitar conexão e participação em grupos pequenos

#### Features
- **Diretório de grupos**:
  - Grupos por faixa etária, interesse, localização
  - Descrições detalhadas
  - Informações de contato
  - Horários e locais de encontro
  - Formulário de interesse

- **Páginas de grupo**:
  - Informações do líder
  - Estudos atuais
  - Galeria de fotos
  - Recursos de estudo
  - Contato direto

### 5. Blog/News System
**Objetivo:** Comunicação regular e engajamento da comunidade

#### Features
- **Sistema de blog** completo:
  - Categorias (notícias, ensinos, testemunhos, etc.)
  - Tags para organização
  - Comentários moderados
  - Newsletter integration
  - RSS feed

- **Gestão de conteúdo**:
  - Editor WYSIWYG
  - Agendamento de posts
  - Workflow de aprovação
  - SEO optimization
  - Analytics de leitura

### 6. Prayer Requests
**Objetivo:** Comunidade de oração ativa e organizada

#### Features
- **Submissão de pedidos**:
  - Formulário público multilíngue
  - Opção anônima
  - Categorização automática
  - Notificação para equipe pastoral

- **Lista de oração**:
  - Pedidos públicos organizados
  - Filtros por categoria/urgência
  - Contador de pessoas orando
  - Updates de respostas
  - Expiração automática

### 7. Contact & Locations
**Objetivo:** Facilitar o primeiro contato e visitas

#### Features
- **Informações de contato**:
  - 3 localizações com detalhes específicos
  - Google Maps integrado
  - Formulário de contato inteligente
  - Roteamento automático de mensagens
  - Auto-resposta personalizada

- **Páginas de localização**:
  - Informações específicas de cada igreja
  - Horários de culto
  - Pastores responsáveis
  - Galeria de fotos
  - Direções detalhadas

---

## 🎨 Design System & UI

### Identidade Visual

#### Paleta de Cores (baseada em Borgonha)
```scss
// Primary Colors
$primary: #722F37;        // Borgonha principal
$primary-dark: #5C262D;   // Estados hover/active
$primary-light: #8B3D47;  // Hierarquia secundária
$primary-foreground: #FFFFFF; // Texto em fundos escuros

// Accent Colors  
$accent-marigold: #F5A462; // Energia e movimento
$accent-coral: #E87B6C;    // Suporte visual
$accent-salmon: #F4A5A0;   // Detalhes delicados

// Neutral Colors
$background: #FFFFFF;       // Canvas principal
$background-muted: #F8F9FA; // Seções alternadas
$foreground: #1A1A1A;      // Texto principal
$muted-foreground: #6B7280; // Texto secundário
```

#### Typography System
```scss
// Primary Font (Headings)
font-family-serif: 'Playfair Display', Georgia, serif;

// Secondary Font (Body)
font-family-sans: 'Inter', system-ui, sans-serif;

// Type Scale
text-xs: 12px;    // Overlines, captions
text-sm: 14px;    // Small text, metadata  
text-base: 16px;  // Body text
text-lg: 18px;    // Subtitles
text-xl: 20px;    // Small headings
text-2xl: 24px;   // Section headings
text-3xl: 30px;   // Page headings
text-4xl: 36px;   // Display headings
text-5xl: 48px;   // Hero headings
text-6xl: 60px;   // Large displays
```

#### Spacing System
```scss
// Spacing Scale (based on 8px)
space-1: 4px;    // Micro spacing
space-2: 8px;    // Small spacing  
space-3: 12px;   // Medium spacing
space-4: 16px;   // Base spacing
space-5: 20px;   // Large spacing
space-6: 24px;   // Section spacing
space-8: 32px;   // Block spacing
space-10: 40px;  // Large blocks
space-12: 48px;  // Section padding
space-16: 64px;  // Large sections
space-20: 80px;  // Page sections
space-24: 96px;  // Major sections
space-32: 128px; // Hero sections
```

### Component Library

#### Base Components (shadcn/ui)
- Button (primary, secondary, outline, ghost)
- Card (default, hover effects, with image)
- Input (text, email, password, textarea)
- Select (single, multi, with search)
- Dialog (modal, drawer, popover)
- Toast (success, error, warning, info)

#### Custom Components
- **EventCard** - Display individual events
- **SermonPlayer** - YouTube integration with controls
- **SectionLabel** - Decorative section headers (◆────◆)
- **LocationCard** - Church location with map
- **TeamMemberCard** - Staff and leadership profiles
- **BlogPostCard** - Article previews
- **PrayerRequestCard** - Prayer request display
- **NewsletterSignup** - Email subscription form

### Layout Patterns

#### Grid System
```scss
// Container
.container {
  max-width: 1280px;
  padding: 0 24px; // Mobile
  
  @media (min-width: 768px) {
    padding: 0 48px; // Tablet
  }
  
  @media (min-width: 1024px) {
    padding: 0 64px; // Desktop
  }
}

// Grid Layouts
.grid-2: grid-template-columns: repeat(2, 1fr);
.grid-3: grid-template-columns: repeat(3, 1fr);
.grid-4: grid-template-columns: repeat(4, 1fr);

// Responsive behavior
.grid-responsive {
  grid-template-columns: 1fr;        // Mobile
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);  // Tablet
  }
  
  @media (min-width: 1024px) {  
    grid-template-columns: repeat(3, 1fr);  // Desktop
  }
}
```

#### Section Layouts
- **Hero** - Full-width background with centered content
- **Feature** - Alternating left/right image+content layout
- **Grid** - Card-based layouts for events, sermons, team
- **Content** - Single column for articles, detailed pages

### Responsive Design

#### Breakpoints
```scss
// Mobile First Approach
$mobile: 320px;   // Minimum mobile
$tablet: 768px;   // Tablet and up
$desktop: 1024px; // Desktop and up  
$large: 1280px;   // Large screens
$xl: 1536px;      // Extra large
```

#### Mobile Optimizations
- **Touch-friendly** button sizes (min 44px)
- **Simplified navigation** with hamburger menu
- **Stacked layouts** instead of side-by-side
- **Larger text** for readability
- **Optimized images** for mobile bandwidth

---

## 🌐 Internacionalização

### Configuração i18n

#### Locales Suportados
```typescript
const locales = ['fr', 'pt', 'en'] as const;
const defaultLocale = 'fr';

// Routing structure
// /fr/       -> French (default)
// /pt/       -> Portuguese  
// /en/       -> English
```

#### Estrutura de Traduções
```typescript
// messages/fr.json
{
  "navigation": {
    "home": "Accueil",
    "events": "Événements", 
    "sermons": "Prédications",
    "community": "Communauté",
    "about": "À Propos",
    "contact": "Contact"
  },
  "homepage": {
    "hero": {
      "title": "Bienvenue à l'Église Cévennes",
      "subtitle": "Une communauté de foi dans les Cévennes",
      "cta": "Visitez-nous"
    },
    "gathering": {
      "title": "Nos Cultes",
      "subtitle": "Rejoignez-nous dans l'une de nos trois locations"
    }
  },
  "events": {
    "title": "Événements",
    "filter": {
      "all": "Tous",
      "location": "Localisation", 
      "type": "Type"
    },
    "card": {
      "readMore": "En savoir plus",
      "register": "S'inscrire"
    }
  },
  "forms": {
    "labels": {
      "name": "Nom",
      "email": "Email",
      "message": "Message"
    },
    "errors": {
      "required": "Ce champ est requis",
      "invalidEmail": "Email invalide"
    },
    "success": "Message envoyé avec succès!"
  }
}
```

#### Database Multilingual Pattern
```typescript
// Collection fields structure
interface MultilingualContent {
  title: {
    fr: string;
    pt: string; 
    en: string;
  }
  description: {
    fr: string;
    pt: string;
    en: string; 
  }
  slug: {
    fr: string;
    pt: string;
    en: string;
  }
}

// Usage in components
const locale = useLocale();
const title = content.title[locale];
```

### Content Strategy

#### Langue Principal: Français
- Conteúdo original criado em francês
- Tradução profissional para português e inglês
- Revisão por falantes nativos

#### Localização Específica
- **Francês**: Terminologia católica/protestante francesa
- **Português**: Adaptação para comunidade brasileira
- **Inglês**: Vocabulário ecumênico internacional

#### Fallback Strategy
```typescript
function getLocalizedContent(content: MultilingualContent, locale: string) {
  // 1. Try requested locale
  if (content[locale]) return content[locale];
  
  // 2. Fallback to French (default)
  if (content.fr) return content.fr;
  
  // 3. Fallback to any available
  return content[Object.keys(content)[0]];
}
```

---

## ⚡ Performance & SEO

### Performance Targets

#### Core Web Vitals
```typescript
// Lighthouse Score Targets
Performance: >= 95
Accessibility: >= 95  
Best Practices: >= 95
SEO: >= 95

// Core Web Vitals Targets
LCP: <= 2.5s  // Largest Contentful Paint
FID: <= 100ms // First Input Delay  
CLS: <= 0.1   // Cumulative Layout Shift
```

#### Bundle Optimization
- **Initial JavaScript**: <= 200KB
- **Initial CSS**: <= 50KB  
- **First Load JS**: <= 300KB
- **Critical CSS**: inline for above-the-fold
- **Image optimization**: automatic WebP conversion

### SEO Strategy

#### On-Page SEO
```typescript
// Meta tags structure
interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  alternateLanguages: {
    fr: string;
    pt: string;
    en: string;
  };
  openGraph: {
    type: 'website' | 'article';
    image: string;
    imageAlt: string;
  };
  structuredData?: object; // JSON-LD
}
```

#### Structured Data (Schema.org)
- **Church** schema for organization
- **Event** schema for events  
- **Article** schema for blog posts
- **Person** schema for team members
- **LocalBusiness** schema for locations

#### Sitemap Generation
- Automatic XML sitemap
- Multilingual sitemap support
- Image sitemap for media
- News sitemap for blog

### Optimization Strategies

#### Next.js 14 Features
- **App Router** for optimal performance
- **Server Components** to reduce client JS
- **Streaming** for faster perceived performance
- **Partial Prerendering** (experimental)
- **Image Component** with automatic optimization

#### Caching Strategy
```typescript
// Cache configuration
const cacheConfig = {
  // Static pages: 1 hour, stale-while-revalidate
  static: 'public, max-age=3600, stale-while-revalidate=86400',
  
  // Dynamic content: 5 minutes
  dynamic: 'public, max-age=300, stale-while-revalidate=3600',
  
  // Images: 30 days
  images: 'public, max-age=2592000, immutable',
  
  // API responses: 1 minute
  api: 'public, max-age=60, stale-while-revalidate=300'
};
```

---

## 🔒 Segurança

### Authentication & Authorization

#### User Roles
```typescript
type UserRole = 'super_admin' | 'admin' | 'editor' | 'contributor';

interface Permission {
  resource: 'events' | 'sermons' | 'blog' | 'users' | 'settings';
  actions: ('create' | 'read' | 'update' | 'delete')[];
  locations?: ('Saint-Hippolyte' | 'Lasalle' | 'Monoblet')[];
}

const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    { resource: '*', actions: ['create', 'read', 'update', 'delete'] }
  ],
  admin: [
    { resource: 'events', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'sermons', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'blog', actions: ['create', 'read', 'update', 'delete'] }
  ],
  editor: [
    { resource: 'events', actions: ['create', 'read', 'update'] },
    { resource: 'blog', actions: ['create', 'read', 'update'] }
  ],
  contributor: [
    { resource: 'blog', actions: ['create', 'read'] }
  ]
};
```

#### Security Headers
```typescript
// next.config.ts security headers
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security', 
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

### Data Protection

#### Input Validation
- **Client-side**: Zod schemas for immediate feedback
- **Server-side**: Zod schemas for security validation
- **Database**: Cappuccino built-in validation
- **Sanitization**: HTML sanitization for user content

#### Privacy Compliance (GDPR)
- **Data minimization**: Only collect necessary data
- **Consent management**: Clear opt-in for newsletters
- **Right to deletion**: Account and data removal
- **Data portability**: Export user data functionality
- **Privacy policy**: Clear and accessible

### Monitoring & Logging

#### Error Monitoring
- **Client errors**: Vercel Analytics error tracking
- **Server errors**: Structured logging to console
- **Performance**: Core Web Vitals monitoring
- **Security events**: Failed login attempts, suspicious activity

---

## 🚀 Deploy & DevOps

### Deployment Pipeline

#### Vercel Configuration
```typescript
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

#### Environment Variables
```bash
# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CAPPUCCINO_API_URL=https://api.cappuccino.dev
CAPPUCCINO_TENANT_ID=igreja-cevennes
CAPPUCCINO_API_KEY=dev_key_here

# External APIs
YOUTUBE_API_KEY=youtube_key_here
GOOGLE_MAPS_API_KEY=maps_key_here

# Production
NEXT_PUBLIC_SITE_URL=https://igrejacevennes.fr
CAPPUCCINO_API_KEY=prod_key_here
VERCEL_ANALYTICS_ID=analytics_id_here
```

### CI/CD Workflow

#### Git Workflow
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest  
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
```

#### Deployment Strategy
- **Develop branch** → Vercel preview deployments
- **Main branch** → Vercel production deployment
- **Feature branches** → Vercel preview deployments
- **Database migrations** → Manual via Cappuccino dashboard

### Monitoring & Maintenance

#### Performance Monitoring
- **Vercel Analytics** - Core Web Vitals tracking
- **Real User Monitoring** - Actual user performance data
- **Lighthouse CI** - Automated performance testing
- **Bundle analyzer** - JavaScript bundle optimization

#### Uptime Monitoring
- **Vercel built-in** - Platform monitoring
- **External service** - UptimeRobot or similar
- **Database monitoring** - Cappuccino platform metrics
- **API monitoring** - Response time tracking

---

## 🧪 Testes

### Testing Strategy

#### Test Pyramid
```typescript
// Unit Tests (70%)
// - Components in isolation
// - Utility functions  
// - Hooks logic
// - Validation schemas

// Integration Tests (20%)
// - Component interactions
// - API integrations
// - Form workflows
// - User journeys

// End-to-End Tests (10%)
// - Critical user paths
// - Cross-browser testing
// - Performance validation
// - Accessibility compliance
```

#### Testing Tools
- **Vitest**: Unit and integration testing
- **React Testing Library**: Component testing
- **MSW**: API mocking for tests
- **Playwright**: E2E testing (Phase 2)
- **Accessibility**: axe-core automated testing

### Test Coverage

#### Priority Tests (Must Have)
```typescript
// Components
- Homepage sections render correctly
- Navigation works across locales  
- EventCard displays event data properly
- SermonPlayer integrates with YouTube
- Forms validate and submit correctly

// Functionality
- i18n locale switching
- Event filtering and search
- Newsletter subscription flow
- Contact form submission
- Admin authentication

// Integration
- Cappuccino data fetching
- YouTube API integration
- Google Maps integration
- Image upload and optimization
```

#### Test Examples
```typescript
// Component test
describe('EventCard', () => {
  it('should display event information correctly', () => {
    const event = mockEvent();
    render(<EventCard event={event} />);
    
    expect(screen.getByText(event.title.fr)).toBeInTheDocument();
    expect(screen.getByText(event.location)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /en savoir plus/i })).toBeInTheDocument();
  });
});

// Hook test  
describe('useEvents', () => {
  it('should fetch and return events data', async () => {
    const { result } = renderHook(() => useEvents());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.events).toHaveLength(3);
      expect(result.current.error).toBeNull();
    });
  });
});
```

---

## 📚 Documentação

### Documentação Técnica

#### Arquivos de Documentação
- [x] **README.md** - Setup inicial e comandos básicos
- [x] **project_guidelines.json** - Guidelines arquiteturais
- [x] **project-structure.md** - Estrutura de diretórios  
- [x] **design-system.md** - Sistema de design
- [x] **architecture-diagram.md** - Arquitetura visual
- [ ] **COLLECTIONS_SCHEMA.md** - Schemas detalhados
- [ ] **API.md** - Documentação de API Routes
- [ ] **CAPPUCCINO_INTEGRATION.md** - Guia do Cappuccino
- [ ] **I18N.md** - Sistema de internacionalização
- [ ] **DEPLOYMENT.md** - Guia de deployment
- [ ] **CONTRIBUTING.md** - Guia para contribuidores

#### Code Documentation
- **JSDoc** para funções complexas
- **TypeScript** para type safety
- **Component props** documentation
- **Hook documentation** com exemplos de uso
- **API endpoints** documentation

### User Documentation

#### Admin Guide
- **Login e navegação** no CMS
- **Gestão de eventos** passo a passo
- **Upload de imagens** e media
- **Criação de posts** no blog
- **Gestão de usuários** e permissões
- **Configurações do site**

#### Content Guidelines
- **Diretrizes de conteúdo** para diferentes seções
- **Tom de voz** da igreja
- **Padrões de escrita** multilíngue
- **Guidelines de imagens**
- **SEO best practices**

---

## ⏰ Timeline & Milestones

### Cronograma Geral

#### Q1 2026: Fase 1 MVP (Janeiro-Março)
```
Semana 1-2:  Setup & Design System
Semana 3-4:  Componentes Core  
Semana 5-6:  Páginas Públicas
Semana 7-8:  Integrações
Semana 9-10: Deploy & Testes
Semana 11-12: Buffer & Ajustes
```

#### Q2 2026: Fase 2 CMS (Abril-Junho)  
```
Semana 1-2:  Autenticação
Semana 3-4:  CRUD Interface
Semana 5-6:  Features Avançadas
Semana 7-8:  Polimento & Testes
```

#### Q3 2026: Fase 3 Advanced (Julho-Setembro)
```
Semana 1-2:  Newsletter System
Semana 3-4:  PWA Implementation  
Semana 5-6:  Live Streaming
Semana 7-8:  Analytics & Optimization
```

### Key Milestones

#### Milestone 1: Site Público Live (Semana 10)
- ✅ Homepage funcional e atraente
- ✅ Todas as páginas públicas implementadas
- ✅ Multilíngue (FR/PT/EN) completo
- ✅ Integração YouTube para sermões
- ✅ Google Maps para localizações
- ✅ Performance otimizada (Lighthouse 90+)
- ✅ Deploy em produção

#### Milestone 2: CMS Funcional (Semana 18)
- ✅ Sistema de login seguro
- ✅ CRUD completo para todo conteúdo
- ✅ Dashboard administrativo
- ✅ Gestão de usuários e permissões
- ✅ Workflow de aprovação de conteúdo

#### Milestone 3: Features Avançadas (Semana 26)  
- ✅ PWA com notificações push
- ✅ Sistema de newsletter avançado
- ✅ Live streaming capabilities
- ✅ Analytics detalhadas
- ✅ Otimizações de performance finais

### Success Metrics

#### Technical KPIs
- **Performance**: Lighthouse Score >= 95
- **Uptime**: 99.9% availability
- **Speed**: Page load time < 2s
- **SEO**: First page Google ranking for key terms
- **Accessibility**: WCAG 2.1 AA compliance

#### Business KPIs
- **Engagement**: 30% increase in website engagement
- **Newsletter**: 500+ newsletter subscribers
- **Events**: 50% increase in event participation
- **Admin**: 80% reduction in content publishing time
- **Mobile**: 60% of traffic from mobile devices

---

## 🎯 Conclusão

Este documento representa a **visão completa** do projeto Igreja Cévennes, consolidando:

- ✅ **Especificações técnicas** detalhadas
- ✅ **Arquitetura moderna** e escalável  
- ✅ **Design system** profissional
- ✅ **Roadmap de desenvolvimento** claro
- ✅ **Features abrangentes** para uma igreja moderna
- ✅ **Performance e SEO** otimizados
- ✅ **Segurança e privacidade** em compliance

### Próximos Passos

1. **Aprovação final** das especificações
2. **Início da Fase 1** (Setup & MVP)
3. **Setup do ambiente** de desenvolvimento
4. **Configuração do Cappuccino** e APIs externas
5. **Início da implementação** dos componentes core

### Contato e Suporte

Para questões sobre este documento ou o projeto:
- **Documentação**: [/docs](./docs/)
- **Guidelines**: [project_guidelines.json](./project_guidelines.json)
- **Arquitetura**: [architecture-diagram.md](./architecture-diagram.md)

---

*Documento criado em Janeiro 2026 • Igreja Cévennes Project • Versão 1.0*