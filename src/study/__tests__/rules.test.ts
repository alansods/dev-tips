import { getTrack } from '../../content/catalog';
import type { Deck } from '../../content';
import {
  cardTitle,
  deckAction,
  deckStats,
  initialSession,
  progressKey,
  sessionCardIds,
  sessionOrder,
  sessionReducer,
  summary,
  trackStats,
  type Progress,
} from '../rules';

const track = getTrack('crud-4-frameworks')!;
const deck = (id: string): Deck => track.decks.find((d) => d.id === id)!;
const endpoints = deck('o-que-vamos-criar');
const ids = (d: Deck) => d.cards.map((c) => c.id);
const key = (cardId: string) => progressKey(track.id, cardId);

describe('Requirement: Deck com progresso e ação', () => {
  it('Deck nunca estudado', () => {
    const glossary = deck('glossario');
    const stats = deckStats(track.id, glossary, {});
    expect(stats).toEqual({ total: 24, known: 0, unknown: 0, answered: 0 });
    expect(deckAction(stats)).toBe('start');
    expect(sessionCardIds(track.id, glossary, {})).toEqual(ids(glossary));
  });

  it('Continuar de onde parou', () => {
    const [a, b, c] = ids(endpoints);
    const progress: Progress = { [key(a)]: 'known', [key(b)]: 'known', [key(c)]: 'unknown' };
    const stats = deckStats(track.id, endpoints, progress);
    expect(stats).toMatchObject({ total: 5, known: 2, unknown: 1, answered: 3 });
    expect(deckAction(stats)).toBe('continue');
    expect(sessionCardIds(track.id, endpoints, progress)).toEqual(ids(endpoints).slice(2));
  });

  it('Deck dominado', () => {
    const progress: Progress = Object.fromEntries(ids(endpoints).map((id) => [key(id), 'known']));
    const stats = deckStats(track.id, endpoints, progress);
    expect(stats.known).toBe(5);
    expect(deckAction(stats)).toBe('restart');
    expect(sessionCardIds(track.id, endpoints, progress)).toEqual(ids(endpoints));
  });

  it('progresso de outra trilha não conta', () => {
    const progress: Progress = { [progressKey('outro-trilha', ids(endpoints)[0])]: 'known' };
    expect(deckStats(track.id, endpoints, progress).known).toBe(0);
  });

  it('trackStats soma todos os decks', () => {
    const progress: Progress = { [key(ids(endpoints)[0])]: 'known', [key('api')]: 'known' };
    const stats = trackStats(track, progress);
    expect(stats.known).toBe(2);
    expect(stats.total).toBe(track.decks.reduce((n, d) => n + d.cards.length, 0));
  });
});

describe('Requirement: Virar e responder', () => {
  it('Virar o card', () => {
    const state = sessionReducer(initialSession(['a', 'b']), { type: 'flip' });
    expect(state.revealed).toBe(true);
  });

  it('Voltar para a pergunta', () => {
    let state = sessionReducer(initialSession(['a', 'b']), { type: 'flip' });
    state = sessionReducer(state, { type: 'flip' });
    expect(state).toMatchObject({ index: 0, revealed: false, results: {} });
    // de volta à frente, não dá para responder
    expect(sessionReducer(state, { type: 'answer', result: 'known' })).toBe(state);
  });

  it('Virar de novo', () => {
    let state = initialSession(['a', 'b']);
    for (let i = 0; i < 3; i++) state = sessionReducer(state, { type: 'flip' });
    expect(state.revealed).toBe(true);
    state = sessionReducer(state, { type: 'answer', result: 'unknown' });
    expect(state).toMatchObject({ index: 1, revealed: false, results: { a: 'unknown' } });
  });

  it('Responder e avançar', () => {
    let state = initialSession(['a', 'b', 'c', 'd', 'e']);
    state = sessionReducer(state, { type: 'flip' });
    state = sessionReducer(state, { type: 'answer', result: 'known' });
    expect(state).toMatchObject({ index: 1, revealed: false, finished: false, results: { a: 'known' } });
  });

  it('Não responder sem ver o verso', () => {
    const state = initialSession(['a', 'b']);
    expect(sessionReducer(state, { type: 'answer', result: 'known' })).toBe(state);
  });

  it('termina depois do último card', () => {
    let state = initialSession(['a']);
    state = sessionReducer(state, { type: 'flip' });
    state = sessionReducer(state, { type: 'answer', result: 'unknown' });
    expect(state.finished).toBe(true);
    expect(sessionReducer(state, { type: 'flip' })).toBe(state);
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
      state = sessionReducer(state, { type: 'flip' });
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

describe('Requirement: Sessão de estudo (ordem sorteada)', () => {
  const allCards = new Map(track.decks.flatMap((d) => d.cards).map((c) => [c.id, c]));
  const always = (value: number) => () => value;

  it('Ordem sorteada', () => {
    // Com o sorteio sempre 0, Fisher-Yates troca cada posição com a primeira.
    const ordered = ids(endpoints);
    const [a, b, c, d, e] = ordered;
    expect(sessionOrder(ordered, allCards, always(0))).toEqual([b, c, d, e, a]);
  });

  it('sorteio próximo de 1 mantém a ordem original', () => {
    expect(sessionOrder(ids(endpoints), allCards, always(0.999999))).toEqual(ids(endpoints));
  });

  it('Passos em ordem', () => {
    const steps = deck('passo-a-passo');
    const result = sessionOrder(ids(steps), allCards, always(0));
    const numbers = result
      .map((id) => allCards.get(id)!)
      .flatMap((card) => (card.type === 'step' ? [card.number] : []));
    expect(numbers).toEqual([...numbers].sort((x, y) => x - y));
    expect(result).not.toEqual(ids(steps)); // os outros cards foram sorteados
  });

  it('Mesmos cards', () => {
    const steps = deck('passo-a-passo');
    const result = sessionOrder(ids(steps), allCards, Math.random);
    expect([...result].sort()).toEqual([...ids(steps)].sort());
  });

  it('não altera a lista recebida', () => {
    const ordered = ids(endpoints);
    sessionOrder(ordered, allCards, always(0));
    expect(ordered).toEqual(ids(endpoints));
  });
});

describe('cardTitle', () => {
  it('identifica cada tipo de card', () => {
    const all = track.decks.flatMap((d) => d.cards);
    const byId = (id: string) => all.find((c) => c.id === id)!;
    expect(cardTitle(byId('endpoint-create'))).toBe('POST /products');
    expect(cardTitle(byId('step-07'))).toBe('C: Criar produto');
    expect(cardTitle(byId('cmp-dto'))).toBe('DTO');
    expect(cardTitle(byId('cors'))).toBe('CORS');
    expect(cardTitle(byId('docker-compose'))).toBe('docker-compose.yml');
  });
});
