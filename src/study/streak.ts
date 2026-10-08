// Dias estudados (YYYY-MM-DD, em ordem crescente) e a sequência de dias
// seguidos. Funções puras; o store guarda a lista.

import { addDays } from './clock';

/** Quantos dias para trás ficam guardados. */
export const KEEP_DAYS = 60;

/** Acrescenta o dia (sem repetir) e descarta os dias com mais de KEEP_DAYS. */
export function recordDay(days: readonly string[], day: string): string[] {
  const oldest = addDays(day, -KEEP_DAYS + 1);
  return [...new Set([...days, day])].filter((d) => d >= oldest && d <= day).sort();
}

/** Dias seguidos com estudo terminando hoje (ou ontem, se ainda não estudou hoje). */
export function currentStreak(days: readonly string[], today: string): number {
  const studied = new Set(days);
  let day = studied.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (studied.has(day)) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}
