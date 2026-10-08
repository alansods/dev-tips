/**
 * @jest-environment node
 */
import { catalog, getTrack } from '../catalog';
import { getGlossary, LEVELS, placementOf, type Track } from '../index';

const ID = 'fundamentos-de-programacao';
const prog = (): Track => {
  const track = getTrack(ID);
  if (!track) throw new Error(`trilha ${ID} não registrada`);
  return track;
};
const cards = () => prog().decks.flatMap((d) => d.cards);
const terms = (id: string) => new Set(getGlossary(getTrack(id)!).map((c) => c.term.toLowerCase()));

describe('Requirement: Identidade da trilha', () => {
  it('Trilha no catálogo', () => {
    expect(catalog.map((t) => t.id).slice(0, 3)).toEqual(['crud-4-frameworks', ID, 'fundamentos-web']);
    expect(prog().title).toBe('Fundamentos de programação');
    expect(prog().areas).toEqual(['fundamentos']);
    expect(placementOf(prog())).toEqual({ kind: 'direct' });
    expect(prog().variants).toBeUndefined();
    expect(prog().compareColumns).toBeUndefined();
    expect(prog().prerequisites).toEqual([]);
  });
});

describe('Requirement: Decks da trilha de fundamentos de programação', () => {
  it('Contagem por deck', () => {
    const track = prog();
    expect(track.decks.map((d) => d.id)).toEqual([
      'variaveis-e-tipos',
      'fluxo-e-funcoes',
      'orientacao-a-objetos',
      'memoria-e-execucao',
      'perguntas-de-entrevista',
    ]);
    const types = track.decks.map((d) => ({ n: d.cards.length, types: [...new Set(d.cards.map((c) => c.type))] }));
    expect(types).toEqual([
      { n: 6, types: ['concept'] },
      { n: 6, types: ['concept'] },
      { n: 6, types: ['concept'] },
      { n: 6, types: ['concept'] },
      { n: 6, types: ['question'] },
    ]);
    expect(cards()).toHaveLength(30);
  });

  it('Sem termos repetidos entre trilhas', () => {
    const others = new Set([...terms('crud-4-frameworks'), ...terms('fundamentos-web')]);
    expect(getGlossary(prog()).filter((c) => others.has(c.term.toLowerCase())).map((c) => c.term)).toEqual([]);
  });
});

describe('Requirement: Qualidade da trilha de fundamentos de programação', () => {
  it('Sem complementos', () => {
    expect(cards().filter((c) => c.origin === 'supplement')).toEqual([]);
  });

  it('Todos os cards ligados', () => {
    expect(cards().filter((c) => c.relatedTerms.length === 0).map((c) => c.id)).toEqual([]);
  });

  it('Mistura de níveis', () => {
    const levels = new Set(cards().map((c) => c.level));
    for (const level of LEVELS) expect(levels).toContain(level);
  });
});

describe('Requirement: Conceitos gerais só em Fundamentos de programação', () => {
  it('Sem termos repetidos nas linguagens', () => {
    const base = terms(ID);
    const repeated = catalog
      .filter((t) => t.language)
      .flatMap((t) => getGlossary(t).map((c) => ({ track: t.id, term: c.term })))
      .filter(({ term }) => base.has(term.toLowerCase()))
      .map(({ track, term }) => `${track}: ${term}`);
    expect(repeated).toEqual([]);
  });

  it('Fundamentos antes da linguagem', () => {
    for (const id of ['javascript-essencial', 'java-essencial', 'python-essencial', 'csharp-essencial', 'ruby-essencial']) {
      expect(getTrack(id)?.prerequisites).toContain(ID);
    }
  });
});
