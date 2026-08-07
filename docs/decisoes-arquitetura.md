# Decisões de Arquitetura — cevennes-site

> Decisões de arquitetura já tomadas para a futura API e backoffice, registradas para servir de contexto em desenvolvimento futuro (humano ou LLM). Complementa [contexto-e-referencia.md](./contexto-e-referencia.md) (estado atual do site) e [modelo-de-dados.md](./modelo-de-dados.md) (entidades). As decisões aqui já foram discutidas e fechadas — não devem ser revertidas ou redesenhadas silenciosamente; se um encaminhamento futuro conflitar com algo aqui, isso deve ser sinalizado explicitamente, não ignorado.

---

## 1. Banco de dados: MongoDB

- O banco de dados da API é **MongoDB**.
- MongoDB é schemaless — o banco em si não impõe estrutura fixa a nenhum campo, mesmo objetos embutidos. Isso não substitui validação na camada de API (ver seção 4).

### Entidade vs. objeto de valor

Nem tudo descrito em `modelo-de-dados.md` é uma "entidade". Regra de decisão:

- **Entidade**: tem `_id` próprio, é uma collection própria, pode ser referenciada por `ObjectId` a partir de outro documento (ex.: `Post.category` → `Category`).
- **Objeto de valor / subdocumento**: existe só embutido dentro do documento de uma entidade, sem `_id`, sem collection própria, não é referenciável de fora (ex.: `Location.coordinates`, `MultilingualText`, `Sermon.biblicalReference`).

### Estratégia de collections

Uma collection por entidade (`sermons`, `events`, `posts`, etc.) — não uma collection genérica tipo `content` com campo discriminador `type`. Dado o volume baixo de registros por entidade hoje, o modelo 1:1 é mais simples de indexar e consultar. Reavaliar só se surgir uma necessidade real de busca unificada entre tipos de conteúdo diferentes.

### Referenciar entidades: Extended Reference Pattern (não referência pura)

Quando uma entidade referencia outra (ex.: `Post` → `Category`, `Album` → imagens da `Gallery`), a referência **não é só o `ObjectId` puro** — isso seria tratar o MongoDB como banco relacional e perder a vantagem real de documento (evitar join/lookup no caminho de leitura mais comum). O padrão adotado é o **Extended Reference Pattern**: guardar o `id` **junto com uma cópia dos campos que são exibidos no dia a dia**.

```
category: { id: ObjectId, name: MultilingualText }
```
em vez de só `categoryId: ObjectId`.

**Quando vale a pena** (a maioria dos casos): o dado copiado muda raramente, ou não muda nunca depois de criado — o custo de sincronizar a cópia quando a fonte muda é baixo comparado ao ganho de nunca precisar de lookup pra exibir a informação mais comum daquela referência. Exemplos aplicados: `Post.category` (Category muda raramente, é curada), `Post.themes` (Theme não tem tela de edição — nome praticamente nunca muda depois de criado), `Album.images` (a `url` de uma imagem nunca muda depois de enviada; só pode ser soft-deleted), `Event.location` (só existe 1 localização hoje, muda raramente).

**Quando não vale a pena**: quando o dado referenciado muda com frequência, ou quando a relação é puramente interna/mecânica, sem uso de exibição — ex.: `Session.userId` continua só `ObjectId`, sem cópia de nada do `User`, porque nada relacionado à sessão precisa exibir dado do usuário direto do documento de sessão.

**Trade-off aceito**: se o dado copiado mudar na fonte (ex.: renomear uma `Category`), os documentos que a referenciam ficam com a cópia desatualizada até uma atualização em lote ser rodada. Isso é aceitável porque, nos casos onde aplicamos o padrão, essa mudança é rara ou inexistente — não é um dado que muda a cada request.

---

## 3. Internacionalização e fluxo de tradução

- O site tem 3 idiomas: **francês** (fonte/principal, onde a igreja está), **português** e **inglês** (secundários).
- **Mídia (vídeo, áudio, ebook) nunca é traduzida** — existe só em francês, em qualquer idioma do site. Só o texto ao redor (título, descrição) é traduzido.

### Fluxo de tradução: sob demanda, não automático

1. Autor escreve o conteúdo só em francês.
2. Botão "traduzir para PT" / "traduzir para EN" no editor chama a API de tradução.
3. O resultado aparece **editável** na tela, antes de confirmar.
4. Só ao confirmar e salvar, os 3 idiomas são persistidos juntos.

Não existe tradução automática em background ao salvar rascunho — a tradução só acontece quando o autor aciona explicitamente o botão.

### Regras de conteúdo parcialmente traduzido

- O autor pode salvar (rascunho ou publicado) só com o francês preenchido, a qualquer momento — nada obriga traduzir antes de salvar. Ele pode voltar depois e traduzir quando quiser.
- Se `pt`/`en` estiverem vazios, o site exibe o `fr` como fallback nesse idioma.
- Campo `staleTranslation: { pt?: boolean; en?: boolean }` (dentro de `MultilingualText`, ver `modelo-de-dados.md`) marca quando o francês foi editado depois da última tradução confirmada. Gera só um aviso visual no editor ("francês mudou desde a tradução") — **não bloqueia** salvar nem publicar.

### Serviço de tradução

**DeepL API Free** (tier gratuito, 500.000 caracteres/mês). Escolhido porque:
- Não há orçamento para serviço de tradução pago.
- Não há infraestrutura de GPU disponível (descarta rodar modelo próprio tipo LibreTranslate self-hosted em qualidade razoável).
- O volume real de conteúdo do site (poucos sermões/posts/eventos por mês) fica muito abaixo do limite gratuito — sem risco de precisar upgrade pago no médio prazo.

Alternativa de reserva, se algum dia o limite gratuito for insuficiente: LibreTranslate self-hosted (roda em CPU comum, sem GPU, mas com qualidade de tradução bem inferior à DeepL).

---

## 4. Validação da API: Zod como fonte única de verdade

- Toda validação de entrada da API usa **Zod**.
- O tipo TypeScript de cada entidade é **derivado do schema Zod** via `z.infer<typeof schema>` — não se escreve uma interface TypeScript separada mantida à mão em paralelo ao schema (isso evitaria o problema que já existe hoje no projeto, onde `src/types/` e `src/lib/validations/` são mantidos como fontes separadas).

### Duas variantes de schema por entidade

- **Schema de criação/edição**: só os campos de negócio que o backoffice realmente envia. Não inclui `_id`, `createdAt`, `updatedAt` — esses são controlados pelo servidor/banco, não pelo usuário.
- **Tipo da entidade completa**: o que a API devolve de volta, incluindo os campos de auditoria (`_id`, `createdAt`, `updatedAt`, `active`).

### Composição

Sub-schemas reutilizáveis (ex.: `multilingualTextSchema`, enums como `EventType`/`GroupType`/`DayOfWeek`) são compostos dentro de cada schema de entidade — não redeclarados em cada um.

### "Sem entidade no banco" ≠ "sem validação na API"

São decisões independentes:
- *"É uma entidade no banco?"* → modelagem de dados (`modelo-de-dados.md`).
- *"A API valida essa forma na entrada?"* → validação de entrada, decisão da camada de API.

Exemplo aplicado: `Sermon.biblicalReference` não é uma entidade nem tem tipo fixo no banco (é um `object` genérico, forma definida pelo front-end) — mas pode, ainda assim, ter um schema Zod próprio na API só para validar a entrada, sem que isso o torne uma entidade.

---

## 5. Exemplo aplicado: `Sermon.series`

Registrado aqui como referência de como aplicar as regras acima:

- Avaliado como candidato a entidade própria (`SermonSeries`), com página, descrição e capa — **descartado por over-engineering** dado o volume atual (2 dos 4 sermões existentes dividem uma série).
- Decisão final: campo `series: MultilingualText?` dentro do próprio `Sermon`, indexado por `series.fr` (para agrupar/filtrar sermões da mesma série).
- Trade-off aceito conscientemente: sem entidade canônica, nomes de série digitados de forma levemente diferente entre sermões (maiúscula, espaço a mais) são tratados como séries diferentes pelo índice — depende de disciplina de quem cadastra o conteúdo, sem validação de unicidade/duplicidade.
