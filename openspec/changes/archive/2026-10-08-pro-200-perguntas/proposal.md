## Why

O Pro custa R$ 14,90 por mês e dá 100 perguntas por ciclo. O custo real da IA ficou bem abaixo do previsto: uma pergunta típica ao Gemini 3.8 Flash sai por cerca de R$ 0,02. Com 100 perguntas a oferta parece pequena para o preço, e sobra margem para dobrar a cota sem prejuízo.

A API aceita até 10 mensagens de histórico, mas o app envia só as últimas 6. O limite maior não serve ao app e deixa um cliente adulterado encarecer cada pergunta.

## What Changes

- A cota do assinante passa de **100 para 200 perguntas por ciclo**. O preço continua R$ 14,90.
- `GET /me/subscription` e `POST /assistant/ask` devolvem `questions.limit` igual a `200` para assinantes.
- `POST /assistant/ask` passa a aceitar `history` com **até 6 mensagens**. Com 7 ou mais, responde `400 invalid_body`.
- Os textos que citam a cota passam a dizer 200:
  - o paywall ("200" "perguntas por mês");
  - a linha "Dev Tips Pro" no Perfil;
  - o bloco "Plano" da tela Conta, incluindo "Como a cota funciona";
  - o aviso de cota esgotada no chat.

Esta change parte das specs como ficaram depois de `show-question-quota` (PR #67, já em `dev`).

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `subscriptions`: a cota passa a 200 em "Consultar plano e uso", "Cota de perguntas", "Paywall", "Plano no app" e "Linha Dev Tips Pro no Perfil".
- `card-assistant`: em "Perguntar sobre o card na API", o limite de `history` cai para 6 e os exemplos usam 200; em "Erros e cota no chat", o texto da cota esgotada usa 200.
- `auth`: o bloco "Plano" de "Conta no app" passa a mostrar a cota de 200.

## Impact

- API:
  - `api/src/billing/quota.ts` (`QUESTION_LIMIT`);
  - `api/src/routes/assistant.ts` (`MAX_HISTORY`);
  - testes da API.
- App:
  - textos em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`;
  - componentes do paywall, Perfil, Conta e chat que tenham "100" fixo;
  - testes de UI.
- Assinantes atuais ganham a cota nova já no ciclo em andamento, porque o limite é calculado na hora da pergunta. Não há migração de dados.

## Fora de escopo

- Mudar o preço, criar plano anual ou trial.
- Anúncios ou perguntas grátis via rewarded ad.
- Trocar o modelo de IA ou reduzir `MAX_OUTPUT_TOKENS`.
- Reavaliar a cota para o novo preço do Gemini em 2027. Fica como acompanhamento no design.
