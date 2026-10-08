## MODIFIED Requirements

### Requirement: Ícone nas listas e telas
O app SHALL mostrar o ícone de cada item, segundo o requisito "Ícone de linguagem, framework e trilha" da capability `content-model`, nestes lugares:
- no card de cada trilha, nas telas de área, de linguagem e de framework: o ícone da trilha;
- na linha de cada linguagem e de cada framework: o logo da linguagem ou do framework;
- no card de cada área, na aba Trilhas: o ícone de traço da área;
- na tela da trilha, junto do título: o ícone da trilha;
- no cabeçalho de cada painel da tela Progresso: o ícone da trilha.

#### Scenario: Card de trilha com logo do framework
- **WHEN** o usuário abre a área Frontend e a trilha React aparece
- **THEN** o card da trilha React mostra o logo do React

#### Scenario: Linha de linguagem
- **WHEN** o usuário abre a área Backend
- **THEN** a linha da linguagem Java mostra o logo do OpenJDK

#### Scenario: Sigla
- **WHEN** o usuário abre a área DevOps e Cloud
- **THEN** o card da trilha "AWS essencial" mostra a sigla "AWS"

#### Scenario: Trilha sem marca
- **WHEN** o usuário abre a área Fundamentos
- **THEN** o card da trilha "Fundamentos web" mostra o ícone da área Fundamentos

#### Scenario: Card de área
- **WHEN** a aba Trilhas é exibida
- **THEN** cada card de área mostra o ícone da sua área

#### Scenario: Tela da trilha
- **WHEN** o usuário abre a tela da trilha Next.js
- **THEN** a tela mostra o logo do Next.js junto do título

#### Scenario: Painel de progresso
- **WHEN** o usuário abre a tela Progresso
- **THEN** o painel da trilha Django mostra o logo do Django no cabeçalho
