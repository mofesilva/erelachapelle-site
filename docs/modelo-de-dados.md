# Modelo de Dados — Entidades

> Estrutura de campos de cada entidade de conteúdo do site, como base para o desenho do banco de dados da futura API. Baseado nos tipos atuais em `src/types/`, com os campos de auditoria normalizados entre todas as entidades.
>
> O documento tem duas partes: **Parte 1** são as entidades que já existem hoje no código (`src/types/`). **Parte 2** é o panorama de entidades candidatas — coisas que hoje são texto solto (`string[]` de categorias/tags/série), conteúdo hardcoded (banners, menu, configurações do site) ou formulários que não persistem nada — propostas para deixar o backoffice completo. Nenhuma decisão de adoção foi tomada ainda; é só o panorama geral.
>
> **Escopo**: este documento cobre só **entidades de top-level** — o que vira collection própria no banco, com `_id` (ver regra "entidade vs. objeto de valor" em [decisoes-arquitetura.md](./decisoes-arquitetura.md)). Qualquer estrutura que não seja top-level (subdocumento/objeto de valor exclusivo de uma entidade) é descrita direto embutida na tabela da entidade que a usa, sem virar seção própria — como já foi feito com `Sermon.biblicalReference` e `Location.coordinates`. A única exceção é `MultilingualText`, que fica documentado à parte porque é reutilizado por quase toda entidade e tem semântica própria (fluxo de tradução) que precisa ficar bem clara.

---

## Tipos compartilhados

Usados como campos embutidos nas entidades abaixo.

### MultilingualText

Francês é o idioma fonte — sempre preenchido por quem escreve o conteúdo. Português e inglês são preenchidos sob demanda, via botão "traduzir" (chamada à API de tradução) no editor, com o resultado editável antes de confirmar. Podem ficar vazios indefinidamente: o autor pode salvar só em francês e traduzir depois, quando quiser. Se `pt`/`en` estiverem vazios, o site exibe o conteúdo em `fr` como fallback nesse idioma.

| Campo | Tipo | Descrição |
|---|---|---|
| `fr` | `string` | Conteúdo em francês (idioma fonte, sempre obrigatório) |
| `pt` | `string?` | Conteúdo em português (opcional — vazio até alguém traduzir) |
| `en` | `string?` | Conteúdo em inglês (opcional — vazio até alguém traduzir) |
| `staleTranslation` | `{ pt?: boolean; en?: boolean }` | Marca se o `fr` foi editado depois da última tradução confirmada para aquele idioma. Só gera aviso visual no editor ("francês mudou desde a tradução") — não bloqueia salvar nem publicar. |

---

## Campos de auditoria (padrão em todas as entidades)

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `ObjectId` | Identificador único |
| `createdAt` | `Date` | Data de criação |
| `updatedAt` | `Date` | Data da última atualização |
| `active` | `boolean` | Soft delete |

---

# Parte 1 — Entidades atuais do site

## Sermon

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `title` | `MultilingualText` |
| `description` | `MultilingualText?` |
| `preacher` | `string` |
| `date` | `Date` |
| `biblicalReference` | `object?` — sem entidade/collection própria no banco; forma (hoje: `book`, `chapter`, `verses`) definida pelo front-end. A validação desse formato, se existir, é responsabilidade da camada de API/validação — não é modelagem de banco. |
| `series` | `MultilingualText?` — indexado por `series.fr` (agrupamento/filtro por série) |
| `seriesOrder` | `number?` |
| `youtubeVideoId` | `string` |
| `notes` | `{ id: ObjectId; url: string; fileType: "pdf" \| "epub" }?` (→ MediaAsset, `documentType: "notes"`) |
| `tags` | `string[]` |
| `duration` | `number?` |
| `slug` | `string` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

---

## Event

**EventType** (enum): `service` \| `conference` \| `community` \| `youth` \| `outreach` \| `prayer` \| `other`

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `title` | `MultilingualText` |
| `description` | `MultilingualText` |
| `eventType` | `EventType` |
| `startDate` | `Date` |
| `endDate` | `Date?` |
| `location` | `{ id: ObjectId; name: string; address: string; coordinates: { lat: number; lng: number } }` (→ Location) |
| `customAddress` | `string?` |
| `featuredImage` | `string?` |
| `capacity` | `number?` |
| `slug` | `string` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

---

## CommunityGroup

**GroupType** (enum): `bible_study` \| `prayer` \| `youth` \| `women` \| `men` \| `seniors` \| `worship` \| `outreach` \| `other`

**DayOfWeek** (enum): `monday` \| `tuesday` \| `wednesday` \| `thursday` \| `friday` \| `saturday` \| `sunday`

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `name` | `MultilingualText` |
| `description` | `MultilingualText` |
| `groupType` | `GroupType` |
| `leaderName` | `string` |
| `leaderContact` | `string?` |
| `meetingDay` | `DayOfWeek` |
| `meetingTime` | `string` |
| `location` | `{ id: ObjectId; name: string; address: string; coordinates: { lat: number; lng: number } }?` (→ Location) |
| `customAddress` | `string?` |
| `maxCapacity` | `number?` |
| `featuredImage` | `string?` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

---

## BlogArticle

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `title` | `MultilingualText` |
| `content` | `MultilingualText` |
| `excerpt` | `MultilingualText` |
| `author` | `string` |
| `authorBio` | `string?` |
| `publishedAt` | `Date` |
| `featuredImage` | `string?` |
| `categories` | `string[]` |
| `tags` | `string[]` |
| `slug` | `string` |
| `published` | `boolean` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

---

## LeadershipMember

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `slug` | `string` |
| `fullName` | `string` |
| `role` | `MultilingualText` |
| `bio` | `MultilingualText` |
| `fullBio` | `MultilingualText` |
| `photoUrl` | `string?` |
| `email` | `string?` |
| `ministryAreas` | `string[]` |
| `order` | `number` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

---

## Location

`coordinates` é um subdocumento exclusivo desta entidade (não é reutilizado em nenhuma outra) — `{ lat: number, lng: number }`.

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `name` | `string` |
| `address` | `string` |
| `city` | `string` |
| `postalCode` | `string` |
| `country` | `string` |
| `coordinates` | `{ lat: number; lng: number }` |
| `worshipSchedule` | `MultilingualText` |
| `contactPhone` | `string?` |
| `contactEmail` | `string?` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

---

# Parte 2 — Entidades candidatas (panorama para o backoffice completo)

## II.1 Conceitos hoje soltos como `string[]`, propostos como entidades próprias

Hoje `categories` é texto livre repetido em cada registro — sem tradução, sem página própria, sem consistência entre registros.

(`series` foi avaliado e descartado como entidade própria — ver nota na Parte 1, ficou como campo `MultilingualText` indexado direto em `Sermon`. `Tag` também foi avaliado e descartado: dado o público-alvo majoritariamente idoso — que navega melhor por categorias simples do que por busca granular por palavra-chave — e o baixo volume de conteúdo hoje, não compensa manter uma entidade de tags. Se um dia for necessário, entra como campo simples `tags: string[]` direto em `Post`/`Sermon`, com índice, sem virar collection própria — mesmo padrão do `series`.)

### Category (categoria de post)

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `ObjectId` | |
| `name` | `MultilingualText` | Nome da categoria (ex.: "Notícias", "Testemunhos") |
| `slug` | `string` | Identificador único pra URL (ex.: `/blog/categoria/noticias`) — índice único |
| `description` | `MultilingualText?` | Descrição opcional da categoria |
| `displayOrder` | `number?` | Ordem de exibição no menu/filtro; definida por quem cria/gerencia as categorias, via lista reordenável (drag-and-drop) no backoffice |
| `active` | `boolean` | Soft delete |
| `createdAt` | `Date` | |
| `updatedAt` | `Date` | |

### Theme (Tema)

Taxonomia transversal, ligando `Sermon` + `Post` + `Event` a um mesmo assunto teológico (ex.: "Graça", "Família", "Missões"). Diferente de `Category` (curada, com tela própria de gestão): `Theme` não tem tela dedicada — funciona como um select estilo Notion, no campo "tema" ao criar o conteúdo. A pessoa digita; se o tema já existe, seleciona; se não existe, é criado ali mesmo, na hora. Por isso os campos são mínimos — nada que dependa de uma tela de gestão que não vai existir.

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `ObjectId` | |
| `name` | `MultilingualText` | Criado inline a partir do que a pessoa digitou |
| `slug` | `string` | Gerado automaticamente a partir do `name`, não digitado por ninguém |
| `active` | `boolean` | |
| `createdAt` | `Date` | |
| `updatedAt` | `Date` | |

## II.2 Post (proposta de unificação do Blog)

Substitui `BlogArticle`. Sem `postType` — essa classificação já é papel da `Category` (ver decisão em II.1). Referências a `Category`/`Theme`/`MediaAsset` seguem o Extended Reference Pattern (ver `decisoes-arquitetura.md`, seção 2): guardam o `id` junto com os campos exibidos, não só o `ObjectId` puro.

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `ObjectId` | |
| `title` | `MultilingualText` | |
| `content` | `MultilingualText` | |
| `excerpt` | `MultilingualText` | |
| `author` | `string` | |
| `category` | `{ id: ObjectId; name: MultilingualText }` (→ Category) | |
| `tags` | `string[]?` | Indexado; sem entidade própria (ver nota em II.1) |
| `themes` | `{ id: ObjectId; name: MultilingualText }[]?` (→ Theme) | |
| `featuredImage` | `{ id: ObjectId; url: string; altText?: MultilingualText }?` (→ MediaAsset) | |
| `publishedAt` | `Date` | |
| `published` | `boolean` | |
| `active` | `boolean` | |
| `createdAt` | `Date` | |
| `updatedAt` | `Date` | |

## II.3 PodcastEpisode

Mesmo conteúdo do sermão, formato diferente (áudio, plataformas externas). Ligado a um `Sermon` por `sermonId?` opcional, para permitir também episódios que não são sermão de domingo.

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `title` | `MultilingualText` |
| `description` | `MultilingualText?` |
| `sermonId` | `ObjectId?` (→ Sermon) |
| `audioUrl` | `string` |
| `spotifyUrl` | `string?` |
| `applePodcastsUrl` | `string?` |
| `episodeNumber` | `number?` |
| `duration` | `number?` |
| `publishedAt` | `Date` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

## II.4 Estrutura institucional hoje hardcoded

### SiteSettings (singleton)

Hoje: `SITE_CONFIG` fixo em `src/lib/constants/index.ts`.

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `name` | `MultilingualText` |
| `description` | `MultilingualText` |
| `url` | `string` |
| `socialMedia` | `{ facebook?, instagram?, tiktok?, youtube?: string }` |
| `updatedAt` | `Date` |

### Banner

Hoje: imagens fixas no JSX (ex.: `/images/igreja-lachappelle-hero-banner-2.jpg`).

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `image` | `string` |
| `title` | `MultilingualText?` |
| `ctaText` | `MultilingualText?` |
| `ctaLink` | `string?` |
| `placement` | `"home_hero" \| "home_gathering" \| "about_hero" \| "contact_hero"` |
| `displayOrder` | `number` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

### MediaAsset

Pool único de arquivos enviados ao site (imagens e documentos), reutilizável em qualquer lugar — banners, `featuredImage` de posts, álbuns, notas de sermão, boletins, guias de estudo, ebooks. Substitui o que antes eram duas entidades separadas (`Gallery` + `Artifact`) — a diferença entre imagem e documento vira só o valor de `fileType`, não uma collection à parte. O arquivo em si nunca é traduzido (mesma regra de vídeo/áudio/ebook); a `url` nunca muda depois do upload — a única alteração possível é soft delete.

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `ObjectId` | |
| `fileType` | `"pdf" \| "png" \| "jpeg" \| "epub"` | Formato específico do arquivo |
| `documentType` | `"bulletin" \| "notes" \| "study_guide" \| "book"?` | Só existe se `fileType` for `pdf`/`epub`; ausente se for imagem (`png`/`jpeg`) |
| `title` | `MultilingualText?` | |
| `altText` | `MultilingualText?` | Só relevante se `fileType` for `png`/`jpeg` |
| `description` | `MultilingualText?` | |
| `url` | `string` | |
| `slug` | `string?` | Só relevante pra documento com página pública de download |
| `active` | `boolean` | |
| `createdAt` | `Date` | |
| `updatedAt` | `Date` | |

### Album

Um álbum de fotos (ex.: "Retiro de Família 2026"), agrupando imagens que já existem em `MediaAsset`. Segue o Extended Reference Pattern: cada entrada guarda o `id` da imagem junto com `url`/`altText`, evitando lookup pra exibir o álbum.

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `title` | `MultilingualText` |
| `slug` | `string` |
| `description` | `MultilingualText?` |
| `images` | `{ id: ObjectId; url: string; altText?: MultilingualText }[]` (→ MediaAsset) |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

### MenuItem

Hoje: `navItems` hardcoded em `Header.tsx`/`Footer.tsx`, a maioria comentada (`sermons`, `events`, `community`, `blog` ocultos).

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `label` | `MultilingualText` |
| `href` | `string` |
| `displayOrder` | `number` |
| `visible` | `boolean` |

### FAQ

Não existe hoje no site.

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `question` | `MultilingualText` |
| `answer` | `MultilingualText` |
| `displayOrder` | `number` |
| `active` | `boolean` |

### Ministry (Ministério)

Hoje só existe `CommunityGroup` (grupo pequeno recorrente) e 1 `LeadershipMember`. Não há um nível organizacional acima disso (ex.: "Ministério de Louvor", "Ministério Infantil") agrupando pessoas e grupos.

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `name` | `MultilingualText` |
| `description` | `MultilingualText?` |
| `leaderIds` | `ObjectId[]` (→ LeadershipMember) |
| `featuredImage` | `string?` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

## II.5 Formulários que hoje só enviam e-mail ou simulam sucesso — candidatos a persistência

| Entidade | Situação hoje |
|---|---|
| ContactSubmission | Só envia e-mail via Resend (`src/app/actions/contact.ts`), nada é salvo |
| NewsletterSubscriber | Server Action simula sucesso (`src/app/actions/newsletter.ts`), não salva nada |
| EventRegistration | Não existe — `Event.capacity` existe mas não há inscrição |
| GroupInterest | Não existe |
| PrayerRequest | Não existe, mas é padrão em site de igreja |

### ContactSubmission

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `name` | `string` |
| `email` | `string` |
| `subject` | `string` |
| `message` | `string` |
| `read` | `boolean` |
| `createdAt` | `Date` |

### NewsletterSubscriber

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `email` | `string` |
| `preferredLanguage` | `Locale` |
| `confirmed` | `boolean` |
| `createdAt` | `Date` |

### EventRegistration

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `eventId` | `ObjectId` (→ Event) |
| `name` | `string` |
| `email` | `string` |
| `phone` | `string?` |
| `attendees` | `number` |
| `createdAt` | `Date` |

### GroupInterest

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `groupId` | `ObjectId` (→ CommunityGroup) |
| `name` | `string` |
| `email` | `string` |
| `message` | `string?` |
| `createdAt` | `Date` |

### PrayerRequest (Pedido de oração)

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `description` | `string` |
| `requesterName` | `string?` |
| `isAnonymous` | `boolean` |
| `isPublic` | `boolean` |
| `status` | `"open" \| "in_progress" \| "answered" \| "closed"` |
| `createdAt` | `Date` |

## II.6 Administrativo

### User

Quem loga no backoffice. Autenticação por e-mail/senha; contas criadas manualmente por um admin (sem cadastro público, sem verificação de e-mail).

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `ObjectId` | |
| `name` | `string` | Nome de exibição |
| `email` | `string` | Login, único |
| `passwordHash` | `string` | Hash da senha (bcrypt/argon2) — nunca a senha em texto puro |
| `role` | `"admin" \| "editor" \| "viewer"` | Nível de permissão |
| `active` | `boolean` | Soft delete — desativar acesso sem apagar o usuário |
| `lastLoginAt` | `Date?` | Último login |
| `createdAt` | `Date` | |
| `updatedAt` | `Date` | |

### Session

Sessão de login autenticada por JWT: o access token (JWT) é stateless e não é salvo no banco — só o refresh token é persistido, para poder ser revogado/expirado. Um usuário pode ter até **5 sessões simultâneas** (dispositivos/lugares diferentes); isso é regra de aplicação, não uma restrição do schema — ao criar uma sessão nova além do limite, a mais antiga do mesmo `userId` é removida.

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | `ObjectId` | |
| `userId` | `ObjectId` (→ User) | |
| `refreshTokenHash` | `string` | Hash do refresh token — nunca o token puro |
| `userAgent` | `string?` | Ex.: "Chrome no Windows", pra uma tela de "meus dispositivos" |
| `createdAt` | `Date` | |
| `lastUsedAt` | `Date?` | Atualizado a cada uso do refresh token pra gerar novo access token |
| `expiresAt` | `Date` | Índice **TTL** — MongoDB apaga a sessão sozinho ao expirar, sem job/cron |

### Donation/Offering (Doação/Oferta)

Registro administrativo (lançado manualmente, ex. pela tesouraria) — não é um fluxo de pagamento online.

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `donorName` | `string?` |
| `isAnonymous` | `boolean` |
| `amount` | `number` |
| `currency` | `string` |
| `purpose` | `"general" \| "missions" \| "building" \| "other"` |
| `paymentMethod` | `"bank_transfer" \| "cash" \| "check" \| "other"` |
| `donationDate` | `Date` |
| `createdAt` | `Date` |
