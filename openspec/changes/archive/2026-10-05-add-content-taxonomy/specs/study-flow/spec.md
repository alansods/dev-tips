## MODIFIED Requirements

### Requirement: Tela da trilha
Tocar numa trilha em qualquer lista de trilhas SHALL abrir a tela da trilha em tela cheia, sem a barra de abas, com botão de voltar. A tela SHALL mostrar o título e a descrição da trilha, os frameworks (variantes) quando a trilha tiver, a quantidade de cards que o usuário marcou como "já sabia", o total de cards da trilha e a lista de decks na ordem do conteúdo.

#### Scenario: Abrir a trilha
- **WHEN** o usuário toca em "O mesmo CRUD em quatro frameworks" na área Backend
- **THEN** a tela da trilha abre com o título, os 4 frameworks e os 5 decks na ordem O que vamos criar, Passo a passo, Mapa mental, Glossário, Perguntas de entrevista

#### Scenario: Voltar para as trilhas
- **WHEN** o usuário abriu a trilha pela área Backend e toca em voltar
- **THEN** volta para a tela da área Backend

## ADDED Requirements

### Requirement: Nível no card
Na sessão de estudo e na revisão, a frente e o verso de todo card SHALL mostrar o nível do card como um chip ao lado do chip de tipo: "Júnior", "Pleno" ou "Sênior" em PT-BR, e "Junior", "Mid-level" ou "Senior" em inglês. O chip SHALL ser só informativo, sem ação ao tocar.

#### Scenario: Nível na frente
- **WHEN** a sessão mostra a frente de um card com `level: "pleno"`
- **THEN** o chip "Pleno" aparece ao lado do tipo do card

#### Scenario: Nível no verso
- **WHEN** o usuário vira um card com `level: "senior"`
- **THEN** o verso mostra o chip "Sênior"

#### Scenario: Nível em inglês
- **WHEN** o app está em inglês e a sessão mostra um card com `level: "pleno"`
- **THEN** o chip mostra "Mid-level"
