// Regras puras do estudo: progresso por deck/trilha, ação do deck, ordem da
// sessão e a máquina de estados da sessão (frente → verso → resposta).

import type { Card, Deck, Track } from '../content';

export type AnswerResult = 'known' | 'unknown';
/** Última resposta de cada card, por chave `trackId:cardId`. */
export type Progress = Record<string, AnswerResult>;

export const progressKey = (trackId: string, cardId: string) => `${trackId}:${cardId}`;

export type Stats = { total: number; known: number; unknown: number; answered: number };

function statsOf(trackId: string, cards: Card[], progress: Progress): Stats {
  let known = 0;
  let unknown = 0;
  for (const card of cards) {
    const result = progress[progressKey(trackId, card.id)];
    if (result === 'known') known++;
    else if (result === 'unknown') unknown++;
  }
  return { total: cards.length, known, unknown, answered: known + unknown };
}

export const deckStats = (trackId: string, deck: Deck, progress: Progress): Stats =>
  statsOf(trackId, deck.cards, progress);

export const trackStats = (track: Track, progress: Progress): Stats =>
  statsOf(
    track.id,
    track.decks.flatMap((d) => d.cards),
    progress,
  );

/** Progresso somado de várias trilhas (ex.: todas as de uma área). */
export const tracksStats = (tracks: readonly Track[], progress: Progress): Stats =>
  tracks.reduce<Stats>(
    (sum, track) => {
      const s = trackStats(track, progress);
      return {
        total: sum.total + s.total,
        known: sum.known + s.known,
        unknown: sum.unknown + s.unknown,
        answered: sum.answered + s.answered,
      };
    },
    { total: 0, known: 0, unknown: 0, answered: 0 },
  );

export type DeckAction = 'start' | 'continue' | 'restart';

export function deckAction(stats: Stats): DeckAction {
  if (stats.answered === 0) return 'start';
  if (stats.known === stats.total) return 'restart';
  return 'continue';
}

/** Cards da sessão aberta pelo botão do deck: todos, ou só os que ainda não estão como "já sabia". */
export function sessionCardIds(trackId: string, deck: Deck, progress: Progress): string[] {
  const action = deckAction(deckStats(trackId, deck, progress));
  const cards =
    action === 'continue' ? deck.cards.filter((c) => progress[progressKey(trackId, c.id)] !== 'known') : deck.cards;
  return cards.map((c) => c.id);
}

// ---------- sessão ----------

export type SessionState = {
  ids: string[];
  index: number;
  revealed: boolean;
  finished: boolean;
  results: Record<string, AnswerResult>;
};

export type SessionAction =
  { type: 'reveal' } | { type: 'answer'; result: AnswerResult } | { type: 'restart'; ids: string[] };

export const initialSession = (ids: string[]): SessionState => ({
  ids,
  index: 0,
  revealed: false,
  finished: ids.length === 0,
  results: {},
});

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  if (action.type === 'restart') return initialSession(action.ids);
  if (state.finished) return state;
  if (action.type === 'reveal') return state.revealed ? state : { ...state, revealed: true };
  // answer: só com o verso visível
  if (!state.revealed) return state;
  const id = state.ids[state.index];
  const results = { ...state.results, [id]: action.result };
  const last = state.index + 1 >= state.ids.length;
  return { ...state, results, revealed: false, index: last ? state.index : state.index + 1, finished: last };
}

export function summary(state: SessionState) {
  const missedIds = state.ids.filter((id) => state.results[id] === 'unknown');
  const known = state.ids.filter((id) => state.results[id] === 'known').length;
  return { known, unknown: missedIds.length, missedIds };
}

/** Título curto para listas (ex.: resumo "para revisar"). */
export function cardTitle(card: Card): string {
  switch (card.type) {
    case 'endpoint':
      return `${card.method} ${card.path}`;
    case 'step':
      return card.title;
    case 'compare':
      return card.concept;
    case 'concept':
      return card.term;
    case 'code':
      return card.title;
    case 'question':
      return card.question;
  }
}
