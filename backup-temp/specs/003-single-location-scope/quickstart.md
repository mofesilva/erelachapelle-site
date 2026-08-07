# Quickstart: Single-Location Scope

**Feature**: 003-single-location-scope

## Overview

This feature removes multi-location support (Lasalle, Monoblet) and
keeps only La Chapelle (Saint-Hippolyte-du-Fort) as the sole location.

## Verification Steps

1. **Build**: `npm run build` — must pass with zero errors
2. **Visual**: Run `npm run dev` and check homepage GatheringSection
   shows only La Chapelle with balanced layout
3. **Search**: Grep codebase for "Lasalle" and "Monoblet" — zero results
   expected in `src/` directory
4. **i18n**: Switch between FR/PT/EN and verify location info renders
   correctly in all languages

## Files to Change

| File | Action | Description |
|------|--------|-------------|
| `src/lib/data/locations.ts` | Modify | Remove Lasalle/Monoblet entries |
| `src/lib/data/blog.ts` | Modify | Remove Lasalle-related articles |
| `src/lib/constants/index.ts` | Modify | Remove from locations array |
| `src/messages/fr.json` | Modify | Remove Lasalle/Monoblet text |
| `src/messages/en.json` | Modify | Remove Lasalle/Monoblet text |
| `src/messages/pt.json` | Modify | Remove Lasalle/Monoblet text |
| `src/app/[locale]/_components/GatheringSection.tsx` | Modify | Single-card layout |
