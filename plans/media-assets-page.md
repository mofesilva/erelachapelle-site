# Plan: Página Media Assets (Médiathèque)

## Contrato de backend confirmado (../erelachapelle-api)
- `GET /media-assets` — público, sem paginação, retorna todos os `active:true`, sort createdAt desc.
- `POST /media-assets/upload` — auth editor/admin, multipart `upload.single("file")`. Campos: `file` (obrigatório), `documentType?`, `title?`/`altText?`/`description?` (cada um vem como STRING contendo JSON multilingual), `slug?`. UM arquivo por request.
- `fileType` aceito: `pdf | png | jpeg | epub` (mimeToFileType em lib/file-storage.ts). Servidor detecta sozinho a partir do mimetype.
- `DELETE /media-assets/:id` — auth editor/admin, soft delete (`active:false`), não apaga do storage.
- `url` retornada é relativa (`/uploads/xxx.ext`) — front deve prefixar com `NEXT_PUBLIC_API_URL`.
- Sem campo de tamanho/nome de arquivo original armazenado — só `title` (opcional).

## Steps

### Fase 1 — Infra de upload multipart (depende de nada)
1. Estender `src/app/[locale]/admin/_lib/http-client.ts`: no `send()`, detectar `body instanceof FormData` e, nesse caso, não fazer `JSON.stringify` nem setar `Content-Type` (deixar o browser setar o boundary multipart). Mantém `apiFetch` funcionando igual pros demais recursos.

### Fase 2 — Camada de dados (depende da Fase 1)
2. Criar `src/app/[locale]/admin/_features/media-assets/media-asset.type.ts`: tipo `MediaAsset` (fileType, documentType?, title?, altText?, description?, url, slug?, active, deletedAt, createdAt, updatedAt, createdBy, updatedBy, _id), consts `FILE_TYPES`/`DOCUMENT_TYPES`, helper `resolveMediaAssetUrl(url)` (prefixa `NEXT_PUBLIC_API_URL` se relativa) e `displayTitle(asset, locale)` (usa `localizedText`, fallback pro basename da url se não tiver title).
3. Criar `media-asset.service.ts`: `listMediaAssets()` (GET sem token, é público), `uploadMediaAsset(file, meta, token)` (monta FormData com `file` + JSON.stringify nos campos multilingual), `deleteMediaAsset(id, token)`.
4. Criar `media-asset.controller.ts` — hook `useMediaAssets()`: fetch all no mount (sem paginação), `uploads` (fila de status por arquivo: pending/uploading/success/error), `uploadFiles(files: File[], meta)` faz upload sequencial/paralelo e atualiza a fila, `remove(id)` soft-delete + refetch.

### Fase 3 — Componentes (depende da Fase 2, paralelizável entre si)
5. `MediaUploadDropzone.tsx` — container grande com `border-dashed`, drag&drop nativo (onDragOver/onDragLeave/onDrop) + input file oculto (`multiple`, `accept=".pdf,.png,.jpg,.jpeg,.epub"`) + botão "procurar". Valida extensão/mimetype no client antes de enviar. Mostra fila de upload em progresso (nome + status/erro por arquivo).
6. `MediaAssetsToolbar.tsx` — busca por título (Input + MagniferBold), filtro por fileType (Select), filtro por documentType (Select), sort (Select: mais recente/mais antigo/nome A-Z/nome Z-A).
7. `MediaAssetsGrid.tsx` + `MediaAssetCard.tsx` — grid responsivo de cards com thumbnail (`<img>` via `resolveMediaAssetUrl` pra png/jpeg, ícone Solar pra pdf/epub), título, badge de tipo, data, botão de excluir no hover. Loading = skeleton grid. Empty state consistente com `CategoriesTable` (ícone + texto).
8. `DeleteMediaAssetDialog.tsx` — mesmo padrão do `DeleteCategoryDialog` (AlertDialog + soft delete).

### Fase 4 — Página + i18n (depende das Fases 2 e 3)
9. Reescrever `src/app/[locale]/admin/(app)/media-assets/page.tsx`: `"use client"`, `useMediaAssets()`, estado local de search/filtro/sort (`useMemo` pra lista filtrada+ordenada), `PageHeader` (ícone `GalleryWideBold`), dropzone, toolbar, grid, dialog de delete.
10. Adicionar seção `admin.mediaAssets` em `en.json`/`fr.json`/`pt.json` (paralelo à seção `categories`): title, subtitle, dropzone (title/subtitle/button/accepted), toolbar (searchPlaceholder, filterAllTypes, sortNewest/Oldest/NameAsc/NameDesc, tipos de documento), empty state, delete confirm, loadError.

## Relevant files
- `src/app/[locale]/admin/_lib/http-client.ts` — estender `send()`/`apiFetch` pra aceitar `FormData`.
- `src/app/[locale]/admin/_features/media-assets/*` — novos (type/service/controller), seguindo o padrão de `_features/categories/`.
- `src/app/[locale]/admin/_components/media-assets/*` — novos componentes, seguindo padrão visual de `_components/categories/CategoriesTable.tsx` e `_components/PageHeader.tsx`.
- `src/app/[locale]/admin/(app)/media-assets/page.tsx` — substituir stub "Em construção".
- `src/messages/{en,fr,pt}.json` — nova seção `admin.mediaAssets`.
- Ícones solar-icon-set confirmados disponíveis: `CloudUploadBold` (dropzone), `FileTextBold`/`FileBold` (pdf), `GalleryBold` (imagem), `BookBold`/`Book2Bold` (epub), `MagniferBold` (busca), `FilterBold`, `SortByAlphabetBold`/`SortByTimeBold`.

## Verification
1. `npm run lint` / `npx tsc --noEmit` no cevennes-site pra garantir sem erros de tipo.
2. Rodar a API local (`erelachapelle-api`) + o front, logar como editor/admin, testar: drag&drop de múltiplos arquivos (pdf/png/jpeg/epub), upload por seleção manual, rejeição de tipo não suportado (ex: .docx) com mensagem clara, exclusão de item (some da grid), filtro por tipo, busca por título, sort por nome/data.
3. Testar responsividade do grid em mobile/tablet/desktop.

## Decisions
- Grid de cards com thumbnail (confirmado pelo usuário), não tabela.
- Filtros: tipo de arquivo (fileType) + tipo de documento (documentType, já que o dado existe) + busca por título + sort por nome/data. **Sort por tamanho excluído**: a API não armazena tamanho do arquivo nem nome original.
- Upload multipart direto pro backend (`POST /media-assets/upload`), um arquivo por request — é o único mecanismo que a API já implementa; sem presigned URL.
- Sem tela de edição de metadados (title/alt/description) por enquanto — título é preenchido automaticamente com o nome do arquivo (sem extensão) no momento do upload. Fora de escopo: página de trash/restore (admin-only) e associação com álbuns.
- Sem paginação (a API não pagina media-assets) — toda a lista vem de uma vez e filtro/sort é client-side, o que já é consistente com o pedido do usuário ("diferente das outras" telas, que usam cursor pagination).

## Further Considerations
1. Título automático = nome do arquivo sem extensão, editável depois? Hoje não há endpoint de edição usado no plano (só create/delete). Se quiser permitir renomear/editar descrição depois, adiciono um `MediaAssetEditSheet` reaproveitando `PUT /media-assets/:id` (recomendo deixar pra uma iteração seguinte, já que não foi pedido).
