## Context

`Purchases.showManageSubscriptions()` do `react-native-purchases` só funciona no iOS: no Android, ela lança `UnsupportedPlatformError`. Em `manageSubscriptions()` (`src/subscriptions/purchases.ts`) o erro era engolido por `.catch(() => {})`, então o toque não fazia nada.

## Goals / Non-Goals

**Goals:** abrir no Android a página de assinaturas do Google Play, já na assinatura do Dev Tips.

**Non-Goals:** o iOS, onde o Pro ainda não é vendido e o botão nem aparece.

## Decisions

1. **Abrir o link oficial do Google Play com `Linking.openURL`:** `https://play.google.com/store/account/subscriptions?sku=pro_monthly&package=dev.devtips.app`. O Android entrega esse link ao app da Play Store, que abre direto na assinatura, com a opção de cancelar.
   - Alternativa descartada: `customerInfo.managementURL` do RevenueCat. Exige uma chamada de rede e pode vir `null`, enquanto o link do Play é fixo e documentado pelo Google.
2. **O id do produto e o pacote ficam em constantes em `purchases.ts`,** o único arquivo que conhece a loja: `pro_monthly`, o mesmo do Play Console, e `dev.devtips.app`, o mesmo de `app.json`.
3. **Teste unitário de `purchases.ts`.** Os testes de UI mocam o módulo inteiro e por isso não pegaram o bug. Um teste do próprio módulo, com a biblioteca de compras mocada, garante o link certo.

## Risks / Trade-offs

- [Se o id `pro_monthly` mudar no Play Console, o link abre a lista geral de assinaturas em vez da assinatura certa] → o id não pode mudar no Play (é permanente), e a lista geral ainda permite cancelar.
