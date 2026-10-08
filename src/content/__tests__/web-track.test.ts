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
    expect(web().title).toBe('Fundamentos de programação e web');
    expect(web().variants).toBeUndefined();
    expect(web().compareColumns).toBeUndefined();
    expect(web().areas).toEqual(['fundamentos']);
    expect(placementOf(web())).toEqual({ kind: 'direct' });
  });
});

describe('Requirement: Decks e contagens', () => {
  it('Contagem por deck', () => {
    const track = web();
    expect(track.decks.map((d) => d.id)).toEqual([
      'variaveis-e-tipos',
      'fluxo-e-funcoes',
      'orientacao-a-objetos',
      'memoria-e-execucao',
      'http',
      'rest',
      'navegador-e-seguranca',
      'perguntas-de-entrevista',
    ]);
    const types = track.decks.map((d) => ({ n: d.cards.length, types: [...new Set(d.cards.map((c) => c.type))] }));
    expect(types).toEqual([
      { n: 6, types: ['concept'] },
      { n: 6, types: ['concept'] },
      { n: 6, types: ['concept'] },
      { n: 6, types: ['concept'] },
      { n: 7, types: ['concept'] },
      { n: 6, types: ['concept'] },
      { n: 8, types: ['concept'] },
      { n: 12, types: ['question'] },
    ]);
    expect(cards()).toHaveLength(57);
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

describe('Requirement: Conceitos gerais só em Fundamentos', () => {
  it('Sem termos repetidos nas linguagens', () => {
    const base = new Set(getGlossary(web()).map((c) => c.term.toLowerCase()));
    const repeated = catalog
      .filter((t) => t.language)
      .flatMap((t) => getGlossary(t).map((c) => `${t.id}: ${c.term}`))
      .filter((label) => base.has(label.slice(label.indexOf(': ') + 2).toLowerCase()));
    expect(repeated).toEqual([]);
  });

  it('Fundamentos antes da linguagem', () => {
    for (const id of ['javascript-essencial', 'java-essencial', 'python-essencial']) {
      expect(getTrack(id)?.prerequisites).toContain('fundamentos-web');
    }
  });
});
