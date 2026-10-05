## RENAMED Requirements

- FROM: `### Requirement: Tela do tema`
- TO: `### Requirement: Tela da trilha`


## MODIFIED Requirements

### Requirement: Tela da trilha
Tocar numa trilha na aba Trilhas SHALL abrir a tela da trilha em tela cheia, sem a barra de abas, com botão de voltar. A tela SHALL mostrar o título e a descrição da trilha, os frameworks (variantes) quando a trilha tiver, a quantidade de cards que o usuário marcou como "já sabia", o total de cards da trilha e a lista de decks na ordem do conteúdo.

#### Scenario: Abrir a trilha
- **WHEN** o usuário toca em "O mesmo CRUD em quatro frameworks" na aba Trilhas
- **THEN** a tela da trilha abre com o título, os 4 frameworks e os 5 decks na ordem O que vamos criar, Passo a passo, Mapa mental, Glossário, Perguntas de entrevista

#### Scenario: Voltar para as trilhas
- **WHEN** o usuário está na tela da trilha e toca em voltar
- **THEN** volta para a aba Trilhas

### Requirement: Deck com progresso e ação
Cada deck na tela da trilha SHALL mostrar o título, a quantidade de cards, quantos estão marcados como "já sabia" (ex.: "3/20"), uma barra de progresso proporcional e um botão de ação:
- **Estudar**, quando nenhum card do deck tem resposta registrada. Abre uma sessão com todos os cards, na ordem do deck;
- **Continuar**, quando algum card tem resposta, mas nem todos estão como "já sabia". Abre uma sessão com os cards que ainda não estão como "já sabia", na ordem do deck;
- **Estudar de novo**, quando todos os cards estão como "já sabia". Abre uma sessão com todos os cards.

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
A sessão SHALL abrir em tela cheia, sem a barra de abas. O cabeçalho SHALL ter um botão de sair (rótulo acessível "Sair da sessão"), o título do deck, o contador "posição / total" e uma barra de progresso. A sessão SHALL mostrar um card por vez, na ordem definida ao abrir.

#### Scenario: Primeiro card
- **WHEN** o usuário abre a sessão de um deck com 20 cards
- **THEN** vê o primeiro card pela frente e o contador "1 / 20"

#### Scenario: Sair no meio
- **WHEN** o usuário respondeu 3 cards e toca em "Sair da sessão"
- **THEN** volta para a tela da trilha, e as 3 respostas continuam registradas no progresso

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

### Requirement: Abas de framework
No verso de um card `step`, as abas SHALL listar as variantes da trilha na ordem da trilha, e uma delas SHALL estar selecionada (indicada para leitores de tela). Tocar numa aba SHALL trocar o snippet exibido (arquivo, código e nota). A aba escolhida SHALL continuar selecionada nos próximos cards `step`. Na primeira vez, a aba selecionada SHALL ser a primeira variante da trilha.

#### Scenario: Trocar de framework
- **WHEN** o verso do Passo 1 está visível com Express selecionado e o usuário toca em FastAPI
- **THEN** o código mostrado passa a ser o snippet FastAPI do Passo 1 (`python -m venv .venv`) e a aba FastAPI fica selecionada

#### Scenario: Escolha mantida entre passos
- **WHEN** o usuário selecionou FastAPI no Passo 1 e avança até o verso do Passo 2
- **THEN** a aba FastAPI continua selecionada e o código é o snippet FastAPI do Passo 2

### Requirement: Resumo da sessão
Ao responder o último card, a sessão SHALL mostrar o resumo:
- quantos cards foram marcados como "já sabia" e como "não sabia" nesta sessão, com esses rótulos;
- a lista dos cards marcados como "não sabia", identificados pelo tipo e pelo título;
- o botão **Revisar os que errei**, só quando houver algum "não sabia", que inicia uma nova sessão apenas com esses cards, na mesma ordem;
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
