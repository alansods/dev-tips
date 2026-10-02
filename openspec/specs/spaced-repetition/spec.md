# spaced-repetition Specification

## Purpose

Define quando cada card deve voltar a ser estudado (repetição espaçada por caixas) e como o app apresenta e conduz a revisão do dia.

## Requirements

### Requirement: Agendamento por caixas
Cada card respondido SHALL ter uma caixa (de 1 a 5) e uma data de revisão (dia do calendário local). Ao registrar uma resposta:
- **"Não sei"**: o card vai para a caixa 1 e a revisão fica para o mesmo dia;
- **"Sei"**: o card sobe uma caixa, até no máximo a caixa 5. Um card sem caixa vai para a caixa 2. A revisão fica para hoje mais o intervalo da nova caixa: caixa 2 = 3 dias, caixa 3 = 7 dias, caixa 4 = 14 dias, caixa 5 = 30 dias.

Cards nunca respondidos MUST NOT ter agendamento.

#### Scenario: Primeiro acerto
- **WHEN** um card nunca respondido é marcado como "sei" no dia 2026-10-02
- **THEN** ele fica na caixa 2, com revisão em 2026-10-05

#### Scenario: Acertos seguidos
- **WHEN** um card da caixa 3 é marcado como "sei" no dia 2026-10-02
- **THEN** ele vai para a caixa 4, com revisão em 2026-10-16

#### Scenario: Teto da caixa 5
- **WHEN** um card da caixa 5 é marcado como "sei" no dia 2026-10-02
- **THEN** ele continua na caixa 5, com revisão em 2026-11-01

#### Scenario: Erro volta para a caixa 1
- **WHEN** um card da caixa 4 é marcado como "não sei" no dia 2026-10-02
- **THEN** ele vai para a caixa 1, com revisão em 2026-10-02

### Requirement: Cards para revisar hoje
Os cards para revisar hoje de um tema SHALL ser os que têm data de revisão igual ou anterior ao dia atual, na ordem dos decks e dos cards no conteúdo. Cards nunca respondidos MUST NOT entrar. Cards agendados para depois de hoje MUST NOT entrar.

#### Scenario: Vencidos e do dia entram
- **WHEN** hoje é 2026-10-10, o card A vence em 2026-10-08, o card B em 2026-10-10 e o card C em 2026-10-11
- **THEN** os cards para revisar hoje são A e B

#### Scenario: Cards novos não entram
- **WHEN** nenhum card foi respondido
- **THEN** não há cards para revisar hoje

### Requirement: Revisão de hoje na tela do tema
A tela do tema SHALL mostrar um bloco "Revisão de hoje". Com cards para revisar, o bloco mostra a quantidade (ex.: "3 cards para revisar hoje") e o botão "Revisar agora". Sem cards, mostra "Nada para revisar hoje." e não mostra o botão.

#### Scenario: Com revisão pendente
- **WHEN** 3 cards do tema estão para revisar hoje
- **THEN** a tela do tema mostra "3 cards para revisar hoje" e o botão "Revisar agora"

#### Scenario: Sem revisão pendente
- **WHEN** nenhum card está para revisar hoje
- **THEN** a tela do tema mostra "Nada para revisar hoje." sem o botão "Revisar agora"

### Requirement: Revisão na Home
O card do tema na aba Temas SHALL mostrar "N para revisar hoje" quando houver cards para revisar hoje, e MUST NOT mostrar esse texto quando não houver.

#### Scenario: Aviso na Home
- **WHEN** 2 cards do tema estão para revisar hoje
- **THEN** o card do tema na Home mostra "2 para revisar hoje"

### Requirement: Sessão de revisão
Tocar em "Revisar agora" SHALL abrir uma sessão em tela cheia com o título "Revisão de hoje", contendo exatamente os cards para revisar hoje daquele tema, com a mesma mecânica da sessão de estudo (virar, "Sei"/"Não sei", abas de framework, resumo e "Revisar os que errei"). Cada resposta SHALL atualizar o progresso e o agendamento.

#### Scenario: Revisar os cards do dia
- **WHEN** 2 cards estão para revisar hoje e o usuário toca em "Revisar agora"
- **THEN** a sessão "Revisão de hoje" abre com o contador "1 / 2"

#### Scenario: Revisão concluída some do dia
- **WHEN** o usuário marca como "sei" todos os cards da revisão de hoje e volta para a tela do tema
- **THEN** a tela do tema mostra "Nada para revisar hoje."

#### Scenario: Erro na revisão continua no dia
- **WHEN** o usuário marca um card da revisão como "não sei" e volta para a tela do tema
- **THEN** esse card continua entre os cards para revisar hoje

### Requirement: Agendamento salvo no aparelho
O agendamento SHALL ser salvo no aparelho junto com o progresso e restaurado ao abrir o app. Dados salvos por versões anteriores do app, que não têm agendamento, MUST continuar válidos: o progresso é mantido e o agendamento começa vazio.

#### Scenario: Agendamento mantido ao reabrir
- **WHEN** um card é marcado como "sei" e o app é fechado e aberto de novo
- **THEN** o card mantém a caixa e a data de revisão

#### Scenario: Dados da versão anterior
- **WHEN** o aparelho tem progresso salvo pela versão anterior, sem agendamento
- **THEN** o app abre com esse progresso e sem cards para revisar hoje
