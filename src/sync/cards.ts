// Conversão entre o estado de estudo (progress + schedule por `themeId:cardId`)
// e as mudanças de card que a API sincroniza.

import type { Progress } from '../study/rules';
import type { Schedule } from '../study/srs';
import type { CardChange } from './store';

export function splitKey(key: string): { themeId: string; cardId: string } {
  const i = key.indexOf(':');
  return { themeId: key.slice(0, i), cardId: key.slice(i + 1) };
}

/** A mudança que representa o estado atual do card (sem resposta = tudo nulo, o "zerado"). */
export function cardChange(key: string, progress: Progress, schedule: Schedule, updatedAt: number): CardChange {
  const entry = schedule[key];
  return {
    ...splitKey(key),
    result: progress[key] ?? null,
    box: entry?.box ?? null,
    due: entry?.due ?? null,
    updatedAt,
  };
}

/** Chaves cujo progresso ou agendamento mudou entre dois estados. */
export function changedKeys(
  prev: { progress: Progress; schedule: Schedule },
  next: { progress: Progress; schedule: Schedule },
) {
  if (prev.progress === next.progress && prev.schedule === next.schedule) return [];
  const keys = new Set([
    ...Object.keys(prev.progress),
    ...Object.keys(next.progress),
    ...Object.keys(prev.schedule),
    ...Object.keys(next.schedule),
  ]);
  return [...keys].filter((k) => prev.progress[k] !== next.progress[k] || prev.schedule[k] !== next.schedule[k]);
}
