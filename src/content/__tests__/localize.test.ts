import { getCatalog } from '../catalog';
import { getGlossary } from '../glossary';
import { localizeTrack } from '../translation';
import { searchTerms } from '../../glossary/search';
import { cardById, crudTrack } from '../../test-utils';

describe('Requirement: Conteúdo no idioma escolhido', () => {
  it('Card traduzido', () => {
    const track = localizeTrack(crudTrack, { cards: { cors: { definition: 'A browser rule.' } } });
    expect(cardById('cors', track)).toMatchObject({ type: 'concept', term: 'CORS', definition: 'A browser rule.' });
  });

  it('Tradução parcial', () => {
    const original = cardById('step-01');
    const track = localizeTrack(crudTrack, { cards: { 'step-01': { title: 'Create the project' } } });
    const step = cardById('step-01', track);
    if (step.type !== 'step' || original.type !== 'step') throw new Error('esperava um card step');
    expect(step.title).toBe('Create the project');
    expect(step.whatIs).toBe(original.whatIs);
    expect(step.whyItMatters).toBe(original.whyItMatters);
  });

  it('Trilha sem tradução', () => {
    expect(localizeTrack(crudTrack, undefined)).toBe(crudTrack);
    expect(getCatalog('en', {}).map((t) => t.title)).toEqual(getCatalog('pt-BR').map((t) => t.title));
  });

  it('Código não muda', () => {
    const original = cardById('step-01');
    const track = localizeTrack(crudTrack, {
      cards: { 'step-01': { snippets: { express: { note: 'An English note.' } } } },
    });
    const step = cardById('step-01', track);
    if (step.type !== 'step' || original.type !== 'step') throw new Error('esperava um card step');
    expect(step.snippets.express.code).toBe(original.snippets.express.code);
    expect(step.snippets.express.note).toBe('An English note.');
    expect(step.snippets.spring).toEqual(original.snippets.spring);
    expect(step.id).toBe(original.id);
    expect(step.number).toBe(original.number);
  });

  it('textos de trilha e deck traduzidos; ids mantidos', () => {
    const deck = crudTrack.decks[0];
    const track = localizeTrack(crudTrack, { title: 'Same CRUD', decks: { [deck.id]: { title: 'What we will build' } } });
    expect(track.title).toBe('Same CRUD');
    expect(track.description).toBe(crudTrack.description);
    expect(track.decks[0]).toMatchObject({ id: deck.id, title: 'What we will build' });
    expect(track.id).toBe(crudTrack.id);
  });

  it('getCatalog aplica a tradução registrada e memoriza por idioma', () => {
    const translations = { [crudTrack.id]: { en: { title: 'Same CRUD' } } };
    expect(getCatalog('en', translations).find((t) => t.id === crudTrack.id)?.title).toBe('Same CRUD');
    expect(getCatalog('pt-BR')).toBe(getCatalog('pt-BR'));
    expect(getCatalog('en')).toBe(getCatalog('en'));
  });
});

describe('Requirement: Busca do glossário no idioma exibido', () => {
  it('Buscar em inglês', () => {
    const track = localizeTrack(crudTrack, {
      cards: { cors: { definition: 'A browser rule that blocks requests from other origins.' } },
    });
    const entries = getGlossary(track).map((concept) => ({ trackId: track.id, concept }));
    expect(searchTerms(entries, 'browser').map((e) => e.concept.term)).toEqual(['CORS']);
  });
});
