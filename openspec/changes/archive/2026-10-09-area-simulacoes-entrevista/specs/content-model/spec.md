## ADDED Requirements

### Requirement: Simulação de entrevista
Uma entrada do catálogo SHALL ter `kind` igual a `track` (trilha) ou `simulation` (simulação de entrevista). Na interface, a área das simulações se chama "Situações-problema" e cada simulação é apresentada como um caso. Quando omitido, `kind` SHALL ser `track`.

Uma simulação SHALL declarar `scenario`, com:
- `context`: o caso apresentado pelo entrevistador, em texto não vazio;
- `stack`: uma lista não vazia de textos não vazios.

Uma simulação MUST:
- declarar `areas: ["simulacoes"]`, e nenhuma outra área;
- ter exatamente um deck;
- ter só cards `interview`;
- não declarar `language`, `framework`, `variants`, `compareColumns`, `section` nem `prerequisites` não vazio.

Uma trilha (`kind: "track"`) MUST NOT declarar `scenario`, MUST NOT estar na área `simulacoes` e MUST NOT ter cards `interview`. Na validação do catálogo, uma trilha MUST NOT ter uma simulação como pré-requisito.

#### Scenario: Simulação válida
- **WHEN** uma entrada tem `kind: "simulation"`, um `scenario` com contexto e stack, `areas: ["simulacoes"]` e um deck com dois cards `interview`
- **THEN** a validação aceita a simulação

#### Scenario: Kind omitido
- **WHEN** uma trilha não declara `kind`
- **THEN** a trilha validada tem `kind: "track"`

#### Scenario: Kind desconhecido
- **WHEN** uma entrada declara `kind: "quiz"`
- **THEN** a validação rejeita a entrada com erro no caminho `kind`

#### Scenario: Simulação sem caso
- **WHEN** uma simulação não declara `scenario`
- **THEN** a validação rejeita a simulação com erro no caminho `scenario`

#### Scenario: Stack vazia
- **WHEN** uma simulação declara `scenario.stack: []`
- **THEN** a validação rejeita a simulação com erro no caminho `scenario.stack`

#### Scenario: Simulação com dois decks
- **WHEN** uma simulação tem dois decks
- **THEN** a validação rejeita a simulação com erro no caminho `decks`

#### Scenario: Simulação em outra área
- **WHEN** uma simulação declara `areas: ["simulacoes", "backend"]`
- **THEN** a validação rejeita a simulação com erro no caminho `areas`

#### Scenario: Simulação com card de outro tipo
- **WHEN** uma simulação tem um card `concept`
- **THEN** a validação rejeita a simulação com erro no caminho desse card

#### Scenario: Simulação com linguagem
- **WHEN** uma simulação declara `language: "javascript"`
- **THEN** a validação rejeita a simulação com erro no caminho `language`

#### Scenario: Trilha na área de simulações
- **WHEN** uma trilha sem `kind` declara `areas: ["simulacoes"]`
- **THEN** a validação rejeita a trilha com erro no caminho `areas`

#### Scenario: Trilha com caso
- **WHEN** uma trilha sem `kind` declara `scenario`
- **THEN** a validação rejeita a trilha com erro no caminho `scenario`

#### Scenario: Simulação como pré-requisito
- **WHEN** a trilha `react` declara `prerequisites: ["sim-dashboard-lento"]` e `sim-dashboard-lento` é uma simulação do catálogo
- **THEN** a validação rejeita o catálogo com erro no caminho `prerequisites[0]` da trilha `react`

### Requirement: Card interview
Um card `interview` SHALL ter `question` (a pergunta do entrevistador) e `answer` (a resposta-modelo), ambos não vazios. MAY ter:
- `why`: por que a resposta funciona;
- `watchOut`: uma pegadinha, um risco ou um trade-off que a resposta precisa considerar;
- `snippet`, que segue as regras de snippet dos outros tipos.

Quando presentes, `why` e `watchOut` MUST ser não vazios. Como todo card, o `interview` SHALL ter `level` e `origin`. O card `interview` só é aceito em simulações.

#### Scenario: Interview completo
- **WHEN** um card interview numa simulação tem pergunta, resposta, `why`, `watchOut` e um snippet `sql` válido
- **THEN** a validação aceita o card

#### Scenario: Interview mínimo
- **WHEN** um card interview numa simulação tem só pergunta, resposta, `id` e `level`
- **THEN** a validação aceita o card

#### Scenario: Interview sem resposta
- **WHEN** um card interview tem `answer` vazio
- **THEN** a validação rejeita a simulação com erro no campo `answer`

#### Scenario: Atenção vazia
- **WHEN** um card interview tem `watchOut: "  "`
- **THEN** a validação rejeita a simulação com erro no campo `watchOut`

#### Scenario: Interview numa trilha
- **WHEN** uma trilha sem `kind` tem um card `interview`
- **THEN** a validação rejeita a trilha com erro no caminho desse card

## MODIFIED Requirements

### Requirement: Áreas da trilha
Toda trilha SHALL declarar `areas`, uma lista não vazia e sem repetição de áreas. As áreas válidas são, nesta ordem de exibição: `fundamentos` (Fundamentos), `git` (Git), `frontend` (Frontend), `backend` (Backend), `banco-de-dados` (Banco de dados), `mobile` (Mobile), `devops` (DevOps e Cloud) e `simulacoes` (Situações-problema). Uma trilha MAY estar em mais de uma área. A área `simulacoes` é exclusiva das simulações, conforme o requisito "Simulação de entrevista". Uma área MAY ter data de inclusão no catálogo: `simulacoes` foi incluída em 2026-10-09, e as demais áreas não têm data.

#### Scenario: Trilha sem áreas
- **WHEN** uma trilha não declara `areas` ou declara a lista vazia
- **THEN** a validação rejeita a trilha com erro no caminho `areas`

#### Scenario: Área desconhecida
- **WHEN** uma trilha declara `areas: ["games"]`
- **THEN** a validação rejeita a trilha com erro no caminho `areas[0]`

#### Scenario: Área repetida
- **WHEN** uma trilha declara `areas: ["backend", "backend"]`
- **THEN** a validação rejeita a trilha indicando a área repetida `backend`

#### Scenario: Trilha em duas áreas
- **WHEN** uma trilha declara `areas: ["frontend", "backend"]`
- **THEN** a validação aceita a trilha

#### Scenario: Área de banco de dados
- **WHEN** uma trilha declara `areas: ["banco-de-dados"]`
- **THEN** a validação aceita a trilha

#### Scenario: Áreas de mobile e DevOps
- **WHEN** uma trilha declara `areas: ["mobile"]` e outra declara `areas: ["devops"]`
- **THEN** a validação aceita as duas trilhas

#### Scenario: Área Git
- **WHEN** uma trilha declara `areas: ["git"]`
- **THEN** a validação aceita a trilha

#### Scenario: Área de simulações
- **WHEN** uma simulação declara `areas: ["simulacoes"]`
- **THEN** a validação aceita a simulação

#### Scenario: Data de inclusão das áreas
- **WHEN** as datas de inclusão das áreas são consultadas
- **THEN** só `simulacoes` tem data, igual a 2026-10-09

### Requirement: Tradução de uma trilha
Uma trilha MAY ter um arquivo de tradução para inglês em `content/tracks/<track-id>/translations/en.json`. O arquivo SHALL conter só textos exibidos, organizados por id: `title` e `description` da trilha; `scenario.context` e `scenario.stack`, quando a trilha é uma simulação (a lista traduzida MUST ter o mesmo tamanho da original); `title` e `description` de cada deck, por id do deck; e, por id do card, os campos de texto do tipo daquele card (`description`, `title`, `whatIs`, `whyItMatters`, `concept`, `explanation`, `values`, `term`, `definition`, `frontendAnalogy`, `aliases`, `body`, `question`, `answer`, `why`, `watchOut`, `tags`, e `note` dos snippets, por id de variante quando o card tem vários snippets). Rótulos de colunas de comparação MAY ser traduzidos, por id da coluna. Todos os campos são opcionais. A validação SHALL rejeitar, com o caminho do problema no relatório de erros:
- id de deck, card, variante ou coluna que não existe na trilha;
- campo que não é de texto exibido ou que não pertence ao tipo do card (ex.: `code`, `method`, `path`, `definition` num card step);
- texto vazio.

#### Scenario: Tradução válida
- **WHEN** `translations/en.json` traduz o título da trilha e a `definition` do card concept `cors`
- **THEN** a validação passa

#### Scenario: Card inexistente
- **WHEN** a tradução cita o card `nao-existe`
- **THEN** a validação falha com um erro que aponta `cards.nao-existe`

#### Scenario: Campo que não se traduz
- **WHEN** a tradução de um card step inclui `snippets.express.code`
- **THEN** a validação falha apontando esse campo

#### Scenario: Campo de outro tipo
- **WHEN** a tradução do card step `passo-1` inclui `definition`
- **THEN** a validação falha apontando `cards.passo-1.definition`

#### Scenario: Traduções do repositório validadas na suíte
- **WHEN** `npm test` roda
- **THEN** todo arquivo `translations/en.json` em `content/tracks/` é validado contra a trilha correspondente, e um erro faz a suíte falhar

#### Scenario: Tradução de uma simulação
- **WHEN** `translations/en.json` de uma simulação traduz `scenario.context`, `scenario.stack` e os campos `question`, `answer`, `why` e `watchOut` de um card `interview`
- **THEN** a validação passa

#### Scenario: Stack traduzida com tamanho diferente
- **WHEN** a simulação tem 3 itens em `scenario.stack` e a tradução tem 2
- **THEN** a validação falha apontando `scenario.stack`

#### Scenario: Campo do interview em outro tipo
- **WHEN** a tradução de um card question inclui `watchOut`
- **THEN** a validação falha apontando esse campo
