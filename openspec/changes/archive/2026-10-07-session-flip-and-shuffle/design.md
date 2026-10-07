## Context

A sessão vive em `src/study/StudySession.tsx`, com o estado no reducer puro `sessionReducer` de `src/study/rules.ts`. O estado é `{ ids, index, revealed, finished, results }`.

- A ação `reveal` só leva de `revealed: false` para `true`. Não existe volta.
- A ordem dos ids vem de quem abre a sessão:
  - `sessionCardIds`, na ordem do deck;
  - `dueCardIds`, na ordem da trilha;
  - `missedIds` do resumo, na ordem da sessão.
- A animação é um `Animated.Value` que só roda quando `revealed` vira `true`.
- O verso tem elementos tocáveis próprios: abas de variante, chips de termos relacionados e o bloco de código com scroll horizontal.

## Goals / Non-Goals

**Goals:**
- Alternar frente e verso sem perder a resposta já registrada nem mexer no contador.
- Sortear a ordem num único lugar, para que toda sessão (deck, revisão, "Revisar os que errei") se comporte igual.
- Deixar o sorteio controlável nos testes.

**Non-Goals:**
- Guardar a ordem sorteada (sair e voltar sorteia de novo).
- Mudar quais cards entram em cada sessão.

## Decisions

### 1. Ação `flip` no reducer em vez de `reveal`
`flip` inverte `revealed`. `answer` continua exigindo `revealed: true`.

Descartado: manter `reveal` e criar `hide`. Seriam duas ações para um mesmo interruptor, e a tela precisaria escolher qual despachar.

### 2. Toque no verso: `Pressable` sem foco de acessibilidade, mais o botão "Ver pergunta"
O verso fica dentro de um `Pressable` com `accessible={false}`. O toque fora dos elementos internos vira o card. Os elementos internos (abas, chips) continuam recebendo o próprio toque, porque o React Native entrega o toque ao componente mais interno.

Para leitor de tela, o caminho é o botão "Ver pergunta" na barra de ações, no lugar de "Mostrar resposta".

Descartado: um `Pressable` acessível em volta do verso. No iOS, um elemento acessível agrupa os filhos, e as abas e os chips deixariam de ser alcançáveis pelo VoiceOver.

### 3. Animação nos dois sentidos, sem animar troca de card
O efeito passa a reagir a qualquer mudança de `revealed`, nos dois sentidos, e anima o lado que entra (de 90° para 0°). Usa a mesma duração de `flipDuration`, que é 0 com "reduzir movimento".

Quando muda o `index` (novo card), a frente aparece sem animação, como hoje. Um `useRef` guarda o índice anterior para distinguir os dois casos.

### 4. Sorteio dentro da `StudySession`, com `sessionOrder` puro
Nova função `sessionOrder(ids, cardsById, random = Math.random)` em `rules.ts`:
1. Faz Fisher-Yates sobre todos os ids.
2. As posições que ficaram com cards `step` recebem esses cards de volta, ordenados por `number`.

O resultado é que os passos ficam em ordem crescente, intercalados com os demais cards em posições sorteadas, e o conjunto de cards não muda.

A `StudySession` aplica `sessionOrder` ao abrir (`initialIds()`) e ao reiniciar com "Revisar os que errei". Assim quem abre a sessão continua só dizendo *quais* cards entram.

Descartado:
- Embaralhar em cada rota (deck e revisão). Repetiria a lógica e esqueceria o reinício pelo resumo.
- Pular o sorteio quando o deck tem step. Um deck misto perderia o sorteio dos outros cards.

### 5. Sorteio por um módulo próprio, controlado nos testes
A `StudySession` chama `sessionOrder(ids, cardsById, chance.random)`. O `chance.random` vem de `src/study/chance.ts` e só repassa `Math.random`. Segue o mesmo padrão de `clock.today`, que os testes já substituem com `jest.spyOn`.

Com o sorteio retornando um valor próximo de 1 (`0.999999`), o Fisher-Yates troca cada posição com ela mesma e mantém a ordem original. O `beforeEach` global de `jest.setup.ts` faz esse `jest.spyOn` para todos os testes. Assim os testes de tela existentes continuam válidos sem mudança, e os testes de sorteio trocam o valor. Os testes novos de `sessionOrder` passam um `random` determinístico.

Descartado: fazer o `jest.spyOn` direto em `Math.random`. Afetaria outras bibliotecas que usam números aleatórios durante o teste, como geradores de id.

## Risks / Trade-offs

- **Toques dentro do código do verso viram o card sem querer:** tocar no bloco de código (não arrastar) vira o card. → Esse risco já existe no toque da frente, e o botão "Ver pergunta" desfaz em um toque.
- **Testes que dependem da ordem quebram:** os testes de tela que contam com a ordem do deck vão falhar sem o helper. → Fixar a ordem do deck no `beforeEach` global e testar a ordem sorteada em cenários próprios.
