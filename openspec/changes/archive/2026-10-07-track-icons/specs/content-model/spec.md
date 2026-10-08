## ADDED Requirements

### Requirement: Ícone de linguagem, framework e trilha
Cada linguagem e cada framework do cadastro `content/taxonomy.json` SHALL declarar `icon`, o nome de um logo do conjunto de logos do app (nomes da biblioteca Simple Icons, por exemplo `react` e `nextdotjs`).

Uma trilha MAY declarar `icon` numa destas formas:
- `{ "logo": "<nome>" }`, um logo do conjunto;
- `{ "text": "<sigla>" }`, de 1 a 4 caracteres.

A validação MUST rejeitar um nome de logo que não esteja no conjunto, tanto no cadastro quanto na trilha.

O ícone de uma trilha SHALL ser, nesta ordem de prioridade:
1. o `icon` da própria trilha;
2. o logo do seu framework;
3. o logo da sua linguagem;
4. o ícone da sua primeira área.

#### Scenario: Logo herdado do framework
- **WHEN** a trilha Next.js declara `framework: "nextjs"`, não declara `icon`, e o framework `nextjs` tem `icon: "nextdotjs"`
- **THEN** o ícone da trilha é o logo `nextdotjs`

#### Scenario: Logo herdado da linguagem
- **WHEN** a trilha "Java essencial" declara `language: "java"`, sem framework e sem `icon`, e a linguagem `java` tem `icon: "openjdk"`
- **THEN** o ícone da trilha é o logo `openjdk`

#### Scenario: Ícone da trilha tem prioridade
- **WHEN** a trilha "TypeScript essencial" declara `language: "javascript"` e `icon: { "logo": "typescript" }`
- **THEN** o ícone da trilha é o logo `typescript`, e não o da linguagem

#### Scenario: Sigla
- **WHEN** a trilha "AWS essencial" declara `icon: { "text": "AWS" }`
- **THEN** o ícone da trilha é a sigla "AWS"

#### Scenario: Trilha sem marca
- **WHEN** a trilha "Fundamentos web" não declara `icon`, `language` nem `framework`, e sua primeira área é `fundamentos`
- **THEN** o ícone da trilha é o ícone da área Fundamentos

#### Scenario: Logo desconhecido na trilha
- **WHEN** uma trilha declara `icon: { "logo": "cobol-x" }` e esse logo não está no conjunto
- **THEN** a validação rejeita a trilha com erro no caminho `icon.logo`

#### Scenario: Sigla longa demais
- **WHEN** uma trilha declara `icon: { "text": "KUBERNETES" }`
- **THEN** a validação rejeita a trilha com erro no caminho `icon.text`

#### Scenario: Cadastro sem ícone
- **WHEN** a linguagem `python` do cadastro não declara `icon`
- **THEN** a validação rejeita o cadastro com erro em `languages[2].icon`
