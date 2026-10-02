# progress Specification

## Purpose

Garante que o progresso de estudo fique salvo no aparelho e possa ser acompanhado e zerado pela aba Progresso.

## Requirements

### Requirement: Progresso salvo no aparelho
As respostas registradas para cada card e a aba de framework preferida de cada tema SHALL ser salvas no aparelho a cada mudança e restauradas quando o app abre. Se a leitura falhar ou os dados salvos forem inválidos, o app SHALL abrir normalmente, sem progresso e sem exibir erro. Uma falha ao salvar MUST NOT impedir o uso do app.

#### Scenario: Progresso mantido ao reabrir
- **WHEN** o usuário marca 3 cards como "sei", fecha o app e abre de novo
- **THEN** os 3 cards continuam como "sei" e a tela do tema mostra esse progresso

#### Scenario: Framework preferido mantido ao reabrir
- **WHEN** o usuário escolhe FastAPI nos passos, fecha o app e abre de novo
- **THEN** o próximo card de passo abre com a aba FastAPI selecionada

#### Scenario: Dados salvos inválidos
- **WHEN** o conteúdo salvo no aparelho não é um progresso válido
- **THEN** o app abre sem progresso e sem erro

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
- **THEN** a aba mostra 6% (4 de 65), 4 sei, 2 para revisar e 59 não vistos

#### Scenario: Progresso por deck
- **WHEN** 2 cards do deck O que vamos criar estão como "sei"
- **THEN** a linha desse deck mostra "2/5"

### Requirement: Zerar progresso de um tema
Cada tema na aba Progresso SHALL ter o botão "Zerar progresso". Tocar nele SHALL pedir confirmação na própria tela, com as opções "Zerar" e "Cancelar". Confirmar SHALL apagar todas as respostas daquele tema (e só dele) e salvar a mudança no aparelho. A aba de framework preferida MUST ser mantida. Cancelar SHALL manter tudo como estava.

#### Scenario: Zerar com confirmação
- **WHEN** o tema tem 4 cards como "sei" e o usuário toca em "Zerar progresso" e depois em "Zerar"
- **THEN** o tema passa a mostrar 0%, e a tela do tema mostra todos os decks com "Estudar"

#### Scenario: Cancelar
- **WHEN** o usuário toca em "Zerar progresso" e depois em "Cancelar"
- **THEN** o progresso continua igual e a confirmação some

#### Scenario: Zerar mantém outros temas e o framework preferido
- **WHEN** existem respostas de outro tema e o framework preferido é FastAPI, e o usuário zera o tema CRUD
- **THEN** as respostas do outro tema e a preferência por FastAPI continuam salvas
