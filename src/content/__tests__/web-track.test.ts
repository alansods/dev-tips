/**
 * @jest-environment node
 */
import { catalog, getTrack } from '../catalog';
import { getGlossary, placementOf, type Track } from '../index';

const web = (): Track => {
  const track = getTrack('fundamentos-web');
  if (!track) throw new Error('trilha fundamentos-web não registrada');
  return track;
};
const cards = () => web().decks.flatMap((d) => d.cards);

describe('Requirement: Identidade da trilha', () => {
  it('Trilha no catálogo', () => {
    expect(catalog.map((t) => t.id).slice(0, 2)).toEqual(['crud-4-frameworks', 'fundamentos-web']);
    expect(web().title).toBe('Fundamentos web');
    expect(web().variants).toBeUndefined();
    expect(web().compareColumns).toBeUndefined();
    expect(web().areas).toEqual(['fundamentos']);
    expect(placementOf(web())).toEqual({ kind: 'direct' });
  });
});

describe('Requirement: Decks e contagens', () => {
  it('Contagem por deck', () => {
    const track = web();
    expect(track.decks.map((d) => d.id)).toEqual(['http', 'rest', 'navegador-e-seguranca', 'perguntas-de-entrevista']);
    const types = track.decks.map((d) => ({ n: d.cards.length, types: [...new Set(d.cards.map((c) => c.type))] }));
    expect(types).toEqual([
      { n: 7, types: ['concept'] },
      { n: 6, types: ['concept'] },
      { n: 8, types: ['concept'] },
      { n: 6, types: ['question'] },
    ]);
    expect(cards()).toHaveLength(27);
  });

  it('Sem termos repetidos entre trilhas', () => {
    const crud = new Set(getGlossary(getTrack('crud-4-frameworks')!).map((c) => c.term.toLowerCase()));
    const repeated = getGlossary(web()).filter((c) => crud.has(c.term.toLowerCase()));
    expect(repeated.map((c) => c.term)).toEqual([]);
  });
});

describe('Requirement: Conteúdo autoral', () => {
  it('Sem complementos', () => {
    expect(cards().filter((c) => c.origin === 'supplement')).toEqual([]);
  });
});

describe('Requirement: Ligação com o glossário', () => {
  it('Todos os cards ligados', () => {
    expect(cards().filter((c) => c.relatedTerms.length === 0).map((c) => c.id)).toEqual([]);
  });

  it('Pergunta ligada aos termos que cita', () => {
    const q = cards().find((c) => c.type === 'question' && c.question === 'Qual a diferença entre XSS e CSRF?');
    expect(q?.relatedTerms).toEqual(expect.arrayContaining(['xss', 'csrf']));
  });
});
