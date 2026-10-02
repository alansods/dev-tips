// Repetição espaçada por caixas (Leitner): "não sei" volta para a caixa 1 e
// revisa no mesmo dia; "sei" sobe uma caixa e revisa depois do intervalo dela.

import type { Theme } from '../content';
import { addDays } from './clock';
import { progressKey, type AnswerResult } from './rules';

export type Box = 1 | 2 | 3 | 4 | 5;
export type CardSchedule = { box: Box; due: string };
/** Agendamento por chave `themeId:cardId`. */
export type Schedule = Record<string, CardSchedule>;

export const INTERVAL_DAYS: Record<Exclude<Box, 1>, number> = { 2: 3, 3: 7, 4: 14, 5: 30 };

export function nextSchedule(prev: CardSchedule | undefined, result: AnswerResult, day: string): CardSchedule {
  if (result === 'unknown') return { box: 1, due: day };
  const box = Math.min(5, (prev?.box ?? 1) + 1) as Exclude<Box, 1>;
  return { box, due: addDays(day, INTERVAL_DAYS[box]) };
}

/** Cards do tema com revisão até `day`, na ordem dos decks e dos cards. */
export function dueCardIds(theme: Theme, schedule: Schedule, day: string): string[] {
  return theme.decks
    .flatMap((deck) => deck.cards)
    .filter((card) => {
      const entry = schedule[progressKey(theme.id, card.id)];
      return entry !== undefined && entry.due <= day;
    })
    .map((card) => card.id);
}
