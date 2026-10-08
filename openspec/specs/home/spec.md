# home Specification

## Purpose
Primeira tela do app: responde "o que eu estudo agora?" com a revisão do dia, o deck para continuar, sugestões de próximas trilhas e as trilhas novas, e acolhe quem acabou de instalar o app.
## Requirements
### Requirement: Aba Início
A aba Início SHALL ser a primeira aba do app. Quando o usuário já respondeu algum card, ela SHALL mostrar, nesta ordem:
1. a saudação;
2. a revisão de hoje;
3. "Continue de onde parou";
4. a sugestão de próximas trilhas;
5. as novas trilhas.

Seções sem conteúdo MUST NOT aparecer. Sem nenhuma resposta registrada, a aba SHALL mostrar o primeiro acesso no lugar dessas seções.

#### Scenario: Usuário estudando
- **WHEN** o usuário já respondeu cards da trilha React
- **THEN** a aba Início mostra a saudação, a revisão de hoje e "Continue de onde parou"

#### Scenario: Primeiro acesso no lugar das seções
- **WHEN** nenhum card tem resposta
- **THEN** a aba Início mostra as boas-vindas e não mostra "Continue de onde parou"

### Requirement: Saudação
A saudação SHALL dizer "Bom dia" (das 5h às 11h59), "Boa tarde" (das 12h às 17h59) ou "Boa noite" (nos outros horários), seguida do primeiro nome da conta quando houver sessão ("Boa noite, Ana"). Quando a sequência de dias seguidos for maior que 0, SHALL aparecer ao lado um selo com "N dias" ("1 dia" quando N = 1).

#### Scenario: Com conta
- **WHEN** são 20h e a conta é de "Ana Souza"
- **THEN** a saudação diz "Boa noite, Ana"

#### Scenario: Sem conta
- **WHEN** são 9h e não há sessão
- **THEN** a saudação diz "Bom dia"

#### Scenario: Selo de dias seguidos
- **WHEN** o usuário estudou hoje e nos 4 dias anteriores
- **THEN** o selo mostra "5 dias"

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
- **WHEN** 3 cards da trilha CRUD e 2 de Fundamentos web estão para revisar hoje
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
- **WHEN** o usuário respondeu cards das trilhas CRUD (a última) e Fundamentos web
- **THEN** "Também em andamento" mostra "Fundamentos web" com a sua porcentagem

### Requirement: Próximo passo
O Início SHALL sugerir até 3 trilhas ainda não iniciadas:
- com o título "Próximo passo depois de <trilha>": as trilhas que têm a trilha da última resposta como pré-requisito, na ordem do catálogo;
- sem nenhuma dessas, com o título "Sugestões para você": as primeiras trilhas não iniciadas na ordem sugerida das áreas de interesse, na ordem das áreas, ou da área Fundamentos quando não há interesse escolhido.

Tocar numa sugestão SHALL abrir a tela da trilha. Sem sugestão, a seção MUST NOT aparecer.

#### Scenario: Depois de React
- **WHEN** a última resposta foi na trilha React e as trilhas que dependem dela não foram iniciadas
- **THEN** a seção "Próximo passo depois de React" mostra até 3 delas, como "Estado e dados no React"

#### Scenario: Sem próximas trilhas
- **WHEN** a última resposta foi numa trilha da qual nenhuma outra depende, e a área de interesse é Backend
- **THEN** a seção "Sugestões para você" mostra as primeiras trilhas não iniciadas da ordem sugerida de Backend

### Requirement: Novas trilhas
O Início SHALL mostrar, em "Novas trilhas", até 3 trilhas incluídas nos últimos 30 dias, da mais recente para a mais antiga, com o selo "Nova". Tocar numa trilha SHALL abrir a tela da trilha, e "Ver todas" SHALL abrir a aba Trilhas. Sem trilha nova, a seção MUST NOT aparecer.

#### Scenario: Trilha incluída há 3 dias
- **WHEN** hoje é 2026-10-07 e a trilha "Módulos nativos no Expo" foi incluída em 2026-10-06
- **THEN** ela aparece em "Novas trilhas" com o selo "Nova"

#### Scenario: Trilha antiga
- **WHEN** hoje é 2026-11-30 e nenhuma trilha foi incluída depois de 2026-10-31
- **THEN** a seção "Novas trilhas" não aparece

### Requirement: Primeiro acesso
Sem nenhuma resposta registrada, o Início SHALL mostrar:
- o título "Bem-vindo ao Dev Tips" e uma frase sobre como o app funciona;
- a pergunta "O que você quer estudar?", com uma opção por área do catálogo. As opções podem ser marcadas e desmarcadas, e a escolha fica salva como áreas de interesse;
- "Comece por aqui", com a primeira trilha sem pré-requisitos da ordem sugerida da primeira área de interesse (ou de Fundamentos, sem interesse) e o botão "Começar a trilha", que abre a tela da trilha;
- quando houver, a trilha seguinte a ela ("Depois:"), a primeira que tem a trilha de "Comece por aqui" como pré-requisito.

#### Scenario: Sem interesse escolhido
- **WHEN** é o primeiro acesso e nenhuma área foi escolhida
- **THEN** "Comece por aqui" mostra "Fundamentos de programação"

#### Scenario: Interesse em Backend
- **WHEN** é o primeiro acesso e o usuário marca "Backend"
- **THEN** a opção "Backend" fica marcada e "Comece por aqui" mostra a primeira trilha sem pré-requisitos da ordem sugerida de Backend

### Requirement: Áreas de interesse
As áreas de interesse SHALL ser salvas no aparelho, sem sincronizar. Começam sem nenhuma área. A aba Perfil SHALL ter a seção "Áreas de interesse", com as mesmas opções do primeiro acesso, para mudar a escolha. Se a leitura falhar ou o valor salvo for inválido, o app SHALL começar sem áreas de interesse, sem exibir erro.

#### Scenario: Mudar no Perfil
- **WHEN** o usuário marca "Mobile" na seção "Áreas de interesse" do Perfil
- **THEN** "Mobile" fica salva e passa a valer para as sugestões do Início

