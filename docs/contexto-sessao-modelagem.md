# Contexto da sessão — Modelagem de dados do backoffice

> Resumo desta sessão de planejamento, pra retomar em outro computador. Complementa os outros documentos já criados no projeto (todos em `docs/`):
> - [contexto-e-referencia.md](./contexto-e-referencia.md) — descrição do site atual (estático, sem banco)
> - [diagnostico-problemas.md](./diagnostico-problemas.md) — inconsistências encontradas no código atual
> - [modelo-de-dados.md](./modelo-de-dados.md) — modelo de dados completo, incluindo entidades fora do escopo atual
> - [decisoes-arquitetura.md](./decisoes-arquitetura.md) — decisões de arquitetura (MongoDB, tradução, validação)
> - [decisoes-usuario.md](./decisoes-usuario.md) — as 12 tabelas finais em escopo, com campos

## O que é o projeto

Site da Église Réformée Évangélique La Chapelle (igreja em Saint-Hippolyte-du-Fort, França), hoje 100% estático (Next.js, conteúdo hardcoded). Objetivo: criar uma API + backoffice pra tornar o conteúdo editável.

## Decisões de arquitetura principais

- **Banco**: MongoDB.
- **Tradução**: francês é a língua fonte; português/inglês são preenchidos sob demanda por um botão "traduzir" (chama API de tradução, mostra resultado editável, só salva ao confirmar). Conteúdo pode ficar só em francês indefinidamente — o site cai no fallback pro francês nesse caso. Vídeo/áudio nunca são traduzidos. Serviço escolhido: DeepL API Free (sem orçamento pra pago, sem GPU disponível).
- **Referências entre entidades**: Extended Reference Pattern — guardar `{ id, campos exibidos }` em vez de só `ObjectId` puro, quando o dado referenciado muda pouco (ex.: `category`, `location`, `featuredImage`).
- **Validação da API**: Zod como fonte única de verdade — tipo TypeScript derivado do schema via `z.infer`, não mantido separado.
- **Entidade vs. objeto de valor**: entidade tem `_id`/collection própria e é referenciável; objeto de valor só existe embutido (ex.: `Sermon.biblicalReference` é um `object` genérico sem schema fixo no banco).

## Escopo final: 12 tabelas

`User`, `Sessions`, `Events`, `CommunityGroups`, `Sermons`, `Podcast`, `Posts`, `Theme`, `Category`, `MediaAssets`, `Album`, `Members`.

Ficaram **fora de escopo**: `SiteSettings`, `Banner`, `MenuItem`, `FAQ`, `Ministry`, `ContactSubmission`, `NewsletterSubscriber`, `EventRegistration`, `GroupInterest`, `PrayerRequest`, `Donation/Offering` — sem inscrição/registro em Events ou Groups.

Decisões pontuais importantes dentro dessas 12:
- `Theme`: sem tela própria de gestão, funciona como select estilo Notion (cria inline se não existir). É uma tag de assunto (não visual/cor do site).
- `Category`: única por conteúdo (não array), tem tela própria de gestão. Cobre também a diferenciação de Artigos / Newsletter / Boletins dentro de `Posts` (3 categorias, sem campo novo).
- `MediaAssets` unifica o que seriam `Gallery` (imagens) + `Artifact` (documentos) — campo `fileType` (`pdf`/`png`/`jpeg`) e `documentType` (nulo se for imagem).
- `Sermon.notes` referencia `MediaAssets` (tipo `notes`), no lugar de um campo solto de URL.
- Os campos completos de cada uma das 12 tabelas estão em [decisoes-usuario.md](./decisoes-usuario.md) — essa é a fonte mais confiável pro schema final.

## Onde paramos: revisão tabela por tabela

Estávamos revisando as 12 tabelas de `decisoes-usuario.md` uma por uma, pra confirmação final antes de avançar pro desenho da API.

- ✅ **User** — confirmada, sem ajuste.
- ✅ **Sessions** — confirmada, sem ajuste.
- ✅ **Events** — confirmada. Nota: os campos `MultilingualText` seguem o padrão (fr/pt/en), mas na prática provavelmente só o francês será preenchido pra essa entidade — isso já é suportado pela estrutura (pt/en opcionais), não exige mudança.
- 🔲 **CommunityGroups** — em revisão, aguardando confirmação.
- 🔲 **Sermons**, **Podcast**, **Posts**, **Theme**, **Category**, **MediaAssets**, **Album**, **Members** — ainda não revisadas nesta rodada.

## Próximo passo

Continuar a revisão a partir de `CommunityGroups`, tabela por tabela, na ordem listada acima, confirmando cada uma antes de seguir pra próxima.
