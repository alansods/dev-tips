## MODIFIED Requirements

### Requirement: Revisão de hoje no Início
Com cards para revisar hoje, o Início SHALL mostrar:
- "N cards para revisar";
- os ícones das até 3 trilhas com mais cards para revisar e a quantidade de trilhas;
- uma estimativa de tempo de "~M min", com meio minuto por card, arredondado para cima;
- o botão "Começar revisão", que abre a revisão de todas as trilhas.

Sem cards para revisar hoje, o Início SHALL mostrar:
- "Nada para revisar hoje";
- quantos cards vencem amanhã, quando houver;
- os últimos 7 dias, terminando hoje, com os dias estudados marcados.

#### Scenario: Com revisão
- **WHEN** 3 cards da trilha CRUD e 2 de Fundamentos de programação e web estão para revisar hoje
- **THEN** o Início mostra "5 cards para revisar", "2 trilhas · ~3 min" e o botão "Começar revisão"

#### Scenario: Começar revisão
- **WHEN** há cards para revisar e o usuário toca em "Começar revisão"
- **THEN** a revisão de todas as trilhas abre

#### Scenario: Revisão em dia
- **WHEN** nenhum card está para revisar hoje e 4 vencem amanhã
- **THEN** o Início mostra "Nada para revisar hoje" e "Amanhã: 4 cards"

### Requirement: Continue de onde parou
O app SHALL guardar no aparelho a trilha e o card da última resposta registrada numa sessão. A seção "Continue de onde parou" SHALL mostrar o deck desse card:
- o ícone e o título da trilha;
- "deck N de M" e o título do deck;
- a barra e "sei/total" do deck.

Tocar nela SHALL abrir a sessão desse deck, com os cards definidos pela ação do deck (Estudar, Continuar ou Estudar de novo).

Abaixo, "Também em andamento" SHALL listar até 3 outras trilhas em andamento (com algum card respondido e nem todos como "já sabia"), na ordem do catálogo, com a porcentagem de cada uma. Tocar numa delas SHALL abrir a tela da trilha.

#### Scenario: Último deck estudado
- **WHEN** a última resposta foi num card do deck "Mapa mental" da trilha CRUD
- **THEN** a seção mostra "O mesmo CRUD em quatro frameworks", "deck 3 de 5 · Mapa mental" e o progresso do deck

#### Scenario: Continuar o deck
- **WHEN** o usuário toca na seção "Continue de onde parou" do deck "Mapa mental"
- **THEN** a sessão do deck "Mapa mental" abre

#### Scenario: Também em andamento
- **WHEN** o usuário respondeu cards das trilhas CRUD (a última) e Fundamentos de programação e web
- **THEN** "Também em andamento" mostra "Fundamentos de programação e web" com a sua porcentagem

### Requirement: Primeiro acesso
Sem nenhuma resposta registrada, o Início SHALL mostrar:
- o título "Bem-vindo ao Dev Tips" e uma frase sobre como o app funciona;
- a pergunta "O que você quer estudar?", com uma opção por área do catálogo. As opções podem ser marcadas e desmarcadas, e a escolha fica salva como áreas de interesse;
- "Comece por aqui", com a primeira trilha sem pré-requisitos da ordem sugerida da primeira área de interesse (ou de Fundamentos, sem interesse) e o botão "Começar a trilha", que abre a tela da trilha;
- quando houver, a trilha seguinte a ela ("Depois:"), a primeira que tem a trilha de "Comece por aqui" como pré-requisito.

#### Scenario: Sem interesse escolhido
- **WHEN** é o primeiro acesso e nenhuma área foi escolhida
- **THEN** "Comece por aqui" mostra "Fundamentos de programação e web"

#### Scenario: Interesse em Backend
- **WHEN** é o primeiro acesso e o usuário marca "Backend"
- **THEN** a opção "Backend" fica marcada e "Comece por aqui" mostra a primeira trilha sem pré-requisitos da ordem sugerida de Backend
