## Why

Hoje o progresso de estudo some ao fechar o app, e a aba Progresso é só uma tela provisória. Para um app de estudo, perder o que já foi feito desmotiva: o usuário precisa ver o quanto avançou e retomar de onde parou nos dias seguintes.

## What Changes

- **Progresso salvo no aparelho:** as respostas ("sei" e "não sei") e a aba de framework preferida sobrevivem a fechar e reabrir o app. Se o armazenamento falhar ou os dados salvos estiverem corrompidos, o app continua funcionando, começando sem progresso.
- **Aba Progresso de verdade**, para cada tema do catálogo:
  - porcentagem dominada;
  - contagem de cards "sei", "para revisar" e "não vistos";
  - uma barra por deck, com "sei" e "não sei" e legenda.
- **Zerar progresso de um tema**, com uma etapa de confirmação na própria tela ("Zerar" / "Cancelar"). Zera só aquele tema e mantém a aba de framework preferida.

## Capabilities

### New Capabilities
- `progress`: persistência do progresso, aba Progresso e zerar progresso.

### Modified Capabilities
- `study-flow`: o requisito "Progresso enquanto o app está aberto" vira "Progresso de cada card". A regra de última resposta continua, mas deixa de dizer que fechar o app perde o progresso.
- `app-shell`: o requisito "Telas provisórias" passa a cobrir só a aba Glossário.

## Impact

- `src/study/store.ts` ganha o middleware `persist` do Zustand com AsyncStorage (chave `dev-tips:study`, versão 1) e a ação `resetTheme(themeId)`.
- A tela `src/app/(tabs)/progress.tsx` sai de provisória.
- Nenhuma dependência nova: o AsyncStorage e o Zustand já estão instalados.

## Fora de escopo

- Sincronizar entre aparelhos e login.
- Histórico por data, streak e repetição espaçada.
- Exportar ou importar o progresso.
- Zerar todos os temas de uma vez. Com um só tema, zerar o tema já cobre isso.
