# Data Model: Homepage Redesign

**Phase**: 1 - Design & Contracts  
**Date**: 2026-02-15 (updated)  
**Type**: Visual Model (UI-only feature)

---

## Overview

Esta feature eh exclusivamente de UI/design. Nao ha modelo de dados backend. Este documento define o **modelo visual** das secoes da homepage: estrutura de props dos componentes, estados visuais e hierarquia de informacao.

Homepage com **5 secoes**: Hero, Declaracao de Fe, Locais (ID Cards), Eventos/Sermoes, Comunidade/Blog.
Secoes removidas: About (Quem Somos), Team (Equipe Pastoral).

---

## Visual Entities

### 1. HeroSection

**Purpose**: Primeira impressao impactante com navbar integrada.

**Visual Structure**:
```typescript
interface HeroSection {
  backgroundImage: string;          // URL da imagem de fundo
  title: string;                    // Titulo via next-intl
  subtitle: string;                 // Subtitulo via next-intl
  ctaText: string;                  // Texto do botao
  ctaHref: string;                  // Link do botao
  overlayOpacity: number;           // 0.4 (40% escuro)
  height: '80dvh';                  // Viewport dinamica
  scrollIndicator: boolean;         // Mostrar chevron animado
}
```

**Visual States**:
- **Default**: Imagem com overlay, texto centralizado, CTA em cor complementar, navbar transparente
- **Scrolled**: Navbar transiciona para borgonha (#6A0D1E) solido sem bordas brancas
- **Hover (CTA)**: Botao com transicao de cor (200ms)
- **No Image**: Placeholder com gradiente borgonha

**Hierarchy**:
1. Imagem de fundo (full bleed, 80dvh)
2. Overlay escuro (rgba(0,0,0,0.4))
3. Navbar transparente integrada (position absolute)
4. Titulo (text-5xl md:text-7xl, Playfair, branco, centrado)
5. Subtitulo (text-xl md:text-2xl, Inter, branco/90, centrado)
6. CTA button (cor complementar a borgonha - dourado #8C5E35)
7. Scroll indicator (absolute bottom, chevron animado, max 3 ciclos)

---

### 2. FaithStatementSection (NOVA)

**Purpose**: Mini declaracao de fe entre Hero e Locais.

**Visual Structure**:
```typescript
interface FaithStatementSection {
  statement: string;                // Texto declaracao de fe via next-intl
  ctaText: string;                  // "Saiba mais" via next-intl
  ctaHref: string;                  // Link para /about
}
```

**Visual States**:
- **Default**: Texto serif centralizado + botao CTA
- **Hover (CTA)**: Transicao de cor (200ms)

**Hierarchy**:
1. Texto de declaracao (text-2xl md:text-4xl, Playfair, borgonha #3D000A)
2. Botao "Saiba mais" (styled, link para /about)

**Background**: Bege (#E7C6B5) ou cor de contraste com o hero

---

### 3. LocationCard (ID Card)

**Purpose**: Card de localidade com imagem da regiao.

**Visual Structure**:
```typescript
interface LocationCard {
  image: string;                    // Imagem representativa da regiao
  icon: LucideIcon;                 // Icone identificador (Church, MapPin, etc)
  name: string;                     // Nome da localidade via next-intl
  address: string;                  // Endereco completo
  schedule: string;                 // Horario do culto via next-intl
}
```

**Visual States**:
- **Default**: Card com imagem no topo, icone, nome, endereco, horario
- **No Image**: Placeholder com gradiente borgonha
- **Loading**: Skeleton card

**Hierarchy**:
1. Imagem da regiao (aspect-video ou h-48, cover)
2. Icone (w-8 h-8, borgonha #6A0D1E)
3. Nome (text-2xl, Playfair, borgonha escuro #3D000A)
4. Endereco (text-base, Inter, muted)
5. Horario (text-lg, Inter, semi-bold)

**Layout**:
- Desktop: flex-row ou grid-cols-3 (lado a lado)
- Mobile: flex-col (empilhado)

---

### 4. Event

**Purpose**: Preview de eventos.

**Visual Structure**:
```typescript
interface Event {
  date: Date;
  type: 'culte' | 'conference' | 'jeunesse' | 'autre';
  title: string;
  location: string;
  description?: string;
  badgeColor: string;               // Dourado #8C5E35
  cardStyle: 'elevated';
}
```

**Badge Mapping** (nova paleta):
- `culte` -> Dourado (#8C5E35)
- `conference` -> Rose (#D1A594)
- `jeunesse` -> Borgonha (#6A0D1E) com texto claro
- `autre` -> Borgonha escuro (#3D000A)

---

### 5. Sermon

**Purpose**: Preview de sermoes.

**Visual Structure**:
```typescript
interface Sermon {
  thumbnail: string;
  date: Date;
  preacher: string;
  series: string;
  title: string;
  videoUrl: string;
  aspectRatio: '16/9';
  playIconOverlay: boolean;         // true
  cardStyle: 'wide';
}
```

---

### 6. CommunityGroup

**Purpose**: Grupos/ministerios sobre fundo borgonha.

**Visual Structure**:
```typescript
interface CommunityGroup {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  backgroundColor: '#6A0D1E';      // Borgonha
  cardStyle: 'inverted';           // Cards claros sobre fundo escuro
}
```

---

### 7. BlogPost

**Purpose**: Preview de artigos.

**Visual Structure**:
```typescript
interface BlogPost {
  image?: string;
  title: string;
  date: Date;
  category: string;
  excerpt?: string;
  slug: string;
  imagePosition: 'top';
  badgeColor: '#8C5E35';           // Dourado
  cardStyle: 'elevated';
}
```

---

## Design Tokens (Nova Paleta)

### Colors
```typescript
const colors = {
  'burgundy-dark': '#3D000A',
  'burgundy': '#6A0D1E',
  'gold': '#8C5E35',
  'rose': '#D1A594',
  'beige': '#E7C6B5',
  'white': '#EEEEEE',
  'gray': '#DADADA',
  'black': '#171717',
};
```

### Section Background Alternation (FR-030)
```text
Hero:        imagem + overlay (transparente)
Fe:          #E7C6B5 (bege) + texto #3D000A
Locais:      #EEEEEE (branco) + cards com sombra
Eventos:     #D1A594 (rose) + cards #EEEEEE
Comunidade:  #6A0D1E (borgonha) + cards claros
Blog:        #EEEEEE (branco) + cards com borda #DADADA
```

### Typography
```typescript
const typography = {
  headings: 'Playfair Display',    // serif
  body: 'Inter',                   // sans-serif
};
```

### Transitions
```typescript
enum TransitionLevel {
  Fast = '200ms',      // Links, botoes
  Medium = '250ms',    // Cards simples
  Smooth = '300ms'     // Cards interativos com scale
}
```

---

## Responsive Behavior

### Layout Transformations

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Hero | 80dvh | 80dvh |
| Fe | centrado max-w-3xl | centrado px-4 |
| LocationCards | grid-cols-3 / flex-row | grid-cols-1 / flex-col |
| Events | grid-cols-3 | grid-cols-1 |
| Sermons | grid-cols-2 | grid-cols-1 |
| Community | grid-cols-2 | grid-cols-1 |
| Blog | grid-cols-3 | grid-cols-1 |

---

## Accessibility Requirements

### Contrast Ratios (WCAG AA) - Nova Paleta
- #EEEEEE sobre #3D000A: **15.8:1** OK
- #EEEEEE sobre #6A0D1E: **10.2:1** OK
- #171717 sobre #E7C6B5: **9.8:1** OK
- #171717 sobre #D1A594: **7.6:1** OK
- #EEEEEE sobre #8C5E35: **4.6:1** OK (AA)

### Semantic HTML
- `<section>` para cada secao da homepage
- `<h1>` apenas no hero
- `<h2>` para titulos de secao
- `<h3>` para subtitulos (cards)
- `aria-label` para icones decorativos
- `alt` text para todas as imagens

---

## Summary

Este data model define **7 visual entities** (removidas CoreValue e TeamMember):
1. **HeroSection** - 80dvh com navbar integrada
2. **FaithStatementSection** - Declaracao de fe (NOVA)
3. **LocationCard** - ID Card com imagem da regiao (NOVO formato)
4. **Event** - Cards com date block + badge (nova paleta)
5. **Sermon** - Wide cards com play overlay
6. **CommunityGroup** - Inverted cards sobre borgonha
7. **BlogPost** - Image-first cards

Todas as entidades suportam **FR/PT/EN**, tem **fallbacks elegantes** e respeitam **WCAG AA**.
