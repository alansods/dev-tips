## RENAMED Requirements

- FROM: `### Requirement: Progresso enquanto o app está aberto`
- TO: `### Requirement: Progresso de cada card`

## MODIFIED Requirements

### Requirement: Progresso de cada card
O progresso de cada card SHALL ser a última resposta registrada ("sei" ou "não sei"), ou nenhuma. Ele SHALL valer para todo o app: a tela do tema e a aba Temas refletem cada resposta assim que é registrada. Responder um card de novo SHALL substituir a resposta anterior. A persistência entre aberturas do app é definida pela capability `progress`.

#### Scenario: Progresso refletido na tela do tema
- **WHEN** o usuário marca 2 cards do Glossário como "sei" e volta para a tela do tema
- **THEN** o deck Glossário mostra "2/24", e o total de "sei" do tema aumentou em 2

#### Scenario: Resposta substituída
- **WHEN** um card marcado como "não sei" é marcado como "sei" numa nova sessão
- **THEN** ele passa a contar como "sei"
