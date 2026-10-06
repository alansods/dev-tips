# mobile-content Specification

## Purpose
Define a trilha de React Native da área "Mobile": onde ela aparece na navegação, como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilha de React Native no catálogo
O catálogo SHALL ter a trilha `react-native` ("React Native"), registrada logo depois de `nosql`, em `content/tracks/react-native/track.json`, com `areas: ["mobile"]`, `language: "javascript"` e `framework: "react-native"`, sem `variants` nem `section`. O cadastro de linguagens e frameworks SHALL ter o framework `react-native` ("React Native") na linguagem `javascript`, depois de NestJS.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `react-native` logo depois de `nosql`, na área Mobile, com a linguagem `javascript` e o framework `react-native`

#### Scenario: Área Mobile
- **WHEN** o usuário abre a área Mobile
- **THEN** a seção "Linguagens" mostra só "JavaScript" com "2 trilhas", e as seções "Trilhas" e "Comparativos" não aparecem

#### Scenario: JavaScript no Mobile
- **WHEN** o usuário abre Mobile › JavaScript
- **THEN** a seção "Linguagem pura" não aparece e "Frameworks" mostra "React" e depois "React Native", cada um com "1 trilha"

#### Scenario: Framework React Native
- **WHEN** o usuário abre Mobile › JavaScript › React Native
- **THEN** a tela lista a trilha "React Native"

#### Scenario: React Native fora do Frontend
- **WHEN** o usuário abre Frontend › JavaScript
- **THEN** "Frameworks" não mostra "React Native"

### Requirement: Decks da trilha de React Native
A trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards. Os decks de conteúdo SHALL ser:

| id | Título |
|---|---|
| `componentes-e-estilo` | Componentes e estilo |
| `navegacao-e-expo` | Navegação e Expo |
| `performance-e-publicacao` | Performance e publicação |

Os snippets dos cards `code` SHALL usar a linguagem `ts` (inclusive componentes com JSX), `bash` para comandos de terminal ou `json` para arquivos de configuração.

#### Scenario: Contagem por deck
- **WHEN** a trilha de React Native é carregada
- **THEN** ela tem os 4 decks na ordem da tabela e o deck de entrevista por último, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

### Requirement: Qualidade do conteúdo de React Native
Todo card da trilha de React Native SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

A trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior).

#### Scenario: Sem complementos
- **WHEN** os cards da trilha de React Native são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards da trilha de React Native são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis da trilha são contados
- **THEN** ela tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução da trilha de React Native
A trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: Expo, Hermes, FlatList, bridge, OTA update) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Área em inglês
- **WHEN** o app está em inglês e o usuário abre a Home
- **THEN** o card da área aparece como "Mobile"

