## MODIFIED Requirements

### Requirement: Home mínima
A aba Temas SHALL listar cada tema do catálogo, na ordem do catálogo. Cada tema SHALL aparecer como um card tocável com o título, a descrição, uma barra de progresso e o texto "sei/total", calculados com a mesma regra de progresso da capability `study-flow`. Tocar no card SHALL abrir a tela do tema.

#### Scenario: Lista de temas
- **WHEN** a aba Temas é exibida
- **THEN** o título "O mesmo CRUD em quatro frameworks" aparece na lista

#### Scenario: Progresso do tema na Home
- **WHEN** nenhum card do tema tem resposta registrada
- **THEN** o card do tema mostra "0/" seguido do total de cards do tema, e a barra está vazia

#### Scenario: Tocar no tema
- **WHEN** o usuário toca no card do tema
- **THEN** a tela do tema abre
