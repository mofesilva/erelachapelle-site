# Tasks — Backoffice/API cevennes-site

> Lista de tarefas a partir do que foi definido em `decisoes-usuario.md`, `decisoes-arquitetura.md` e `modelo-de-dados.md`. Organizada por fase, na ordem em que faz sentido executar.

## Lembrete — prioridade do cliente (AINDA NÃO DECIDIDO)

O que ele mais quer de cara: um backoffice pra entrar e postar **Sermons, Podcast, Newsletter (dentro de Posts) e o Ebook que ele está fazendo (dentro de MediaAssets)**. Só isso, de início.

O resto das entidades entra aos poucos, depois. Ainda não fechado quais nem em que ordem.

## Fase 0 — Fechar o modelo de dados

- [x] User
- [x] Sessions
- [x] Events
- [ ] CommunityGroups
- [ ] Sermons
- [ ] Podcast
- [ ] Posts
- [ ] Theme
- [ ] Category
- [ ] MediaAssets
- [ ] Album
- [ ] Members

## Fase 1 — Infraestrutura de banco

- [ ] Provisionar cluster MongoDB (ambiente de dev + produção)
- [ ] Criar as 12 collections definidas
- [ ] Criar índices: `slug` único (Events, Sermons, Posts, Theme, Category, Album, MediaAssets), `series.fr` (Sermons), TTL em `expiresAt` (Sessions), único em `email` (User)
- [ ] Definir variáveis de ambiente de conexão (substituindo/junto de `CAPPUCCINO_*` já mencionadas em `.env.example`)

## Fase 2 — Validação e tipos (Zod)

- [ ] Schema `multilingualTextSchema` reutilizável (com `staleTranslation`)
- [ ] Schema de criação/edição por entidade (sem `_id`/`createdAt`/`updatedAt`)
- [ ] Tipo de entidade completa por entidade (`z.infer`, incluindo campos de auditoria)
- [ ] Schema do objeto genérico `biblicalReference` (validação de entrada, sem virar entidade)

## Fase 3 — API

- [ ] Endpoints CRUD por entidade (criação/edição respeitando papéis de `User.role`)
- [ ] Endpoint de autenticação (login, refresh token, logout) usando `Sessions`
- [ ] Endpoint de tradução sob demanda (chama DeepL API Free, retorna resultado editável, não salva sozinho)
- [ ] Endpoint de upload pra `MediaAssets` (imagem e documento)
- [ ] Regra de limite de 5 sessões simultâneas por usuário (aplicação, não schema)

## Fase 4 — Backoffice (telas)

- [ ] Login
- [ ] Tela de gestão de `Category` (lista reordenável, CRUD)
- [ ] Formulário de `Sermons` (com campo de tema tipo select-inline pra `Theme`, upload de notas via `MediaAssets`)
- [ ] Formulário de `Events` e `CommunityGroups`
- [ ] Formulário de `Posts` (com botão de tradução por idioma, categoria única)
- [ ] Formulário de `Podcast`
- [ ] Gestão de `Album` (criar álbum, adicionar imagens já existentes em `MediaAssets`)
- [ ] Gestão de `Members`
- [ ] Biblioteca de mídia (`MediaAssets`) — upload, listagem, busca

## Fase 5 — Migração de conteúdo

- [ ] Migrar dados estáticos hoje em `src/lib/data/*.ts` (Sermon, Event, CommunityGroup, LeadershipMember, Location) pro banco
- [ ] Substituir as funções de leitura de `src/lib/data/` por chamadas à API
- [ ] Validar que o site público continua funcionando igual, agora lendo do banco

