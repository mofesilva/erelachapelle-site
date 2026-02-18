# Component Contract: FaithStatementSection

**Component**: `src/components/sections/FaithStatementSection.tsx`
**Type**: Server Component
**Status**: NOVO
**Updated**: 2026-02-15

---

## Props

```typescript
// Sem props - usa next-intl internamente
```

## Behavior

### Visual
- Fundo bege (#E7C6B5)
- Texto de declaracao de fe centralizado
- Tipografia serif elegante (Playfair Display)
- Botao CTA ''Saiba mais'' direcionando para /about
- Padding vertical generoso (py-16 desktop / py-12 mobile)

### Layout
- Texto centralizado com max-w-3xl
- Texto: text-2xl md:text-4xl
- Botao abaixo do texto com margin-top

### i18n
- Texto da declaracao e botao traduzidos via `useTranslations('homepage.faith')`
- Funciona em FR, PT e EN

---

## Acceptance Criteria
1. Aparece imediatamente apos o hero
2. Fundo bege (#E7C6B5) criando contraste com hero
3. Texto serif centralizado
4. Botao CTA leva a /about
5. Traduzido nos 3 idiomas
