## 1. Base da API

- [x] 1.1 Spec: conferir os requisitos "Acesso Pro" e "Dados da assinatura ao apagar a conta"
- [x] 1.2 Teste falhando: migration `0004_subscriptions.sql` cria `subscriptions` e `question_usage`, e `DELETE /me` apaga as duas (cascade)
- [x] 1.3 Implementação: escrever a migration; adicionar `ADMIN_EMAILS` em `wrangler.jsonc`, os segredos e os tipos do `Env`; `deleteUser` apaga assinatura e uso (o cliente do RevenueCat em `deps.ts` entra na 3.4, junto com quem o usa)
- [x] 1.4 Teste falhando: `isPro` cobre assinatura ativa, assinatura expirada e admin (comparação de e-mail sem diferenciar maiúsculas)
- [x] 1.5 Implementação: `api/src/billing/access.ts` e `api/src/db/subscriptions.ts`; testes passando

## 2. Webhook do RevenueCat

- [x] 2.1 Teste falhando: cenários do requisito "Webhook do RevenueCat" (segredo errado, primeira compra, cancelamento, expiração, evento fora de ordem, usuário inexistente)
- [x] 2.2 Implementação: rota `POST /webhooks/revenuecat`, com validação Zod do evento e comparação do segredo em tempo constante; testes passando

## 3. Plano, sincronização e cota na API

- [x] 3.1 Teste falhando: cenários de "Consultar plano e uso" (plano grátis, assinante, admin)
- [x] 3.2 Implementação: `GET /me/subscription`; testes passando
- [x] 3.3 Teste falhando: cenários de "Sincronizar assinatura", com o RevenueCat mockado via `deps` (sucesso e erro 500 → `502 billing_unavailable`)
- [x] 3.4 Implementação: `POST /me/subscription/sync` e cliente REST do RevenueCat; testes passando
- [x] 3.5 Teste falhando: cenários de "Cota de perguntas" (plano grátis, cota esgotada, falha não consome, renovação zera, admin sem limite)
- [x] 3.6 Implementação: `api/src/billing/quota.ts` com `assertCanAsk` e `recordAnswered`; testes passando

## 4. App: base de assinaturas

- [ ] 4.1 Instalar `react-native-purchases` com `npx expo install`; adicionar as chaves públicas em `app.config.ts`; criar o mock em `jest.setup.ts`
- [ ] 4.2 Teste falhando: cenários de "Plano no app" (consulta após login, uso do plano guardado sem conexão, sair volta ao plano grátis e chama `logOut`)
- [ ] 4.3 Implementação: `src/subscriptions/purchases.ts`, `store.ts`, `useSubscription.ts` e a ligação com login e logout em `src/auth/actions.ts`; testes passando

## 5. App: telas

- [ ] 5.1 Teste falhando: cenários de "Linha Dev Tips Pro em Ajustes"
- [ ] 5.2 Implementação: linha na seção Conta de Ajustes, com textos em PT-BR e EN; testes passando
- [ ] 5.3 Teste falhando: cenários de "Paywall" (conteúdo, preço carregando, fechar)
- [ ] 5.4 Implementação: `src/app/paywall.tsx` seguindo a tela 8 do design; testes passando
- [ ] 5.5 Teste falhando: cenários de "Assinar pelo app" e "Restaurar compras"
- [ ] 5.6 Implementação: fluxo de compra e de restauração com sincronização e mensagens; testes passando
- [ ] 5.7 Teste falhando: cenários novos de "Conta no app" (plano grátis, assinante, renovação desligada, admin) e o texto novo da confirmação de apagar a conta
- [ ] 5.8 Implementação: bloco "Plano" na tela Conta seguindo a tela 10 do design; testes passando

## 6. Fechamento

- [ ] 6.1 Documentar em `api/README` (ou `docs/backend/`) a configuração do RevenueCat, do Google Play Console, dos segredos e do webhook
- [ ] 6.2 Rodar `openspec validate --strict`
- [ ] 6.3 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit` no app, e `npm test` e `npm run typecheck` em `api/`
