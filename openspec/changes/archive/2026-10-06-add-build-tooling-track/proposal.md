## Why

Vagas de frontend sênior pedem configurar e otimizar o build (Vite, Webpack, Babel, Metro) e empacotar apps com Expo. O catálogo não explica o que acontece entre o código e o bundle: transpilação, bundling, tree shaking, variáveis de ambiente e perfis de build. Esta é a quarta trilha da série que cobre as lacunas de uma vaga de frontend sênior.

## What Changes

- Trilha nova **Build e bundlers** (`build-e-bundlers`), com 24 cards em PT-BR e tradução completa para inglês, no mesmo formato das trilhas existentes:
  - **Transpilação:** transpilação, Babel (e alternativas como SWC e Oxc), alvos e polyfills, source maps.
  - **Bundlers na web:** o que um bundler faz, Vite, Webpack, tree shaking e code splitting.
  - **Metro e EAS:** Metro, Hermes, variáveis de ambiente no Expo e perfis do EAS Build.
  - **Perguntas de entrevista.**
- A trilha é de JavaScript puro (sem framework), nas áreas Frontend e Mobile:
  - Frontend › JavaScript mostra a trilha em "Linguagem pura", depois de TypeScript avançado; a linguagem passa a contar 13 trilhas.
  - Mobile › JavaScript passa a ter a seção "Linguagem pura", com esta trilha; a linguagem passa a contar 5 trilhas.

## Capabilities

### New Capabilities

- `build-tooling-content`: a trilha "Build e bundlers", com a posição na navegação, os decks e as contagens, o conteúdo autoral, a ligação com o glossário, a mistura de níveis e a tradução.

### Modified Capabilities

- `javascript-content`: em Frontend › JavaScript, "Linguagem pura" passa a terminar com "Build e bundlers", e a linguagem conta 13 trilhas.
- `mobile-content`: a área Mobile conta 5 trilhas em JavaScript, e Mobile › JavaScript passa a mostrar "Linguagem pura" com "Build e bundlers".

## Impact

- `content/tracks/build-e-bundlers/track.json` e `translations/en.json`, registrados em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes novos: `src/content/__tests__/build-tooling-track.test.ts` e `src/__tests__/build-tooling-navigation.test.tsx`. Ajustes em `javascript-navigation.test.tsx` (contagem) e `mobile-navigation.test.tsx` (contagem e seção "Linguagem pura").
- README: lista de trilhas.
- Sem mudança no schema, nas telas, na navegação, na API ou nos dados salvos.

## Fora de escopo

- Outros bundlers (Parcel, Turbopack, esbuild e Rspack como ferramentas principais) aparecem só como comparação.
- Monorepos (Turborepo, Nx) e publicação de pacotes npm.
- Configuração nativa de build (Gradle, Xcode) e assinatura de apps, que ficam para a trilha "Módulos nativos no Expo" e para a trilha React Native.
- As demais trilhas da série, cada uma num change próprio.
