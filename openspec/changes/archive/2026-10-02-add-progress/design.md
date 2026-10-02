## Context

O store de estudo (`src/study/store.ts`, Zustand) guarda `progress` (chave `themeId:cardId`) e `preferredVariant`. Ele foi desenhado na `add-study-flow` para receber o `persist` sem mudar a API. As regras de contagem (`themeStats` e `deckStats`) já existem em `src/study/rules.ts`. Requisitos em `specs/progress/spec.md` e nos deltas.

## Goals / Non-Goals

**Goals:** persistência transparente para as telas, falhas de armazenamento sem impacto e aba Progresso reaproveitando as regras puras.

**Non-Goals:** migração de esquemas antigos (é a primeira versão salva) e sincronização remota.

## Decisions

### 1. `persist` do Zustand com AsyncStorage
- `persist(..., { name: 'dev-tips:study', version: 1, storage: createJSONStorage(() => AsyncStorage), partialize })`. Só `progress` e `preferredVariant` vão para o disco, as funções não.
- **Validação na hidratação:** um `merge` customizado valida o estado salvo com Zod (`progress`: registro de `'known' | 'unknown'`; `preferredVariant`: registro de string). Se for inválido, ignora e mantém o estado inicial. Isso cobre o cenário "Dados salvos inválidos".
- **Falhas de leitura e escrita:** um adaptador de storage em volta do AsyncStorage engole as exceções (devolve `null` na leitura e ignora a escrita). O app nunca quebra por causa do disco.
- **Hidratação assíncrona:** as telas renderizam com o estado vazio e atualizam quando a hidratação termina. É aceitável, porque leva poucos milissegundos. A sessão fixa a ordem dos cards ao abrir, mas a tela do tema é o caminho para abri-la, e lá o progresso já aparece hidratado.
- *Alternativa:* gravar à mão a cada `answer`. Descartada porque o `persist` já resolve serialização, versão e hidratação.

### 2. `resetTheme(themeId)`
Remove do `progress` todas as chaves com prefixo `themeId:`. O `preferredVariant` não muda. O `persist` grava automaticamente.

### 3. Aba Progresso
- `src/app/(tabs)/progress.tsx` lista `catalog` e mostra um `ThemeProgress` por tema:
  - círculo com a porcentagem;
  - três caixas: sei, para revisar, não vistos;
  - barras por deck (`ProgressBar` com `unknownValue`);
  - legenda;
  - botão "Zerar progresso".
- **Círculo:** um anel de 88px feito com `react-native-svg` (`Circle` com `strokeDasharray`), com o texto da porcentagem no centro e rótulo acessível "N% do tema dominado".
- **Confirmação:** estado local (`confirming`). Mostra o texto "Zerar o progresso deste tema?" com os botões "Zerar" (variante `warn`) e "Cancelar". Não usa `Alert`, porque o `Alert` não funciona na web e é ruim de testar.
- **Porcentagem:** `Math.round(known / total * 100)`.

### 4. Testes
- O store é testado com o mock oficial do AsyncStorage: grava, depois `useStudyStore.persist.rehydrate()` sobre um `setState` inicial simula a reabertura. Dados inválidos são semeados direto no AsyncStorage.
- A tela é testada com `renderRouter`, como as outras.

## Risks / Trade-offs

- [Mudança futura no formato salvo] → O campo `version: 1` já está lá. Uma mudança futura acrescenta `migrate`.
- [Hidratação depois do primeiro render mostrar "0/65" por um instante] → Aceitável. Se incomodar, dá para esperar `persist.hasHydrated()` no layout raiz, junto com as fontes.
