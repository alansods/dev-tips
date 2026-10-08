import { act, renderHook } from '@testing-library/react-native';

import { ApiError, NetworkError } from '../../auth/api';
import type { Card } from '../../content';
import { useSubscriptionStore } from '../../subscriptions/store';
import { ask } from '../api';
import { cardText, MAX_CARD_TEXT } from '../cardText';
import { useCardChat } from '../useCardChat';

jest.mock('../../auth/api', () => {
  const actual = jest.requireActual('../../auth/api');
  return { ...actual, authFetch: jest.fn() };
});
// eslint-disable-next-line @typescript-eslint/no-require-imports
const authFetch = require('../../auth/api').authFetch as jest.Mock;

const card = {
  type: 'code',
  id: 'closure-contador',
  level: 'pleno',
  title: 'Closure com estado privado',
  body: 'A variável count só existe dentro da closure.',
  snippet: { file: 'exemplo.js', language: 'js', code: 'function createCounter() {}' },
  relatedTerms: ['closure'],
} as unknown as Card;

const other = { ...card, id: 'outro-card', title: 'Outro' } as unknown as Card;

const OK = { answer: 'Porque roda uma vez.', inScope: true, questions: { used: 31, limit: 200 } };
const flush = () =>
  act(async () => {
    for (let i = 0; i < 10; i++) await Promise.resolve();
  });

beforeEach(() => authFetch.mockReset());

describe('cardText', () => {
  it('leva os campos do card, sem id nem termos relacionados', () => {
    const text = cardText(card);
    expect(text).toContain('Closure com estado privado');
    expect(text).toContain('A variável count só existe dentro da closure.');
    expect(text).toContain('function createCounter() {}');
    expect(text).not.toContain('closure-contador');
    expect(text).not.toContain('relatedTerms');
  });

  it('corta textos longos', () => {
    const long = { ...card, body: 'x'.repeat(20_000) } as unknown as Card;
    expect(cardText(long).length).toBe(MAX_CARD_TEXT);
  });
});

describe('ask', () => {
  const payload = {
    card: { type: 'code', title: 't', text: 'x' },
    history: [],
    question: 'q',
    language: 'pt-BR' as const,
  };

  it('sucesso', async () => {
    authFetch.mockResolvedValue(OK);
    expect(await ask(payload)).toEqual({ ok: true, ...OK });
    expect(authFetch).toHaveBeenCalledWith('/assistant/ask', { method: 'POST', body: JSON.stringify(payload) });
  });

  it.each([
    [new NetworkError('x'), 'offline'],
    [new ApiError(403, 'pro_required'), 'pro_required'],
    [new ApiError(429, 'quota_exceeded'), 'quota'],
    [new ApiError(502, 'assistant_unavailable'), 'error'],
  ])('falha %s vira %s', async (error, reason) => {
    authFetch.mockRejectedValue(error);
    expect(await ask(payload)).toEqual({ ok: false, reason });
  });
});

describe('useCardChat', () => {
  it('envia a pergunta com as últimas 6 mensagens e atualiza o uso do plano', async () => {
    useSubscriptionStore.setState({
      plan: { plan: 'pro', source: 'store', expiresAt: null, willRenew: true, questions: { used: 30, limit: 200 } },
    });
    authFetch.mockResolvedValue(OK);
    const { result } = renderHook(() => useCardChat(card, 'pt-BR'));
    for (let i = 0; i < 4; i++) {
      await act(() => result.current.send(`pergunta ${i}`));
    }
    const lastBody = JSON.parse(authFetch.mock.calls[3][1].body);
    expect(lastBody.history).toHaveLength(6);
    expect(lastBody.history[5]).toEqual({ role: 'assistant', text: 'Porque roda uma vez.' });
    expect(lastBody.question).toBe('pergunta 3');
    expect(lastBody.card.title).toBe('Closure com estado privado');
    expect(result.current.messages).toHaveLength(8);
    expect(useSubscriptionStore.getState().plan?.questions).toEqual({ used: 31, limit: 200 });
  });

  it('mostra "enviando" enquanto espera', async () => {
    authFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCardChat(card, 'pt-BR'));
    act(() => void result.current.send('oi'));
    await flush();
    expect(result.current.status).toBe('sending');
    expect(result.current.messages).toEqual([{ role: 'user', text: 'oi' }]);
  });

  it('tentar de novo reenvia a mesma pergunta sem duplicar', async () => {
    authFetch.mockRejectedValueOnce(new NetworkError('x')).mockResolvedValueOnce(OK);
    const { result } = renderHook(() => useCardChat(card, 'pt-BR'));
    await act(() => result.current.send('oi'));
    expect(result.current.status).toBe('offline');
    await act(() => result.current.retry());
    expect(JSON.parse(authFetch.mock.calls[1][1].body).question).toBe('oi');
    expect(result.current.messages.map((m) => m.role)).toEqual(['user', 'assistant']);
    expect(result.current.status).toBe('idle');
  });

  it('fora do card marca a resposta', async () => {
    authFetch.mockResolvedValue({ ...OK, inScope: false, answer: 'Só consigo ajudar...' });
    const { result } = renderHook(() => useCardChat(card, 'pt-BR'));
    await act(() => result.current.send('React?'));
    expect(result.current.messages[1]).toEqual({ role: 'assistant', text: 'Só consigo ajudar...', inScope: false });
  });

  it('cota e plano Pro expirado viram status', async () => {
    authFetch.mockRejectedValue(new ApiError(429, 'quota_exceeded'));
    const { result } = renderHook(() => useCardChat(card, 'pt-BR'));
    await act(() => result.current.send('oi'));
    expect(result.current.status).toBe('quota');
    authFetch.mockRejectedValue(new ApiError(403, 'pro_required'));
    await act(() => result.current.retry());
    expect(result.current.status).toBe('pro_required');
  });

  it('zera ao trocar de card e mantém no mesmo card', async () => {
    authFetch.mockResolvedValue(OK);
    const { result, rerender } = renderHook(({ c }: { c: Card }) => useCardChat(c, 'pt-BR'), {
      initialProps: { c: card },
    });
    await act(() => result.current.send('oi'));
    rerender({ c: { ...card } as Card });
    expect(result.current.messages).toHaveLength(2);
    rerender({ c: other });
    expect(result.current.messages).toEqual([]);
    expect(result.current.status).toBe('idle');
  });
});
