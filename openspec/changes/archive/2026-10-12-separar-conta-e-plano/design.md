## Context

Hoje a rota `/account` (`src/app/account.tsx`) renderiza o perfil da conta, o `PlanCard`, a sincronização e as ações Sair/Apagar. `ProRow` manda o Pro para `/account`. O `Button` tem as variantes `primary`, `secondary` e `warn`. A `warn` (fundo `warnSoft`, borda e texto `warn`) é usada em "Apagar conta", "Zerar progresso" e "Não sei". O tema tem só a cor de alerta (`warn`), sem uma cor destrutiva. Motivação em proposal.md.

## Goals / Non-Goals

**Goals:**
- Uma tela por assunto, reaproveitando o `PlanCard` sem duplicar lógica.
- Uma cor destrutiva no tema, nos modos claro e escuro, usada só onde a ação apaga algo de forma irreversível.
- Apagar a conta deixa o aparelho como no primeiro uso, menos tema e idioma.

**Non-Goals:**
- Migrar "Zerar progresso" para a nova cor (fica para outra change).
- Redesenhar o `PlanCard`.

## Decisions

1. **Rota nova `src/app/plan.tsx` em vez de parâmetro em `/account`** (ex.: `/account?section=plan`). Uma rota por tela segue o Expo Router (cada arquivo em `src/app/` é uma tela), deixa os testes de navegação simples (`toHavePathname('/plan')`) e evita um `if` que mistura as duas telas. A Plano copia o cabeçalho da Conta (Voltar + título), que é pequeno. Extrair um componente `ScreenHeader` só por duas telas não compensa agora.

2. **O título "Plano" sai do `PlanCard` e vai para o cabeçalho da tela.** O `PlanCard` era um bloco dentro da Conta, com `SectionTitle` próprio. Como tela única, o título repetido ("Plano" no cabeçalho e de novo na seção) seria redundante. O `PlanCard` passa a ter só o cartão, e o único lugar que o usa é `/plan`.

3. **Tokens `danger`/`onDanger` separados de `warn`.** `warn` sinaliza atenção (cota perto do fim, sincronização com problema, "Não sei"). Pintar tudo isso de vermelho deixaria o app alarmista. Valores: claro `#C62828` com texto `#FFFFFF` (contraste ~5,6:1); escuro `#FF6B6B` com texto `#1A0A0A` (branco sobre `#FF6B6B` não passa no AA). Alternativa descartada: trocar o valor de `warn` para vermelho, porque mudaria a cota e a sincronização.

4. **Três estilos de botão novos no `Button`, por peso da ação**, todos usando tokens do tema:
   - `danger`: preenchido com `danger` e texto `onDanger`. Só na confirmação "Apagar minha conta", o momento de decidir de verdade.
   - `dangerOutline`: fundo `surface`, texto e borda `danger`. Usado em "Sair", que é reversível, então o vermelho avisa sem assustar.
   - `accentOutline`: fundo `surface`, texto `accentText` e borda `accent`. Usado em "Gerenciar assinatura". Azul preenchido chamaria para "comprar" e empurraria para o cancelamento.
   - Link de texto (`TextLink` em `src/components/`): `Pressable` com área de toque ≥44px, sem fundo nem borda, com o `tone` do `AppText`. Usado em "Apagar conta" (tom `danger`, um novo tom do `AppText`) e em "Restaurar compras" (`muted`, sublinhado). Alternativa descartada: uma variante `link` no `Button`, porque o `Button` tem `flex: 1` e altura de 48px pensados para botões cheios, e um link centralizado e menor fica mais limpo como componente próprio.

5. **Largura total.** O `Button` tem `flex: 1` e, sozinho numa linha (`flexDirection: 'row'`), já ocupa a largura toda. "Sair" e "Gerenciar assinatura" seguem assim.

6. **Apagar tudo no aparelho com uma função `wipeLocalData()`** (`src/auth/wipe.ts`), chamada por `deleteAccount()` só depois do `DELETE /me` dar certo (ou `401`):
   - estudo: `resetStudyStore()` (progresso, revisões, sequência, "continue de onde parou", aba preferida);
   - sincronização: volta o store ao estado inicial (inclui a fila `pendingCards`/`pendingSettings`), para nada subir para outra conta que entre depois;
   - configurações: zera `interests` e `onboardingSeen`, mantendo `language`. Com `onboardingSeen` falso, o layout das abas já redireciona para `/login`, que é o "primeiro uso";
   - lembretes: `resetRemindersStore()` e `cancelAll()` das notificações;
   - plano: já volta para grátis pelo fluxo atual de saída (`purchasesLogOut` e o store de assinatura);
   - sessão: `endLocalSession()`, como hoje;
   - tema: fica no AsyncStorage próprio (`dev-tips:color-scheme`) e não é tocado.

   Os stores são zerados com `setState`, e o `persist` do Zustand grava o estado vazio. Alternativa descartada: `AsyncStorage.clear()`, que apagaria também o tema e o idioma e deixaria os stores em memória desatualizados até reabrir o app.

## Risks / Trade-offs

- [Link antigo ou estado de navegação apontando para `/account` esperando o plano] → Não há deep links públicos para `/account`. A Conta continua existindo, só sem o bloco.
- [Usuário Pro procurando "Gerenciar assinatura" na Conta, onde estava antes] → A linha "Dev Tips Pro", logo abaixo da conta no Perfil, leva direto ao Plano. A mudança é pequena e esperada.
- [Falha no meio da limpeza local depois de a API já ter apagado] → Cada store usa o `safeStorage`, que tolera erro de escrita. No pior caso, sobra algum dado local de uma conta que não existe mais, sem quebrar o app. Na próxima vez que a pessoa tocar em "Zerar", ele some.
- [Usuário que só queria sair e toca em Apagar] → "Apagar conta" é um link discreto, e a confirmação avisa em texto que o progresso no aparelho também será apagado.
- [`/plan` sem sessão (grátis sem conta não chega lá pela UI)] → Redireciona para `/profile`, igual à Conta.
