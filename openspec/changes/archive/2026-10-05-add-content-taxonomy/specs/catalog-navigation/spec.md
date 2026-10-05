## Purpose

Define como o usuário encontra as trilhas: a aba Trilhas lista as áreas, e cada área leva às suas trilhas, linguagens, frameworks e comparativos, conforme a posição declarada em cada trilha.

## ADDED Requirements

### Requirement: Home por áreas
A aba Trilhas SHALL listar as áreas que têm pelo menos uma trilha no catálogo, na ordem Fundamentos, Frontend, Backend. Cada área SHALL aparecer como um card tocável com:
- o nome da área;
- a quantidade de trilhas ("2 trilhas", "1 trilha");
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

### Requirement: Tela da área
Tocar numa área SHALL abrir a tela da área em tela cheia, sem a barra de abas, com botão de voltar e o nome da área como título. A tela SHALL mostrar, nesta ordem, as seções:
1. **Trilhas**: as trilhas da área diretas na área (sem linguagem e não comparativas);
2. **Linguagens**: as linguagens que têm pelo menos uma trilha nessa área, na ordem do cadastro, cada uma com o nome e a quantidade de trilhas da linguagem nessa área (somando linguagem pura e frameworks);
3. **Comparativos**: as trilhas comparativas da área.

Seções sem itens MUST NOT aparecer. As trilhas SHALL aparecer na ordem do catálogo, como cards tocáveis com título, descrição, barra de progresso, "sei/total" e, quando houver, "N para revisar hoje". Tocar numa trilha SHALL abrir a tela da trilha, e tocar numa linguagem SHALL abrir a tela da linguagem nessa área. Uma área inexistente ou sem trilhas SHALL mostrar "Área não encontrada.".

#### Scenario: Backend com o conteúdo atual
- **WHEN** o usuário abre a área Backend
- **THEN** a tela mostra só a seção "Comparativos", com a trilha "O mesmo CRUD em quatro frameworks"

#### Scenario: Fundamentos com o conteúdo atual
- **WHEN** o usuário abre a área Fundamentos
- **THEN** a tela mostra só a seção "Trilhas", com a trilha "Fundamentos web"

#### Scenario: Área com linguagens
- **WHEN** a área Backend tem uma trilha de linguagem pura Java e uma trilha do framework Spring Boot
- **THEN** a seção "Linguagens" mostra "Java" com "2 trilhas"

#### Scenario: Abrir trilha pela área
- **WHEN** o usuário toca em "O mesmo CRUD em quatro frameworks" na área Backend
- **THEN** a tela da trilha abre

#### Scenario: Área não encontrada
- **WHEN** o app abre a área `mobile`
- **THEN** a tela mostra "Área não encontrada." e o botão de voltar

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
| Fundamentos, Frontend, Backend | Fundamentals, Frontend, Backend |
| Trilhas, Linguagens, Comparativos | Tracks, Languages, Comparisons |
| Linguagem pura, Frameworks | Core language, Frameworks |
| "1 trilha", "N trilhas" | "1 track", "N tracks" |
| Área não encontrada., Linguagem não encontrada., Framework não encontrado. | Area not found., Language not found., Framework not found. |

Os nomes de linguagens e frameworks SHALL ser os do cadastro nos dois idiomas.

#### Scenario: Home em inglês
- **WHEN** o app está em inglês e a aba Trilhas é exibida
- **THEN** os cards das áreas mostram "Fundamentals" e "Backend"

#### Scenario: Seção em inglês
- **WHEN** o app está em inglês e o usuário abre a área Backend
- **THEN** a seção se chama "Comparisons"
