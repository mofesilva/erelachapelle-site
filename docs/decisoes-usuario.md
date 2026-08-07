# Tabelas definidas

## User

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `name` | `string` |
| `email` | `string` |
| `passwordHash` | `string` |
| `role` | `"admin" \| "editor" \| "viewer"` |
| `active` | `boolean` |
| `lastLoginAt` | `Date?` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

## Sessions

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `userId` | `ObjectId` (→ User) |
| `refreshTokenHash` | `string` |
| `userAgent` | `string?` |
| `createdAt` | `Date` |
| `lastUsedAt` | `Date?` |
| `expiresAt` | `Date` (TTL, máx. 5 sessões por usuário) |

## Events

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `title` | `MultilingualText` |
| `description` | `MultilingualText` |
| `eventType` | `"service" \| "conference" \| "community" \| "youth" \| "outreach" \| "prayer" \| "other"` |
| `startDate` | `Date` |
| `endDate` | `Date?` |
| `location` | `{ id: ObjectId; name: string; address: string; coordinates: { lat: number; lng: number } }` |
| `customAddress` | `string?` |
| `featuredImage` | `string?` |
| `capacity` | `number?` |
| `slug` | `string` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

## CommunityGroups

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `name` | `MultilingualText` |
| `description` | `MultilingualText` |
| `groupType` | `"bible_study" \| "prayer" \| "youth" \| "women" \| "men" \| "seniors" \| "worship" \| "outreach" \| "other"` |
| `leaderName` | `string` |
| `leaderContact` | `string?` |
| `meetingDay` | `"monday" \| "tuesday" \| "wednesday" \| "thursday" \| "friday" \| "saturday" \| "sunday"` |
| `meetingTime` | `string` |
| `location` | `{ id: ObjectId; name: string; address: string; coordinates: { lat: number; lng: number } }?` |
| `customAddress` | `string?` |
| `maxCapacity` | `number?` |
| `featuredImage` | `string?` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

## Sermons

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `title` | `MultilingualText` |
| `description` | `MultilingualText?` |
| `preacher` | `string` |
| `date` | `Date` |
| `biblicalReference` | `object?` |
| `series` | `MultilingualText?` (indexado por `series.fr`) |
| `seriesOrder` | `number?` |
| `youtubeVideoId` | `string` |
| `notes` | `{ id: ObjectId; url: string; fileType: "pdf" \| "epub" }?` (→ MediaAssets) |
| `tags` | `string[]` |
| `duration` | `number?` |
| `slug` | `string` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

## Podcast

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `title` | `MultilingualText` |
| `description` | `MultilingualText?` |
| `sermonId` | `ObjectId?` (→ Sermons) |
| `audioUrl` | `string` |
| `spotifyUrl` | `string?` |
| `applePodcastsUrl` | `string?` |
| `episodeNumber` | `number?` |
| `duration` | `number?` |
| `publishedAt` | `Date` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

## Posts

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `title` | `MultilingualText` |
| `content` | `MultilingualText` |
| `excerpt` | `MultilingualText` |
| `author` | `string` |
| `category` | `{ id: ObjectId; name: MultilingualText }` (→ Category) |
| `tags` | `string[]?` |
| `themes` | `{ id: ObjectId; name: MultilingualText }[]?` |
| `featuredImage` | `{ id: ObjectId; url: string; altText?: MultilingualText }?` (→ MediaAssets) |
| `publishedAt` | `Date` |
| `published` | `boolean` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

> Artigos / Newsletter / Boletins são diferenciados via `category` (3 categorias: "Artigo", "Newsletter", "Boletim") — sem campo novo, mesma lógica usada pra descartar `Tag` e o `postType` original.

## Theme

Sem tela própria de gestão — funciona como select estilo Notion (digita, seleciona se já existe, cria na hora se não existe). Não é sobre visual/cor do site — é uma tag de assunto compartilhada entre Sermons, Posts e Events.

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `name` | `MultilingualText` |
| `slug` | `string` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

## Category

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `name` | `MultilingualText` |
| `slug` | `string` |
| `description` | `MultilingualText?` |
| `displayOrder` | `number?` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

## MediaAssets

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `fileType` | `"pdf" \| "png" \| "jpeg"` |
| `documentType` | `"bulletin" \| "notes" \| "study_guide" \| "book"?` (nulo se imagem) |
| `title` | `MultilingualText?` |
| `altText` | `MultilingualText?` |
| `description` | `MultilingualText?` |
| `url` | `string` |
| `slug` | `string?` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

## Album

| Campo | Tipo |
|---|---|
| `_id` | `ObjectId` |
| `title` | `MultilingualText` |
| `slug` | `string` |
| `description` | `MultilingualText?` |
| `images` | `{ id: ObjectId; url: string; altText?: MultilingualText }[]` |
| `active` | `boolean` |
| `createdAt` | `Date` |
| `updatedAt` | `Date` |

## Members

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
