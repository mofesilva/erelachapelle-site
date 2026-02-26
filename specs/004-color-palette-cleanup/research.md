# Research: Color Palette Cleanup

**Date**: 2026-02-25
**Feature**: 004-color-palette-cleanup

## Research 1: shadcn/ui Semantic Color Dependency

**Decision**: Manter os aliases semânticos mínimos do shadcn/ui (background, foreground, primary, secondary, destructive, muted, accent, border, ring, card, popover) como variáveis que apontam para a paleta base. Componentes shadcn/ui (button, badge, input, form, sheet, textarea) permanecem intocados.

**Rationale**: shadcn/ui depende dessas variáveis semânticas nos componentes via class-variance-authority. Remover causaria necessidade de reescrever todos os componentes UI base. Mantê-las como aliases simples (sem subdivisões extras) é o equilíbrio: respeita o padrão do plugin e mantém a paleta limpa.

**Alternatives considered**:
- Remover todos os aliases e reescrever os componentes shadcn (rejeitado: alto risco, quebra upgrades futuros do shadcn)
- Manter tudo como estava + adicionar paleta base (rejeitado: duplicação, confusão com dois sistemas)

## Research 2: Tailwind CSS 4 @theme inline Compatibility

**Decision**: Usar `@theme inline` com `--color-{nome-cor}` para cada cor da nova paleta. Tailwind CSS 4 gera automaticamente classes utilitárias (bg-*, text-*, border-*, ring-*, etc.) a partir do prefixo `--color-`.

**Rationale**: A syntax `@theme inline { --color-toffee-brown: var(--toffee-brown); }` gera automaticamente `bg-toffee-brown`, `text-toffee-brown`, `border-toffee-brown`, etc., incluindo variantes de opacidade (`bg-toffee-brown/50`).

**Alternatives considered**:
- Definir cores diretamente em `@theme` sem variáveis CSS intermediárias (rejeitado: perde flexibility de runtime)

## Research 3: Color Mapping Strategy

**Decision**: Mapear as ~30 cores antigas para 11 novas cores com base em proximidade de hex e uso semântico. Cores não utilizadas (chart-1..5, sidebar-*) são removidas sem migração.

**Rationale**: Análise do codebase mostra que chart e sidebar colors não são usados em nenhum componente TSX. As cores restantes têm mapeamento claro documentado na tabela do plan.md.

**Alternatives considered**:
- Migração gradual (manter aliases temporários) — rejeitado: cria confusão com dois sistemas de nomes coexistindo

## Research 4: Nome para a cor vermelha (#EF4444)

**Decision**: Renomear `--destructive` para `--scarlet-red`.

**Rationale**: "Scarlet red" é o nome descritivo mais comum para o hex #EF4444. Mantém o padrão de naming com nome-cor descritivo.

**Alternatives considered**:
- "flame-red" — válido mas menos preciso
- "vermillion" — tom diferente (#E34234)
- "cherry-red" — mais escuro tipicamente
