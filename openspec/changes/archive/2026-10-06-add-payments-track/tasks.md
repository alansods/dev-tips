## 1. Testes

- [x] 1.1 Testes falhando em `src/content/__tests__/payments-track.test.ts` (com `describeContentTracks`) e `src/__tests__/payments-navigation.test.tsx`
- [x] 1.2 Ajustar as contagens em `mobile-navigation.test.tsx` (JavaScript com 6 trilhas, React Native com 2)

## 2. Conteúdo

- [x] 2.1 Consultar a doc atual de IAP no Expo, RevenueCat, Stripe React Native e as regras atuais das lojas (inclusive no Brasil)
- [x] 2.2 `content/tracks/pagamentos-no-app/track.json` (PT-BR) com os 24 cards do plano
- [x] 2.3 `content/tracks/pagamentos-no-app/translations/en.json`
- [x] 2.4 Registrar a trilha em `src/content/catalog.ts` e a tradução em `src/content/translations.ts`
- [x] 2.5 Testes de conteúdo, cobertura de tradução e navegação passando

## 3. Fechamento

- [x] 3.1 README: lista de trilhas
- [x] 3.2 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
