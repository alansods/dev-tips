# Chat "Perguntar": configuração (Gemini)

O chat do card (change `add-card-assistant`) é respondido pela API com o **Gemini Flash**. Só usuários Pro (ou admins) podem perguntar, dentro da cota de 100 perguntas por ciclo. A cota está descrita em [assinaturas.md](assinaturas.md).

## Como funciona

```
App ──POST /assistant/ask { card, history, question, language }──▶ API
                                                                  │ assertCanAsk (403 pro_required / 429 quota_exceeded)
                                                                  ▼
                                                     Gemini generateContent → { inScope, answer }
                                                                  │ inScope? recordAnswered : recusa fixa
                                                                  ▼
                                                     200 { answer, inScope, questions }
```

- O app envia o texto do card no idioma atual e as últimas 6 mensagens. A API não guarda a conversa.
- Uma pergunta fora do card recebe uma recusa fixa e **não consome a cota**.
- Uma falha do Gemini, ou mais de 30 segundos sem resposta, vira `502 assistant_unavailable` e também **não consome a cota**.

## Configurar

1. Crie uma chave em [Google AI Studio](https://aistudio.google.com/apikey).
2. Dentro de `api/`:
   ```bash
   npx wrangler secret put GEMINI_API_KEY   # cole a chave
   npm run deploy
   ```
3. Para rodar a API localmente, coloque `GEMINI_API_KEY=...` em `api/.dev.vars`. Esse arquivo está fora do Git.

O modelo fica em `GEMINI_MODEL`, no `api/wrangler.jsonc` (hoje `gemini-3.8-flash`). Para trocar de modelo, basta mudar o valor e fazer o deploy, sem atualizar o app.

**Nunca** coloque a chave no app (`.env` com `EXPO_PUBLIC_`): ela ficaria dentro do pacote do app.

## Custo

Os limites mantêm o custo de cada pergunta baixo e previsível:

- a pergunta tem até 500 caracteres;
- o texto do card vai até 8.000 caracteres;
- a resposta tem no máximo 1.500 tokens, contando o raciocínio interno do modelo, que fica em nível `low`.

Com o Gemini Flash, a estimativa foi de ~R$ 0,04 por pergunta, com teto de ~R$ 0,06. Confira a tabela de preços atual em <https://ai.google.dev/gemini-api/docs/pricing>.
