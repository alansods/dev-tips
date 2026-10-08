## Why

Na sessão de estudo, depois de virar o card não dá para voltar à pergunta: o verso fica fixo até o usuário responder. Isso atrapalha quem quer reler a pergunta para comparar com a resposta. Além disso, os cards aparecem sempre na ordem do deck. Isso faz o usuário decorar a sequência em vez do conteúdo, e é pior em decks que ele já estudou várias vezes.

## What Changes

- **Virar de volta:**
  - Com o verso visível, a sessão mostra o botão "Ver pergunta", que volta para a frente.
  - Tocar no card alterna entre frente e verso.
  - "Não sabia" e "Já sabia" continuam aparecendo só com o verso visível.
- **Animação:** a volta para a frente usa a mesma animação da ida, e é imediata com "reduzir movimento" ativado.
- **Ordem aleatória:**
  - Toda sessão sorteia a ordem dos cards uma vez, ao abrir. Isso vale para a sessão do deck, a revisão de hoje e "Revisar os que errei".
  - Decks com cards de passo numerado (tipo `step`) mantêm a ordem dos passos.
  - Quais cards entram na sessão não muda. A ordem só é sorteada de novo quando o usuário abre uma nova sessão.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `study-flow`: os requisitos "Deck com progresso e ação", "Sessão de estudo", "Virar e responder" e "Resumo da sessão" passam a prever a ordem aleatória e a volta para a frente.
- `app-polish`: o requisito "Animação de virar o card" passa a valer também ao voltar para a frente.

## Impact

- Código:
  - `src/study/rules.ts`: o reducer da sessão e uma nova função de ordenação.
  - `src/study/StudySession.tsx`: botão "Ver pergunta", toque no verso e animação nos dois sentidos.
  - `src/app/study/[trackId]/[deckId].tsx` e `src/app/review/[trackId].tsx`: passam a usar a ordem sorteada.
  - `src/i18n/pt-BR.ts` e `src/i18n/en.ts`: textos novos.
- Testes:
  - Os testes de sessão que contam com a ordem do deck passam a fixar o sorteio: `study-flow.test.tsx`, `review-flow.test.tsx`, `card-assistant-ui.test.tsx` e `src/study/__tests__/rules.test.ts`.
  - Os testes de motion, em `src/study/__tests__/motion.test.tsx`.
- Sem mudança de conteúdo, de dados salvos ou da API. O progresso e o agendamento continuam iguais.

## Fora de escopo

- Escolher a ordem (aleatória ou do deck) em Ajustes.
- Gesto de arrastar o card para responder.
- Revisão juntando várias trilhas, que vem na change da aba Início.
