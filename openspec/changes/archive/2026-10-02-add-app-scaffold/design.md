## Context

O projeto é Expo SDK 57 com o template `blank-typescript` (`App.tsx` + `index.ts`), Jest (`jest-expo`) e ESLint. O conteúdo vive em `content/themes/*/theme.json` e é validado pelo `content-model`. O design aprovado está registrado em `openspec/config.yaml` e no protótipo. Requisitos em `specs/app-shell/spec.md`.

## Goals / Non-Goals

**Goals:**
- Uma base em que cada tela futura só precise de: uma rota, `useTheme()` para as cores e `catalog` para o conteúdo.
- Comportamento de tema e navegação testável com Jest, sem simulador.

**Non-Goals:**
- Biblioteca de componentes completa: só o mínimo usado aqui (`Screen`, `AppText`).
- Store global de estado de estudo (Zustand entra com `study-session` e `progress`).

## Decisions

### 1. Expo Router com abas em `src/app/(tabs)/`
Estrutura:
- `src/app/_layout.tsx`: raiz com providers (tema, fontes e splash) e um `Stack`;
- `src/app/(tabs)/_layout.tsx`: `Tabs` com as abas `index` (Temas), `glossary` e `progress`.

O cabeçalho com o botão de tema fica nas opções de `Tabs`, para aparecer nas 3 abas. Os ícones são SVG inline com traço, como no protótipo, via `react-native-svg`, que entra junto. Os rótulos aparecem sempre.
- *Por quê:* é o padrão recomendado no `AGENTS.md` do SDK 57 (rotas em `src/app/`). As telas cheias que vêm depois (sessão de estudo, tela do tema) entram no `Stack` raiz, fora das abas, como pede o design.
- *Alternativa:* React Navigation direto. Descartada porque exige mais código e vai contra a recomendação do Expo.

### 2. Tema: tokens puros + provider com preferência
- `src/theme/tokens.ts`: `light` e `dark` com os hexadecimais do design (`bg`, `surface`, `surface2`, `ink`, `muted`, `line`, `accent`, `onAccent`, `accentSoft`, `accentText`, `warn`, `warnSoft`, `code`, `codeInk`, `codeMuted`, `track`), mais `fonts` e espaçamentos.
- `src/theme/ThemeProvider.tsx`: combina `useColorScheme()` com a preferência salva (`'light' | 'dark' | null`) no AsyncStorage, na chave `dev-tips:color-scheme`. Expõe `useTheme()`, que devolve `{ colors, scheme, toggle }`.
  - Leitura assíncrona: enquanto a preferência não chega, usa o modo do sistema. Erros de leitura e escrita são engolidos, como pede o cenário "Preferência indisponível".
- `app.json` com `userInterfaceStyle: "automatic"`, para que o `useColorScheme` reflita o sistema.
- *Alternativa:* `react-navigation` themes. Descartada como fonte principal porque cobre poucas cores. O tema do navigator é derivado dos nossos tokens só para a barra de abas e o cabeçalho.

### 3. Contraste testado como função pura
`src/theme/contrast.ts` calcula a razão de contraste WCAG (luminância relativa). Um teste percorre os pares exigidos pela spec em cada modo: `ink` e `muted` sobre `bg`, `surface` e `surface2`, e `onAccent` sobre `accent`. Se algum token do design falhar, ajusto o token e registro o novo valor no `config.yaml`.

### 4. Fontes
Os pacotes `@expo-google-fonts/ibm-plex-sans` (400, 500, 600 e 700) e `@expo-google-fonts/jetbrains-mono` (400 e 500) são carregados com `useFonts` no layout raiz. `SplashScreen.preventAutoHideAsync()` segura a splash até `loaded || error`.
- Em caso de erro, o app segue com a fonte do sistema: `tokens.fonts` cai para `undefined` e o `AppText` não força a família.

### 5. Catálogo: registro estático + parse no carregamento
`src/content/catalog.ts` importa cada `theme.json` estaticamente (o Metro empacota o JSON) e expõe `catalog: Theme[]` e `getTheme(id)`. Cada tema passa por `themeSchema.parse` no carregamento do módulo.
- **Isto revisa uma decisão do design do `content-model`**, que dizia para não revalidar em runtime. O JSON cru não tem os padrões (`tags`, `relatedTerms` e `origin` omitidos), e o app precisa deles. O parse do Zod aplica os padrões e custa poucos milissegundos para 72 KB. Como o gate do `npm test` já garante validade, o parse nunca falha em produção.
- **Teste de registro:** compara as pastas de `content/themes/` com os ids do catálogo, nos dois sentidos.
- *Alternativa:* aplicar os padrões na mão. Descartada porque duplicaria o schema.

### 6. Testes de tela
- `@testing-library/react-native` e `expo-router/testing-library` (`renderRouter` com os layouts reais de `src/app`).
- AsyncStorage com o mock oficial (`@react-native-async-storage/async-storage/jest/async-storage-mock`) num `jest.setup.ts`.
- Fontes e splash mockadas no setup para o carregamento ser imediato. Um teste simula falha de fonte.
- `useColorScheme` mockado para cobrir sistema claro e escuro.

### 7. Prettier
`.prettierrc` alinhado ao estilo atual do código (aspas simples, vírgula final, `printWidth` 120, que é o que o código já usa). Script `format` e `format:check`; o `format:check` entra na verificação final. Sem `eslint-config-prettier` por enquanto, já que o `eslint-config-expo` não traz regras de estilo que conflitem.

## Risks / Trade-offs

- [`renderRouter` com layout raiz que carrega fontes pode ficar assíncrono e instável nos testes] → Fontes e splash mockadas no setup, e uso de `findBy*` nas asserções.
- [O SDK 57 pode ter mudado APIs do router e das fontes] → Antes de codar, conferir a doc versionada (`docs.expo.dev/versions/v57.0.0/`), como manda o `AGENTS.md`.
- [O parse em runtime pode atrasar a abertura com muitos temas no futuro] → Medir quando houver mais de um tema grande. Se for o caso, trocar por um JSON pré-processado no build, numa change própria.
- [`react-native-svg` adiciona uma dependência nativa] → Já vem no Expo Go, então não exige development build.
