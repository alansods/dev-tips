## ADDED Requirements

### Requirement: Tela da simulação
Tocar numa simulação em qualquer lista SHALL abrir a tela da simulação em tela cheia, sem a barra de abas, com botão de voltar. A tela SHALL mostrar:
- "Situação-problema" acima do título, e o título da simulação;
- o bloco "Contexto", com `scenario.context` no idioma exibido;
- a stack, um chip por item;
- a quantidade de perguntas ("4 perguntas", "1 pergunta"), a barra de progresso e o texto "sei/total";
- um botão de ação, com as regras do requisito "Deck com progresso e ação" aplicadas ao deck da simulação, e os rótulos **Começar conversa** (em vez de "Estudar"), **Continuar** e **Praticar de novo** (em vez de "Estudar de novo").

A tela MUST NOT mostrar a lista de decks. A sessão aberta pelo botão SHALL seguir os requisitos "Sessão de estudo", "Virar e responder" e "Resumo da sessão", com o título da simulação no cabeçalho. Sair da sessão SHALL voltar para a tela da simulação, e o botão do resumo SHALL se chamar **Voltar ao caso**.

#### Scenario: Abrir a simulação
- **WHEN** o usuário abre "Pedido e pagamento em dobro" sem nenhum card respondido
- **THEN** a tela mostra "Situação-problema", o título, "Contexto" com o contexto, as stacks, "4 perguntas", "0/4" e o botão "Começar conversa", e não mostra decks

#### Scenario: Começar conversa
- **WHEN** o usuário toca em "Começar conversa"
- **THEN** abre uma sessão com as 4 perguntas da simulação, em ordem sorteada, com o contador "1 / 4"

#### Scenario: Continuar a simulação
- **WHEN** 1 card está como "já sabia" e 1 como "não sabia"
- **THEN** a tela mostra "1/4" e o botão "Continuar", que abre uma sessão com os 3 cards que não estão como "já sabia"

#### Scenario: Simulação dominada
- **WHEN** todos os cards da simulação estão como "já sabia"
- **THEN** o botão mostra "Praticar de novo" e abre uma sessão com todos os cards

#### Scenario: Voltar ao caso
- **WHEN** o usuário termina a sessão e toca em "Voltar ao caso" no resumo
- **THEN** a tela da simulação abre, com o progresso atualizado

#### Scenario: Simulação em inglês
- **WHEN** o app está em inglês e o usuário abre uma simulação
- **THEN** a tela mostra "Problem scenario", "Context", o contexto em inglês, "4 questions" e o botão "Start conversation"

### Requirement: Textos da simulação
Os textos da tela da simulação e do card `interview` SHALL seguir o idioma do app:

| PT-BR | Inglês |
|---|---|
| Situação-problema | Problem scenario |
| Contexto | Context |
| "1 pergunta", "N perguntas" | "1 question", "N questions" |
| Começar conversa, Continuar, Praticar de novo | Start conversation, Continue, Practice again |
| Voltar ao caso | Back to case |
| Por que funciona, Atenção | Why it works, Watch out |
| Caso (selo e tipo do card) | Case |

#### Scenario: Verso em inglês
- **WHEN** o app está em inglês e o verso de um card interview com `why` e `watchOut` é exibido
- **THEN** os rótulos são "Why it works" e "Watch out"

## MODIFIED Requirements

### Requirement: Frente e verso por tipo de card
Cada tipo de card SHALL ter frente e verso próprios:

| Tipo | Frente | Verso |
|---|---|---|
| endpoint | método e caminho, e a pergunta "Qual operação do CRUD é essa e que status a API devolve?" | operação (ex.: "C · Create"), descrição, status de sucesso e de erro |
| step | "Passo N", título, "o que é" e a pergunta "Como cada framework faz isso?" | "por que importa", abas de framework e o snippet do framework selecionado |
| compare | conceito, explicação e a pergunta "Como cada stack resolve isso?" | uma linha por coluna da trilha, com rótulo e valor |
| concept | termo e o convite "O que significa?" | definição |
| code | título e explicação (`body`) | snippet |
| question | a pergunta e o convite "Responda em voz alta antes de virar." | a pergunta, a resposta modelo e o snippet, quando houver |
| interview | "Contexto" com o contexto da simulação, a pergunta e o convite "Responda em voz alta antes de virar." | a pergunta, a resposta-modelo, "Por que funciona" com `why` e "Atenção" com `watchOut`, quando houver, e o snippet, quando houver |

Todo card com `origin: "supplement"` SHALL exibir o selo "Complemento" na frente e no verso.

#### Scenario: Endpoint
- **WHEN** a sessão mostra o card `POST /products` e o usuário vira
- **THEN** a frente mostra "POST" e "/products", e o verso mostra "C · Create", "Cria um produto", "201" e "400"

#### Scenario: Passo
- **WHEN** a sessão mostra o Passo 7 e o usuário vira
- **THEN** a frente mostra "Passo 7" e "C: Criar produto", e o verso mostra as abas Express, Spring Boot, NestJS e FastAPI com o código do framework selecionado

#### Scenario: Comparação
- **WHEN** a sessão mostra o card "DTO" do mapa mental e o usuário vira
- **THEN** o verso mostra as linhas Frontend, Spring Boot, Express, NestJS e FastAPI com seus valores

#### Scenario: Conceito
- **WHEN** a sessão mostra o termo "CORS" e o usuário vira
- **THEN** o verso mostra a definição de CORS

#### Scenario: Complemento
- **WHEN** a sessão mostra o card `docker-compose`
- **THEN** o selo "Complemento" aparece, e o verso mostra o snippet do `docker-compose.yml`

#### Scenario: Pergunta de entrevista
- **WHEN** a sessão mostra o card `put-vs-patch` e o usuário vira
- **THEN** a frente mostra "Qual a diferença entre PUT e PATCH?" e o selo "Complemento", e o verso mostra a resposta modelo e o snippet com os dois comandos `curl`

#### Scenario: Pergunta de simulação
- **WHEN** a sessão mostra o card `idempotencia-no-backend` da simulação "Pedido e pagamento em dobro" e o usuário vira
- **THEN** a frente mostra "Contexto", o contexto do clique duplo em "Finalizar compra" e a pergunta "Como evitar que duas requisições simultâneas criem duas compras?", e o verso mostra a resposta-modelo, "Atenção" e o snippet SQL da tabela `orders`

#### Scenario: Simulação sem por que
- **WHEN** o verso de um card interview sem `why` é exibido
- **THEN** o rótulo "Por que funciona" não aparece

### Requirement: Origem do card na sessão
Na sessão de estudo e nas revisões, a frente e o verso de todo card SHALL começar pelo selo de origem: o ícone da trilha e o texto "<trilha> · <deck>", com o título da trilha e o título do deck a que o card pertence, no idioma exibido. Num card de simulação, o texto SHALL ser "Caso · <simulação>", com o título da simulação, sem o título do deck. O selo SHALL ser só informativo, sem ação ao tocar.

O tipo do card (por exemplo, "Glossário" ou "Pergunta") MUST NOT aparecer como selo. A exceção são os cards de passo, que SHALL continuar mostrando "Passo N" ao lado do selo de origem.

#### Scenario: Card de conceito
- **WHEN** a sessão mostra o card `cors` do deck Glossário da trilha CRUD
- **THEN** o card mostra o selo "O mesmo CRUD em quatro frameworks · Glossário", e nenhum selo de tipo

#### Scenario: Revisão de todas as trilhas
- **WHEN** a revisão de todas as trilhas mostra um card do deck "Compras dentro do app" da trilha "Pagamentos no app"
- **THEN** o selo mostra "Pagamentos no app · Compras dentro do app" com o ícone da trilha

#### Scenario: Card de passo
- **WHEN** a sessão mostra o passo 3 da trilha CRUD
- **THEN** o card mostra o selo de origem e também "Passo 3"

#### Scenario: Em inglês
- **WHEN** o app está em inglês e a sessão mostra o card `cors`
- **THEN** o selo mostra os títulos da trilha e do deck em inglês

#### Scenario: Card de simulação
- **WHEN** a revisão de todas as trilhas mostra um card da simulação "API de notificações"
- **THEN** o selo mostra "Caso · API de notificações"
