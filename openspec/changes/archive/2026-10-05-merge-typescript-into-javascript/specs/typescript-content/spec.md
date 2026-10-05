## MODIFIED Requirements

### Requirement: Trilhas de TypeScript no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem depois das trilhas de JavaScript, cada uma em `content/tracks/<id>/track.json`:

| id | Título | Áreas | Linguagem | Framework |
|---|---|---|---|---|
| `typescript-essencial` | TypeScript essencial | frontend, backend | javascript | — |
| `typescript-avancado` | TypeScript avançado | frontend, backend | javascript | — |
| `angular` | Angular | frontend | javascript | angular |
| `nestjs` | NestJS | backend | javascript | nest |

TypeScript MUST NOT ser uma linguagem separada: o cadastro de linguagens SHALL não ter `typescript`, e o cadastro de frameworks SHALL ter Angular e NestJS na linguagem `javascript`, depois de Express.

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 4 trilhas, nessa ordem, logo depois de `express`, com as áreas, a linguagem e o framework da tabela

#### Scenario: Sem linguagem TypeScript no cadastro
- **WHEN** o cadastro de linguagens e frameworks é carregado
- **THEN** ele não tem a linguagem `typescript`, e Angular e NestJS pertencem à linguagem `javascript`

#### Scenario: TypeScript no Frontend
- **WHEN** o usuário abre Frontend › JavaScript
- **THEN** "Linguagem pura" mostra TypeScript essencial e TypeScript avançado depois das trilhas de JavaScript, e "Frameworks" mostra Angular depois de Next.js

#### Scenario: TypeScript no Backend
- **WHEN** o usuário abre Backend › JavaScript
- **THEN** "Linguagem pura" mostra TypeScript essencial e TypeScript avançado depois de Node.js, e "Frameworks" mostra NestJS depois de Express

#### Scenario: Rota antiga de TypeScript
- **WHEN** o app abre a linguagem `typescript` na área Frontend ou Backend
- **THEN** a tela mostra "Linguagem não encontrada."

### Requirement: Tradução das trilhas de TypeScript
Cada trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: generics, narrowing, decorator, pipe, guard) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara cada trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Frontend › JavaScript
- **THEN** a trilha "TypeScript essencial" aparece como "TypeScript essentials"
