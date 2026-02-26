<!--
SYNC IMPACT REPORT
===================
Version Change: 1.2.0 → 1.3.0
Modified Principles: None
Added Sections: Project Scope section (single-location constraint)
Removed Sections: None
Templates Status:
  ✅ .specify/templates/plan-template.md (validated - no updates needed)
  ✅ .specify/templates/spec-template.md (validated - no updates needed)
  ✅ .specify/templates/tasks-template.md (validated - no updates needed)
Follow-up TODOs:
  - Remove Lasalle/Monoblet location data from src/lib/data/locations.ts
  - Update GatheringSection to reflect single location (La Chapelle)
  - Review any multi-location references in spec/plan/tasks docs
-->

# Érela Chapelle Website Constitution

## Project Scope

Este site é EXCLUSIVAMENTE para a **Église Réformée Évangélique La Chapelle**.

- O site NÃO contempla outras igrejas, paróquias ou localizações
  (ex: Lasalle, Monoblet ou qualquer outra)
- Toda a estrutura, dados e conteúdo DEVEM refletir uma única igreja
  em uma única localização: La Chapelle
- Funcionalidades multi-localização NÃO DEVEM ser implementadas
- Referências a outras localizações DEVEM ser removidas do código e dados

**Rationale**: O escopo do projeto é um site institucional para uma
única igreja. Manter foco em uma localização simplifica a arquitetura,
o conteúdo e a manutenção.

## Core Principles

### I. KISS - Keep It Simple, Stupid (PRIORIDADE #1)
Simplicidade, legibilidade e pragmatismo são FUNDAMENTAIS. Este é um projeto de porte médio.

- Código simples e direto é MELHOR que código "elegante" complexo
- Componentes DEVEM ser auto-explicativos sem precisar de muito contexto
- Abstrações APENAS quando houver necessidade REAL (3+ casos de uso)
- Se está ficando complexo, provavelmente está errado - simplifique

**Evitar**:
- Over-engineering - não criar abstrações para "possíveis usos futuros"
- Abstrações prematuras antes de ter casos de uso concretos
- Padrões de design elaborados sem necessidade clara
- Soluções "inteligentes" que sacrificam clareza

**Rationale**: Código simples é mais fácil de entender, manter e debugar. Complexidade deve ser justificada por necessidade real, não por "elegância".

### II. DRY - Don't Repeat Yourself
Cada lógica DEVE existir em UM único lugar.

- Componentes compartilhados em `/components/ui` e `/components/shared`
- Hooks customizados reutilizáveis em `/hooks`
- Utils/helpers em `/lib/utils`
- Validações Zod em `/lib/validations`
- Constantes em `/lib/constants`

**Rationale**: Eliminar duplicação reduz bugs, facilita manutenção e garante consistência.

### III. SOLID Principles (Aplicação Pragmática)
Aplicar SOLID de forma pragmática. Não forçar todos os princípios em todo código.

- **Single Responsibility**: SEMPRE - cada componente/função faz UMA coisa (ex: EventCard só renderiza card)
- **Open/Closed**: Quando houver necessidade clara de extensão (evitar interfaces complexas "por precaução")
- **Liskov Substitution**: Em hierarquias de componentes quando necessário (raro em React moderno com composition)
- **Interface Segregation**: Props específicas por componente, evitar "props dump"
- **Dependency Inversion**: SEMPRE - componentes dependem de hooks/clients, não de implementações diretas

**Rationale**: SOLID guia design robusto mas deve ser aplicado pragmaticamente para evitar over-engineering.

### IV. Clean Code Pragmático
Clean Code NÃO significa criar abstrações excessivas. Significa código legível e manutenível.

**Meaningful Names**:
- Nomes DEVEM expressar CLARAMENTE o propósito
- Componentes: `{Feature}{Type}` (ex: EventCard, EventForm)
- Hooks: `use{Action}{Entity}` (ex: useGetEvents, useCreateSermon)
- Funções: `{verb}{Object}` (ex: formatDate, validateEmail)
- Evitar: nomes genéricos (data, info, temp), abreviações não universais (evt, srv)

**Small Functions**:
- Funções DEVEM fazer UMA coisa só e ter no máximo 20-30 linhas
- Se precisa de comentário "Step 1, Step 2", extrair funções

**Clear Intent**:
- Código auto-explicativo > comentários
- Comentar apenas "POR QUÊ", nunca "O QUÊ"
- Comentar: decisões arquiteturais, workarounds, regras de negócio complexas, integrações externas

**No Dead Code**:
- Remover proativamente: imports não utilizados, componentes não referenciados, funções obsoletas, código comentado, TODOs resolvidos, console.logs

**Rationale**: Código limpo reduz carga cognitiva, facilita onboarding e manutenção a longo prazo.

### V. Clean Architecture Pragmática
A arquitetura do projeto DEVE seguir 4 camadas claramente definidas de forma SIMPLIFICADA:

- **Presentation Layer** (`components/`): Componentes React - renderização pura de UI
- **Application Layer** (`hooks/`, `app/actions/`): Hooks customizados e Server Actions - orquestração de lógica
- **Infrastructure Layer** (`packages/cappuccino-client/`): Cappuccino Client - ÚNICA camada que comunica com MongoDB
- **Domain Layer** (`types/`, `lib/validations/`): Types TypeScript e Zod schemas - entidades e validações

**Dependency Flow**: UI → Hooks/Actions → Cappuccino Client → MongoDB

**Pragmatic Note**: NÃO criar camadas extras (use cases, repositories) para CRUDs simples. Cappuccino Client já é a camada de dados.

**Rationale**: Separação de responsabilidades clara facilita manutenção, teste e evolução. Abordagem simplificada evita over-engineering para projeto de porte médio.

### VI. Feature-Based Organization
O código DEVE ser organizado por domínio de negócio (features), NÃO por tipo de arquivo técnico.

**ESTRUTURA CRITICAL**:
- **Features na UI** (`app/[locale]/(public)/feature-name/`): Agrupam APENAS código de UI
  - `page.tsx` - Route da feature
  - `_components/` - Componentes privados da feature (prefixo `_`)
  - Componentes privados NÃO podem ser importados fora da feature
  
- **Features em outras camadas** (feature-based MAS dentro de `lib/`):
  - Types: `types/events.ts`, `types/sermons.ts`
  - Hooks: `hooks/use-events.ts`, `hooks/use-sermons.ts`
  - Validations: `lib/validations/events.ts`, `lib/validations/sermons.ts`
  - Actions: `app/actions/events.ts`, `app/actions/sermons.ts`

**Regras**:
- Types NÃO vão no diretório da feature de UI
- Cada camada é feature-based, mas mantém sua própria localização
- Reutilização DEVE ser verificada antes de criar novos componentes
- Separation of Concerns: UI não faz fetching, hooks não renderizam

**Rationale**: Organização feature-based mantém código relacionado lógico, mas separação física por camada facilita navegação e mantém arquitetura limpa.

### VII. Server-First Approach (NON-NEGOTIABLE)
Next.js 14+ Server Components DEVEM ser o padrão absoluto.

- Server Components são o padrão default para todas as páginas e componentes
- `'use client'` directive DEVE ser usada APENAS quando interatividade client-side for absolutamente necessária
- Data fetching DEVE ocorrer em Server Components com chamadas diretas ao Cappuccino Cloud
- Client Components DEVEM usar hooks customizados para data fetching

**Rationale**: Server Components melhoram performance (menor bundle JS), SEO, e segurança (credenciais permanecem no servidor). O uso criterioso de Client Components garante interatividade apenas onde necessário.

### VIII. Multilingual-Native Architecture
Suporte completo a FR/PT/EN DEVE estar presente desde a arquitetura base usando next-intl.

- Todas as features DEVEM suportar FR/PT/EN desde o início
- Conteúdo multilíngue DEVE usar estrutura: `{ fr: string; pt: string; en: string }`
- Chaves de tradução DEVEM ser semânticas com namespaces: `feature.component.action`
- Francês (FR) é o idioma padrão do projeto

**Rationale**: Internacionalização desde o início evita refatorações custosas futuras. A estrutura de namespace garante organização escalável das traduções.

### IX. Sistema de Design Consistente
O design DEVE seguir um sistema visual coeso e consistente:

**Cores Semânticas**:
- Primária: Borgonha (#722F37)
- Acentos: Marigold, Coral, Salmon

**Tipografia Hierárquica**:
- Headings: Playfair Display
- Body: Inter

**Princípios Visuais**:
- Whitespace como elemento ativo - respiração visual é essencial
- Padrões decorativos consistentes: diamonds (◆────◆), arrows (→), cross (│)
- Grid assimétrico de 12 colunas com proporções 40/60

**Rationale**: Sistema de design consistente cria identidade visual forte, melhora UX através de previsibilidade e facilita desenvolvimento com padrões claros.

### X. Performance First
Performance e eficiência DEVEM ser prioridade:

- Usar Server Components por padrão, Client Components apenas quando necessário
- Implementar React Suspense para loading states
- Cache de queries do Cappuccino (unstable_cache do Next.js)
- Lazy loading de componentes pesados
- Otimização de imagens (next/image)
- Paginação em listagens grandes
- Evitar N+1 queries e processamento desnecessário

**Rationale**: Performance é feature. Site rápido melhora UX, SEO e conversão.

### XI. Mobile-First Development
Todo o desenvolvimento DEVE começar pela experiência mobile e adaptar progressivamente para telas maiores.

- Estilos base (sem prefixo) DEVEM ser para mobile
- Usar prefixos responsivos do Tailwind CSS para adaptar para telas maiores
- A experiência mobile DEVE ser singular e completa, não uma versão "reduzida" do desktop

**Breakpoints Padrão (Tailwind CSS 4)**:

| Prefixo | Largura mínima | Dispositivo típico |
|---------|----------------|-------------------|
| (base)  | 0px            | Celular           |
| `sm:`   | 640px          | Celular grande    |
| `md:`   | 768px          | Tablet            |
| `lg:`   | 1024px         | Laptop            |
| `xl:`   | 1280px         | Desktop           |
| `2xl:`  | 1536px         | Tela grande       |

**Regras**:
- NUNCA usar breakpoints customizados — usar APENAS os padrões do Tailwind
- Escrever classes sem prefixo primeiro, depois adicionar `sm:`, `md:`, `lg:`, etc.
- Testar SEMPRE no mobile primeiro antes de verificar desktop
- Usar unidades dinâmicas de viewport (`dvh`, `dvw`) ao invés de `vh`/`vw`

**Rationale**: A maioria dos acessos vem de dispositivos móveis. Desenvolver mobile-first garante que a experiência principal seja otimizada e evita o padrão comum de "desktop bonito, mobile quebrado".

## Technology Stack Requirements

### Mandatory Stack
As seguintes tecnologias são OBRIGATÓRIAS e NÃO NEGOCIÁVEIS:

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4+
- **UI Components**: shadcn/ui
- **Database**: Cappuccino Cloud (MongoDB)
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: next-intl
- **Icons**: Lucide React

**Rationale**: Stack moderna, type-safe e com excelente DX. Cada tecnologia foi escolhida por ser best-in-class em sua categoria e ter boa integração com o ecossistema Next.js.

### Version Requirements
- Todas as dependências DEVEM usar versões estáveis (não alpha/beta)
- Major updates DEVEM ser avaliados quanto a breaking changes
- Security updates DEVEM ser aplicados prontamente

## Development Workflow

### Quality Gates
Antes de qualquer commit, o código DEVE:

1. Passar no TypeScript compiler (`tsc --noEmit`)
2. Passar no ESLint sem erros
3. Seguir todas as convenções de naming e estrutura
4. Ter componentes Server-first (justificar `'use client'`)
5. Incluir traduções FR/PT/EN completas

### Code Review Requirements
Pull requests DEVEM verificar:

- Adherência aos princípios arquiteturais
- Organização feature-first mantida
- Server Components como padrão
- Multilingual support completo
- Design system consistency
- Type safety (zero `any` types injustificados)

### Testing Strategy
- Componentes de UI DEVEM ter visual regression tests quando apropriado
- Hooks customizados DEVEM ter unit tests
- Validações Zod DEVEM ter test coverage
- Critical user flows DEVEM ter integration tests

## Governance

### Amendment Process
Alterações a esta constituição DEVEM:

1. Ser documentadas com rationale claro
2. Incluir migration plan para código existente
3. Atualizar templates dependentes (spec, plan, tasks)
4. Incrementar versão seguindo SemVer

### Version Semantics
- **MAJOR** (X.0.0): Remoção ou redefinição de princípios fundamentais
- **MINOR** (0.X.0): Adição de novos princípios ou seções
- **PATCH** (0.0.X): Clarificações, correções, refinamentos

### Compliance
- Todos os PRs DEVEM verificar compliance com esta constituição
- Desvios DEVEM ser explicitamente justificados e aprovados
- Complexidade DEVE ser justificada com rationale claro
- Esta constituição SUPERSEDE qualquer outra documentação conflitante

### Runtime Guidance
Para orientações práticas de desenvolvimento e decisões dia-a-dia, consulte `.specify/memory/agent-guidance.md` (quando disponível). A constituição define princípios imutáveis; o guidance file fornece interpretações práticas adaptáveis.

**Version**: 1.3.0 | **Ratified**: 2025-01-20 | **Last Amended**: 2026-02-18
