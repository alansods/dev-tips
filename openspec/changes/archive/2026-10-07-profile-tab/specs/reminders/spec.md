## MODIFIED Requirements

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
