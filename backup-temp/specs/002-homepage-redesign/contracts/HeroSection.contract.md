# Component Contract: HeroSection

**Component**: `src/components/sections/HeroSection.tsx`
**Type**: Server Component (exceto navbar scroll = client)
**Updated**: 2026-02-15

---

## Props

```typescript
// Nao recebe props - usa next-intl internamente
// Dados hardcoded ou via traducoes
```

## Behavior

### Visual
- Ocupa **80dvh** (viewport dinamica)
- Imagem de fundo full-bleed com `object-cover`
- Overlay escuro `rgba(0,0,0,0.4)`
- Titulo e subtitulo **centralizados** (horizontal e vertical)
- Fonte serif elegante (Playfair Display)
- Botao CTA em cor **dourado (#8C5E35)** - complementar a borgonha
- Scroll indicator (chevron animado, max 3 ciclos)

### Navbar Integrada
- Navbar posicionada **dentro** do hero (position absolute/fixed)
- Estado inicial: **transparente** (sem bordas)
- Ao scrollar alem do hero: transiciona para **borgonha solido (#6A0D1E)**
- **Sem bordas brancas** em nenhum estado
- Transicao suave (300ms ease)
- Requer `'use client'` no componente de navbar para IntersectionObserver

### Responsive
- Mobile: mesmos 80dvh, texto menor (text-3xl), padding lateral
- Desktop: texto grande (text-7xl), centrado

### i18n
- Titulo, subtitulo e CTA traduzidos via `useTranslations('homepage.hero')`

---

## Acceptance Criteria
1. Hero ocupa 80% da viewport dinamica
2. Navbar transparente sobre hero, borgonha solido ao scrollar
3. Sem bordas brancas na navbar em qualquer estado
4. Texto e botao centralizados
5. CTA em cor complementar (dourado #8C5E35)
6. Scroll indicator animado na parte inferior
