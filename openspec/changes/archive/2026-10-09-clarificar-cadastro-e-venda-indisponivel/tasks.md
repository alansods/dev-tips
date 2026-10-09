## 1. Login com cadastro explícito

- [x] 1.1 Ajustar os testes de `src/__tests__/auth-flow.test.tsx` aos requisitos "Tela de login", "Entrar pelo app" e "Conta no app" (novo nome do botão do Google, legenda do cenário "Cadastro explicado", botão "Entrar ou criar conta" no Perfil) e confirmar que falham
- [x] 1.2 Atualizar `auth.google` e `account.signIn` e criar `auth.signupHint` em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`
- [x] 1.3 Mostrar a legenda abaixo do `GoogleButton` em `src/app/login.tsx` e deixar o rótulo de `src/auth/GoogleButton.tsx` quebrar linha centralizado
- [x] 1.4 Atualizar os demais testes que procuram "Continuar com o Google" ou "Entrar" (por exemplo `src/__tests__/subscriptions-ui.test.tsx`)
- [x] 1.5 Rodar os testes e confirmar que passam

## 2. Paywall com assinatura indisponível

- [x] 2.1 Escrever o teste do cenário "Assinatura indisponível" e reforçar o de "Preço carregando" (sem o aviso) em `src/__tests__/subscriptions-ui.test.tsx`; confirmar que falham
- [x] 2.2 Criar `pro.unavailable` em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`
- [x] 2.3 Em `src/app/paywall.tsx`, separar "carregando" (`undefined`) de "indisponível" (`null`) e mostrar o aviso no bloco de alerta quando não houver outra mensagem
- [x] 2.4 Rodar os testes e confirmar que passam

## 3. Verificação

- [x] 3.1 Rodar `openspec validate clarificar-cadastro-e-venda-indisponivel --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
