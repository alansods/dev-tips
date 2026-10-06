## Why

Vagas de frontend com React e React Native pedem domínio de estilização e de design systems: Tailwind ou NativeWind, componentes reutilizáveis e consistentes, Storybook e acessibilidade. Hoje o catálogo só tem StyleSheet e flexbox na trilha React Native. Esta é a terceira trilha da série que cobre as lacunas de uma vaga de frontend sênior.

## What Changes

- Trilha nova **Estilização e design system** (`estilizacao-e-design-system`), com 24 cards em PT-BR e tradução completa para inglês, no mesmo formato das trilhas existentes:
  - **Tailwind e NativeWind:** utility-first, Tailwind (variantes de estado e de tela, tokens no tema), NativeWind no React Native e classes condicionais.
  - **Design system:** o que é e como manter, design tokens e tema claro/escuro, componentes com variantes e Storybook.
  - **Acessibilidade:** por que importa, papéis e rótulos, contraste e área de toque, leitor de tela e foco.
  - **Perguntas de entrevista.**
- A trilha fica no framework React, nas áreas Frontend e Mobile, depois de "Testes no frontend":
  - Frontend › JavaScript › React passa a listar 4 trilhas.
  - Mobile › JavaScript › React passa a listar 3 trilhas.

## Capabilities

### New Capabilities

- `styling-design-system-content`: a trilha "Estilização e design system", com a posição na navegação, os decks e as contagens, o conteúdo autoral, a ligação com o glossário, a mistura de níveis e a tradução.

### Modified Capabilities

- `javascript-content`: Frontend › JavaScript passa a contar 4 trilhas em React e 12 trilhas em JavaScript.
- `mobile-content`: a área Mobile passa a contar 4 trilhas em JavaScript, e Mobile › JavaScript mostra React com 3 trilhas.

## Impact

- `content/tracks/estilizacao-e-design-system/track.json` e `translations/en.json`, registrados em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes novos: `src/content/__tests__/styling-track.test.ts` e `src/__tests__/styling-navigation.test.tsx`. Ajuste das contagens em `javascript-navigation.test.tsx` e `mobile-navigation.test.tsx`.
- README: lista de trilhas.
- Sem mudança no schema, nas telas, na navegação, na API ou nos dados salvos.

## Fora de escopo

- CSS-in-JS (styled-components, Emotion), CSS Modules e Sass como assunto principal. Aparecem só como comparação.
- Bibliotecas de componentes prontas (shadcn/ui, Material UI, Tamagui, Gluestack) como assunto próprio.
- Ferramentas de design (Figma) e animação.
- As demais trilhas da série, cada uma num change próprio.
