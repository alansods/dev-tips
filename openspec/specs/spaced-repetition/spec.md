# spaced-repetition Specification

## Purpose

Define quando cada card deve voltar a ser estudado (repetição espaçada por caixas) e como o app apresenta e conduz a revisão do dia.
## Requirements
### Requirement: Agendamento por caixas
Cada card respondido SHALL ter uma caixa (de 1 a 5) e uma data de revisão (dia do calendário local). Ao registrar uma resposta:
- **"Não sabia"**: o card vai para a caixa 1 e a revisão fica para o mesmo dia;
- **"Já sabia"**: o card sobe uma caixa, até no máximo a caixa 5. Um card sem caixa vai para a caixa 2. A revisão fica para hoje mais o intervalo da nova caixa: caixa 2 = 3 dias, caixa 3 = 7 dias, caixa 4 = 14 dias, caixa 5 = 30 dias.

Cards nunca respondidos MUST NOT ter agendamento.

#### Scenario: Primeiro acerto
- **WHEN** um card nunca respondido é marcado como "já sabia" no dia 2026-10-02
- **THEN** ele fica na caixa 2, com revisão em 2026-10-05

#### Scenario: Acertos seguidos
- **WHEN** um card da caixa 3 é marcado como "já sabia" no dia 2026-10-02
- **THEN** ele vai para a caixa 4, com revisão em 2026-10-16

#### Scenario: Teto da caixa 5
- **WHEN** um card da caixa 5 é marcado como "já sabia" no dia 2026-10-02
- **THEN** ele continua na caixa 5, com revisão em 2026-11-01

#### Scenario: Erro volta para a caixa 1
- **WHEN** um card da caixa 4 é marcado como "não sabia" no dia 2026-10-02
- **THEN** ele vai para a caixa 1, com revisão em 2026-10-02

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
O card de cada área na aba Trilhas SHALL mostrar "N para revisar hoje", somando os cards para revisar hoje das trilhas da área, quando houver, e MUST NOT mostrar esse texto quando não houver. O card de cada trilha nas telas de área, linguagem e framework SHALL mostrar o mesmo aviso com os cards daquela trilha.

#### Scenario: Aviso na Home
- **WHEN** 2 cards da trilha CRUD estão para revisar hoje
- **THEN** o card da área Backend na Home mostra "2 para revisar hoje"

#### Scenario: Aviso no card da trilha
- **WHEN** 2 cards da trilha CRUD estão para revisar hoje e o usuário abre a área Backend
- **THEN** o card da trilha mostra "2 para revisar hoje"

#### Scenario: Sem revisão
- **WHEN** nenhum card está para revisar hoje
- **THEN** a Home não mostra "para revisar hoje"

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

### Requirement: Agendamento salvo no aparelho
O agendamento SHALL ser salvo no aparelho junto com o progresso e restaurado ao abrir o app. Dados salvos por versões anteriores do app, que não têm agendamento, MUST continuar válidos: o progresso é mantido e o agendamento começa vazio.

#### Scenario: Agendamento mantido ao reabrir
- **WHEN** um card é marcado como "já sabia" e o app é fechado e aberto de novo
- **THEN** o card mantém a caixa e a data de revisão

#### Scenario: Dados da versão anterior
- **WHEN** o aparelho tem progresso salvo pela versão anterior, sem agendamento
- **THEN** o app abre com esse progresso e sem cards para revisar hoje

### Requirement: Revisão de todas as trilhas
O botão "Começar revisão" do Início SHALL abrir, em tela cheia, a sessão "Revisão de hoje" com exatamente os cards para revisar hoje de todas as trilhas. A sessão SHALL usar a mesma mecânica da sessão de estudo:
- virar o card;
- responder "Já sabia" ou "Não sabia";
- abas de framework da trilha de cada card;
- resumo e "Revisar os que errei".

Cada resposta SHALL atualizar o progresso e o agendamento da trilha do card. Sair da sessão SHALL voltar para o Início.

#### Scenario: Cards de várias trilhas
- **WHEN** 2 cards da trilha CRUD e 1 de Fundamentos de programação e web estão para revisar hoje e o usuário toca em "Começar revisão"
- **THEN** a sessão "Revisão de hoje" abre com o contador "1 / 3"

#### Scenario: Resposta na trilha certa
- **WHEN** na revisão de todas as trilhas o usuário marca como "já sabia" um card de Fundamentos de programação e web
- **THEN** o card fica como "já sabia" na trilha Fundamentos de programação e web e sai da revisão de hoje

#### Scenario: Nada para revisar
- **WHEN** a revisão de todas as trilhas é aberta sem cards para revisar
- **THEN** a sessão mostra o resumo vazio, sem cards

