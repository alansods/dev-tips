## ADDED Requirements

### Requirement: Simulações na busca
A busca e os filtros de estado da aba Trilhas SHALL considerar as simulações como as trilhas: pelo título e pela descrição, no idioma exibido, e pelos mesmos estados. Nos resultados, as simulações SHALL aparecer sob o título "Situações-problema", depois das outras áreas. Como não têm linguagem, as simulações MUST NOT aparecer com um filtro de linguagem ativo. Tocar numa simulação dos resultados SHALL abrir a tela da simulação.

#### Scenario: Buscar uma simulação
- **WHEN** o usuário digita "notificacoes" na busca
- **THEN** a simulação "API de notificações" aparece sob o título "Situações-problema"

#### Scenario: Filtro de linguagem
- **WHEN** o filtro de JavaScript está ativo
- **THEN** nenhuma simulação aparece na lista

## MODIFIED Requirements

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
