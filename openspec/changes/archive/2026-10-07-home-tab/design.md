## Context

O que já existe e o Início reaproveita:
- **Pré-requisitos:** `areaPath` e `nextTracks` (change `track-path`).
- **Dias seguidos:** `currentStreak` (change `profile-tab`).
- **Ícones:** `trackIcon` (change `track-icons`).
- **Progresso e revisão:** `trackStats`, `deckStats`, `deckAction` e `sessionCardIds` (`rules.ts`), e `dueCardIds` (`srs.ts`).

A sessão (`StudySession`) recebe hoje uma única trilha, e todo o estado dela usa ids de card.

## Goals / Non-Goals

**Goals:**
- Toda regra das seções do Início em funções puras, testadas sem tela.
- A revisão de todas as trilhas reaproveitando a mesma `StudySession`.

**Non-Goals:**
- Sincronizar interesses ou a última resposta.
- Ranquear sugestões por progresso ou por nível.

## Decisions

### 1. Rotas
- `(tabs)/index.tsx` vira o Início. A lista de áreas muda sem alterações para `(tabs)/tracks.tsx`.
- No layout das abas, as rotas ficam na ordem index, tracks, glossary, profile.
- `/` continua sendo a primeira tela, então o login e o toque na notificação já levam ao Início sem mudar o código.

### 2. Funções puras em `src/home/sections.ts`
Todas recebem os dados prontos (catálogo, progresso, agendamento, dias, hoje):
- `greetingPeriod(hour)`;
- `reviewSummary(catalog, schedule, today)`: total, trilhas ordenadas pela quantidade, minutos e quantos vencem amanhã;
- `continueTarget(catalog, lastAnswer, progress)`: trilha, deck, posição e estatísticas;
- `inProgressTracks(catalog, progress, exceptId)`;
- `suggestions(catalog, progress, lastTrackId, interests)`: título e trilhas;
- `newTracks(catalog, today)`;
- `startHere(catalog, interests)`;
- `lastSevenDays(days, today)`.

### 3. Última resposta no store de estudo
`lastAnswer: { trackId, cardId } | null` é gravado por `answer()`, só no aparelho. A persistência sobe para a versão 4, com padrão `null`.

O deck é descoberto pelo card, no catálogo. Assim o store não precisa conhecer o catálogo.

### 4. Interesses no store de preferências
`interests: Area[]` fica no `useSettingsStore` (o store que já guarda idioma e onboarding), com `toggleInterest(area)`. O `savedSchema` usa `.catch([])`, no mesmo padrão dos outros campos.

### 5. Sessão de várias trilhas
`StudySession` passa a receber `entries: () => { track, cardId }[]`, um `title` e um `onExit`.

Internamente, cada card é identificado por `trackId:cardId`, a mesma chave do progresso. Isso faz o reducer, o sorteio e o resumo funcionarem sem mudança. Para cada card, a tela usa a trilha dele:
- a aba de framework preferida;
- a `TermSheet`;
- o `answer`.

A rota do deck e a de revisão por trilha montam as `entries` de uma trilha só. A nova `review/index.tsx` monta as de todas as trilhas, com `dueCardIds`.

### 6. `addedAt`
O campo é uma data `AAAA-MM-DD`, validada por regex e por `Date`. Os valores vêm de `git log --diff-filter=A` do `track.json` de cada trilha. Como as 41 trilhas entraram em outubro de 2026, a seção mostra só as 3 mais recentes.

## Risks / Trade-offs

- **Muitas trilhas "novas" ao mesmo tempo:** hoje todas as trilhas têm menos de 30 dias. → O limite de 3 mostra só as mais recentes, e a seção some sozinha com o tempo.
- **Testes que abriam `/`:** os testes que abriam `/` esperando a lista de áreas quebram. → Passam a abrir `/tracks`. Os cenários continuam os mesmos.
- **Refatoração da `StudySession`:** a refatoração para várias trilhas mexe numa tela central. → Os testes de sessão e revisão que já existem cobrem o comportamento de uma trilha.
