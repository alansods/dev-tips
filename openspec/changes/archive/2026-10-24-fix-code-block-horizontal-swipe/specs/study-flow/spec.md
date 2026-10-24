## MODIFIED Requirements

### Requirement: Exibição de código
Snippets SHALL ser exibidos em fonte monoespaçada, preservando quebras de linha e indentação, sem quebra automática de linhas longas e com rolagem horizontal. Acima do código SHALL aparecer o rótulo `file`. Abaixo, quando houver, SHALL aparecer a `note`. A área do código SHALL ser reservada à rolagem: um toque ou arrasto que começa sobre o código MUST NOT virar o card, e qualquer arrasto para o lado SHALL rolar o código.

#### Scenario: Código preservado na tela
- **WHEN** o verso do Passo 3 com FastAPI é exibido
- **THEN** o texto do código na tela é idêntico ao `code` do snippet, e o rótulo `app/database.py` aparece acima dele

#### Scenario: Arrastar o código para o lado
- **WHEN** o verso mostra um código mais largo que o card e o usuário arrasta o código para o lado, mesmo num arrasto curto ou lento
- **THEN** o código rola e o verso continua visível

#### Scenario: Tocar no código
- **WHEN** o verso mostra um código e o usuário toca sobre o código
- **THEN** o verso continua visível, e tocar fora do código continua voltando para a frente
