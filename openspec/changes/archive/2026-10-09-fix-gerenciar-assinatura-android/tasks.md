## 1. Gerenciar assinatura no Android

- [x] 1.1 Escrever `src/subscriptions/__tests__/purchases.test.ts` (Android abre o link de assinaturas do Play com `sku` e `package`) e o caso de UI "Gerenciar assinatura no Android" em `src/__tests__/subscriptions-ui.test.tsx`; confirmar que falham
- [x] 1.2 Corrigir `manageSubscriptions()` em `src/subscriptions/purchases.ts` para abrir o link com `Linking.openURL`
- [x] 1.3 Rodar os testes e confirmar que passam

## 2. Verificação

- [x] 2.1 Rodar `openspec validate fix-gerenciar-assinatura-android --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
