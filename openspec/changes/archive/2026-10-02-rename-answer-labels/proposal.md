## Why

"Sei" e "Não sei" soam como autoavaliação do conhecimento em geral, mas o que o usuário responde é se lembrava da resposta daquele card antes de virá-lo. "Já sabia" e "Não sabia" descrevem isso melhor e deixam o gesto mais honesto, sem o peso de "não sei".

## What Changes

- Os botões de resposta da sessão de estudo e da revisão passam de "Não sei" / "Sei" para **"Não sabia" / "Já sabia"**.
- O resumo da sessão passa a mostrar as contagens com os rótulos "já sabia" e "não sabia".
- A aba Progresso usa "já sabia" na contagem e na legenda. O rótulo "para revisar" não muda.
- O selo do glossário para card acertado passa de "sei" para "já sabia". O selo "revisar" não muda.
- As specs passam a descrever o estado das respostas como "já sabia" / "não sabia".
- O valor salvo no aparelho não muda, então o progresso e o agendamento existentes continuam válidos, sem migração.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `study-flow`: rótulos dos botões de resposta e do resumo; estados "já sabia" / "não sabia" no progresso dos decks e dos cards.
- `spaced-repetition`: regras de agendamento e da sessão de revisão descritas com os novos rótulos.
- `progress`: contagem e legenda da aba Progresso com "já sabia".
- `app-polish`: cenário da animação de virar cita os novos botões.
- `glossary`: selo "já sabia" na lista e botões citados na gaveta.

## Impact

- UI: `src/study/StudySession.tsx` (botões, resumo), `src/app/(tabs)/progress.tsx` (contagem e legenda), `src/app/(tabs)/glossary.tsx` (selo).
- Testes: `study-flow`, `review-flow`, `glossary-flow` e `progress-tab`, que buscam os textos atuais.
- Comentários em `src/study/srs.ts`, `src/study/rules.ts` e `src/components/ProgressBar.tsx`.
- Purpose da spec principal `study-flow`, que cita "Sei"/"Não sei" e é editada direto no arquivo.
- Sem mudança de dados, dependências ou rotas.

## Fora de escopo

- Mudar o valor interno salvo (`known` / `unknown`) ou migrar dados.
- Novas opções de resposta (por exemplo "mais ou menos") ou mudança no algoritmo de repetição espaçada.
- Mudar os rótulos "para revisar", "revisar" e "Revisar os que errei".
