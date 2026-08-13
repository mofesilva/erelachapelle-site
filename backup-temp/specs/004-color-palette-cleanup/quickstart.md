# Quickstart: Color Palette Cleanup

## Nova Paleta de Cores

| Nome CSS | Classe Tailwind | Hex | Uso Principal |
|----------|-----------------|-----|---------------|
| `--carbon-black` | `bg-carbon-black`, `text-carbon-black` | #171717 | Texto principal, foreground |
| `--rich-mahogany` | `bg-rich-mahogany`, `text-rich-mahogany` | #3d0008 | Fundos escuros profundos |
| `--night-bordeaux` | `bg-night-bordeaux`, `text-night-bordeaux` | #520014 | Hover states, ring, accent escuro |
| `--night-bordeaux-2` | `bg-night-bordeaux-2`, `text-night-bordeaux-2` | #660019 | Cor principal (era primary/burgundy) |
| `--coffee-bean` | `bg-coffee-bean`, `text-coffee-bean` | #76522e | Texto metadata/secundário |
| `--olive-wood` | `bg-olive-wood`, `text-olive-wood` | #845c33 | Variantes gold light/hover |
| `--toffee-brown` | `bg-toffee-brown`, `text-toffee-brown` | #936639 | Accent dourado principal |
| `--powder-petal` | `bg-powder-petal`, `text-powder-petal` | #e2d4cb | Backgrounds atenuados (era muted) |
| `--dust-grey` | `bg-dust-grey`, `text-dust-grey` | #e9dfd8 | Bordas, secondary bg |
| `--parchment` | `bg-parchment`, `text-parchment` | #f9f4f1 | Background principal, cards |
| `--scarlet-red` | `bg-scarlet-red`, `text-scarlet-red` | #EF4444 | Erros, alertas (era destructive) |

## Cheat Sheet: Migração Rápida

```
bg-primary       → bg-night-bordeaux-2
bg-burgundy      → bg-night-bordeaux-2
bg-burgundy-dark → bg-rich-mahogany
bg-gold          → bg-toffee-brown
bg-gold-light    → bg-olive-wood
bg-rose          → bg-powder-petal
bg-beige         → bg-dust-grey
bg-muted         → bg-powder-petal
bg-background    → bg-parchment
bg-destructive   → bg-scarlet-red
bg-secondary     → bg-dust-grey
bg-card          → bg-parchment
bg-accent        → bg-toffee-brown

text-primary           → text-night-bordeaux-2
text-primary-foreground→ text-dust-grey
text-foreground        → text-carbon-black
text-muted-foreground  → text-coffee-bean
text-destructive       → text-scarlet-red
text-gold              → text-toffee-brown
text-burgundy          → text-night-bordeaux-2
text-burgundy-dark     → text-rich-mahogany

border-border → border-dust-grey
border-input  → border-dust-grey
ring-ring     → ring-night-bordeaux
```

## Estratégia

**Duas camadas**:
1. **Paleta base** (11 cores) — as cores reais, nomeadas descritivamente
2. **Aliases shadcn/ui** (19 aliases) — apontam para a paleta base, mantidos porque shadcn/ui depende deles

**O que muda nos componentes custom** (Header, sections, cards, dividers, etc.):
- Trocar classes custom antigas (`bg-burgundy`, `text-gold`, etc.) → nomes da paleta base
- Classes semânticas shadcn (`bg-primary`, `text-foreground`, etc.) **permanecem** — só o valor CSS muda

**O que NÃO muda**:
- Componentes shadcn/ui (button, badge, input, form, sheet, textarea) — sem alteração
