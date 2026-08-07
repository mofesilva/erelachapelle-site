# Server Actions Contracts

**Date**: 2026-02-11 | **Phase**: 1 - Design & Contracts

Este projeto usa Next.js Server Actions (não REST APIs tradicionais). Os contratos abaixo definem as Server Actions e data fetching functions.

---

## Data Fetching Functions (Server Components)

Funções chamadas diretamente em Server Components via Cappuccino SDK.

### Sermons

```typescript
// lib/data/sermons.ts

/** Lista sermões com paginação e filtros */
async function getSermons(params: {
  page?: number;
  limit?: number;
  preacher?: string;
  series?: string;
  tag?: string;
  dateFrom?: string;  // ISO date
  dateTo?: string;    // ISO date
}): Promise<PaginatedResponse<Sermon>>

/** Busca sermão por slug */
async function getSermonBySlug(slug: string): Promise<Sermon | null>

/** Lista séries únicas */
async function getSermonSeries(): Promise<string[]>

/** Lista pregadores únicos */
async function getSermonPreachers(): Promise<string[]>
```

### Events

```typescript
// lib/data/events.ts

/** Lista eventos futuros com filtros */
async function getUpcomingEvents(params: {
  page?: number;
  limit?: number;
  eventType?: EventType;
  locationId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<PaginatedResponse<Event>>

/** Busca evento por slug */
async function getEventBySlug(slug: string): Promise<Event | null>

/** Lista eventos recentes para homepage (limit: 3) */
async function getRecentEvents(): Promise<Event[]>
```

### Groups

```typescript
// lib/data/groups.ts

/** Lista grupos com filtros */
async function getGroups(params: {
  groupType?: GroupType;
  meetingDay?: DayOfWeek;
}): Promise<CommunityGroup[]>

/** Busca grupo por ID */
async function getGroupById(id: string): Promise<CommunityGroup | null>
```

### Blog

```typescript
// lib/data/blog.ts

/** Lista artigos publicados com paginação */
async function getBlogArticles(params: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
}): Promise<PaginatedResponse<BlogArticle>>

/** Busca artigo por slug */
async function getArticleBySlug(slug: string): Promise<BlogArticle | null>

/** Lista categorias únicas */
async function getBlogCategories(): Promise<string[]>

/** Lista artigos recentes para homepage (limit: 3) */
async function getRecentArticles(): Promise<BlogArticle[]>
```

### Institutional

```typescript
// lib/data/institutional.ts

/** Lista todas as localizações ativas */
async function getLocations(): Promise<Location[]>

/** Lista membros da liderança ordenados */
async function getLeadershipTeam(): Promise<LeadershipMember[]>
```

---

## Server Actions (Mutations)

Server Actions do Next.js para formulários e mutações.

### Contact Form

```typescript
// app/actions/contact.ts
'use server'

type ContactFormInput = {
  name: string;          // min 2, max 100
  email: string;         // valid email
  subject: string;       // min 2, max 200
  message: string;       // min 10, max 2000
  _honeypot?: string;    // spam protection (must be empty)
}

type ActionResult = {
  success: boolean;
  error?: string;
}

async function submitContactForm(data: ContactFormInput): Promise<ActionResult>
```

**Validation**: `contactSchema` (Zod)  
**Side Effects**: Insere em `contact_submissions`  
**Spam Protection**: Rejeita se `_honeypot` preenchido

### Event Registration

```typescript
// app/actions/events.ts
'use server'

type EventRegistrationInput = {
  eventId: string;
  name: string;          // min 2, max 100
  email: string;         // valid email
  phone?: string;        // optional, valid phone
  attendees: number;     // min 1, max 20
  _honeypot?: string;
}

async function registerForEvent(data: EventRegistrationInput): Promise<ActionResult>
```

**Validation**: `eventRegistrationSchema` (Zod)  
**Side Effects**: Insere em `event_registrations`  
**Business Rule**: Verificar se `registrationEnabled` e capacidade disponível

### Group Interest

```typescript
// app/actions/groups.ts
'use server'

type GroupInterestInput = {
  groupId: string;
  name: string;          // min 2, max 100
  email: string;         // valid email
  message?: string;      // max 500
  _honeypot?: string;
}

async function expressGroupInterest(data: GroupInterestInput): Promise<ActionResult>
```

**Validation**: `groupInterestSchema` (Zod)  
**Side Effects**: Insere em `group_interests`

### Newsletter

```typescript
// app/actions/newsletter.ts
'use server'

type NewsletterInput = {
  email: string;
  locale: 'fr' | 'pt' | 'en';
  _honeypot?: string;
}

async function subscribeNewsletter(data: NewsletterInput): Promise<ActionResult>
```

**Validation**: `newsletterSchema` (Zod)  
**Side Effects**: Insere em `newsletter_subscribers`  
**Business Rule**: Verificar email duplicado

---

## Response Patterns

Todas as Server Actions seguem o padrão:

```typescript
// Sucesso
{ success: true }

// Erro de validação
{ success: false, error: "validation_error" }

// Erro de servidor
{ success: false, error: "server_error" }

// Erro de negócio
{ success: false, error: "event_full" | "already_subscribed" }
```

## Caching Strategy

```typescript
// Data fetching functions usam cache do Next.js
import { unstable_cache } from 'next/cache';

const getCachedSermons = unstable_cache(
  getSermons,
  ['sermons'],
  { revalidate: 300, tags: ['sermons'] } // 5 min cache
);

const getCachedLocations = unstable_cache(
  getLocations,
  ['locations'],
  { revalidate: 3600, tags: ['locations'] } // 1h cache (raramente muda)
);
```

| Collection | Cache TTL | Rationale |
|-----------|-----------|-----------|
| sermons | 5 min | Atualizado semanalmente |
| events | 5 min | Atualizado frequentemente |
| blog_posts | 5 min | Atualizado irregularmente |
| groups | 15 min | Raramente muda |
| locations | 1h | Quase nunca muda |
| leadership | 1h | Quase nunca muda |
