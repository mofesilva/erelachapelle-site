# Tasks: Homepage Redesign

**Input**: Design documents from `/specs/002-homepage-redesign/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md
**Nome oficial**: Eglise Reformee Evangelique La Chapelle

**Tests**: Nao solicitados. Validacao visual manual (320px, 768px, 1440px) + Lighthouse.

**Organization**: Tasks agrupadas por user story. Cada story eh independentemente testavel.

**Status**: Atualizado 2026-02-18. Tasks marcadas [x] ja foram implementadas.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependencias)
- **[Story]**: User story correspondente (US1, US2, US3, US4, US5)

## Path Conventions

- Single project: `src/` at repository root
- Components: `src/components/sections/` e `src/components/shared/`
- Translations: `src/messages/*.json`
- Styles: `src/app/globals.css`
- Homepage: `src/app/[locale]/page.tsx`

---

## Phase 1: Setup (Design Tokens & Infraestrutura)

**Purpose**: Atualizar design tokens e preparar infraestrutura visual compartilhada

- [x] T001 Atualizar paleta de cores em `src/app/globals.css` — substituir tokens marigold/coral/salmon pelos 8 novos: #3D000A (burgundy-dark), #6A0D1E (burgundy), #8C5E35 (gold), #D1A594 (rose), #E7C6B5 (beige), #EEEEEE (white), #DADADA (gray), #171717 (black). Definir CSS custom properties e classes utilitarias Tailwind correspondentes
- [x] T002 [P] Adicionar/atualizar animacao `bounce-3x` em `src/app/globals.css` — keyframe bounce com `animation-iteration-count: 3` e media query `prefers-reduced-motion: reduce` para desabilitar
- [x] T003 [P] Adicionar utilitarios de transicao em `src/app/globals.css` — classes para 3 niveis: fast (200ms), medium (250ms), smooth (300ms com scale) e regra global `prefers-reduced-motion`

**Checkpoint**: Design tokens prontos — todas as user stories podem comecar

---

## Phase 2: Foundational (Composicao da Homepage)

**Purpose**: Reestruturar a composicao da homepage — remover secoes, preparar ordem

**CRITICAL**: Deve ser concluido antes das user stories para evitar conflitos

- [x] T004 Atualizar composicao da homepage em `src/app/[locale]/page.tsx` — remover imports de `AboutSection` e `TeamSection`, adicionar import de `FaithStatementSection` (sera criado em US2), reordenar secoes: Hero > FaithStatement > Gathering > Events > Sermons > Community > Blog
- [x] T005 [P] Adicionar chaves de traducao para declaracao de fe em `src/messages/fr.json` — criar namespace `homepage.faith` com campos `statement` (texto da declaracao de fe em frances) e `cta` (texto do botao "En savoir plus")
- [x] T006 [P] Adicionar chaves de traducao para declaracao de fe em `src/messages/pt.json` — criar namespace `homepage.faith` com campos `statement` e `cta` ("Saiba mais")
- [x] T007 [P] Adicionar chaves de traducao para declaracao de fe em `src/messages/en.json` — criar namespace `homepage.faith` com campos `statement` e `cta` ("Learn more")
- [x] T008 Adicionar estilo global de divisoria borgonha entre secoes em `src/app/globals.css` ou diretamente nos componentes — linhas divisorias entre secoes em cor #6A0D1E (borgonha) ao inves do cinza padrao (FR-009)

**Checkpoint**: Homepage reestruturada com 6 secoes (hero + 5). Traducoes prontas. User stories podem comecar.

---

## Phase 3: User Story 1 — Primeira Impressao Impactante (Priority: P1) MVP

**Goal**: Hero section a 80dvh com navbar integrada (transparente->borgonha), texto centralizado, CTA dourado, scroll indicator animado

**Independent Test**: Abrir homepage e verificar: hero 80dvh, navbar transparente que muda para borgonha ao scrollar (sem bordas brancas), texto e CTA centralizados, CTA em dourado (#8C5E35), chevron animado na parte inferior

### Implementation for User Story 1

- [x] T009 [US1] Redesenhar `src/components/sections/HeroSection.tsx` — altura 80dvh, imagem de fundo full-bleed com `object-cover`, overlay escuro, titulo e subtitulo centralizados em Playfair Display, scroll indicator com animacao bounce-3x. **Pendente**: atualizar cor do CTA de `--accent-marigold` para dourado (#8C5E35) apos T001
- [x] T010 [US1] Implementar comportamento de navbar integrada ao hero — navbar com `bg-transparent` no topo, transicao 300ms para `bg-primary` (borgonha) ao scrollar, sem bordas brancas, `position: fixed`, `z-50`, `useEffect` + scroll listener
- [x] T011 [US1] Atualizar cor do botao CTA do hero em `src/components/sections/HeroSection.tsx` — substituir referencia a `--accent-marigold` por cor dourado (#8C5E35) da nova paleta. Depende de T001
- [x] T012 [US1] Verificar responsividade do hero em 3 viewports — testar manualmente em 320px (mobile), 768px (tablet) e 1440px (desktop): texto legivel, overlay adequado, CTA visivel, scroll indicator nao sobrepoe conteudo, navbar funciona em todos os tamanhos

**Checkpoint**: Hero funcional com navbar integrada. Verificar visualmente: 80dvh, navbar transparente->borgonha, sem bordas brancas, texto centrado, CTA dourado, chevron animado.

---

## Phase 4: User Story 2 — Declaracao de Fe em Destaque (Priority: P1)

**Goal**: Nova secao pos-hero com mini declaracao de fe em tipografia serif e botao CTA para /about

**Independent Test**: Scrollar apos hero e verificar: secao com fundo bege (#E7C6B5), texto serif centralizado, botao "Saiba mais" que leva a /about, traduzido em FR/PT/EN

### Implementation for User Story 2

- [x] T013 [US2] Criar componente `src/components/sections/FaithStatementSection.tsx` — Server Component (sem 'use client'). Fundo bege (#E7C6B5), padding py-16 md:py-24. Texto de declaracao de fe centralizado (max-w-3xl mx-auto text-center) em Playfair Display text-2xl md:text-4xl cor #3D000A (borgonha escuro). Botao CTA (Link para /about) estilizado com cor #8C5E35 (dourado) ou #6A0D1E (borgonha). Usar `useTranslations('homepage.faith')` para `statement` e `cta`. Wrapper `<section>` com aria-label
- [x] T014 [US2] Verificar que `FaithStatementSection` esta importado e posicionado corretamente em `src/app/[locale]/page.tsx` — deve aparecer entre HeroSection e GatheringSection. Testar nos 3 idiomas (mudar locale na URL) e verificar que o botao redireciona para /about

**Checkpoint**: Declaracao de Fe visivel apos o hero. Texto serif bege, botao funcional, 3 idiomas.

---

## Phase 5: User Story 3 — Descoberta Rapida dos Horarios e Locais (Priority: P1)

**Goal**: Secao de locais com ID Cards visuais (imagem + icone + nome + endereco + horario) por localidade

**Independent Test**: Scrollar ate secao de locais e verificar: cada localidade tem ID Card com imagem no topo, icone, nome em serif, endereco, horario. Desktop: lado a lado. Mobile: empilhados. Divisorias borgonha.

### Implementation for User Story 3

- [x] T015 [P] [US3] Criar componente `src/components/shared/LocationCard.tsx` — Server Component. Props: `image` (string), `icon` (LucideIcon), `name` (string), `address` (string), `schedule` (string). Card com rounded-xl overflow-hidden shadow-lg. Imagem no topo (h-48 ou aspect-video, next/Image com fill + object-cover). Abaixo: padding p-6, flex-col items-center text-center. Icone w-8 h-8 cor #6A0D1E. Nome text-2xl Playfair #3D000A. Endereco text-base Inter text-muted-foreground. Horario text-lg font-semibold. Fallback de imagem: div com bg-gradient borgonha + MapPin icon centralizado
- [x] T016 [US3] Redesenhar `src/components/sections/GatheringSection.tsx` — substituir layout minimalista atual por grid de `LocationCard`. Fundo #EEEEEE (branco). Titulo da secao com SectionLabel. Grid: grid-cols-1 md:grid-cols-3 gap-6 md:gap-8. Importar e usar `LocationCard` para cada localidade. Dados hardcoded das localidades (imagem placeholder, icone Church/MapPin/Building, nome, endereco, horario). Usar `useTranslations('homepage.gathering')` para textos traduzidos
- [x] T017 [US3] Verificar responsividade dos ID Cards — testar em 320px (empilhado, cards full-width), 768px (grid 2-3 colunas), 1440px (3 colunas lado a lado). Verificar que imagens nao distorcem, texto nao overflow, hierarquia visual clara

**Checkpoint**: Locais exibidos como ID Cards visuais. Imagem + icone + nome + endereco + horario. Responsivo.

---

## Phase 6: User Story 4 — Preview de Eventos e Sermoes (Priority: P2)

**Goal**: Cards de eventos com data destacada + badges na nova paleta. Cards de sermoes com thumbnail + play overlay. Hover states interativos.

**Independent Test**: Scrollar ate eventos/sermoes e verificar: data em bloco visual, badges com cores da nova paleta (#8C5E35 dourado, #D1A594 rose), hover com elevacao + scale, thumbnails de sermao com play overlay. Mobile: coluna unica.

### Implementation for User Story 4

- [x] T018 [P] [US4] Atualizar `src/components/shared/EventCard.tsx` — substituir cores marigold/coral/salmon pelos badges da nova paleta: culte=#8C5E35 (dourado), conference=#D1A594 (rose), jeunesse=#6A0D1E (borgonha com texto claro), autre=#3D000A. Data em bloco visual destacado (dia grande text-3xl + mes abreviado text-sm abaixo). Titulo em Playfair serif. Localizacao com MapPinIcon. Hover state: shadow-lg + scale-[1.02] transition-all duration-300
- [x] T019 [P] [US4] Atualizar `src/components/shared/SermonCard.tsx` — atualizar cores de acento para nova paleta. Thumbnail com aspect-video (16:9). Overlay de play icon (Play de Lucide, w-16 h-16, branco/80, centralizado absolute). Hierarquia: data (text-sm muted) > serie (text-xs dourado #8C5E35 uppercase tracking-wide) > titulo (text-lg Playfair) > pregador (text-sm muted). Hover: shadow-lg + scale-[1.02] duration-300
- [x] T020 [US4] Atualizar `src/components/sections/EventsPreviewSection.tsx` — fundo alternado (#D1A594 rose ou #E7C6B5 bege) para contraste com secao anterior (FR-030). Cards em #EEEEEE (branco). Grid grid-cols-1 md:grid-cols-3 gap-6. Empty state elegante com CalendarIcon + mensagem traduzida. Usar cores da nova paleta
- [x] T021 [US4] Atualizar `src/components/sections/SermonsPreviewSection.tsx` — fundo que contraste com secao de eventos (ex: #EEEEEE branco se eventos eh rose, ou #E7C6B5 bege). Cards com borda #DADADA. Grid grid-cols-1 md:grid-cols-2 gap-6. Empty state com VideoIcon. Atualizar cores para nova paleta
- [x] T022 [US4] Verificar hover states e responsividade — testar hover em desktop (eventos e sermoes), verificar scale + shadow transition. Mobile: cards em coluna unica, play overlay visivel em touch

**Checkpoint**: Eventos e sermoes com visual rico. Badges na nova paleta. Hover interativo. Play overlay em sermoes.

---

## Phase 7: User Story 5 — Comunidade e Blog com Diferenciacao Visual (Priority: P3)

**Goal**: Secao comunidade com fundo borgonha + cards claros. Blog com cards image-first + badges dourados. Contraste visual forte.

**Independent Test**: Scrollar ate comunidade e verificar: fundo borgonha (#6A0D1E) com cards claros/translucidos. Blog: cards com imagem no topo, titulo, data, badge de categoria em dourado. Mobile: layouts adaptados.

### Implementation for User Story 5

- [x] T023 [US5] CommunitySection com fundo borgonha — secao ja usa `bg-primary` (borgonha) com cards em contraste claro. **Pendente**: refinar cards/hover apos T001 se necessario
- [x] T024 [P] [US5] Atualizar `src/components/sections/BlogPreviewSection.tsx` — fundo #EEEEEE (branco) com cards que tenham borda #DADADA para destaque (FR-030, nao branco+branco). Cards image-first: imagem no topo (aspect-video, next/Image, placeholder gradiente borgonha se sem imagem), badge de categoria em dourado (#8C5E35), titulo em Playfair, data em text-sm muted. Hover: shadow-lg + scale-[1.02] duration-300. Grid grid-cols-1 md:grid-cols-3 gap-6
- [x] T025 [US5] Verificar contraste e diferenciacao visual — comunidade deve ter identidade borgonha distinta, blog deve ter identidade propria. Verificar que nenhuma secao tem fundo branco + card branco (FR-030). Mobile: ambas adaptam para coluna unica

**Checkpoint**: Comunidade e Blog com identidade visual propria. Contraste forte. Homepage completa.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Refinamento visual, consistencia e validacao final

- [ ] T026 [P] Verificar consistencia de espacamento entre todas as secoes — padding vertical consistente (py-16 md:py-24 ou equivalente) em todas as 6 secoes. Ajustar se necessario em `src/components/sections/*.tsx`
- [ ] T027 [P] Verificar todas as divisorias entre secoes — confirmar que linhas divisorias sao borgonha (#6A0D1E) e nao cinza padrao (FR-009). Ajustar em `src/app/globals.css` ou nos componentes
- [ ] T028 [P] Validar alternancia de fundos entre secoes (FR-030) — Hero (imagem), Fe (bege), Locais (branco), Eventos (rose), Sermoes (contraste), Comunidade (borgonha), Blog (branco+borda). Nenhuma secao adjacente com mesmo fundo. Nenhum branco+branco
- [ ] T029 Validar i18n completo — navegar homepage em FR, PT e EN. Verificar que todas as strings estao traduzidas, nenhum texto hardcoded em ingles, botoes e labels corretos em cada idioma
- [x] T030 Executar build de producao — rodar `npm run build` e verificar que nao ha erros TypeScript, warnings de lint, ou problemas de compilacao
- [ ] T031 Teste de responsividade final — testar homepage completa em 320px, 768px e 1440px. Verificar: hero 80dvh, navbar scroll, declaracao de fe, ID cards, eventos/sermoes, comunidade/blog. Sem overflow horizontal, sem texto cortado
- [ ] T032 Validar performance — rodar Lighthouse na homepage (`npm run build && npm run start`). Meta: Performance >90, CLS <0.1. Verificar que imagens usam next/Image, Server Components sem JS client desnecessario
- [ ] T033 Verificar acessibilidade — heading hierarchy (h1 apenas no hero, h2 por secao, h3 em cards), alt text em imagens dos ID Cards, contraste WCAG AA com nova paleta, focus states visiveis em links/botoes, `prefers-reduced-motion` respeitado

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T002, T003 ja concluidos. Apenas T001 (paleta) pendente — comecar imediatamente
- **Foundational (Phase 2)**: Depende de T001 para tokens de cor. T005-T007 (traducoes) podem rodar em paralelo
- **US1 Hero (Phase 3)**: T009, T010 ja concluidos. T011 depende de T001. T012 eh validacao manual
- **US2 Fe (Phase 4)**: Depende de T004 (import) e T005-T007 (traducoes)
- **US3 Locais (Phase 5)**: Depende de T001 (cores). T015 antes de T016
- **US4 Eventos (Phase 6)**: Depende de T001 (cores). T018, T019 em paralelo antes de T020, T021
- **US5 Comunidade (Phase 7)**: T023 ja concluido. T024 depende de T001
- **Polish (Phase 8)**: Depende de TODAS as user stories completas

### Critical Path (Bloqueadores)

```text
T001 (paleta de cores) → BLOQUEIA: T008, T011, T013-T025
T005-T007 (traducoes) → BLOQUEIA: T013, T014
T004 (page.tsx) → BLOQUEIA: T014
T015 (LocationCard) → BLOQUEIA: T016
```

### Parallel Opportunities

```text
# Imediato (sem dependencias):
T001 (paleta) — PRIORIDADE MAXIMA

# Apos T001, em paralelo:
Paralelo A: T004 + T005 + T006 + T007 + T008 (Foundational)
Paralelo B: T011 (US1 cor CTA)

# Apos Foundational, em paralelo:
Paralelo C: T013-T014 (US2 Fe)
Paralelo D: T015-T017 (US3 Locais)
Paralelo E: T018-T022 (US4 Eventos)
Paralelo F: T024-T025 (US5 Blog)
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3 = P1)

1. **AGORA**: T001 — paleta de cores (bloqueador critico)
2. T004-T008 — Foundational (composicao, traducoes, divisorias)
3. T011 — Finalizar US1 Hero (cor do CTA)
4. T013-T014 — US2 Declaracao de Fe (nova secao)
5. T015-T017 — US3 Locais (ID Cards)
6. **PARAR E VALIDAR**: As 3 secoes P1 devem funcionar perfeitamente

### Progresso Atual

| Phase | Total | Done | Pendente |
|-------|-------|------|----------|
| Setup (Phase 1) | 3 | 2 | 1 |
| Foundational (Phase 2) | 5 | 0 | 5 |
| US1 Hero (Phase 3) | 4 | 2 | 2 |
| US2 Fe (Phase 4) | 2 | 0 | 2 |
| US3 Locais (Phase 5) | 3 | 0 | 3 |
| US4 Eventos (Phase 6) | 5 | 0 | 5 |
| US5 Comunidade (Phase 7) | 3 | 1 | 2 |
| Polish (Phase 8) | 8 | 0 | 8 |
| **TOTAL** | **33** | **5** | **28** |

---

## Notes

- [P] tasks = arquivos diferentes, sem dependencias
- [Story] label mapeia task para user story
- Cada user story eh independentemente testavel
- Commit apos cada task ou grupo logico
- Parar em qualquer checkpoint para validar
- Todos os componentes sao Server Components exceto navbar (precisa de 'use client' para scroll detection)
- Dados sao estaticos/hardcoded — sem backend
- Paleta de 8 cores substitui marigold/coral/salmon completamente
- T001 (paleta) eh o bloqueador critico — priorizar acima de tudo
