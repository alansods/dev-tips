## Why

O próximo recurso do Dev Tips, o chat "Perguntar" no card (change `add-card-assistant`), chama um modelo de IA (Gemini Flash), e cada resposta tem custo. Para oferecer esse recurso com lucro e sem risco de gasto descontrolado, o app precisa de um plano pago com uma cota de uso, e a API precisa saber, de forma confiável, quem pode usar o recurso.

## What Changes

- Novo plano **Dev Tips Pro**: assinatura mensal de R$ 14,90 com cota de **100 perguntas por ciclo** de assinatura. Não há plano anual, teste grátis nem amostra grátis no lançamento.
- Cobrança pelo **Google Play** (só Android nesta change), feita no app pela SDK do **RevenueCat**, que já suporta a App Store para quando o app for lançado no iPhone. Para assinar, o usuário precisa estar logado. A assinatura fica ligada ao `user.id` da conta.
- A **API é a fonte da verdade** do acesso Pro:
  - um webhook do RevenueCat atualiza o estado da assinatura no D1;
  - uma rota de sincronização permite ao app pedir atualização logo após a compra ou a restauração.
- A API passa a ter uma **cota de perguntas** por usuário e por ciclo. O consumo da cota fica disponível como serviço interno para o chat. A rota `GET /me/subscription` mostra plano, renovação e uso.
- **Admins** (e-mails na variável `ADMIN_EMAILS` da API) têm acesso Pro sem pagar e sem cota.
- No app:
  - tela de **paywall** "Travou num card? Pergunte." com o plano Pro mensal, "Assinar o Pro", "Restaurar compras", "Termos" e "Privacidade";
  - linha **"Dev Tips Pro"** em Ajustes, que abre o paywall;
  - bloco **"Plano"** na tela Conta, com plano, renovação, uso "N / 100", "Gerenciar assinatura" e "Restaurar compras".
- Telas aprovadas no design: https://claude.ai/artifact/G1pWELAgvYJHWZYLngHjZ2 (telas 8 e 10; as telas 7 e 9 entram em `add-card-assistant`).

## Capabilities

### New Capabilities
- `subscriptions`: plano Pro e estado da assinatura na API, com webhook do RevenueCat, sincronização, acesso de admin, cota de perguntas e `GET /me/subscription`. No app: paywall, compra, restauração e a linha "Dev Tips Pro" em Ajustes.

### Modified Capabilities
- `auth`: a tela "Conta" ganha o bloco "Plano" (estado da assinatura, uso da cota, "Gerenciar assinatura" e "Restaurar compras").

## Fora de escopo

- O chat "Perguntar" em si: botão no card, selo PRO, sheet do chat e tela de cota atingida. Ficam na change `add-card-assistant`, que consome a cota criada aqui.
- Plano anual, créditos avulsos, teste grátis e amostra grátis.
- Venda no iOS pela App Store: por enquanto, o iPhone mostra o Pro (linha, paywall e bloco Plano), mas ao tentar assinar aparece o aviso de que ainda não está disponível. A venda pela App Store (via RevenueCat) e o Login com Apple serão uma change própria.
- Assinatura na versão web do app (a web não tem a seção Conta).
- Telas de administração e relatórios de receita (o painel do RevenueCat cobre isso).

## Impact

- **API (`api/`)**:
  - nova migration com as tabelas `subscriptions` e `question_usage`;
  - novas rotas `POST /webhooks/revenuecat`, `POST /me/subscription/sync` e `GET /me/subscription`;
  - novos segredos: `REVENUECAT_WEBHOOK_AUTH` e `REVENUECAT_SECRET_KEY`. Nova variável: `ADMIN_EMAILS`;
  - `DELETE /me` passa a apagar também assinatura e uso.
- **App**:
  - dependência `react-native-purchases`, instalada com `npx expo install`. Exige development build, porque o Expo Go só roda em modo de visualização;
  - nova pasta `src/subscriptions/` e rota `src/app/paywall.tsx`;
  - mudanças em Ajustes e na tela Conta;
  - chaves públicas do RevenueCat em `app.config.ts`.
- **Externo**:
  - produto de assinatura mensal criado no Google Play Console;
  - projeto no RevenueCat com o entitlement `pro`, a offering padrão e o webhook apontando para a API.
