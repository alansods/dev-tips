/**
 * @jest-environment node
 */
import fs from 'node:fs';
import path from 'node:path';

import { LEVELS, validateCatalog, validateTaxonomy } from '../index';
import { formatScanErrors, scanTracksDirectory } from '../node/scanTracks';

// Gate de conteúdo: todo content/tracks/<track-id>/track.json do repositório
// precisa passar na validação para a suíte ficar verde.
const TRACKS_DIR = path.resolve(__dirname, '../../../content/tracks');
const TAXONOMY_FILE = path.resolve(__dirname, '../../../content/taxonomy.json');

describe('conteúdo do repositório (content/tracks)', () => {
  it('todas as trilhas são válidas', () => {
    const result = scanTracksDirectory(TRACKS_DIR);
    if (!result.ok) {
      throw new Error(`Conteúdo inválido em content/tracks:\n${formatScanErrors(result.errors)}`);
    }
  });

  it('Pré-requisitos do catálogo do repositório', () => {
    const inputs = fs
      .readdirSync(TRACKS_DIR)
      .filter((dir) => fs.existsSync(path.join(TRACKS_DIR, dir, 'track.json')))
      .map((dir) => JSON.parse(fs.readFileSync(path.join(TRACKS_DIR, dir, 'track.json'), 'utf8')));
    const result = validateCatalog(inputs);
    if (!result.ok) {
      throw new Error(`Catálogo inválido:\n${result.errors.map((e) => `${e.path}: ${e.message}`).join('\n')}`);
    }
  });

  it('Conteúdo do repositório com nível', () => {
    const result = scanTracksDirectory(TRACKS_DIR);
    const cards = result.tracks.flatMap((t) => t.decks.flatMap((d) => d.cards));
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) expect(LEVELS).toContain(card.level);
  });

  it('Cadastro do repositório', () => {
    const result = validateTaxonomy(JSON.parse(fs.readFileSync(TAXONOMY_FILE, 'utf8')));
    if (!result.ok) {
      throw new Error(`Cadastro inválido em content/taxonomy.json:\n${result.errors.map((e) => `${e.path}: ${e.message}`).join('\n')}`);
    }
  });
});
