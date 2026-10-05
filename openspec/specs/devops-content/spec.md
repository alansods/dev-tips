# devops-content Specification

## Purpose
Define as trilhas de CI/CD e AWS da área "DevOps e Cloud": quais são, em que seção cada uma aparece, como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilhas de DevOps e Cloud no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem logo depois de `react-native`, cada uma em `content/tracks/<id>/track.json`, todas com `areas: ["devops"]`, diretas na área (sem `language`, `framework` nem `variants`) e com a seção indicada:

| id | Título | Seção |
|---|---|---|
| `ci-cd-essencial` | CI/CD essencial | `ci-cd` |
| `github-actions` | GitHub Actions | `ci-cd` |
| `aws-essencial` | AWS essencial | `aws` |
| `deploy-na-aws` | Deploy na AWS | `aws` |

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 4 trilhas, nessa ordem, logo depois de `react-native`, todas na área DevOps e Cloud, diretas na área e com a seção da tabela

#### Scenario: Área DevOps e Cloud
- **WHEN** o usuário abre a área DevOps e Cloud
- **THEN** a seção "CI/CD" mostra CI/CD essencial e GitHub Actions, depois a seção "AWS" mostra AWS essencial e Deploy na AWS, e as seções "Trilhas", "Linguagens" e "Comparativos" não aparecem

### Requirement: Decks das trilhas de DevOps e Cloud
Cada trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards por trilha. Os decks de conteúdo SHALL ser:

| Trilha | Decks de conteúdo (id: título) |
|---|---|
| ci-cd-essencial | `pipeline-e-etapas`: Pipeline e etapas; `testes-e-artefatos`: Testes, artefatos e versões; `estrategias-de-deploy`: Estratégias de deploy |
| github-actions | `workflows-e-jobs`: Workflows e jobs; `segredos-cache-e-matriz`: Segredos, cache e matriz; `deploy-e-ambientes`: Deploy, OIDC e ambientes |
| aws-essencial | `iam-e-conta`: IAM e conta; `computacao-e-rede`: Computação e rede; `armazenamento-e-dados`: Armazenamento e dados |
| deploy-na-aws | `containers-na-aws`: Containers na AWS; `serverless-e-borda`: Serverless e borda; `iac-e-pipeline`: Infraestrutura como código e pipeline |

Os snippets dos cards `code` SHALL usar a linguagem `yaml` (workflows e templates), `json` (políticas e configurações), `bash` (linha de comando, inclusive AWS CLI), `ts` (AWS CDK) ou `text` (Dockerfile e outros formatos).

#### Scenario: Contagem por deck
- **WHEN** cada trilha de DevOps e Cloud é carregada
- **THEN** ela tem os 4 decks na ordem da tabela, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

### Requirement: Qualidade do conteúdo de DevOps e Cloud
Todo card das trilhas de DevOps e Cloud SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

Cada trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior).

#### Scenario: Sem complementos
- **WHEN** os cards das trilhas de DevOps e Cloud são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards das trilhas de DevOps e Cloud são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis de cada trilha são contados
- **THEN** cada trilha tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução das trilhas de DevOps e Cloud
Cada trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: pipeline, runner, blue/green, canary, IAM, S3, Lambda, Fargate) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara cada trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Área em inglês
- **WHEN** o app está em inglês e o usuário abre a área DevOps e Cloud
- **THEN** o título da área é "DevOps & Cloud" e as seções aparecem como "CI/CD" e "AWS"

