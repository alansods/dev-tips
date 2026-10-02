import { fullTheme } from '../__fixtures__/themes';
import { catalog } from '../catalog';
import { themeSchema, type Theme } from '../schema';
import { missingTranslations, themeTranslationSchema } from '../translation';
import { translationRegistry } from '../translations';

const theme = (): Theme => themeSchema.parse(fullTheme());

describe('missingTranslations', () => {
  it('lista os textos exibidos sem tradução', () => {
    const missing = missingTranslations(theme(), { title: 'T', cards: { cors: { term: 'CORS' } } });
    expect(missing).toContain('description');
    expect(missing).toContain('compareColumns.frontend');
    expect(missing).toContain('decks.endpoints.title');
    expect(missing).toContain('cards.ep-delete.description');
    expect(missing).toContain('cards.step-1.whatIs');
    expect(missing).toContain('cards.cors.definition');
    expect(missing).not.toContain('title');
    expect(missing).not.toContain('cards.cors.term');
    // fora da cobertura: tags, aliases, values e código
    expect(missing.some((p) => /tags|aliases|values|code|file/.test(p))).toBe(false);
  });

  it('só exige campos que existem no original', () => {
    const missing = missingTranslations(theme(), {});
    expect(missing).not.toContain('decks.endpoints.description'); // o deck não tem descrição
    expect(missing).not.toContain('cards.api.frontendAnalogy');
  });

  it('exige a nota do snippet quando o original tem nota', () => {
    const t = theme();
    const step = t.decks[1].cards[0];
    if (step.type !== 'step') throw new Error('esperava step');
    step.snippets.express.note = 'Uma nota.';
    expect(missingTranslations(t, {})).toContain('cards.step-1.snippets.express.note');
    expect(missingTranslations(t, {})).not.toContain('cards.step-1.snippets.spring.note');
  });
});

describe('Requirement: Tradução completa para inglês', () => {
  it.each(catalog.map((t) => [t.id, t] as const))('Cobertura completa: %s', (id, t) => {
    const raw = translationRegistry[id]?.en;
    expect(raw).toBeDefined();
    expect(missingTranslations(t, themeTranslationSchema.parse(raw))).toEqual([]);
  });
});
