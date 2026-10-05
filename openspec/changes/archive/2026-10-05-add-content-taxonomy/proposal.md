## Why

O catálogo é uma lista plana de trilhas. Ela não escala para o conteúdo planejado (linguagens, frameworks, frontend e backend) e não diz ao usuário de que nível é cada assunto. Precisamos organizar as trilhas por **área → linguagem → framework**, ter um lugar próprio para trilhas que comparam várias stacks (**Comparativos**) e mostrar a **senioridade** (Júnior, Pleno, Sênior) de cada card enquanto o usuário estuda.

## What Changes

- **Áreas**: Fundamentos, Frontend e Backend, nesta ordem. Toda trilha declara uma ou mais áreas. A aba Trilhas passa a listar as **áreas**, com o progresso somado de cada uma. Áreas sem trilha não aparecem.
- **Linguagens e frameworks**: um cadastro no conteúdo (`content/taxonomy.json`) define as linguagens e os frameworks, e cada framework pertence a uma linguagem. A trilha pode declarar `language` e, opcionalmente, `framework`.
- **Navegação**:
  - Área → seções "Trilhas" (trilhas sem linguagem), "Linguagens" e "Comparativos".
  - Linguagem → seções "Linguagem pura" e "Frameworks".
  - Framework → suas trilhas.
  - Seções vazias não aparecem.
- **Comparativos**: toda trilha que declara `variants` (a mesma coisa em várias stacks) é comparativa. Ela aparece na seção Comparativos da área e não pode declarar linguagem nem framework.
- **Nível por card**: todo card passa a ter `level` (`junior`, `pleno` ou `senior`), exibido como chip na frente e no verso do card durante o estudo e a revisão. É só informativo: não existe filtro nem escolha de nível.
- **Conteúdo existente**:
  - "Fundamentos web" vai para a área Fundamentos.
  - "O mesmo CRUD em quatro frameworks" vai para Backend › Comparativos.
  - Os 100 cards ganham nível.
- **BREAKING (conteúdo)**: uma trilha sem `areas` ou um card sem `level` passam a ser rejeitados pela validação.

## Capabilities

### New Capabilities

- `catalog-navigation`: Home por áreas e telas de área, linguagem e framework, com as seções e as regras de exibição.

### Modified Capabilities

- `content-model`: áreas da trilha, cadastro de linguagens e frameworks, regra de posicionamento (comparativa, por framework, por linguagem ou direto na área) e `level` obrigatório no card.
- `app-shell`: a "Home mínima" (lista plana de trilhas) sai e é substituída pela Home por áreas de `catalog-navigation`.
- `spaced-repetition`: o aviso "N para revisar hoje" passa a aparecer somado no card da área na Home e no card de cada trilha nas telas de área, linguagem e framework.
- `study-flow`: chip de nível na frente e no verso do card. Voltar da tela da trilha leva à tela de onde o usuário veio.
- `crud-theme-content`: a trilha CRUD fica na área Backend, como comparativa.
- `web-fundamentals-content`: a trilha Fundamentos web fica na área Fundamentos.

## Impact

- Conteúdo: novo `content/taxonomy.json`; `content/tracks/*/track.json` ganham `areas`, e cada card ganha `level`.
- `src/content/` (schema, validação, catálogo, nova lógica de agrupamento), fixtures e testes.
- Rotas novas em `src/app/area/`; a aba Trilhas (`src/app/(tabs)/index.tsx`) passa a listar áreas. O card de trilha da Home é extraído para um componente reutilizável.
- `src/components/cards/` (chip de nível) e i18n (PT-BR e inglês).
- Sem mudança na API, no progresso salvo nem na sincronização. Sem novas dependências.

## Fora de escopo

- Escrever trilhas novas de linguagem ou framework. A estrutura fica pronta, e o conteúdo vem em changes próprias.
- Filtrar ou ordenar por nível, ou escolher o nível do usuário.
- Busca entre trilhas e ícones próprios por linguagem ou framework.
- Traduzir nomes de linguagens e frameworks: são nomes próprios e ficam iguais nos dois idiomas.
