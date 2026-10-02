## MODIFIED Requirements

### Requirement: Aba Progresso
A aba Progresso SHALL mostrar, para cada tema do catálogo:
- o título do tema;
- a porcentagem de cards marcados como "sei", arredondada;
- a quantidade de cards "sei", "para revisar" (marcados como "não sei") e "não vistos" (sem resposta);
- uma barra por deck, na ordem do tema, com o título do deck, "sei/total" e as partes "sei" e "não sei" com cores distintas, e uma legenda dessas cores.

#### Scenario: Sem progresso
- **WHEN** nenhum card tem resposta e o usuário abre a aba Progresso
- **THEN** o tema aparece com 0%, 0 sei, 0 para revisar e todos os cards como não vistos

#### Scenario: Com progresso
- **WHEN** no tema CRUD, 4 cards estão como "sei" e 2 como "não sei"
- **THEN** a aba mostra 5% (4 de 73), 4 sei, 2 para revisar e 67 não vistos

#### Scenario: Progresso por deck
- **WHEN** 2 cards do deck O que vamos criar estão como "sei"
- **THEN** a linha desse deck mostra "2/5"
