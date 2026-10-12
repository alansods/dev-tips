## Why

Cinco assuntos que caem em entrevista de fullstack estão ausentes ou aparecem só de passagem:
- **enum**: um único card;
- **Promise.all/allSettled/race/any**: um card-resumo;
- **backend no Next.js**: dois conceitos básicos, e só na área Frontend;
- **rotas privadas no React Native**: nada;
- **fallback entre APIs externas instáveis**, como a busca de CEP com três provedores: nada.

O estudante não consegue revisar esses temas com a profundidade que a entrevista cobra.

## What Changes

- **TypeScript essencial** ganha o deck **Enums e alternativas** (6 cards), antes de "Perguntas de entrevista":
  - enum numérico e de string, `const enum`;
  - objeto `as const` como alternativa;
  - o JavaScript gerado por cada forma;
  - checagem exaustiva.
- **JavaScript assíncrono** ganha o deck **Combinadores de Promise** (6 cards):
  - `Promise.all`, `allSettled`, `race` e `any`, cada um num card próprio;
  - timeout com `race`;
  - fallback entre fontes com `any`.
- **React Native** ganha o deck **Autenticação e rotas privadas** (6 cards):
  - `Stack.Protected` e grupos de rotas;
  - contexto de sessão com o token no SecureStore e a splash enquanto a sessão carrega;
  - por que esconder a tela não substitui a validação no servidor.
- Trilha nova **Next.js no backend** (`nextjs-no-backend`), com 24 cards, na área Backend, framework Next.js. Decks:
  - Route Handlers;
  - Server Actions e mutações;
  - Autenticação e acesso a dados;
  - Perguntas de entrevista.

  Backend › JavaScript passa a listar o framework Next.js.
- Simulação nova **CEP com três APIs** (`sim-cep-com-fallback`), com 5 cards `interview`, na área Situações-problema. Ela cobre:
  - `Promise.any` × fallback sequencial;
  - por que `race` não serve;
  - resposta 200 que é erro (`{"erro": true}`);
  - timeout e cancelamento;
  - levar a busca para o backend com cache.

  A área passa a ter 7 casos e 30 cards.
- Tudo em PT-BR, com tradução completa para inglês.

## Capabilities

### New Capabilities

- `nextjs-backend-content`: a trilha "Next.js no backend", com a posição na navegação, os decks e as contagens, a qualidade do conteúdo, a versão do Next.js seguida e a tradução.

### Modified Capabilities

- `typescript-content`: `typescript-essencial` passa a ter 5 decks (30 cards), com o deck `enums`.
- `javascript-content`:
  - `javascript-assincrono` passa a ter 5 decks (30 cards), com o deck `combinadores-de-promise`;
  - Backend › JavaScript passa a mostrar Next.js em "Frameworks";
  - a linguagem reúne também a trilha "Next.js no backend".
- `mobile-content`: `react-native` passa a ter 5 decks (30 cards), com o deck `rotas-privadas`.
- `interview-simulations-content`:
  - 7 simulações e 30 cards, com a nova no fim;
  - 7 cards `senior`;
  - os snippets aceitam também `ts`.
- `catalog-navigation`: o card e a tela da área Situações-problema passam de 6 para 7 casos (também em inglês, "7 cases"), e o total vai de 25 para 30 cards.
- `home`: o item "Situações-problema" de "Novidades" passa a mostrar "7 casos", porque a área conta todas as suas simulações.

## Impact

- Conteúdo:
  - `content/tracks/{typescript-essencial,javascript-assincrono,react-native}/track.json` e `translations/en.json`;
  - novos `content/tracks/nextjs-no-backend/` e `content/tracks/sim-cep-com-fallback/`.
- Registro: `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes:
  - ajustes em `src/content/__tests__/` (trilhas de TS, JS, mobile e simulações) e nos testes de navegação (`javascript-navigation`, `simulations-navigation`, `catalog-navigation` e Home, se contarem casos/cards);
  - novos `nextjs-backend-track.test.ts` e `nextjs-backend-navigation.test.tsx`.
- README: lista de trilhas.
- Progresso salvo: quem já concluiu as 3 trilhas ampliadas verá 6 cards novos a estudar. Não há migração de dados.
- Sem mudança no schema de conteúdo, nas telas, na API ou no backend.

## Fora de escopo

- Reescrever os cards atuais:
  - o `enum` de "Unions e narrowing" e o resumo `combinadores` de "Promises" continuam como estão e só ganham ligações com os novos;
  - o deck "Dados e rotas de API" da trilha Next.js continua como introdução.
- Novas perguntas de entrevista nas 3 trilhas ampliadas, cujo deck de entrevista segue com 6 cards.
- Autenticação no backend do próprio app Dev Tips, ou mudanças nas rotas do app.
- Integrar alguma API de CEP no app; o tema é só conteúdo de estudo.
- Rotas privadas em React Navigation puro (sem Expo Router).
