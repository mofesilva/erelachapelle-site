# Diagnóstico de Problemas — cevennes-site

> Levantamento de inconsistências, código morto e dados incompletos/fictícios encontrados na leitura direta do código-fonte. Complementa [contexto-e-referencia.md](./contexto-e-referencia.md) (que é puramente descritivo). Serve de checklist para limpeza e para não carregar esses problemas para o desenho da API/backoffice.

---

## 1. Código morto (componentes e rotas não utilizados)

Confirmado via busca por importações — nenhum destes arquivos é referenciado em nenhuma página renderizada:

- `src/app/[locale]/(public)/about/AboutPageContent.tsx` — versão alternativa/antiga da página Sobre.
- `src/app/[locale]/(public)/about/_components/HistorySection.tsx`
- `src/app/[locale]/(public)/about/_components/CommunityLifeSection.tsx` — não está entre os componentes importados em `about/page.tsx` (que usa `MissionVisionSection`, `ChurchOriginsSection`, `LocalContextSection`, `ValuesSection`, `FaithSection`, `TeamSection`, `VisitCtaSection`).
- `src/app/[locale]/_components/AboutSection.tsx`
- `src/app/[locale]/_components/BlogPreviewSection.tsx`
- `src/app/[locale]/_components/EventsPreviewSection.tsx` (e o `EventCard.tsx`/`SermonCard.tsx` usados só por essas seções mortas)
- `src/app/[locale]/_components/SermonsPreviewSection.tsx`
- `src/app/[locale]/(public)/community/_components/GroupCard.tsx` — o card realmente usado é `src/app/[locale]/_components/CommunityGroupCard.tsx`

A home hoje (`src/app/[locale]/page.tsx`) renderiza apenas: `HeroSection`, `FaithStatementSection`, `GatheringSection`, `CommunitySection`, `EventsComingSoonBanner`, `NewsletterSection`.

**Dependência não utilizada**: `nodemailer` está no `package.json` (+ `@types/nodemailer`) mas não é usado em nenhum lugar do código — o envio de e-mail é feito via Resend (`src/lib/integrations/email.ts`).

## 2. Rota/link quebrado

- `src/app/[locale]/(public)/community/groups/[id]/page.tsx` tem um link "voltar" apontando para `/${locale}/community/groups`, mas **não existe** `community/groups/page.tsx` nem `community/page.tsx` — não há listagem de grupos no site, só a página de detalhe individual. Esse link de "voltar" resulta em 404 garantido.

## 3. Dados fictícios/placeholder em produção

- **Todos os 4 sermões** (`src/lib/data/sermons.ts`) usam o mesmo `youtubeVideoId: "dQw4w9WgXcQ"` — o vídeo de teste clássico do YouTube (Rick Astley), não conteúdo real.
- **Gap de sequência** em `BLOG_ARTICLES` (`src/lib/data/blog.ts`): existem `article-1` e `article-3`, sem `article-2` — indício de edição/remoção manual sem realinhar os IDs.
- `series` só é preenchido em 2 dos 4 sermões (`sermon-1` e `sermon-2`, ambos com o mesmo valor `"Les fondements de la foi"`); os outros 2 não têm série.

## 4. Enum divergente entre tipo de domínio e UI

- `src/types/event.ts` define `EventType` como `"service" | "conference" | "community" | "youth" | "outreach" | "prayer" | "other"`.
- `src/app/[locale]/_components/EventCard.tsx` (componente morto, ver seção 1, mas ainda assim reflete uma divergência de modelagem) define seu **próprio** tipo local `EventType = "culte" | "conference" | "jeunesse" | "autre"` — valores completamente diferentes do tipo real.
- A conversão entre os dois é feita manualmente em `EventsPreviewSection.tsx` por um dicionário `eventTypeMap`, mapeando `outreach`, `community`, `other` → `"autre"` e `prayer` → `"culte"` — perda de informação só para decidir a cor do badge.

## 5. Link de CTA hardcoded inconsistente

- `src/app/[locale]/(public)/sermons/_components/SermonsCtaSection.tsx` tem um botão "veja mais no YouTube" apontando para `https://www.youtube.com` (genérico), enquanto o canal real da igreja já está centralizado em `SITE_CONFIG.socialMedia.youtube` (`https://www.youtube.com/@erelachapelle/featured`), usado corretamente no Header, Footer e Hero. O link do CTA de sermões não usa essa mesma fonte e aponta para o lugar errado.

## 6. Textos hardcoded fora do sistema de tradução (idênticos em fr/pt/en)

Textos fixos diretamente no JSX, que deveriam passar por `t()` mas não passam — aparecem sempre em francês independentemente do idioma selecionado:

- `"Saint-Hippolyte-du-Fort"` — `about/_components/LocalContextSection.tsx`
- `"98%"` (estatística de população huguenote histórica) — `about/_components/LocalContextSection.tsx`
- `"ERE La Chapelle"` — `about/_components/CommunityLifeSection.tsx` (componente hoje não renderizado, ver seção 1)
- Nome da igreja e tagline em `src/app/[locale]/layout.tsx` (metadata): `"Église Réformée Évangélique La Chapelle"`, `"Rassemblés autour de la Parole de Dieu"` — sempre em francês na metadata, mesmo quando o locale ativo é `pt` ou `en`.
- Placeholders do formulário de contato (`contact/_components/ContactForm.tsx`): `"Jean Dupont"`, `"jean@exemple.fr"` — baixa prioridade (são só exemplos de preenchimento), mas tecnicamente fora do sistema de i18n.

## 7. Inconsistência de alt text da logo

- `Header.tsx` usa `alt="Église Réformée Évangélique La Chapelle"` para o logo (`/logos/logo_white_h.png`).
- `MobileMenu.tsx` usa `alt="La Chapelle"` para o mesmo arquivo de logo — texto alternativo diferente para a mesma imagem em componentes distintos.

## 8. Shape inconsistente entre entidades

- `LeadershipMember` (`src/types/leader.ts`) e `Location` (`src/types/location.ts`) **não têm** `createdAt`/`updatedAt`, enquanto todas as outras entidades de conteúdo (`Event`, `CommunityGroup`, `Sermon`, `BlogArticle`) têm. Não há padrão único de auditoria de criação/atualização entre as entidades.

## 9. Campos declarados no tipo e nunca usados em lugar nenhum

Nem preenchidos nos dados reais, nem lidos em nenhum componente:

- `BlogArticle.authorBio`
- `Event.customAddress`, `Event.featuredImage`, `Event.capacity`
- `CommunityGroup.leaderContact`, `CommunityGroup.customAddress`, `CommunityGroup.maxCapacity`, `CommunityGroup.featuredImage`
- `Sermon.seriesOrder`, `Sermon.pdfNotesUrl`, `Sermon.duration`
- `LeadershipMember.email`

## 10. Campos preenchidos nos dados mas nunca exibidos na UI

- `BlogArticle.tags` (preenchido nos 2 artigos, nunca renderizado)
- `Sermon.tags` (preenchido nos 4 sermões, nunca renderizado)
- `LeadershipMember.ministryAreas` (preenchido, nunca renderizado)

## 11. Enums parcialmente cobertos pelos dados reais

- `EVENT_TYPES` tem 7 valores possíveis (`service, conference, community, youth, outreach, prayer, other`); os 4 eventos existentes só usam `service`, `conference`, `youth`, `community` — `outreach`, `prayer`, `other` nunca aparecem em nenhum dado real.
- `GROUP_TYPES` tem 9 valores possíveis; os 4 grupos existentes só usam `bible_study`, `youth`, `prayer`, `worship` — `women`, `men`, `seniors`, `outreach`, `other` nunca aparecem em nenhum dado real.

## 12. Módulo de dados sem paridade funcional

- `src/lib/data/groups.ts` só exporta `getGroups()` e `getGroupById()`. Diferente de `blog.ts`, `events.ts` e `sermons.ts` — todos têm função de filtro (`filterX()`) e de listagem de tipos (`getXTypes()`) — `groups.ts` não tem `filterGroups()` nem `getGroupTypes()`.

## 13. Dado de configuração desconectado da entidade real

- `SITE_CONFIG.locations` (`src/lib/constants/index.ts`) é um array de strings soltas (`["Saint-Hippolyte"]`), sem relação de tipo com `Location._id` (`"loc-saint-hippolyte"`) nem com `Location.name` (`"La Chapelle"`) — é um dado paralelo à entidade `Location` real, e hoje **não é lido em nenhum lugar do código** além da própria definição.

## 14. Simulação sem efeito real (stub)

- A Server Action `subscribeNewsletter` (`src/app/actions/newsletter.ts`) valida o e-mail recebido mas não persiste nada e não envia nada — sempre retorna sucesso simulado. O próprio código documenta a intenção futura em comentário: `// Phase 2: Cappuccino insert to newsletter_subscribers`. Hoje, todo formulário de newsletter preenchido corretamente "funciona" na aparência sem que nenhum dado seja de fato armazenado.

## 15. `.env.example` desatualizado em relação ao código real

- Documenta variáveis **não usadas** em nenhum lugar do código: `CAPPUCCINO_API_URL`, `CAPPUCCINO_API_KEY`, `NEXT_PUBLIC_CAPPUCCINO_API_URL`, `NEXT_PUBLIC_CAPPUCCINO_API_KEY`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_PAGE_ID`.
- **Omite** as variáveis que o código realmente consome: `RESEND_API_KEY` (usada em `src/lib/integrations/email.ts`) e `CONTACT_EMAIL` (usada em `src/app/actions/contact.ts`), presentes apenas em `.env.local` (não versionado).

## 16. Configuração de imagens remotas com integração pendente

- `next.config.ts` tem `images.remotePatterns` habilitando apenas `images.unsplash.com`. Há um bloco comentado indicando que o domínio `erelachapelle.dzign-e.app` foi temporariamente desabilitado, com a nota "Re-enable when switching back to the remote image server" — ou seja, já existe uma expectativa de servir imagens de um servidor remoto no futuro, hoje desativada.

---

## Resumo por prioridade sugerida

| Prioridade | Item |
|---|---|
| Alta | Link quebrado de "voltar" em grupos (#2); dado placeholder de vídeo do YouTube em todos os sermões (#3); newsletter simulada sem persistência (#14) |
| Média | Enum divergente `EventType` (#4); link de CTA de sermões apontando para lugar errado (#5); `.env.example` desatualizado (#15) |
| Baixa | Textos não localizados (#6); alt text inconsistente da logo (#7); código morto (#1); campos nunca usados/exibidos (#9, #10); falta de paridade funcional em `groups.ts` (#12) |
