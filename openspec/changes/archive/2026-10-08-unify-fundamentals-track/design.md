## Context

O progresso é salvo por `trackId + cardId`, localmente e no sync. As specs de linguagem fixam ids e títulos de decks, não os cards.

## Decisions

- **Manter o id `fundamentos-web`.** Trocar para `fundamentos` exigiria migrar o progresso salvo no banco; o id não aparece na tela.
- **Título "Fundamentos de programação e web".** A área já se chama "Fundamentos"; um título igual ficaria ambíguo na tela da área.
- **Uma trilha só, decks de programação primeiro.** Pedido do usuário: um lugar só de fundamentos. A ordem segue do mais básico (variáveis) para o mais aplicado (HTTP).
- **Decks de programação sem código.** São conceitos independentes de linguagem; código fica nas trilhas de cada linguagem, que mostram a sintaxe própria.
- **Cards trocados com id novo.** Se o id fosse reaproveitado, um "já sabia" antigo valeria para um conteúdo diferente.
- **Ids e títulos dos decks de linguagem mantidos.** Evita mexer nas specs e testes de linguagem; só o conteúdo dos cards muda.
- **Regra testável de não repetição** por termo (sem diferenciar maiúsculas). Não pega sinônimos, mas evita a regressão mais comum: copiar o card genérico de volta.

## Risks / Trade-offs

- Usuários perdem o histórico dos cards removidos (poucos por trilha). Aceito: o conteúdo equivalente agora está em Fundamentos.
