## 1. API: cota de 200 e histórico de 6

- [x] 1.1 Atualizar os testes da API para a cota de 200 e confirmar que falham:
  - `api/test/subscriptions.test.ts`: `limit: 200` no plano do assinante; cota esgotada e renovação com 200 usadas;
  - `api/test/assistant.test.ts`: `limit: 200` nas respostas; cota esgotada com 200 usadas.
- [x] 1.2 Em `api/test/assistant.test.ts`, trocar o teste de histórico para 7 mensagens recusadas com `400 invalid_body`, acrescentar um teste com 6 mensagens aceitas, e confirmar que falham.
- [x] 1.3 Mudar `QUESTION_LIMIT` para 200 em `api/src/billing/quota.ts` e `MAX_HISTORY` para 6 em `api/src/routes/assistant.ts`. Os testes da API devem passar.

## 2. App: textos da cota a partir de uma constante

- [x] 2.1 Atualizar os testes de UI para 200 e confirmar que falham:
  - `src/__tests__/subscriptions-ui.test.tsx`: paywall "200"; Perfil "37 / 200", "172 / 200", "Restam 28 perguntas", "200 / 200", "38 / 200" e o rótulo "37 de 200 perguntas usadas"; Conta "170", "30 / 200 usadas" e "200 perguntas por ciclo da assinatura.";
  - `src/__tests__/card-assistant-ui.test.tsx`: "Você usou as 200 perguntas do mês" e "200 de 200 · renova em 12/11/2026";
  - fixtures com `limit: 200` em `src/assistant/__tests__/chat.test.tsx`, `src/subscriptions/__tests__/plan.test.ts` e `src/subscriptions/__tests__/quota.test.ts`.
- [x] 2.2 Criar `PRO_QUESTION_LIMIT = 200` em `src/subscriptions/`. Em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`, montar `quotaAmount`, o primeiro item de `howRules`, `quotaTitle`, `quotaUsage` e `quotaRenews` a partir dela. Os testes do app devem passar.

## 3. Verificação e documentação

- [x] 3.1 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit` na raiz, e os testes e a checagem de tipos em `api/`.
- [x] 3.2 Rodar `openspec validate --strict`.
- [x] 3.3 Trocar 100 por 200 na documentação do backend onde ela citar a cota (só `docs/backend/assistente.md` citava; `assinaturas.md` não cita o número).
