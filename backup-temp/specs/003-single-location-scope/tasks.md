# Tasks: Single-Location Scope

**Input**: Design documents from `/specs/003-single-location-scope/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Organization**: Tasks grouped by user story for independent implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Data Cleanup (Remove Lasalle/Monoblet)

**Purpose**: Remove all multi-location data from the codebase

- [x] T001 [P] [US1] Remove Lasalle and Monoblet entries from src/lib/data/locations.ts, keeping only Saint-Hippolyte-du-Fort
- [x] T002 [P] [US1] Remove Lasalle/Monoblet from locations array in src/lib/constants/index.ts
- [x] T003 [P] [US2] Remove Lasalle-related blog articles from src/lib/data/blog.ts

**Checkpoint**: All static data files contain only La Chapelle references

---

## Phase 2: Translation Cleanup

**Purpose**: Remove all Lasalle/Monoblet references from translation files

- [x] T004 [P] [US2] Update src/messages/fr.json — remove Lasalle/Monoblet mentions from about.history and any other keys
- [x] T005 [P] [US2] Update src/messages/en.json — remove Lasalle/Monoblet mentions from about.history and any other keys
- [x] T006 [P] [US2] Update src/messages/pt.json — remove Lasalle/Monoblet mentions from about.history and any other keys

**Checkpoint**: Zero references to "Lasalle" or "Monoblet" in any translation file

---

## Phase 3: User Story 1 - Seção de Localização Single-Card (Priority: P1) 🎯 MVP

**Goal**: Adaptar a GatheringSection para exibir um único card centralizado
com as informações de La Chapelle de forma visualmente equilibrada.

**Independent Test**: Acessar a homepage e verificar que a seção de
localização mostra apenas La Chapelle com layout equilibrado (não um grid
3-col com 1 item).

### Implementation for User Story 1

- [x] T007 [US1] Redesign GatheringSection layout in src/app/[locale]/_components/GatheringSection.tsx — replace 3-column grid with centered single-card layout featuring location info and Google Map embed

**Checkpoint**: Homepage GatheringSection shows exactly 1 location with balanced, visually appealing layout

---

## Phase 4: Polish & Validation

**Purpose**: Final verification and cleanup

- [x] T008 Run grep across src/ for "Lasalle" and "Monoblet" — verify zero matches (SC-001)
- [x] T009 Run `npm run build` to verify project compiles without errors (SC-004)
- [x] T010 Verify all 3 languages (FR/PT/EN) render correctly on homepage location section (SC-003)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Data Cleanup)**: No dependencies — start immediately
- **Phase 2 (Translations)**: No dependencies — can run in parallel with Phase 1
- **Phase 3 (UI Layout)**: Depends on Phase 1 (T001) — needs clean location data
- **Phase 4 (Validation)**: Depends on all previous phases

### User Story Dependencies

- **US1 (Location section)**: T001 → T002 → T007 (data first, then UI)
- **US2 (Site-wide cleanup)**: T003, T004, T005, T006 all parallel (independent files)

### Parallel Opportunities

- T001, T002, T003 can all run in parallel (different files)
- T004, T005, T006 can all run in parallel (different locale files)
- T008, T009, T010 are sequential validation steps

---

## Parallel Example: Phase 1

```bash
# All data cleanup tasks run in parallel:
Task T001: "Remove Lasalle/Monoblet from src/lib/data/locations.ts"
Task T002: "Remove from src/lib/constants/index.ts"
Task T003: "Remove from src/lib/data/blog.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Data Cleanup (T001, T002)
2. Complete Phase 3: GatheringSection redesign (T007)
3. **VALIDATE**: Homepage shows only La Chapelle with good layout

### Full Delivery

1. Phase 1 + Phase 2 in parallel (all data + translations)
2. Phase 3: UI adaptation
3. Phase 4: Final validation
4. Total: 10 tasks, ~7 files modified

---

## Notes

- This is a simplification feature — no new files created
- LocationCard component reused as-is for single card
- Location type interface unchanged
- Blog articles about Lasalle youth group are placeholder data — safe to remove
