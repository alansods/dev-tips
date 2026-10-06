## 1. Testes

- [x] 1.1 Testes falhando em `src/content/__tests__/build-tooling-track.test.ts` (com `describeContentTracks`) e `src/__tests__/build-tooling-navigation.test.tsx`
- [x] 1.2 Ajustar `javascript-navigation.test.tsx` (JavaScript com 13 trilhas) e `mobile-navigation.test.tsx` (JavaScript com 5 trilhas e seção "Linguagem pura")

## 2. Conteúdo

- [x] 2.1 Consultar a doc atual de Vite, Babel, Metro, Hermes e variáveis de ambiente do Expo e do EAS
- [x] 2.2 `content/tracks/build-e-bundlers/track.json` (PT-BR) com os 24 cards do plano
- [x] 2.3 `content/tracks/build-e-bundlers/translations/en.json`
- [x] 2.4 Registrar a trilha em `src/content/catalog.ts` e a tradução em `src/content/translations.ts`
- [x] 2.5 Testes de conteúdo, cobertura de tradução e navegação passando
- [x] 2.6 `english-content.test.tsx` ("Buscar em inglês"): conferir que "CORS" está no resultado, como diz a spec de `localization`, e não que é o único (a definição em PT-BR de "Alvos e polyfills" cita browserslist)

## 3. Fechamento

- [x] 3.1 README: lista de trilhas
- [x] 3.2 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
