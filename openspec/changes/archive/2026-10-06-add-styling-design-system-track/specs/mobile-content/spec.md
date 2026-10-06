## MODIFIED Requirements

### Requirement: Trilha de React Native no catálogo
O catálogo SHALL ter a trilha `react-native` ("React Native"), registrada logo depois de `nosql`, em `content/tracks/react-native/track.json`, com `areas: ["mobile"]`, `language: "javascript"` e `framework: "react-native"`, sem `variants` nem `section`. O cadastro de linguagens e frameworks SHALL ter o framework `react-native` ("React Native") na linguagem `javascript`, depois de NestJS.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `react-native` logo depois de `nosql`, na área Mobile, com a linguagem `javascript` e o framework `react-native`

#### Scenario: Área Mobile
- **WHEN** o usuário abre a área Mobile
- **THEN** a seção "Linguagens" mostra só "JavaScript" com "4 trilhas", e as seções "Trilhas" e "Comparativos" não aparecem

#### Scenario: JavaScript no Mobile
- **WHEN** o usuário abre Mobile › JavaScript
- **THEN** a seção "Linguagem pura" não aparece e "Frameworks" mostra "React" com "3 trilhas" e depois "React Native" com "1 trilha"

#### Scenario: Framework React Native
- **WHEN** o usuário abre Mobile › JavaScript › React Native
- **THEN** a tela lista a trilha "React Native"

#### Scenario: React Native fora do Frontend
- **WHEN** o usuário abre Frontend › JavaScript
- **THEN** "Frameworks" não mostra "React Native"
