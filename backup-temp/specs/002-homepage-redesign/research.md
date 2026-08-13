# Research: Homepage Redesign

**Phase**: 0 - Outline & Research  
**Date**: 2026-02-15 (updated)  
**Status**: Complete

---

## 1. Hero Section Design Patterns

### Decision
Hero section a **80dvh** (viewport dinamica) com overlay escuro (rgba(0,0,0,0.4)), **navbar integrada transparente->borgonha ao scrollar** e **scroll indicator animado** com CSS animation.

### Rationale
- 80dvh usa unidade de viewport dinamica, melhor em mobile (responde a barra de URL)
- Navbar integrada ao hero cria imersao visual total
- Transicao de transparente para borgonha solido sem bordas brancas evita artefatos visuais
- Overlay escuro garante contraste WCAG AA para texto branco sobre qualquer imagem
- CSS animations sao mais performaticas que JS (GPU-accelerated) e respeitam `prefers-reduced-motion`

### Implementation
```css
.hero-section {
  height: 80dvh;
  position: relative;
  background-size: cover;
  background-position: center;
}

/* Navbar integrada */
.navbar-transparent {
  background: transparent;
  border: none;
  transition: background-color 300ms ease;
}

.navbar-scrolled {
  background: #6A0D1E; /* borgonha */
  border: none; /* sem bordas brancas */
}

.scroll-indicator {
  animation: bounce 2s ease-in-out 3;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-indicator { animation: none; }
}
```

### Alternatives Considered
- **66vh fixo**: Descartado - stakeholder pediu 80dvh para mais impacto
- **vh ao inves de dvh**: Descartado - dvh responde melhor em mobile
- **Navbar separada**: Descartado - bordas brancas causavam artefatos visuais

---

## 2. Layout Variations & Visual Hierarchy

### Decision
Criar **5 secoes** com layouts distintos (removidas About e Team):
1. **Hero**: Full-width centrado, 80dvh, texto/botao centralizados
2. **Declaracao de Fe**: Texto serif centralizado com CTA (NOVA secao)
3. **Locais**: ID Cards com imagem da regiao + icone + nome + endereco + horario
4. **Eventos/Sermoes**: Cards interativos com badges e hover states
5. **Comunidade/Blog**: Fundo borgonha + cards em contraste

### Rationale
- 5 secoes ao inves de 8 = homepage mais focada e menos scroll
- Declaracao de Fe eh a ponte entre impacto visual e conteudo
- ID Cards com imagem da regiao tornam cada localidade memoravel
- FR-030: Alternar fundos entre secoes usando paleta para criar contraste

### Implementation
```text
Secao 1 - Hero:      Fundo imagem + overlay, texto branco
Secao 2 - Fe:        Fundo bege (#E7C6B5), texto borgonha (#3D000A)
Secao 3 - Locais:    Fundo branco (#EEEEEE), ID Cards com sombra
Secao 4 - Eventos:   Fundo rosé (#D1A594), cards brancos
Secao 5 - Comunidade: Fundo borgonha (#6A0D1E), cards claros
```

---

## 3. ID Cards vs Minimalista Design

### Decision
**Secao de Locais**: ID Cards visuais por localidade com imagem da regiao, icone, nome, endereco e horario. Divisorias borgonha.

### Rationale
- ID Cards com imagem tornam cada localidade memoravel e reconhecivel
- Hierarquia visual clara: imagem > icone > nome > endereco > horario
- Stakeholder pediu mudanca de minimalista para ID Cards com imagem da regiao

### Implementation
```tsx
<div className="rounded-xl overflow-hidden shadow-lg">
  <div className="relative h-48">
    <Image src={location.image} alt={location.name} fill className="object-cover" />
  </div>
  <div className="p-6 flex flex-col items-center gap-2 text-center">
    <IconComponent className="w-8 h-8 text-[#6A0D1E]" />
    <h3 className="font-serif text-2xl text-[#3D000A]">{location.name}</h3>
    <p className="text-muted-foreground">{location.address}</p>
    <p className="text-lg font-semibold">{location.schedule}</p>
  </div>
</div>
```

### Alternatives Considered
- **Minimalista sem cards**: Descartado - stakeholder pediu ID Cards com imagem
- **Cards sem imagem**: Descartado - stakeholder quer imagem da regiao

---

## 4. Color Palette Application

### Decision
Nova paleta de 8 cores definida pelo stakeholder:
- **#3D000A**: Borgonha escuro (headings, divisorias)
- **#6A0D1E**: Borgonha (navbar scrolled, CTA primario, fundo Community)
- **#8C5E35**: Dourado (badges de evento, acentos de destaque)
- **#D1A594**: Rose (fundos alternados, hover accents)
- **#E7C6B5**: Bege claro (fundos de secao alternados)
- **#EEEEEE**: Branco (backgrounds claros, texto sobre borgonha)
- **#DADADA**: Cinza claro (borders sutis, muted elements)
- **#171717**: Preto quase (texto principal, headings)

### Rationale
- Substitui marigold/coral/salmon por paleta mais coesa e sofisticada
- 8 cores permitem alternancia de fundos entre secoes (FR-030)
- NUNCA fundo branco + card branco na mesma secao
- Borgonha continua dominante mas com mais nuances

### Implementation
```css
:root {
  --burgundy-dark: #3D000A;
  --burgundy: #6A0D1E;
  --gold: #8C5E35;
  --rose: #D1A594;
  --beige: #E7C6B5;
  --white: #EEEEEE;
  --gray: #DADADA;
  --black: #171717;
}
```

### Alternatives Considered
- **Marigold/Coral/Salmon**: Descartado - stakeholder definiu nova paleta
- **Menos cores**: Descartado - 8 cores necessarias para contraste entre secoes

---

## 5. Hover States & Micro-interactions

### Decision
Mantido: 3 niveis de feedback visual (200-300ms).
Cores de hover adaptadas a nova paleta.

### Implementation
```css
/* Nivel 1: Links/botoes - 200ms */
.link { transition: color 200ms ease-in-out; }

/* Nivel 2: Cards simples - 250ms */
.card { transition: box-shadow 250ms ease-in-out; }
.card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); }

/* Nivel 3: Cards interativos - 300ms */
.interactive-card { transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1); }
.interactive-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.16); transform: scale(1.02); }

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 6. Responsive Design Patterns

### Decision
Breakpoints: **768px** (tablet) e **1024px** (desktop largo).
Hero: **80dvh** em todos os viewports (viewport dinamica).

### Implementation
```css
.hero-section { height: 80dvh; }

.location-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .location-cards {
    flex-direction: row;
    gap: 2rem;
  }
}
```

---

## 7. Placeholder & Fallback States

### Decision
Mantido: gradientes com icones Lucide, iniciais em serif.
Cores adaptadas a nova paleta (borgonha #6A0D1E ao inves de #722F37).

---

## Summary & Next Steps

### Key Decisions Matrix

| Aspecto | Decisao | Tecnologia |
|---------|---------|------------|
| Hero Height | 80dvh (viewport dinamica) | CSS dvh units |
| Navbar | Integrada, transparente->borgonha | CSS transition + IntersectionObserver |
| Layout | 5 secoes (removidas About/Team) | Next.js App Router |
| Locais | ID Cards com imagem da regiao | next/image + cards |
| Paleta | 8 cores (#3D000A a #171717) | CSS custom properties |
| Hover States | 3 niveis (200-300ms) | CSS transitions |
| Responsive | 768px, 1024px breakpoints | Mobile-first Tailwind |
| Declaracao Fe | Nova secao apos hero | Server Component |

### Phase 0 Completion Checklist

- OK Hero section patterns atualizados (80dvh, navbar integrada)
- OK Layout reduzido a 5 secoes
- OK ID Cards definidos (substituem minimalista)
- OK Hover states mantidos
- OK Nova paleta de 8 cores aplicada
- OK Responsive patterns atualizados
- OK Placeholder strategies mantidas

### Ready for Phase 1

Todas as questoes de design foram resolvidas. Proximo passo: atualizar data-model.md, contracts/ e quickstart.md.
