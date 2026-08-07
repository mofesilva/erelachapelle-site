# Quickstart Guide: Homepage Redesign

**Audience**: Designers & Developers  
**Phase**: 1 - Design & Contracts  
**Status**: Ready for Implementation  
**Updated**: 2026-02-15

---

## For Designers

### Paleta de Cores (8 cores)

```css
--burgundy-dark: #3D000A;   /* Headings, divisorias, acentos fortes */
--burgundy: #6A0D1E;        /* Navbar scrolled, CTA primario, fundo Community */
--gold: #8C5E35;            /* Badges, botoes de destaque, CTA hero */
--rose: #D1A594;            /* Fundos alternados, hover accents */
--beige: #E7C6B5;           /* Fundo secao Fe, fundos suaves */
--white: #EEEEEE;           /* Backgrounds claros, texto sobre borgonha */
--gray: #DADADA;            /* Borders sutis, muted elements */
--black: #171717;           /* Texto principal, headings sobre fundo claro */
```

### Regra de Contraste (FR-030)
**NUNCA** fundo branco + card branco na mesma secao. Alternar fundos entre secoes.

### Alternancia de Fundos
```text
Hero:        imagem + overlay
Fe:          bege (#E7C6B5)
Locais:      branco (#EEEEEE) + cards com sombra
Eventos:     rose (#D1A594) + cards brancos
Comunidade:  borgonha (#6A0D1E) + cards claros
Blog:        branco (#EEEEEE) + cards com borda
```

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Hero title**: text-5xl md:text-7xl
- **Section titles**: text-4xl
- **Card titles**: text-2xl
- **Body**: text-base

---

## For Developers

### Secoes da Homepage (5 secoes)

| Ordem | Secao | Componente | Status |
|-------|-------|-----------|--------|
| 1 | Hero | `HeroSection.tsx` | Modificar |
| 2 | Declaracao de Fe | `FaithStatementSection.tsx` | **NOVO** |
| 3 | Locais | `GatheringSection.tsx` + `LocationCard.tsx` | Modificar + **NOVO** |
| 4 | Eventos/Sermoes | `EventsPreviewSection.tsx` + `SermonsPreviewSection.tsx` | Modificar |
| 5 | Comunidade/Blog | `CommunitySection.tsx` + `BlogPreviewSection.tsx` | Modificar |

### Removidos da Homepage
- `AboutSection.tsx` - manter no codebase, remover do page.tsx
- `TeamSection.tsx` - manter no codebase, remover do page.tsx

### Files to Modify

#### Alta Prioridade
```text
src/app/[locale]/page.tsx                     # Composicao (remover About/Team, add Fe)
src/app/globals.css                           # Nova paleta de cores
src/components/sections/HeroSection.tsx       # 80dvh, navbar integrada
src/components/sections/FaithStatementSection.tsx  # NOVO
src/components/sections/GatheringSection.tsx  # ID Cards
src/components/shared/LocationCard.tsx        # NOVO - ID Card component
```

#### Media Prioridade
```text
src/components/sections/EventsPreviewSection.tsx   # Nova paleta badges
src/components/sections/SermonsPreviewSection.tsx   # Nova paleta
src/components/sections/CommunitySection.tsx        # Fundo borgonha
src/components/sections/BlogPreviewSection.tsx      # Cards com contraste
src/components/shared/EventCard.tsx                 # Badge colors
src/components/shared/SermonCard.tsx                 # Accent colors
```

#### Baixa Prioridade
```text
src/messages/fr.json        # Novas strings (declaracao de fe)
src/messages/pt.json        # Novas strings
src/messages/en.json        # Novas strings
```

### Code Standards

```tsx
// Server Components por padrao (sem 'use client')
export default function FaithStatementSection() {
  const t = useTranslations('homepage.faith');
  return <section>...</section>;
}

// Usar next-intl, nunca hardcode strings
const t = useTranslations('homepage.gathering');

// Tailwind utilities, nunca inline styles
<div className="h-[80dvh] bg-black/40">

// Nova paleta via CSS custom properties
<div className="bg-[var(--burgundy)] text-[var(--white)]">
```

### Useful Commands

```bash
npm run dev          # Start dev server
npx tsc --noEmit     # Type check
npm run lint         # Lint
npm run build        # Build for production
```

---

## Testing Checklist

### Visual
- [ ] Hero ocupa 80dvh
- [ ] Navbar transparente -> borgonha ao scrollar (sem bordas brancas)
- [ ] Declaracao de Fe aparece apos hero com fundo bege
- [ ] ID Cards de locais com imagem + icone + nome + endereco + horario
- [ ] Divisorias borgonha (nao cinza)
- [ ] Contraste entre secoes (nunca branco+branco)

### Responsive
- [ ] Mobile (320px): tudo empilha, hero 80dvh
- [ ] Tablet (768px): grid adapta
- [ ] Desktop (1440px): full layouts

### i18n
- [ ] Todas as strings em FR/PT/EN
- [ ] Declaracao de fe traduzida nos 3 idiomas

### Accessibility
- [ ] Contraste WCAG AA em toda a paleta
- [ ] Alt text em imagens dos ID Cards
- [ ] prefers-reduced-motion respeitado
- [ ] Keyboard navigation funcional

---

## Quick Reference

### Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1023px`
- Desktop: `>= 1024px`

### Transitions
- Fast: `200ms` (links, buttons)
- Medium: `250ms` (simple cards)
- Smooth: `300ms` (interactive cards with scale)

### Resources
- [spec.md](./spec.md) - Especificacao completa
- [research.md](./research.md) - Decisoes de design
- [data-model.md](./data-model.md) - Entidades visuais
- [contracts/](./contracts/) - Contratos de componentes
