// Regras das seções da aba Início, como funções puras: recebem o catálogo, o
// progresso, o agendamento e o dia, e devolvem o que cada seção mostra.

import type { Area, Deck, Track } from '../content';
import { areaPath, nextTracks } from '../content/navigation';
import { addDays } from '../study/clock';
import { deckStats, trackStats, type Progress, type Stats } from '../study/rules';
import { dueCardIds, type Schedule } from '../study/srs';

export type GreetingPeriod = 'morning' | 'afternoon' | 'evening';

/** Bom dia (5h–11h59), boa tarde (12h–17h59), boa noite (o resto). */
export function greetingPeriod(hour: number): GreetingPeriod {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

export function firstName(name: string | null | undefined): string | undefined {
  const first = name?.trim().split(/\s+/)[0];
  return first ? first : undefined;
}

const started = (track: Track, progress: Progress) => trackStats(track, progress).answered > 0;

export type ReviewSummary = {
  total: number;
  /** Trilhas com cards para revisar hoje, da que tem mais para a que tem menos. */
  tracks: { track: Track; count: number }[];
  /** Estimativa: meio minuto por card, arredondado para cima. */
  minutes: number;
  /** Cards que passam a vencer amanhã. */
  tomorrow: number;
};

export function reviewSummary(catalog: readonly Track[], schedule: Schedule, today: string): ReviewSummary {
  const tracks = catalog
    .map((track) => ({ track, count: dueCardIds(track, schedule, today).length }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);
  const total = tracks.reduce((n, t) => n + t.count, 0);
  const tomorrow = catalog.reduce(
    (n, track) => n + dueCardIds(track, schedule, addDays(today, 1)).length - dueCardIds(track, schedule, today).length,
    0,
  );
  return { total, tracks, minutes: Math.ceil(total / 2), tomorrow };
}

export type ContinueTarget = { track: Track; deck: Deck; position: number; deckCount: number; stats: Stats };

/** O deck do card da última resposta, se ele ainda existir no catálogo. */
export function continueTarget(
  catalog: readonly Track[],
  lastAnswer: { trackId: string; cardId: string } | null,
  progress: Progress,
): ContinueTarget | null {
  if (!lastAnswer) return null;
  const track = catalog.find((t) => t.id === lastAnswer.trackId);
  const index = track?.decks.findIndex((d) => d.cards.some((c) => c.id === lastAnswer.cardId)) ?? -1;
  if (!track || index === -1) return null;
  const deck = track.decks[index];
  return {
    track,
    deck,
    position: index + 1,
    deckCount: track.decks.length,
    stats: deckStats(track.id, deck, progress),
  };
}

/** Trilhas com algo respondido e nem tudo como "já sabia", na ordem do catálogo. */
export function inProgressTracks(
  catalog: readonly Track[],
  progress: Progress,
  exceptId?: string,
  limit = 3,
): { track: Track; percent: number }[] {
  return catalog
    .filter((track) => track.id !== exceptId)
    .map((track) => ({ track, stats: trackStats(track, progress) }))
    .filter(({ stats }) => stats.answered > 0 && stats.known < stats.total)
    .slice(0, limit)
    .map(({ track, stats }) => ({ track, percent: Math.round((stats.known / stats.total) * 100) }));
}

const interestAreas = (interests: readonly Area[]): Area[] => (interests.length > 0 ? [...interests] : ['fundamentos']);

export type Suggestions = { kind: 'next'; after: Track; tracks: Track[] } | { kind: 'forYou'; tracks: Track[] };

/**
 * Até 3 trilhas não iniciadas: as que dependem da trilha da última resposta
 * ou, sem nenhuma, as primeiras da ordem sugerida das áreas de interesse.
 */
export function suggestions(
  catalog: readonly Track[],
  progress: Progress,
  lastTrackId: string | null,
  interests: readonly Area[],
  limit = 3,
): Suggestions | null {
  const after = catalog.find((t) => t.id === lastTrackId);
  if (after) {
    const tracks = nextTracks(catalog, after.id)
      .filter((t) => !started(t, progress))
      .slice(0, limit);
    if (tracks.length > 0) return { kind: 'next', after, tracks };
  }
  const seen = new Set<string>();
  const tracks = interestAreas(interests)
    .flatMap((area) => areaPath(catalog, area))
    .filter((t) => !started(t, progress) && !seen.has(t.id) && seen.add(t.id))
    .slice(0, limit);
  return tracks.length > 0 ? { kind: 'forYou', tracks } : null;
}

/** Até 3 trilhas incluídas nos últimos 30 dias, da mais recente (empate: a registrada depois). */
export function newTracks(catalog: readonly Track[], today: string, limit = 3): Track[] {
  const since = addDays(today, -29);
  return catalog
    .map((track, index) => ({ track, index }))
    .filter(({ track }) => track.addedAt !== undefined && track.addedAt >= since && track.addedAt <= today)
    .sort((a, b) => b.track.addedAt!.localeCompare(a.track.addedAt!) || b.index - a.index)
    .slice(0, limit)
    .map(({ track }) => track);
}

/** Primeira trilha sem pré-requisitos da área de interesse (ou de Fundamentos) e a seguinte a ela. */
export function startHere(
  catalog: readonly Track[],
  interests: readonly Area[],
): { start: Track; then?: Track } | null {
  const start = areaPath(catalog, interestAreas(interests)[0]).find((t) => t.prerequisites.length === 0);
  if (!start) return null;
  return { start, then: nextTracks(catalog, start.id)[0] };
}

/** Os últimos 7 dias, terminando hoje, com os dias estudados marcados. */
export function lastSevenDays(days: readonly string[], today: string): { day: string; studied: boolean }[] {
  const studied = new Set(days);
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDays(today, i - 6);
    return { day, studied: studied.has(day) };
  });
}
