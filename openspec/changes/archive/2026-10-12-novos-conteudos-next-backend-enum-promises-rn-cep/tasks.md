## 1. TypeScript essencial: deck "Enums e alternativas"

- [x] 1.1 Conferir a delta spec `typescript-content` (deck `enums`, 30 cards, ligação do card `enum`)
- [x] 1.2 Atualizar `src/content/__tests__/typescript-tracks.test.ts` com os cenários novos (contagem 30/24, deck `enums` em 4º, snippet com `as const`, `enum` ligado ao deck novo) e ver os testes falharem
- [x] 1.3 Escrever os 6 cards do deck `enums` em `content/tracks/typescript-essencial/track.json` e ligar o card `enum` existente
- [x] 1.4 Traduzir o deck e os cards em `content/tracks/typescript-essencial/translations/en.json`
- [x] 1.5 Rodar os testes de TypeScript e de tradução até passarem

## 2. JavaScript assíncrono: deck "Combinadores de Promise"

- [x] 2.1 Conferir a delta spec `javascript-content` (deck `combinadores-de-promise`, 30 cards, Next.js em Backend › JavaScript)
- [x] 2.2 Atualizar `src/content/__tests__/javascript-tracks.test.ts` (contagem 30/24, 4 concepts com os termos, `AggregateError`, resumo `combinadores` ligado) e ver os testes falharem
- [x] 2.3 Escrever os 6 cards (4 concepts, `race-com-timeout`, `any-com-fallback`) e ligar o card `combinadores` existente
- [x] 2.4 Traduzir em `content/tracks/javascript-assincrono/translations/en.json`
- [x] 2.5 Rodar os testes de JavaScript e de tradução até passarem

## 3. React Native: deck "Autenticação e rotas privadas"

- [x] 3.1 Conferir a delta spec `mobile-content` e reconsultar no Context7 (`/websites/expo_dev`) `Stack.Protected`, `SplashScreen` e o guia de autenticação
- [x] 3.2 Atualizar `src/content/__tests__/mobile-tracks.test.ts` (5 decks, 30 cards, `_layout.tsx` com `Stack.Protected`/`guard`, `expo-secure-store`) e ver os testes falharem
- [x] 3.3 Escrever os 6 cards do deck `rotas-privadas` em `content/tracks/react-native/track.json`
- [x] 3.4 Traduzir em `content/tracks/react-native/translations/en.json`
- [x] 3.5 Rodar os testes de mobile e de tradução até passarem

## 4. Trilha nova "Next.js no backend"

- [x] 4.1 Conferir a delta spec `nextjs-backend-content` e reconsultar no Context7 (`/vercel/next.js/v16.2.9`) as APIs usadas nos cards
- [x] 4.2 Criar `src/content/__tests__/nextjs-backend-track.test.ts`, no padrão de `nextjs-performance-track.test.ts` (registro, decks, snippets `ts`/`bash`, versão atual, qualidade, tradução), e `src/__tests__/nextjs-backend-navigation.test.tsx` (Backend › JavaScript › Next.js, fora do Frontend, título em inglês). Ver os testes falharem
- [x] 4.3 Atualizar o cenário "JavaScript no Backend" em `src/__tests__/javascript-navigation.test.tsx` (Next.js, Express e NestJS) e ver o teste falhar
- [x] 4.4 Escrever `content/tracks/nextjs-no-backend/track.json` (24 cards) e registrá-lo em `src/content/catalog.ts` depois de `modulosNativosNoExpo`
- [x] 4.5 Escrever `content/tracks/nextjs-no-backend/translations/en.json` e registrá-lo em `src/content/translations.ts`
- [x] 4.6 Rodar os testes da trilha e de navegação até passarem

## 5. Simulação "CEP com três APIs"

- [x] 5.1 Conferir as delta specs `interview-simulations-content`, `catalog-navigation` e `home`
- [x] 5.2 Atualizar `src/content/__tests__/interview-simulations.test.ts` (7 simulações, 30 cards, `addedAt` por simulação, 7 `senior`, snippets `sql`/`text`/`ts`, cenários da simulação de CEP) e os testes de navegação que contam casos/cards (`simulations-navigation`, `catalog-navigation`, `home.test.tsx`, `src/home/__tests__/sections.test.ts`). Ver os testes falharem
- [x] 5.3 Escrever `content/tracks/sim-cep-com-fallback/track.json` (contexto ≤ 280 caracteres, 5 cards `interview` em primeira pessoa) e registrá-lo em `src/content/catalog.ts` depois de `simApiDeNotificacoes`
- [x] 5.4 Escrever `content/tracks/sim-cep-com-fallback/translations/en.json` (contexto ≤ 280 caracteres) e registrá-lo em `src/content/translations.ts`
- [x] 5.5 Rodar os testes de simulações e de navegação até passarem

## 6. Fechamento

- [x] 6.1 Atualizar a lista de trilhas e simulações no README
- [x] 6.2 Rodar `openspec validate --strict`
- [x] 6.3 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit`, todos verdes
