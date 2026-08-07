# Component Contract: Section Variations

**Scope**: Todas as secoes da homepage
**Updated**: 2026-02-15

---

## Secoes (5 total)

### 1. Hero (HeroSection.tsx)
- Fundo: imagem + overlay
- Layout: centrado, 80dvh
- Navbar: integrada, transparente->borgonha

### 2. Declaracao de Fe (FaithStatementSection.tsx) - NOVO
- Fundo: bege (#E7C6B5)
- Layout: texto centralizado max-w-3xl
- Conteudo: texto serif + botao CTA para /about

### 3. Locais (GatheringSection.tsx)
- Fundo: branco (#EEEEEE)
- Layout: ID Cards lado a lado (desktop) / empilhados (mobile)
- Cards: imagem + icone + nome + endereco + horario
- Divisorias: borgonha (#6A0D1E)

### 4. Eventos/Sermoes (EventsPreviewSection + SermonsPreviewSection)
- Fundo: rose (#D1A594) ou alternado
- Layout: grid-cols-3 (eventos) / grid-cols-2 (sermoes)
- Cards: brancos (#EEEEEE) com badges coloridos

### 5. Comunidade/Blog (CommunitySection + BlogPreviewSection)
- Comunidade: fundo borgonha (#6A0D1E) + cards claros
- Blog: fundo branco (#EEEEEE) + cards com borda (#DADADA)

---

## Regra de Contraste (FR-030)

NUNCA fundo branco + card branco. Cada secao DEVE ter contraste visivel entre fundo e cards.

## Divisorias

Linhas divisorias entre secoes em cor borgonha (#6A0D1E), NAO cinza claro.

## Componentes Removidos

- AboutSection.tsx - removido do page.tsx (manter arquivo)
- TeamSection.tsx - removido do page.tsx (manter arquivo)

## Componentes Novos

- FaithStatementSection.tsx - nova secao pos-hero
- LocationCard.tsx - ID Card de localidade (shared)
