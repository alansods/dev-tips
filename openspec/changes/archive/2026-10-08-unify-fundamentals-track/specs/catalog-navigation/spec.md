## MODIFIED Requirements

### Requirement: Home por áreas
A aba Trilhas SHALL listar as áreas que têm pelo menos uma trilha no catálogo, na ordem Fundamentos, Frontend, Backend, Banco de dados, Mobile, DevOps e Cloud. Cada área SHALL aparecer como um card tocável com:
- o nome da área;
- a quantidade de trilhas ("2 trilhas", "1 trilha");
- uma barra de progresso e o texto "sei/total", somados sobre todos os cards das trilhas da área com a mesma regra de progresso da capability `study-flow`;
- quando houver, "N para revisar hoje", somando os cards vencidos das trilhas da área.

Uma trilha em duas áreas SHALL contar nas duas. Tocar no card SHALL abrir a tela da área.

#### Scenario: Áreas com o conteúdo atual
- **WHEN** a aba Trilhas é exibida com as trilhas Fundamentos de programação e web (área Fundamentos) e O mesmo CRUD em quatro frameworks (área Backend)
- **THEN** aparecem os cards "Fundamentos" e "Backend", nessa ordem, e não aparece "Frontend"

#### Scenario: Progresso somado da área
- **WHEN** nenhum card das trilhas da área Backend tem resposta registrada
- **THEN** o card "Backend" mostra "0/" seguido do total de cards das trilhas dessa área, e a barra está vazia

#### Scenario: Trilha em duas áreas
- **WHEN** uma trilha declara as áreas Frontend e Backend
- **THEN** ela é contada nos cards das duas áreas

#### Scenario: Tocar na área
- **WHEN** o usuário toca no card "Backend"
- **THEN** a tela da área Backend abre

#### Scenario: Mobile e DevOps e Cloud no fim
- **WHEN** o catálogo tem trilhas nas seis áreas
- **THEN** a Home mostra Fundamentos, Frontend, Backend, Banco de dados, Mobile e DevOps e Cloud, nessa ordem

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
- **THEN** a tela mostra a seção "Ordem sugerida" e, abaixo dela, só a seção "Trilhas", com a trilha "Fundamentos de programação e web"

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
- **WHEN** na área Fundamentos todos os cards de "Fundamentos de programação e web" estão como "já sabia" e "Git e colaboração" tem um card respondido
- **THEN** "Fundamentos de programação e web" aparece como "Concluída" e "Git e colaboração" como "Em andamento"

#### Scenario: Revisão pendente
- **WHEN** 2 cards da trilha CRUD estão para revisar hoje e o usuário abre a área Backend
- **THEN** a linha da trilha CRUD na "Ordem sugerida" mostra "2 para revisar"

#### Scenario: Abrir pela ordem sugerida
- **WHEN** o usuário toca na linha "Fundamentos de programação e web" da "Ordem sugerida"
- **THEN** a tela da trilha "Fundamentos de programação e web" abre

### Requirement: Busca e filtros na aba Trilhas
A aba Trilhas SHALL ter, no topo:
- o campo de busca "Buscar trilha, linguagem ou tema";
- os filtros de estado "Todas" (o padrão), "Em andamento", "Não iniciadas" e "Concluídas", numa única linha que rola para o lado. "Em andamento" mostra quantas trilhas estão nesse estado.

Abaixo deles, a aba SHALL ter a seção "Por linguagem", com cada linguagem do cadastro que tem trilhas, com o logo e o nome.

Os estados seguem a ordem sugerida da área:
- **Concluída:** todos os cards como "já sabia".
- **Em andamento:** algum card respondido, sem estar concluída.
- **Não iniciada:** nenhum card respondido.

A busca SHALL ignorar acentos e maiúsculas e procurar, no idioma exibido, no título e na descrição da trilha e nos nomes da sua linguagem e do seu framework. Tocar numa linguagem SHALL filtrar as trilhas dessa linguagem (pura ou de algum framework dela), e tocar de novo SHALL tirar o filtro.

Sem critério ativo, a aba SHALL mostrar a seção "Por área", com as áreas conforme o requisito "Home por áreas", e só depois a seção "Por linguagem".

Com busca, filtro de estado ou linguagem ativos, a aba SHALL mostrar a seção "Por linguagem", para trocar ou tirar o filtro, e depois as trilhas que atendem a todos os critérios. Essas trilhas SHALL vir agrupadas pela primeira área de cada uma, com o nome da área como título, na ordem das áreas, e dentro de cada grupo na ordem do catálogo. Cada trilha MUST aparecer uma única vez. Sem nenhuma trilha, a aba SHALL mostrar "Nenhuma trilha encontrada.".

#### Scenario: Buscar sem acento
- **WHEN** o usuário digita "estilizacao" na busca
- **THEN** a trilha "Estilização e design system" aparece, e as áreas não aparecem

#### Scenario: Buscar pelo framework
- **WHEN** o usuário digita "spring"
- **THEN** a trilha "Spring Boot" aparece

#### Scenario: Sem resultado
- **WHEN** o usuário digita "cobol"
- **THEN** a aba mostra "Nenhuma trilha encontrada."

#### Scenario: Filtro em andamento
- **WHEN** a trilha React tem um card respondido e o usuário toca em "Em andamento"
- **THEN** o filtro mostra "Em andamento · 1" e a lista mostra só a trilha React

#### Scenario: Filtro concluídas
- **WHEN** todos os cards de "Fundamentos de programação e web" estão como "já sabia" e o usuário toca em "Concluídas"
- **THEN** a lista mostra só "Fundamentos de programação e web"

#### Scenario: Filtro por linguagem
- **WHEN** o usuário toca em "Python" em "Por linguagem"
- **THEN** a lista mostra as trilhas de Python, como "Python essencial", "FastAPI" e "Django", e nenhuma outra

#### Scenario: Tirar o filtro de linguagem
- **WHEN** o filtro de Python está ativo e o usuário toca de novo em "Python"
- **THEN** as áreas voltam a aparecer

#### Scenario: Busca e filtro juntos
- **WHEN** o filtro de Python está ativo e o usuário digita "api"
- **THEN** a lista mostra só "FastAPI"

#### Scenario: Áreas antes das linguagens
- **WHEN** a aba Trilhas é exibida sem critério ativo
- **THEN** a seção "Por área" aparece antes da seção "Por linguagem"

#### Scenario: Resultado agrupado por área
- **WHEN** o usuário toca em "JavaScript" em "Por linguagem"
- **THEN** as trilhas aparecem sob os títulos "Frontend", "Backend" e "Mobile", e "JavaScript essencial" aparece uma única vez, em "Frontend"
