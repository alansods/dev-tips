# card-assistant Specification

## Purpose
Define o chat "Perguntar" da sessão de estudo: o botão na barra de ações, a gaveta de conversa no app e a rota da API que responde com IA apenas sobre o conteúdo do card atual, dentro da cota do plano Pro.
## Requirements
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

### Requirement: Respostas só sobre o card
A API SHALL enviar ao modelo:
- o texto do card;
- a instrução de responder apenas sobre esse conteúdo, no idioma pedido (`pt-BR` ou `en`);
- as mensagens anteriores, na ordem;
- a pergunta.

O modelo SHALL indicar se a pergunta é sobre o card. Quando não for, a API SHALL responder com `inScope` igual a `false` e a resposta fixa, no idioma pedido:
- `pt-BR`: "Só consigo ajudar com o conteúdo deste card: <título>. Quer que eu explique algum ponto dele?";
- `en`: "I can only help with the content of this card: <título>. Want me to explain any part of it?".

Uma pergunta fora do escopo MUST NOT consumir a cota.

#### Scenario: Contexto enviado ao modelo
- **WHEN** um assinante pergunta em `en`, com duas mensagens anteriores, sobre o card "Closure com estado privado"
- **THEN** o pedido ao modelo contém o texto do card, a instrução de responder só sobre ele em inglês, as duas mensagens anteriores na ordem e a pergunta

#### Scenario: Pergunta fora do escopo
- **WHEN** um assinante com 30 perguntas usadas pergunta "Qual a diferença entre React e Vue?" sobre o card "Closure com estado privado", e o modelo indica que a pergunta não é sobre o card
- **THEN** a resposta tem `inScope` igual a `false`, `answer` igual a "Só consigo ajudar com o conteúdo deste card: Closure com estado privado. Quer que eu explique algum ponto dele?" e `questions.used` igual a 30

### Requirement: Falha do modelo
Se o modelo de IA falhar, demorar mais de 30 segundos ou devolver uma resposta fora do formato esperado, a rota SHALL responder `502` com o código `assistant_unavailable`. A pergunta MUST NOT consumir a cota.

#### Scenario: Modelo fora do ar
- **WHEN** um assinante com 30 perguntas usadas faz uma pergunta e o modelo responde com erro
- **THEN** a resposta é `502` com `error.code` igual a `assistant_unavailable`, e o uso continua em 30

### Requirement: Botão Perguntar na sessão
Na barra de ações da sessão de estudo, o app SHALL mostrar o botão "Perguntar" com rótulo acessível "Perguntar sobre este card":
- sempre na **última posição à direita**: depois de "Mostrar resposta" na frente e depois de "Já sabia" no verso;
- no mesmo lugar na frente e no verso;
- no Android e no iOS. MUST NOT aparecer na web.

Sem conta ou no plano grátis, o botão SHALL mostrar o selo "PRO" e abrir o paywall ao ser tocado. Para quem é Pro, SHALL abrir o chat do card sem o selo.

#### Scenario: Frente e verso
- **WHEN** o usuário vê a frente do card e depois toca em "Mostrar resposta"
- **THEN** o botão "Perguntar sobre este card" é o último da barra nas duas faces

#### Scenario: Sem conta
- **WHEN** um usuário sem conta toca em "Perguntar sobre este card"
- **THEN** o botão mostra o selo "PRO", e o paywall abre

#### Scenario: Assinante
- **WHEN** um assinante toca em "Perguntar sobre este card"
- **THEN** o chat abre, sem o selo "PRO"

#### Scenario: Web
- **WHEN** a sessão roda na web
- **THEN** o botão "Perguntar sobre este card" não aparece

### Requirement: Chat do card
O chat SHALL abrir numa gaveta inferior e mostrar:
- o título "Dúvidas sobre este card" e um botão "Fechar";
- um chip com o tipo e o título do card;
- **sem mensagens**:
  - "O que ficou confuso?" e "Respondo só sobre este card. Escolha uma sugestão ou escreva sua pergunta.";
  - as sugestões "Explique de outro jeito", "Me dê um exemplo" e "Por que isso importa?";
  - a nota "A conversa recomeça quando você muda de card.";
- o campo "Pergunte sobre este card…" (até 500 caracteres) e o botão "Enviar pergunta", desabilitado com o campo vazio;
- o aviso "Respostas geradas por IA podem conter erros.".

A gaveta SHALL fechar pelo botão "Fechar" ou tocando fora dela. Fechar e reabrir no mesmo card SHALL manter a conversa. Ao passar para outro card, a conversa SHALL recomeçar vazia.

#### Scenario: Chat vazio
- **WHEN** um assinante abre o chat do card "Closure com estado privado"
- **THEN** vê "Dúvidas sobre este card", o chip com "Closure com estado privado", "O que ficou confuso?", as três sugestões e o botão "Enviar pergunta" desabilitado

#### Scenario: Conversa recomeça em outro card
- **WHEN** o assinante conversou no card 1, respondeu o card e abriu o chat no card 2
- **THEN** o chat do card 2 está vazio

#### Scenario: Reabrir no mesmo card
- **WHEN** o assinante conversou, fechou o chat e o abriu de novo no mesmo card
- **THEN** as mensagens anteriores continuam lá

### Requirement: Enviar pergunta no app
Enviar uma pergunta, tocando em "Enviar pergunta" ou numa sugestão, SHALL:
- fechar o teclado;
- mostrar a mensagem do usuário;
- mostrar "digitando…" até a resposta chegar;
- mostrar a resposta do assistente.

A conversa SHALL rolar até a última mensagem sempre que aparecer uma pergunta, o "digitando…", uma resposta ou um aviso de erro, para que o conteúdo mais novo fique visível, inclusive a partir da segunda pergunta.

Trechos entre três crases (```) SHALL aparecer como bloco de código em fonte mono, que rola na horizontal quando a linha não cabe. O balão de uma resposta com bloco de código SHALL ter a altura do seu conteúdo, sem espaço vazio, mesmo quando a conversa passa da altura da gaveta. O app SHALL enviar à API o texto do card no idioma atual, as últimas 6 mensagens da conversa e o idioma do app. Depois de uma resposta, o uso de perguntas do plano mostrado no app SHALL ser atualizado com o `questions` da resposta. Uma resposta com `inScope` igual a `false` SHALL aparecer com o rótulo "Fora deste card", seguida das três sugestões.

#### Scenario: Pergunta e resposta
- **WHEN** o assinante escreve "Por que o count não volta a 0?" e toca em "Enviar pergunta"
- **THEN** a pergunta aparece, "digitando…" aparece enquanto a API não responde, e depois aparece a resposta

#### Scenario: Segunda pergunta
- **WHEN** o assinante já recebeu uma resposta e envia outra pergunta
- **THEN** as duas perguntas e as duas respostas aparecem em ordem, e a conversa rola até a resposta nova

#### Scenario: Teclado fecha ao enviar
- **WHEN** o assinante toca em "Enviar pergunta" ou numa sugestão
- **THEN** o teclado fecha

#### Scenario: Sugestão
- **WHEN** o assinante toca em "Me dê um exemplo"
- **THEN** a pergunta "Me dê um exemplo" é enviada

#### Scenario: Bloco de código
- **WHEN** a resposta contém um trecho entre três crases
- **THEN** o trecho aparece num bloco de código

#### Scenario: Conversa longa com código
- **WHEN** a conversa passa da altura da gaveta e uma resposta anterior tem bloco de código
- **THEN** o balão dessa resposta mantém a altura do conteúdo, e a resposta nova aparece logo abaixo, visível

#### Scenario: Fora deste card
- **WHEN** a API responde com `inScope` igual a `false`
- **THEN** a resposta aparece com o rótulo "Fora deste card" e as três sugestões

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

