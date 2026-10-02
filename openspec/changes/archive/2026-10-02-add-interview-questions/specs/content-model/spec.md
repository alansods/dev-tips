## ADDED Requirements

### Requirement: Card question
Um card `question` SHALL ter `question` (a pergunta) e `answer` (a resposta modelo), ambos não vazios. MAY ter `snippet`, que segue as mesmas regras de snippet dos outros tipos. Como todo card, MAY ter `relatedTerms`, que seguem as mesmas regras de integridade.

#### Scenario: Pergunta válida
- **WHEN** um card question tem pergunta, resposta e um snippet `sql` válido
- **THEN** a validação aceita o card

#### Scenario: Pergunta sem resposta
- **WHEN** um card question tem `answer` vazio
- **THEN** a validação rejeita o tema com erro no campo `answer`

#### Scenario: Pergunta com termo relacionado inexistente
- **WHEN** um card question lista em `relatedTerms` um id que não existe no tema
- **THEN** a validação rejeita o tema indicando a referência quebrada

## MODIFIED Requirements

### Requirement: Snippet de código
Todo snippet (em `step`, `code` ou `question`) SHALL ter `file` (rótulo de onde o código vive, ex.: `terminal`, `src/db.ts`), `language` e `code` não vazios. MAY ter `note`. `language` MUST pertencer à lista suportada: `bash`, `ts`, `js`, `java`, `python`, `sql`, `xml`, `properties`, `json`, `yaml`, `text`. O conteúdo de `code` SHALL ser preservado exatamente como escrito, incluindo quebras de linha e indentação.

#### Scenario: Linguagem não suportada
- **WHEN** um snippet tem `language: "cobol"`
- **THEN** a validação rejeita o tema com erro no campo `language` do snippet

#### Scenario: Código preservado
- **WHEN** um snippet tem código com indentação de 4 espaços e linhas em branco
- **THEN** o snippet validado tem o mesmo texto, caractere por caractere
