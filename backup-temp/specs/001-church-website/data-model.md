# Data Model: Igreja Cévennes Website

**Date**: 2026-02-11 | **Phase**: 1 - Design & Contracts

## Entities

### Sermon

Representa um sermão/mensagem gravada da igreja.

**Collection**: `sermons`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | `ObjectId` | auto | Identificador único |
| `title` | `MultilingualText` | ✅ | Título do sermão |
| `description` | `MultilingualText` | ❌ | Descrição/resumo |
| `preacher` | `string` | ✅ | Nome do pregador |
| `date` | `Date` | ✅ | Data da pregação |
| `biblicalReference` | `BibleRef` | ❌ | Referência bíblica (livro, capítulo, versículos) |
| `series` | `string \| null` | ❌ | Nome da série/playlist |
| `seriesOrder` | `number \| null` | ❌ | Posição na série |
| `youtubeVideoId` | `string` | ✅ | ID do vídeo no YouTube |
| `pdfNotesUrl` | `string \| null` | ❌ | URL do PDF com notas |
| `tags` | `string[]` | ❌ | Temas/tags |
| `duration` | `number \| null` | ❌ | Duração em minutos |
| `slug` | `string` | ✅ | URL-friendly identifier |
| `active` | `boolean` | ✅ | Soft delete flag |
| `createdAt` | `Date` | auto | Data de criação |
| `updatedAt` | `Date` | auto | Última atualização |

**Indexes**: `slug` (unique), `date` (desc), `preacher`, `series`, `tags`

---

### Event

Representa um evento ou atividade da igreja.

**Collection**: `events`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | `ObjectId` | auto | Identificador único |
| `title` | `MultilingualText` | ✅ | Título do evento |
| `description` | `MultilingualText` | ✅ | Descrição completa |
| `eventType` | `EventType` | ✅ | Tipo do evento |
| `startDate` | `Date` | ✅ | Data/hora de início |
| `endDate` | `Date \| null` | ❌ | Data/hora de término |
| `locationId` | `ObjectId` | ✅ | Referência à Location |
| `customAddress` | `string \| null` | ❌ | Endereço customizado (se fora das sedes) |
| `featuredImage` | `string \| null` | ❌ | URL da imagem principal |
| `registrationEnabled` | `boolean` | ✅ | Habilitar inscrição |
| `capacity` | `number \| null` | ❌ | Limite de participantes |
| `slug` | `string` | ✅ | URL-friendly identifier |
| `active` | `boolean` | ✅ | Soft delete flag |
| `createdAt` | `Date` | auto | Data de criação |
| `updatedAt` | `Date` | auto | Última atualização |

**EventType** (enum): `service`, `conference`, `community`, `youth`, `outreach`, `prayer`, `other`

**Indexes**: `slug` (unique), `startDate` (desc), `eventType`, `locationId`, `active`

**State Transitions**: 
- Upcoming (`startDate > now`) → Ongoing (`startDate <= now <= endDate`) → Past (`endDate < now`)
- Past events auto-hidden from main listing, available in archive

---

### Location

Representa uma sede/local físico da igreja.

**Collection**: `locations`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | `ObjectId` | auto | Identificador único |
| `name` | `string` | ✅ | Nome da localização (Saint-Hippolyte, Lasalle, Monoblet) |
| `address` | `string` | ✅ | Endereço completo |
| `city` | `string` | ✅ | Cidade |
| `postalCode` | `string` | ✅ | Código postal |
| `country` | `string` | ✅ | País (default: France) |
| `coordinates` | `{ lat: number; lng: number }` | ✅ | Coordenadas GPS |
| `worshipSchedule` | `MultilingualText` | ✅ | Horários de culto formatados |
| `contactPhone` | `string \| null` | ❌ | Telefone de contato |
| `contactEmail` | `string \| null` | ❌ | Email de contato |
| `active` | `boolean` | ✅ | Soft delete flag |

**Indexes**: `name` (unique)

---

### CommunityGroup

Representa um grupo/ministério da igreja.

**Collection**: `groups`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | `ObjectId` | auto | Identificador único |
| `name` | `MultilingualText` | ✅ | Nome do grupo |
| `description` | `MultilingualText` | ✅ | Descrição do grupo |
| `groupType` | `GroupType` | ✅ | Tipo de grupo |
| `leaderName` | `string` | ✅ | Nome do líder |
| `leaderContact` | `string \| null` | ❌ | Contato do líder (email/telefone) |
| `meetingDay` | `DayOfWeek` | ✅ | Dia da semana |
| `meetingTime` | `string` | ✅ | Horário (ex: "19:00") |
| `locationId` | `ObjectId \| null` | ❌ | Referência à Location |
| `customAddress` | `string \| null` | ❌ | Endereço customizado |
| `maxCapacity` | `number \| null` | ❌ | Capacidade máxima |
| `featuredImage` | `string \| null` | ❌ | Imagem do grupo |
| `active` | `boolean` | ✅ | Soft delete flag |
| `createdAt` | `Date` | auto | Data de criação |
| `updatedAt` | `Date` | auto | Última atualização |

**GroupType** (enum): `bible_study`, `prayer`, `youth`, `women`, `men`, `seniors`, `worship`, `outreach`, `other`

**DayOfWeek** (enum): `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`

**Indexes**: `groupType`, `meetingDay`, `active`

---

### BlogArticle

Representa um artigo de blog ou notícia.

**Collection**: `blog_posts`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | `ObjectId` | auto | Identificador único |
| `title` | `MultilingualText` | ✅ | Título do artigo |
| `content` | `MultilingualText` | ✅ | Conteúdo completo (rich text/markdown) |
| `excerpt` | `MultilingualText` | ✅ | Resumo/trecho para listagem |
| `author` | `string` | ✅ | Nome do autor |
| `authorBio` | `string \| null` | ❌ | Bio curta do autor |
| `publishedAt` | `Date` | ✅ | Data de publicação |
| `featuredImage` | `string \| null` | ❌ | Imagem principal |
| `categories` | `string[]` | ✅ | Categorias |
| `tags` | `string[]` | ❌ | Tags adicionais |
| `slug` | `string` | ✅ | URL-friendly identifier |
| `published` | `boolean` | ✅ | Publicado ou rascunho |
| `active` | `boolean` | ✅ | Soft delete flag |
| `createdAt` | `Date` | auto | Data de criação |
| `updatedAt` | `Date` | auto | Última atualização |

**Indexes**: `slug` (unique), `publishedAt` (desc), `categories`, `tags`, `published`

---

### LeadershipMember

Representa um membro da equipe pastoral/liderança.

**Collection**: `leadership`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | `ObjectId` | auto | Identificador único |
| `fullName` | `string` | ✅ | Nome completo |
| `role` | `MultilingualText` | ✅ | Cargo/título |
| `bio` | `MultilingualText` | ✅ | Biografia |
| `photoUrl` | `string \| null` | ❌ | URL da foto de perfil |
| `email` | `string \| null` | ❌ | Email de contato |
| `ministryAreas` | `string[]` | ❌ | Áreas de ministério |
| `order` | `number` | ✅ | Ordem de exibição |
| `active` | `boolean` | ✅ | Soft delete flag |

**Indexes**: `order` (asc), `active`

---

### ContactSubmission

Representa uma submissão do formulário de contato.

**Collection**: `contact_submissions`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | `ObjectId` | auto | Identificador único |
| `name` | `string` | ✅ | Nome do remetente |
| `email` | `string` | ✅ | Email do remetente |
| `subject` | `string` | ✅ | Assunto |
| `message` | `string` | ✅ | Mensagem |
| `read` | `boolean` | ✅ | Lido pela equipe (default: false) |
| `createdAt` | `Date` | auto | Data de envio |

---

### EventRegistration

Representa uma inscrição em evento.

**Collection**: `event_registrations`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | `ObjectId` | auto | Identificador único |
| `eventId` | `ObjectId` | ✅ | Referência ao evento |
| `name` | `string` | ✅ | Nome do participante |
| `email` | `string` | ✅ | Email |
| `phone` | `string \| null` | ❌ | Telefone |
| `attendees` | `number` | ✅ | Número de participantes (default: 1) |
| `createdAt` | `Date` | auto | Data da inscrição |

---

### GroupInterest

Representa interesse em participar de um grupo.

**Collection**: `group_interests`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | `ObjectId` | auto | Identificador único |
| `groupId` | `ObjectId` | ✅ | Referência ao grupo |
| `name` | `string` | ✅ | Nome do interessado |
| `email` | `string` | ✅ | Email |
| `message` | `string \| null` | ❌ | Mensagem opcional |
| `createdAt` | `Date` | auto | Data da solicitação |

---

## Shared Types

### MultilingualText

```typescript
interface MultilingualText {
  fr: string;
  pt: string;
  en: string;
}
```

### BibleRef

```typescript
interface BibleRef {
  book: string;       // Ex: "Gênesis", "John"
  chapter: number;    // Ex: 3
  verses?: string;    // Ex: "16-18" ou "16"
}
```

### Pagination

```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Relationships

```
Location (1) ←→ (N) Event
Location (1) ←→ (N) CommunityGroup
Event (1) ←→ (N) EventRegistration
CommunityGroup (1) ←→ (N) GroupInterest
```

## Validation Rules

| Entity | Field | Rule |
|--------|-------|------|
| All forms | `email` | Valid email format (RFC 5322) |
| All forms | `name` | Min 2, max 100 characters |
| ContactSubmission | `message` | Min 10, max 2000 characters |
| EventRegistration | `attendees` | Min 1, max 20 |
| Sermon | `youtubeVideoId` | Match YouTube ID pattern `[a-zA-Z0-9_-]{11}` |
| Sermon | `slug` | Lowercase, alphanumeric, hyphens only |
| BlogArticle | `categories` | Min 1 category |
