# Component Contract: EventCard

**Component**: `src/components/shared/EventCard.tsx`
**Type**: Server Component
**Updated**: 2026-02-15

---

## Props

```typescript
interface EventCardProps {
  date: Date;
  type: 'culte' | 'conference' | 'jeunesse' | 'autre';
  title: string;
  location: string;
  description?: string;
}
```

## Behavior

### Visual
- Card com border sutil e hover state
- Data em bloco visual destacado (dia grande + mes abreviado)
- Badge de tipo com cor da nova paleta:
  - `culte` -> Dourado (#8C5E35)
  - `conference` -> Rose (#D1A594)
  - `jeunesse` -> Borgonha (#6A0D1E)
  - `autre` -> Borgonha escuro (#3D000A)
- Titulo em Playfair serif
- Localizacao com MapPinIcon

### Hover
- Elevation + scale(1.02) - 300ms cubic-bezier
- box-shadow: 0 12px 32px rgba(0,0,0,0.16)

### Empty State
- 'Novos eventos em breve' com CalendarIcon

---

## Acceptance Criteria
1. Date block visualmente destacado
2. Badge com cor correta por tipo
3. Hover state suave com elevation
4. Responsivo (coluna unica em mobile)
