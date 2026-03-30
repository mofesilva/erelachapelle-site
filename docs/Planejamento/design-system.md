# Design System - Igreja Cévennes

> Análise profunda dos conceitos de design aplicados nas imagens de referência
> Color palette defined in `/docs/project_guidelines.json`

---

## 🎨 Conceitos de Design Fundamentais

### Hierarquia Visual

**Estrutura de Informação**
- **Nível 1**: Títulos grandes em serif (48-64px) - dominam a atenção
- **Nível 2**: Overlines pequenas em caps (12px) - contexto sutil
- **Nível 3**: Subtítulos médios (24-36px) - organizam seções
- **Nível 4**: Corpo de texto (16px) - conteúdo principal
- **Nível 5**: Meta informações (14px) - dados secundários

**Fluxo de Leitura**
- Padrão Z: Logo → Nav → Título → CTA → Conteúdo → Footer
- Quebra intencional com elementos decorativos que guiam o olhar
- Uso de setas (→) como elementos direcionais

### Composição e Layout

**Grid System Assimétrico**
- Hero: 40% texto / 60% imagem (proporção áurea invertida)
- Seções internas: 50/50 com alternância esquerda/direita
- Cards: Grid responsivo 12 colunas
- Quebra de grid intencional com elementos decorativos

**Espaço em Branco (Whitespace)**
- **Macro whitespace**: 80-120px entre seções principais
- **Micro whitespace**: 24-32px entre elementos relacionados
- Respiração abundante ao redor de títulos principais
- Espaço usado como elemento compositivo ativo

**Ritmo e Repetição**
- Padrão alternado de backgrounds (branco → off-white → primary)
- Repetição de elementos: setas, diamonds, cruzes
- Ritmo visual através da variação de tamanhos de cards
- Cadência criada por seções com diferentes densidades

### Princípios de Design

**Contraste**
- **Cromático**: Borgonha forte vs. brancos suaves
- **Tonal**: Preto & branco nas imagens vs. cores vibrantes nas formas
- **Tipográfico**: Serif vs. sans-serif, grandes vs. pequenos
- **Escala**: Títulos gigantes vs. overlines minúsculas

**Equilíbrio Assimétrico**
- Peso visual distribuído de forma não-uniforme mas equilibrada
- Elementos decorativos (círculos) contrabalanceiam blocos de texto
- Imagens pesadas balanceadas por espaços vazios
- CTA buttons posicionados para equilibrar composição

**Proximidade e Agrupamento**
- Elementos relacionados agrupados visualmente
- Separação clara entre seções diferentes
- Meta informações próximas ao conteúdo principal
- Hierarquia através de proximidade espacial

### Sistema de Cores

> **Source: project_guidelines.json** - Primary color is BORGONHA (burgundy)

### Primary Colors

| Token | Hex | Conceito de Aplicação |
|-------|-----|----------------------|
| `primary` | `#722F37` | **Peso Visual Principal** - Cria pontos focais, estabelece identidade |
| `primary-dark` | `#5C262D` | **Estados Interativos** - Feedback visual em hovers |
| `primary-light` | `#8B3D47` | **Hierarquia Secundária** - Elementos de apoio |
| `primary-foreground` | `#FFFFFF` | **Máximo Contraste** - Legibilidade em fundos escuros |

### Accent Colors

| Token | Hex | Função Compositiva |
|-------|-----|-------------------|
| `accent-marigold` | `#F5A462` | **Energia e Movimento** - Formas orgânicas, círculos grandes |
| `accent-coral` | `#E87B6C` | **Suporte Visual** - Categorias, labels, formas menores |
| `accent-salmon` | `#F4A5A0` | **Sutileza** - Detalhes delicados, gradações |

### Neutral Colors

| Token | Aplicação Estratégica |
|-------|----------------------|
| `background` | **Canvas Principal** - Permite que conteúdo respire |
| `background-muted` | **Agrupamento Visual** - Diferencia seções sem peso excessivo |
| `foreground` | **Legibilidade Máxima** - Garante hierarquia textual clara |
| `muted-foreground` | **Informação Secundária** - Reduz competição visual |

---

## 📐 Conceitos Compositivos Avançados

### Geometric Abstraction

**Formas como Elementos Narrativos**
- **Círculos grandes**: Representam abraço, comunidade, totalidade divina
- **Grid patterns**: Estrutura, ordem, fundação sólida
- **Elementos orgânicos**: Crescimento, vida, transformação espiritual

**Sobreposição Intencional**
- Formas decorativas SEMPRE atrás do conteúdo (z-index hierárquico)
- Interação sutil entre elementos geométricos e fotográficos
- Criação de profundidade sem sombras explícitas

### Image Treatment Philosophy

**Dualidade Conceitual**
- **B&W photos**: Representam o temporal, o humano, a história
- **Colored shapes**: Representam o espiritual, o divino, a esperança
- **Justaposição**: Cria narrativa visual de transformação

**Aspect Ratios como Linguagem**
- **16:9**: Paisagens, contexto amplo, visão panorâmica
- **4:3**: Produtos, eventos, foco em ação
- **3:4**: Retratos, intimidade, conexão pessoal

### Typography as Visual Hierarchy

**Serif vs Sans-serif Strategy**
- **Serif (Playfair Display)**: Tradição, autoridade, espiritualidade, atemporalidade
- **Sans-serif (Inter)**: Modernidade, clareza, acessibilidade, praticidade
- **Combinação**: Equilibra tradição com contemporaneidade

**Scale Psychology**
- **Extra Large (48-64px)**: Declarações de fé, convites principais
- **Large (36-42px)**: Organização de pensamento, estrutura
- **Medium (24-28px)**: Conteúdo importante mas secundário
- **Small (16px)**: Leitura confortável, informação
- **Micro (12-14px)**: Contexto, metadados, orientação

### Spacing as Rhythm

**Musical Analogy**
- **Whole notes**: Espaços grandes entre seções (80-120px)
- **Half notes**: Espaços médios entre elementos (32-48px)
- **Quarter notes**: Espaços pequenos relacionais (16-24px)
- **Eighth notes**: Micro-espaçamentos (4-8px)

**Breathing Pattern**
- Alternância entre seções "densas" e "respiráveis"
- Momento de pausa visual antes de CTAs importantes
- Espaço como elemento que guia narrativa

---

## 🎭 Padrões de Interação Visual

### Section Transitions

**Curved Boundaries**
- Transições suaves entre contextos diferentes
- Quebra da rigidez geométrica
- Sugere fluidez, movimento orgânico

**Background Alternation**
- Ritmo visual que mantém engajamento
- Separação clara de contextos
- Prevenção de fadiga visual

### Decorative Elements as Semantic Markers

**Diamond Dividers (◆────◆)**
- **Conceito**: Precious stones, value, divine treasure
- **Função**: Marca inícios de seções importantes
- **Psicologia**: Cria antecipação para conteúdo seguinte

**Cross Prefixes (│)**
- **Simbolismo**: Fé cristã de forma sutil, não invasiva
- **Função**: Marca conteúdo com contexto espiritual
- **Design**: Integrado tipograficamente, não iconográfico

**Arrow Patterns (→)**
- **Direcionamento**: Guia ação e movimento
- **Consistência**: Sempre à esquerda em botões (padrão único)
- **Movimento**: Sugere progressão, caminho, jornada

### Card Design Philosophy

**Event Cards: Timeline Emphasis**
- Data grande = importância temporal
- Layout horizontal = narrativa sequencial
- Background muted = agrupamento sem competição

**Team Cards: Human Connection**
- Portrait format = intimidade pessoal
- Color-coded roles = diversidade na unidade
- Social icons = acessibilidade relacional

**Article Cards: Content Hierarchy**
- Image-first = visual storytelling
- Category colors = navegação intuitiva
- Date badges = contexto temporal integrado

### Interactive States

**Button Behavior**
- **Primary**: Solid → Darker (confiança crescente)
- **Secondary**: Outline → Filled (transformação completa)
- **Arrows**: Sempre presentes (consistência direcional)

**Hover Philosophy**
- Mudanças sutis que não quebram layout
- Feedback imediato mas não disruptivo
- Manutenção da hierarquia visual

---

## 🎯 Aplicação dos Conceitos

### Visual Weight Distribution

**Heavy Elements**
1. Logo (top-left anchor)
2. Main headlines (serif, large)
3. CTA buttons (color + typography)
4. Featured images

**Light Elements**
1. Overlines (subtle guidance)
2. Body text (readable but secondary)
3. Meta information (supportive)
4. Decorative shapes (background layer)

### Color Psychology Application

**Borgonha (Primary)**
- **Psychological**: Autoridade, tradição, espiritualidade profunda
- **Cultural**: Nobreza, sabedoria, maturidade
- **Functional**: Alto contraste, boa legibilidade

**Marigold/Coral (Accents)**
- **Psychological**: Calor, acolhimento, energia positiva
- **Cultural**: Comunidade, celebração, vida
- **Functional**: Chama atenção sem agredir

### Responsive Design Concepts

**Mobile-First Hierarchy**
- Stack vertical mantém ordem de importância
- Cards se adaptam sem perder identidade
- CTA buttons permanecem proeminentes
- Espaçamento proporcional mantido

**Progressive Enhancement**
- Desktop adiciona complexidade visual
- Decorative elements aumentam em tablets+
- Grid systems se expandem gracefully
- Typography scales mantém proporções

---

## 🏗️ Framework de Implementação

### Component Hierarchy

**Level 1: Atomic (Indivisible)**
- Buttons, Typography, Colors, Spacing tokens

**Level 2: Molecular (Simple Combinations)**
- Cards, Form fields, Navigation items

**Level 3: Organisms (Complex Components)**
- Header, Hero sections, Card grids

**Level 4: Templates (Page Structures)**
- Homepage, About page, Blog layout

**Level 5: Pages (Real Content)**
- Specific instances with actual data

### Design Token Philosophy

**Semantic over Literal**
- `primary` não `borgonha`
- `heading-1` não `text-48px`
- `space-section` não `space-96px`

**Context-Aware Naming**
- `button-primary` vs `button-secondary`
- `background-default` vs `background-muted`
- `text-body` vs `text-caption`

Este sistema garante que cada elemento visual tenha propósito narrativo e funcional, criando uma experiência coesa que comunica os valores da igreja através do design.

---

## 📝 Typography

### Font Families

| Type | Font | Fallback |
|------|------|----------|
| Headings | Playfair Display | Georgia, serif |
| Body | Inter | system-ui, sans-serif |

### Type Scale

| Element | Size | Weight | Style |
|---------|------|--------|-------|
| H1 (Display) | 48-64px | 400 | Serif |
| H2 (Section) | 36-42px | 400 | Serif |
| H3 (Card) | 24-28px | 400 | Serif |
| H4 (Subtitle) | 18-20px | 500 | Sans-serif |
| Body | 16px | 400 | Sans-serif |
| Small | 14px | 400 | Sans-serif |
| Overline | 12-14px | 500-600 | Sans-serif, uppercase, tracking: 0.1-0.15em |

---

## 🔘 Component Styling

### Buttons

**Primary Button**
- Background: `primary`
- Text: White, uppercase, letter-spacing: 0.1em
- Icon: Arrow (→) positioned LEFT of text
- Padding: 16px 32px
- Border-radius: 0 (square corners)
- Hover: `primary-dark`

**Secondary/Outline Button**
- Background: transparent or white
- Border: 1px solid `primary`
- Text: `primary`, uppercase
- Icon: Arrow (→) left of text
- Hover: fills with `primary`, text turns white

### Section Labels (Overlines)

```
◆─────────────────◆
   LABEL TEXT
```

- Text: uppercase, tracking: 0.15em, `muted-foreground`
- Decoration: horizontal line with diamond (◆) shapes at ends
- Position: centered above section titles
- Optional: vertical bar prefix (│) for left-aligned labels

### Cards

**Event Card**
- Background: `background-muted`
- Layout: horizontal (date | image | content | button)
- Date: large serif number + small uppercase month
- Image: aspect-ratio 4:3
- Padding: 24px
- No border-radius

**Team/Person Card**
- Photo: aspect-ratio 3:4 (portrait)
- Name: serif, centered
- Role: accent color (varies), uppercase, small
- Social icons: gray, hover `primary`
- No background, no border

**Article Card**
- Background: white or `background-muted`
- Image: aspect-ratio 16:9, date badge overlaid bottom-left
- Category: accent color text
- Title: serif
- Excerpt: `muted-foreground`, 2 lines max

### Navigation Bar

- Background: white
- Logo: left-aligned
- Links: sans-serif, regular weight, `foreground`
- Active link: underline or `primary` color
- Dropdown indicator: chevron (▼)
- CTA button: right-aligned, primary style

### Filter Tabs

- Active: `primary` background, white text
- Inactive: white/transparent background, `foreground` text
- All tabs same border style
- No border-radius

---

## 🎭 Decorative Elements

### Geometric Shapes

Used behind hero images and page headers:

1. **Large Circle**: `accent-marigold`, positioned behind/overlapping images
2. **Semicircle/Partial Circle**: `accent-coral`, asymmetric placement
3. **Grid Pattern**: diagonal lines in `accent-coral`, subtle opacity

### Image Treatments

- **Hero images**: grayscale (black & white) with colored shapes behind
- **Content images**: full color
- **Standard aspect ratios**:
  - Hero: 16:9 or custom
  - Cards: 4:3 or 16:9
  - Team portraits: 3:4

### Section Dividers

```
◆─────────────────◆
```
- Thin horizontal line (1px)
- Diamond shapes (◆) at both ends
- Color: `primary` or `muted-foreground`

### Cross/Bar Prefix

```
│ LABEL TEXT
```
- Small vertical bar before overline text
- Color: `primary`
- Represents subtle religious symbolism

---

## 📐 Spacing & Layout

### Container

- Max-width: 1280px
- Padding: 24px (mobile), 48px (tablet), 64px (desktop)

### Section Spacing

| Element | Spacing |
|---------|---------|
| Between sections | 80-120px vertical |
| Title to content | 32-48px |
| Between cards | 24-32px |
| Card internal padding | 24px |

### Grid System

- 12-column grid
- Gap: 24-32px
- Hero layout: ~40% text / ~60% image

### Section Backgrounds

- Alternate between `background` and `background-muted`
- Transition between sections: curved top edge (subtle wave)
- CTA sections: `primary` background with white text

---

## 📱 Responsive Patterns

### Breakpoints

| Name | Width |
|------|-------|
| Mobile | < 640px |
| Tablet | 768px |
| Desktop | 1024px |
| Large | 1280px |

### Mobile Adaptations

- Hero: stack vertically (text above image)
- Horizontal cards: become vertical stacks
- Team grid: 2 columns → 1 column
- Article grid: 2 columns → 1 column
- Navigation: hamburger menu

---

## 🎯 Visual Patterns Summary

### Hero Section
- Asymmetric layout (text left, image right)
- B&W image with colored geometric shapes behind
- Large serif title
- Overline with cross prefix above title
- CTA button below description

### Page Headers
- Large serif title, left or centered
- Decorative shapes (circles) on right
- Church imagery with geometric overlay

### Content Sections
- Centered overline with diamond divider
- Serif section title
- Optional description paragraph
- Content below (cards, grid, etc.)

### Lists
- Arrow (→) as bullet point
- Arrow color: `primary`
- Consistent left alignment
