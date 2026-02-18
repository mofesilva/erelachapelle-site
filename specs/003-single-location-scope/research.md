# Research: Single-Location Scope

**Feature**: 003-single-location-scope
**Date**: 2026-02-18

## Summary

This feature has no technical unknowns. It is a data removal and layout
simplification. All decisions are straightforward.

## Decisions

### D1: Location Data Strategy

**Decision**: Remove Lasalle and Monoblet entries from the LOCATIONS array
in `locations.ts`. Keep only `loc-saint-hippolyte`.

**Rationale**: Constitution Project Scope mandates single-location. The
`getLocations()` function filters by `active: true`, but we should remove
the data entirely rather than just marking inactive, to keep code clean.

**Alternatives considered**:
- Mark Lasalle/Monoblet as `active: false` — rejected because dead data
  adds noise and violates Clean Code principle (no dead code).

### D2: GatheringSection Layout

**Decision**: Adapt the 3-column grid to a centered single-card layout
with integrated Google Map. Instead of 3 LocationCards, show one prominent
card with full details and a map embed.

**Rationale**: A single card in a 3-column grid looks unbalanced. A
centered, wider layout is more visually appealing for a single location.

**Alternatives considered**:
- Keep 3-column grid with 1 card — looks broken/empty.
- Remove GatheringSection entirely — loses valuable location info.

### D3: Blog Data Cleanup

**Decision**: Remove or update blog articles that reference Lasalle
(youth group launch articles).

**Rationale**: Articles mentioning Lasalle locations contradict the
single-location scope.

**Alternatives considered**:
- Keep articles but remove location references — possible but
  the articles are placeholder data anyway.

### D4: Translation Cleanup

**Decision**: Update about.history text in all 3 locale files to remove
mentions of Lasalle and Monoblet. Update location constants.

**Rationale**: FR-002 and FR-005 require complete removal from all
data sources including translations.
