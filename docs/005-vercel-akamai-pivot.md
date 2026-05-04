# 005 — Pivot de Infraestrutura: Vercel + Akamai Italy (CDN de Imagens)

## Contexto

O site da Éréla Chappelle será acessado primariamente da **França e da Europa**. O problema
atual é que as imagens estão hospedadas em um servidor em **São Paulo, Brasil**, gerando alta
latência para os usuários europeus.

### Arquitetura Proposta

| Camada         | Solução                      | Custo    | Motivo                                                       |
| -------------- | ---------------------------- | -------- | ------------------------------------------------------------ |
| Site (Next.js) | **Vercel Hobby**             | Gratuito | CDN global com PoPs em Paris, Frankfurt, Amsterdam, Londres  |
| Imagens        | **Servidor Akamai (Itália)** | Já pago  | Europa, ~500 km da França vs ~9.000 km do Brasil             |

### Estado Atual do Código

- Hosting alvo: Vercel (sem configuração deployada ainda)
- Imagens: servidor `erelachapelle.dzign-e.app` (São Paulo, Brasil)
- Todas as URLs de imagem estão **hardcoded** em 5 componentes e 1 arquivo de dados
- Zero variáveis de ambiente configuradas no projeto
- Dados: arrays estáticos em memória (sem banco de dados ativo)

---

## Fase 1 — Media Migration (Brasil → Akamai Italy)

**Objetivo:** Transferir todos os assets de imagem do servidor Brasil para o servidor europeu.

### Tarefas

1. Levantar acesso ao servidor Akamai Italy (SSH / FTP / painel de controle)
2. Confirmar hostname/URL público do Akamai Italy (ex: `cdn.erelachapelle.com` ou IP fixo)
3. Configurar virtual host / diretório web público no Akamai para servir os assets
4. Copiar todos os arquivos de imagem do servidor Brasil para o Akamai:

   | Arquivo                                            | Componente de origem              |
   | -------------------------------------------------- | --------------------------------- |
   | `igreja-lachappelle-hero-banner-2.png`             | `HeroBanner.tsx`                  |
   | `inside-church.png`                                | `GatheringSection.tsx`            |
   | `bible-study.jpg`                                  | `CommunitySection.tsx`            |
   | `prayer-group.jpg`                                 | `CommunitySection.tsx`            |
   | `open-bible-black-background-religion-concept.jpg` | `CommunitySection.tsx`            |
   | `broto-nature.jpg`                                 | `MissionVisionSection.tsx`        |
   | `paulo-sicoli.jpg`                                 | `leadership.ts` (campo `photoUrl`) |

5. Configurar cabeçalhos no servidor Akamai:
   ```
   Access-Control-Allow-Origin: *
   Cache-Control: public, max-age=31536000, immutable
   ```
6. Verificar acesso público de cada imagem via URL do Akamai antes de avançar

> ⚠️ Esta fase **bloqueia** a Fase 3. O hostname definitivo do Akamai é necessário
> para preencher as variáveis de ambiente e o `remotePatterns` do Next.js.

---

## Fase 2 — Vercel Setup

*Pode ser executada em paralelo com a Fase 1.*

**Objetivo:** Configurar o projeto na Vercel e preparar o ambiente de produção.

### Tarefas

7. Acessar [vercel.com](https://vercel.com) e importar o repositório GitHub do projeto
8. Confirmar que o build passa no dashboard da Vercel (dados estáticos atuais)
9. Adicionar variável de ambiente no painel da Vercel (Settings → Environment Variables):
   - `NEXT_PUBLIC_STORAGE_BASE_URL` = `https://{hostname-akamai-italy}`
10. Configurar domínio customizado na Vercel:
    - Painel Domains → adicionar domínio
    - Atualizar registros DNS: CNAME `www` → `cname.vercel-dns.com` / registro A para o apex

---

## Fase 3 — Code Refactor

*Depende da Fase 1 (hostname do Akamai definido).*

**Objetivo:** Eliminar URLs hardcoded, centralizar configuração de imagens em variáveis de ambiente.

### Tarefas

11. Criar `.env.local` (desenvolvimento local — aponta ainda para o servidor Brasil
    enquanto a migração não finaliza):
    ```env
    NEXT_PUBLIC_STORAGE_BASE_URL=https://erelachapelle.dzign-e.app
    ```

12. Criar `.env.production` (produção — aponta para Akamai Italy):
    ```env
    NEXT_PUBLIC_STORAGE_BASE_URL=https://{hostname-akamai-italy}
    ```

13. Criar `src/lib/constants/images.ts` centralizando todas as URLs:
    ```ts
    const BASE = process.env.NEXT_PUBLIC_STORAGE_BASE_URL;

    export const IMAGES = {
      heroBanner: `${BASE}/igreja-lachappelle-hero-banner-2.png`,
      insideChurch: `${BASE}/inside-church.png`,
      bibleStudy: `${BASE}/bible-study.jpg`,
      prayerGroup: `${BASE}/prayer-group.jpg`,
      openBible: `${BASE}/open-bible-black-background-religion-concept.jpg`,
      brotoNature: `${BASE}/broto-nature.jpg`,
      pauloSicoli: `${BASE}/paulo-sicoli.jpg`,
    };
    ```

14. Atualizar `next.config.ts` — substituir o hostname Brasil pelo Akamai em `remotePatterns`:
    ```ts
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "{hostname-akamai-italy}" },
        { protocol: "https", hostname: "images.unsplash.com" },
      ],
    }
    ```

15. Substituir URLs hardcoded nos componentes pelas constantes de `IMAGES`:

    | Arquivo                                                                  | Campo a substituir |
    | ------------------------------------------------------------------------ | ------------------ |
    | `src/app/[locale]/_components/HeroBanner.tsx`                           | src da imagem hero |
    | `src/app/[locale]/_components/GatheringSection.tsx`                     | src inside-church  |
    | `src/app/[locale]/_components/CommunitySection.tsx`                     | 3 srcs de imagem   |
    | `src/app/[locale]/(public)/about/_components/MissionVisionSection.tsx`  | src broto-nature   |
    | `src/lib/data/leadership.ts`                                            | campo `photoUrl`   |

16. Testar localmente com `next dev` — confirmar que todas as imagens carregam

### Adicionar ao `.gitignore`

```
.env.local
.env.production
```

---

## Fase 4 — Deploy & Verificação

**Objetivo:** Publicar na Vercel apontando para imagens no Akamai Italy e validar a performance.

### Tarefas

17. Commit e push para `main` → Vercel inicia build e deploy automático
18. Acessar o domínio `.vercel.app` temporário e verificar que todas as imagens carregam
    via URL do Akamai Italy
19. Abrir DevTools → aba Network → confirmar:
    - Origem das imagens: `{hostname-akamai-italy}`
    - Header `Cache-Control: public, max-age=31536000`
20. Ativar domínio customizado após validação completa
21. Remover referências ao servidor Brasil do código e das variáveis de ambiente

---

## Arquivos Afetados

### Modificar
- `next.config.ts`
- `src/app/[locale]/_components/HeroBanner.tsx`
- `src/app/[locale]/_components/GatheringSection.tsx`
- `src/app/[locale]/_components/CommunitySection.tsx`
- `src/app/[locale]/(public)/about/_components/MissionVisionSection.tsx`
- `src/lib/data/leadership.ts`

### Criar
- `.env.local`
- `.env.production`
- `src/lib/constants/images.ts`

---

## Checklist de Conclusão

- [ ] `next build` local sem erros de `hostname not configured`
- [ ] Todas as imagens carregam em produção via URL do Akamai Italy
- [ ] Headers `Cache-Control` corretos nas respostas de imagem
- [ ] Nenhuma referência a `erelachapelle.dzign-e.app` restante no código
- [ ] Domínio customizado resolvendo para Vercel (`dig {dominio}` retorna IPs da Vercel)
- [ ] Build automático disparado por push na branch `main` funcionando

---

## Dependência Bloqueante

> O **hostname público do servidor Akamai Italy** precisa ser definido antes da Fase 3.
> Pode ser um IP fixo, um subdomínio existente, ou um novo subdomínio dedicado como
> `cdn.erelachapelle.com` apontado via registro A para o IP do Akamai.
