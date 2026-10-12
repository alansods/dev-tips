## Context

O conteúdo vive em `content/tracks/<id>/track.json` e é validado pelo schema da capability `content-model` (`src/content/schema.ts`). Cada trilha entra no app por import estático em `src/content/catalog.ts`, e a tradução por `src/content/translations.ts`. As specs de cada família de trilhas fixavam "4 decks × 6 cards", e os testes de cada capability (`src/content/__tests__/*-tracks.test.ts`) verificam essas contagens. A motivação está em proposal.md.

Versões que o conteúdo segue:
- Next.js 16 (`/vercel/next.js/v16.2.9`);
- Expo SDK 57, que é o do projeto. `Stack.Protected` existe desde o SDK 53, e `redirectTo` só a partir do SDK 58.

## Goals / Non-Goals

**Goals:**
- Aprofundar os 5 temas sem mudar o schema, as telas nem a navegação: só conteúdo, specs e testes.
- Ligar os temas entre si:
  - o card `any-com-fallback` (JS assíncrono) prepara a simulação de CEP;
  - os cards de resumo existentes (`enum` e `combinadores`) apontam para os decks novos.

**Non-Goals:**
- Um 5º deck como padrão geral. Só as 3 trilhas citadas mudam, e as demais continuam com 4 decks.
- Repetir na trilha nova o que a trilha `nextjs` já ensina (Server/Client Components, renderização).

## Decisions

### 1. Deck extra em vez de trilha nova para enum, Promises e rotas privadas
**Escolha:** um 5º deck antes do deck de entrevista, com a regra "o deck de entrevista é sempre o último" e a contagem por trilha na tabela da spec.
- O estudante encontra o assunto onde já procura.
- Enum sozinho não sustenta 24 cards.

**Descartado:**
- Trilhas separadas: ficariam pequenas e se sobreporiam às atuais.
- Substituir cards existentes: perde conteúdo e só abre espaço para 1 ou 2 cards por tema.

### 2. Trilha própria para Next.js no backend, na área Backend
**Escolha:** `nextjs-no-backend`, com `framework: "nextjs"` e `areas: ["backend"]`.
- A tela da linguagem já lista frameworks por área. Com isso, Next.js aparece em Backend › JavaScript sem mudança de código, e a trilha `nextjs` continua só no Frontend.
- O pré-requisito `nextjs` garante que a base (App Router, Server Components) venha antes.

**Descartado:** colocar a trilha `nextjs` também na área Backend. Isso levaria 18 cards de renderização para o Backend.

### 3. CEP como simulação, com snippets `ts`
**Escolha:**
- A área Situações-problema é o formato de "o entrevistador aprofunda o caso".
- As simulações aceitavam só `sql`/`text`, porque os casos anteriores eram de banco e arquitetura. Aqui a resposta é código assíncrono, então a regra passa a aceitar `ts`. Um fluxo em `text` esconderia justamente `Promise.any` e `AbortController`.

**Descartado:** um deck "situação-problema" dentro de `javascript-assincrono`. Fugiria do formato `interview` e da área criada para isso.

### 4. Conteúdo técnico conferido na documentação atual
Cada card com API de framework é conferido no Context7 antes de escrito. Pontos já confirmados:
- **Next 16:**
  - `params` e `cookies()`/`headers()` são assíncronos;
  - GET de Route Handler não tem cache por padrão, e `'use cache'` vai numa função auxiliar, não no handler;
  - `revalidateTag(tag, 'max')` exige o perfil;
  - `updateTag` só funciona em Server Action e dá "read-your-writes";
  - `proxy.ts` substitui `middleware.ts` e serve para checagem otimista; a autorização real fica na DAL com `server-only`.
- **Expo Router:**
  - `Stack.Protected guard={...}` redireciona para a âncora e remove do histórico as telas protegidas;
  - `SplashScreen` vem de `expo-router`;
  - o padrão de `SessionProvider` segue o guia "Authentication" da Expo.
- **CEP:**
  - ViaCEP devolve HTTP 200 com `{"erro": true}` para CEP inexistente;
  - BrasilAPI (`/api/cep/v2/{cep}`) devolve 404;
  - a resposta é normalizada para `{ cep, logradouro, bairro, cidade, uf }`.

### 5. Ids e ligações
- O deck novo de JS se chama `combinadores-de-promise`, para não ter o mesmo id do card-resumo `combinadores` (são namespaces diferentes, mas o mesmo nome confundiria).
- Concepts novos com termos distintos dos existentes, já que o glossário exige termos únicos por trilha:
  - `Promise.all` (os existentes são "Promise.all, allSettled, race e any" e "enum");
  - "Enum numérico", "Enum de string", "const enum", "Objeto as const".

### 6. Ordem de registro
- `nextjs-no-backend` entra depois de `modulos-nativos-no-expo`, como as outras trilhas recentes.
- `sim-cep-com-fallback` entra depois de `sim-api-de-notificacoes`.
- Assim nenhum teste de ordem existente quebra além dos que contam simulações.

## Risks / Trade-offs

- **Progresso de quem concluiu as trilhas:** o "sei/total" de `typescript-essencial`, `javascript-assincrono` e `react-native` cai, porque o total sobe de 24 para 30. → É o comportamento esperado ao ganhar conteúdo. Os cards novos entram como não estudados, sem migração.
- **Next.js e Expo mudam rápido:** o conteúdo pode envelhecer. → A spec trava os pontos de versão (params assíncrono, sem `middleware.ts`, `revalidateTag` com perfil), e os testes os verificam.
- **APIs de CEP mudam formatos ou saem do ar:** → os cards ensinam o padrão (normalizar, `any`, timeout, cache), sem depender de detalhes que mudam; as URLs aparecem só como exemplo.
- **Contagens espalhadas nos testes de navegação** (casos, cards, frameworks do Backend): → atualizar todas as que a suíte acusar, sempre a partir dos cenários das specs.
