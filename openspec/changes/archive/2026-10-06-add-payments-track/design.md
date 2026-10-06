## Context

Formato e testes iguais às trilhas anteriores da série. A trilha usa o framework `react-native` na área Mobile, como a trilha "React Native", então aparece em Mobile › JavaScript › React Native sem mudar código.

## Goals / Non-Goals

**Goals:**
- Cobrir, no nível de entrevista, quando a compra precisa passar pela loja (IAP) e quando não pode, os tipos de produto, comissões e mudanças recentes por país.
- Cobrir a implementação de IAP num app Expo com RevenueCat e o caminho de um pagamento de bem físico: gateway, Pix, webhook e idempotência.

**Non-Goals:**
- Passo a passo dos consoles das lojas e de cada gateway.
- O plano Pro do próprio Dev Tips.

## Decisions

### 1. Framework React Native, só no Mobile
Escolhido pelo usuário. O foco é o app mobile; o backend aparece como parte do fluxo de pagamento.
*Alternativa descartada:* trilha direta na área Mobile, que fugiria do padrão por linguagem da área.

### 2. Regras das lojas com data
As regras mudam por país e por decisões judiciais e regulatórias. Os cards explicam a regra geral (bens digitais usam a compra da loja; bens físicos e serviços consumidos fora do app não podem usá-la) e citam as exceções recentes como exemplos datados: links externos nos EUA, alternativas na União Europeia e, no Brasil, o acordo da Apple com o CADE (vigente desde junho de 2026, com taxa menor para links externos e pagamentos de terceiros). A recomendação é sempre conferir as diretrizes atuais.

### 3. RevenueCat como exemplo de IAP
A doc do Expo indica `react-native-purchases` (RevenueCat) e `expo-iap`. Os snippets usam o RevenueCat (`Purchases.configure`, `getOfferings`, `purchasePackage`, `customerInfo.entitlements.active`, `restorePurchases`), e o card de development build explica que o Expo Go só simula compras.

### 4. Backend em TypeScript genérico
Os snippets de backend usam o SDK do Stripe (`paymentIntents.create` com chave de idempotência, `webhooks.constructEvent`) e o `@stripe/stripe-react-native` no app (`initPaymentSheet`, `presentPaymentSheet`), por serem os mais conhecidos e citados na doc do Expo. Pix e Mercado Pago aparecem nos conceitos.

### 5. Plano de cards (24)
Níveis: J = júnior, P = pleno, S = sênior.

| Deck | Cards |
|---|---|
| Compras dentro do app | concept: Compra dentro do app (J) · Bens digitais e bens físicos (P) · Tipos de produto (J) · Comissões e regras por país (S) — code: Decidir o meio de pagamento (P) · Produtos e direitos no código (P) |
| IAP no Expo | concept: RevenueCat (P) · Offerings e entitlements (P) · Development build e sandbox (P) · Restaurar compras (P) — code: Paywall com offerings (P) · Conferir acesso e restaurar (P) |
| Pagamentos e backend | concept: Gateway de pagamento (P) · Pix (P) · Webhook como fonte da verdade (S) · Idempotência (S) — code: Cobrança no app com o Payment Sheet (P) · Webhook verificado e idempotente (S) |
| Perguntas de entrevista | Por que um app de delivery não usa a compra da loja? (J) · Onde validar uma compra? (P) · Como testar pagamentos sem cobrar de verdade? (P) · Assinatura cancelada: quando cortar o acesso? (P) · Pix: como saber que foi pago? (P) · Como garantir que um pedido não seja cobrado duas vezes? (S) |

### 6. Critério de nível
O mesmo das changes anteriores.

## Risks / Trade-offs

- [Regras e taxas das lojas mudam rápido] → Cards com a regra geral, exceções datadas e a orientação de conferir as diretrizes atuais.
- [Exatidão técnica não é coberta por teste] → Consulta à doc antes de escrever e revisão no PR.
