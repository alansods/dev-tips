## MODIFIED Requirements

### Requirement: Home por áreas
A aba Trilhas SHALL listar as áreas que têm pelo menos uma trilha no catálogo, na ordem Fundamentos, Frontend, Backend, Banco de dados, Mobile, DevOps e Cloud. Cada área SHALL aparecer como um card tocável com:
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

#### Scenario: Banco de dados por último
- **WHEN** o catálogo tem trilhas nas quatro áreas
- **THEN** a Home mostra Fundamentos, Frontend, Backend e Banco de dados, nessa ordem

#### Scenario: Mobile e DevOps e Cloud no fim
- **WHEN** o catálogo tem trilhas nas seis áreas
- **THEN** a Home mostra Fundamentos, Frontend, Backend, Banco de dados, Mobile e DevOps e Cloud, nessa ordem

### Requirement: Tela da área
Tocar numa área SHALL abrir a tela da área em tela cheia, sem a barra de abas, com botão de voltar e o nome da área como título. A tela SHALL mostrar, nesta ordem, as seções:
1. **Trilhas**: as trilhas da área diretas na área (sem linguagem e não comparativas) que não declaram seção;
2. uma seção para cada seção declarada pelas trilhas diretas da área, na ordem fixa das seções (**Relacionais**, **Não relacionais**, **CI/CD** e **AWS**), com essas trilhas;
3. **Linguagens**: as linguagens que têm pelo menos uma trilha nessa área, na ordem do cadastro, cada uma com o nome e a quantidade de trilhas da linguagem nessa área (somando linguagem pura e frameworks);
4. **Comparativos**: as trilhas comparativas da área.

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
- **WHEN** o app abre a área `games`
- **THEN** a tela mostra "Área não encontrada." e o botão de voltar

#### Scenario: Trilhas diretas em seções
- **WHEN** a área tem trilhas diretas com `section: "relacionais"` e outras com `section: "nao-relacionais"`
- **THEN** a tela mostra a seção "Relacionais" e depois a seção "Não relacionais", cada uma com as suas trilhas, e não mostra a seção "Trilhas"

#### Scenario: Seções CI/CD e AWS
- **WHEN** a área tem trilhas diretas com `section: "aws"` registradas antes de outras com `section: "ci-cd"`
- **THEN** a tela mostra a seção "CI/CD" e depois a seção "AWS", cada uma com as suas trilhas

### Requirement: Textos da navegação
Os textos da navegação SHALL seguir o idioma do app:

| PT-BR | Inglês |
|---|---|
| Fundamentos, Frontend, Backend, Banco de dados, Mobile, DevOps e Cloud | Fundamentals, Frontend, Backend, Databases, Mobile, DevOps & Cloud |
| Trilhas, Linguagens, Comparativos | Tracks, Languages, Comparisons |
| Relacionais, Não relacionais, CI/CD, AWS | Relational, Non-relational, CI/CD, AWS |
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

#### Scenario: Área DevOps em inglês
- **WHEN** o app está em inglês e a aba Trilhas é exibida
- **THEN** o card da área DevOps e Cloud mostra "DevOps & Cloud"
