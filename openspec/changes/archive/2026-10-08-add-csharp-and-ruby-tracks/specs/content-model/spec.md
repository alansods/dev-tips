## MODIFIED Requirements

### Requirement: Snippet de código
Todo snippet (em `step`, `code` ou `question`) SHALL ter `file` (rótulo de onde o código vive, ex.: `terminal`, `src/db.ts`), `language` e `code` não vazios. MAY ter `note`. `language` MUST pertencer à lista suportada: `bash`, `ts`, `js`, `java`, `python`, `csharp`, `ruby`, `sql`, `xml`, `properties`, `json`, `yaml`, `text`. O conteúdo de `code` SHALL ser preservado exatamente como escrito, incluindo quebras de linha e indentação.

#### Scenario: Linguagem não suportada
- **WHEN** um snippet tem `language: "cobol"`
- **THEN** a validação rejeita a trilha com erro no campo `language` do snippet

#### Scenario: Snippet em C# e Ruby
- **WHEN** um snippet tem `language: "csharp"` ou `language: "ruby"`
- **THEN** a validação aceita o snippet

#### Scenario: Código preservado
- **WHEN** um snippet tem código com indentação de 4 espaços e linhas em branco
- **THEN** o snippet validado tem o mesmo texto, caractere por caractere
