## MODIFIED Requirements

### Requirement: Tela da área
Tocar numa área SHALL abrir a tela da área em tela cheia, sem a barra de abas, com botão de voltar e o nome da área como título. A tela SHALL mostrar, nesta ordem, as seções:
1. **Ordem sugerida**: todas as trilhas da área, conforme o requisito "Ordem sugerida na área";
2. **Trilhas**: as trilhas da área diretas na área (sem linguagem e não comparativas) que não declaram seção;
3. uma seção para cada seção declarada pelas trilhas diretas da área, na ordem fixa das seções (**Relacionais**, **Não relacionais**, **CI/CD** e **AWS**), com essas trilhas;
4. **Linguagens**: as linguagens que têm pelo menos uma trilha nessa área, na ordem do cadastro, cada uma com o nome e a quantidade de trilhas da linguagem nessa área (somando linguagem pura e frameworks);
5. **Comparativos**: as trilhas comparativas da área.

Seções sem itens MUST NOT aparecer. Nas seções 2 a 5, as trilhas SHALL aparecer na ordem do catálogo, como cards tocáveis com título, descrição, barra de progresso, "sei/total" e, quando houver, "N para revisar hoje". Tocar numa trilha SHALL abrir a tela da trilha, e tocar numa linguagem SHALL abrir a tela da linguagem nessa área. Uma área inexistente ou sem trilhas SHALL mostrar "Área não encontrada.".

#### Scenario: Backend com o conteúdo atual
- **WHEN** o usuário abre a área Backend
- **THEN** a tela mostra a seção "Ordem sugerida" e, abaixo dela, só a seção "Comparativos", com a trilha "O mesmo CRUD em quatro frameworks"

#### Scenario: Fundamentos com o conteúdo atual
- **WHEN** o usuário abre a área Fundamentos
- **THEN** a tela mostra a seção "Ordem sugerida" e, abaixo dela, só a seção "Trilhas", com a trilha "Fundamentos web"

#### Scenario: Área com linguagens
- **WHEN** a área Backend tem uma trilha de linguagem pura Java e uma trilha do framework Spring Boot
- **THEN** a seção "Linguagens" mostra "Java" com "2 trilhas"

#### Scenario: Abrir trilha pela área
- **WHEN** o usuário toca em "O mesmo CRUD em quatro frameworks" na área Backend
- **THEN** a tela da trilha abre

#### Scenario: Área não encontrada
- **WHEN** o app abre a área `games`
- **THEN** a tela mostra "Área não encontrada." e o botão de voltar

#### Scenario: Trilhas diretas em seções
- **WHEN** a área tem trilhas diretas com `section: "relacionais"` e outras com `section: "nao-relacionais"`
- **THEN** a tela mostra a seção "Relacionais" e depois a seção "Não relacionais", cada uma com as suas trilhas, e não mostra a seção "Trilhas"

#### Scenario: Seções CI/CD e AWS
- **WHEN** a área tem trilhas diretas com `section: "aws"` registradas antes de outras com `section: "ci-cd"`
- **THEN** a tela mostra a seção "CI/CD" e depois a seção "AWS", cada uma com as suas trilhas

## ADDED Requirements

### Requirement: Ordem sugerida na área
A seção "Ordem sugerida" da tela da área SHALL listar todas as trilhas da área, uma vez cada, numa linha do tempo. A ordem SHALL respeitar os pré-requisitos entre trilhas da mesma área: uma trilha só aparece depois dos seus pré-requisitos que também são da área. Pré-requisitos de outras áreas não contam para a ordem. Entre as trilhas que podem vir a seguir, SHALL vir primeiro a que aparece antes no catálogo.

Cada linha SHALL mostrar:
- o ícone da trilha;
- o título;
- o estado da trilha: "Concluída" (todos os cards como "já sabia"), "Em andamento" (algum card respondido) ou "Não iniciada";
- "N para revisar", quando houver cards para revisar hoje.

O marcador da linha do tempo SHALL diferenciar os três estados. Tocar numa linha SHALL abrir a tela da trilha. O rótulo acessível da linha SHALL ter o título e o estado.

#### Scenario: Pré-requisito antes
- **WHEN** na área Frontend a trilha Next.js declara `prerequisites: ["react"]` e aparece antes de React no catálogo
- **THEN** na "Ordem sugerida", React aparece antes de Next.js

#### Scenario: Ordem do catálogo no empate
- **WHEN** as trilhas Vue e React só dependem de "JavaScript no navegador", e Vue vem antes de React no catálogo
- **THEN** Vue aparece antes de React na "Ordem sugerida"

#### Scenario: Pré-requisito de outra área
- **WHEN** na área Mobile a trilha React Native declara `prerequisites: ["react"]` e a trilha React não é da área Mobile
- **THEN** React Native aparece na "Ordem sugerida" de Mobile normalmente, e React não aparece

#### Scenario: Estados
- **WHEN** na área Fundamentos todos os cards de "Fundamentos web" estão como "já sabia" e "Git e colaboração" tem um card respondido
- **THEN** "Fundamentos web" aparece como "Concluída" e "Git e colaboração" como "Em andamento"

#### Scenario: Revisão pendente
- **WHEN** 2 cards da trilha CRUD estão para revisar hoje e o usuário abre a área Backend
- **THEN** a linha da trilha CRUD na "Ordem sugerida" mostra "2 para revisar"

#### Scenario: Abrir pela ordem sugerida
- **WHEN** o usuário toca na linha "Fundamentos web" da "Ordem sugerida"
- **THEN** a tela da trilha "Fundamentos web" abre
