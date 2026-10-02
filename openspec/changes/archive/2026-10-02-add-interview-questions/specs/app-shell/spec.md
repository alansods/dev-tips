## MODIFIED Requirements

### Requirement: Catálogo de temas no app
O app SHALL acessar os temas empacotados por um catálogo único. Todo tema em `content/themes/<theme-id>/` MUST estar registrado no catálogo, e todo tema registrado MUST existir nessa pasta. Os temas do catálogo SHALL vir com os valores padrão do schema já aplicados (`origin`, `tags`, `relatedTerms`).

#### Scenario: Tema registrado
- **WHEN** o catálogo é carregado
- **THEN** ele contém o tema `crud-4-frameworks`, com todos os decks do seu `theme.json`

#### Scenario: Pasta sem registro
- **WHEN** existe uma pasta em `content/themes/` que não está registrada no catálogo
- **THEN** a suíte de testes falha indicando o tema não registrado

#### Scenario: Padrões aplicados
- **WHEN** um card do catálogo omitia `tags` no `theme.json`
- **THEN** o card exposto pelo catálogo tem `tags` igual a lista vazia
