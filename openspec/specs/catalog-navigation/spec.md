# catalog-navigation Specification

## Purpose
Define como o usuário encontra as trilhas: a aba Trilhas lista as áreas, e cada área leva às suas trilhas, linguagens, frameworks e comparativos, conforme a posição declarada em cada trilha.
## Requirements
### Requirement: Home por áreas
A aba Trilhas SHALL listar as áreas que têm pelo menos uma trilha no catálogo, na ordem Fundamentos, Git, Frontend, Backend, Banco de dados, Mobile, DevOps e Cloud e Situações-problema. Cada área SHALL aparecer como um card tocável com:
- o nome da área;
- a quantidade de trilhas ("2 trilhas", "1 trilha"); na área Situações-problema, a quantidade de casos ("6 casos", "1 caso");
- uma barra de progresso e o texto "sei/total", somados sobre todos os cards das trilhas da área com a mesma regra de progresso da capability `study-flow`;
- quando houver, "N para revisar hoje", somando os cards vencidos das trilhas da área.

Uma trilha em duas áreas SHALL contar nas duas. Tocar no card SHALL abrir a tela da área.

#### Scenario: Áreas com o conteúdo atual
- **WHEN** a aba Trilhas é exibida com as trilhas Fundamentos web (área Fundamentos) e O mesmo CRUD em quatro frameworks (área Backend)
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
- **WHEN** o catálogo tem trilhas nas sete áreas
- **THEN** a Home mostra Fundamentos, Git, Frontend, Backend, Banco de dados, Mobile e DevOps e Cloud, nessa ordem

#### Scenario: Situações-problema por último
- **WHEN** o catálogo tem trilhas nas sete áreas e simulações
- **THEN** o card "Situações-problema" aparece depois de "DevOps e Cloud" e mostra "6 casos"

#### Scenario: Progresso das simulações
- **WHEN** o usuário marcou 3 cards de simulações como "já sabia"
- **THEN** o card "Situações-problema" mostra "3/25"

### Requirement: Tela da área
Tocar numa área SHALL abrir a tela da área em tela cheia, sem a barra de abas, com botão de voltar e o nome da área como título. A tela SHALL mostrar, nesta ordem, as seções:
1. **Ordem sugerida**: todas as trilhas da área, conforme o requisito "Ordem sugerida na área";
2. **Trilhas**: as trilhas da área diretas na área (sem linguagem e não comparativas) que não declaram seção;
3. uma seção para cada seção declarada pelas trilhas diretas da área, na ordem fixa das seções (**Relacionais**, **Não relacionais**, **CI/CD** e **AWS**), com essas trilhas;
4. **Linguagens**: as linguagens que têm pelo menos uma trilha nessa área, na ordem do cadastro, cada uma com o nome e a quantidade de trilhas da linguagem nessa área (somando linguagem pura e frameworks);
5. **Comparativos**: as trilhas comparativas da área.

Seções sem itens MUST NOT aparecer. Nas seções 2 a 5, as trilhas SHALL aparecer na ordem do catálogo, como cards tocáveis com título, descrição, barra de progresso, "sei/total" e, quando houver, "N para revisar hoje". Tocar numa trilha SHALL abrir a tela da trilha, e tocar numa linguagem SHALL abrir a tela da linguagem nessa área. Uma área inexistente ou sem trilhas SHALL mostrar "Área não encontrada.".

A área Situações-problema (`simulacoes`) é uma exceção: abaixo do título, a tela SHALL mostrar a frase "O entrevistador apresenta um problema e aprofunda a cada pergunta. Responda em voz alta, como na entrevista." e, logo depois, as simulações na ordem do catálogo, sem títulos de seção e sem "Ordem sugerida". O nome da área MUST aparecer uma única vez na tela. Cada simulação SHALL aparecer como card tocável com título, descrição, barra de progresso, "sei/total" e, quando houver, "N para revisar hoje". Tocar numa simulação SHALL abrir a tela da simulação, definida na capability `study-flow`.

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

#### Scenario: Área Situações-problema
- **WHEN** o usuário abre a área Situações-problema
- **THEN** a tela mostra o título "Situações-problema" uma única vez, a frase de introdução e os 6 casos, o primeiro sendo "Dashboard lento: de 8 s para menos de 2", e não mostra "Ordem sugerida" nem títulos de seção

#### Scenario: Abrir uma simulação
- **WHEN** o usuário toca em "Pedido e pagamento em dobro" na área Situações-problema
- **THEN** a tela da simulação abre

### Requirement: Tela da linguagem
Tocar numa linguagem SHALL abrir a tela da linguagem, com o nome da linguagem como título e o nome da área acima dele. A tela SHALL mostrar, nesta ordem, as seções:
1. **Linguagem pura**: as trilhas da linguagem nessa área sem framework;
2. **Frameworks**: os frameworks da linguagem que têm pelo menos uma trilha nessa área, na ordem do cadastro, cada um com o nome e a quantidade de trilhas.

Seções sem itens MUST NOT aparecer. Tocar num framework SHALL abrir a tela do framework. Uma linguagem sem trilhas na área SHALL mostrar "Linguagem não encontrada.".

#### Scenario: Linguagem com as duas seções
- **WHEN** o usuário abre Java na área Backend, que tem uma trilha de Java puro e uma de Spring Boot
- **THEN** a tela mostra "Linguagem pura" com a trilha de Java e "Frameworks" com "Spring Boot" e "1 trilha"

#### Scenario: Linguagem só com frameworks
- **WHEN** a linguagem não tem trilha sem framework na área
- **THEN** a seção "Linguagem pura" não aparece

### Requirement: Tela do framework
Tocar num framework SHALL abrir a tela do framework, com o nome do framework como título e "Área › Linguagem" acima dele, listando as trilhas desse framework na área, como cards de trilha. Um framework sem trilhas na área SHALL mostrar "Framework não encontrado.".

#### Scenario: Trilhas do framework
- **WHEN** o usuário abre Spring Boot em Backend › Java
- **THEN** a tela lista as trilhas da área Backend que declaram o framework Spring Boot

### Requirement: Textos da navegação
Os textos da navegação SHALL seguir o idioma do app:

| PT-BR | Inglês |
|---|---|
| Fundamentos, Git, Frontend, Backend, Banco de dados, Mobile, DevOps e Cloud, Situações-problema | Fundamentals, Git, Frontend, Backend, Databases, Mobile, DevOps & Cloud, Problem scenarios |
| Trilhas, Linguagens, Comparativos | Tracks, Languages, Comparisons |
| Relacionais, Não relacionais, CI/CD, AWS | Relational, Non-relational, CI/CD, AWS |
| Linguagem pura, Frameworks | Core language, Frameworks |
| "1 trilha", "N trilhas" | "1 track", "N tracks" |
| "1 caso", "N casos" | "1 case", "N cases" |
| O entrevistador apresenta um problema e aprofunda a cada pergunta. Responda em voz alta, como na entrevista. | The interviewer presents a problem and digs deeper with each question. Answer out loud, as you would in the interview. |
| Área não encontrada., Linguagem não encontrada., Framework não encontrado. | Area not found., Language not found., Framework not found. |

Os nomes de linguagens e frameworks SHALL ser os do cadastro nos dois idiomas.

#### Scenario: Home em inglês
- **WHEN** o app está em inglês e a aba Trilhas é exibida
- **THEN** os cards das áreas mostram "Fundamentals" e "Backend"

#### Scenario: Seção em inglês
- **WHEN** o app está em inglês e o usuário abre a área Backend
- **THEN** a seção se chama "Comparisons"

#### Scenario: Área DevOps em inglês
- **WHEN** o app está em inglês e a aba Trilhas é exibida
- **THEN** o card da área DevOps e Cloud mostra "DevOps & Cloud"

#### Scenario: Área Situações-problema em inglês
- **WHEN** o app está em inglês e a aba Trilhas é exibida
- **THEN** o card da área Situações-problema mostra "Problem scenarios" e "6 cases"

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
- **WHEN** na área Fundamentos todos os cards de "Fundamentos de programação" estão como "já sabia" e "Fundamentos web" tem um card respondido
- **THEN** "Fundamentos de programação" aparece como "Concluída" e "Fundamentos web" como "Em andamento"

#### Scenario: Revisão pendente
- **WHEN** 2 cards da trilha CRUD estão para revisar hoje e o usuário abre a área Backend
- **THEN** a linha da trilha CRUD na "Ordem sugerida" mostra "2 para revisar"

#### Scenario: Abrir pela ordem sugerida
- **WHEN** o usuário toca na linha "Fundamentos de programação" da "Ordem sugerida"
- **THEN** a tela da trilha "Fundamentos de programação" abre

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
- **WHEN** todos os cards de "Fundamentos web" estão como "já sabia" e o usuário toca em "Concluídas"
- **THEN** a lista mostra só "Fundamentos web"

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

### Requirement: Simulações na busca
A busca e os filtros de estado da aba Trilhas SHALL considerar as simulações como as trilhas: pelo título e pela descrição, no idioma exibido, e pelos mesmos estados. Nos resultados, as simulações SHALL aparecer sob o título "Situações-problema", depois das outras áreas. Como não têm linguagem, as simulações MUST NOT aparecer com um filtro de linguagem ativo. Tocar numa simulação dos resultados SHALL abrir a tela da simulação.

#### Scenario: Buscar uma simulação
- **WHEN** o usuário digita "notificacoes" na busca
- **THEN** a simulação "API de notificações" aparece sob o título "Situações-problema"

#### Scenario: Filtro de linguagem
- **WHEN** o filtro de JavaScript está ativo
- **THEN** nenhuma simulação aparece na lista

