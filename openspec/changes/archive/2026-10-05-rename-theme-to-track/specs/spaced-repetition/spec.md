## RENAMED Requirements

- FROM: `### Requirement: Revisão de hoje na tela do tema`
- TO: `### Requirement: Revisão de hoje na tela da trilha`


## MODIFIED Requirements

### Requirement: Cards para revisar hoje
Os cards para revisar hoje de uma trilha SHALL ser os que têm data de revisão igual ou anterior ao dia atual, na ordem dos decks e dos cards no conteúdo. Cards nunca respondidos MUST NOT entrar. Cards agendados para depois de hoje MUST NOT entrar.

#### Scenario: Vencidos e do dia entram
- **WHEN** hoje é 2026-10-10, o card A vence em 2026-10-08, o card B em 2026-10-10 e o card C em 2026-10-11
- **THEN** os cards para revisar hoje são A e B

#### Scenario: Cards novos não entram
- **WHEN** nenhum card foi respondido
- **THEN** não há cards para revisar hoje

### Requirement: Revisão de hoje na tela da trilha
A tela da trilha SHALL mostrar um bloco "Revisão de hoje". Com cards para revisar, o bloco mostra a quantidade (ex.: "3 cards para revisar hoje") e o botão "Revisar agora". Sem cards, mostra "Nada para revisar hoje." e não mostra o botão.

#### Scenario: Com revisão pendente
- **WHEN** 3 cards da trilha estão para revisar hoje
- **THEN** a tela da trilha mostra "3 cards para revisar hoje" e o botão "Revisar agora"

#### Scenario: Sem revisão pendente
- **WHEN** nenhum card está para revisar hoje
- **THEN** a tela da trilha mostra "Nada para revisar hoje." sem o botão "Revisar agora"

### Requirement: Revisão na Home
O card da trilha na aba Trilhas SHALL mostrar "N para revisar hoje" quando houver cards para revisar hoje, e MUST NOT mostrar esse texto quando não houver.

#### Scenario: Aviso na Home
- **WHEN** 2 cards da trilha estão para revisar hoje
- **THEN** o card da trilha na Home mostra "2 para revisar hoje"

### Requirement: Sessão de revisão
Tocar em "Revisar agora" SHALL abrir uma sessão em tela cheia com o título "Revisão de hoje", contendo exatamente os cards para revisar hoje daquela trilha, com a mesma mecânica da sessão de estudo (virar, "Já sabia"/"Não sabia", abas de framework, resumo e "Revisar os que errei"). Cada resposta SHALL atualizar o progresso e o agendamento.

#### Scenario: Revisar os cards do dia
- **WHEN** 2 cards estão para revisar hoje e o usuário toca em "Revisar agora"
- **THEN** a sessão "Revisão de hoje" abre com o contador "1 / 2"

#### Scenario: Revisão concluída some do dia
- **WHEN** o usuário marca como "já sabia" todos os cards da revisão de hoje e volta para a tela da trilha
- **THEN** a tela da trilha mostra "Nada para revisar hoje."

#### Scenario: Erro na revisão continua no dia
- **WHEN** o usuário marca um card da revisão como "não sabia" e volta para a tela da trilha
- **THEN** esse card continua entre os cards para revisar hoje
