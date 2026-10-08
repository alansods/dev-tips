## MODIFIED Requirements

### Requirement: Qualidade do conteúdo de Ruby
Todo card das trilhas de Ruby SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

Cada trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior) e MUST tratar só o que é particular de Ruby e do framework, sem repetir os conceitos gerais da trilha Fundamentos de programação.

#### Scenario: Sem complementos
- **WHEN** os cards das trilhas de Ruby são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards das trilhas de Ruby são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis de cada trilha são contados
- **THEN** cada trilha tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Trilhas de Ruby no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem logo depois das trilhas de C#, cada uma em `content/tracks/<id>/track.json`:

| id | Título | Áreas | Linguagem | Framework | Pré-requisito |
|---|---|---|---|---|---|
| `ruby-essencial` | Ruby essencial | backend | ruby | — | fundamentos-de-programacao |
| `rails` | Ruby on Rails | backend | ruby | rails | ruby-essencial |

O cadastro SHALL ter a linguagem `ruby` (Ruby) depois de C#, e o framework `rails` (Ruby on Rails) nessa linguagem, depois de ASP.NET Core.

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 2 trilhas, nessa ordem, logo depois de `aspnet-core`, com as áreas, a linguagem, o framework e o pré-requisito da tabela

#### Scenario: Ruby no Backend
- **WHEN** o usuário abre Backend › Ruby
- **THEN** "Linguagem pura" mostra Ruby essencial, e "Frameworks" mostra Ruby on Rails com "1 trilha"
