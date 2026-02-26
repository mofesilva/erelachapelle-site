# Feature Specification: Color Palette Cleanup

**Feature Branch**: `004-color-palette-cleanup`
**Created**: 2026-02-25
**Status**: Draft
**Input**: User description: "Ajustar cores padrões do site para usar paleta definida com nomes específicos de cores, removendo cores duplicadas, nomes utilitários, e usando apenas nomes descritivos de cor."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Paleta de Cores Consolidada (Priority: P1)

Como proprietário do site, quero que todas as cores do site sejam substituídas por uma paleta definida com 10 cores nomeadas de forma descritiva, eliminando duplicatas e nomes utilitários (como "input", "destructive", "chart"), para que a identidade visual seja consistente e fácil de manter.

**Why this priority**: É a base de toda a mudança visual. Sem a paleta correta no CSS, nenhum componente pode ser atualizado.

**Independent Test**: Pode ser testado verificando que o arquivo de estilos globais contém apenas as 10 cores da nova paleta, sem nomes utilitários.

**Acceptance Scenarios**:

1. **Given** o arquivo de estilos globais, **When** inspecionado, **Then** contém apenas as variáveis de cor da nova paleta: carbon-black, rich-mahogany, night-bordeaux, night-bordeaux-2, coffee-bean, olive-wood, toffee-brown, powder-petal, dust-grey, parchment
2. **Given** o arquivo de estilos globais, **When** inspecionado, **Then** não contém nomes utilitários como "input", "chart-1", "chart-2", "sidebar-accent", "muted", etc.
3. **Given** a cor vermelha anteriormente chamada "destructive" (#EF4444), **When** inspecionada, **Then** possui um nome descritivo de cor (ex: "scarlet-red") em vez de nome utilitário

---

### User Story 2 - Componentes Atualizados com Nova Paleta (Priority: P2)

Como visitante do site, quero que todos os componentes visuais (botões, cards, navbar, footer, dividers, badges, formulários) utilizem as novas cores da paleta para que a aparência visual seja uniforme em todas as páginas.

**Why this priority**: Após a paleta ser definida, cada componente precisa ser migrado para usar os novos nomes de variáveis.

**Independent Test**: Pode ser testado navegando por todas as páginas do site e verificando que nenhum componente apresenta cor indefinida, fallback, ou referência a variáveis antigas.

**Acceptance Scenarios**:

1. **Given** qualquer página do site, **When** renderizada no navegador, **Then** todas as cores visíveis pertencem à nova paleta definida
2. **Given** qualquer componente que referenciava cores antigas (burgundy, gold, rose, beige, etc.), **When** o código fonte é inspecionado, **Then** referencia apenas as novas variáveis de cor
3. **Given** o site completo, **When** compilado, **Then** não há warnings ou erros relacionados a variáveis de cor indefinidas

---

### User Story 3 - Mapeamento Tema Tailwind Limpo (Priority: P3)

Como desenvolvedor do site, quero que o mapeamento de cores no tema Tailwind (seção `@theme inline`) seja limpo e contenha apenas referências às novas cores nomeadas, sem aliases utilitários duplicados, para facilitar a manutenção futura.

**Why this priority**: Garante que novos componentes criados no futuro usem automaticamente a paleta correta.

**Independent Test**: Pode ser testado verificando que a seção `@theme inline` mapeia apenas as cores da nova paleta e que classes Tailwind como `bg-rich-mahogany`, `text-carbon-black`, etc. funcionam corretamente.

**Acceptance Scenarios**:

1. **Given** a seção `@theme inline` do CSS global, **When** inspecionada, **Then** contém apenas mapeamentos para as 10 cores da nova paleta mais a cor vermelha renomeada
2. **Given** um componente usando classes Tailwind com os novos nomes de cor, **When** renderizado, **Then** exibe a cor correta

---

### Edge Cases

- O que acontece quando um componente referencia uma variável de cor antiga que foi removida? Deve ser identificado e migrado antes do deploy.
- Como tratar opacidades variadas (ex: `bg-gold/50`)? As variantes com opacidade devem funcionar com os novos nomes.
- O que acontece com o tema escuro (dark mode) se existir? Esta feature não altera dark mode; mantém apenas light mode.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE usar exclusivamente a seguinte paleta de cores:
  - `--carbon-black: #171717ff`
  - `--rich-mahogany: #3d0008ff`
  - `--night-bordeaux: #520014ff`
  - `--night-bordeaux-2: #660019ff`
  - `--coffee-bean: #76522eff`
  - `--olive-wood: #845c33ff`
  - `--toffee-brown: #936639ff`
  - `--powder-petal: #e2d4cbff`
  - `--dust-grey: #e9dfd8ff`
  - `--parchment: #f9f4f1ff`
- **FR-002**: A cor vermelha (#EF4444) anteriormente chamada "destructive" DEVE ser mantida mas renomeada com um nome descritivo de cor
- **FR-003**: O sistema NÃO DEVE conter subdivisões excessivas de cores como "chart-1..5", "sidebar-*", "accent-gold/rose/beige", "burgundy/burgundy-dark/burgundy-hover/burgundy-accent", "gold/gold-light/gold-hover". Aliases semânticos mínimos do shadcn/ui (background, foreground, primary, secondary, destructive, muted, accent, border, ring, card, popover) são mantidos apontando para a paleta base
- **FR-004**: Todas as referências a variáveis de cor antigas em componentes DEVEM ser atualizadas para usar os novos nomes
- **FR-005**: Classes Tailwind de cor DEVEM usar os novos nomes descritivos (ex: `bg-rich-mahogany`, `text-carbon-black`)
- **FR-006**: Variantes de opacidade (ex: `bg-toffee-brown/50`) DEVEM funcionar com todos os novos nomes de cor
- **FR-007**: O site DEVE compilar sem erros ou warnings relacionados a cores após a migração

### Key Entities

- **Paleta de Cores**: Conjunto de 10 cores nomeadas + 1 cor vermelha, que define toda a identidade visual do site
- **Mapeamento Tailwind**: Seção `@theme inline` que conecta variáveis CSS a classes utilitárias do Tailwind
- **Componentes**: Todos os arquivos TSX que referenciam cores via classes Tailwind ou variáveis CSS

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das variáveis de cor no CSS global usam nomes descritivos da paleta definida
- **SC-002**: 0 referências a nomes utilitários de cor (input, chart, sidebar, muted, etc.) no CSS global
- **SC-003**: 0 erros de compilação após a migração completa de cores
- **SC-004**: Todas as páginas do site renderizam corretamente com as novas cores sem elementos com cor indefinida

## Assumptions

- O site não possui dark mode ativo; apenas o tema light será alterado
- A cor vermelha (#EF4444) será renomeada para um nome descritivo como "scarlet-red" (a definir)
- Variáveis de layout como `--radius` e tipografia não são afetadas por esta feature
- Cores semânticas do Tailwind/shadcn (background, foreground, border, ring) precisarão ser mapeadas para as novas cores da paleta
