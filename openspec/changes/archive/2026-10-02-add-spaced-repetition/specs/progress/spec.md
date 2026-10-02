## MODIFIED Requirements

### Requirement: Zerar progresso de um tema
Cada tema na aba Progresso SHALL ter o botão "Zerar progresso". Tocar nele SHALL pedir confirmação na própria tela, com as opções "Zerar" e "Cancelar". Confirmar SHALL apagar todas as respostas e todo o agendamento de revisão daquele tema (e só dele) e salvar a mudança no aparelho. A aba de framework preferida MUST ser mantida. Cancelar SHALL manter tudo como estava.

#### Scenario: Zerar com confirmação
- **WHEN** o tema tem 4 cards como "sei" e o usuário toca em "Zerar progresso" e depois em "Zerar"
- **THEN** o tema passa a mostrar 0%, e a tela do tema mostra todos os decks com "Estudar"

#### Scenario: Cancelar
- **WHEN** o usuário toca em "Zerar progresso" e depois em "Cancelar"
- **THEN** o progresso continua igual e a confirmação some

#### Scenario: Zerar mantém outros temas e o framework preferido
- **WHEN** existem respostas de outro tema e o framework preferido é FastAPI, e o usuário zera o tema CRUD
- **THEN** as respostas do outro tema e a preferência por FastAPI continuam salvas

#### Scenario: Zerar apaga o agendamento do tema
- **WHEN** o tema tem cards para revisar hoje e o usuário zera o tema
- **THEN** a tela do tema mostra "Nada para revisar hoje."
