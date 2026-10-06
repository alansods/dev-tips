import { describe, expect, it } from 'vitest';

import { geminiClient } from '../src/assistant/gemini';

const CONFIG = { apiKey: 'chave-teste', model: 'gemini-3.8-flash' };
const REQUEST = {
  system: 'Responda só sobre o card.',
  history: [
    { role: 'user' as const, text: 'O que é closure?' },
    { role: 'model' as const, text: 'É uma função que lembra o escopo.' },
  ],
  question: 'E o count?',
};

type Call = { url: string; init: RequestInit };

function fakeFetch(response: () => Response | Promise<Response>) {
  const calls: Call[] = [];
  const fetcher = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return response();
  }) as unknown as typeof fetch;
  return { fetcher, calls };
}

const modelReply = (payload: unknown) =>
  new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] } }] }));

describe('Cliente do Gemini', () => {
  it('monta o pedido com instrução, histórico, pergunta e saída estruturada', async () => {
    const { fetcher, calls } = fakeFetch(() => modelReply({ inScope: true, answer: 'Porque...' }));
    await geminiClient(fetcher).ask(REQUEST, CONFIG);

    expect(calls[0].url).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
    );
    expect((calls[0].init.headers as Record<string, string>)['x-goog-api-key']).toBe('chave-teste');
    const body = JSON.parse(String(calls[0].init.body));
    expect(body.systemInstruction).toEqual({ parts: [{ text: 'Responda só sobre o card.' }] });
    expect(body.contents).toEqual([
      { role: 'user', parts: [{ text: 'O que é closure?' }] },
      { role: 'model', parts: [{ text: 'É uma função que lembra o escopo.' }] },
      { role: 'user', parts: [{ text: 'E o count?' }] },
    ]);
    expect(body.generationConfig).toMatchObject({
      responseMimeType: 'application/json',
      responseSchema: { type: 'OBJECT', required: ['inScope', 'answer'] },
      maxOutputTokens: 1500,
      // Gemini 3 pensa em nível "high" por padrão e esses tokens contam no limite de saída.
      thinkingConfig: { thinkingLevel: 'low' },
    });
  });

  it('lê a resposta estruturada', async () => {
    const { fetcher } = fakeFetch(() => modelReply({ inScope: false, answer: 'Fora.' }));
    expect(await geminiClient(fetcher).ask(REQUEST, CONFIG)).toEqual({ inScope: false, answer: 'Fora.' });
  });

  it('erro HTTP lança com a mensagem do Google', async () => {
    const { fetcher } = fakeFetch(
      () => new Response(JSON.stringify({ error: { message: 'The model is overloaded.' } }), { status: 400 }),
    );
    await expect(geminiClient(fetcher, { retryDelayMs: 0 }).ask(REQUEST, CONFIG)).rejects.toThrow(
      'Gemini respondeu 400: {"error":{"message":"The model is overloaded."}}',
    );
  });

  it('erro temporário (503) tenta de novo uma vez', async () => {
    let n = 0;
    const { fetcher, calls } = fakeFetch(() =>
      n++ === 0 ? new Response('{}', { status: 503 }) : modelReply({ inScope: true, answer: 'Agora foi.' }),
    );
    expect(await geminiClient(fetcher, { retryDelayMs: 0 }).ask(REQUEST, CONFIG)).toEqual({
      inScope: true,
      answer: 'Agora foi.',
    });
    expect(calls).toHaveLength(2);
  });

  it('erro temporário duas vezes lança', async () => {
    const { fetcher, calls } = fakeFetch(() => new Response('{}', { status: 503 }));
    await expect(geminiClient(fetcher, { retryDelayMs: 0 }).ask(REQUEST, CONFIG)).rejects.toThrow('503');
    expect(calls).toHaveLength(2);
  });

  it('erro que não é temporário não tenta de novo', async () => {
    const { fetcher, calls } = fakeFetch(() => new Response('{}', { status: 403 }));
    await expect(geminiClient(fetcher, { retryDelayMs: 0 }).ask(REQUEST, CONFIG)).rejects.toThrow('403');
    expect(calls).toHaveLength(1);
  });

  it('JSON fora do formato lança', async () => {
    const { fetcher } = fakeFetch(() => modelReply({ resposta: 'sem os campos' }));
    await expect(geminiClient(fetcher).ask(REQUEST, CONFIG)).rejects.toThrow();
  });

  it('resposta sem candidatos lança', async () => {
    const { fetcher } = fakeFetch(() => new Response(JSON.stringify({ candidates: [] })));
    await expect(geminiClient(fetcher).ask(REQUEST, CONFIG)).rejects.toThrow();
  });
});
