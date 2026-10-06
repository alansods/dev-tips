# Assinatura Pro: configuração (Google Play + RevenueCat)

Passo a passo para colocar o plano **Dev Tips Pro** no ar (change `add-subscriptions`). Nesta versão a venda é só no **Android**, pelo Google Play. O app e a API já estão prontos; o que falta é configurar os serviços externos.

Os nomes de menus dos painéis mudam com o tempo. Se algo não bater, siga a documentação oficial do [RevenueCat](https://www.revenuecat.com/docs) e do [Google Play Console](https://support.google.com/googleplay/android-developer).

## Como as peças se encaixam

```
App (Android) ──compra──▶ Google Play ──recibo──▶ RevenueCat ──webhook──▶ API (/webhooks/revenuecat)
      │                                                ▲                         │
      └──── POST /me/subscription/sync ────────────────┘ (API consulta)          ▼
                                                                         D1: subscriptions, question_usage
```

- O app chama `Purchases.logIn(user.id)` depois do login, então o RevenueCat conhece cada assinante pelo **id do usuário da API**.
- A **API decide** quem é Pro. O app só mostra o que a API responde em `GET /me/subscription`.
- E-mails em `ADMIN_EMAILS` são Pro sem pagar e sem cota.

## 1. Google Play Console

1. O app precisa já ter sido enviado a uma faixa de teste (por exemplo, **teste interno**). O Play só deixa criar assinaturas depois do primeiro envio. O pacote é `dev.devtips.app`.
2. Em **Monetizar › Produtos › Assinaturas**, crie a assinatura com o id **`pro_monthly`**, com um plano base mensal de renovação automática a **R$ 14,90**.
3. Em **Configurações › Teste de licença**, adicione a sua conta Google. Com ela, as compras são de teste e não cobram de verdade.
4. Crie uma conta de serviço do Google Cloud com acesso ao Play Console, para o RevenueCat validar os recibos. O RevenueCat tem um guia para isso ("Google Play service credentials").

## 2. RevenueCat

1. Crie um projeto e adicione um app **Google Play** com o pacote `dev.devtips.app` e as credenciais da conta de serviço.
2. **Entitlement:** crie um com o id **`pro`**. A API procura exatamente esse nome.
3. **Produto:** importe ou adicione `pro_monthly` e ligue-o ao entitlement `pro`.
4. **Offering:** crie a offering padrão (marcada como _current_) com um pacote **Monthly** apontando para `pro_monthly`. O paywall usa `offerings.current.monthly`.
5. **Chaves de API:**
   - a **chave pública do Android** (começa com `goog_`) vai para o app, na variável `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`;
   - a **chave secreta** (começa com `sk_`) vai para a API, no segredo `REVENUECAT_SECRET_KEY`. Nunca coloque essa chave no app nem no Git.
6. **Webhook** (Integrations › Webhooks):
   - URL: `https://<endereço da API>/webhooks/revenuecat`;
   - Authorization header: um valor aleatório longo, o mesmo que vai no segredo `REVENUECAT_WEBHOOK_AUTH` da API;
   - depois de salvar, use o botão de evento de teste. A API deve responder `200`.

## 3. API (Cloudflare Workers)

Rode os comandos dentro de `api/`:

```bash
npm run db:migrate                                  # aplica a migration 0004 no D1
npx wrangler secret put REVENUECAT_WEBHOOK_AUTH     # o mesmo valor do webhook
npx wrangler secret put REVENUECAT_SECRET_KEY       # a chave sk_ do RevenueCat
```

- Em `wrangler.jsonc`, preencha `ADMIN_EMAILS` com o seu e-mail. Para mais de um, separe por vírgula.
- Depois, faça o deploy com `npm run deploy`.
- Para rodar a API localmente, copie os mesmos nomes para `api/.dev.vars` (veja `api/.dev.vars.example`).

## 4. App

1. Coloque `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` no `.env` local (veja `.env.example`) e no ambiente do EAS. Sem essa chave, a venda fica desligada e o botão "Assinar o Pro" não habilita.
2. A SDK do RevenueCat tem código nativo. No **Expo Go** ela não compra de verdade, então use um development build:
   ```bash
   npx expo run:android
   # ou na nuvem:
   npx eas-cli@latest build --profile development --platform android
   ```
3. Instale o build num aparelho com a conta de teste de licença. Depois:
   - entre na conta e abra **Ajustes › Dev Tips Pro › Assinar o Pro**;
   - confira na tela Conta que aparece "Pro mensal · Ativo".

## Conferência rápida

| Sintoma                                    | Causa provável                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| "Assinar o Pro" sempre desabilitado        | Falta `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`, ou não há offering _current_ com pacote Monthly |
| Comprou, mas a Conta mostra "Plano grátis" | A sincronização falhou (`502 billing_unavailable`): confira `REVENUECAT_SECRET_KEY`         |
| Webhook responde `401`                     | O Authorization header do painel é diferente de `REVENUECAT_WEBHOOK_AUTH`                   |
| Admin não vira Pro                         | O e-mail em `ADMIN_EMAILS` não é o mesmo da conta Google usada no login                     |
