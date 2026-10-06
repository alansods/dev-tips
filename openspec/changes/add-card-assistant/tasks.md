## 1. API: cliente do Gemini

- [x] 1.1 Spec: conferir "Respostas só sobre o card" e "Falha do modelo"; confirmar na documentação atual do Gemini o nome do modelo Flash e o campo de saída estruturada da REST v1beta
- [x] 1.2 Teste falhando: `gemini.ts` monta o pedido (instrução com o texto do card e o idioma, histórico com papéis `user`/`model`, schema `{ inScope, answer }`, `maxOutputTokens`) e lê a resposta; erro HTTP, JSON inválido ou tempo esgotado lançam
- [x] 1.3 Implementação: `api/src/assistant/gemini.ts`; `gemini` em `deps.ts`; `GEMINI_MODEL` em `wrangler.jsonc`; `GEMINI_API_KEY` em `secrets.d.ts`, `.dev.vars.example` e `vitest.config.ts`; testes passando

## 2. API: rota POST /assistant/ask

- [x] 2.1 Teste falhando: cenários de "Perguntar sobre o card na API" (respondida, plano grátis, cota esgotada, pergunta longa, sem sessão), com o Gemini falso
- [x] 2.2 Teste falhando: cenários de "Respostas só sobre o card" (contexto enviado, fora do escopo não consome) e "Falha do modelo" (502, não consome)
- [x] 2.3 Implementação: `api/src/routes/assistant.ts` com Zod, `assertCanAsk`, Gemini e `recordAnswered` só quando `inScope`; texto fixo de recusa em PT-BR e EN; testes passando

## 3. App: base do chat

- [ ] 3.1 Teste falhando: `cardText` gera o texto do card (sem `id` e `relatedTerms`, cortado em 8.000 caracteres)
- [ ] 3.2 Teste falhando: `ask()` mapeia sucesso, sem conexão, `pro_required`, `quota` e erro; `useCardChat` envia as últimas 6 mensagens, zera ao trocar de card e guarda a última pergunta para "Tentar de novo"
- [ ] 3.3 Implementação: `src/assistant/cardText.ts`, `api.ts` e `useCardChat.ts`; atualização de `questions` no `useSubscriptionStore`; testes passando

## 4. App: botão e gaveta

- [ ] 4.1 Teste falhando: cenários de "Botão Perguntar na sessão" (último na frente e no verso, selo PRO e paywall sem conta, chat para assinante, ausente na web)
- [ ] 4.2 Implementação: `src/assistant/AskButton.tsx` e ligação em `src/study/StudySession.tsx`; testes passando
- [ ] 4.3 Teste falhando: cenários de "Chat do card" (vazio, recomeça em outro card, reabrir no mesmo card) e "Enviar pergunta no app" (pergunta e resposta, sugestão, bloco de código, fora deste card)
- [ ] 4.4 Implementação: `ChatSheet.tsx` e `MessageText.tsx` seguindo as telas 3 a 6 do design; textos em PT-BR e EN; testes passando
- [ ] 4.5 Teste falhando: cenários de "Erros e cota no chat" (sem conexão, tentar de novo, cota esgotada, assinatura expirou)
- [ ] 4.6 Implementação: estados de erro, rodapé de cota (tela 9) e redirecionamento ao paywall; testes passando

## 5. Fechamento

- [ ] 5.1 Documentar em `docs/backend/assinaturas.md` (ou num `docs/backend/assistente.md`) a chave do Gemini, `GEMINI_MODEL` e o deploy
- [ ] 5.2 Rodar `openspec validate --strict`
- [ ] 5.3 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit` no app, e `npm test` e `npm run typecheck` em `api/`
