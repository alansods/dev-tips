## Context

`src/app/(tabs)/glossary.tsx` renderiza `entries.map(...)` dentro do `Screen`, que é um `ScrollView`. O `ScrollView` monta todos os filhos, visíveis ou não: com ~630 termos são ~2.500 componentes nativos ao abrir a aba. Cada tecla na busca refiltra e redesenha tudo de forma síncrona, e o título da trilha é buscado com `catalog.find` por item.

## Goals / Non-Goals

**Goals:** abrir a aba rápido, digitar na busca sem engasgos e não redesenhar a lista inteira ao marcar um card, mantendo o comportamento da spec.

**Non-Goals:** mudar layout ou conteúdo dos itens; otimizar outras telas.

## Decisions

- **`FlatList` do React Native.** Monta só uma janela de itens em volta da área visível. Descartadas: `@shopify/flash-list` (dependência nativa nova e novo build, ganho pequeno para ~630 itens simples) e paginação/"carregar mais" (pior uso e não ajuda a busca).
- **`Screen` com `scroll={false}`.** Uma `FlatList` dentro de um `ScrollView` perde a virtualização (o React Native avisa "VirtualizedLists should never be nested"). A variante mantém área segura, fundo do tema e aviso de offline, e deixa a rolagem para a lista.
- **Busca e contagem fixas no topo, fora da lista.** Evita o `TextInput` perder o foco quando o cabeçalho da lista é recriado e mantém a busca sempre à mão.
- **`GlossaryItem` com `React.memo`** e `onPress` estável. Mudar o progresso de um card só redesenha o item cujo selo mudou.
- **`useDeferredValue` na busca.** O texto aparece no campo na hora e o filtro roda com prioridade baixa. Sem debounce manual nem timers.
- **Títulos das trilhas num `Map`** criado com `useMemo`, no lugar de `catalog.find` por item.
- Sem `getItemLayout`: a altura do item varia com a quebra da definição e com o título da trilha.

## Risks / Trade-offs

- Em testes (Jest) a lista não tem medida de tela e monta só os primeiros itens. Os testes que esperam a lista inteira passam a rolar a lista (evento de layout e scroll) antes de conferir. → Helper nos testes.
- Ao rolar muito rápido pode aparecer área em branco por um instante enquanto os itens montam. → Aceitável; `windowSize` padrão.
