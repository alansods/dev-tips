// Busca e filtros da aba Trilhas, como função pura. O estado de cada trilha
// (concluída, em andamento, não iniciada) vem de quem chama.

import { AREAS, type Area, type Track } from './schema';
import type { Taxonomy } from './taxonomy';
import { normalize } from './text';

export type TrackStatusFilter = 'all' | 'started' | 'new' | 'done';

export type TrackFilter = {
  query: string;
  /** Id da linguagem do cadastro, ou `null` para todas. */
  language: string | null;
  status: TrackStatusFilter;
};

const searchableText = (track: Track, taxonomy: Taxonomy) =>
  normalize(
    [
      track.title,
      track.description,
      taxonomy.languages.find((l) => l.id === track.language)?.name ?? '',
      taxonomy.frameworks.find((f) => f.id === track.framework)?.name ?? '',
    ].join(' '),
  );

/** Trilhas que atendem a todos os critérios ativos, na ordem do catálogo. */
export function filterTracks(
  tracks: readonly Track[],
  taxonomy: Taxonomy,
  filter: TrackFilter,
  statusOf: (track: Track) => 'done' | 'started' | 'new',
): Track[] {
  const query = normalize(filter.query.trim());
  return tracks.filter(
    (track) =>
      (!query || searchableText(track, taxonomy).includes(query)) &&
      (filter.language === null || track.language === filter.language) &&
      (filter.status === 'all' || statusOf(track) === filter.status),
  );
}

/** Algum critério ativo (a aba troca as áreas pela lista de resultados). */
export const hasActiveFilter = (filter: TrackFilter) =>
  filter.query.trim() !== '' || filter.language !== null || filter.status !== 'all';

/** Trilhas agrupadas pela primeira área de cada uma, na ordem das áreas (cada trilha uma vez). */
export function groupByFirstArea(tracks: readonly Track[]): { area: Area; tracks: Track[] }[] {
  return AREAS.map((area) => ({ area, tracks: tracks.filter((t) => t.areas[0] === area) })).filter(
    (g) => g.tracks.length > 0,
  );
}
