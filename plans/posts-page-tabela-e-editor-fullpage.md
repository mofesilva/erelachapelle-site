# Plano: Página de Posts (tabela + editor full-page)

## Contexto
O plano original cobria só o frontend, assumindo o backend "pronto" sem verificar o código real. Investigação em `erelachapelle-api` (schema, rotas, auth, upload) revelou lacunas que travam partes do plano original (paginação, agendamento de publicação, tamanho de payload, criação inline de tema) — essas lacunas viram tarefas de backend abaixo, a fazer **antes ou junto** do frontend, não depois.

## ⚠️ Trabalho necessário no backend (`erelachapelle-api`, repositório separado)

1. **Paginação em `GET /posts`** — hoje devolve o array inteiro sem paginação/filtro/busca (`src/routes/posts.ts`). `categories.ts` já tem o padrão certo: cursor (`?cursor=`, `?limit=`, default 24/máx 100, resposta `{items, nextCursor}`). Replicar esse padrão em `posts.ts` antes de montar `PostsTable`/`usePosts()` com paginação real — senão o frontend pagina client-side sobre a lista inteira (aceitável a curto prazo, mas não escala e diverge do padrão do resto do admin).
2. **Filtro de `published`/`publishedAt` em `GET /posts` e `GET /posts/:id` (rotas públicas)** — hoje filtram só por `active: true`; rascunhos e posts agendados para o futuro já vazam publicamente. Antes de o editor confiar em "agendar publicação futura" via `publishedAt`, a rota pública precisa filtrar `published: true AND publishedAt <= now`. O admin (autenticado) precisa continuar vendo tudo — então isso deve ser condicional: público filtra, admin (com token válido) não. Reportar/ajustar isso é pré-requisito real, não só um "achado a reportar".
3. **Limite de payload JSON** — `express.json()` sem `limit` customizado usa o default do Express (100kb). Conteúdo rico do Tiptap (HTML longo) pode facilmente estourar isso. Aumentar o limite (ex. `express.json({ limit: "5mb" })`) em `src/index.ts`.
4. **Sanitização de HTML em `content`** — não existe hoje (sem `sanitize-html`/`dompurify` nas deps). HTML do Tiptap é salvo cru. Adicionar sanitização (allowlist de tags) no backend ao persistir `POST/PUT /posts`, para não depender só do frontend.
5. **Slug para criação inline de `Theme`** — `POST /themes` exige `slug` obrigatório vindo do cliente, sem geração automática no backend (diferente de `events.ts`, que usa `insertWithUniqueSlug`). Duas opções: (a) frontend gera o slug (função de slugify simples) antes de chamar `createTheme`, ou (b) mover a geração pro backend replicando `insertWithUniqueSlug`. Recomendado: opção (b), por consistência com `events` e porque não há índice único de slug em `themes`/`categories` hoje (colisões silenciosas são possíveis) — vale adicionar esse índice único também.

## Contexto confirmado
- Backend real já existe em `erelachapelle-api` (fora deste workspace) com CRUD completo pronto: `POST/GET/PUT/DELETE /posts`, `/categories`, `/themes`, `/media-assets` (+ `/media-assets/upload` multipart real, com resize via sharp).
- `Post` (schema real, `erelachapelle-api/src/schemas/post.ts`): title/content/excerpt (MultilingualText), author (string), category (single, `{id, name}` → Category), tags (string[]?), themes (`{id,name}[]?` → Theme), featuredImage (`{id,url,altText?}` → MediaAsset), publishedAt (Date, obrigatório), published (bool), active (bool, soft delete + lixeira 30 dias).
- Frontend admin (`cevennes-site`) segue padrão: Type → Schema (zod) → Service (apiFetch) → Controller (hook) por feature em `_features/{entidade}/`, tabela em `_components/{entidade}/`, Sheet de form. **Posts vai quebrar o padrão de Sheet**: create/edit abre em rota própria com editor full-page, não Sheet.
- `_features/categories` e `_features/themes` já existem e são reutilizáveis (`listCategories`, `listThemes`). Falta `createTheme` (criação inline estilo Notion) e toda a feature `posts`.
- Nenhum editor rico instalado. Nenhum mecanismo de upload de imagem no frontend ainda (mas o endpoint no backend já existe e pode ser consumido).
- `admin.posts.*` não existe nos arquivos de tradução; só `admin.nav.posts`.

## Decisões (assumidas a partir da doc do projeto, já que perguntas anteriores não puderam ser respondidas)
- Editor rico: **Tiptap** (headless).
- Conteúdo: **só francês** (`content.fr`, `title.fr`, `excerpt.fr`) — pt/en ficam vazios (tradução sob demanda está fora de escopo no backend também).
- Coluna "icon" na tabela: ícone estático de documento (`DocumentTextBold`), igual ao padrão das outras tabelas.
- Featured image: **upload real** via `/media-assets/upload` (reaproveita infra já pronta no backend), não só URL colada.
- Editor full-page: **rotas dedicadas** `/admin/posts/new` e `/admin/posts/[id]`.
- Coluna "status" (distinta do toggle e da data de publicação): derivada — Rascunho (published=false) / Publicado (published=true e publishedAt ≤ agora) / Agendado (published=true e publishedAt > agora). Permite agendar publicação futura.
- Categoria: select único obrigatório (não multi), reaproveitando `_features/categories`.
- Temas: multi-select com criação inline (Notion-style), estendendo `MultiSelect` existente.
- Tags: chips livres, componente novo simples.
- Autosave: debounce ~2s ao editar rascunho existente (após o primeiro save manual que cria o `_id`).
- Trash/restore de posts: fora de escopo (não pedido).

## ⚠️ Achado de segurança a reportar (fora deste repo, não será corrigido aqui)
`GET /posts` e `GET /posts/:id` na API são públicos e filtram só por `active: true` — **não filtram por `published`**. Ou seja, rascunhos não publicados já são hoje acessíveis por qualquer requisição não autenticada. Isso é usado propositalmente pelo admin (tabela precisa ver rascunhos), mas se o site público um dia consumir esse mesmo endpoint (Fase 5 do `tasks.md`), vai vazar rascunhos. Reportar ao dono do `erelachapelle-api`; não é alterado neste plano (repositório separado, fora do pedido).

## Arquivos a criar/alterar (cevennes-site)

### Feature (novo): `src/app/[locale]/admin/_features/posts/`
- `post.type.ts` — tipo `Post` (espelha resposta da API) + `localizedName`/helpers reaproveitando `localized-text.ts`.
- `post.schema.ts` — `postFormSchema` (zod) para o form: title.fr, excerpt.fr, content.fr (html), author, categoryId, tagIds/tags, themeIds, featuredImage opcional, published, publishedAt.
- `post.service.ts` — `listPosts(cursor?, limit?)` (cursor pagination, mesmo formato `{items, nextCursor}` de `category.service.ts`, depende da paginação ser implementada no backend — ver seção de backend acima), `getPost(id)`, `createPost(values, category, themes, featuredImage, token)`, `updatePost(id, partialValues, token)` (chama `PUT`, não existe `PATCH` na API — o `PUT` já aceita corpo parcial), `deletePost(id, token)`.
- `post.controller.ts` — hook `usePosts()` seguindo o padrão de paginação por cursor de `category.controller.ts` (não `sermon.controller.ts`, que pagina client-side sobre lista completa) e `usePostEditor(id?)` (carrega/gerencia um post individual para a tela de editor: load, create, update parcial, autosave via `PUT`).

### Extensões em features existentes
- `src/app/[locale]/admin/_features/themes/theme.service.ts` — adicionar `createTheme(name, token)`. Gera `slug` client-side (slugify simples) só se o backend não passar a gerar automaticamente (ver item 5 da seção de backend); confirmar antes de implementar qual dos dois lados ficou responsável pelo slug.
- Novo `src/app/[locale]/admin/_features/media-assets/media-asset.type.ts` e `media-asset.service.ts` — `uploadMediaAsset(file: File, token)`, via `FormData` (não usa `apiFetch` porque ele sempre serializa JSON; nova função de baixo nível dedicada, mesma base de URL/token/credentials).

### Componentes compartilhados
- `src/app/[locale]/admin/_components/MultiSelect.tsx` — **modificar** (aditivo): prop opcional `onCreate?: (label: string) => Promise<MultiSelectOption>` para permitir criar tema inline quando a busca não encontra opção existente (item "Criar “X”" no `CommandList`).

### Tabela (lista) — substitui o stub atual
- `src/app/[locale]/admin/(app)/posts/page.tsx` — reescrever: usa `usePosts()`, renderiza `PageHeader` + `PostsTable`, botão "Adicionar" navega (router.push) para `/admin/posts/new` em vez de abrir Sheet.
- `src/app/[locale]/admin/_components/posts/PostsTable.tsx` — colunas: ícone (estático) | nome (title.fr) | status (badge derivado) | data de criação | switch publicar | data de publicação | ações (editar → navega pra `/admin/posts/[id]`; excluir → abre `DeletePostDialog`). Segue estrutura visual de `SermonsTable.tsx` (Table + Skeleton + empty state).
- `src/app/[locale]/admin/_components/posts/DeletePostDialog.tsx` — AlertDialog de confirmação, mesmo padrão de `DeleteSermonDialog.tsx` (soft delete, aviso de 30 dias).
- Toggle de publish: mesmo padrão optimistic update + revert de `user.controller.ts` (`toggleActive`), chamando `updatePost(id, { published: next }, token)`.

### Editor full-page (novo, não é Sheet)
- `src/app/[locale]/admin/(app)/posts/new/page.tsx` — renderiza `<PostEditor mode="create" />`.
- `src/app/[locale]/admin/(app)/posts/[id]/page.tsx` — carrega post via `usePostEditor(id)`, renderiza `<PostEditor mode="edit" post={...} />`.
- `src/app/[locale]/admin/_components/posts/editor/PostEditor.tsx` — layout full-page: barra superior fina (Voltar → `/admin/posts`, indicador "Salvando…/Salvo há Xs", botão "Salvar rascunho", botão "Publicar"/"Despublicar"), campo de título grande (estilo Medium), campo de subtítulo/excerpt, `FeaturedImageField`, metadados (categoria select, temas multi-select criável, tags, data de publicação via `DateTimePicker` existente, autor), e `RichTextEditor` pro corpo.
- `src/app/[locale]/admin/_components/posts/editor/RichTextEditor.tsx` — wrapper Tiptap: `useEditor` com `StarterKit`, `Underline`, `Link`, `Image`, `Placeholder`, `CharacterCount`, `Youtube` (embed, reaproveitando `getYouTubeVideoId` de `src/lib/integrations/youtube.ts`).
- `src/app/[locale]/admin/_components/posts/editor/EditorToolbar.tsx` — toolbar fixa estilo Substack (desfazer/refazer, heading dropdown, negrito/itálico/sublinhado/tachado, link, listas, citação, bloco de código, linha horizontal, upload de imagem, embed YouTube).
- `src/app/[locale]/admin/_components/posts/editor/EditorBubbleMenu.tsx` — bubble menu estilo Medium (aparece na seleção de texto: negrito/itálico/sublinhado/link/heading).
- `src/app/[locale]/admin/_components/posts/editor/FeaturedImageField.tsx` — upload de imagem de capa (usa `uploadMediaAsset`), preview, remover.
- `src/app/[locale]/admin/_components/posts/editor/TagsInput.tsx` — chips de texto livre (Enter/vírgula adiciona, backspace remove).

### Dependências novas (`package.json`)
`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-placeholder`, `@tiptap/extension-character-count`, `@tiptap/extension-youtube`.

### i18n
- `src/messages/{en,fr,pt}.json` — novo namespace `admin.posts.*`: title, subtitle, add, loading, loadError, empty*, colunas (columnName/columnStatus/columnCreatedAt/columnPublish/columnPublishedAt/columnActions), status labels (statusDraft/statusPublished/statusScheduled), form labels (title/excerpt/author/category/tags/themes/featuredImage/publishedAt), editor (back/saveDraft/publish/unpublish/saving/savedAgo/createTheme), delete dialog, erros (errorForbidden/errorGeneric).

## Passos de implementação (ordem)
0. **Backend (`erelachapelle-api`, pré-requisito)**: paginação por cursor em `GET /posts`, filtro `published`/`publishedAt` nas rotas públicas, aumento do limite de payload JSON, sanitização de HTML em `content`, geração de slug em `POST /themes` (ver seção de backend acima).
1. **Fundação de dados** (paralelo): criar `_features/posts/*`, estender `theme.service.ts` com `createTheme`, criar `_features/media-assets/*` com `uploadMediaAsset`.
2. **MultiSelect criável**: adicionar prop `onCreate` opcional (não quebra usos existentes em Sermons).
3. **Tabela**: `PostsTable.tsx`, `DeletePostDialog.tsx`, reescrever `(app)/posts/page.tsx` com `usePosts()` e navegação pro editor.
4. **Editor full-page** (*depende de 1 e 2*): `RichTextEditor`, `EditorToolbar`, `EditorBubbleMenu`, `FeaturedImageField`, `TagsInput`, depois compor tudo em `PostEditor.tsx`; criar as rotas `new/page.tsx` e `[id]/page.tsx`.
5. **i18n**: adicionar `admin.posts.*` nos 3 arquivos de mensagens.
6. **Instalar dependências** Tiptap via npm.

## Verificação
1. `npx tsc --noEmit` e `npm run lint` sem erros novos.
2. Criar post novo → aparece na tabela como Rascunho, createdAt preenchido, publishedAt "—", switch desligado.
3. Ligar switch de publicar direto na tabela → status muda pra Publicado/Agendado conforme `publishedAt`; reverte em caso de erro de rede (testar offline).
4. Abrir post pra editar → rota `/admin/posts/[id]`, todos os campos pré-preenchidos (título, conteúdo renderizado no Tiptap, categoria, temas, tags, imagem de capa).
5. Criar tema novo inline no combobox do editor → aparece selecionado e persiste ao salvar.
6. Upload de imagem de capa e imagem inline no corpo → confirma criação do `MediaAsset` (rede/consulta no Mongo) e renderização correta.
7. Excluir post na tabela → confirma some da listagem (soft delete); não há tela de lixeira (fora de escopo).
8. Testar toolbar fixa + bubble menu em seleção de texto (negrito, itálico, heading, link, lista, citação, bloco de código, linha horizontal, embed YouTube).

## Fora de escopo (explícito)
- Tela de lixeira/restore de Posts.
- Botão de tradução PT/EN (backend ainda não tem endpoint de tradução).
- Índice TTL de 30 dias na lixeira (documentado mas não implementado no backend) — reportar, não corrigir aqui.
- Slash-command estilo Notion/Novel (menu "+") — toolbar fixa + bubble menu já cobre "estilo Medium/Substack"; pode virar melhoria futura.
