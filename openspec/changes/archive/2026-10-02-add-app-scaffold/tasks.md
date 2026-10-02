## 1. Dependências e configuração

- [x] 1.1 Conferir na doc versionada do SDK 57 a instalação do expo-router, `useFonts`/`expo-splash-screen` e `renderRouter`
- [x] 1.2 Instalar com `npx expo install`: expo-router, react-native-safe-area-context, react-native-screens, expo-linking, expo-constants, expo-font, expo-splash-screen, react-native-svg, @react-native-async-storage/async-storage, @expo-google-fonts/ibm-plex-sans, @expo-google-fonts/jetbrains-mono, react-dom e react-native-web (para a verificação na web). Em dev: @testing-library/react-native e prettier, conferindo que caíram em `devDependencies`
- [x] 1.3 `package.json`: `main` = `expo-router/entry` e scripts `format`/`format:check`. `app.json`: `scheme` `devtips`, plugin `expo-router`, `userInterfaceStyle` `automatic`. Remover `App.tsx` e `index.ts`
- [x] 1.4 Criar `.prettierrc` e `.prettierignore`, rodar `format` no código existente e confirmar `npm test`, `npm run lint` e `npx tsc --noEmit` verdes
- [x] 1.5 Criar `jest.setup.ts` com os mocks de AsyncStorage, fontes e splash, e registrá-lo no `jest` do `package.json`

## 2. Catálogo (Requirement: Catálogo de temas no app)

- [x] 2.1 Escrever os testes que falham: tema registrado, pasta sem registro (função de comparação testada com listas e ligada a `content/themes` real) e padrões aplicados
- [x] 2.2 Exportar `themeSchema` do módulo de conteúdo e implementar `src/content/catalog.ts` (`catalog`, `getTheme`); testes passando

## 3. Tema visual (Requirements: Tema claro e escuro; Contraste mínimo)

- [x] 3.1 Escrever o teste que falha de contraste dos tokens e implementar `src/theme/contrast.ts` e `src/theme/tokens.ts` com as cores do design; ajustar tokens se algum par falhar (e registrar no `config.yaml`)
- [x] 3.2 Escrever os testes que falham do provider: segue o sistema, alternar manualmente (incluindo o rótulo do botão), escolha lembrada e preferência indisponível
- [x] 3.3 Implementar `ThemeProvider`, `useTheme` e o botão de tema; testes passando

## 4. Navegação, fontes e telas (Requirements: Navegação por abas; Telas provisórias; Fontes; Home mínima)

- [x] 4.1 Escrever os testes que falham com `renderRouter` sobre `src/app`: app abre na aba Temas, trocar de aba, abas na ordem do design, Glossário provisório, lista de temas e falha ao carregar fontes
- [x] 4.2 Implementar `src/app/_layout.tsx` (providers, fontes, splash, Stack) e `src/app/(tabs)/_layout.tsx` (Tabs com ícones SVG, rótulos, cores dos tokens e botão de tema no cabeçalho)
- [x] 4.3 Implementar os componentes base `Screen` e `AppText`, a Home (lista de títulos do catálogo) e as telas provisórias de Glossário e Progresso; testes passando

## 5. Verificação final

- [x] 5.1 Rodar o app com `npx expo start --web` e conferir no Chrome, com capturas de tela: abre em Temas, troca de abas, alterna claro/escuro e lista o tema
- [x] 5.2 Conferir que todo cenário da spec tem pelo menos um teste com o mesmo nome
- [x] 5.3 Rodar `openspec validate add-app-scaffold --strict`
- [x] 5.4 Rodar `npm test`, `npm run lint`, `npx tsc --noEmit` e `npm run format:check`, todos verdes
