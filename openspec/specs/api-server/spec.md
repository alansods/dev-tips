# api-server Specification

## Purpose
Define a API do Dev Tips: como ela informa sua saúde, o formato único das respostas de erro e quais origens web podem chamá-la.
## Requirements
### Requirement: Verificação de saúde
A API SHALL responder `GET /health` informando o estado da própria API e do banco. Com o banco respondendo, a resposta SHALL ser `200` com `{ "status": "ok", "database": "ok" }`. Se o banco falhar, a resposta SHALL ser `503` com `{ "status": "degraded", "database": "error" }`.

#### Scenario: API e banco funcionando
- **WHEN** o cliente chama `GET /health` e o banco responde
- **THEN** a resposta é `200` com `{ "status": "ok", "database": "ok" }`

#### Scenario: Banco fora do ar
- **WHEN** o cliente chama `GET /health` e a consulta ao banco falha
- **THEN** a resposta é `503` com `{ "status": "degraded", "database": "error" }`

### Requirement: Formato único de erro
Toda resposta de erro da API SHALL ter o corpo JSON `{ "error": { "code": "<código>", "message": "<mensagem>" } }`. Uma rota inexistente SHALL responder `404` com o código `not_found`. Um erro inesperado SHALL responder `500` com o código `internal_error` e MUST NOT expor detalhes internos (mensagem original, stack trace, SQL).

#### Scenario: Rota inexistente
- **WHEN** o cliente chama `GET /nao-existe`
- **THEN** a resposta é `404` com `error.code` igual a `not_found`

#### Scenario: Erro inesperado
- **WHEN** uma rota lança um erro não previsto com a mensagem "detalhe interno"
- **THEN** a resposta é `500` com `error.code` igual a `internal_error`, e o corpo não contém "detalhe interno"

#### Scenario: Erro conhecido
- **WHEN** uma rota sinaliza um erro conhecido com status `409` e código `conflict`
- **THEN** a resposta é `409` com `error.code` igual a `conflict` e a mensagem desse erro

### Requirement: Origens permitidas (CORS)
A API SHALL permitir chamadas de navegador apenas das origens configuradas (lista separada por vírgulas). Uma origem fora da lista MUST NOT receber o cabeçalho `Access-Control-Allow-Origin`. Chamadas sem origem (o app nativo) SHALL funcionar normalmente.

#### Scenario: Origem permitida
- **WHEN** a origem configurada é `http://localhost:8081` e uma requisição chega com `Origin: http://localhost:8081`
- **THEN** a resposta traz `Access-Control-Allow-Origin: http://localhost:8081`

#### Scenario: Origem não permitida
- **WHEN** uma requisição chega com `Origin: https://site-qualquer.com`
- **THEN** a resposta não traz `Access-Control-Allow-Origin`

#### Scenario: App nativo
- **WHEN** uma requisição chega sem o cabeçalho `Origin`
- **THEN** `GET /health` responde normalmente

