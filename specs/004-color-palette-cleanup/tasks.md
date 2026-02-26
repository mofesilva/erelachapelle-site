# Tasks: Color Palette Cleanup

**Input**: Design documents from `/specs/004-color-palette-cleanup/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story for independent implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Nenhuma inicialização de projeto necessária — projeto já existe. Esta fase não se aplica.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Reescrever o CSS global com a nova paleta base e aliases semânticos. BLOQUEIA todas as user stories.

**⚠️ CRITICAL**: Nenhuma migração de componente pode começar até que o globals.css esteja atualizado.

- [x] T001 Reescrever variáveis CSS da paleta base em `:root` no arquivo `src/app/globals.css`: substituir todas as variáveis antigas por 11 cores da paleta base (`--carbon-black: #171717ff`, `--rich-mahogany: #3d0008ff`, `--night-bordeaux: #520014ff`, `--night-bordeaux-2: #660019ff`, `--coffee-bean: #76522eff`, `--olive-wood: #845c33ff`, `--toffee-brown: #936639ff`, `--powder-petal: #e2d4cbff`, `--dust-grey: #e9dfd8ff`, `--parchment: #f9f4f1ff`, `--scarlet-red: #EF4444ff`) + aliases semânticos shadcn/ui mínimos (background→parchment, foreground→carbon-black, primary→night-bordeaux-2, primary-foreground→parchment, secondary→dust-grey, secondary-foreground→carbon-black, muted→powder-petal, muted-foreground→coffee-bean, accent→toffee-brown, accent-foreground→carbon-black, destructive→scarlet-red, destructive-foreground→parchment, card→parchment, card-foreground→carbon-black, popover→parchment, popover-foreground→carbon-black, border→dust-grey, input→dust-grey, ring→night-bordeaux). Remover: chart-1..5, sidebar-*, accent-gold, accent-rose, accent-beige, burgundy, burgundy-dark, burgundy-hover, burgundy-accent, gold, gold-light, gold-hover, rose, beige, gray-light, white, gray, black
- [x] T002 Reescrever seção `@theme inline` em `src/app/globals.css`: mapear apenas as 11 cores da paleta base (`--color-carbon-black`, `--color-rich-mahogany`, `--color-night-bordeaux`, `--color-night-bordeaux-2`, `--color-coffee-bean`, `--color-olive-wood`, `--color-toffee-brown`, `--color-powder-petal`, `--color-dust-grey`, `--color-parchment`, `--color-scarlet-red`) + os aliases semânticos shadcn/ui (background, foreground, primary, secondary, muted, accent, destructive, card, popover, border, input, ring e seus foregrounds). Remover todos os mapeamentos antigos de cores custom (burgundy-*, gold-*, rose, beige, gray-light, etc.)

**Checkpoint**: CSS global atualizado — classes Tailwind da paleta base funcionam (`bg-toffee-brown`, `text-rich-mahogany`, etc.) e aliases shadcn/ui continuam funcionando.

---

## Phase 3: User Story 1 — Paleta de Cores Consolidada (Priority: P1) 🎯 MVP

**Goal**: Todos os componentes shared e UI que usavam cores custom antigas migram para os nomes da nova paleta base.

**Independent Test**: Verificar que nenhum componente referencia classes antigas (`bg-burgundy`, `text-gold`, `bg-rose`, `bg-beige`, `bg-gray-light`, etc.) e que o site compila sem erros.

### Implementation for User Story 1

- [x] T003 [P] [US1] Migrar cores em `src/_components/DiamondDivider.tsx`: substituir `text-burgundy` → `text-night-bordeaux-2`, `bg-burgundy/50` → `bg-night-bordeaux-2/50`, `text-gold` → `text-toffee-brown`, `bg-gold/50` → `bg-toffee-brown/50`
- [x] T004 [P] [US1] Migrar cores em `src/_components/CrossDivider.tsx`: substituir referências a `burgundy` e `gold` para `night-bordeaux-2` e `toffee-brown`
- [x] T005 [P] [US1] Migrar cores em `src/_components/SectionLabel.tsx`: substituir `text-gold` → `text-toffee-brown`, gradientes `via-gold/40` → `via-toffee-brown/40`
- [x] T006 [P] [US1] Migrar cores em `src/_components/SplitButton.tsx`: substituir `bg-gold` → `bg-toffee-brown`, `bg-gold-light` → `bg-olive-wood`, `bg-gold-hover` → `bg-olive-wood`, `from-gold to-gold-light` → `from-toffee-brown to-olive-wood`
- [x] T007 [P] [US1] Migrar cores em `src/_components/TeamMemberCard.tsx`: substituir `text-rose` → `text-powder-petal`
- [x] T008 [P] [US1] Migrar cores em `src/_components/NewsletterSignup.tsx`: verificar e migrar qualquer referência a cores custom antigas

**Checkpoint**: Componentes shared migrados — paleta base aplicada corretamente.

---

## Phase 4: User Story 2 — Componentes de Página Atualizados (Priority: P2)

**Goal**: Todos os componentes de página (Header, sections, cards) usam a nova paleta.

**Independent Test**: Navegar por todas as páginas e verificar que nenhum componente exibe cor indefinida ou referencia variáveis antigas.

### Implementation for User Story 2

- [ ] T009 [P] [US2] Migrar cores em `src/app/[locale]/_components/Header.tsx`: substituir `bg-burgundy` → `bg-night-bordeaux-2`
- [ ] T010 [P] [US2] Migrar cores em `src/app/[locale]/_components/hero/HeroSection.tsx`: substituir referências a `burgundy` para cores da nova paleta
- [ ] T011 [P] [US2] Migrar cores em `src/app/[locale]/_components/hero/HeroBanner.tsx`: substituir referências a cores custom antigas
- [ ] T012 [P] [US2] Migrar cores em `src/app/[locale]/_components/faith-statement/FaithStatementSection.tsx`: substituir gradientes `from-burgundy via-burgundy-dark` → `from-night-bordeaux-2 via-rich-mahogany`, `text-burgundy-dark` → `text-rich-mahogany`
- [ ] T013 [P] [US2] Migrar cores em `src/app/[locale]/_components/GatheringSection.tsx`: substituir `bg-beige` → `bg-dust-grey`, `text-burgundy-dark` → `text-rich-mahogany`, gradientes gold → toffee-brown
- [ ] T014 [P] [US2] Migrar cores em `src/app/[locale]/_components/SermonsPreviewSection.tsx`: substituir `bg-beige` → `bg-dust-grey`, `text-burgundy-dark` → `text-rich-mahogany`, `text-gold` → `text-toffee-brown`, gradientes burgundy → night-bordeaux
- [ ] T015 [P] [US2] Migrar cores em `src/app/[locale]/_components/SermonCard.tsx`: substituir referências a cores custom antigas
- [ ] T016 [P] [US2] Migrar cores em `src/app/[locale]/_components/EventsPreviewSection.tsx`: substituir `bg-burgundy` → `bg-night-bordeaux-2`, `text-gold` → `text-toffee-brown`, gradientes
- [ ] T017 [P] [US2] Migrar cores em `src/app/[locale]/_components/EventCard.tsx`: substituir `bg-gold` → `bg-toffee-brown`, `bg-rose` → `bg-powder-petal`, `text-burgundy-dark` → `text-rich-mahogany`, gradientes `from-burgundy via-burgundy-dark` → `from-night-bordeaux-2 via-rich-mahogany`
- [ ] T018 [P] [US2] Migrar cores em `src/app/[locale]/_components/CommunitySection.tsx`: substituir `bg-burgundy` → `bg-night-bordeaux-2`, `text-gold` → `text-toffee-brown`, `bg-gold/10` → `bg-toffee-brown/10`, `border-gold/30` → `border-toffee-brown/30`
- [ ] T019 [P] [US2] Migrar cores em `src/app/[locale]/_components/BlogPreviewSection.tsx`: substituir `text-burgundy-dark` → `text-rich-mahogany`, `text-gold` → `text-toffee-brown`, `bg-gray-light` → `bg-dust-grey`, gradientes
- [ ] T020 [P] [US2] Migrar cores em `src/app/[locale]/_components/LocationCard.tsx`: substituir `text-burgundy-dark` → `text-rich-mahogany`, `text-gold` → `text-toffee-brown`, gradientes gold
- [ ] T021 [P] [US2] Migrar cores em `src/app/[locale]/_components/AboutSection.tsx`: substituir referências a cores custom antigas
- [ ] T022 [P] [US2] Migrar cores em `src/app/[locale]/_components/LanguageSwitcher.tsx` (se existir em `_components`): substituir referências a cores custom antigas

**Checkpoint**: Todos os componentes de página migrados. Site renderiza com nova paleta.

---

## Phase 5: User Story 3 — Mapeamento Tailwind Limpo (Priority: P3)

**Goal**: Garantir que o `@theme inline` está limpo e que páginas de sub-rotas (public) também usam a paleta correta.

**Independent Test**: Verificar que nenhum arquivo TSX referencia classes Tailwind de cores antigas e que `next build` passa sem warnings.

### Implementation for User Story 3

- [x] T023 [P] [US3] Verificar e migrar cores em `src/app/[locale]/(public)/sermons/_components/SermonCard.tsx`: substituir referências a cores custom antigas
- [x] T024 [P] [US3] Verificar e migrar cores em `src/app/[locale]/(public)/sermons/_components/SermonFilters.tsx`: substituir referências a cores custom antigas
- [x] T025 [P] [US3] Verificar e migrar cores em `src/app/[locale]/(public)/events/_components/EventCard.tsx`: substituir referências a cores custom antigas
- [x] T026 [P] [US3] Verificar e migrar cores em `src/app/[locale]/(public)/events/_components/EventFilters.tsx` e `EventRegistrationForm.tsx`: substituir referências a cores custom antigas
- [x] T027 [P] [US3] Verificar e migrar cores em `src/app/[locale]/(public)/blog/_components/ArticleCard.tsx` e `ArticleFilters.tsx`: substituir referências a cores custom antigas
- [x] T028 [P] [US3] Verificar e migrar cores em `src/app/[locale]/(public)/community/_components/GroupFilters.tsx` e `JoinGroupForm.tsx`: substituir referências a cores custom antigas
- [x] T029 [P] [US3] Verificar e migrar cores em `src/app/[locale]/(public)/contact/_components/ContactForm.tsx`: substituir referências a cores custom antigas
- [x] T030 [P] [US3] Verificar e migrar cores em `src/app/[locale]/(public)/blog/[slug]/page.tsx`, `events/[slug]/page.tsx`, `sermons/[slug]/page.tsx`, `community/groups/[id]/page.tsx`: substituir referências a cores custom antigas

**Checkpoint**: Todas as sub-rotas public migradas.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação final, limpeza e documentação.

- [ ] T031 Executar `next build` em `M:\Projetos\website\erelachapelle-site` e corrigir qualquer erro de compilação relacionado a cores
- [ ] T032 Buscar em todo o codebase (`src/`) por referências remanescentes a classes antigas (`burgundy`, `gold`, `rose`, `beige`, `gray-light`) e corrigir
- [ ] T033 Atualizar `docs/design-system.md` para refletir a nova paleta de cores e nomes
- [ ] T034 Atualizar constitution `IX. Sistema de Design Consistente` em `.specify/memory/constitution.md` para refletir nova paleta (substituir "Borgonha (#722F37)" pelos novos nomes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: Sem dependências — começa imediatamente. **BLOQUEIA todas as user stories.**
- **US1 (Phase 3)**: Depende de Phase 2 (globals.css atualizado)
- **US2 (Phase 4)**: Depende de Phase 2. Pode rodar em paralelo com US1.
- **US3 (Phase 5)**: Depende de Phase 2. Pode rodar em paralelo com US1 e US2.
- **Polish (Phase 6)**: Depende de US1 + US2 + US3 completas.

### User Story Dependencies

- **User Story 1 (P1)**: Independente — componentes shared não dependem de page components
- **User Story 2 (P2)**: Independente — page components não dependem de sub-route components
- **User Story 3 (P3)**: Independente — sub-route components são self-contained

### Parallel Opportunities

- T003-T008 (US1): Todos [P] — arquivos diferentes, sem dependências entre si
- T009-T022 (US2): Todos [P] — arquivos diferentes, sem dependências entre si
- T023-T030 (US3): Todos [P] — arquivos diferentes, sem dependências entre si
- US1, US2, US3 podem rodar em paralelo após Phase 2

---

## Parallel Example: User Story 1

```
# Todos os componentes shared podem ser migrados simultaneamente:
Task T003: DiamondDivider.tsx
Task T004: CrossDivider.tsx
Task T005: SectionLabel.tsx
Task T006: SplitButton.tsx
Task T007: TeamMemberCard.tsx
Task T008: NewsletterSignup.tsx
```

## Parallel Example: User Story 2

```
# Todos os componentes de página podem ser migrados simultaneamente:
Task T009: Header.tsx
Task T010: HeroSection.tsx
Task T012: FaithStatementSection.tsx
Task T013: GatheringSection.tsx
Task T016: EventsPreviewSection.tsx
Task T018: CommunitySection.tsx
Task T019: BlogPreviewSection.tsx
(... e todos os demais)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (globals.css)
2. Complete Phase 3: User Story 1 (shared components)
3. **STOP and VALIDATE**: Build + visual check
4. Site já funciona com nova paleta base

### Incremental Delivery

1. Phase 2 → CSS global atualizado
2. US1 → Componentes shared migrados → Build OK
3. US2 → Componentes de página migrados → Visual completo
4. US3 → Sub-rotas migradas → Cobertura total
5. Polish → Validação final + docs

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- Componentes shadcn/ui (button, badge, input, form, sheet, textarea) **NÃO precisam ser alterados** — os aliases semânticos mantêm compatibilidade
- Classes semânticas (`bg-primary`, `text-foreground`, etc.) permanecem intocadas nos componentes
- Apenas classes custom (`bg-burgundy`, `text-gold`, etc.) são migradas
- Commit após cada phase ou grupo lógico de tasks
