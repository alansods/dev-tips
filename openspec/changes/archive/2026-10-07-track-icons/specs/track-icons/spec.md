## Purpose

Mostra o logo da tecnologia (ou a sigla, ou o ícone da área) ao lado das trilhas, linguagens, frameworks e áreas, para o usuário reconhecer cada item sem precisar ler o título.

## ADDED Requirements

### Requirement: Ícone nas listas e telas
O app SHALL mostrar o ícone de cada item, segundo o requisito "Ícone de linguagem, framework e trilha" da capability `content-model`, nestes lugares:
- no card de cada trilha, nas telas de área, de linguagem e de framework: o ícone da trilha;
- na linha de cada linguagem e de cada framework: o logo da linguagem ou do framework;
- no card de cada área, na aba Trilhas: o ícone de traço da área;
- na tela da trilha, junto do título: o ícone da trilha;
- no cabeçalho de cada painel da aba Progresso: o ícone da trilha.

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
- **WHEN** o usuário abre a aba Progresso
- **THEN** o painel da trilha Django mostra o logo do Django no cabeçalho

### Requirement: Cores do ícone
O logo SHALL usar a cor oficial da marca, sobre um quadrado no fundo da tela. No modo escuro, um logo cuja cor tenha contraste menor que 3:1 com esse fundo SHALL ser desenhado na cor do texto. A sigla SHALL usar a fonte mono na cor do texto. O ícone da área SHALL usar a cor de destaque, sobre o fundo de destaque suave.

#### Scenario: Logo no modo claro
- **WHEN** o tema é claro e o card da trilha React é exibido
- **THEN** o logo do React aparece na cor da marca (#61DAFB)

#### Scenario: Logo escuro no modo escuro
- **WHEN** o tema é escuro e o card da trilha Next.js é exibido
- **THEN** o logo do Next.js, que é preto, aparece na cor do texto do tema escuro

#### Scenario: Logo colorido no modo escuro
- **WHEN** o tema é escuro e o card da trilha React é exibido
- **THEN** o logo do React continua na cor da marca

### Requirement: Ícone decorativo
O ícone MUST NOT ser anunciado pelo leitor de tela nem mudar o rótulo de acessibilidade do card ou da linha onde aparece.

#### Scenario: Rótulo do card sem o ícone
- **WHEN** o leitor de tela foca o card da trilha React
- **THEN** o rótulo é o mesmo de antes (título e progresso), sem menção ao logo
