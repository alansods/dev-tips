/**
 * @jest-environment node
 */
import fs from 'node:fs';
import path from 'node:path';

import { catalog, compareRegistry, getTrack } from '../catalog';

const TRACKS_DIR = path.resolve(__dirname, '../../../content/tracks');
const trackFolders = () =>
  fs
    .readdirSync(TRACKS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

describe('Requirement: Catálogo de trilhas no app', () => {
  it('Trilha registrada', () => {
    const track = getTrack('crud-4-frameworks');
    expect(track).toBeDefined();
    const raw = JSON.parse(fs.readFileSync(path.join(TRACKS_DIR, 'crud-4-frameworks/track.json'), 'utf8'));
    expect(track?.decks.map((d) => d.id)).toEqual(raw.decks.map((d: { id: string }) => d.id));
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

  it('todas as pastas de content/tracks estão registradas, e vice-versa', () => {
    const { unregistered, missing } = compareRegistry(
      trackFolders(),
      catalog.map((t) => t.id),
    );
    if (unregistered.length || missing.length) {
      throw new Error(
        `Catálogo desatualizado.\n  Pastas sem registro em src/content/catalog.ts: ${unregistered.join(', ') || '—'}\n  Registrados sem pasta: ${missing.join(', ') || '—'}`,
      );
    }
  });

  it('Padrões aplicados', () => {
    const raw = JSON.parse(fs.readFileSync(path.join(TRACKS_DIR, 'crud-4-frameworks/track.json'), 'utf8'));
    const rawEndpoint = raw.decks[0].cards[0];
    expect(rawEndpoint.tags).toBeUndefined();
    expect(rawEndpoint.origin).toBeUndefined();

    const endpoint = getTrack('crud-4-frameworks')!.decks[0].cards[0];
    expect(endpoint.tags).toEqual([]);
    expect(endpoint.origin).toBe('original');
  });

  it('getTrack devolve undefined para id desconhecido', () => {
    expect(getTrack('nao-existe')).toBeUndefined();
  });
});

describe('Requirement: Tradução de uma trilha', () => {
  it('todo translations/<idioma>.json do repositório está registrado, e vice-versa', () => {
    const { translationRegistry } = jest.requireActual('../translations') as typeof import('../translations');
    const onDisk = trackFolders().flatMap((folder) => {
      const dir = path.join(TRACKS_DIR, folder, 'translations');
      return fs.existsSync(dir) ? fs.readdirSync(dir).map((f) => `${folder}/${f.replace(/\.json$/, '')}`) : [];
    });
    const registered = Object.entries(translationRegistry).flatMap(([id, langs]) =>
      Object.keys(langs).map((lang) => `${id}/${lang}`),
    );
    expect(registered.sort()).toEqual(onDisk.sort());
  });
});
