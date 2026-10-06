## Why

Vagas de frontend com React e React Native pedem testes unitários e de integração com Jest e Testing Library. Hoje nenhuma trilha ensina isso: Jest só aparece citado na trilha de CI/CD. Esta é a segunda trilha da série que cobre as lacunas de uma vaga de frontend sênior, depois de "Estado e dados no React".

## What Changes

- Trilha nova **Testes no frontend** (`testes-no-frontend`), com 24 cards em PT-BR e tradução completa para inglês, no mesmo formato das trilhas existentes: 3 decks de conteúdo e "Perguntas de entrevista", com nível e termos relacionados em todo card e os três níveis na trilha.
  - **Jest:** o runner, matchers, mocks (`jest.fn`, `jest.mock`, `spyOn`), fake timers e snapshots.
  - **Testing Library:** testar pelo que o usuário vê, prioridade das queries (`getByRole`), `get`/`query`/`find`, `userEvent` vs `fireEvent` e React Native Testing Library.
  - **Testes de integração:** pirâmide e troféu de testes, mock de API na rede (MSW), testar hooks com `renderHook` e o que vale cobrir.
- A trilha fica no framework React, nas áreas Frontend e Mobile, como "Estado e dados no React":
  - Frontend › JavaScript › React passa a listar 3 trilhas.
  - Mobile › JavaScript › React passa a listar 2 trilhas.
- Os cenários de navegação de "Estado e dados no React" passam a conferir a ordem relativa das trilhas, em vez da lista completa, para não mudar a cada trilha nova no framework React.

## Capabilities

### New Capabilities

- `frontend-testing-content`: a trilha "Testes no frontend", com a posição na navegação, os decks e as contagens, o conteúdo autoral, a ligação com o glossário, a mistura de níveis e a tradução.

### Modified Capabilities

- `javascript-content`: Frontend › JavaScript passa a contar 3 trilhas em React e 11 trilhas em JavaScript.
- `mobile-content`: a área Mobile passa a contar 3 trilhas em JavaScript, e Mobile › JavaScript mostra React com 2 trilhas.
- `react-state-content`: os cenários de React no Frontend e no Mobile conferem a ordem relativa das trilhas.

## Impact

- `content/tracks/testes-no-frontend/track.json` e `translations/en.json`, registrados em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes novos: `src/content/__tests__/frontend-testing-track.test.ts` e `src/__tests__/frontend-testing-navigation.test.tsx`. Ajuste das contagens em `src/__tests__/javascript-navigation.test.tsx` e `src/__tests__/mobile-navigation.test.tsx`, e dos cenários em `src/__tests__/react-state-navigation.test.tsx`.
- README: lista de trilhas.
- Sem mudança no schema, nas telas, na navegação, na API ou nos dados salvos.

## Fora de escopo

- Testes end-to-end (Playwright, Cypress, Detox, Maestro) como assunto principal. Aparecem só como comparação na pirâmide de testes.
- Vitest como assunto próprio. Ele aparece como alternativa ao Jest, com a mesma API.
- As demais trilhas da série, cada uma num change próprio.
