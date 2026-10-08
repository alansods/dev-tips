## MODIFIED Requirements

### Requirement: Qualidade do conteúdo de C#
Todo card das trilhas de C# SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

Cada trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior) e MUST tratar só o que é particular de C# e do framework, sem repetir os conceitos gerais da trilha Fundamentos de programação.

#### Scenario: Sem complementos
- **WHEN** os cards das trilhas de C# são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards das trilhas de C# são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis de cada trilha são contados
- **THEN** cada trilha tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Trilhas de C# no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem logo depois das trilhas de Python, cada uma em `content/tracks/<id>/track.json`:

| id | Título | Áreas | Linguagem | Framework | Pré-requisito |
|---|---|---|---|---|---|
| `csharp-essencial` | C# essencial | backend | csharp | — | fundamentos-de-programacao |
| `aspnet-core` | ASP.NET Core | backend | csharp | aspnet | csharp-essencial |

O cadastro SHALL ter a linguagem `csharp` (C#) depois de Python, e o framework `aspnet` (ASP.NET Core) nessa linguagem, depois de Django.

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 2 trilhas, nessa ordem, logo depois de `django`, com as áreas, a linguagem, o framework e o pré-requisito da tabela

#### Scenario: C# no Backend
- **WHEN** o usuário abre Backend › C#
- **THEN** "Linguagem pura" mostra C# essencial, e "Frameworks" mostra ASP.NET Core com "1 trilha"
