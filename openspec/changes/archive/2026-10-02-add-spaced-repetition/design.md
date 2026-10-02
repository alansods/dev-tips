## Context

O store persistido (`src/study/store.ts`, versão 1) guarda `progress` e `preferredVariant`. A sessão de estudo (`src/app/study/[themeId]/[deckId].tsx`) calcula os ids na abertura e tem o componente interno `Session`. As regras puras ficam em `src/study/rules.ts`. Requisitos em `specs/spaced-repetition/spec.md` e no delta de `progress`.

## Goals / Non-Goals

**Goals:** regras de agendamento puras e determinísticas (data injetável), migração segura do armazenamento e reaproveitamento total da sessão existente.

**Non-Goals:** relógio em tempo real (o "hoje" é avaliado quando a tela renderiza) e fusos diferentes do local do aparelho.

## Decisions

### 1. Datas como dia local `YYYY-MM-DD`
`src/study/clock.ts` exporta `today()` (dia local) e `addDays(day, n)`, que calcula em UTC a partir das partes da data, para não ter problema com horário de verão. Comparar datas vira comparar strings (a ordem lexicográfica é a cronológica). Nos testes, `today` é mockado com `jest.spyOn`.

### 2. Regras puras em `src/study/srs.ts`
- `INTERVAL_DAYS = { 2: 3, 3: 7, 4: 14, 5: 30 }`
- `nextSchedule(prev | undefined, result, day)` → `{ box, due }`
- `dueCardIds(theme, schedule, day)` → ids na ordem dos decks e dos cards.
- O agendamento usa a mesma chave do progresso (`themeId:cardId`).

### 3. Store versão 2
- `schedule: Record<key, { box: 1 | 2 | 3 | 4 | 5; due: string }>`, persistido.
- `answer()` atualiza `progress` e `schedule` na mesma transação, usando `today()`.
- `resetTheme()` limpa os dois para o tema.
- `persist` com `version: 2` e `migrate(state, from)`: a versão 1 vira `{ ...state, schedule: {} }`.
- O `merge` validado passa a aceitar `schedule` opcional, que vira `{}` se faltar.

### 4. Sessão reutilizável
- O `Session` sai da rota para `src/study/StudySession.tsx`, com as props `{ theme, title, initialIds }`.
- A rota do deck calcula `initialIds` com `sessionCardIds`. A nova rota `src/app/review/[themeId].tsx` usa `dueCardIds(theme, schedule, today())`, calculado uma vez na abertura, e o título "Revisão de hoje".
- Se não houver cards vencidos ao abrir, a sessão vai direto para o resumo: o `initialSession([])` já começa como `finished`. O resumo mostra 0 e 0 e o botão de voltar.

### 5. Telas
- **Tela do tema:** bloco "Revisão de hoje" entre os totais e os decks, com a contagem e "Revisar agora", ou o texto vazio.
- **Home:** linha "N para revisar hoje" no card do tema, com a cor `warn`.

## Risks / Trade-offs

- [O app aberto na virada da meia-noite não atualizar a contagem] → Qualquer navegação re-renderiza com o novo `today()`. Sem timer, por simplicidade.
- [Migração mal feita apagar o progresso] → Um teste cobre os dados da versão 1 carregando com o progresso intacto.
