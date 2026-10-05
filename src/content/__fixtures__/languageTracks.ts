// Testes parametrizados das trilhas de conteúdo de uma linguagem (ou grupo):
// todas seguem o mesmo formato (3 decks de conteúdo com 6 cards e 1 deck de
// perguntas com 6), autorais, ligadas ao glossário e com os três níveis.

import { catalog, getTrack } from '../catalog';
import { LEVELS, placementOf, type Placement, type Track } from '../index';

export type TrackSpec = {
  id: string;
  title: string;
  areas: string[];
  placement: Placement;
  /** Ids dos 3 decks de conteúdo, na ordem. */
  decks: string[];
};

type Options = {
  /** Nome do grupo usado nos títulos dos `describe` (ex.: "JavaScript"). */
  group: string;
  tracks: TrackSpec[];
  /** Id da trilha que vem logo antes do grupo no catálogo. */
  after: string;
  snippetLanguages: string[];
};

export function describeContentTracks({ group, tracks, after, snippetLanguages }: Options) {
  const ids = tracks.map((t) => t.id);
  const track = (id: string): Track => {
    const t = getTrack(id);
    if (!t) throw new Error(`trilha ${id} não registrada`);
    return t;
  };
  const cards = (id: string) => track(id).decks.flatMap((d) => d.cards);

  describe(`Requirement: Trilhas de ${group} no catálogo`, () => {
    it('Trilhas registradas', () => {
      const all = catalog.map((t) => t.id);
      const start = all.indexOf(after) + 1;
      expect(start).toBeGreaterThan(0);
      expect(all.slice(start, start + ids.length)).toEqual(ids);
    });

    it.each(tracks.map((t) => [t.id, t] as const))('%s: título, áreas e posição', (id, spec) => {
      const t = track(id);
      expect(t.title).toBe(spec.title);
      expect(t.areas).toEqual(spec.areas);
      expect(placementOf(t)).toEqual(spec.placement);
    });
  });

  describe(`Requirement: Decks das trilhas de ${group}`, () => {
    it.each(tracks.map((t) => [t.id, t] as const))('Contagem por deck: %s', (id, spec) => {
      const t = track(id);
      expect(t.decks.map((d) => d.id)).toEqual([...spec.decks, 'perguntas-de-entrevista']);
      expect(t.decks.map((d) => d.cards.length)).toEqual([6, 6, 6, 6]);
      expect(t.decks[3].title).toBe('Perguntas de entrevista');
      expect(new Set(t.decks[3].cards.map((c) => c.type))).toEqual(new Set(['question']));
      for (const deck of t.decks.slice(0, 3)) {
        expect(deck.cards.every((c) => c.type === 'concept' || c.type === 'code')).toBe(true);
      }
    });

    it.each(ids)('Conceitos em todo deck de conteúdo: %s', (id) => {
      for (const deck of track(id).decks.slice(0, 3)) {
        expect(deck.cards.filter((c) => c.type === 'concept').length).toBeGreaterThanOrEqual(2);
      }
    });

    it.each(ids)(`snippets em ${snippetLanguages.join(', ')}: %s`, (id) => {
      for (const card of cards(id)) {
        const snippet = card.type === 'code' || card.type === 'question' ? card.snippet : undefined;
        if (snippet) expect(snippetLanguages).toContain(snippet.language);
      }
    });
  });

  describe(`Requirement: Qualidade do conteúdo de ${group}`, () => {
    it.each(ids)('Sem complementos: %s', (id) => {
      expect(cards(id).filter((c) => c.origin === 'supplement')).toEqual([]);
    });

    it.each(ids)('Todos os cards ligados: %s', (id) => {
      expect(cards(id).filter((c) => c.relatedTerms.length === 0).map((c) => c.id)).toEqual([]);
    });

    it.each(ids)('Mistura de níveis: %s', (id) => {
      const levels = new Set(cards(id).map((c) => c.level));
      for (const level of LEVELS) expect(levels).toContain(level);
    });
  });
}

/** Atalhos para a posição esperada. */
export const core = (language: string): Placement => ({ kind: 'language', language });
export const framework = (language: string, id: string): Placement => ({ kind: 'framework', language, framework: id });
export const direct: Placement = { kind: 'direct' };
