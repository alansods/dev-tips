## Why

O conteúdo existe e está validado, mas o app ainda é o `App.tsx` do template. As próximas changes de tela (`theme-catalog`, `study-session`, `glossary-links` e `progress`) precisam de uma base comum: navegação, tema visual claro/escuro, fontes e acesso ao catálogo de temas. Fazer isso numa change própria evita que cada tela reinvente essas peças.

## What Changes

- **Navegação com Expo Router** (rotas em `src/app/`):
  - 3 abas inferiores, conforme o design aprovado: **Temas**, **Glossário** e **Progresso**;
  - o app abre na aba Temas;
  - Glossário e Progresso ficam como telas provisórias, que as changes seguintes preenchem.
- **Tema visual claro/escuro:**
  - tokens de cor do design aprovado;
  - segue o sistema por padrão;
  - botão no cabeçalho para alternar manualmente, com a escolha salva no aparelho.
- **Fontes do design:** IBM Plex Sans para a interface e JetBrains Mono para código e rótulos. A splash fica visível até as fontes carregarem.
- **Catálogo de temas no app:** um registro estático dos temas empacotados. O conteúdo é carregado já com os valores padrão do schema.
- **Home mínima:** lista os títulos dos temas do catálogo. O card completo, com progresso e "Em breve", vem na change `theme-catalog`.
- **Ferramentas:** Prettier com script `format`, e React Native Testing Library para testes de tela.
- Remove o `App.tsx` e o `index.ts` do template.

## Capabilities

### New Capabilities
- `app-shell`: estrutura de navegação, tema claro/escuro, fontes e acesso ao catálogo de temas pelo app.

### Modified Capabilities
<!-- nenhuma: content-model e crud-theme-content não mudam de comportamento -->

## Impact

- **Novos arquivos:** `src/app/` (layouts e rotas), `src/theme/` (tokens e preferência de tema), `src/content/catalog.ts` (registro de temas), `.prettierrc`.
- **Novas dependências** (via `npx expo install`):
  - navegação: `expo-router`, `react-native-safe-area-context`, `react-native-screens`, `expo-linking`, `expo-constants`;
  - ícones: `react-native-svg`;
  - fontes e splash: `expo-font`, `expo-splash-screen`, `@expo-google-fonts/ibm-plex-sans`, `@expo-google-fonts/jetbrains-mono`;
  - preferência de tema: `@react-native-async-storage/async-storage`;
  - verificação na web: `react-dom`, `react-native-web`;
  - testes e formatação: `@testing-library/react-native`, `prettier`.
- **Configuração:**
  - `package.json`: `main` passa a ser `expo-router/entry`;
  - `app.json`: ganha `scheme`, o plugin do router e `userInterfaceStyle: "automatic"`.

## Fora de escopo

- Card de tema com progresso, temas "Em breve" e tela do tema com decks (`theme-catalog`).
- Sessão de estudo, flashcards e resumo (`study-session`).
- Busca no glossário e bottom sheet de termos (`glossary-links`).
- Persistência do progresso de estudo (`progress`).
- Ícone, splash personalizada e build EAS (polimento e release).
