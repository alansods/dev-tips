## MODIFIED Requirements

### Requirement: Uma notificação por dia com texto do dia
Com o lembrete ligado, o app SHALL manter agendada uma notificação por dia, no horário escolhido, para os próximos 7 dias, a partir do primeiro horário ainda não passado. O texto de cada notificação SHALL depender dos cards para revisar naquele dia, somando todas as trilhas e contando os cards cuja data de revisão é igual ou anterior a esse dia:
- com N > 0 cards: título "Dev Tips" e texto "Revisão do dia: N cards esperando por você" ("1 card esperando por você" quando N = 1);
- sem cards: título "Dev Tips" e texto "5 minutos de estudo? Continue de onde parou."

Em inglês, os textos SHALL ser "Today's review: N cards waiting for you" ("1 card waiting for you" quando N = 1) e "5 minutes of study? Pick up where you left off." O idioma é o do app no momento do agendamento.

#### Scenario: Dia com revisão
- **WHEN** hoje é 2026-10-02 às 10:00, o horário é 20:00 e 3 cards vencem até 2026-10-02
- **THEN** a notificação de 2026-10-02 às 20:00 diz "Revisão do dia: 3 cards esperando por você"

#### Scenario: Revisão futura já prevista
- **WHEN** hoje é 2026-10-02 e um card tem revisão em 2026-10-05
- **THEN** as notificações de 2026-10-02 a 2026-10-04 não contam esse card, e a de 2026-10-05 conta

#### Scenario: Dia sem revisão
- **WHEN** nenhum card vence até 2026-10-03
- **THEN** a notificação de 2026-10-03 diz "5 minutos de estudo? Continue de onde parou."

#### Scenario: Horário de hoje já passou
- **WHEN** hoje é 2026-10-02 às 21:00 e o horário é 20:00
- **THEN** a primeira notificação agendada é a de 2026-10-03 às 20:00, e há 7 notificações agendadas

#### Scenario: Texto em inglês
- **WHEN** o app está em inglês e 3 cards vencem no dia
- **THEN** a notificação desse dia diz "Today's review: 3 cards waiting for you"

#### Scenario: Um card
- **WHEN** 1 card vence no dia
- **THEN** o texto é "Revisão do dia: 1 card esperando por você"

### Requirement: Abrir pela notificação
Tocar numa notificação de lembrete SHALL abrir o app. Se houver cards para revisar no momento do toque, o app SHALL abrir a tela da trilha com mais cards para revisar (no empate, o primeiro na ordem do catálogo). Sem cards para revisar, o app SHALL abrir a aba Trilhas.

#### Scenario: Toque com revisão pendente
- **WHEN** a trilha CRUD tem 2 cards para revisar, Fundamentos web tem 5, e o usuário toca na notificação
- **THEN** o app abre a tela da trilha Fundamentos web

#### Scenario: Toque sem revisão
- **WHEN** nenhum card está para revisar e o usuário toca na notificação
- **THEN** o app abre a aba Trilhas
