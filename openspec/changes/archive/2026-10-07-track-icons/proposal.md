## Why

Com 41 trilhas, as listas do app são só texto, e achar "a trilha de React" ou "as de Python" exige ler cada título. O design aprovado em 2026-10-07 coloca o logo oficial de cada tecnologia nas trilhas, nas linguagens e nos frameworks, colorido nos temas claro e escuro. É a base visual das próximas mudanças (aba Início e busca na aba Trilhas).

## What Changes

- **Logos no cadastro:** cada linguagem e cada framework de `content/taxonomy.json` ganha `icon`, o nome de um logo da biblioteca Simple Icons. Exemplos: `javascript`, `react`, `nextdotjs`. Para Java vale `openjdk`, porque a biblioteca não tem mais o logo do Java.
- **Ícone da própria trilha:** a trilha pode declarar `icon`, que tem precedência:
  - `{ "logo": "<nome>" }` para trilhas com marca, como Git, PostgreSQL, Redis, TypeScript e Node.js;
  - `{ "text": "AWS" }` para uma sigla, quando não existe logo.
- **Quando a trilha não declara ícone:** usa o logo do framework; sem framework, o da linguagem; sem nenhum, o ícone de traço da sua primeira área.
- **Onde aparece o ícone:**
  - cards de trilha, nas telas de área, linguagem e framework;
  - linhas de linguagem e de framework;
  - cards de área na aba Trilhas;
  - tela da trilha;
  - painéis da aba Progresso.
- **Cores:** cada logo usa a cor da marca, sobre um quadrado claro. No modo escuro, os logos com pouco contraste contra o fundo (por exemplo Next.js e Express, que são pretos) passam a usar a cor do texto.
- **Leitor de tela:** o ícone é decorativo. Os rótulos dos cards continuam iguais.
- **Logos empacotados:** só os logos usados entram no app. Um script gera esse arquivo a partir do pacote `simple-icons`.

## Capabilities

### New Capabilities

- `track-icons`: como e onde o ícone de linguagem, framework, trilha e área aparece no app, incluindo as cores em cada tema e a acessibilidade.

### Modified Capabilities

- `content-model`: novo requisito para os campos `icon` no cadastro e na trilha, a validação dos nomes de logo e a regra de qual ícone vale.

## Impact

- Conteúdo:
  - `content/taxonomy.json`: `icon` em todas as linguagens e frameworks;
  - `icon` em algumas trilhas: TypeScript, Node.js, Git, GitHub Actions, PostgreSQL, MySQL, MongoDB, Redis, AWS e Expo.
- Código:
  - `src/content/schema.ts` e `src/content/taxonomy.ts`: os campos novos;
  - `src/content/icons.ts`, novo: decide qual ícone vale para cada trilha;
  - `src/content/techIcons.generated.ts`, novo e gerado: os desenhos dos logos;
  - `scripts/generate-tech-icons.mjs`, novo: gera o arquivo acima;
  - `src/components/TechIcon.tsx`, novo: desenha o ícone;
  - `src/components/icons.tsx`: os ícones de traço das áreas;
  - telas e componentes que passam a mostrar o ícone: `TrackCard.tsx`, tela da trilha, telas de área e de linguagem, aba Progresso.
- Dependência: `simple-icons` como devDependency. Ele só é usado pelo script; o app não importa o pacote.
- Sem mudança de dados salvos, da API ou da navegação.

## Fora de escopo

- O novo layout da aba Trilhas (grade de áreas, grade de linguagens, busca e filtros), que vem na change `tracks-search`.
- Ícones no Início, que vêm na change `home-tab`.
- Estilo minimalista (monocromático), descartado no design.
