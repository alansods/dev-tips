## Context

- **API** (`api/`): Hono no Cloudflare Workers, com banco D1.
  - Login com Google, tokens próprios (`requireAuth` em `api/src/auth/middleware.ts`) e o formato único de erro de `api/src/errors.ts`.
  - Dependências que os testes trocam ficam em `api/src/deps.ts`; os testes usam Vitest com `@cloudflare/vitest-plugin`.
- **App**: Expo SDK 57, expo-router, Zustand.
  - A sessão fica em `src/auth/store.ts`, e as chamadas autenticadas com renovação automática em `src/auth/api.ts`.
  - O app funciona sem conta. A web não tem a seção Conta.
- **Decisões de produto** (ver proposal.md): Pro mensal a R$ 14,90, cota de 100 perguntas por ciclo, sem amostra grátis e admins pela variável `ADMIN_EMAILS`.

## Goals / Non-Goals

**Goals:**
- Ter uma fonte da verdade única do acesso Pro na API, resistente a um app adulterado.
- Ter uma cota consumível por qualquer recurso pago futuro (o primeiro é `add-card-assistant`), sem duplicar lógica.
- Permitir testar tudo sem lojas reais: RevenueCat e relógio entram como dependências substituíveis.

**Non-Goals:**
- Validar recibos da Apple ou do Google diretamente: o RevenueCat faz isso.
- Ter consistência forte na cota sob concorrência extrema (ver Riscos).

## Decisions

### 1. RevenueCat em vez de integrar as lojas direto
- **Escolha:** usar a SDK `react-native-purchases` no app e o webhook mais a REST API do RevenueCat na API.
- **Por quê:** nesta change só o Google Play é usado (o app sai só para Android), mas a mesma integração cobre a App Store quando o app chegar ao iPhone, sem mudar a API. O RevenueCat valida os recibos e cuida de renovação, cancelamento e reembolso, e entrega eventos normalizados.
- **Alternativa descartada:** `react-native-iap` com validação de recibos própria. Isso exigiria lidar com a Google Play Developer API e as notificações em tempo real do Play (via Pub/Sub), e refazer tudo para a App Store depois. É muito código crítico para um projeto de uma pessoa.

### 2. `app_user_id` = `user.id` da API
- **Como:** depois do login, o app chama `Purchases.logIn(user.id)`; ao sair, chama `Purchases.logOut()`. Assim, todo evento do webhook já chega com o id do nosso usuário.
- **Exigir login para assinar** evita compras feitas por um id anônimo que depois precisariam ser transferidas.

### 3. Duas formas de atualizar a assinatura: webhook e sincronização
- **Webhook** (`POST /webhooks/revenuecat`): cobre renovação, cancelamento e expiração, que acontecem com o app fechado. A autenticação compara o cabeçalho `Authorization` com o segredo `REVENUECAT_WEBHOOK_AUTH` usando comparação de tempo constante.
- **Sincronização** (`POST /me/subscription/sync`): logo após comprar ou restaurar, o app não espera o webhook. A API consulta o RevenueCat com `REVENUECAT_SECRET_KEY` e grava o resultado.
  - Endpoint previsto: `GET /v1/subscribers/{id}`, que traz a expiração do entitlement `pro` e se a renovação automática foi desligada (`unsubscribe_detected_at`). Confirmar na documentação na hora de implementar.
- **Ordem dos eventos:** cada evento traz `event_timestamp_ms`, e a API guarda o último aplicado (`last_event_at`). Eventos mais antigos são ignorados. A sincronização sempre grava, porque reflete o estado atual.
- **Usuário inexistente:** responde `200` mesmo assim. Se respondesse com erro, o RevenueCat repetiria o envio para sempre.

### 4. Modelo de dados (migration `0004_subscriptions.sql`)

```
subscriptions(user_id PK → users ON DELETE CASCADE, period_start INTEGER,
              expires_at INTEGER, will_renew INTEGER, product_id TEXT, last_event_at INTEGER)
question_usage(user_id → users ON DELETE CASCADE, period_start INTEGER, used INTEGER,
               PRIMARY KEY (user_id, period_start))
```

- **Ativa** = `expires_at` no futuro; não há coluna de status. `EXPIRATION` grava a expiração do evento, que já está no passado.
- **Ciclo:** é identificado por `period_start`, o `purchased_at_ms` da compra ou da última renovação.
  - Uma renovação traz um `period_start` novo, então o uso "zera" naturalmente: é uma linha nova, sem job de limpeza.
  - Para admins, o ciclo é o mês corrente em UTC. A contagem só existe para exibir o uso; não há limite.
- "Apagar a conta apaga a assinatura": `deleteUser` (em `api/src/db/users.ts`) passa a apagar também as duas tabelas, seguindo o padrão explícito que já existe. O `ON DELETE CASCADE` fica como segunda proteção.

### 5. Serviço de cota (`api/src/billing/quota.ts`)
Exporta duas funções que os recursos pagos chamam em volta da chamada à IA:
- `assertCanAsk(db, user, now)` lança `AppError(403, 'pro_required')` ou `AppError(429, 'quota_exceeded')`;
- `recordAnswered(db, user, now)` faz `INSERT … ON CONFLICT DO UPDATE SET used = used + 1`.

Separar verificar de registrar garante que "só conta se respondeu". Nesta change o serviço é testado diretamente. A rota do chat entra em `add-card-assistant`.

### 6. Admins
- `ADMIN_EMAILS` é uma variável em `wrangler.jsonc`, separada por vírgula.
- O e-mail vem da tabela `users`, que foi preenchida pelo token do Google, então não é algo que o cliente possa forjar.
- Não há papel de admin no banco: é mais simples e cobre o caso de um admin só. Se aparecerem vários papéis, migra-se para uma coluna.

### 7. App: `src/subscriptions/`
- `store.ts`: Zustand com o último `GET /me/subscription`, persistido no AsyncStorage para uso offline.
- `purchases.ts`: um adaptador fino sobre `react-native-purchases`, com `configure`, `logIn`, `logOut`, `getMonthlyPackage`, `purchase`, `restore` e `manageSubscriptions`. Os testes mockam este módulo, e nenhum outro arquivo importa a SDK.
- `lifecycle.ts`: `startSubscriptionLifecycle()` (montado no layout raiz) reage ao login, ao logout e à volta ao primeiro plano: liga as compras ao usuário, consulta o plano ou volta ao grátis. `useIsPro()` fica em `store.ts`.
- **Paywall:** é a rota `src/app/paywall.tsx`, em tela cheia, empilhada como as outras telas e com `animation: 'slide_from_bottom'`. O `presentation: 'fullScreenModal'` foi descartado: no iPhone real, a área segura não era aplicada dentro do modal e o botão de fechar ficava sob a barra de status. O preço vem do `product.priceString` da loja, que já vem formatado na moeda local.
- **"Gerenciar assinatura":** usa `Purchases.showManageSubscriptions()`, que abre a tela de assinaturas da loja.
- **Plataformas:** `purchases.ts` só configura a SDK no Android (`billingAvailable()`). No iOS a UI do Pro aparece, com preço fixo no paywall; "Assinar" e "Restaurar" mostram o aviso de indisponível. Na web, a UI não aparece.

### 8. Chaves e configuração
- **No app**, a chave pública do RevenueCat para Android (`goog_…`) fica em `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` (`.env` local ou perfil do EAS), no mesmo padrão das outras configurações públicas. É pública por design; sem ela, a venda fica desligada.
- **Na API**, `REVENUECAT_WEBHOOK_AUTH` e `REVENUECAT_SECRET_KEY` são segredos (`wrangler secret put`). Nunca vão para o repositório.

## Risks / Trade-offs

- **[Corrida na cota]** Duas perguntas simultâneas com 99 usadas podem passar as duas, chegando a 101. → Aceitável: o custo extra é de centavos. Se virar problema, troca-se por uma reserva atômica (`UPDATE … WHERE used < 100`) antes da chamada e uma devolução em caso de falha.
- **[Webhook atrasado ou perdido]** O usuário pagou e a API ainda não sabe. → A sincronização após a compra cobre isso. O RevenueCat também reenvia webhooks que falharam.
- **[Expo Go]** A SDK não compra de verdade no Expo Go. → O fluxo é testado com development build e testadores de licença do Google Play (compras de teste). Os testes automatizados mockam `purchases.ts`.
- **[Preço na loja ≠ R$ 14,90]** O preço exibido vem da loja, e a spec não fixa o valor na UI. → O valor é configurado no Google Play Console.

## Migration Plan

1. Aplicar a migration `0004` no D1 (`npm run db:migrate` em `api/`).
2. Configurar os segredos e `ADMIN_EMAILS`, depois fazer o deploy da API.
3. Criar o produto mensal no Google Play Console e o entitlement `pro` e a offering no RevenueCat. Apontar o webhook para `https://<api>/webhooks/revenuecat` com o segredo.
4. Gerar o build do app com a SDK.

**Rollback:** a migration só cria tabelas novas. Reverter o deploy da API e do app não afeta dados existentes.

## Open Questions

- Endereço público final da API, para configurar o webhook. Não muda specs nem tarefas.
