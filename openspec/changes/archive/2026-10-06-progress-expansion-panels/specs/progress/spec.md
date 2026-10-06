## MODIFIED Requirements

### Requirement: Aba Progresso
A aba Progresso SHALL mostrar cada trilha do catálogo como um painel expansível. Ao abrir a aba, todos os painéis SHALL estar fechados.

O cabeçalho do painel, visível aberto ou fechado, SHALL mostrar:
- o título da trilha;
- a porcentagem de cards marcados como "já sabia", arredondada;
- uma barra com o progresso da trilha;
- um indicador de que o painel abre e fecha, anunciado para o leitor de tela como expandido ou recolhido.

Tocar no cabeçalho SHALL abrir o painel fechado ou fechar o painel aberto. Abrir um painel MUST NOT fechar os outros.

Com o painel aberto, a trilha SHALL mostrar também:
- a quantidade de cards "já sabia", "para revisar" (marcados como "não sabia") e "não vistos" (sem resposta);
- uma barra por deck, na ordem da trilha, com o título do deck, "já sabia/total" (ex.: "2/5") e as partes "já sabia" e "não sabia" com cores distintas, e uma legenda dessas cores;
- o botão "Zerar progresso".

Com o painel fechado, esse detalhe MUST NOT aparecer.

#### Scenario: Painéis começam fechados
- **WHEN** o usuário abre a aba Progresso
- **THEN** cada trilha mostra título, porcentagem e barra, e nenhuma mostra contadores, decks ou "Zerar progresso"

#### Scenario: Abrir e fechar um painel
- **WHEN** o usuário toca no cabeçalho da trilha CRUD
- **THEN** o painel aparece como expandido e mostra os contadores, os decks e "Zerar progresso"
- **WHEN** o usuário toca de novo no cabeçalho
- **THEN** o painel aparece como recolhido e o detalhe some

#### Scenario: Vários painéis abertos
- **WHEN** o usuário abre o painel da trilha CRUD e depois o de outra trilha
- **THEN** os dois painéis continuam abertos

#### Scenario: Sem progresso
- **WHEN** nenhum card tem resposta e o usuário abre o painel da trilha
- **THEN** a trilha aparece com 0%, 0 já sabia, 0 para revisar e todos os cards como não vistos

#### Scenario: Com progresso
- **WHEN** na trilha CRUD, 4 cards estão como "já sabia" e 2 como "não sabia", e o usuário abre o painel da trilha
- **THEN** o painel mostra 5% (4 de 73), 4 já sabia, 2 para revisar e 67 não vistos

#### Scenario: Porcentagem no painel fechado
- **WHEN** na trilha CRUD, 4 cards estão como "já sabia" e o painel está fechado
- **THEN** o cabeçalho mostra 5%

#### Scenario: Progresso por deck
- **WHEN** 2 cards do deck O que vamos criar estão como "já sabia" e o usuário abre o painel da trilha
- **THEN** a linha desse deck mostra "2/5"
