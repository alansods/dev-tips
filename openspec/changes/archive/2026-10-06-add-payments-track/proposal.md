## Why

Apps como o de uma plataforma de delivery cobram por produtos físicos (pedidos) e, às vezes, vendem assinaturas digitais, e cada caso tem regras diferentes nas lojas. Entrevistas de mobile cobram quando a compra precisa passar pela Apple e pelo Google, como implementar compras no app com Expo e como o backend confirma um pagamento com segurança. O catálogo não cobre nada disso. Esta é a sexta trilha da série que cobre as lacunas de uma vaga de frontend sênior.

## What Changes

- Trilha nova **Pagamentos no app** (`pagamentos-no-app`), com 24 cards em PT-BR e tradução completa para inglês, no mesmo formato das trilhas existentes:
  - **Compras dentro do app:** compra dentro do app (IAP), bens digitais e bens físicos, tipos de produto e comissões e regras por país.
  - **IAP no Expo:** RevenueCat, offerings e entitlements, development build e sandbox, restaurar compras.
  - **Pagamentos e backend:** gateway de pagamento, Pix, webhook como fonte da verdade e idempotência.
  - **Perguntas de entrevista.**
- A trilha fica no framework React Native, na área Mobile, depois da trilha "React Native":
  - Mobile › JavaScript › React Native passa a listar 2 trilhas.

## Capabilities

### New Capabilities

- `payments-content`: a trilha "Pagamentos no app", com a posição na navegação, os decks e as contagens, o conteúdo autoral, a ligação com o glossário, a mistura de níveis e a tradução.

### Modified Capabilities

- `mobile-content`: a área Mobile passa a contar 6 trilhas em JavaScript, e Mobile › JavaScript mostra React Native com 2 trilhas.

## Impact

- `content/tracks/pagamentos-no-app/track.json` e `translations/en.json`, registrados em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes novos: `src/content/__tests__/payments-track.test.ts` e `src/__tests__/payments-navigation.test.tsx`. Ajuste das contagens em `mobile-navigation.test.tsx`.
- README: lista de trilhas.
- Sem mudança no schema, nas telas, na navegação, na API ou nos dados salvos.

## Fora de escopo

- Pagamentos do próprio Dev Tips (plano Pro): esta trilha é só conteúdo de estudo.
- Detalhes de cada gateway (todas as APIs do Stripe, do Mercado Pago, etc.), antifraude, split de pagamento e emissão de nota fiscal.
- Configuração passo a passo do App Store Connect e do Google Play Console.
- As demais trilhas da série, cada uma num change próprio.
