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

#### Scenario: Mobile e DevOps e Cloud no fim
- **WHEN** o catálogo tem trilhas nas seis áreas
- **THEN** a Home mostra Fundamentos, Frontend, Backend, Banco de dados, Mobile e DevOps e Cloud, nessa ordem
