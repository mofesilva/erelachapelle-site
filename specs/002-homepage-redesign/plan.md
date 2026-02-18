# Implementation Plan: Homepage Redesign

**Branch**: `002-homepage-redesign` | **Date**: 2026-02-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-homepage-redesign/spec.md`
**Nome oficial**: Eglise Reformee Evangelique La Chapelle

## Summary

Redesign visual completo da homepage do site da Eglise Reformee Evangelique La Chapelle. O layout existente (8 componentes de secao) sera reestruturado para 5 secoes principais: Hero (80dvh com navbar integrada transparente->borgonha), Declaracao de Fe (nova secao), Locais (ID Cards com imagem da regiao), Eventos/Sermoes (cards interativos) e Comunidade/Blog (fundo borgonha com contraste). As secoes "Sobre" e "Equipe Pastoral" foram removidas. A paleta de cores foi redefinida com 8 cores (#3D000A, #6A0D1E, #8C5E35, #D1A594, #E7C6B5, #EEEEEE, #DADADA, #171717) substituindo marigold/coral/salmon. Foco em contraste visual forte entre secoes e cards (nunca fundo branco + card branco). Divisorias borgonha.

## Technical Context

**Language/Version**: TypeScript 5+ / Next.js 16.1.4 (App Router)
**Primary Dependencies**: React 19.2.3, Tailwind CSS 4, shadcn/ui, Radix UI, Lucide React, next-intl
**Storage**: N/A (dados estaticos hardcoded - redesign visual apenas)
**Testing**: Visual regression + responsive testing manual (320px, 768px, 1440px)
**Target Platform**: Web (desktop + mobile + tablet), SSR via Next.js
**Project Type**: Web Application (Next.js App Router)
**Performance Goals**: Lighthouse >90, CLS <0.1, page load <3s em 3G
**Constraints**: Server Components por padrao, Mobile-First CSS, suporte FR/PT/EN, paleta de 8 cores definida
**Scale/Scope**: 1 pagina (homepage), 5 secoes, ~10 componentes modificados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Status | Notas |
|-----------|--------|-------|
| I. KISS | PASS | Modifica componentes existentes, nao cria abstracoes novas |
| II. DRY | PASS | Reutiliza componentes compartilhados (EventCard, SermonCard, SectionLabel) |
| III. SOLID | PASS | Cada secao = 1 responsabilidade, props especificas |
| IV. Clean Code | PASS | Nomes semanticos existentes mantidos |
| V. Clean Architecture | PASS | Apenas camada Presentation afetada (components/) |
| VI. Feature-Based | PASS | Componentes de secao em src/components/sections/ |
| VII. Server-First | PASS | Todas as secoes sao Server Components (visual apenas) |
| VIII. Multilingual | PASS | Traducoes FR/PT/EN em src/messages/*.json |
| IX. Design System | UPDATE | Paleta de cores muda: borgonha mantido, marigold/coral/salmon -> nova paleta de 8 cores. Playfair + Inter mantidos |
| X. Performance | PASS | next/image para imagens, Server Components, sem JS client desnecessario |
| XI. Mobile-First | PASS | CSS base para mobile, prefixos md: e lg: para telas maiores, dvh ao inves de vh |

**Nota sobre Principio IX**: A constituicao define cores de acento como Marigold, Coral, Salmon. O redesign as substitui por uma nova paleta (#3D000A, #6A0D1E, #8C5E35, #D1A594, #E7C6B5, #EEEEEE, #DADADA, #171717). Isso eh uma decisao consciente do stakeholder para refinar a identidade visual. A constituicao devera ser atualizada apos validacao do redesign.

## Project Structure

### Documentation (this feature)

```text
specs/002-homepage-redesign/
+-- plan.md              # This file
+-- spec.md              # Feature specification (updated 2026-02-15)
+-- research.md          # Phase 0 output
+-- data-model.md        # Phase 1 output
+-- quickstart.md        # Phase 1 output
+-- contracts/           # Phase 1 output
+-- tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
+-- app/
|   +-- [locale]/
|   |   +-- page.tsx                          # Homepage - importa e compoe as secoes
|   +-- globals.css                           # Design tokens, cores, animacoes
+-- components/
|   +-- sections/                             # Componentes de secao da homepage
|   |   +-- HeroSection.tsx                   # US1: Hero 80dvh + navbar integrada
|   |   +-- FaithStatementSection.tsx         # US2: Declaracao de Fe (NOVO)
|   |   +-- GatheringSection.tsx              # US3: ID Cards de localidades
|   |   +-- EventsPreviewSection.tsx          # US4: Preview de eventos
|   |   +-- SermonsPreviewSection.tsx         # US4: Preview de sermoes
|   |   +-- CommunitySection.tsx              # US5: Comunidade (fundo borgonha)
|   |   +-- BlogPreviewSection.tsx            # US5: Blog com cards de imagem
|   |   +-- AboutSection.tsx                  # REMOVIDO da homepage
|   |   +-- TeamSection.tsx                   # REMOVIDO da homepage
|   +-- shared/
|       +-- SectionLabel.tsx                  # Decorativo
|       +-- LocationCard.tsx                  # ID Card de localidade (NOVO)
|       +-- EventCard.tsx                     # Card reutilizavel de evento
|       +-- SermonCard.tsx                    # Card reutilizavel de sermao
+-- messages/
|   +-- fr.json                              # Traducoes frances (padrao)
|   +-- pt.json                              # Traducoes portugues
|   +-- en.json                              # Traducoes ingles
```

**Novos componentes**:
- `src/components/sections/FaithStatementSection.tsx` - US2: Secao Declaracao de Fe (nova)
- `src/components/shared/LocationCard.tsx` - ID Card de localidade (nova)

**Componentes removidos da homepage** (mantidos no codebase para uso em outras paginas):
- `AboutSection.tsx` - removido do page.tsx
- `TeamSection.tsx` - removido do page.tsx

**Structure Decision**: Next.js Web Application com componentes de secao em `src/components/sections/` e compartilhados em `src/components/shared/`. Segue a estrutura existente do projeto.

## Complexity Tracking

| Decisao | Justificativa | Alternativa Rejeitada |
|---------|---------------|----------------------|
| Nova paleta de 8 cores | Decisao do stakeholder para identidade visual mais coesa | Manter marigold/coral/salmon - falta de contraste |
| Navbar integrada ao hero (transparente->borgonha) | UX mais imersiva, hero 80dvh sem navbar separada | Navbar fixa separada - bordas brancas causam artefatos |
| Remocao de AboutSection e TeamSection | Simplificar homepage, focar no essencial | Manter todas as secoes - excesso de conteudo |
