## Context

- **API**:
  - a cota é a constante `QUESTION_LIMIT` (100) em `api/src/billing/quota.ts`, aplicada na hora de cada pergunta;
  - o limite de histórico é `MAX_HISTORY` (10) em `api/src/routes/assistant.ts`, validado pelo schema Zod da rota;
  - o app já envia só as últimas 6 mensagens.
- **App**:
  - os números de uso ("37 / 100", "Restam 63", "30 / 100 usadas", o rótulo de acessibilidade) já vêm do `questions.limit` que a API devolve;
  - o "100" aparece fixo só nos textos estáticos de `src/i18n/pt-BR.ts` e `src/i18n/en.ts`:
    - `quotaAmount` (paywall);
    - o primeiro item de `howRules` (Conta);
    - `quotaTitle`, `quotaUsage` e `quotaRenews` (chat com cota esgotada).

### Custo que motivou a mudança (registro)
- Modelo: `gemini-3.8-flash`. Até 31/12/2026 custa US$ 0,75 por milhão de tokens de entrada e US$ 3,75 por milhão de saída. **Em 1/1/2027 o preço dobra.**
- Uma pergunta típica (~2 mil tokens de entrada, ~600 de saída) custa ~US$ 0,004 ≈ R$ 0,02. No pior caso (6 mensagens de histórico + 1.500 tokens de saída) custa ≈ R$ 0,06 em 2026 e ≈ R$ 0,12 em 2027.
- A receita líquida é ~R$ 12,66 por assinante (R$ 14,90 − 15% da Google). Com 200 perguntas, o uso típico custa ~R$ 4 em 2026 e ~R$ 8,80 em 2027.

## Goals / Non-Goals

**Goals:**
- Cota de 200 em um único lugar na API. Os números de uso no app continuam vindo da API.
- Rejeitar `history` com mais de 6 mensagens antes de chamar o modelo.

**Non-Goals:**
- Tornar a cota configurável por variável de ambiente ou por plano.
- Mudar o que o app envia de histórico, que já são 6 mensagens.

## Decisions

1. **A cota continua constante no código, não vira variável de ambiente.**
   - Mudar a cota muda o comportamento descrito na spec, então deve passar por change, teste e deploy, e não por um ajuste silencioso no painel.
   - Alternativa descartada: uma var `QUESTION_LIMIT` no `wrangler.jsonc`. Ela permitiria a spec e a produção divergirem.

2. **Nos textos do app, o número da cota sai de uma constante única.**
   - Criar `PRO_QUESTION_LIMIT = 200` em `src/subscriptions/` e montar os textos com ela, em vez de escrever "200" à mão em cada lugar.
   - O paywall precisa do número para o usuário grátis, que recebe `limit: 0` da API. Por isso o número não pode vir só da API.
   - Alternativa descartada: só trocar "100" por "200" nas strings. Da próxima vez seriam 5 lugares em 2 idiomas para lembrar.
   - Alternativa descartada: a API devolver o limite do Pro também para o plano grátis. Isso muda o contrato de `GET /me/subscription` só por causa de um texto.

3. **`MAX_HISTORY` cai para 6 na API, sem tolerância extra.**
   - O app já envia exatamente 6. Um limite maior só serviria a um cliente fora do padrão e permitiria encarecer cada pergunta.

4. **Assinantes atuais não precisam de migração.**
   - O uso fica guardado e a cota é comparada na hora. Quem já usou 100 no ciclo pode voltar a perguntar assim que o deploy sair.

## Risks / Trade-offs

- [O preço do Gemini dobra em 2027 e um assinante pode usar as 200 perguntas em conversas longas] → o pior caso fica em ~R$ 24 de custo para ~R$ 12,66 de receita. Acompanhar o custo real no faturamento do Google Cloud e **reavaliar a cota antes de 1/1/2027**.
- [Versão antiga do app em uso depois do deploy da API] → o paywall antigo continua dizendo "100", mas o uso já mostra "/ 200", porque vem da API. A inconsistência só aparece no texto e some com a atualização do app. Não é um problema de cobrança.

## Migration Plan

1. Aplicar a change neste branch (criado a partir do `dev` atualizado) e abrir PR para `dev`.
2. Fazer o deploy da API (Cloudflare Workers) e publicar o app numa nova versão na Play.
3. Rollback: reverter o commit e refazer o deploy da API. O uso já gravado continua válido com 100 ou 200.
