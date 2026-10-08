## Why

O catálogo de backend cobre JavaScript, Java e Python, mas não C#/.NET nem Ruby/Rails, dois ecossistemas comuns em vagas de backend.

## What Changes

- 4 trilhas novas, com 24 cards cada (96 no total), em PT-BR e com tradução completa para inglês, todas na área Backend:
  - **C#:** C# essencial (linguagem pura) e ASP.NET Core (framework).
  - **Ruby:** Ruby essencial (linguagem pura) e Ruby on Rails (framework).
- Cadastro: linguagens C# e Ruby; frameworks ASP.NET Core e Ruby on Rails, com logos.
- Mesmo formato das trilhas de Java e Python. As trilhas tratam só o que é particular de cada linguagem; os conceitos gerais ficam em Fundamentos de programação e web, que é pré-requisito das trilhas de linguagem pura.

## Capabilities

### New Capabilities

- `csharp-content`: as 2 trilhas de C#.
- `ruby-content`: as 2 trilhas de Ruby.

### Modified Capabilities

- `content-model`: snippets aceitam as linguagens `csharp` e `ruby`.
- `database-content`: as trilhas de banco passam a vir depois das de Ruby no catálogo.

A regra de não repetir termos de Fundamentos (`web-fundamentals-content`) já vale para trilhas com `language`.

## Impact

- `content/taxonomy.json`; `content/tracks/<id>/track.json` e `translations/en.json` das 4 trilhas.
- `SNIPPET_LANGUAGES` em `src/content/schema.ts`.
- Registro em `src/content/catalog.ts` e `src/content/translations.ts`; logos regenerados em `src/content/techIcons.generated.ts`.
- Testes com `describeContentTracks` e de navegação.
