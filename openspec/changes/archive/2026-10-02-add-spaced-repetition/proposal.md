## Why

Hoje o app registra "sei" e "não sei", mas não diz **quando** revisar. Sem revisão no momento certo, o que foi aprendido se perde em poucos dias. A repetição espaçada traz de volta os cards errados logo e os acertados em intervalos cada vez maiores. É o motor de retenção de apps de estudo como o Algo App.

## What Changes

- **Agendamento por caixas (Leitner):** cada card respondido ganha uma caixa de 1 a 5 e uma data de revisão.
  - "Não sei": volta para a caixa 1 e revisa no mesmo dia.
  - "Sei": sobe uma caixa. Os intervalos são 3, 7, 14 e 30 dias para as caixas 2 a 5.
- **Revisão de hoje** na tela do tema: quantos cards vencem hoje e o botão **Revisar agora**, que abre uma sessão só com eles. Sem cards vencidos, aparece "Nada para revisar hoje".
- **Home:** o card do tema mostra "N para revisar hoje" quando houver.
- **Sessão de revisão:** a mesma mecânica de flashcard, com o título "Revisão de hoje", resumo e "Revisar os que errei".
- **Persistência:** o agendamento é salvo junto com o progresso. Dados salvos de versões anteriores continuam funcionando. Zerar o tema também zera o agendamento.

## Capabilities

### New Capabilities
- `spaced-repetition`: agendamento por caixas, cards para revisar hoje, revisão na tela do tema e na Home, e a sessão de revisão.

### Modified Capabilities
- `progress`: "Zerar progresso de um tema" também apaga o agendamento de revisão daquele tema.

## Impact

- **Arquivos:**
  - `src/study/srs.ts`: regras puras de agendamento e data;
  - `src/study/store.ts`: `schedule` persistido, versão 2 com migração da versão 1;
  - nova rota `src/app/review/[themeId].tsx`;
  - a sessão de estudo vira um componente reutilizável.
- Nenhuma dependência nova.

## Fora de escopo

- Notificações ou lembretes diários.
- Ajuste de intervalos pelo usuário e algoritmos mais complexos (SM-2, FSRS).
- Streak (dias seguidos estudando).
- Revisão que junta vários temas numa sessão só.
