## 1. Cor destrutiva no tema

- [x] 1.1 Spec ajustada: cenário "Apagar conta em destaque destrutivo" (auth › Conta no app)
- [x] 1.2 Teste falhando: na tela Conta, o botão "Apagar conta" usa a cor `danger` do tema (fundo), e não `warn`
- [x] 1.3 Implementação: tokens `danger`/`onDanger` em `src/theme/tokens.ts` (claro `#C62828`/`#FFFFFF`, escuro `#FF6B6B`/`#1A0A0A`), variante `danger` em `src/components/Button.tsx`, e `variant="danger"` em "Apagar conta" e "Apagar minha conta" (`src/app/account.tsx`)
- [x] 1.4 Teste passando

## 2. Tela Plano

- [x] 2.1 Spec ajustada: requisito "Tela Plano" (subscriptions) e "Restaurar compras" na tela Plano
- [x] 2.2 Testes falhando: os cenários do bloco Plano (grátis, assinante, 1 restante, renovação desligada, admin, iOS, gerenciar no Android, restaurar) passam a abrir `/plan`, e "Tela Plano sem sessão" volta para `/profile`
- [x] 2.3 Implementação: `src/app/plan.tsx` (cabeçalho Voltar + "Plano", `PlanCard`, redirect sem sessão). Tirar o `SectionTitle` interno do `PlanCard`
- [x] 2.4 Testes passando

## 3. Conta sem o plano

- [x] 3.1 Spec ajustada: requisito "Conta no app" sem o bloco Plano (cenário "Conta sem o plano")
- [x] 3.2 Teste falhando: `/account` de um assinante não mostra "Pro mensal", "30 / 200 usadas" nem "Gerenciar assinatura"
- [x] 3.3 Implementação: remover `PlanCard` de `src/app/account.tsx` e atualizar o comentário do topo
- [x] 3.4 Teste passando

## 4. Linha Dev Tips Pro abre o Plano

- [x] 4.1 Spec ajustada: "Linha Dev Tips Pro no Perfil" abre a tela "Plano" (cenários "Usuário Pro" e "Admin no Perfil")
- [x] 4.2 Testes falhando: Pro e admin tocando em "Dev Tips Pro" chegam a `/plan`
- [x] 4.3 Implementação: `src/settings/ProRow.tsx` com `router.push(pro ? '/plan' : '/paywall')` e o comentário atualizado
- [x] 4.4 Testes passando

## 5. Botões com peso diferente

- [x] 5.1 Spec ajustada: cenários "Destaque dos botões da Conta", "Confirmação de apagar" (auth) e "Destaque dos botões do Plano" (subscriptions)
- [x] 5.2 Testes falhando: "Sair" com borda e texto `danger` sem fundo `danger`; "Apagar conta" sem fundo, com texto `danger`, e a frase nova; "Apagar minha conta" preenchido `danger`; "Gerenciar assinatura" com borda `accent`; "Restaurar compras" sem fundo nem borda
- [x] 5.3 Implementação: variantes `dangerOutline` e `accentOutline` no `Button`, tom `danger` no `AppText`, componente `TextLink`, e aplicar nas telas Conta e Plano. Novos textos em pt-BR e en (`deleteHint`, confirmação sem a linha "O progresso neste aparelho continua")
- [x] 5.4 Testes passando

## 6. Apagar conta apaga tudo

- [x] 6.1 Spec ajustada: cenários "Apagar conta" e "Apagar conta sem conexão" (auth)
- [x] 6.2 Testes falhando: depois de confirmar, o progresso, as revisões, os interesses e os lembretes zeram, `cancelAll` é chamado, a fila de sync zera, o tema e o idioma continuam, e a tela de login aparece. Sem conexão, nada muda no aparelho
- [x] 6.3 Implementação: `src/auth/wipe.ts` (`wipeLocalData`) chamada em `deleteAccount()` depois da API, e o comentário de `src/auth/actions.ts` atualizado
- [x] 6.4 Testes passando

## 7. Verificação

- [x] 7.1 Conferir `src/__tests__/auth-flow.test.tsx` e `src/__tests__/sync-ui.test.tsx` (ajustar o que esperava manter o progresso ao apagar)
- [x] 7.2 `openspec validate --strict`
- [x] 7.3 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit`
