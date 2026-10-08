## MODIFIED Requirements

### Requirement: Perguntar sobre o card na API
`POST /assistant/ask` (rota protegida) SHALL receber `{ "card": { "type", "title", "text" }, "history": [{ "role", "text" }], "question", "language" }`, com estes limites:
- `question` com 1 a 500 caracteres, depois de remover espaços das pontas;
- `card.text` com até 8.000 caracteres;
- `history` com até 6 mensagens, cada uma com `role` `user` ou `assistant` e até 4.000 caracteres;
- `language` igual a `pt-BR` ou `en`.

Um corpo fora desses limites SHALL receber `400` com o código `invalid_body`. Antes de chamar o modelo de IA, a rota SHALL aplicar a cota do plano Pro: `403 pro_required` no plano grátis e `429 quota_exceeded` com a cota esgotada. Com sucesso, a resposta SHALL ser `200` com `{ "answer", "inScope", "questions": { "used", "limit" } }`, em que `questions` é o uso do ciclo depois da pergunta.

#### Scenario: Pergunta respondida
- **WHEN** um assinante com 30 perguntas usadas pergunta "Por que o count não volta a 0?" sobre um card
- **THEN** a resposta é `200` com a resposta do modelo, `inScope` igual a `true` e `questions` igual a `{ "used": 31, "limit": 200 }`

#### Scenario: Plano grátis
- **WHEN** um usuário do plano grátis faz uma pergunta
- **THEN** a resposta é `403` com `error.code` igual a `pro_required`, e o modelo não é chamado

#### Scenario: Cota esgotada
- **WHEN** um assinante com 200 perguntas usadas faz uma pergunta
- **THEN** a resposta é `429` com `error.code` igual a `quota_exceeded`, e o modelo não é chamado

#### Scenario: Pergunta longa demais
- **WHEN** a pergunta tem 501 caracteres
- **THEN** a resposta é `400` com `error.code` igual a `invalid_body`, e o modelo não é chamado

#### Scenario: Sem sessão
- **WHEN** a rota é chamada sem token de acesso
- **THEN** a resposta é `401` com `error.code` igual a `unauthorized`

#### Scenario: Histórico longo demais
- **WHEN** o `history` tem 7 mensagens
- **THEN** a resposta é `400` com `error.code` igual a `invalid_body`, e o modelo não é chamado

### Requirement: Erros e cota no chat
O chat SHALL tratar as falhas assim:
- **sem conexão**: "Sem conexão. Tente de novo quando estiver online." com o botão "Tentar de novo";
- **outros erros**: "Não consegui responder agora." com o botão "Tentar de novo";
- "Tentar de novo" SHALL reenviar a mesma pergunta;
- **`403 pro_required`**: o app SHALL atualizar o plano, fechar o chat e abrir o paywall;
- **`429 quota_exceeded`**: o campo e o botão de enviar SHALL dar lugar a "Você usou as 200 perguntas do mês", "Sua cota renova junto com a assinatura." e "200 de 200 · renova em <data>". As mensagens anteriores continuam visíveis.

#### Scenario: Sem conexão
- **WHEN** o assinante envia uma pergunta sem conexão
- **THEN** aparece "Sem conexão. Tente de novo quando estiver online." com "Tentar de novo"

#### Scenario: Tentar de novo
- **WHEN** a primeira tentativa falhou e o assinante toca em "Tentar de novo" com a API respondendo
- **THEN** a mesma pergunta é reenviada e a resposta aparece

#### Scenario: Cota esgotada
- **WHEN** a API responde `429 quota_exceeded` e o plano renova em 12/11/2026
- **THEN** o chat mostra "Você usou as 200 perguntas do mês" e "200 de 200 · renova em 12/11/2026", sem o campo de pergunta

#### Scenario: Assinatura expirou
- **WHEN** a API responde `403 pro_required`
- **THEN** o chat fecha e o paywall abre
