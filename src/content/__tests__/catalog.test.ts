/**
 * @jest-environment node
 */
import fs from 'node:fs';
import path from 'node:path';

import { catalog, compareRegistry, getTheme } from '../catalog';

const THEMES_DIR = path.resolve(__dirname, '../../../content/themes');
const themeFolders = () =>
  fs
    .readdirSync(THEMES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

describe('Requirement: Catálogo de temas no app', () => {
  it('Tema registrado', () => {
    const theme = getTheme('crud-4-frameworks');
    expect(theme).toBeDefined();
    expect(theme?.decks).toHaveLength(4);
    expect(catalog.map((t) => t.id)).toContain('crud-4-frameworks');
  });

  it('Pasta sem registro', () => {
    expect(compareRegistry(['crud-4-frameworks', 'fundamentos-web'], ['crud-4-frameworks'])).toEqual({
      unregistered: ['fundamentos-web'],
      missing: [],
    });
    expect(compareRegistry(['crud-4-frameworks'], ['crud-4-frameworks', 'fantasma'])).toEqual({
      unregistered: [],
      missing: ['fantasma'],
    });
  });

  it('todas as pastas de content/themes estão registradas, e vice-versa', () => {
    const { unregistered, missing } = compareRegistry(
      themeFolders(),
      catalog.map((t) => t.id),
    );
    if (unregistered.length || missing.length) {
      throw new Error(
        `Catálogo desatualizado.\n  Pastas sem registro em src/content/catalog.ts: ${unregistered.join(', ') || '—'}\n  Registrados sem pasta: ${missing.join(', ') || '—'}`,
      );
    }
  });

  it('Padrões aplicados', () => {
    const raw = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, 'crud-4-frameworks/theme.json'), 'utf8'));
    const rawEndpoint = raw.decks[0].cards[0];
    expect(rawEndpoint.tags).toBeUndefined();
    expect(rawEndpoint.origin).toBeUndefined();

    const endpoint = getTheme('crud-4-frameworks')!.decks[0].cards[0];
    expect(endpoint.tags).toEqual([]);
    expect(endpoint.origin).toBe('original');
  });

  it('getTheme devolve undefined para id desconhecido', () => {
    expect(getTheme('nao-existe')).toBeUndefined();
  });
});
