# native-modules-content Specification

## Purpose
Define a trilha "Módulos nativos no Expo": onde ela aparece na navegação (área Mobile, framework React Native), como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilha de módulos nativos no catálogo
O catálogo SHALL ter a trilha `modulos-nativos-no-expo` ("Módulos nativos no Expo"), registrada logo depois de `performance-no-nextjs`, em `content/tracks/modulos-nativos-no-expo/track.json`, com `areas: ["mobile"]`, `language: "javascript"` e `framework: "react-native"`, sem `variants` nem `section`.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `modulos-nativos-no-expo` logo depois de `performance-no-nextjs`, na área Mobile, com a linguagem `javascript` e o framework `react-native`

#### Scenario: Framework React Native
- **WHEN** o usuário abre Mobile › JavaScript › React Native
- **THEN** a tela lista "Módulos nativos no Expo" depois de "Pagamentos no app"

### Requirement: Decks da trilha de módulos nativos
A trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards. Os decks de conteúdo SHALL ser:

| id | Título |
|---|---|
| `expo-go-e-development-build` | Expo Go e development build |
| `integracoes-nativas` | Integrações nativas |
| `criar-e-manter-modulos` | Criar e manter módulos |

Os snippets dos cards `code` SHALL usar a linguagem `ts` (inclusive componentes com JSX), `js` para config plugins, `json` para o `app.json`, `bash` para comandos ou `text` para código Swift e Kotlin (o formato de conteúdo não tem `swift` nem `kotlin`).

#### Scenario: Contagem por deck
- **WHEN** a trilha é carregada
- **THEN** ela tem os 4 decks na ordem da tabela e o deck de entrevista por último, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

#### Scenario: Linguagens dos snippets
- **WHEN** os snippets da trilha são lidos
- **THEN** todos usam `ts`, `js`, `json`, `bash` ou `text`

### Requirement: Qualidade do conteúdo de módulos nativos
Todo card da trilha SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

A trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior).

#### Scenario: Sem complementos
- **WHEN** os cards da trilha são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards da trilha são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis da trilha são contados
- **THEN** ela tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução da trilha de módulos nativos
A trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: Expo Go, development build, prebuild, config plugin, autolinking, runtime version, fingerprint, SHA-1) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Mobile › JavaScript › React Native
- **THEN** a trilha aparece como "Native modules in Expo"

