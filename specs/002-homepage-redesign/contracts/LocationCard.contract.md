# Component Contract: LocationCard

**Component**: `src/components/shared/LocationCard.tsx`
**Type**: Server Component
**Status**: NOVO
**Updated**: 2026-02-15

---

## Props

```typescript
interface LocationCardProps {
  image: string;          // URL da imagem da regiao
  icon: LucideIcon;       // Icone identificador (Church, MapPin, etc)
  name: string;           // Nome da localidade
  address: string;        // Endereco completo
  schedule: string;       // Horario do culto principal
}
```

## Behavior

### Visual
- Card com cantos arredondados e sombra
- Imagem da regiao no topo (h-48 ou aspect-video, object-cover)
- Abaixo da imagem: icone + nome + endereco + horario (centralizado)
- Icone: w-8 h-8, cor borgonha (#6A0D1E)
- Nome: text-2xl, Playfair, borgonha escuro (#3D000A)
- Endereco: text-base, Inter, muted
- Horario: text-lg, Inter, semi-bold

### Layout
- Desktop: Cards lado a lado (grid-cols-3 ou flex-row)
- Mobile: Empilhados (grid-cols-1 ou flex-col)
- Gap: 2rem desktop, 1.5rem mobile

### Fallback
- Sem imagem: gradiente borgonha com icone MapPin centralizado

---

## Acceptance Criteria
1. Exibe imagem da regiao no topo do card
2. Icone abaixo da imagem
3. Hierarquia clara: nome > endereco > horario
4. Responsivo (lado a lado -> empilhado)
5. Placeholder elegante quando sem imagem
