// POST /assistant/ask: o chat "Perguntar". Aplica a cota do Pro antes de
// chamar o Gemini e só conta a pergunta quando ela foi respondida sobre o card.

import { Hono } from 'hono';
import { z } from 'zod';

import { outOfScopeAnswer, systemPrompt } from '../assistant/prompt';
import { requireAuth, type AuthVariables } from '../auth/middleware';
import { subscriptionView } from '../billing/plan';
import { assertCanAsk, recordAnswered } from '../billing/quota';
import type { Deps } from '../deps';
import { AppError } from '../errors';
import { jsonBody } from '../validation';

export const MAX_QUESTION = 500;
export const MAX_CARD_TEXT = 8_000;
export const MAX_HISTORY = 6;

const askBody = z.object({
  card: z.object({
    type: z.string().min(1).max(40),
    title: z.string().min(1).max(300),
    text: z.string().min(1).max(MAX_CARD_TEXT),
  }),
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), text: z.string().min(1).max(4_000) }))
    .max(MAX_HISTORY),
  question: z.string().trim().min(1).max(MAX_QUESTION),
  language: z.enum(['pt-BR', 'en']),
});

export function assistantRoutes(deps: Deps) {
  const routes = new Hono<{ Bindings: Env; Variables: AuthVariables }>();
  routes.use('*', requireAuth);

  routes.post('/ask', jsonBody(askBody), async (c) => {
    const { card, history, question, language } = c.req.valid('json');
    const { user } = c.var;
    const now = deps.now();
    const ticket = await assertCanAsk(c.env.DB, user, c.env.ADMIN_EMAILS, now);

    let reply;
    try {
      reply = await deps.gemini.ask(
        {
          system: systemPrompt(card, language),
          history: history.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', text: m.text })),
          question,
        },
        { apiKey: c.env.GEMINI_API_KEY, model: c.env.GEMINI_MODEL },
      );
    } catch (err) {
      console.error(err);
      throw new AppError(502, 'assistant_unavailable', 'Não foi possível responder agora.');
    }

    // Fora do card: recusa fixa e a pergunta não consome a cota.
    if (reply.inScope) await recordAnswered(c.env.DB, user.id, ticket);
    const { questions } = await subscriptionView(c.env.DB, user, c.env.ADMIN_EMAILS, now);
    return c.json({
      answer: reply.inScope ? reply.answer : outOfScopeAnswer(card.title, language),
      inScope: reply.inScope,
      questions,
    });
  });

  return routes;
}
