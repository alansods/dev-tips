## MODIFIED Requirements

### Requirement: Identidade da trilha
A trilha SHALL estar em `content/tracks/fundamentos-web/track.json`, com id `fundamentos-web`, título "Fundamentos de programação e web" e `areas: ["fundamentos"]`, registrada no catálogo do app depois da trilha CRUD. Ela é a única trilha de fundamentos de programação do catálogo: reúne os conceitos que valem para qualquer linguagem e os conceitos de web. A trilha MUST NOT declarar `variants`, `compareColumns`, `language` nem `framework`.

#### Scenario: Trilha no catálogo
- **WHEN** o catálogo é carregado
- **THEN** ele contém, nesta ordem, as trilhas `crud-4-frameworks` e `fundamentos-web`

#### Scenario: Trilha na área Fundamentos
- **WHEN** o usuário abre a área Fundamentos
- **THEN** o card "Fundamentos de programação e web" aparece na seção "Trilhas"

#### Scenario: Sem frameworks
- **WHEN** a tela da trilha Fundamentos de programação e web é aberta
- **THEN** ela não mostra a lista de frameworks

### Requirement: Decks e contagens
A trilha SHALL ter exatamente 8 decks, nesta ordem:

| id | título | cards |
|---|---|---|
| `variaveis-e-tipos` | Variáveis e tipos | 6 `concept` |
| `fluxo-e-funcoes` | Controle de fluxo e funções | 6 `concept` |
| `orientacao-a-objetos` | Orientação a objetos | 6 `concept` |
| `memoria-e-execucao` | Memória e execução | 6 `concept` |
| `http` | HTTP | 7 `concept` |
| `rest` | REST | 6 `concept` |
| `navegador-e-seguranca` | Navegador e segurança | 8 `concept` |
| `perguntas-de-entrevista` | Perguntas de entrevista | 12 `question` |

Os quatro primeiros decks SHALL tratar conceitos independentes de linguagem, sem cards de código. Os termos MUST NOT repetir termos da trilha CRUD (comparação sem diferenciar maiúsculas).

#### Scenario: Contagem por deck
- **WHEN** a trilha é carregada
- **THEN** os decks aparecem na ordem da tabela, com 6, 6, 6, 6, 7, 6 e 8 concepts e 12 questions, num total de 57 cards

#### Scenario: Sem termos repetidos entre trilhas
- **WHEN** os glossários das duas trilhas são comparados
- **THEN** nenhum termo aparece nos dois

### Requirement: Tradução completa para inglês
A trilha SHALL ter o arquivo `content/tracks/fundamentos-web/translations/en.json`, registrado no app. Todo texto exibido da trilha SHALL ter tradução para inglês: título e descrição da trilha, título e descrição de cada deck, e os campos de texto de cada card (`description`, `title`, `whatIs`, `whyItMatters`, `concept`, `explanation`, `term`, `definition`, `frontendAnalogy`, `body`, `question`, `answer` e `note` dos snippets). Ficam fora da cobertura: código, nomes de arquivo, `tags` (não exibidas), `aliases`. Nomes próprios e termos técnicos consagrados (ex.: HTTP, REST, Cookie, JWT) MUST ficar no original. O conteúdo em PT-BR MUST NOT mudar.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Card exibido em inglês
- **WHEN** o app está em inglês e o usuário abre o card concept "Cookie" e uma pergunta de entrevista
- **THEN** o card aparece em inglês

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre a área Fundamentos
- **THEN** a trilha aparece como "Programming and web fundamentals"

#### Scenario: PT-BR intacto
- **WHEN** o app está em PT-BR
- **THEN** a trilha aparece com o título "Fundamentos de programação e web" e os textos originais

## ADDED Requirements

### Requirement: Conceitos gerais só em Fundamentos
Os conceitos que valem para qualquer linguagem (variáveis, tipagem, valor e referência, controle de fluxo, funções, escopo, closure, recursão, orientação a objetos, exceções, memória, threads) SHALL ficar na trilha Fundamentos de programação e web. As trilhas de uma linguagem (com `language`) SHALL tratar só o que é particular dela e MUST NOT ter card `concept` cujo termo repita um termo da trilha de fundamentos (comparação sem diferenciar maiúsculas). As trilhas `javascript-essencial`, `java-essencial` e `python-essencial` SHALL declarar `fundamentos-web` em `prerequisites`.

#### Scenario: Sem termos repetidos nas linguagens
- **WHEN** os concepts das trilhas com `language` são comparados com os da trilha de fundamentos
- **THEN** nenhum termo aparece nos dois

#### Scenario: Fundamentos antes da linguagem
- **WHEN** as trilhas JavaScript essencial, Java essencial e Python essencial são carregadas
- **THEN** cada uma declara `fundamentos-web` como pré-requisito

#### Scenario: Particularidade em vez de conceito geral
- **WHEN** o usuário estuda a trilha Java essencial
- **THEN** ele não encontra cards que só expliquem o que são encapsulamento, herança, polimorfismo, stack e heap ou garbage collector, e sim os detalhes do Java sobre esses temas (ex.: modificadores de acesso, default methods, coletores da JVM)
