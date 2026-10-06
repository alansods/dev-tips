import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';

import type { GeminiAnswer, GeminiClient, GeminiRequest } from '../src/assistant/gemini';
import { questionUsage } from '../src/db/subscriptions';
import { clearDatabase, testApp } from './helpers/session';

const DAY = 24 * 60 * 60_000;
// Perto do relógio real: o access token é validado contra a hora atual.
const NOW = Date.now();
const PERIOD = NOW - 18 * DAY;

const CARD = {
  type: 'code',
  title: 'Closure com estado privado',
  text: '{"title":"Closure com estado privado","body":"A variável count só existe dentro da closure."}',
};

/** Gemini falso: grava os pedidos e devolve a resposta escolhida (ou falha). */
function fakeGemini(reply: GeminiAnswer | 'error' = { inScope: true, answer: 'Porque createCounter roda uma vez.' }) {
  const calls: { request: GeminiRequest; config: { apiKey: string; model: string } }[] = [];
  const client: GeminiClient = {
    ask: async (request, config) => {
      calls.push({ request, config });
      if (reply === 'error') throw new Error('Gemini 500');
      return reply;
    },
  };
  return { client, calls };
}

async function setup(opts: { plan?: 'free' | 'pro'; used?: number; gemini?: ReturnType<typeof fakeGemini> } = {}) {
  await clearDatabase();
  const gemini = opts.gemini ?? fakeGemini();
  const { app, login } = await testApp({ now: () => NOW, gemini: gemini.client });
  const session = await login();
  const userId = session.user.id;
  if ((opts.plan ?? 'pro') === 'pro') {
    await env.DB.prepare(
      'INSERT INTO subscriptions (user_id, period_start, expires_at, will_renew, product_id, last_event_at) VALUES (?, ?, ?, 1, ?, ?)',
    )
      .bind(userId, PERIOD, NOW + 12 * DAY, 'pro_monthly', PERIOD)
      .run();
  }
  if (opts.used) {
    await env.DB.prepare('INSERT INTO question_usage (user_id, period_start, used) VALUES (?, ?, ?)')
      .bind(userId, PERIOD, opts.used)
      .run();
  }
  const ask = (body: unknown, token: string | null = session.accessToken) =>
    app().request(
      '/assistant/ask',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      },
      env,
    );
  return { ask, userId, gemini };
}

const body = (extra: Record<string, unknown> = {}) => ({
  card: CARD,
  history: [],
  question: 'Por que o count não volta a 0?',
  language: 'pt-BR',
  ...extra,
});

const errorCode = async (res: Response) => (await res.json<{ error: { code: string } }>()).error.code;

beforeEach(async () => {
  await clearDatabase();
});

describe('Requirement: Perguntar sobre o card na API', () => {
  it('Pergunta respondida', async () => {
    const { ask, userId } = await setup({ used: 30 });
    const res = await ask(body());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      answer: 'Porque createCounter roda uma vez.',
      inScope: true,
      questions: { used: 31, limit: 100 },
    });
    expect(await questionUsage(env.DB, userId, PERIOD)).toBe(31);
  });

  it('Plano grátis', async () => {
    const { ask, gemini } = await setup({ plan: 'free' });
    const res = await ask(body());
    expect(res.status).toBe(403);
    expect(await errorCode(res)).toBe('pro_required');
    expect(gemini.calls).toHaveLength(0);
  });

  it('Cota esgotada', async () => {
    const { ask, gemini } = await setup({ used: 100 });
    const res = await ask(body());
    expect(res.status).toBe(429);
    expect(await errorCode(res)).toBe('quota_exceeded');
    expect(gemini.calls).toHaveLength(0);
  });

  it('Pergunta longa demais', async () => {
    const { ask, gemini } = await setup();
    const res = await ask(body({ question: 'a'.repeat(501) }));
    expect(res.status).toBe(400);
    expect(await errorCode(res)).toBe('invalid_body');
    expect(gemini.calls).toHaveLength(0);
  });

  it('Pergunta vazia', async () => {
    const { ask } = await setup();
    expect((await ask(body({ question: '   ' }))).status).toBe(400);
  });

  it('Histórico longo demais', async () => {
    const { ask } = await setup();
    const history = Array.from({ length: 11 }, () => ({ role: 'user', text: 'oi' }));
    expect((await ask(body({ history }))).status).toBe(400);
  });

  it('Sem sessão', async () => {
    const { ask } = await setup();
    const res = await ask(body(), null);
    expect(res.status).toBe(401);
    expect(await errorCode(res)).toBe('unauthorized');
  });
});

describe('Requirement: Respostas só sobre o card', () => {
  it('Contexto enviado ao modelo', async () => {
    const { ask, gemini } = await setup();
    await ask(
      body({
        language: 'en',
        question: 'And the count?',
        history: [
          { role: 'user', text: 'What is a closure?' },
          { role: 'assistant', text: 'A function that remembers its scope.' },
        ],
      }),
    );
    const { request, config } = gemini.calls[0];
    expect(config).toEqual({ apiKey: 'chave-gemini-teste', model: 'gemini-3.8-flash' });
    expect(request.system).toContain(CARD.text);
    expect(request.system).toContain('English');
    expect(request.system).toMatch(/only/i);
    expect(request.history).toEqual([
      { role: 'user', text: 'What is a closure?' },
      { role: 'model', text: 'A function that remembers its scope.' },
    ]);
    expect(request.question).toBe('And the count?');
  });

  it('Pergunta fora do escopo', async () => {
    const { ask, userId } = await setup({
      used: 30,
      gemini: fakeGemini({ inScope: false, answer: 'React e Vue são...' }),
    });
    const res = await ask(body({ question: 'Qual a diferença entre React e Vue?' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      inScope: false,
      answer:
        'Só consigo ajudar com o conteúdo deste card: Closure com estado privado. Quer que eu explique algum ponto dele?',
      questions: { used: 30, limit: 100 },
    });
    expect(await questionUsage(env.DB, userId, PERIOD)).toBe(30);
  });

  it('Recusa em inglês', async () => {
    const { ask } = await setup({ gemini: fakeGemini({ inScope: false, answer: 'x' }) });
    const res = await ask(body({ language: 'en' }));
    expect(((await res.json()) as { answer: string }).answer).toBe(
      'I can only help with the content of this card: Closure com estado privado. Want me to explain any part of it?',
    );
  });
});

describe('Requirement: Falha do modelo', () => {
  it('Modelo fora do ar', async () => {
    const { ask, userId } = await setup({ used: 30, gemini: fakeGemini('error') });
    const res = await ask(body());
    expect(res.status).toBe(502);
    expect(await errorCode(res)).toBe('assistant_unavailable');
    expect(await questionUsage(env.DB, userId, PERIOD)).toBe(30);
  });
});
