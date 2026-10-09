## Context

Motivação em `proposal.md` (Why). Pontos do código atual que moldam a abordagem:

- O schema Zod (`src/content/schema.ts`) valida a estrutura de cada `track.json`. As regras que cruzam partes da trilha ficam em `src/content/integrity.ts`, que roda sobre o JSON cru e já trata casos como "card step exige variants".
- O progresso, a repetição espaçada e a sincronização usam a chave `trackId:cardId` (`src/study/store.ts`, `src/sync/`). A API guarda essas chaves sem conhecer o catálogo.
- A navegação (`src/content/navigation.ts`) classifica cada trilha pela posição (`placementOf`): direta, de linguagem, de framework ou comparativa. Uma trilha sem `language`, `framework` e `variants` já é "direta".
- A tela da trilha (`src/app/track/[trackId].tsx`) lista os decks. A sessão (`src/app/study/[trackId]/[deckId].tsx`) recebe trilha e deck pela rota.
- A frente e o verso de cada tipo de card ficam em `src/components/cards/CardFace.tsx`, e as peças compartilhadas (snippet, selos, chips) ficam em `parts.tsx`.

## Goals / Non-Goals

**Goals:**
- Simulação como entrada do catálogo que reaproveita catálogo, progresso, revisão, sync, assistente, busca e traduções, sem migração de dados.
- Regras da simulação concentradas no schema e na passada de integridade, com erros pelo caminho, como as demais regras.

**Non-Goals:**
- Novo armazenamento, rota de sessão ou endpoint de API.
- Ordem fixa na sessão. O sorteio continua; só os cards `step` têm ordem própria.

## Decisions

### 1. Simulação é uma `Track` com `kind: "simulation"`
O `trackSchema` ganha `kind` (`'track' | 'simulation'`, com padrão `'track'`) e `scenario` opcional (`{ context, stack }`). Um helper `isSimulation(track)` evita espalhar comparações de string pelas telas.

- **Por quê:** o tipo `Track` atravessa o app inteiro: catálogo, `progressKey`, sync, revisão, assistente e busca. Mantê-lo faz tudo isso funcionar sem mudança, e cada simulação ocupa o mesmo espaço de ids das trilhas, o que evita colisão de chaves de progresso.
- **Alternativas descartadas:**
  - `discriminatedUnion` entre trilha e simulação no Zod: dividiria o tipo `Track` em todos os consumidores, e cada `track.decks`, `track.areas` etc. exigiria estreitar o tipo;
  - pasta e schema separados (`content/simulations/`): duplicaria catálogo, progresso, sync e revisão.

### 2. Regras da simulação na passada de integridade
As regras que dependem de `kind` (área exclusiva, deck único, só `interview`, sem posição nem pré-requisitos, `scenario` obrigatório e proibido em trilha) ficam numa função `checkSimulation` em `integrity.ts`. O schema só define a forma dos campos.

- **Por quê:** é o mesmo padrão de "step exige variants". A passada roda mesmo quando a estrutura falha, então o usuário vê todos os erros de uma vez, como pede a spec "Relatório de erros completo".
- A regra "uma trilha não tem simulação como pré-requisito" vai para a validação do catálogo, junto com a checagem de ciclo e de pré-requisito inexistente.

### 3. Card `interview` como tipo novo na união
O `interviewCardSchema` é o `question` com `why?` e `watchOut?`. A frente e o verso ficam em `CardFace.tsx`:
- a frente lê `scenario.context` da trilha, que a sessão já recebe;
- o verso reaproveita o bloco de snippet do `question` e adiciona dois blocos rotulados ("Por que funciona" e "Atenção"). "Atenção" usa o acento laranja já usado para "revisar".

- **Alternativa descartada:** estender o `question` com campos opcionais. Isso misturaria "pergunta de entrevista de trilha" (sem caso) com "pergunta de simulação" (com caso) e deixaria a frente condicional à trilha.

### 4. Telas: variações por `isSimulation`, sem rotas novas
- **Tela da trilha:** quando `isSimulation`, a tela mostra o caso, os chips da stack, o progresso e um botão. Esse botão usa a mesma função que decide Estudar/Continuar/Estudar de novo para um deck, aplicada ao deck único, só com outros rótulos. A rota continua `/track/[id]`, então todos os links existentes (busca, "Também em andamento", revisão) já funcionam.
- **Tela da área:** para a área `simulacoes`, a tela pula "Ordem sugerida" e renderiza `areaSections().direct` sem título de seção, abaixo de uma frase de introdução, para o nome da área não aparecer duas vezes. Simulações já caem em `direct`, porque não têm linguagem nem variants.
- **Card da área:** a contagem usa "N simulações" na área `simulacoes`.
- **Sessão e resumo:** o rótulo "Voltar ao caso" e o selo "Caso · <título>" dependem de `isSimulation`.
- **Busca:** `search.ts` agrupa pela primeira área, que é `simulacoes`, a última em `AREAS`, então os resultados já saem por último. Com filtro de linguagem ativo, as simulações já são excluídas porque não têm linguagem.

### 5. Início
- `src/home/sections.ts` filtra simulações das sugestões e de "Comece por aqui". As opções de interesse vêm de `AREAS` sem `simulacoes`. "Continue de onde parou" troca "deck N de M · título" por "Situação-problema".
- **Novidades:** `newTracks` vira `whatsNew`, que devolve itens `{ kind: 'area' | 'track', date }`:
  1. junta as áreas com data de inclusão nos últimos 30 dias e as trilhas/simulações com `addedAt` nos últimos 30 dias;
  2. descarta as trilhas cujas áreas são todas áreas novas já listadas;
  3. ordena por data decrescente, com a área antes das trilhas no empate e, entre trilhas, a registrada depois primeiro;
  4. corta em 3 itens.
- **Data da área:** fica numa constante `AREA_ADDED_AT` em `schema.ts`, ao lado de `AREAS` (só `simulacoes: '2026-10-09'`).
  - Alternativa descartada: deduzir a data pelas trilhas da área ("todas incluídas há menos de 30 dias"). Como o app é novo, todas as áreas pareceriam novas.
  - Alternativa descartada: mover as áreas para `content/taxonomy.json`. Seria uma refatoração maior do que o ganho, porque nomes e ícones das áreas já vivem no código.

### 6. Traduções
`translation.ts` ganha:
- os campos `why` e `watchOut` no tipo `interview`;
- `scenario.context` e `scenario.stack` no topo, com a stack validada por tamanho igual ao da original.

O merge aplica a tradução da stack posição por posição.

### 7. Conteúdo
Uma pasta `content/tracks/sim-*` por simulação, registrada no fim de `catalog.ts` e de `translations.ts`. Ajustes de forma em relação ao material de origem:
- o fluxograma Mermaid e a tabela de endpoints viram snippets `text`, porque o app não renderiza Mermaid e `mermaid` não está na lista de linguagens;
- as aspas da fala saem, e a primeira pessoa fica;
- as notas "Por que é uma boa resposta", "Conceito importante", "Trade-off" e "Importante" do material viram `why` ou `watchOut` do card correspondente;
- "Como comprovar o resultado" (simulação 1) e "Se o CEO perguntar..." (simulação 5) viram cards próprios.

### 8. Ícone da área
A área ganha um ícone de conversa (balão de fala) em `src/components/icons.tsx`. Pela regra de ícone, a simulação sem `icon` herda o ícone da primeira área, então todas mostram o balão.

### 9. Nome exibido diferente do nome interno
Na interface, a área se chama **Situações-problema** e cada simulação aparece como um **caso**. No código e no conteúdo, os identificadores continuam `simulacoes`, `kind: "simulation"`, `sim-*` e `interview`.

- **Por quê:** o nome foi trocado depois da implementação, e o usuário não vê nenhum desses ids. Renomeá-los mexeria no schema, no conteúdo e nas chaves de progresso (`trackId:cardId`) sem ganho visível.
- **Alternativa descartada:** renomear tudo para `situacoes-problema` e `case`. Seria mais coerente para quem lê o código, mas muito mais churn.

## Risks / Trade-offs

- **[Ordem sorteada quebra o aprofundamento]** → cada card traz o caso na frente, e as perguntas "e se...?" trazem a nova condição no próprio texto (spec "Card faz sentido sozinho"). A ordem fixa fica para uma change futura, se fizer falta.
- **[Respostas longas no verso]** → as respostas-modelo têm 3 parágrafos curtos. O verso já rola, como no card `question`, e `why` e `watchOut` são frases curtas.
- **[Novo valor de `kind` desconhecido em versões antigas do app]** → o conteúdo vem empacotado com o app, então não há versão antiga lendo conteúdo novo. A API só vê `trackId:cardId`.
- **[A palavra "trilha" vazar em textos genéricos]** (ex.: "Também em andamento", estados) → a spec lista os textos trocados. O que não está listado continua genérico e aceitável.

## Migration Plan

Não há migração: nenhuma chave de progresso existente muda. Para desfazer, basta remover as pastas `sim-*` e os registros. O código das variações fica inerte sem simulações no catálogo.
