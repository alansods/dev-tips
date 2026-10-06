// Cliente da REST API do Gemini (generateContent). Pede saída estruturada
// { inScope, answer } para a rota saber se a pergunta era sobre o card.

import { z } from 'zod';

export type ChatTurn = { role: 'user' | 'model'; text: string };
export type GeminiRequest = { system: string; history: ChatTurn[]; question: string };
export type GeminiAnswer = { inScope: boolean; answer: string };
export type GeminiConfig = { apiKey: string; model: string };

export type GeminiClient = {
  /** Lança se o Gemini falhar, demorar demais ou responder fora do formato. */
  ask(request: GeminiRequest, config: GeminiConfig): Promise<GeminiAnswer>;
};

/** Inclui o raciocínio interno do modelo, que conta no mesmo limite. */
export const MAX_OUTPUT_TOKENS = 1_500;
const TIMEOUT_MS = 30_000;
/** Erros temporários (sobrecarga, limite de taxa, falha interna): vale tentar de novo uma vez. */
const RETRYABLE = [429, 500, 503];
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const answerSchema = z.object({ inScope: z.boolean(), answer: z.string().min(1) });

type GenerateContentResponse = { candidates?: { content?: { parts?: { text?: string }[] } }[] };

export const geminiClient = (fetcher: typeof fetch = fetch, { retryDelayMs = 1_000 } = {}): GeminiClient => ({
  async ask({ system, history, question }, { apiKey, model }) {
    const call = () =>
      fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [...history, { role: 'user', text: question }].map((turn) => ({
            role: turn.role,
            parts: [{ text: turn.text }],
          })),
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: { inScope: { type: 'BOOLEAN' }, answer: { type: 'STRING' } },
              required: ['inScope', 'answer'],
            },
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            temperature: 0.4,
            // O Gemini 3 pensa em nível "high" por padrão e esses tokens contam no limite de
            // saída: com raciocínio alto, a resposta vinha cortada. "low" basta para um chat.
            thinkingConfig: { thinkingLevel: 'low' },
          },
        }),
      });
    let res = await call();
    if (RETRYABLE.includes(res.status)) {
      await sleep(retryDelayMs);
      res = await call();
    }
    if (!res.ok) {
      // A mensagem do Google vai para o log (wrangler tail), nunca para o app.
      const detail = (await res.text().catch(() => '')).slice(0, 500);
      throw new Error(`Gemini respondeu ${res.status}: ${detail}`);
    }
    const data = await res.json<GenerateContentResponse>();
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('');
    if (!text) throw new Error('Gemini sem resposta');
    return answerSchema.parse(JSON.parse(text));
  },
});
