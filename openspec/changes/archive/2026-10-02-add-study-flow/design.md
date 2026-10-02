## Context

A base do app (`app-shell`) já tem Expo Router com abas em `src/app/(tabs)/`, `useTheme()`, `AppText`, `Screen`, os ícones e o `catalog`/`getTheme`. O conteúdo segue o `content-model`: 5 tipos de card, `variants` e `compareColumns` por tema. O design de referência é o protótipo aprovado, registrado em `openspec/config.yaml`. Requisitos em `specs/study-flow/spec.md` e no delta de `specs/app-shell/spec.md`.

## Goals / Non-Goals

**Goals:**
- Regras de progresso e de sessão como **funções puras**, testáveis sem renderizar.
- Um componente por tipo de card, fácil de estender quando entrarem novos tipos (ex.: quiz).
- Estado de progresso num lugar só, pronto para a change `progress` acrescentar persistência sem mexer nas telas.

**Non-Goals:**
- Animação de virar com Reanimated. A troca frente/verso é imediata nesta change.
- Destaque de sintaxe colorido.

## Decisions

### 1. Rotas fora das abas
- `src/app/theme/[themeId].tsx`: tela do tema. Sem o cabeçalho do Stack: a tela desenha o próprio cabeçalho (botão "Voltar" e `ThemeToggle`), como no protótipo, o que dá controle total do rótulo acessível do botão de voltar.
- `src/app/study/[themeId]/[deckId].tsx`: sessão, também com cabeçalho próprio (sair, contador e barra).
- A ordem dos cards é calculada uma vez, ao abrir a sessão, pela ação do deck (decisão 3). "Revisar os que errei" reinicia a sessão no próprio estado da tela (`restart(missedIds)`), sem nova rota.
- Tema ou deck inexistente na URL mostra uma mensagem simples com botão de voltar, sem quebrar o app.
- Telas cheias usam `SafeAreaView` (react-native-safe-area-context) para respeitar o entalhe e a barra de gestos.
- *Alternativa:* modal ou estado interno numa rota só. Descartada porque rotas próprias funcionam com voltar, deep link e os testes do `renderRouter`.

### 2. Estado: Zustand com duas fatias
`src/study/store.ts`:
- **`progress`:** `Record<cardId, 'known' | 'unknown'>`, com `answer(cardId, result)`. Os ids de card são únicos por tema, mas o progresso usa a chave `themeId:cardId`, para não haver colisão entre temas.
- **`preferredVariant`:** `Record<themeId, variantId>`, com `setVariant`. Guarda a aba de framework escolhida.
- A sessão em andamento (ordem, posição, frente/verso, respostas da sessão) é **estado local** da tela da sessão (`useReducer`), porque só existe enquanto a tela está aberta.
- A change `progress` vai acrescentar o middleware `persist` do Zustand a este store, sem mudar a API.
- *Alternativa:* React Context. Descartada porque o Zustand facilita seletores finos e a persistência futura, e já é a stack prevista no `config.yaml`.

### 3. Regras puras em `src/study/rules.ts`
- `deckStats(deck, progress)` → `{ total, known, unknown, answered }`
- `deckAction(stats)` → `'start' | 'continue' | 'restart'`
- `sessionCardIds(deck, progress)` → ordem conforme a ação (todos, ou só os que não estão como "sei")
- `themeStats(theme, progress)`
- `sessionReducer(state, action)`, com as ações `reveal`, `answer(result)` e `restart(ids)`. Só aceita `answer` com o verso visível. O estado guarda `ids`, `index`, `revealed` e `results` (`Record<cardId, result>` da sessão) e `finished`.
- `summary(state)` → `{ known, unknown, missedIds }`

Os testes de unidade cobrem os cenários de regra. Os testes de tela cobrem a integração.

### 4. Componentes de card
- `src/components/cards/CardFace.tsx` escolhe o componente pelo `card.type`: `EndpointCard`, `StepCard`, `CompareCard`, `ConceptCard` e `CodeCard`. Cada um recebe `{ card, theme, side }`.
- O selo "Complemento" fica num `SupplementBadge` comum.
- O switch sobre `card.type` é exaustivo (`never`), então um tipo novo no schema quebra o typecheck até ganhar componente.
- `CodeBlock`: fundo `code` e texto `codeInk` nos dois modos, `ScrollView horizontal` com `Text` em fonte mono, sem `numberOfLines`. Rótulo `file` em cima e `note` embaixo.
- `VariantTabs`: as abas usam `accessibilityRole="tab"` e `accessibilityState.selected`, dentro de um container `tablist`.
- `ProgressBar`: valor de 0 a 1, cor `accent` (e `warn` para a parte "não sei" na Home e no deck, se aplicável).

### 5. Textos fixos dos cards
As perguntas da frente ("Qual operação do CRUD é essa e que status a API devolve?", "Como cada framework faz isso?", "Como cada stack resolve isso?", "O que significa?") são constantes em `src/study/copy.ts`. Os nomes das operações: C → Create, R → Read, U → Update, D → Delete.

### 6. Home
O card do tema vira um `Pressable` com `accessibilityRole="button"` e `accessibilityLabel` com o título e o progresso. Mostra título, descrição, barra e "sei/total". Ele navega com `router.push('/theme/<id>')`.

## Risks / Trade-offs

- [Store global atrapalhar o isolamento dos testes] → Exportar `resetStudyStore()` e chamá-lo no `beforeEach` dos testes de tela.
- [Cards longos (passo 8, passo 15) não caberem na tela] → O verso fica num `ScrollView` vertical, o código rola na horizontal e os botões ficam fixos embaixo.
- [Sem animação, a virada parecer abrupta] → Aceitável nesta change. A animação pode entrar no polimento, sem mudar comportamento nem spec.
