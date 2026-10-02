import { getCatalog } from '../catalog';
import { getGlossary } from '../glossary';
import { localizeTheme } from '../translation';
import { searchTerms } from '../../glossary/search';
import { cardById, crudTheme } from '../../test-utils';

describe('Requirement: Conteúdo no idioma escolhido', () => {
  it('Card traduzido', () => {
    const theme = localizeTheme(crudTheme, { cards: { cors: { definition: 'A browser rule.' } } });
    expect(cardById('cors', theme)).toMatchObject({ type: 'concept', term: 'CORS', definition: 'A browser rule.' });
  });

  it('Tradução parcial', () => {
    const original = cardById('step-01');
    const theme = localizeTheme(crudTheme, { cards: { 'step-01': { title: 'Create the project' } } });
    const step = cardById('step-01', theme);
    if (step.type !== 'step' || original.type !== 'step') throw new Error('esperava um card step');
    expect(step.title).toBe('Create the project');
    expect(step.whatIs).toBe(original.whatIs);
    expect(step.whyItMatters).toBe(original.whyItMatters);
  });

  it('Tema sem tradução', () => {
    expect(localizeTheme(crudTheme, undefined)).toBe(crudTheme);
    expect(getCatalog('en', {}).map((t) => t.title)).toEqual(getCatalog('pt-BR').map((t) => t.title));
  });

  it('Código não muda', () => {
    const original = cardById('step-01');
    const theme = localizeTheme(crudTheme, {
      cards: { 'step-01': { snippets: { express: { note: 'An English note.' } } } },
    });
    const step = cardById('step-01', theme);
    if (step.type !== 'step' || original.type !== 'step') throw new Error('esperava um card step');
    expect(step.snippets.express.code).toBe(original.snippets.express.code);
    expect(step.snippets.express.note).toBe('An English note.');
    expect(step.snippets.spring).toEqual(original.snippets.spring);
    expect(step.id).toBe(original.id);
    expect(step.number).toBe(original.number);
  });

  it('textos de tema e deck traduzidos; ids mantidos', () => {
    const deck = crudTheme.decks[0];
    const theme = localizeTheme(crudTheme, { title: 'Same CRUD', decks: { [deck.id]: { title: 'What we will build' } } });
    expect(theme.title).toBe('Same CRUD');
    expect(theme.description).toBe(crudTheme.description);
    expect(theme.decks[0]).toMatchObject({ id: deck.id, title: 'What we will build' });
    expect(theme.id).toBe(crudTheme.id);
  });

  it('getCatalog aplica a tradução registrada e memoriza por idioma', () => {
    const translations = { [crudTheme.id]: { en: { title: 'Same CRUD' } } };
    expect(getCatalog('en', translations).find((t) => t.id === crudTheme.id)?.title).toBe('Same CRUD');
    expect(getCatalog('pt-BR')).toBe(getCatalog('pt-BR'));
    expect(getCatalog('en')).toBe(getCatalog('en'));
  });
});

describe('Requirement: Busca do glossário no idioma exibido', () => {
  it('Buscar em inglês', () => {
    const theme = localizeTheme(crudTheme, {
      cards: { cors: { definition: 'A browser rule that blocks requests from other origins.' } },
    });
    const entries = getGlossary(theme).map((concept) => ({ themeId: theme.id, concept }));
    expect(searchTerms(entries, 'browser').map((e) => e.concept.term)).toEqual(['CORS']);
  });
});
