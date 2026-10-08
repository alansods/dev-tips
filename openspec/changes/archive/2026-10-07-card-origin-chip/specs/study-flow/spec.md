## MODIFIED Requirements

### Requirement: Nível no card
Na sessão de estudo e na revisão, a frente e o verso de todo card SHALL mostrar o nível do card como um chip ao lado do selo de origem do card: "Júnior", "Pleno" ou "Sênior" em PT-BR, e "Junior", "Mid-level" ou "Senior" em inglês. O chip SHALL ser só informativo, sem ação ao tocar.

#### Scenario: Nível na frente
- **WHEN** a sessão mostra a frente de um card com `level: "pleno"`
- **THEN** o chip "Pleno" aparece ao lado do selo de origem do card

#### Scenario: Nível no verso
- **WHEN** o usuário vira um card com `level: "senior"`
- **THEN** o verso mostra o chip "Sênior"

#### Scenario: Nível em inglês
- **WHEN** o app está em inglês e a sessão mostra um card com `level: "pleno"`
- **THEN** o chip mostra "Mid-level"

## ADDED Requirements

### Requirement: Origem do card na sessão
Na sessão de estudo e nas revisões, a frente e o verso de todo card SHALL começar pelo selo de origem: o ícone da trilha e o texto "<trilha> · <deck>", com o título da trilha e o título do deck a que o card pertence, no idioma exibido. O selo SHALL ser só informativo, sem ação ao tocar.

O tipo do card (por exemplo, "Glossário" ou "Pergunta") MUST NOT aparecer como selo. A exceção são os cards de passo, que SHALL continuar mostrando "Passo N" ao lado do selo de origem.

#### Scenario: Card de conceito
- **WHEN** a sessão mostra o card `cors` do deck Glossário da trilha CRUD
- **THEN** o card mostra o selo "O mesmo CRUD em quatro frameworks · Glossário", e nenhum selo de tipo

#### Scenario: Revisão de todas as trilhas
- **WHEN** a revisão de todas as trilhas mostra um card do deck "Compras dentro do app" da trilha "Pagamentos no app"
- **THEN** o selo mostra "Pagamentos no app · Compras dentro do app" com o ícone da trilha

#### Scenario: Card de passo
- **WHEN** a sessão mostra o passo 3 da trilha CRUD
- **THEN** o card mostra o selo de origem e também "Passo 3"

#### Scenario: Em inglês
- **WHEN** o app está em inglês e a sessão mostra o card `cors`
- **THEN** o selo mostra os títulos da trilha e do deck em inglês
