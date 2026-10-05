## Context

O motivo está em proposal.md (Why) e o comportamento nas specs (`catalog-navigation`, `content-model`, `study-flow`). Hoje:

- `trackSchema` (`src/content/schema.ts`) não tem posição nem nível. A validação de uma trilha (`validateTrack`) olha só a própria trilha.
- A aba Trilhas (`src/app/(tabs)/index.tsx`) mapeia o catálogo direto para um `ThemeCard` local, com título, descrição, progresso e revisões de hoje.
- Os builders de teste (`src/content/__fixtures__/tracks.ts`) montam todos os cards das fixtures.
- Rotas dinâmicas aninhadas já existem (`study/[trackId]/[deckId].tsx`), navegando com `href` em string.

## Goals / Non-Goals

**Goals:**
- Uma única fonte para a posição de cada trilha: os campos da própria trilha. Não existe uma lista paralela "quem está em qual seção".
- Lógica de agrupamento pura e testável sem UI. As telas só desenham o resultado.

**Non-Goals:**
- Conteúdo novo de linguagem ou framework.
- Mudar progresso, revisão ou sincronização.

## Decisions

### 1. Áreas são uma lista fixa no código; linguagens e frameworks são conteúdo
As áreas (`fundamentos`, `frontend`, `backend`) entram no schema como `enum`, com os nomes em i18n. Elas são a estrutura do produto, mudam raramente e precisam de tradução. Linguagens e frameworks crescem com o conteúdo, por isso vão para `content/taxonomy.json`, validado por um `taxonomySchema` (Zod). Os nomes deles são próprios e não são traduzidos.
*Alternativa descartada:* pôr as áreas também no `taxonomy.json`. Isso exigiria um esquema de tradução para o cadastro, só para traduzir três palavras.

### 2. "Comparativa" é derivada de `variants`, sem campo próprio
Uma trilha que declara `variants` já é, por definição, a mesma coisa em várias stacks. Um campo `kind: "comparison"` poderia contradizer o `variants`. Uma função pura `placementOf(track)` devolve a posição: `{ kind: 'comparison' } | { kind: 'framework', language, framework } | { kind: 'language', language } | { kind: 'direct' }`.

### 3. Referências ao cadastro validadas junto da trilha, com o cadastro injetável
`validateTrack(input, taxonomy = repoTaxonomy)` ganha uma terceira passada, `checkPlacement`, que roda depois da estrutura e da integridade:
- linguagem e framework existem no cadastro;
- o framework pertence à linguagem;
- uma trilha comparativa não tem linguagem.

Os testes passam um cadastro de fixture. O app e o gate do repositório usam o cadastro real. As regras que não dependem do cadastro (área repetida, framework sem `language`, comparativa com linguagem) ficam na passada de integridade, que roda sobre o input cru e reporta esses erros mesmo quando a estrutura também falhou.
*Alternativa descartada:* checar as referências só no gate do repositório. Os erros sairiam sem o caminho dentro da trilha e sem cobertura nos testes unitários de validação.

### 4. `level` obrigatório, com default nos builders de teste
`level: z.enum(['junior','pleno','senior'])` entra no `cardBase`. Os builders das fixtures passam a incluir `level: 'junior'`. Assim os testes atuais continuam válidos sem tocar em cada caso, e os cenários de "sem nível" e "nível inválido" removem ou trocam o campo explicitamente.

### 5. Agrupamento em `src/content/navigation.ts`, com funções puras sobre `(catalog, taxonomy)`
- `areasWithTracks(catalog)`: áreas na ordem fixa, só as que têm trilhas, cada uma com as suas trilhas.
- `areaSections(catalog, taxonomy, areaId)`: `{ direct, languages: [{language, count}], comparisons }`.
- `languageSections(catalog, taxonomy, areaId, languageId)`: `{ core, frameworks: [{framework, count}] }`.
- `frameworkTracks(catalog, areaId, languageId, frameworkId)`.

As contagens e a ordem saem daqui. O progresso somado da área reaproveita `trackStats` (`src/study/rules.ts`) e `dueCardIds` (`src/study/srs.ts`), somando trilha por trilha.

### 6. Rotas aninhadas por área
- `src/app/area/[areaId]/index.tsx`: tela da área.
- `src/app/area/[areaId]/[languageId]/index.tsx`: tela da linguagem.
- `src/app/area/[areaId]/[languageId]/[frameworkId].tsx`: tela do framework.

Segue o mesmo padrão de `study/[trackId]/[deckId].tsx`: `href` em string e `useLocalSearchParams`. A URL carrega a área porque a mesma linguagem pode estar em várias áreas e mostra trilhas diferentes em cada uma. O voltar usa a pilha (`router.back()`, com `router.replace('/')` quando não há histórico), o que já faz a tela da trilha voltar para a área de onde veio.
*Alternativa descartada:* uma única rota genérica `browse/[...path]`, que é mais difícil de validar e de ler.

### 7. Componentes reaproveitados
- `ThemeCard` da Home é extraído para `src/components/TrackCard.tsx` e usado nas telas de área, linguagem e framework.
- Um `AreaCard` (Home) e um `NavRow` (linha tocável de linguagem ou framework com contagem) completam a lista.
- O cabeçalho de tela cheia (voltar, kicker e alternância de tema), hoje dentro de `track/[trackId].tsx`, vira `src/components/FullScreenHeader.tsx` e passa a ser usado pelas quatro telas.

### 8. Chip de nível
`LevelChip` em `src/components/cards/parts.tsx`, com o mesmo visual do `TypeChip`, renderizado por `CardFace` na linha de chips. Assim aparece na sessão e na revisão sem mudar as duas telas. Os textos ficam em `t.card.levels`.

### 9. Classificação dos 100 cards existentes
Critério usado:
- **Júnior**: definição ou uso básico (o que é HTTP/REST, verbos, status, endpoints do CRUD, passos de setup).
- **Pleno**: implementar bem (validação, DTO, tratamento de erro, CORS, autenticação, camadas, testes).
- **Sênior**: trade-offs e arquitetura (transações e consistência, idempotência, segurança avançada, escala, decisões de desenho).

A lista completa vai no PR para revisão.

## Risks / Trade-offs

- [Mais toques até a trilha: Home → Área → trilha] → Aceito pelo usuário. Com o conteúdo atual, cada área tem uma seção só. Se incomodar, uma change futura pode pular a tela da área quando ela tiver uma única trilha.
- [Telas de linguagem e framework sem conteúdo real ainda] → São cobertas por testes de tela com um catálogo de fixture (mock do catálogo e do cadastro), além dos testes das funções puras.
- [Classificação de nível subjetiva] → Critério documentado acima e lista no PR para o usuário revisar.
- [Testes de tela que partiam da Home tocando numa trilha] → Passam a tocar na área antes. Os que abrem `/track/...` direto não mudam.

## Migration Plan

Mudança só de app e conteúdo, sem dados salvos afetados. O progresso continua por `trackId:cardId`. Rollback: reverter o PR.
