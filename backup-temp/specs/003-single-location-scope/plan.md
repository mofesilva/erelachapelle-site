# Implementation Plan: Single-Location Scope

**Branch**: `003-single-location-scope` | **Date**: 2026-02-18 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-single-location-scope/spec.md`

## Summary

Remover todas as referências a Lasalle e Monoblet do projeto, mantendo
apenas La Chapelle (Saint-Hippolyte-du-Fort) como única localização.
Adaptar o layout da seção de localização da homepage para exibir um único
local de forma visualmente equilibrada. Limpar dados estáticos, traduções
e constantes.

## Technical Context

**Language/Version**: TypeScript 5+ / Next.js 16.1.4 (App Router)
**Primary Dependencies**: React 19, Tailwind CSS 4, shadcn/ui, next-intl
**Storage**: Dados estáticos em arquivos TypeScript (sem banco de dados)
**Testing**: Build verification (`npm run build`)
**Target Platform**: Web (SSR/SSG)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: N/A (simplificação, não adição)
**Constraints**: Manter suporte FR/PT/EN, manter build sem erros
**Scale/Scope**: ~10 arquivos afetados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. KISS | ✅ PASS | Simplificação — remove complexidade multi-location |
| II. DRY | ✅ PASS | Dados centralizados em locations.ts, mudança única |
| III. SOLID | ✅ PASS | Sem impacto — simplificação de dados |
| IV. Clean Code | ✅ PASS | Remoção de código morto (Lasalle/Monoblet) |
| V. Clean Architecture | ✅ PASS | Mesma arquitetura, menos dados |
| VI. Feature-Based Org | ✅ PASS | Componentes já na estrutura correta |
| VII. Server-First | ✅ PASS | Sem mudança de padrão |
| VIII. Multilingual | ✅ PASS | Mantém FR/PT/EN para La Chapelle |
| IX. Design System | ✅ PASS | Layout adaptado para single card |
| X. Performance | ✅ PASS | Menos dados = melhor performance |
| XI. Mobile-First | ✅ PASS | Layout single card é naturalmente mobile-first |
| Project Scope | ✅ PASS | Alinha 100% com nova seção de escopo |

**GATE RESULT**: ✅ ALL PASS — No violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-single-location-scope/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (minimal — no unknowns)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (files affected)

```text
src/
├── lib/
│   ├── data/
│   │   ├── locations.ts          # MODIFY: Remove Lasalle/Monoblet entries
│   │   └── blog.ts               # MODIFY: Remove Lasalle-related articles
│   └── constants/
│       └── index.ts              # MODIFY: Remove Lasalle/Monoblet from array
├── types/
│   └── location.ts               # NO CHANGE: Interface stays the same
├── messages/
│   ├── fr.json                   # MODIFY: Remove Lasalle/Monoblet text
│   ├── en.json                   # MODIFY: Remove Lasalle/Monoblet text
│   └── pt.json                   # MODIFY: Remove Lasalle/Monoblet text
├── app/[locale]/_components/
│   ├── GatheringSection.tsx      # MODIFY: Single-location layout
│   └── LocationCard.tsx          # NO CHANGE: Reuse as-is for single card
└── components/shared/
    └── GoogleMapEmbed.tsx        # NO CHANGE: Already single-use
```

**Structure Decision**: No new files needed. This is purely a data removal
and layout adaptation within existing structure.

## Complexity Tracking

> No violations found. No complexity justification needed.
