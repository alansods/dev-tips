## MODIFIED Requirements

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
