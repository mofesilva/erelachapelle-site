# Feature Specification: Single-Location Scope

**Feature Branch**: `003-single-location-scope`
**Created**: 2026-02-18
**Status**: Draft
**Input**: User description: "O site será somente para a Église Réformée Évangélique La Chapelle. Não terá no site nem Lasalle nem Monoblet."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitante vê informações de La Chapelle (Priority: P1)

Um visitante acessa a homepage e vê a seção de localização mostrando apenas
a Église Réformée Évangélique La Chapelle (Saint-Hippolyte-du-Fort),
com endereço, horário de culto e mapa. Não há menção a Lasalle ou Monoblet.

**Why this priority**: É a mudança central — o site deve refletir uma única
igreja em uma única localização.

**Independent Test**: Acessar a homepage e verificar que apenas La Chapelle
aparece na seção de localização, sem referências a outras cidades.

**Acceptance Scenarios**:

1. **Given** a homepage carregada, **When** o visitante visualiza a seção
   de localização, **Then** apenas La Chapelle (Saint-Hippolyte-du-Fort)
   é exibida com endereço, horário e mapa.
2. **Given** a homepage em qualquer idioma (FR/PT/EN), **When** o visitante
   busca por "Lasalle" ou "Monoblet" na página, **Then** nenhum resultado
   é encontrado.

---

### User Story 2 - Navegação simplificada sem seleção de localização (Priority: P1)

O visitante navega pelo site sem precisar escolher entre múltiplas
localizações. Toda informação de contato, endereço e horários refere-se
exclusivamente a La Chapelle.

**Why this priority**: A remoção de multi-localização simplifica a
experiência do usuário e elimina confusão.

**Independent Test**: Navegar por todas as páginas do site e confirmar que
nenhuma página apresenta seleção de localização ou referências a Lasalle
e Monoblet.

**Acceptance Scenarios**:

1. **Given** qualquer página do site, **When** o visitante visualiza
   informações de contato ou localização, **Then** apenas dados de
   La Chapelle são exibidos.
2. **Given** a seção de eventos, **When** eventos são listados, **Then**
   nenhum evento menciona Lasalle ou Monoblet como local.

---

### Edge Cases

- O que acontece com dados de localização existentes de Lasalle/Monoblet?
  São removidos completamente do código e dados estáticos.
- O que acontece se futuramente precisar adicionar localizações?
  Fora do escopo atual. A arquitetura pode ser adaptada no futuro se
  necessário, mas não deve ser projetada para isso agora.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir apenas a localização de La Chapelle
  (Saint-Hippolyte-du-Fort) em toda a aplicação.
- **FR-002**: O sistema DEVE remover todas as referências a Lasalle e
  Monoblet dos dados estáticos, traduções e componentes.
- **FR-003**: A seção de localização na homepage DEVE mostrar um único
  card com as informações de La Chapelle (endereço, horário, mapa).
- **FR-004**: O layout da seção de localização DEVE ser adaptado para
  apresentar um único local de forma visualmente equilibrada (não um
  grid de 3 colunas com apenas 1 item).
- **FR-005**: Todas as traduções (FR/PT/EN) referentes a Lasalle e
  Monoblet DEVEM ser removidas dos arquivos de mensagens.
- **FR-006**: O sistema DEVE manter suporte multilíngue (FR/PT/EN) para
  as informações de La Chapelle.

### Key Entities

- **Location (La Chapelle)**: Nome da igreja, endereço completo
  (Place de la Mairie, Saint-Hippolyte-du-Fort), coordenadas geográficas,
  horário de culto (Dimanche 10h30), código postal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero referências a "Lasalle" ou "Monoblet" existem no
  código-fonte, dados estáticos e arquivos de tradução.
- **SC-002**: A seção de localização exibe exatamente 1 local com
  informações completas (nome, endereço, horário, mapa).
- **SC-003**: O site mantém funcionalidade completa em todos os 3 idiomas
  (FR/PT/EN) após a remoção das localizações.
- **SC-004**: O build do projeto compila sem erros após as alterações.

## Assumptions

- Saint-Hippolyte-du-Fort é a única localização da Église Réformée
  Évangélique La Chapelle para fins deste site.
- Os dados existentes de La Chapelle (endereço, coordenadas, horários)
  estão corretos e serão mantidos.
- O componente LocationCard pode ser reutilizado ou simplificado para
  exibir um único local.
- Não é necessário manter compatibilidade retroativa com a estrutura
  multi-localização.
