# Contexto e Referência — cevennes-site

> Documentação de referência do estado atual do projeto, escrita a partir da leitura direta do código-fonte. Serve como fonte da verdade para o planejamento da futura API e backoffice.

---

## 1. Visão geral

O `cevennes-site` é o site institucional da **Église Réformée Évangélique La Chapelle**, uma igreja em Saint-Hippolyte-du-Fort, França. Hoje o site é **inteiramente estático**: todo o conteúdo (eventos, sermões, grupos, equipe, textos institucionais) está hardcoded em arrays TypeScript e componentes React, sem banco de dados e sem API própria.

**Stack técnica:**
- **Framework**: Next.js 16.1 (App Router, React 19, React Compiler habilitado)
- **Linguagem**: TypeScript 5 (strict mode)
- **Estilo**: Tailwind CSS 4 + componentes baseados em Radix UI (`components.json` no padrão shadcn/ui)
- **i18n**: `next-intl` 4.8 — francês (padrão), português e inglês
- **Formulários**: React Hook Form 7 + Zod 4
- **E-mail transacional**: Resend
- **Ícones**: Solar Icon Set
- **Dados**: arrays estáticos em memória em `src/lib/data/`, importados diretamente no bundle

**Estrutura de alto nível de `src/`:**
```
src/
  app/
    [locale]/          # rotas públicas, uma árvore por idioma (fr/pt/en)
      (public)/         # grupo de rotas: about, contact, blog, events, sermons, community
      _components/       # componentes de página/seção da home e layout (Header, Footer, etc.)
    actions/            # Server Actions (contato, newsletter)
  types/                # interfaces/tipos TypeScript de cada entidade de conteúdo
  lib/
    data/               # os arrays de dados hardcoded + funções de leitura/filtro
    constants/          # configuração global do site (SITE_CONFIG)
    validations/        # schemas Zod dos formulários
    integrations/       # helpers para serviços externos (e-mail, YouTube, Maps)
  messages/             # arquivos de tradução (fr.json, pt.json, en.json)
  i18n/                 # configuração do next-intl
```

---

## 2. Entidades de conteúdo

Todas as entidades seguem o mesmo padrão: um tipo TypeScript em `src/types/`, um array de dados e funções de leitura/filtro em `src/lib/data/`. Textos visíveis ao usuário usam o tipo compartilhado `MultilingualText` (`src/types/common.ts`):

```typescript
interface MultilingualText {
  fr: string;
  pt: string;
  en: string;
}
```

Outros tipos compartilhados no mesmo arquivo:
```typescript
interface BibleRef {
  book: string;
  chapter: number;
  verses?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

type Locale = "fr" | "pt" | "en";
```

### 2.1 Sermon (sermões)

- **Tipo**: `src/types/sermon.ts`
- **Dados**: `src/lib/data/sermons.ts` — constante `SERMONS`, atualmente **4 itens**

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `string` | Identificador único |
| `title` | `MultilingualText` | Título do sermão |
| `description` | `MultilingualText?` | Descrição/resumo |
| `preacher` | `string` | Nome do pregador |
| `date` | `string` (ISO) | Data da pregação |
| `biblicalReference` | `BibleRef?` | Livro, capítulo e versículos |
| `series` | `string?` | Nome da série |
| `seriesOrder` | `number?` | Posição na série |
| `youtubeVideoId` | `string` | ID do vídeo no YouTube |
| `pdfNotesUrl` | `string?` | URL do PDF com notas |
| `tags` | `string[]` | Temas |
| `duration` | `number?` | Duração em minutos |
| `slug` | `string` | Identificador amigável para URL |
| `active` | `boolean` | Flag de soft delete |
| `createdAt` / `updatedAt` | `string` | Timestamps |

Exemplo real de registro:
```typescript
{
  _id: "sermon-1",
  title: { fr: "La grâce qui transforme", pt: "...", en: "..." },
  description: { fr: "...", pt: "...", en: "..." },
  slug: "la-grace-qui-transforme",
  date: "2026-02-09",
  preacher: "Jean-Marc Dupont",
  series: "Les fondements de la foi",
  biblicalReference: { book: "Éphésiens", chapter: 2, verses: "8-10" },
  youtubeVideoId: "dQw4w9WgXcQ",
  tags: ["grace", "faith"],
  active: true,
  createdAt: "2026-02-09",
  updatedAt: "2026-02-09",
}
```

Funções disponíveis:
| Função | Assinatura | Descrição |
|---|---|---|
| `getRecentSermons` | `(limit = 3) → Sermon[]` | Sermões mais recentes, ordenados por `date` desc |
| `getAllSermons` | `() → Sermon[]` | Todos os sermões ativos, ordenados por `date` desc |
| `getSermonBySlug` | `(slug) → Sermon \| null` | Busca por slug |
| `getSermonPreachers` | `() → string[]` | Lista de pregadores únicos |
| `getSermonSeries` | `() → string[]` | Lista de séries únicas |
| `filterSermons` | `(filters: { preacher?, series? }) → Sermon[]` | Filtro combinado |

### 2.2 Event (eventos)

- **Tipo**: `src/types/event.ts`
- **Dados**: `src/lib/data/events.ts` — constante `EVENTS`, atualmente **4 itens**

```typescript
const EVENT_TYPES = ["service", "conference", "community", "youth", "outreach", "prayer", "other"] as const;
type EventType = (typeof EVENT_TYPES)[number];
```

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `string` | Identificador único |
| `title` | `MultilingualText` | Título do evento |
| `description` | `MultilingualText` | Descrição completa |
| `eventType` | `EventType` | Tipo do evento (ver enum acima) |
| `startDate` | `string` (ISO datetime) | Data/hora de início |
| `endDate` | `string?` (ISO datetime) | Data/hora de término |
| `locationId` | `string` | Referência a uma `Location` |
| `customAddress` | `string?` | Endereço alternativo, se fora das sedes cadastradas |
| `featuredImage` | `string?` | URL da imagem principal |
| `capacity` | `number?` | Limite de participantes |
| `slug` | `string` | Identificador amigável para URL |
| `active` | `boolean` | Flag de soft delete |
| `createdAt` / `updatedAt` | `string` | Timestamps |

Exemplo real de registro:
```typescript
{
  _id: "event-1",
  title: { fr: "Culte de louange spécial", pt: "...", en: "..." },
  description: { fr: "...", pt: "...", en: "..." },
  slug: "culte-louange-special",
  startDate: "2026-03-15T10:00:00",
  endDate: "2026-03-15T12:00:00",
  eventType: "service",
  locationId: "loc-saint-hippolyte",
  active: true,
  createdAt: "2026-02-01",
  updatedAt: "2026-02-01",
}
```

Funções disponíveis:
| Função | Assinatura | Descrição |
|---|---|---|
| `getRecentEvents` | `(limit = 3) → Event[]` | Próximos eventos, ordenados por `startDate` asc |
| `getAllEvents` | `() → Event[]` | Todos os eventos ativos, ordenados por `startDate` asc |
| `getEventBySlug` | `(slug) → Event \| null` | Busca por slug |
| `getEventTypes` | `() → string[]` | Tipos de evento em uso |
| `filterEvents` | `(filters: { eventType?, locationId? }) → Event[]` | Filtro combinado |

### 2.3 CommunityGroup (grupos)

- **Tipo**: `src/types/group.ts`
- **Dados**: `src/lib/data/groups.ts` — constante `GROUPS`, atualmente **4 itens**

```typescript
const GROUP_TYPES = ["bible_study", "prayer", "youth", "women", "men", "seniors", "worship", "outreach", "other"] as const;
type GroupType = (typeof GROUP_TYPES)[number];

const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
```

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `string` | Identificador único |
| `name` | `MultilingualText` | Nome do grupo |
| `description` | `MultilingualText` | Descrição do grupo |
| `groupType` | `GroupType` | Tipo de grupo (ver enum acima) |
| `leaderName` | `string` | Nome do líder |
| `leaderContact` | `string?` | Contato do líder |
| `meetingDay` | `DayOfWeek` | Dia da semana da reunião |
| `meetingTime` | `string` | Horário (ex.: `"20:00"`) |
| `locationId` | `string?` | Referência a uma `Location` |
| `customAddress` | `string?` | Endereço alternativo |
| `maxCapacity` | `number?` | Capacidade máxima |
| `featuredImage` | `string?` | Imagem do grupo |
| `active` | `boolean` | Flag de soft delete |
| `createdAt` / `updatedAt` | `string` | Timestamps |

Exemplo real de registro:
```typescript
{
  _id: "group-1",
  name: { fr: "Étude biblique adultes", pt: "...", en: "..." },
  description: { fr: "...", pt: "...", en: "..." },
  groupType: "bible_study",
  leaderName: "Jean-Marc Dupont",
  meetingDay: "wednesday",
  meetingTime: "20:00",
  locationId: "loc-saint-hippolyte",
  active: true,
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
}
```

Funções disponíveis:
| Função | Assinatura | Descrição |
|---|---|---|
| `getGroups` | `() → CommunityGroup[]` | Todos os grupos ativos |
| `getGroupById` | `(id) → CommunityGroup \| null` | Busca por `_id` |

### 2.4 BlogArticle (artigos)

- **Tipo**: `src/types/blog.ts`
- **Dados**: `src/lib/data/blog.ts` — constante `BLOG_ARTICLES`, atualmente **2 itens**

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `string` | Identificador único |
| `title` | `MultilingualText` | Título do artigo |
| `content` | `MultilingualText` | Conteúdo completo |
| `excerpt` | `MultilingualText` | Resumo para listagem |
| `author` | `string` | Nome do autor |
| `authorBio` | `string?` | Bio curta do autor |
| `publishedAt` | `string` (ISO) | Data de publicação |
| `featuredImage` | `string?` | Imagem principal |
| `categories` | `string[]` | Categorias |
| `tags` | `string[]` | Tags adicionais |
| `slug` | `string` | Identificador amigável para URL |
| `published` | `boolean` | Publicado ou rascunho |
| `active` | `boolean` | Flag de soft delete |
| `createdAt` / `updatedAt` | `string` | Timestamps |

Exemplo real de registro:
```typescript
{
  _id: "article-1",
  title: { fr: "...", pt: "...", en: "..." },
  excerpt: { fr: "...", pt: "...", en: "..." },
  content: { fr: "...", pt: "...", en: "..." },
  slug: "retour-retraite-spirituelle",
  author: "Jean-Marc Dupont",
  categories: ["community"],
  tags: ["retreat", "community"],
  publishedAt: "2026-02-05",
  published: true,
  active: true,
  createdAt: "2026-02-05",
  updatedAt: "2026-02-05",
}
```

Funções disponíveis:
| Função | Assinatura | Descrição |
|---|---|---|
| `getRecentArticles` | `(limit = 3) → BlogArticle[]` | Artigos mais recentes publicados, ordenados por `publishedAt` desc |
| `getAllArticles` | `() → BlogArticle[]` | Todos os artigos ativos e publicados |
| `getArticleBySlug` | `(slug) → BlogArticle \| null` | Busca por slug |
| `getArticleCategories` | `() → string[]` | Categorias em uso |
| `filterArticles` | `(filters: { category? }) → BlogArticle[]` | Filtro por categoria |

### 2.5 LeadershipMember (equipe de liderança)

- **Tipo**: `src/types/leader.ts`
- **Dados**: `src/lib/data/leadership.ts` — constante `LEADERSHIP_TEAM`, atualmente **1 item**

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `string` | Identificador único |
| `slug` | `string` | Identificador amigável para URL |
| `fullName` | `string` | Nome completo |
| `role` | `MultilingualText` | Cargo/título |
| `bio` | `MultilingualText` | Biografia curta |
| `fullBio` | `MultilingualText` | Biografia completa (multi-parágrafo) |
| `photoUrl` | `string?` | URL da foto de perfil |
| `email` | `string?` | E-mail de contato |
| `ministryAreas` | `string[]` | Áreas de ministério |
| `order` | `number` | Ordem de exibição |
| `active` | `boolean` | Flag de soft delete |

Exemplo real de registro (o único hoje):
```typescript
{
  _id: "paulo-sicoli",
  slug: "paulo-sicoli",
  fullName: "Paulo Sicoli",
  photoUrl: "/images/paulo-sicoli.jpg",
  role: { fr: "Pasteur", pt: "Pastor", en: "Pastor" },
  bio: { fr: "...", pt: "...", en: "..." },
  fullBio: { fr: "...", pt: "...", en: "..." },
  ministryAreas: ["teaching", "pastoral-care", "church-planting", "digital"],
  order: 1,
  active: true,
}
```

Funções disponíveis:
| Função | Assinatura | Descrição |
|---|---|---|
| `getLeadershipTeam` | `() → LeadershipMember[]` | Membros ativos, ordenados por `order` asc |
| `getLeaderBySlug` | `(slug) → LeadershipMember \| null` | Busca por slug |

A página "Sobre" (`about/_components/TeamSection.tsx`) exibe o primeiro membro da lista em destaque como o pastor da igreja, e há uma página de biografia individual em `about/pasteur/[slug]/page.tsx`.

### 2.6 Location (sedes/locais)

- **Tipo**: `src/types/location.ts`
- **Dados**: `src/lib/data/locations.ts` — constante `LOCATIONS`, atualmente **1 item**

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `string` | Identificador único |
| `name` | `string` | Nome da localização |
| `address` | `string` | Endereço |
| `city` | `string` | Cidade |
| `postalCode` | `string` | Código postal |
| `country` | `string` | País |
| `coordinates` | `{ lat: number; lng: number }` | Coordenadas GPS |
| `worshipSchedule` | `MultilingualText` | Horário de culto formatado |
| `contactPhone` | `string?` | Telefone de contato |
| `contactEmail` | `string?` | E-mail de contato |
| `active` | `boolean` | Flag de soft delete |

Exemplo real de registro (o único hoje):
```typescript
{
  _id: "loc-saint-hippolyte",
  name: "La Chapelle",
  address: "Bd des Remparts",
  city: "St Hippolyte du Fort",
  postalCode: "30170",
  country: "France",
  coordinates: { lat: 43.9622486, lng: 3.8569039 },
  worshipSchedule: { fr: "Dimanche 10h00", pt: "Domingo 10h00", en: "Sunday 10:00 AM" },
  contactEmail: "erelachapelle@orange.fr",
  active: true,
}
```

Funções disponíveis:
| Função | Assinatura | Descrição |
|---|---|---|
| `getLocations` | `() → Location[]` | Todas as localizações ativas |
| `getLocationById` | `(id) → Location \| null` | Busca por `_id` |

---

## 3. Configuração global do site

Definida em `src/lib/constants/index.ts`:

```typescript
const DEFAULT_LOCALE: Locale = "fr";

const SITE_CONFIG = {
  name: "Église Réformée Évangélique La Chapelle",
  description: "Rassemblés autour de la Parole de Dieu",
  url: "https://erelachapelle.org",
  locations: ["Saint-Hippolyte"] as const,
  socialMedia: {
    facebook: "https://www.facebook.com/erelachapelle/",
    instagram: "https://www.instagram.com/erelachapelle",
    tiktok: "https://www.tiktok.com/@erelachapelle",
    youtube: "https://www.youtube.com/@erelachapelle/featured",
  },
} as const;
```

Esse objeto alimenta: o Header e o Footer (logo, nome, links de redes sociais), a `HeroSection` da home (ícones de redes sociais), e a metadata/SEO base do site (`src/app/[locale]/layout.tsx`, `src/lib/metadata.ts`, `src/lib/structured-data.ts`), onde nome da igreja, descrição e URL também aparecem hardcoded diretamente (em francês, independente do idioma ativo).

---

## 4. Conteúdo exibido nas páginas

A árvore de páginas públicas fica em `src/app/[locale]/`. Cada página é composta de seções (`_components/`) que combinam três fontes de conteúdo: os dados de `src/lib/data/`, as traduções de `src/messages/`, ou texto/imagens fixos diretamente no componente.

### Home (`src/app/[locale]/page.tsx`)

Seções renderizadas, na ordem:
1. **HeroSection** (`_components/HeroSection.tsx` + `HeroBanner.tsx`) — título/subtítulo/CTA vêm de i18n (`homepage.hero.*`); imagem de fundo (`/images/igreja-lachappelle-hero-banner-2.jpg`) e ícones de redes sociais (via `SITE_CONFIG.socialMedia`) são fixos no componente.
2. **FaithStatementSection** — declaração de fé resumida, texto vindo de i18n (`homepage.faith.statement`).
3. **GatheringSection** — "onde nos encontramos": endereço, horário de culto e e-mail vêm de `getLocations()`; imagem de fundo (`/images/inside-church.jpg`) é fixa; rótulos vêm de i18n (`homepage.gathering.*`).
4. **CommunitySection** — destaques da vida em comunidade (estudo bíblico, grupo de oração, vida na igreja): 3 cards com imagem própria (`/images/community/bible-study.jpg`, `/images/community/prayer-group.jpg`, `/images/open-bible-black-background-religion-concept.jpg`) definidos no componente; textos (label/título/descrição) vêm de i18n (`homepage.community.*`).
5. **EventsComingSoonBanner** — banner "em breve" para a seção de eventos, texto via i18n (`homepage.events.*`).
6. **NewsletterSection** (com `NewsletterSplitForm.tsx`) — formulário de inscrição na newsletter, textos via i18n (`homepage.newsletter.*`).

### Sobre (`src/app/[locale]/(public)/about/`)

Página composta por várias seções em `about/_components/`:
- **MissionVisionSection** — missão da igreja e 6 "compromissos" (título + descrição cada), com texto vindo de i18n (`about.missionCommitments`) e um ícone associado a cada compromisso definido no componente; imagem de fundo `/images/cross-1.jpg`.
- **ChurchOriginsSection** — linha do tempo com datas e marcos históricos (`about.originsDates`, array de `{year, label}` vindo de i18n).
- **LocalContextSection** — contexto local da igreja em Saint-Hippolyte-du-Fort, incluindo uma estatística de destaque (percentual histórico da população huguenote da cidade no século XVII) e texto complementar via i18n.
- **ValuesSection** — 6 valores da igreja (palavra, crescimento, testemunho, comunidade, serviço, unidade), cada um com título/descrição vindo de i18n (`about.valuesItems.*`) e um ícone associado no componente.
- **FaithSection** — declaração de fé detalhada em 4 pontos (Deus, Bíblia, Jesus, Espírito), texto vindo de i18n (`about.faithItems.*`).
- **TeamSection** — card do pastor em destaque, usando `getLeadershipTeam()`.
- **VisitCtaSection** — chamada para ação de visita, texto via i18n (`about.cta.*`).
- **`about/pasteur/[slug]/page.tsx`** — página de biografia individual, usando `getLeaderBySlug()`.

### Contato (`src/app/[locale]/(public)/contact/`)

- **ChurchInfoSection** — endereço, horário de culto e e-mail vindos de `getLocations()`; rótulos via i18n (`contact.*`).
- **ContactForm** — formulário com campos nome/e-mail/assunto/mensagem, validado e enviado via Server Action (ver seção 5).

### Blog (`src/app/[locale]/(public)/blog/`)

Listagem e página de detalhe usando `src/lib/data/blog.ts` (título, conteúdo, autor, categoria, data de publicação) combinadas com rótulos de i18n (`blog.*`).

### Comunidade (`src/app/[locale]/(public)/community/groups/[id]/page.tsx`)

Página de detalhe de um grupo, usando `src/lib/data/groups.ts` e `src/lib/data/locations.ts`, com rótulos de i18n (`community.groups.*`).

### Eventos (`src/app/[locale]/(public)/events/`)

Listagem e página de detalhe usando `src/lib/data/events.ts` e `src/lib/data/locations.ts`, com rótulos de i18n (`events.*`).

### Sermões (`src/app/[locale]/(public)/sermons/`)

Listagem e página de detalhe usando `src/lib/data/sermons.ts` (pregador, série, referência bíblica, vídeo do YouTube), com rótulos de i18n (`sermons.*`). Inclui uma chamada para ação para o canal do YouTube da igreja.

### Header e Footer (`src/app/[locale]/_components/Header.tsx`, `Footer.tsx`)

- Logo: `/logos/logo_white_h.png`.
- Itens de menu: Início, Sobre, Contato (rótulos via i18n `navigation.*`).
- Footer: endereço/horário/e-mail vindos de `getLocations()`; links de redes sociais vindos de `SITE_CONFIG.socialMedia`; demais rótulos via i18n (`footer.*`).
- `LanguageSwitcher.tsx` permite alternar entre os 3 idiomas (FR/PT/EN).

---

## 5. Formulários e integrações

### Server Actions (`src/app/actions/`)

**`submitContactForm`** (`contact.ts`)
- Recebe: `name`, `email`, `subject`, `message`, `honeypot` (campo anti-spam oculto).
- Validado por `src/lib/validations/contact.schema.ts` (Zod): `name` 2-100 caracteres, `email` formato válido, `subject` 3-200 caracteres, `message` 10-2000 caracteres.
- Monta um e-mail HTML e envia via **Resend** (`src/lib/integrations/email.ts`) para o endereço configurado em `CONTACT_EMAIL`, com `replyTo` igual ao e-mail informado no formulário.

**`subscribeNewsletter`** (`newsletter.ts`)
- Recebe: `email`, `locale` (`"fr" | "pt" | "en"`), `honeypot`.
- Validado por `src/lib/validations/newsletter.schema.ts` (Zod).
- Hoje apenas valida os dados e retorna sucesso — é a única ação do site pensada para, no futuro, gravar em uma coleção de inscritos.

### Integrações externas (`src/lib/integrations/`)

- **`email.ts`** — instancia o client do **Resend** com a chave `RESEND_API_KEY`, usado pelo formulário de contato.
- **`youtube.ts`** — funções puras `getYouTubeThumbnailUrl(videoId)` e `getYouTubeEmbedUrl(videoId)`, que montam URLs de thumbnail e embed a partir do `youtubeVideoId` armazenado em cada sermão.
- **`maps.ts`** — função `getDirectionsUrl(lat, lng)`, que monta um link do Google Maps para traçar rota até uma `Location`, a partir das coordenadas GPS armazenadas.

---

## 6. Internacionalização (i18n)

O site suporta 3 idiomas — francês (padrão), português e inglês — via `next-intl`. As traduções ficam em `src/messages/fr.json`, `pt.json` e `en.json`, cada um com a mesma estrutura de chaves, organizada nos seguintes namespaces principais:

`common`, `navigation`, `homepage`, `events`, `sermons`, `community`, `blog`, `about`, `contact`, `newsletter`, `footer`.

Dois tipos de conteúdo convivem nesses arquivos:

- **Conteúdo institucional/editorial** — textos mais longos e específicos da igreja, como a declaração de fé (`about.faithItems.*`), os compromissos da missão (`about.missionCommitments`), os valores (`about.valuesItems.*`), a história/origens (`about.originsDates`, `about.originsText`) e a declaração de fé resumida da home (`homepage.faith.statement`).
- **Rótulos de interface** — textos curtos de UI, como labels de formulário (`contact.form.name`, `contact.form.send`), mensagens de sistema (`contact.form.success`, `contact.form.error`) e rótulos de filtro (`events.filterByType`, `sermons.filterByPreacher`).

Dados concretos e estruturados (eventos, sermões, membros da equipe, endereços, horários específicos) não ficam nos arquivos de tradução — eles vêm sempre de `src/lib/data/`, cujos campos multilíngues (`MultilingualText`) já carregam as 3 versões de idioma dentro do próprio registro.

---

## 7. Variáveis de ambiente

Definidas em `.env.local` (não versionado) e usadas hoje pelo código:

| Variável | Uso |
|---|---|
| `RESEND_API_KEY` | Chave de API do Resend, usada em `src/lib/integrations/email.ts` para enviar o e-mail do formulário de contato |
| `CONTACT_EMAIL` | Endereço de e-mail que recebe as submissões do formulário de contato, usado em `src/app/actions/contact.ts` |

O arquivo `.env.example` também documenta variáveis relacionadas a integrações planejadas para o futuro (um serviço de backend chamado "Cappuccino" e a API do Facebook Graph), preparadas para quando o site migrar de dados estáticos para uma API real.
