/** Duração da virada do card (ms). */
export const FLIP_MS = 250;

/** Com "reduzir movimento" ligado no sistema, a troca é imediata. */
export function flipDuration(reducedMotion: boolean): number {
  return reducedMotion ? 0 : FLIP_MS;
}
