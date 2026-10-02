## MODIFIED Requirements

### Requirement: Tela do tema
Tocar num tema na aba Temas SHALL abrir a tela do tema em tela cheia, sem a barra de abas, com botão de voltar. A tela SHALL mostrar o título e a descrição do tema, os frameworks (variantes) quando o tema tiver, a quantidade de cards que o usuário marcou como "sei", o total de cards do tema e a lista de decks na ordem do conteúdo.

#### Scenario: Abrir o tema
- **WHEN** o usuário toca em "O mesmo CRUD em quatro frameworks" na aba Temas
- **THEN** a tela do tema abre com o título, os 4 frameworks e os 5 decks na ordem O que vamos criar, Passo a passo, Mapa mental, Glossário, Perguntas de entrevista

#### Scenario: Voltar para os temas
- **WHEN** o usuário está na tela do tema e toca em voltar
- **THEN** volta para a aba Temas

### Requirement: Frente e verso por tipo de card
Cada tipo de card SHALL ter frente e verso próprios:

| Tipo | Frente | Verso |
|---|---|---|
| endpoint | método e caminho, e a pergunta "Qual operação do CRUD é essa e que status a API devolve?" | operação (ex.: "C · Create"), descrição, status de sucesso e de erro |
| step | "Passo N", título, "o que é" e a pergunta "Como cada framework faz isso?" | "por que importa", abas de framework e o snippet do framework selecionado |
| compare | conceito, explicação e a pergunta "Como cada stack resolve isso?" | uma linha por coluna do tema, com rótulo e valor |
| concept | termo e o convite "O que significa?" | definição |
| code | título e explicação (`body`) | snippet |
| question | a pergunta e o convite "Responda em voz alta antes de virar." | a pergunta, a resposta modelo e o snippet, quando houver |

Todo card com `origin: "supplement"` SHALL exibir o selo "Complemento" na frente e no verso.

#### Scenario: Endpoint
- **WHEN** a sessão mostra o card `POST /products` e o usuário vira
- **THEN** a frente mostra "POST" e "/products", e o verso mostra "C · Create", "Cria um produto", "201" e "400"

#### Scenario: Passo
- **WHEN** a sessão mostra o Passo 7 e o usuário vira
- **THEN** a frente mostra "Passo 7" e "C: Criar produto", e o verso mostra as abas Express, Spring Boot, NestJS e FastAPI com o código do framework selecionado

#### Scenario: Comparação
- **WHEN** a sessão mostra o card "DTO" do mapa mental e o usuário vira
- **THEN** o verso mostra as linhas Frontend, Spring Boot, Express, NestJS e FastAPI com seus valores

#### Scenario: Conceito
- **WHEN** a sessão mostra o termo "CORS" e o usuário vira
- **THEN** o verso mostra a definição de CORS

#### Scenario: Complemento
- **WHEN** a sessão mostra o card `docker-compose`
- **THEN** o selo "Complemento" aparece, e o verso mostra o snippet do `docker-compose.yml`

#### Scenario: Pergunta de entrevista
- **WHEN** a sessão mostra o card `put-vs-patch` e o usuário vira
- **THEN** a frente mostra "Qual a diferença entre PUT e PATCH?" e o selo "Complemento", e o verso mostra a resposta modelo e o snippet com os dois comandos `curl`
