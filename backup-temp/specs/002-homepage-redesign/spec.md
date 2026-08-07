# Feature Specification: Homepage Redesign

**Feature Branch**: `002-homepage-redesign`  
**Created**: 2026-02-11  
**Status**: Draft  
**Input**: User description: "O layout está pronto, mas o design ainda está muito precário. Vamos começar a planejar uma melhoria para a Home Page"
**Nome oficial**: Église Réformée Évangélique La Chapelle

## Clarifications

### Session 2026-02-12

- Q: Qual deve ser a altura da hero section? → A: ~~66% da viewport~~ Atualizado em 2026-02-15: 80% da viewport dinâmica (80dvh)
- Q: Como indicar que há conteúdo abaixo da hero? → A: Visual cue de scroll (seta/chevron animado)
- Q: Como apresentar a seção de horários/locais? → A: ~~Minimalista com ícones/flat illustrations, sem cards~~ Atualizado em 2026-02-15: ID Card por localidade com imagem da região, nome, endereço, horário do culto. Divisória borgonha

### Session 2026-02-15

- Q: Qual a altura da hero section? → A: 80% da viewport dinâmica (80dvh), substituindo 66vh anterior
- Q: A navbar faz parte da hero? → A: Sim, a navbar é integrada à hero section — transparente sobre o hero, transiciona para borgonha sólida sem bordas brancas ao scrollar
- Q: Alinhamento de texto e botão no hero? → A: Centralizado (horizontal e vertical), fonte elegante (serif)
- Q: Cor do botão de CTA? → A: Cor complementar à borgonha, com destaque e contraste (não borgonha)
- Q: O que vem logo após o hero? → A: Seção com mini declaração de fé da igreja e botão "saber mais" (nova seção entre hero e horários)
- Q: Como apresentar os locais? → A: ID Card por localidade com imagem da região, ícone, nome, endereço, horário do culto. Linha divisória entre seções em cor borgonha (não cinza)
- Q: Seções removidas? → A: Retirar seção "Quem Somos" (Sobre/About) e seção "Nossa Equipe" (Equipe Pastoral) da homepage
- Q: Paleta de cores? → A: #3D000A (borgonha escuro), #6A0D1E (borgonha), #8C5E35 (dourado), #D1A594 (rosé), #E7C6B5 (bege claro), #EEEEEE (branco), #DADADA (cinza claro), #171717 (preto quase) — substitui marigold/coral/salmon
- Q: Uso de cores nas seções? → A: Evitar fundo branco + card branco (pouco destaque). Alternar fundos entre seções usando a paleta completa para criar contraste e destaque visual entre seções e cards
- Q: Nome oficial da igreja? → A: Église Réformée Évangélique La Chapelle

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Primeira Impressão Impactante (Priority: P1)

Um visitante chega à homepage da igreja pela primeira vez — seja por indicação, busca no Google ou redes sociais. A página deve transmitir imediatamente a identidade visual da igreja: acolhimento, seriedade e beleza. O visitante vê um hero visual ocupando 80% da viewport dinâmica (80dvh) com uma imagem real da igreja. A navbar é integrada à hero section, inicialmente transparente sobre a imagem, e ao scrollar transiciona suavemente para fundo borgonha sólido sem bordas brancas. O título e subtítulo são centralizados na tela em fonte serif elegante, com um botão de ação em cor complementar à borgonha que se destaca com contraste. Um indicador visual na parte inferior sugere que há mais conteúdo abaixo, convidando ao scroll. Em poucos segundos, ele entende o que é a igreja, onde ela está e como participar.

**Why this priority**: A hero section é o primeiro contato visual. Se não causar impacto, o visitante não rola a página. É a peça mais importante do design.

**Independent Test**: Pode ser testado isoladamente abrindo a homepage e verificando que o hero ocupa 80% da viewport dinâmica (80dvh), a navbar é transparente sobre o hero e muda para borgonha sólida ao scrollar (sem bordas brancas), texto e botão centralizados, botão de CTA em cor complementar à borgonha e um indicador visual de scroll na parte inferior.

**Acceptance Scenarios**:

1. **Given** o visitante acessa a homepage, **When** a página carrega, **Then** o hero section ocupa 80% da viewport dinâmica (80dvh) com imagem de fundo, navbar transparente integrada, título e subtítulo centralizados em fonte serif elegante, botão de CTA em cor complementar à borgonha com contraste e um visual cue de scroll (seta/chevron animado) na parte inferior
2. **Given** o visitante acessa pelo celular, **When** a página carrega, **Then** o hero se adapta ao formato vertical mantendo legibilidade do texto centralizado sobre a imagem com overlay adequado
3. **Given** o visitante acessa em qualquer idioma (FR/PT/EN), **When** a página carrega, **Then** todo o conteúdo do hero é exibido no idioma selecionado
4. **Given** o visitante rola a página para baixo, **When** ultrapassa a hero section, **Then** a navbar transiciona suavemente de transparente para fundo borgonha sólido sem bordas brancas, permanecendo fixa no topo

---

### User Story 2 — Declaração de Fé em Destaque (Priority: P1)

Logo abaixo do hero, o visitante encontra uma seção concisa que apresenta uma mini declaração de fé da igreja — uma frase ou parágrafo curto que comunica a essência da crença e identidade teológica da congregação. A seção é visualmente limpa e elegante, com tipografia serif destacada e um botão de ação convidando o visitante a conhecer mais sobre a igreja.

**Why this priority**: A declaração de fé é o que diferencia a igreja de qualquer outra organização. Logo após o impacto visual do hero, o visitante precisa entender rapidamente no que a igreja acredita. É a ponte entre o impacto visual e o conteúdo.

**Independent Test**: Pode ser testado verificando que a seção aparece imediatamente após o hero, exibe um texto curto de declaração de fé em tipografia serif destacada e um botão "Saiba mais" que leva à página sobre a igreja.

**Acceptance Scenarios**:

1. **Given** o visitante rola a página após o hero, **When** a seção de declaração de fé aparece, **Then** exibe um texto curto (mini declaração de fé) em tipografia serif elegante e um botão de CTA para saber mais sobre a igreja
2. **Given** o visitante acessa em qualquer idioma (FR/PT/EN), **When** a seção carrega, **Then** o texto da declaração de fé e o botão são exibidos no idioma selecionado
3. **Given** o visitante clica no botão "Saiba mais", **When** interage, **Then** é redirecionado para a página /about da igreja

---

### User Story 3 — Descoberta Rápida dos Horários e Locais (Priority: P1)

Após a declaração de fé, o visitante encontra as localidades da igreja apresentadas como ID Cards visuais — cada card exibe uma imagem representativa da região, um ícone identificador, o nome da localidade, endereço completo e horário do culto principal. As linhas divisórias entre seções são em cor borgonha (não cinza). O layout é horizontal (lado a lado) em desktop e vertical (empilhado) em mobile.

**Why this priority**: A informação mais buscada por visitantes de sites de igrejas é "onde" e "quando". Os ID Cards com imagem da região tornam cada localidade memorável e reconhecível.

**Independent Test**: Pode ser testado verificando que a seção de locais aparece após a declaração de fé, com ID Cards contendo imagem da região + ícone + nome + endereço + horário de cada local, dispostos lado a lado em desktop e empilhados em mobile, com divisória/fundo borgonha.

**Acceptance Scenarios**:

1. **Given** o visitante rola a página após a declaração de fé, **When** a seção de locais aparece, **Then** cada localidade é exibida como um ID Card com imagem da região, ícone, nome, endereço e horário do culto principal
2. **Given** o visitante acessa em desktop, **When** visualiza os locais, **Then** os ID Cards são exibidos lado a lado (layout horizontal) com linhas divisórias em cor borgonha
3. **Given** o visitante acessa pelo celular, **When** visualiza os locais, **Then** os ID Cards empilham verticalmente com todas as informações legíveis e espaçamento consistente

---

### User Story 4 — Preview de Eventos e Sermões com Hierarquia Visual (Priority: P2)

O visitante vê prévias dos próximos eventos e sermões recentes apresentados com cards visualmente ricos — com ícones, datas destacadas, badges de tipo e hover states que convidam à interação. As seções de eventos e sermões devem ter identidade visual própria que as diferencie entre si e das demais seções.

**Why this priority**: Eventos e sermões são o conteúdo mais dinâmico do site. Cards bem desenhados aumentam o engajamento e o clique para as páginas internas.

**Independent Test**: Pode ser testado verificando que os cards de eventos mostram data destacada, tipo em badge colorido e hover state. Os cards de sermões mostram thumbnail com overlay de play, informação do pregador e série.

**Acceptance Scenarios**:

1. **Given** o visitante rola até a seção de eventos, **When** ela aparece, **Then** cada card exibe a data do evento em destaque visual (dia/mês em bloco), título, tipo em badge e localização
2. **Given** o visitante passa o mouse sobre um card de sermão, **When** faz hover, **Then** o card exibe feedback visual (sombra, escala ou overlay) indicando que é clicável
3. **Given** os cards de sermão têm thumbnail do YouTube, **When** renderizam, **Then** exibem um overlay de ícone de play centralizado sobre o thumbnail
4. **Given** o visitante acessa pelo celular, **When** visualiza as seções, **Then** os cards se ajustam para layout de coluna única com todas as informações visíveis

---

### User Story 5 — Comunidade e Blog com Diferenciação Visual (Priority: P3)

As seções de comunidade (grupos) e blog (artigos recentes) são apresentadas com identidade visual que as diferencia do restante da página. A seção de comunidade utiliza fundo em cor primária (borgonha) criando contraste forte. O blog utiliza cards com imagem em destaque e metadata do artigo.

**Why this priority**: Estas seções completam a homepage mas são secundárias em relação a horários, eventos e sermões. O design atual já tem alguma diferenciação (comunidade com fundo borgonha) que deve ser refinada.

**Independent Test**: Pode ser testado verificando que a seção de comunidade tem fundo borgonha com cards em contraste claro, e a seção de blog exibe cards com imagem, título e data.

**Acceptance Scenarios**:

1. **Given** o visitante rola até a seção de comunidade, **When** ela aparece, **Then** o fundo é na cor primária borgonha com cards em contraste claro/translúcido
2. **Given** o visitante rola até a seção de blog, **When** ela aparece, **Then** cada card exibe imagem destacada (ou placeholder), título, data e categoria em badge
3. **Given** o visitante acessa pelo celular, **When** visualiza estas seções, **Then** ambas mantêm legibilidade e hierarquia visual no formato vertical

---

### Edge Cases

- O que acontece quando não há eventos futuros? A seção de eventos deve exibir uma mensagem elegante indicando que novos eventos serão anunciados em breve.
- O que acontece quando não há sermões? A seção deve exibir mensagem de fallback com estilo consistente.
- Como a página se comporta com textos muito longos em diferentes idiomas? Os textos devem ser truncados com `line-clamp` adequado para manter a consistência visual dos cards.
- O que acontece quando imagens não carregam? Placeholders elegantes com gradiente ou cor sólida devem ser exibidos, nunca ícones de imagem quebrada.

## Requirements *(mandatory)*

### Functional Requirements

#### Hero Section
- **FR-001**: A hero section DEVE ocupar 80% da viewport dinâmica (80dvh) com imagem de fundo, deixando visível uma "preview" do conteúdo abaixo
- **FR-002**: A hero section DEVE exibir overlay escuro semi-transparente sobre a imagem para garantir legibilidade do texto
- **FR-003**: A hero section DEVE exibir título principal e subtítulo centralizados (horizontal e vertical) em fonte serif elegante e botão de CTA em cor complementar à borgonha com destaque e contraste
- **FR-004**: A hero section DEVE ser responsiva, adaptando o layout para telas móveis sem perder legibilidade
- **FR-005**: A hero section DEVE exibir um indicador visual de scroll (seta ou chevron animado com bounce/fade) na parte inferior, comunicando que há mais conteúdo abaixo
- **FR-005a**: A navbar DEVE ser integrada à hero section, posicionada de forma transparente sobre a imagem do hero no estado inicial
- **FR-005b**: Ao scrollar além da hero section, a navbar DEVE transicionar suavemente para fundo borgonha sólido, sem bordas brancas ou artefatos visuais, permanecendo fixa no topo

#### Seção Declaração de Fé
- **FR-005c**: A seção de declaração de fé DEVE aparecer imediatamente após o hero, antes da seção de horários/locais
- **FR-005d**: A seção DEVE exibir um texto curto (mini declaração de fé) em tipografia serif destacada, comunicando a essência da crença da igreja
- **FR-005e**: A seção DEVE incluir um botão de CTA que direciona para a página /about da igreja
- **FR-005f**: A seção DEVE funcionar nos 3 idiomas (FR, PT, EN) com texto e botão traduzidos

#### Seção de Locais (Gathering)
- **FR-006**: A seção de locais DEVE exibir cada localidade como um ID Card contendo: imagem representativa da região, ícone identificador, nome da localidade, endereço completo e horário do culto principal
- **FR-007**: Cada ID Card DEVE ter hierarquia visual clara: imagem da região no topo, ícone, nome em destaque (serif), endereço em corpo (sans), horário em destaque secundário
- **FR-008**: Em desktop (≥768px), os ID Cards DEVEM ser exibidos lado a lado (flex row ou grid de 3 colunas); em mobile (<768px), DEVEM empilhar verticalmente (flex column)
- **FR-009**: As linhas divisórias entre seções da homepage DEVEM ser em cor borgonha (não cinza claro padrão)

#### Cards de Eventos
- **FR-013**: Cada card de evento DEVE exibir a data em bloco visual destacado (dia em grande, mês abreviado abaixo)
- **FR-014**: Cada card de evento DEVE exibir tipo em badge colorido, título em serif e localização com ícone
- **FR-015**: Cards de eventos DEVEM ter hover state com feedback visual (elevação de sombra ou transição de cor)

#### Cards de Sermões
- **FR-016**: Cards de sermões com thumbnail do YouTube DEVEM exibir um overlay de ícone de play centralizado
- **FR-017**: Cards de sermões DEVEM exibir data, pregador, título da série e título do sermão com hierarquia visual clara
- **FR-018**: Cards de sermões DEVEM ter hover state que sugira interatividade (escala sutil ou sombra)

#### Comunidade e Blog
- **FR-022**: A seção de comunidade DEVE manter o fundo em cor primária borgonha com cards em contraste
- **FR-023**: Cards de blog DEVEM exibir imagem destacada (ou placeholder com gradiente), título, data e badge de categoria
- **FR-024**: A seção de blog DEVE ter identidade visual própria que a diferencie das demais seções

#### Transversais
- **FR-025**: Todas as seções DEVEM usar transições CSS suaves para hover states e interações (duração máxima de 300ms)
- **FR-026**: Todas as seções DEVEM manter espaçamento vertical consistente entre si (mesmo padding top/bottom)
- **FR-027**: Todas as seções DEVEM funcionar corretamente nos 3 idiomas (FR, PT, EN) sem quebra de layout
- **FR-028**: Placeholders de imagem DEVEM ser elegantes (gradiente, cor sólida ou padrão decorativo) — nunca ícones de erro
- **FR-029**: O design DEVE utilizar a paleta de cores definida: #3D000A (borgonha escuro), #6A0D1E (borgonha), #8C5E35 (dourado), #D1A594 (rosé), #E7C6B5 (bege claro), #EEEEEE (branco), #DADADA (cinza claro), #171717 (preto quase) — substituindo as cores de acento anteriores (marigold, coral, salmon)
- **FR-030**: As seções DEVEM alternar fundos usando cores da paleta para criar contraste visual — NUNCA usar fundo branco com cards brancos na mesma seção. Cards devem se destacar visualmente do fundo da seção (ex: fundo borgonha + cards claros, fundo bege + cards brancos, fundo escuro + cards rosé)

## Assumptions

- As imagens reais da igreja (fotos do templo, da equipe, dos eventos) ainda não estão disponíveis. O redesign usa placeholders elegantes que serão substituídos por fotos reais futuramente.
- Os dados permanecem estáticos (hardcoded) — esta feature trata exclusivamente da melhoria visual/design, não de funcionalidade.
- A estrutura de componentes existente (HeroSection, GatheringSection, etc.) será mantida — o redesign modifica o conteúdo e estilo destes componentes, não cria novos.
- Os elementos decorativos da marca (◆────◆, fonte Playfair, cor borgonha) são mantidos e reforçados.
- O sistema de design existente (shadcn/ui, Tailwind, Lucide icons) é suficiente para as melhorias — não é necessário adicionar bibliotecas externas.
- A ordem das seções na homepage pode ser ajustada se beneficiar o fluxo visual.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A homepage carrega e exibe todo o conteúdo visível acima do fold (hero) em menos de 3 segundos em conexão 3G
- **SC-002**: A homepage apresenta pelo menos 4 variações visuais de layout entre as 8 seções (não todas em grid 3-colunas)
- **SC-003**: 100% dos cards interativos (eventos, sermões, blog, grupos) possuem hover state visível com transição suave
- **SC-004**: A homepage mantém score de acessibilidade (contraste, hierarquia de headings, alt texts) compatível com WCAG 2.1 AA
- **SC-005**: O layout responsivo funciona sem quebra visual em viewports de 320px (mobile), 768px (tablet) e 1440px (desktop)
- **SC-006**: As cores da paleta (#3D000A, #6A0D1E, #8C5E35, #D1A594, #E7C6B5, #EEEEEE, #DADADA, #171717) são utilizadas de forma coerente em toda a homepage, criando identidade visual consistente
- **SC-007**: Visitantes conseguem identificar "o que é" (igreja), "onde fica" (locais) e "quando" (horários) nos primeiros 10 segundos, com o hero a 80dvh deixando visível o preview da próxima seção
- **SC-008**: O indicador de scroll (visual cue) possui animação suave (bounce ou fade) que não se repete indefinidamente (máximo 3 ciclos ou desaparece após 5 segundos)
