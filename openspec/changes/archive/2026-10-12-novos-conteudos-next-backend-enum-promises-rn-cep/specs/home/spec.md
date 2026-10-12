## MODIFIED Requirements

### Requirement: Novidades
O Início SHALL mostrar a seção "Novidades" com até 3 itens incluídos nos últimos 30 dias, do mais recente para o mais antigo. Um item pode ser:
- **uma área nova**: uma área com data de inclusão, conforme a capability `content-model`. O item mostra o ícone e o nome da área, a quantidade de trilhas ou simulações ("7 casos") e o selo "Nova área". Tocar nele SHALL abrir a tela da área;
- **uma trilha ou simulação nova**: pelo `addedAt`. O item mostra o ícone e o título, com o selo "Nova". Tocar nele SHALL abrir a tela da trilha ou da simulação.

Uma trilha ou simulação cujas áreas são todas áreas novas listadas na seção MUST NOT aparecer como item próprio, porque a área já a representa. Na mesma data, a área SHALL vir antes das trilhas, e entre trilhas vale a registrada depois. "Ver todas" SHALL abrir a aba Trilhas. Sem novidade, a seção MUST NOT aparecer.

#### Scenario: Trilha incluída há 3 dias
- **WHEN** hoje é 2026-10-07 e a trilha "Módulos nativos no Expo" foi incluída em 2026-10-06
- **THEN** ela aparece em "Novidades" com o selo "Nova"

#### Scenario: Área nova
- **WHEN** hoje é 2026-10-10, a área Situações-problema e 6 simulações foram incluídas em 2026-10-09 e uma sétima simulação será incluída em 2026-10-12
- **THEN** "Novidades" mostra primeiro o item "Situações-problema", com "7 casos" (a área conta todas as suas simulações) e o selo "Nova área", e nenhuma simulação como item próprio

#### Scenario: Abrir a área nova
- **WHEN** o usuário toca no item "Situações-problema" de "Novidades"
- **THEN** a tela da área Situações-problema abre

#### Scenario: Simulação nova numa área antiga
- **WHEN** hoje é 2026-11-20, a área Situações-problema foi incluída há mais de 30 dias e uma simulação foi incluída em 2026-11-15
- **THEN** a simulação aparece em "Novidades" com o selo "Nova", e a área não aparece

#### Scenario: Áreas sem data
- **WHEN** hoje é 2026-10-10 e as trilhas de Git foram incluídas em 2026-10-06
- **THEN** a área Git não aparece como "Nova área", porque não tem data de inclusão

#### Scenario: Trilha antiga
- **WHEN** hoje é 2026-11-30 e nenhuma área, trilha ou simulação foi incluída depois de 2026-10-31
- **THEN** a seção "Novidades" não aparece

#### Scenario: Em inglês
- **WHEN** o app está em inglês e há uma área nova
- **THEN** a seção se chama "What's new" e o selo mostra "New area"
