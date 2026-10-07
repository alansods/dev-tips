# reminders Specification

## Purpose
Lembra o usuário, uma vez por dia e só se ele quiser, de revisar os cards que vencem ou de praticar, usando notificações locais do aparelho.
## Requirements
### Requirement: Seção Lembretes
A aba Perfil SHALL mostrar, depois da seção "Idioma", a seção "Lembretes" com o interruptor "Lembrete diário" e a escolha de horário entre "Manhã 08:00", "Almoço 12:30" e "Noite 20:00". O lembrete MUST começar desligado, com "Noite 20:00" selecionado. A escolha de horário SHALL ficar disponível só com o lembrete ligado. Na web, a seção MUST NOT aparecer.

#### Scenario: Estado inicial
- **WHEN** o usuário abre a aba Perfil pela primeira vez
- **THEN** a seção "Lembretes" mostra "Lembrete diário" desligado e nenhuma notificação está agendada

#### Scenario: Horário só com o lembrete ligado
- **WHEN** o lembrete está desligado
- **THEN** as opções de horário não estão disponíveis

#### Scenario: Web
- **WHEN** o app roda na web
- **THEN** a aba Perfil não mostra a seção "Lembretes"

### Requirement: Permissão sob demanda
O app MUST NOT pedir permissão de notificação ao abrir. Ao ligar o lembrete, o app SHALL pedir a permissão se ela ainda não foi concedida. Com a permissão concedida, o lembrete fica ligado e as notificações são agendadas. Com a permissão negada, o lembrete SHALL continuar desligado e a seção SHALL mostrar "Ative as notificações nas configurações do aparelho." com o botão "Abrir ajustes", que abre os ajustes do app no sistema.

#### Scenario: Nada é pedido ao abrir
- **WHEN** o app abre com o lembrete desligado
- **THEN** a permissão de notificação não é pedida

#### Scenario: Permissão concedida
- **WHEN** o usuário liga o lembrete e concede a permissão
- **THEN** o lembrete fica ligado e há notificações agendadas no horário escolhido

#### Scenario: Permissão negada
- **WHEN** o usuário liga o lembrete e nega a permissão
- **THEN** o lembrete continua desligado e aparecem a mensagem "Ative as notificações nas configurações do aparelho." e o botão "Abrir ajustes"

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

### Requirement: Não insistir no dia estudado
Se o usuário respondeu algum card hoje, o app MUST NOT manter agendada a notificação de hoje. As notificações dos dias seguintes continuam agendadas.

#### Scenario: Estudou antes do horário
- **WHEN** o horário é 20:00, o usuário responde um card às 18:00 e o app vai para segundo plano
- **THEN** não há notificação agendada para hoje e a de amanhã continua agendada

### Requirement: Reagendamento
O app SHALL refazer o agendamento, substituindo todas as notificações anteriores, ao ligar o lembrete, ao trocar o horário, ao trocar o idioma do app, ao abrir o app e quando o app vai para segundo plano. Ao desligar o lembrete, o app SHALL cancelar todas as notificações agendadas.

#### Scenario: Trocar o horário
- **WHEN** o lembrete está ligado às 20:00 e o usuário escolhe "Manhã 08:00"
- **THEN** todas as notificações agendadas passam a ser às 08:00

#### Scenario: Trocar o idioma
- **WHEN** o lembrete está ligado e o usuário troca o idioma para "English"
- **THEN** todas as notificações agendadas passam a ter o texto em inglês

#### Scenario: Desligar
- **WHEN** o usuário desliga o lembrete
- **THEN** não há nenhuma notificação agendada

#### Scenario: Texto atualizado após revisar
- **WHEN** a notificação de amanhã dizia "Revisão do dia: 2 cards esperando por você", o usuário revisa esses 2 cards como "já sabia" e o app vai para segundo plano
- **THEN** a notificação de amanhã passa a dizer "5 minutos de estudo? Continue de onde parou."

### Requirement: Abrir pela notificação
Tocar numa notificação de lembrete SHALL abrir o app. Se houver cards para revisar no momento do toque, o app SHALL abrir a tela da trilha com mais cards para revisar (no empate, o primeiro na ordem do catálogo). Sem cards para revisar, o app SHALL abrir a aba Trilhas.

#### Scenario: Toque com revisão pendente
- **WHEN** a trilha CRUD tem 2 cards para revisar, Fundamentos web tem 5, e o usuário toca na notificação
- **THEN** o app abre a tela da trilha Fundamentos web

#### Scenario: Toque sem revisão
- **WHEN** nenhum card está para revisar e o usuário toca na notificação
- **THEN** o app abre a aba Trilhas

### Requirement: Configuração salva no aparelho
A escolha de ligado ou desligado e o horário SHALL ser salvos no aparelho e restaurados ao abrir o app. Se a leitura falhar ou os dados forem inválidos, o app SHALL abrir com o lembrete desligado, sem exibir erro. O último dia em que o usuário respondeu um card SHALL ser salvo junto com o progresso; dados de versões anteriores, sem esse dia, MUST continuar válidos.

#### Scenario: Configuração mantida ao reabrir
- **WHEN** o usuário liga o lembrete às 08:00, fecha o app e abre de novo
- **THEN** a seção mostra o lembrete ligado com "Manhã 08:00" selecionado

#### Scenario: Dados inválidos
- **WHEN** a configuração salva no aparelho não é válida
- **THEN** o app abre com o lembrete desligado e sem erro

#### Scenario: Progresso da versão anterior
- **WHEN** o aparelho tem progresso salvo pela versão anterior, sem o último dia de estudo
- **THEN** o app abre com esse progresso e o lembrete de hoje não é suprimido

