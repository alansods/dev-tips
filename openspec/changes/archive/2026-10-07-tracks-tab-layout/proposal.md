## Why

Na aba Trilhas, o atalho "Por linguagem" aparece antes das áreas, que são a forma principal de navegar. Com um filtro ativo, as trilhas vêm numa lista corrida, sem dizer a que área pertencem. E os filtros de estado quebram em duas linhas. O usuário pediu para reorganizar depois de testar.

## What Changes

- **Sem critério ativo:** busca, filtros, **Por área** e, depois, **Por linguagem**.
- **Com critério ativo:** busca, filtros, **Por linguagem** (para trocar ou tirar o filtro) e as trilhas **agrupadas pela primeira área**, uma vez cada.
- **Filtros de estado:** ficam numa linha que rola para o lado.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `catalog-navigation`: o requisito "Busca e filtros na aba Trilhas" muda a ordem das seções e passa a agrupar o resultado.

## Impact

- `src/content/search.ts`: nova função `groupByFirstArea`.
- `src/app/(tabs)/tracks.tsx`.
- Testes: `search.test.ts` e `tracks-search.test.tsx`.

## Fora de escopo

- Uma seção própria para as trilhas comparativas. Hoje há só uma, e ela fica em Backend.
