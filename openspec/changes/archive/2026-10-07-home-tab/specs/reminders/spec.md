## MODIFIED Requirements

### Requirement: Abrir pela notificação
Tocar numa notificação de lembrete SHALL abrir o app. Se houver cards para revisar no momento do toque, o app SHALL abrir a tela da trilha com mais cards para revisar (no empate, o primeiro na ordem do catálogo). Sem cards para revisar, o app SHALL abrir a aba Início.

#### Scenario: Toque com revisão pendente
- **WHEN** a trilha CRUD tem 2 cards para revisar, Fundamentos web tem 5, e o usuário toca na notificação
- **THEN** o app abre a tela da trilha Fundamentos web

#### Scenario: Toque sem revisão
- **WHEN** nenhum card está para revisar e o usuário toca na notificação
- **THEN** o app abre a aba Início
