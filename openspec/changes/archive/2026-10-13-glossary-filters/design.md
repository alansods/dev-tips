## Context

A aba Glossário (`src/app/(tabs)/glossary.tsx`) já usa uma `FlatList` virtualizada com `GlossaryItem` memoizado e busca via `searchTerms` (`src/glossary/search.ts`). A ordem hoje é a das trilhas. O protótipo aprovado (opção B) tem lista A–Z com cabeçalhos de letra, botão "Filtros" com gaveta e chips dos filtros ativos.

## Goals / Non-Goals

**Goals:** ordem alfabética com cabeçalhos de letra; filtros por estudo, área, nível e trilha; manter a virtualização.

**Non-Goals:** guardar filtros entre aberturas do app; índice lateral de letras; juntar termos repetidos.

## Decisions

- **Ordenação com `normalize`, sem `Intl.Collator`.** O `normalize` de `src/content/text.ts` (já usado na busca) tira acentos e caixa; comparar as chaves normalizadas dá a mesma ordem nos dois idiomas e não depende do suporte a `Intl` do Hermes em cada aparelho. O `sort` do JavaScript é estável, então termos com o mesmo nome mantêm a ordem das trilhas.
- **Funções puras em `search.ts`.** `sortTerms`, `filterTerms` e `withLetterHeaders` recebem dados e devolvem dados, testáveis sem renderizar a tela. A tela só junta busca → filtros → ordem → cabeçalhos.
- **Cabeçalhos como linhas da própria `FlatList`.** Os dados viram uma lista mista (`{ kind: 'letter' }` e `{ kind: 'term' }`), o que mantém a virtualização. Cada termo sabe se é o primeiro e o último da sua letra, para desenhar o grupo como um cartão com bordas arredondadas, como no protótipo. Descartada: `SectionList`, que resolveria os cabeçalhos mas exigiria refazer os helpers de teste da lista e não traz ganho aqui.
- **Estado dos filtros na tela (`useState`).** Um objeto `{ study, area, level, trackIds }`. Como a aba continua montada enquanto o app está aberto, os filtros permanecem ao trocar de aba; somem ao fechar o app. Descartado: Zustand com persistência (fora de escopo).
- **Gaveta própria `GlossaryFilters`**, no mesmo padrão de `TermSheet` (`Modal` transparente com `animationType="slide"`, fundo escurecido tocável, `SafeAreaView` embaixo). Descartado por ora: extrair um componente genérico de gaveta; são só dois usos.
- **Nível pelo card.** Cada `ConceptCard` já tem `level`; os rótulos vêm de `t.card.levels`, já traduzidos.
- **Estudo pelo progresso.** "Revisar" = resposta `unknown`, "Já sabia" = `known`, "Não vistos" = sem resposta, usando `progressKey` e o `progress` do `useStudyStore`, como os selos já fazem.

## Risks / Trade-offs

- Testes que esperavam a ordem por trilha mudam junto com a spec (cenário "Lista completa").
- Com muitas trilhas marcadas, a fileira de chips fica longa; ela rola na horizontal.
