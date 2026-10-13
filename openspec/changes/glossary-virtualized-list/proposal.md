## Why

A aba Glossário monta todos os termos do catálogo de uma vez: hoje são cerca de 630, e o número cresce a cada trilha nova. A aba demora para abrir, a busca engasga a cada letra digitada e marcar um card redesenha a lista inteira. A lista passa a montar só os termos próximos da área visível, sem mudar o que o usuário vê.

## What Changes

- A lista do Glossário passa a ser virtualizada: só os termos perto da área visível ficam montados; o resto é montado ao rolar.
- Campo de busca e contagem ficam fixos no topo da aba, acima da lista rolável.
- O filtro da busca roda depois de o texto digitado aparecer no campo, sem travar a digitação.
- Marcar um card só redesenha o item daquele termo.

## Fora de escopo

- Ordem, conteúdo dos itens, selos, contagem, busca e gaveta de definição continuam iguais.
- Outras telas com listas longas.
- Novas dependências nativas (ex.: FlashList).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `glossary`: a Aba Glossário monta só os termos próximos da área visível, mantendo a contagem total.

## Impact

- `src/app/(tabs)/glossary.tsx`, novo `src/glossary/GlossaryItem.tsx` e `src/components/Screen.tsx` (variante sem rolagem).
- Testes da aba Glossário que esperam todos os itens montados de uma vez.
