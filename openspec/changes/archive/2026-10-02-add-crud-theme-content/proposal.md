## Why

O app já tem o modelo de conteúdo validado (`content-model`), mas nenhum tema. O primeiro tema, "O mesmo CRUD em quatro frameworks, passo a passo", é a base de todo o MVP: as próximas changes de tela (catálogo, sessão de estudo, glossário, progresso) precisam de conteúdo real para serem construídas e testadas.

## What Changes

- Salva o material de origem, íntegro, em `content/sources/crud-4-frameworks.md`. Ele é a fonte editorial do tema.
- Cria `content/themes/crud-4-frameworks/theme.json` com:
  - 4 variantes (Express, Spring Boot, NestJS, FastAPI) e 5 colunas de comparação (Frontend, Spring Boot, Express, NestJS, FastAPI);
  - deck **O que vamos criar**: 5 cards `endpoint`;
  - deck **Passo a passo**: 16 cards `step` com os 4 snippets cada, mais 4 cards `code` de complemento intercalados após o passo a que se referem;
  - deck **Mapa mental**: 16 cards `compare`, um por linha da tabela;
  - deck **Glossário**: 24 cards `concept`.
- Os complementos (`origin: "supplement"`) cobrem as lacunas do material:
  - `docker-compose.yml`;
  - `ProductRow` + `toProduct`;
  - `pageQuerySchema` + `idParamSchema`;
  - `server.ts` do Express.
- Liga passos e endpoints ao glossário por `relatedTerms`.
- Testes específicos do tema:
  - **contagem:** nada do material ficou de fora;
  - **fidelidade:** todo texto e código marcado como `original` existe literalmente no material de origem.

## Capabilities

### New Capabilities
- `crud-theme-content`: o que o tema "CRUD em quatro frameworks" precisa conter, como os complementos são marcados e a garantia de fidelidade ao material original.

### Modified Capabilities
<!-- nenhuma: o content-model já suporta tudo o que este tema usa -->

## Impact

- Novos arquivos: `content/sources/crud-4-frameworks.md`, `content/themes/crud-4-frameworks/theme.json` e testes em `src/content/__tests__/`.
- Nenhuma mudança no schema nem em dependências.
- O gate de conteúdo já existente (`npm test`) passa a validar este tema.

## Fora de escopo

- Qualquer tela ou exibição do tema no app (changes `theme-catalog`, `study-session` etc.).
- Cards extras de entrevista que não estão no material, como PUT vs PATCH, idempotência e N+1. Eles podem vir numa change de conteúdo própria.
- Campos que o `content-model` ainda não tem (`interviewQuestion`, `frontendAnalogy` como campo separado).
- Os outros temas previstos (Fundamentos web, Banco de dados, Frontend/React, System design).
