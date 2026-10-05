# python-content Specification

## Purpose
Define as trilhas de Python (linguagem pura e os frameworks FastAPI e Django): onde cada uma aparece na navegação, como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilhas de Python no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem depois das trilhas de Java, cada uma em `content/tracks/<id>/track.json`:

| id | Título | Áreas | Linguagem | Framework |
|---|---|---|---|---|
| `python-essencial` | Python essencial | backend | python | — |
| `fastapi` | FastAPI | backend | python | fastapi |
| `django` | Django | backend | python | django |

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 3 trilhas, nessa ordem, logo depois de `spring-boot`, com as áreas, a linguagem e o framework da tabela

#### Scenario: Python no Backend
- **WHEN** o usuário abre Backend › Python
- **THEN** "Linguagem pura" mostra Python essencial, e "Frameworks" mostra FastAPI e Django, cada um com "1 trilha"

### Requirement: Decks das trilhas de Python
Cada trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards por trilha. Os decks de conteúdo SHALL ser:

| Trilha | Decks de conteúdo (id: título) |
|---|---|
| python-essencial | `tipos-e-colecoes`: Tipos e coleções; `funcoes-e-decorators`: Funções e decorators; `generators-e-ambiente`: Generators e ambiente |
| fastapi | `rotas-e-pydantic`: Rotas e Pydantic; `dependencias-e-async`: Dependências e async; `erros-seguranca-e-testes`: Erros, segurança e testes |
| django | `orm-e-migrations`: ORM e migrations; `views-e-urls`: Views e URLs; `drf-e-admin`: Django REST Framework e admin |

Os snippets dos cards `code` SHALL usar a linguagem `python`, ou `bash` para comandos de terminal.

#### Scenario: Contagem por deck
- **WHEN** cada trilha de Python é carregada
- **THEN** ela tem os 4 decks na ordem da tabela, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

### Requirement: Qualidade do conteúdo de Python
Todo card das trilhas de Python SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

Cada trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior).

#### Scenario: Sem complementos
- **WHEN** os cards das trilhas de Python são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards das trilhas de Python são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis de cada trilha são contados
- **THEN** cada trilha tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução das trilhas de Python
Cada trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: decorator, generator, ORM, middleware) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara cada trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Backend › Python
- **THEN** a trilha "Python essencial" aparece como "Python essentials"

