// Cota de perguntas do plano Pro por ciclo da assinatura. Espelha `QUESTION_LIMIT`
// da API; serve só aos textos fixos (paywall, regras, cota esgotada). Os números
// de uso vêm sempre de `questions.limit` da API. Sem imports: o i18n depende daqui.

export const PRO_QUESTION_LIMIT = 200;
