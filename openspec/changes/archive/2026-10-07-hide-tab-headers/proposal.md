## Why

Cada aba mostra no topo um cabeçalho com o próprio nome ("Início", "Trilhas", "Glossário", "Perfil"). Esse nome já aparece na barra de abas, então o cabeçalho só ocupa espaço. O usuário pediu para tirar, depois de ver o app.

## What Changes

- **Cabeçalho:** as quatro abas deixam de ter o cabeçalho com o título.
- **Área segura:** o conteúdo das abas passa a respeitar a área da barra de status e do notch, para não ficar escondido.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `app-shell`: o requisito "Navegação por abas" passa a dizer que as abas não têm cabeçalho com título.

## Impact

- `src/app/(tabs)/_layout.tsx`: `headerShown: false`, e saem os estilos do cabeçalho.
- `src/components/Screen.tsx`: o conteúdo rolável passa a respeitar a área segura do topo.
- Testes: um cenário novo em `app-shell.test.tsx`.

## Fora de escopo

- As telas cheias (área, trilha, progresso, conta), que continuam com o cabeçalho de voltar.
