# study-flow Specification

## Purpose

Define o fluxo de estudo do app: abrir uma trilha, escolher um deck, estudar os cards como flashcards (frente e verso, "Já sabia"/"Não sabia"), ver o resumo da sessão e acompanhar o progresso.
## Requirements
### Requirement: Tela da trilha
Tocar numa trilha em qualquer lista de trilhas SHALL abrir a tela da trilha em tela cheia, sem a barra de abas, com botão de voltar. A tela SHALL mostrar o título e a descrição da trilha, os frameworks (variantes) quando a trilha tiver, a quantidade de cards que o usuário marcou como "já sabia", o total de cards da trilha e a lista de decks na ordem do conteúdo.

#### Scenario: Abrir a trilha
- **WHEN** o usuário toca em "O mesmo CRUD em quatro frameworks" na área Backend
- **THEN** a tela da trilha abre com o título, os 4 frameworks e os 5 decks na ordem O que vamos criar, Passo a passo, Mapa mental, Glossário, Perguntas de entrevista

#### Scenario: Voltar para as trilhas
- **WHEN** o usuário abriu a trilha pela área Backend e toca em voltar
- **THEN** volta para a tela da área Backend

### Requirement: Deck com progresso e ação
Cada deck na tela da trilha SHALL mostrar o título, a quantidade de cards, quantos estão marcados como "já sabia" (ex.: "3/20"), uma barra de progresso proporcional e um botão de ação:
- **Estudar**, quando nenhum card do deck tem resposta registrada. Abre uma sessão com todos os cards;
- **Continuar**, quando algum card tem resposta, mas nem todos estão como "já sabia". Abre uma sessão com os cards que ainda não estão como "já sabia";
- **Estudar de novo**, quando todos os cards estão como "já sabia". Abre uma sessão com todos os cards.

A ordem dos cards dentro da sessão segue o requisito "Sessão de estudo".

#### Scenario: Deck nunca estudado
- **WHEN** nenhum card do deck Glossário tem resposta
- **THEN** o deck mostra "0/24" e o botão "Estudar", que abre uma sessão com os 24 cards

#### Scenario: Continuar de onde parou
- **WHEN** no deck O que vamos criar, 2 cards estão como "já sabia" e 1 como "não sabia"
- **THEN** o deck mostra "2/5" e o botão "Continuar", que abre uma sessão com os 3 cards que não estão como "já sabia"

#### Scenario: Deck dominado
- **WHEN** todos os 5 cards do deck O que vamos criar estão como "já sabia"
- **THEN** o deck mostra "5/5" e o botão "Estudar de novo", que abre uma sessão com os 5 cards

### Requirement: Sessão de estudo
A sessão SHALL abrir em tela cheia, sem a barra de abas. O cabeçalho SHALL ter um botão de sair (rótulo acessível "Sair da sessão"), o título do deck, o contador "posição / total" e uma barra de progresso. A sessão SHALL mostrar um card por vez.

Ao abrir, a sessão SHALL sortear a ordem dos seus cards, e essa ordem MUST ficar fixa até a sessão terminar. Isso vale para toda sessão: a do deck, a revisão de hoje e "Revisar os que errei". Abrir uma nova sessão SHALL sortear de novo.

A exceção são os cards de passo numerado (tipo step), que MUST aparecer em ordem crescente de número, mesmo numa sessão sorteada. O sorteio MUST NOT mudar quais cards entram na sessão.

#### Scenario: Primeiro card
- **WHEN** o usuário abre a sessão de um deck com 20 cards
- **THEN** vê um dos 20 cards pela frente e o contador "1 / 20"

#### Scenario: Ordem sorteada
- **WHEN** o sorteio coloca o card `cors` em primeiro e o usuário abre a sessão do deck
- **THEN** o primeiro card exibido é `cors`, mesmo que ele não seja o primeiro do deck

#### Scenario: Nova ordem a cada sessão
- **WHEN** o usuário abre a sessão de um deck, sai e abre de novo, e o sorteio da segunda vez é diferente
- **THEN** a segunda sessão mostra os cards na nova ordem sorteada

#### Scenario: Passos em ordem
- **WHEN** o usuário abre a sessão de um deck com os passos 1, 2 e 3
- **THEN** os passos aparecem na ordem 1, 2 e 3

#### Scenario: Mesmos cards
- **WHEN** a sessão do deck é aberta com "Continuar" e há 3 cards que não estão como "já sabia"
- **THEN** a sessão tem exatamente esses 3 cards, em ordem sorteada

#### Scenario: Sair no meio
- **WHEN** o usuário respondeu 3 cards e toca em "Sair da sessão"
- **THEN** volta para a tela da trilha, e as 3 respostas continuam registradas no progresso

### Requirement: Virar e responder
Cada card SHALL começar pela frente. Tocar no card ou no botão "Mostrar resposta" SHALL mostrar o verso. Com o verso visível, a sessão SHALL mostrar o botão "Ver pergunta", e tocar nele ou no card SHALL voltar para a frente. O usuário SHALL poder alternar entre frente e verso quantas vezes quiser.

Os botões "Não sabia" e "Já sabia" SHALL aparecer só com o verso visível. Tocar em um deles SHALL registrar a resposta para aquele card e avançar para o próximo, que começa pela frente. Depois do último card, a sessão SHALL mostrar o resumo.

#### Scenario: Virar o card
- **WHEN** o usuário toca em "Mostrar resposta"
- **THEN** o verso aparece e os botões "Não sabia" e "Já sabia" ficam disponíveis

#### Scenario: Voltar para a pergunta
- **WHEN** o verso está visível e o usuário toca em "Ver pergunta"
- **THEN** a frente aparece de novo, com o botão "Mostrar resposta", e os botões "Não sabia" e "Já sabia" deixam de estar disponíveis

#### Scenario: Tocar no verso
- **WHEN** o verso está visível e o usuário toca no card
- **THEN** a frente aparece de novo

#### Scenario: Virar de novo
- **WHEN** o usuário voltou para a frente e toca em "Mostrar resposta"
- **THEN** o verso aparece de novo, e responder registra o card normalmente

#### Scenario: Responder e avançar
- **WHEN** o verso do card 1 de 5 está visível e o usuário toca em "Já sabia"
- **THEN** o card fica registrado como "já sabia" e a sessão mostra a frente do card 2, com o contador "2 / 5"

#### Scenario: Não responder sem ver o verso
- **WHEN** o card está pela frente
- **THEN** os botões "Já sabia" e "Não sabia" não estão disponíveis

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

### Requirement: Abas de framework
No verso de um card `step`, as abas SHALL listar as variantes da trilha na ordem da trilha, e uma delas SHALL estar selecionada (indicada para leitores de tela). Tocar numa aba SHALL trocar o snippet exibido (arquivo, código e nota). A aba escolhida SHALL continuar selecionada nos próximos cards `step`. Na primeira vez, a aba selecionada SHALL ser a primeira variante da trilha.

#### Scenario: Trocar de framework
- **WHEN** o verso do Passo 1 está visível com Express selecionado e o usuário toca em FastAPI
- **THEN** o código mostrado passa a ser o snippet FastAPI do Passo 1 (`python -m venv .venv`) e a aba FastAPI fica selecionada

#### Scenario: Escolha mantida entre passos
- **WHEN** o usuário selecionou FastAPI no Passo 1 e avança até o verso do Passo 2
- **THEN** a aba FastAPI continua selecionada e o código é o snippet FastAPI do Passo 2

### Requirement: Exibição de código
Snippets SHALL ser exibidos em fonte monoespaçada, preservando quebras de linha e indentação, sem quebra automática de linhas longas e com rolagem horizontal. Acima do código SHALL aparecer o rótulo `file`. Abaixo, quando houver, SHALL aparecer a `note`.

#### Scenario: Código preservado na tela
- **WHEN** o verso do Passo 3 com FastAPI é exibido
- **THEN** o texto do código na tela é idêntico ao `code` do snippet, e o rótulo `app/database.py` aparece acima dele

### Requirement: Resumo da sessão
Ao responder o último card, a sessão SHALL mostrar o resumo:
- quantos cards foram marcados como "já sabia" e como "não sabia" nesta sessão, com esses rótulos;
- a lista dos cards marcados como "não sabia", identificados pelo tipo e pelo título;
- o botão **Revisar os que errei**, só quando houver algum "não sabia". Ele inicia uma nova sessão apenas com esses cards, com a ordem sorteada de novo como no requisito "Sessão de estudo";
- o botão **Voltar à trilha**.

#### Scenario: Resumo com erros
- **WHEN** numa sessão de 5 cards o usuário marcou 3 "já sabia" e 2 "não sabia"
- **THEN** o resumo mostra "3 já sabia" e "2 não sabia", lista os 2 cards, e "Revisar os que errei" abre uma sessão de 2 cards

#### Scenario: Resumo sem erros
- **WHEN** o usuário marcou todos os cards como "já sabia"
- **THEN** o resumo não mostra o botão "Revisar os que errei" nem a lista para revisar

### Requirement: Progresso de cada card
O progresso de cada card SHALL ser a última resposta registrada ("já sabia" ou "não sabia"), ou nenhuma. Ele SHALL valer para todo o app: a tela da trilha e a aba Trilhas refletem cada resposta assim que é registrada. Responder um card de novo SHALL substituir a resposta anterior. A persistência entre aberturas do app é definida pela capability `progress`.

#### Scenario: Progresso refletido na tela da trilha
- **WHEN** o usuário marca 2 cards do Glossário como "já sabia" e volta para a tela da trilha
- **THEN** o deck Glossário mostra "2/24", e o total de "já sabia" da trilha aumentou em 2

#### Scenario: Resposta substituída
- **WHEN** um card marcado como "não sabia" é marcado como "já sabia" numa nova sessão
- **THEN** ele passa a contar como "já sabia"

### Requirement: Nível no card
Na sessão de estudo e na revisão, a frente e o verso de todo card SHALL mostrar o nível do card como um chip ao lado do selo de origem do card: "Júnior", "Pleno" ou "Sênior" em PT-BR, e "Junior", "Mid-level" ou "Senior" em inglês. O chip SHALL ser só informativo, sem ação ao tocar.

#### Scenario: Nível na frente
- **WHEN** a sessão mostra a frente de um card com `level: "pleno"`
- **THEN** o chip "Pleno" aparece ao lado do selo de origem do card

#### Scenario: Nível no verso
- **WHEN** o usuário vira um card com `level: "senior"`
- **THEN** o verso mostra o chip "Sênior"

#### Scenario: Nível em inglês
- **WHEN** o app está em inglês e a sessão mostra um card com `level: "pleno"`
- **THEN** o chip mostra "Mid-level"

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

