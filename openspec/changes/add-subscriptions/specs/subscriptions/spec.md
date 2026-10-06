## Purpose
Define o plano pago Dev Tips Pro: como a assinatura é comprada no Google Play, como a API sabe quem é Pro, a cota mensal de perguntas que os recursos de IA consomem e as telas do app para assinar e restaurar.

## ADDED Requirements

### Requirement: Acesso Pro
Um usuário SHALL ser Pro quando tem uma assinatura ativa, ou seja, com data de expiração no futuro, ou quando o e-mail dele está na lista `ADMIN_EMAILS` da API. A comparação do e-mail MUST ignorar maiúsculas e minúsculas. Um usuário sem conta ou sem assinatura ativa SHALL ser do plano grátis. Os recursos pagos MUST ser liberados só pela API, nunca por uma decisão apenas do app.

#### Scenario: Assinatura ativa
- **WHEN** o usuário tem uma assinatura com expiração daqui a 10 dias
- **THEN** a API trata o usuário como Pro

#### Scenario: Assinatura expirada
- **WHEN** a assinatura do usuário expirou ontem
- **THEN** a API trata o usuário como plano grátis

#### Scenario: Admin sem pagar
- **WHEN** `ADMIN_EMAILS` contém "Admin@Exemplo.com" e o usuário logado tem o e-mail "admin@exemplo.com", sem assinatura
- **THEN** a API trata o usuário como Pro

### Requirement: Webhook do RevenueCat
`POST /webhooks/revenuecat` SHALL aceitar só requisições com o cabeçalho `Authorization` igual ao segredo configurado. Sem o cabeçalho ou com outro valor, SHALL responder `401` com o código `unauthorized`. Com um evento válido cujo `app_user_id` é o id de um usuário existente, a API SHALL atualizar a assinatura desse usuário:
- `INITIAL_PURCHASE`, `RENEWAL`, `UNCANCELLATION` e `PRODUCT_CHANGE` deixam a assinatura ativa até `expiration_at_ms`, com renovação automática ligada;
- `CANCELLATION` mantém a assinatura ativa até `expiration_at_ms`, com renovação automática desligada;
- `EXPIRATION` encerra a assinatura.

Eventos de outros tipos, de usuários inexistentes ou mais antigos (`event_timestamp_ms`) que o último evento já aplicado SHALL ser ignorados. Em todos os casos autorizados com corpo válido, a resposta SHALL ser `200`; um corpo malformado SHALL receber `400` com o código `invalid_body`.

#### Scenario: Segredo errado
- **WHEN** o webhook chega com `Authorization` diferente do segredo configurado
- **THEN** a resposta é `401` com `error.code` igual a `unauthorized`, e nada muda

#### Scenario: Corpo malformado
- **WHEN** o webhook chega com o segredo certo e um corpo sem `event`
- **THEN** a resposta é `400` com `error.code` igual a `invalid_body`

#### Scenario: Primeira compra
- **WHEN** chega um `INITIAL_PURCHASE` do usuário U com expiração daqui a 30 dias
- **THEN** a resposta é `200`, e U passa a ser Pro com renovação daqui a 30 dias

#### Scenario: Cancelamento mantém até o fim do período
- **WHEN** U é Pro até daqui a 12 dias e chega um `CANCELLATION`
- **THEN** U continua Pro até daqui a 12 dias, com renovação automática desligada

#### Scenario: Expiração
- **WHEN** chega um `EXPIRATION` de U
- **THEN** U passa a ser do plano grátis

#### Scenario: Evento fora de ordem
- **WHEN** já foi aplicado um `RENEWAL` de U e chega depois um `INITIAL_PURCHASE` com `event_timestamp_ms` anterior
- **THEN** a resposta é `200`, e a assinatura continua como o `RENEWAL` deixou

#### Scenario: Usuário inexistente
- **WHEN** chega um evento com um `app_user_id` que não é de nenhum usuário
- **THEN** a resposta é `200`, e nenhuma assinatura é criada

### Requirement: Sincronizar assinatura
`POST /me/subscription/sync` (rota protegida) SHALL consultar o RevenueCat sobre o usuário da sessão, atualizar a assinatura dele na API e responder `200` com o mesmo corpo de `GET /me/subscription`. Se o RevenueCat não responder ou responder com erro, a rota SHALL responder `502` com o código `billing_unavailable` e manter a assinatura como estava.

#### Scenario: Depois da compra
- **WHEN** o usuário acabou de assinar, o webhook ainda não chegou, e o app chama a sincronização
- **THEN** a resposta é `200` com `plan` igual a `pro`

#### Scenario: RevenueCat fora do ar
- **WHEN** o RevenueCat responde com erro `500`
- **THEN** a resposta é `502` com `error.code` igual a `billing_unavailable`, e a assinatura não muda

### Requirement: Consultar plano e uso
`GET /me/subscription` (rota protegida) SHALL responder `200` com `{ "plan", "source", "expiresAt", "willRenew", "questions": { "used", "limit" } }`:
- `plan` é `free` ou `pro`;
- `source` é `store`, `admin` ou `null`;
- `expiresAt` é a data de fim do período atual (ISO 8601) ou `null`;
- `willRenew` diz se a renovação automática está ligada;
- `questions.limit` é `100` para assinantes, `null` para admin (sem cota) e `0` no plano grátis.

#### Scenario: Plano grátis
- **WHEN** um usuário sem assinatura chama a rota
- **THEN** a resposta tem `plan` igual a `free`, `source` igual a `null` e `questions` igual a `{ "used": 0, "limit": 0 }`

#### Scenario: Assinante
- **WHEN** um assinante que já usou 30 perguntas no ciclo atual chama a rota
- **THEN** a resposta tem `plan` igual a `pro`, `source` igual a `store`, `willRenew` igual a `true` e `questions` igual a `{ "used": 30, "limit": 100 }`

#### Scenario: Admin
- **WHEN** um admin sem assinatura chama a rota
- **THEN** a resposta tem `plan` igual a `pro`, `source` igual a `admin`, `expiresAt` igual a `null` e `questions.limit` igual a `null`

### Requirement: Cota de perguntas
Cada assinante SHALL ter 100 perguntas por ciclo. O ciclo é o período atual da assinatura, que começa na compra ou na última renovação e termina na expiração. Quando um recurso pago da API recebe uma pergunta:
- de um usuário do plano grátis, SHALL recusá-la com `403` e o código `pro_required`;
- de um assinante que já usou 100 perguntas no ciclo, SHALL recusá-la com `429` e o código `quota_exceeded`;
- em ambos os casos, MUST NOT chamar o modelo de IA.

Uma pergunta SHALL contar na cota só quando for respondida com sucesso. Uma renovação SHALL começar um ciclo novo, com uso zerado. Admins MUST NOT ter limite.

#### Scenario: Plano grátis
- **WHEN** um usuário do plano grátis faz uma pergunta
- **THEN** ela é recusada com `403` e `error.code` igual a `pro_required`, e o modelo de IA não é chamado

#### Scenario: Cota esgotada
- **WHEN** um assinante com 100 perguntas usadas no ciclo faz mais uma pergunta
- **THEN** ela é recusada com `429` e `error.code` igual a `quota_exceeded`, e o modelo de IA não é chamado

#### Scenario: Falha não consome
- **WHEN** um assinante com 30 perguntas usadas faz uma pergunta e a resposta da IA falha
- **THEN** o uso continua em 30

#### Scenario: Renovação zera
- **WHEN** um assinante com 100 perguntas usadas recebe um `RENEWAL`
- **THEN** o uso volta a 0 e ele pode perguntar de novo

#### Scenario: Admin sem limite
- **WHEN** um admin já fez 150 perguntas no mês e faz mais uma
- **THEN** a pergunta é aceita

### Requirement: Dados da assinatura ao apagar a conta
`DELETE /me` SHALL apagar também a assinatura e o uso de perguntas do usuário na API. A assinatura no Google Play MUST NOT ser cancelada por isso: o cancelamento continua sendo feito pelo usuário no Google Play.

#### Scenario: Apagar conta de assinante
- **WHEN** um assinante apaga a conta e entra de novo com o mesmo Google
- **THEN** o novo usuário aparece como plano grátis até sincronizar ou restaurar a compra

### Requirement: Linha Dev Tips Pro em Ajustes
Na seção "Conta" de Ajustes, logo abaixo do convite para entrar ou da linha do usuário, o app SHALL mostrar a linha "Dev Tips Pro":
- no plano grátis, com o texto "Tire dúvidas sobre cada card"; tocar nela abre o paywall;
- para usuários Pro, com o texto "Ativo"; tocar nela abre a tela "Conta".

A linha SHALL aparecer no Android e no iOS, e MUST NOT aparecer na web (onde a seção "Conta" não existe).

#### Scenario: Usuário grátis
- **WHEN** um usuário sem assinatura toca em "Dev Tips Pro" em Ajustes
- **THEN** o paywall abre

#### Scenario: Usuário Pro
- **WHEN** um assinante abre Ajustes
- **THEN** a linha "Dev Tips Pro" mostra "Ativo", e tocar nela abre a tela "Conta"

#### Scenario: iOS
- **WHEN** o app roda no iPhone e um usuário sem assinatura abre Ajustes
- **THEN** a linha "Dev Tips Pro" aparece com "Tire dúvidas sobre cada card"

### Requirement: Paywall
O paywall SHALL abrir em tela cheia, com botão de fechar, e mostrar:
- o selo "PRO", o título "Travou num card? Pergunte." e o texto "Com o Pro, você tira dúvidas sobre o card que está estudando, na hora, sem sair da sessão.";
- três benefícios:
  - "Explicações de outro jeito quando a resposta do card não bastou";
  - "Novos exemplos de código sobre o mesmo conceito";
  - "Respostas focadas só no conteúdo do card, sem desvio de assunto";
- o plano "Pro mensal" com "100 perguntas por mês" e o preço da loja por mês;
- o botão "Assinar o Pro";
- o aviso "Renova automaticamente. Cancele quando quiser nas configurações do Google Play.";
- os links "Restaurar compras", "Termos" e "Privacidade".

Enquanto o preço da loja não carrega, o botão "Assinar o Pro" SHALL ficar desabilitado. "Termos" e "Privacidade" SHALL abrir os mesmos endereços da seção Sobre.

No iOS, onde a venda ainda não existe, o paywall SHALL mostrar o mesmo conteúdo com o preço fixo "R$ 14,90/mês" e o botão "Assinar o Pro" habilitado. Tocar em "Assinar o Pro" ou em "Restaurar compras" SHALL mostrar o aviso "A assinatura pelo iPhone ainda não está disponível. Em breve!", sem abrir login nem loja.

#### Scenario: Conteúdo
- **WHEN** o paywall abre e a loja devolve o preço "R$ 14,90"
- **THEN** a tela mostra "Pro mensal", "100 perguntas por mês", "R$ 14,90/mês" e o botão "Assinar o Pro" habilitado

#### Scenario: Preço carregando
- **WHEN** o paywall abre e a loja ainda não respondeu
- **THEN** o botão "Assinar o Pro" fica desabilitado

#### Scenario: Paywall no iOS
- **WHEN** o paywall abre no iPhone
- **THEN** a tela mostra "R$ 14,90/mês" e o botão "Assinar o Pro" habilitado

#### Scenario: Assinar no iOS
- **WHEN** o usuário toca em "Assinar o Pro" no iPhone
- **THEN** aparece "A assinatura pelo iPhone ainda não está disponível. Em breve!" e nenhuma compra é iniciada

#### Scenario: Restaurar no iOS
- **WHEN** o usuário toca em "Restaurar compras" no paywall do iPhone
- **THEN** aparece "A assinatura pelo iPhone ainda não está disponível. Em breve!"

#### Scenario: Fechar
- **WHEN** o usuário toca em fechar
- **THEN** o app volta para a tela de onde o paywall foi aberto

### Requirement: Assinar pelo app
Tocar em "Assinar o Pro":
- **sem sessão**, SHALL abrir a tela de login e, depois de entrar, voltar ao paywall;
- **com sessão**, SHALL iniciar a compra no Google Play com a conta do usuário. Durante a compra, o botão SHALL mostrar "Assinando…" com um indicador.

Com a compra concluída, o app SHALL sincronizar a assinatura com a API, mostrar "Pronto! Você agora é Pro." e fechar o paywall. Se o usuário cancelar na loja, o paywall SHALL voltar ao normal sem mensagem. Em outros erros:
- sem conexão: "Sem conexão. Tente de novo quando estiver online.";
- demais casos: "Não foi possível concluir a assinatura. Tente de novo."

#### Scenario: Sem sessão
- **WHEN** um usuário sem conta toca em "Assinar o Pro" e entra com o Google
- **THEN** o app volta ao paywall, já com sessão

#### Scenario: Compra concluída
- **WHEN** a loja confirma a compra e a sincronização devolve `plan` igual a `pro`
- **THEN** aparece "Pronto! Você agora é Pro.", o paywall fecha e o app passa a tratar o usuário como Pro

#### Scenario: Compra cancelada
- **WHEN** o usuário cancela a compra na loja
- **THEN** o paywall volta ao normal, sem mensagem de erro

#### Scenario: Erro na loja
- **WHEN** a loja devolve um erro que não é cancelamento
- **THEN** aparece "Não foi possível concluir a assinatura. Tente de novo."

### Requirement: Restaurar compras
"Restaurar compras" (no paywall e na tela Conta) SHALL exigir sessão, abrindo o login se não houver. Com sessão, o app SHALL restaurar as compras na loja e sincronizar com a API:
- se o usuário ficar Pro, SHALL mostrar "Assinatura restaurada." (e, no paywall, fechá-lo);
- se não houver assinatura ativa, SHALL mostrar "Nenhuma assinatura ativa encontrada.";
- em caso de erro, SHALL mostrar "Não foi possível restaurar agora. Tente de novo."

#### Scenario: Assinatura encontrada
- **WHEN** o usuário restaura as compras e a sincronização devolve `plan` igual a `pro`
- **THEN** aparece "Assinatura restaurada." e o paywall fecha

#### Scenario: Nada para restaurar
- **WHEN** o usuário restaura as compras e a sincronização devolve `plan` igual a `free`
- **THEN** aparece "Nenhuma assinatura ativa encontrada."

### Requirement: Plano no app
Com sessão, o app SHALL consultar `GET /me/subscription`:
- ao abrir;
- depois do login;
- depois de comprar ou restaurar;
- ao voltar para o primeiro plano.

O app SHALL guardar no aparelho a última resposta, para usar sem conexão. Ao sair da conta ou apagá-la, o app SHALL voltar a tratar o usuário como plano grátis e desligar a conta da loja do usuário anterior. Sem sessão, o app SHALL tratar o usuário como plano grátis.

#### Scenario: Sem conexão
- **WHEN** um assinante abre o app sem conexão
- **THEN** o app usa o último plano guardado e trata o usuário como Pro

#### Scenario: Sair da conta
- **WHEN** um assinante sai da conta
- **THEN** a linha "Dev Tips Pro" em Ajustes volta a mostrar "Tire dúvidas sobre cada card"
