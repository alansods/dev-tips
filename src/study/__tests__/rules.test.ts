import { getTheme } from '../../content/catalog';
import type { Deck } from '../../content';
import {
  cardTitle,
  deckAction,
  deckStats,
  initialSession,
  progressKey,
  sessionCardIds,
  sessionReducer,
  summary,
  themeStats,
  type Progress,
} from '../rules';

const theme = getTheme('crud-4-frameworks')!;
const deck = (id: string): Deck => theme.decks.find((d) => d.id === id)!;
const endpoints = deck('o-que-vamos-criar');
const ids = (d: Deck) => d.cards.map((c) => c.id);
const key = (cardId: string) => progressKey(theme.id, cardId);

describe('Requirement: Deck com progresso e ação', () => {
  it('Deck nunca estudado', () => {
    const glossary = deck('glossario');
    const stats = deckStats(theme.id, glossary, {});
    expect(stats).toEqual({ total: 24, known: 0, unknown: 0, answered: 0 });
    expect(deckAction(stats)).toBe('start');
    expect(sessionCardIds(theme.id, glossary, {})).toEqual(ids(glossary));
  });

  it('Continuar de onde parou', () => {
    const [a, b, c] = ids(endpoints);
    const progress: Progress = { [key(a)]: 'known', [key(b)]: 'known', [key(c)]: 'unknown' };
    const stats = deckStats(theme.id, endpoints, progress);
    expect(stats).toMatchObject({ total: 5, known: 2, unknown: 1, answered: 3 });
    expect(deckAction(stats)).toBe('continue');
    expect(sessionCardIds(theme.id, endpoints, progress)).toEqual(ids(endpoints).slice(2));
  });

  it('Deck dominado', () => {
    const progress: Progress = Object.fromEntries(ids(endpoints).map((id) => [key(id), 'known']));
    const stats = deckStats(theme.id, endpoints, progress);
    expect(stats.known).toBe(5);
    expect(deckAction(stats)).toBe('restart');
    expect(sessionCardIds(theme.id, endpoints, progress)).toEqual(ids(endpoints));
  });

  it('progresso de outro tema não conta', () => {
    const progress: Progress = { [progressKey('outro-tema', ids(endpoints)[0])]: 'known' };
    expect(deckStats(theme.id, endpoints, progress).known).toBe(0);
  });

  it('themeStats soma todos os decks', () => {
    const progress: Progress = { [key(ids(endpoints)[0])]: 'known', [key('api')]: 'known' };
    const stats = themeStats(theme, progress);
    expect(stats.known).toBe(2);
    expect(stats.total).toBe(theme.decks.reduce((n, d) => n + d.cards.length, 0));
  });
});

describe('Requirement: Virar e responder', () => {
  it('Virar o card', () => {
    const state = sessionReducer(initialSession(['a', 'b']), { type: 'reveal' });
    expect(state.revealed).toBe(true);
  });

  it('Responder e avançar', () => {
    let state = initialSession(['a', 'b', 'c', 'd', 'e']);
    state = sessionReducer(state, { type: 'reveal' });
    state = sessionReducer(state, { type: 'answer', result: 'known' });
    expect(state).toMatchObject({ index: 1, revealed: false, finished: false, results: { a: 'known' } });
  });

  it('Não responder sem ver o verso', () => {
    const state = initialSession(['a', 'b']);
    expect(sessionReducer(state, { type: 'answer', result: 'known' })).toBe(state);
  });

  it('termina depois do último card', () => {
    let state = initialSession(['a']);
    state = sessionReducer(state, { type: 'reveal' });
    state = sessionReducer(state, { type: 'answer', result: 'unknown' });
    expect(state.finished).toBe(true);
    expect(sessionReducer(state, { type: 'reveal' })).toBe(state);
  });

  it('restart começa uma nova sessão com outros cards', () => {
    const state = sessionReducer(initialSession(['a', 'b']), { type: 'restart', ids: ['b'] });
    expect(state).toEqual(initialSession(['b']));
  });
});

describe('Requirement: Resumo da sessão', () => {
  function answerAll(results: ('known' | 'unknown')[]) {
    let state = initialSession(results.map((_, i) => `c${i}`));
    for (const result of results) {
      state = sessionReducer(state, { type: 'reveal' });
      state = sessionReducer(state, { type: 'answer', result });
    }
    return state;
  }

  it('Resumo com erros', () => {
    const s = summary(answerAll(['known', 'unknown', 'known', 'unknown', 'known']));
    expect(s).toEqual({ known: 3, unknown: 2, missedIds: ['c1', 'c3'] });
  });

  it('Resumo sem erros', () => {
    expect(summary(answerAll(['known', 'known']))).toEqual({ known: 2, unknown: 0, missedIds: [] });
  });
});

describe('cardTitle', () => {
  it('identifica cada tipo de card', () => {
    const all = theme.decks.flatMap((d) => d.cards);
    const byId = (id: string) => all.find((c) => c.id === id)!;
    expect(cardTitle(byId('endpoint-create'))).toBe('POST /products');
    expect(cardTitle(byId('step-07'))).toBe('C: Criar produto');
    expect(cardTitle(byId('cmp-dto'))).toBe('DTO');
    expect(cardTitle(byId('cors'))).toBe('CORS');
    expect(cardTitle(byId('docker-compose'))).toBe('docker-compose.yml');
  });
});
