## Why

No Android, tocar em "Gerenciar assinatura" na tela Conta não faz nada. A spec já diz que o botão abre o gerenciamento de assinaturas do Google Play, mas nenhum cenário cobria o toque, e o bug passou. Sem esse caminho, o assinante não acha de dentro do app como cancelar.

## What Changes

- Novo cenário no requisito "Conta no app": no Android, "Gerenciar assinatura" abre a página de assinaturas do Google Play do Dev Tips, onde o usuário pode cancelar.
- Correção: o app abre essa página direto, sem depender da função da biblioteca de compras que só existe no iOS.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `auth`: cenário que reproduz o bug do botão "Gerenciar assinatura" no Android.

## Impact

- App: `src/subscriptions/purchases.ts`.
- Testes: novo `src/subscriptions/__tests__/purchases.test.ts` e um caso em `src/__tests__/subscriptions-ui.test.tsx`.
- API e banco: nada muda.

## Fora de escopo

- Cancelar a assinatura de dentro do app: o cancelamento continua sendo feito no Google Play.
- Gerenciar assinatura no iOS, onde o Pro ainda não é vendido.
