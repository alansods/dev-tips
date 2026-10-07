## RENAMED Requirements

- FROM: `### Requirement: Aba Progresso`
- TO: `### Requirement: Tela Progresso`

## MODIFIED Requirements

### Requirement: Tela Progresso
A tela Progresso SHALL abrir em tela cheia, sem a barra de abas, com o botão de voltar e o título "Progresso". Ela SHALL mostrar cada trilha do catálogo como um painel expansível. Ao abrir a tela, todos os painéis SHALL estar fechados.

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
- **WHEN** o usuário abre a tela Progresso
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

### Requirement: Zerar progresso de uma trilha
Cada trilha na tela Progresso SHALL ter o botão "Zerar progresso". Tocar nele SHALL pedir confirmação na própria tela, com as opções "Zerar" e "Cancelar". Confirmar SHALL apagar todas as respostas e todo o agendamento de revisão daquela trilha (e só dela) e salvar a mudança no aparelho. A aba de framework preferida MUST ser mantida. Cancelar SHALL manter tudo como estava.

#### Scenario: Zerar com confirmação
- **WHEN** a trilha tem 4 cards como "já sabia" e o usuário toca em "Zerar progresso" e depois em "Zerar"
- **THEN** a trilha passa a mostrar 0%, e a tela da trilha mostra todos os decks com "Estudar"

#### Scenario: Cancelar
- **WHEN** o usuário toca em "Zerar progresso" e depois em "Cancelar"
- **THEN** o progresso continua igual e a confirmação some

#### Scenario: Zerar mantém outras trilhas e o framework preferido
- **WHEN** existem respostas de outra trilha e o framework preferido é FastAPI, e o usuário zera a trilha CRUD
- **THEN** as respostas da outra trilha e a preferência por FastAPI continuam salvas

#### Scenario: Zerar apaga o agendamento da trilha
- **WHEN** a trilha tem cards para revisar hoje e o usuário zera a trilha
- **THEN** a tela da trilha mostra "Nada para revisar hoje."

## ADDED Requirements

### Requirement: Dias estudados
O app SHALL guardar no aparelho os dias (do calendário local) em que o usuário respondeu pelo menos um card, mantendo os últimos 60 dias. Os dias estudados MUST NOT ser sincronizados com a conta. Se a leitura falhar ou os dados forem inválidos, o app SHALL começar sem dias estudados, sem exibir erro.

A sequência de dias seguidos SHALL ser a quantidade de dias consecutivos com estudo que termina hoje. Se ainda não houve estudo hoje, a sequência termina ontem. Sem estudo hoje nem ontem, a sequência SHALL ser 0.

#### Scenario: Responder conta o dia
- **WHEN** o usuário responde um card no dia 2026-10-07
- **THEN** 2026-10-07 fica entre os dias estudados

#### Scenario: Sequência terminando hoje
- **WHEN** houve estudo em 2026-10-05, 2026-10-06 e 2026-10-07, e hoje é 2026-10-07
- **THEN** a sequência é 3

#### Scenario: Sequência ainda vale sem estudo hoje
- **WHEN** houve estudo em 2026-10-05 e 2026-10-06, e hoje é 2026-10-07
- **THEN** a sequência é 2

#### Scenario: Sequência quebrada
- **WHEN** o último estudo foi em 2026-10-05 e hoje é 2026-10-07
- **THEN** a sequência é 0

#### Scenario: Só os últimos 60 dias
- **WHEN** há estudo registrado há 61 dias
- **THEN** esse dia não fica mais guardado

#### Scenario: Dados de quem já usava o app
- **WHEN** o app é atualizado com o último dia de estudo salvo como 2026-10-06
- **THEN** 2026-10-06 passa a contar entre os dias estudados

### Requirement: Resumo do estudo no Perfil
A seção "Seu estudo" da aba Perfil SHALL mostrar três números com os rótulos:
- "dias seguidos": a sequência do requisito "Dias estudados";
- "cards que sei": os cards marcados como "já sabia", somados em todo o catálogo;
- "trilhas iniciadas": as trilhas com pelo menos um card respondido.

#### Scenario: Sem estudo
- **WHEN** o usuário nunca respondeu um card
- **THEN** o resumo mostra 0 dias seguidos, 0 cards que sei e 0 trilhas iniciadas

#### Scenario: Com estudo
- **WHEN** o usuário estudou hoje e ontem, marcou 4 cards da trilha CRUD como "já sabia" e 1 card de Fundamentos web como "não sabia"
- **THEN** o resumo mostra 2 dias seguidos, 4 cards que sei e 2 trilhas iniciadas
