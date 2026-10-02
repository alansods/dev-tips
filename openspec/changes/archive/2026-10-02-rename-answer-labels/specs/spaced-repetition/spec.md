## MODIFIED Requirements

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

### Requirement: Sessão de revisão
Tocar em "Revisar agora" SHALL abrir uma sessão em tela cheia com o título "Revisão de hoje", contendo exatamente os cards para revisar hoje daquele tema, com a mesma mecânica da sessão de estudo (virar, "Já sabia"/"Não sabia", abas de framework, resumo e "Revisar os que errei"). Cada resposta SHALL atualizar o progresso e o agendamento.

#### Scenario: Revisar os cards do dia
- **WHEN** 2 cards estão para revisar hoje e o usuário toca em "Revisar agora"
- **THEN** a sessão "Revisão de hoje" abre com o contador "1 / 2"

#### Scenario: Revisão concluída some do dia
- **WHEN** o usuário marca como "já sabia" todos os cards da revisão de hoje e volta para a tela do tema
- **THEN** a tela do tema mostra "Nada para revisar hoje."

#### Scenario: Erro na revisão continua no dia
- **WHEN** o usuário marca um card da revisão como "não sabia" e volta para a tela do tema
- **THEN** esse card continua entre os cards para revisar hoje

### Requirement: Agendamento salvo no aparelho
O agendamento SHALL ser salvo no aparelho junto com o progresso e restaurado ao abrir o app. Dados salvos por versões anteriores do app, que não têm agendamento, MUST continuar válidos: o progresso é mantido e o agendamento começa vazio.

#### Scenario: Agendamento mantido ao reabrir
- **WHEN** um card é marcado como "já sabia" e o app é fechado e aberto de novo
- **THEN** o card mantém a caixa e a data de revisão

#### Scenario: Dados da versão anterior
- **WHEN** o aparelho tem progresso salvo pela versão anterior, sem agendamento
- **THEN** o app abre com esse progresso e sem cards para revisar hoje
