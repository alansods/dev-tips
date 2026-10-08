# programming-fundamentals-content Specification

## Purpose
Define a trilha "Fundamentos de programação" (os conceitos que valem para qualquer linguagem) e a regra de que as trilhas de linguagem não repetem esses conceitos.
## Requirements
### Requirement: Identidade da trilha
A trilha SHALL estar em `content/tracks/fundamentos-de-programacao/track.json`, com id `fundamentos-de-programacao`, título "Fundamentos de programação" e `areas: ["fundamentos"]`, registrada no catálogo logo depois da trilha CRUD e antes de `fundamentos-web`. Ela reúne os conceitos que valem para qualquer linguagem. A trilha MUST NOT declarar `variants`, `compareColumns`, `language`, `framework` nem `prerequisites`.

#### Scenario: Trilha no catálogo
- **WHEN** o catálogo é carregado
- **THEN** ele contém, nesta ordem, as trilhas `crud-4-frameworks`, `fundamentos-de-programacao` e `fundamentos-web`

#### Scenario: Primeira da área Fundamentos
- **WHEN** o usuário abre a área Fundamentos
- **THEN** a "Ordem sugerida" começa por "Fundamentos de programação", seguida de "Fundamentos web"

### Requirement: Decks da trilha de fundamentos de programação
A trilha SHALL ter exatamente 5 decks, nesta ordem:

| id | título | cards |
|---|---|---|
| `variaveis-e-tipos` | Variáveis e tipos | 6 `concept` |
| `fluxo-e-funcoes` | Controle de fluxo e funções | 6 `concept` |
| `orientacao-a-objetos` | Orientação a objetos | 6 `concept` |
| `memoria-e-execucao` | Memória e execução | 6 `concept` |
| `perguntas-de-entrevista` | Perguntas de entrevista | 6 `question` |

Os decks de conteúdo SHALL tratar conceitos independentes de linguagem, sem cards de código. Os termos MUST NOT repetir termos das trilhas CRUD e Fundamentos web (comparação sem diferenciar maiúsculas).

#### Scenario: Contagem por deck
- **WHEN** a trilha é carregada
- **THEN** os decks aparecem na ordem da tabela, com 6 concepts em cada deck de conteúdo e 6 questions, num total de 30 cards

#### Scenario: Sem termos repetidos entre trilhas
- **WHEN** o glossário da trilha é comparado com os das trilhas CRUD e Fundamentos web
- **THEN** nenhum termo aparece nos dois

### Requirement: Qualidade da trilha de fundamentos de programação
Todo card da trilha SHALL ter `origin: "original"` e pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha. A trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior).

#### Scenario: Sem complementos
- **WHEN** os cards da trilha são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards da trilha são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis da trilha são contados
- **THEN** há pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução da trilha de fundamentos de programação
A trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre a área Fundamentos
- **THEN** a trilha aparece como "Programming fundamentals"

### Requirement: Conceitos gerais só em Fundamentos de programação
Os conceitos que valem para qualquer linguagem (variáveis, tipagem, valor e referência, controle de fluxo, funções, escopo, closure, recursão, orientação a objetos, exceções, memória, threads) SHALL ficar na trilha Fundamentos de programação. As trilhas de uma linguagem (com `language`) SHALL tratar só o que é particular dela e MUST NOT ter card `concept` cujo termo repita um termo dessa trilha (comparação sem diferenciar maiúsculas). As trilhas `javascript-essencial`, `java-essencial`, `python-essencial`, `csharp-essencial` e `ruby-essencial` SHALL declarar `fundamentos-de-programacao` em `prerequisites`.

#### Scenario: Sem termos repetidos nas linguagens
- **WHEN** os concepts das trilhas com `language` são comparados com os da trilha Fundamentos de programação
- **THEN** nenhum termo aparece nos dois

#### Scenario: Fundamentos antes da linguagem
- **WHEN** as trilhas essenciais de JavaScript, Java, Python, C# e Ruby são carregadas
- **THEN** cada uma declara `fundamentos-de-programacao` como pré-requisito

