import type { Area, ConceptCard, Level } from '../content';
import { normalize } from '../content/text';
import type { AnswerResult } from '../study/rules';

export { normalize };

export type GlossaryEntry = { trackId: string; concept: ConceptCard };

/** Filtra por termo, definição e outros nomes; consulta vazia devolve tudo, na ordem original. */
export function searchTerms(entries: GlossaryEntry[], query: string): GlossaryEntry[] {
  const q = normalize(query.trim());
  if (!q) return entries;
  return entries.filter(({ concept }) =>
    [concept.term, concept.definition, ...(concept.aliases ?? [])].some((text) => normalize(text).includes(q)),
  );
}

/**
 * Ordem alfabética do nome, sem diferenciar maiúsculas, minúsculas e acentos.
 * O `sort` é estável: nomes iguais mantêm a ordem recebida (a das trilhas).
 */
export function sortTerms(entries: readonly GlossaryEntry[]): GlossaryEntry[] {
  return entries
    .map((entry) => ({ entry, key: normalize(entry.concept.term) }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
    .map(({ entry }) => entry);
}

/** Linha da lista: cabeçalho de letra ou termo (com a posição dentro da letra, para desenhar o grupo). */
export type GlossaryRow =
  { kind: 'letter'; letter: string } | { kind: 'term'; entry: GlossaryEntry; first: boolean; last: boolean };

const letterOf = (entry: GlossaryEntry) => normalize(entry.concept.term).charAt(0).toUpperCase();

/** Intercala um cabeçalho antes do primeiro termo de cada letra (a lista já deve estar ordenada). */
export function withLetterHeaders(entries: readonly GlossaryEntry[]): GlossaryRow[] {
  const rows: GlossaryRow[] = [];
  entries.forEach((entry, i) => {
    const letter = letterOf(entry);
    const first = i === 0 || letterOf(entries[i - 1]) !== letter;
    const last = i === entries.length - 1 || letterOf(entries[i + 1]) !== letter;
    if (first) rows.push({ kind: 'letter', letter });
    rows.push({ kind: 'term', entry, first, last });
  });
  return rows;
}

/** Filtro "Seu estudo": revisar = respondeu "não sabia"; não vistos = sem resposta. */
export type StudyFilter = 'all' | 'review' | 'known' | 'new';

export type GlossaryFilters = {
  study: StudyFilter;
  area: Area | null;
  level: Level | null;
  /** Trilhas marcadas; vazio = todas. */
  trackIds: string[];
};

export const NO_FILTERS: GlossaryFilters = { study: 'all', area: null, level: null, trackIds: [] };

/** Quantos filtros estão ativos (cada trilha marcada conta um), para o botão "Filtros · N". */
export const countActive = (f: GlossaryFilters) =>
  (f.study === 'all' ? 0 : 1) + (f.area ? 1 : 0) + (f.level ? 1 : 0) + f.trackIds.length;

const STUDY_MATCH: Record<StudyFilter, (status: AnswerResult | undefined) => boolean> = {
  all: () => true,
  review: (s) => s === 'unknown',
  known: (s) => s === 'known',
  new: (s) => s === undefined,
};

/** Termos que atendem a todos os grupos com filtro ativo; com várias trilhas, vale qualquer uma. */
export function filterTerms(
  entries: readonly GlossaryEntry[],
  filters: GlossaryFilters,
  ctx: { areaOf: (trackId: string) => Area | undefined; statusOf: (entry: GlossaryEntry) => AnswerResult | undefined },
): GlossaryEntry[] {
  return entries.filter(
    (entry) =>
      STUDY_MATCH[filters.study](ctx.statusOf(entry)) &&
      (!filters.area || ctx.areaOf(entry.trackId) === filters.area) &&
      (!filters.level || entry.concept.level === filters.level) &&
      (filters.trackIds.length === 0 || filters.trackIds.includes(entry.trackId)),
  );
}
