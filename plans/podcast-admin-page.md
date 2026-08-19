# Plan: Podcast Admin Page (Table + SideSheet), seguindo padrão de Sermons

## Decisões confirmadas com o usuário
- URL do episódio = **URL genérica externa** (texto livre, sem parsing de YouTube).
- Backend `/podcasts` **já existe** no repo irmão `erelachapelle-api` (Express + MongoDB + Zod),
  mesmo contrato de auth/soft-delete de `/sermons`.
- Incluir campo **descrição** (opcional) no form, além de Nome, URL e Data.
- **Gap encontrado**: o schema atual do backend (`erelachapelle-api/src/schemas/podcast.ts`) NÃO
  tem campo de data. Precisa adicionar `date` ao `podcastCreateSchema` (backend) para suportar a
  coluna "Date Published" pedida. Rotas (`routes/podcasts.ts`) usam `parsed.data` genérico —
  adicionar o campo ao schema é suficiente, sem mexer nas rotas.

## Contrato backend confirmado (erelachapelle-api)
- `GET /podcasts` (público) — lista ativos, ordenado por createdAt desc.
- `GET /podcasts/:id` (público)
- `POST /podcasts` (auth editor/admin) — body: `podcastCreateSchema`
- `PUT /podcasts/:id` (auth editor/admin) — body parcial
- `DELETE /podcasts/:id` (auth editor/admin) — soft delete (`active:false`, `deletedAt`)
- Schema atual: `{ title: multilingualTextSchema, description?: multilingualTextSchema, url: z.string().url(), episodeNumber?: number, active: boolean }` + auditFields (`_id, createdAt, updatedAt, deletedAt, createdBy, updatedBy`)
- **Adicionar**: `date: z.coerce.date()` ao `podcastCreateSchema`.

## Steps

### Fase 1 — Backend (erelachapelle-api)
1. Editar `erelachapelle-api/src/schemas/podcast.ts`: adicionar `date: z.coerce.date()` ao
   `podcastCreateSchema` (mesmo padrão do `sermon.ts`). Nenhuma mudança em `routes/podcasts.ts`
   necessária (spread genérico de `parsed.data`).

### Fase 2 — Frontend: feature layer (`src/app/[locale]/admin/_features/podcasts/`)
*Espelha 1:1 `_features/sermons/`, removendo preacher/biblicalReference/categories/themes/slug.*

2. `podcast.type.ts` — tipo `Podcast` (`_id, title: LocalizedText, description?: LocalizedText,
   url: string, date: string, active: boolean, createdAt, updatedAt, createdBy: UserRef,
   updatedBy: UserRef`), reexporta `localizedName` de `../../_lib/localized-text` (mesmo padrão de
   `sermon.type.ts`).
3. `podcast.schema.ts` — `podcastFormSchema` com Zod: `title.fr` (min 1), `description` (string
   opcional, plano — não objeto multilíngue no form), `url` (`z.string().trim().url()`), `date`
   (`z.date()`). *Depends on 2.*
4. `podcast.service.ts` — `listPodcasts()`, `createPodcast()`, `updatePodcast()`,
   `deletePodcast()` via `apiFetch` (reusa `_lib/http-client.ts`). `buildBody()` monta
   `{ title: {fr}, description: description?{fr} : undefined, url, date }`. *Depends on 3.*
5. `podcast.controller.ts` — hook `usePodcasts()`: `fetchAll` (só `listPodcasts`, sem
   categories/themes em paralelo — mais simples que sermons), `create/update/remove`, loading
   mínimo de 400ms (mesmo padrão). *Depends on 4. Parallel with steps 6-8 (componentes).*

### Fase 3 — Frontend: componentes (`src/app/[locale]/admin/_components/podcasts/`)
*Podem ser feitos em paralelo entre si, mas dependem dos tipos da Fase 2 (steps 2-3).*

6. `PodcastsTable.tsx` — espelha `SermonsTable.tsx`, mas colunas: **Icon** (decorativo,
   `PodcastBold` em box toffee-brown, igual ao `MicrophoneBold` de sermons) | **Name**
   (`localizedName(title, locale)`) | **URL** (link truncado, `target="_blank"
   rel="noopener noreferrer"`) | **Date Published** (formatada, fallback "—" se ausente/document
   legado sem data) | **Actions** (edit/delete, mesmos ícones `PenNewSquareBoldDuotone` /
   `TrashBinTrashBoldDuotone`). Mantém skeleton (8 linhas), empty state, error banner, footer com
   contagem total (sem paginação, igual sermons).
7. `PodcastFormSheet.tsx` — espelha `SermonFormSheet.tsx` usando `FormSheet` wrapper: campos Nome
   (`title.fr`, Input), Descrição (Textarea opcional), URL (`Input type="url"`), Data Published
   (`DateTimePicker`, mesmo componente de sermons). Reset de form ao abrir/trocar alvo (mesmo
   `useEffect` pattern). Erros 403/genérico traduzidos (mesmo padrão `ApiError`).
8. `DeletePodcastDialog.tsx` — espelha `DeleteSermonDialog.tsx` (AlertDialog, soft-delete
   30-dias, mensagem com nome do episódio).

### Fase 4 — Página e i18n
9. Substituir placeholder em
   `src/app/[locale]/admin/(app)/podcasts/page.tsx` pelo orquestrador real (mesmo formato de
   `sermons/page.tsx`: `PageHeader` + `PodcastsTable` + `PodcastFormSheet` + `DeletePodcastDialog`
   + estado `sheetOpen/editing/deleting`). *Depends on 5, 6, 7, 8.*
10. Adicionar bloco `admin.podcasts` em `src/messages/{en,fr,pt}.json` (novo irmão de
    `admin.sermons`, mesma estrutura de chaves adaptada: `title, subtitle, add, loading,
    loadError, emptyTitle, emptyDescription, columnName, columnUrl, columnDate, columnActions,
    pageCount, createTitle, editTitle, createDescription, nameLabel, namePlaceholder,
    descriptionLabel, descriptionPlaceholder, urlLabel, urlPlaceholder, dateLabel,
    dateTimePlaceholder, save, saving, cancel, errorForbidden, errorGeneric, edit, delete,
    deleting, deleteTitle, deleteDescription`). Nav label `podcasts` já existe (nav-items.ts já
    aponta pra `/admin/podcasts` com ícone `PodcastBold`) — não precisa mexer lá.

## Relevant files (referência 1:1, Sermons → Podcasts)
- `erelachapelle-api/src/schemas/podcast.ts` — adicionar campo `date`.
- `src/app/[locale]/admin/(app)/sermons/page.tsx` → `.../(app)/podcasts/page.tsx`
- `src/app/[locale]/admin/_components/sermons/SermonsTable.tsx` → `.../podcasts/PodcastsTable.tsx`
- `src/app/[locale]/admin/_components/sermons/SermonFormSheet.tsx` → `.../podcasts/PodcastFormSheet.tsx`
- `src/app/[locale]/admin/_components/sermons/DeleteSermonDialog.tsx` → `.../podcasts/DeletePodcastDialog.tsx`
- `src/app/[locale]/admin/_features/sermons/{sermon.type,sermon.schema,sermon.service,sermon.controller}.ts` → equivalentes `podcast.*.ts`
- `src/app/[locale]/admin/_lib/http-client.ts`, `_lib/localized-text.ts`, `_lib/auth-context.ts` — reuso direto, sem alteração.
- `src/app/[locale]/admin/_components/FormSheet.tsx`, `PageHeader.tsx`, `DateTimePicker.tsx` — reuso direto, sem alteração.
- `src/messages/{en,fr,pt}.json` — adicionar bloco `admin.podcasts`.
- `src/app/[locale]/admin/_lib/nav-items.ts` — já tem entrada `podcasts`, conferir apenas.

## Verification
1. `npm run lint` / `tsc --noEmit` (ou build) no `cevennes-site` — sem erros de tipo nas novas
   camadas.
2. Rodar backend local (`erelachapelle-api`) + frontend, logar como editor/admin, acessar
   `/admin/podcasts`:
   - Tabela carrega (skeleton → lista ou empty state).
   - Criar episódio (nome, descrição, URL, data) → aparece na tabela com data formatada.
   - Editar episódio existente → sheet pré-preenchido, salvar reflete mudanças.
   - Excluir → confirmação, some da lista (soft delete).
3. Testar erro 403 (usuário sem role editor/admin) mostra mensagem traduzida.
4. Conferir troca de idioma (en/fr/pt) — labels e mensagens da página trocam corretamente.

## Escopo excluído
- Página pública de podcasts (site voltado ao visitante) — não pedido, só admin.
- `episodeNumber` do backend — existe no schema mas não foi pedido nas colunas/form; deixado de
  fora da UI por ora.
- Restore/trash admin UI (`/podcasts/trash/list`, `/podcasts/:id/restore`) — fora do escopo pedido
  (só "insert e editar" + tabela).
