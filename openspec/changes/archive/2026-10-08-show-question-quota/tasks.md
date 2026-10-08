## 1. Base: cálculo da cota e barra com alerta

- [x] 1.1 Escrever testes de `quotaStatus` (grátis e admin → `null`; 37 → normal com 63 restantes; 80 e 86 → low; 100 → out) e confirmar que falham
- [x] 1.2 Criar `src/subscriptions/quota.ts` com `quotaStatus` e mover o formatador de data para `src/subscriptions/format.ts`
- [x] 1.3 Adicionar `tone: 'accent' | 'warn'` ao `src/components/ProgressBar.tsx`, mantendo `accent` como padrão
- [x] 1.4 Rodar os testes e confirmar que passam

## 2. Paywall

- [x] 2.1 Ajustar os testes do requisito "Paywall" (cenários "Conteúdo" e "Como a cota funciona") e confirmar que falham
- [x] 2.2 Adicionar os textos da cota em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`, e os ícones que faltarem em `src/components/icons`
- [x] 2.3 Redesenhar o cartão do plano em `src/app/paywall.tsx` (destaque "100" e três linhas sobre a cota) e colocá-lo antes dos benefícios
- [x] 2.4 Rodar os testes e confirmar que passam

## 3. Linha Dev Tips Pro no Perfil

- [x] 3.1 Escrever os testes do requisito "Linha Dev Tips Pro no Perfil" (grátis, uso normal, quase no fim, última pergunta, esgotada, renovação desligada, admin, uso atualizado pelo chat, iOS); confirmar que falham
- [x] 3.2 Criar `src/subscriptions/QuotaMeter.tsx`
- [x] 3.3 Atualizar `src/settings/ProRow.tsx` para os três casos (grátis, assinante, admin), com a cor de alerta, o fundo de esgotada e o `accessibilityLabel` com o uso
- [x] 3.4 Rodar os testes e confirmar que passam

## 4. Bloco Plano na tela Conta

- [x] 4.1 Ajustar os testes do requisito "Conta no app" (assinante, uma pergunta restante, renovação desligada, iOS) e confirmar que falham
- [x] 4.2 Redesenhar o bloco do assinante em `src/subscriptions/PlanCard.tsx`: restantes em destaque, barra, "<usadas> / 100 usadas", "Zera em <data>" e o quadro "Como a cota funciona"
- [x] 4.3 Rodar os testes e confirmar que passam

## 5. Verificação

- [x] 5.1 Rodar `openspec validate show-question-quota --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
