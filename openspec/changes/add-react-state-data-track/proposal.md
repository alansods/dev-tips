## Why

Vagas de frontend com React e React Native cobram gerenciamento de estado (Context, Zustand, Redux), busca e cache de dados do servidor (React Query, SWR, Axios) e hooks personalizados. Hoje a trilha React tem só 2 cards sobre Context e hook customizado, e Zustand, Redux e React Query aparecem apenas citados numa resposta de entrevista. Essa é a primeira de uma série de trilhas para cobrir as lacunas de uma vaga de frontend sênior.

## What Changes

- Trilha nova **Estado e dados no React** (`estado-e-dados-no-react`), com 24 cards em PT-BR e tradução completa para inglês, no mesmo formato das trilhas existentes: 3 decks de conteúdo e "Perguntas de entrevista", com nível e termos relacionados em todo card e os três níveis na trilha.
  - **Estado global:** estado local vs global, Context e o custo de re-renderização, Zustand, Redux Toolkit e quando usar cada um.
  - **Dados do servidor:** estado do servidor vs estado do cliente, React Query e SWR (cache, `staleTime`, invalidação, mutações), Axios vs `fetch` e interceptors.
  - **Hooks personalizados:** extração de lógica, composição de hooks, `useReducer` e boas práticas de API de hook.
- A trilha fica no framework React e em duas áreas, Frontend e Mobile, porque as mesmas bibliotecas valem para React Native:
  - Frontend › JavaScript › React passa a listar 2 trilhas.
  - A área Mobile passa a mostrar React, ao lado de React Native, em Mobile › JavaScript.

## Capabilities

### New Capabilities

- `react-state-content`: a trilha "Estado e dados no React", com a posição na navegação, os decks e as contagens, o conteúdo autoral, a ligação com o glossário, a mistura de níveis e a tradução.

### Modified Capabilities

- `javascript-content`: os cenários de Frontend › JavaScript passam a contar 2 trilhas em React e 10 trilhas em JavaScript na área Frontend.
- `mobile-content`: os cenários da área Mobile passam a contar 2 trilhas em JavaScript e a mostrar React antes de React Native em Mobile › JavaScript.

## Impact

- `content/tracks/estado-e-dados-no-react/track.json` e `translations/en.json`, registrados em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes novos: `src/content/__tests__/react-state-track.test.ts` e `src/__tests__/react-state-navigation.test.tsx`. Ajuste das contagens em `src/__tests__/javascript-navigation.test.tsx` e `src/__tests__/mobile-navigation.test.tsx`.
- README e `openspec/config.yaml`: lista de trilhas.
- Sem mudança no schema, nas telas, na navegação, na API ou nos dados salvos.

## Fora de escopo

- As outras trilhas da série (testes, estilização e design system, build, Git, pagamentos, renderização e performance web, módulos nativos), cada uma num change próprio.
- Outras bibliotecas de estado (MobX, Jotai, Recoil, XState) e de dados (Apollo, Relay, RTK Query) como assunto principal. Elas aparecem só como comparação em cards.
- GraphQL.
