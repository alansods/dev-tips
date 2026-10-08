## Context

O app já recebe tudo o que precisa de `GET /me/subscription`: `plan`, `source`, `expiresAt`, `willRenew` e `questions: { used, limit }`. Essa resposta fica no `useSubscriptionStore` e é guardada no aparelho. O chat já atualiza `questions` depois de cada resposta. Hoje, a linha "Dev Tips Pro" ([src/settings/ProRow.tsx](../../../src/settings/ProRow.tsx)) só lê `useIsPro()`, e o uso aparece só em [src/subscriptions/PlanCard.tsx](../../../src/subscriptions/PlanCard.tsx). O design aprovado está no canvas "Cota de perguntas do plano" e usa as cores e as fontes do app. Motivação: ver proposal.md.

## Goals / Non-Goals

**Goals:**
- Mostrar a cota no paywall, no Perfil e na Conta a partir de um único cálculo, para os três lugares nunca divergirem.
- Funcionar nos temas claro e escuro só com os tokens existentes.

**Non-Goals:**
- Nenhuma mudança na API nem no formato da resposta.

## Decisions

**1. Um helper puro, `quotaStatus(plan)`, em `src/subscriptions/quota.ts`.**
- Ele devolve `{ used, limit, left, ratio, level: 'normal' | 'low' | 'out' }`, ou `null` para grátis e admin.
- `low` vale a partir de 80% de uso, e `out` quando `used >= limit`.
- O Perfil e a Conta usam esse helper, e assim a regra dos 80% fica num lugar só e é testada sem precisar renderizar nada.
- Alternativa descartada: calcular dentro de cada componente. Duplicaria a regra e os testes.

**2. Um componente `QuotaMeter` em `src/subscriptions/QuotaMeter.tsx`, usado pelo `ProRow`.**
- Desenha o rótulo, o `x / 100`, a barra e o texto de restantes. A Conta tem um layout próprio (número grande), então só compartilha o helper e a barra.
- Alternativa descartada: um componente único com variantes "compacto" e "grande". Os layouts diferem demais, e as variantes virariam um monte de `if`.

**3. O `ProgressBar` ganha uma prop `tone?: 'accent' | 'warn'`, com `accent` como padrão.**
- As barras de progresso de estudo continuam iguais. A cor de alerta vem de `colors.warn`, que já tem contraste nos dois temas.
- Alternativa descartada: uma barra nova só para a cota. Repetiria trilho, arredondamento e acessibilidade (`accessibilityRole="progressbar"` e `accessibilityValue`), que o `ProgressBar` já tem.

**4. O `ProRow` passa a ler o `plan` do store**, e não só `useIsPro()`.
- Grátis: o texto atual, sem mudança. Admin (`source === 'admin'`): "Pro (admin)" e "Perguntas sem limite". Assinante: o `QuotaMeter`.
- A linha continua sendo um `Pressable` com `accessibilityRole="button"`. O `accessibilityLabel` passa a incluir o uso, por exemplo "Dev Tips Pro, 37 de 100 perguntas usadas".

**5. As datas usam o mesmo formato do `PlanCard` hoje** (`toLocaleDateString` com `timeZone: 'UTC'`, ou seja, "12/11/2026"). Esse formatador sai do `PlanCard` para `src/subscriptions/format.ts`, para o `ProRow` reaproveitar.

**6. Paywall:** o cartão do plano ganha um bloco em `accentSoft` com "100" em fonte mono e as três linhas sobre a cota, com ícones de traço (`RefreshIcon`, `CheckIcon`, `ChartIcon`). Ícones que ainda não existirem em `src/components/icons` são criados no mesmo padrão dos atuais. O cartão sobe para logo abaixo do título, e os três benefícios vêm depois dele.
- Diferença em relação ao canvas: o canvas mostra só dois benefícios porque a tela era fixa em 844 px. O app mantém os três, porque a tela rola.

**7. Os textos novos ficam em `t.pro` (pt-BR e en).** `rowFree` continua igual. Strings com número viram funções, como `left(n)`, que trata o singular.

## Risks / Trade-offs

- [O plano guardado fica velho, e o Perfil mostra um uso desatualizado] → O app já atualiza o plano ao voltar para o primeiro plano e depois de cada resposta. Não há mudança aqui.
- [A borda e o fundo de alerta no tema escuro ficam fortes demais] → Usar `warn` só na borda e `warnSoft` só no fundo do estado esgotado, e revisar nos dois temas no aparelho.
- [O paywall ficou mais alto em telas pequenas] → Ele já rola e o rodapé com "Assinar o Pro" é fixo, então o botão continua visível.
