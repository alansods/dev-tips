# Spec Delta

## MODIFIED Requirements

### Requirement: Abrir pela notificação
Tocar numa notificação de lembrete SHALL abrir o app. Se houver cards para revisar no momento do toque, o app SHALL abrir a tela da trilha com mais cards para revisar (no empate, o primeiro na ordem do catálogo). Sem cards para revisar, o app SHALL abrir a aba Início. Se o app ainda não estiver pronto para navegar no momento em que o toque é processado, o app MUST navegar assim que ficar pronto, em vez de perder a navegação.

#### Scenario: Toque com revisão pendente
- **WHEN** a trilha CRUD tem 2 cards para revisar, Fundamentos web tem 5, e o usuário toca na notificação
- **THEN** o app abre a tela da trilha Fundamentos web

#### Scenario: Toque sem revisão
- **WHEN** nenhum card está para revisar e o usuário toca na notificação
- **THEN** o app abre a aba Início

#### Scenario: Toque processado antes do app estar pronto para navegar
- **WHEN** o toque na notificação é processado num momento em que o app ainda não está pronto para navegar
- **THEN** o app não trava nem perde o toque, e navega para o destino correto assim que fica pronto
