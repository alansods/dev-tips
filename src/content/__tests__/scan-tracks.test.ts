/**
 * @jest-environment node
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { formatScanErrors, scanTracksDirectory } from '../node/scanTracks';
import { fullTrack, minimalTrack, type Json } from '../__fixtures__/tracks';

let root: string;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'dev-tips-tracks-'));
});
afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

function writeTrack(folder: string, content: Json | string) {
  fs.mkdirSync(path.join(root, folder), { recursive: true });
  const body = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  fs.writeFileSync(path.join(root, folder, 'track.json'), body);
}

describe('Requirement: Conteúdo do repositório validado na suíte de testes', () => {
  it('track.json inválido no repositório', () => {
    const track = minimalTrack();
    track.decks[0].cards[0].type = 'quiz';
    writeTrack('trilha-minimo', track);
    const result = scanTracksDirectory(root);
    expect(result.ok).toBe(false);
    const report = formatScanErrors(result.errors);
    expect(report).toContain(path.join('trilha-minimo', 'track.json'));
    expect(report).toContain('decks[0].cards[0].type');
  });

  it('Pasta e id divergentes', () => {
    const track = minimalTrack();
    track.id = 'fundamentos-web';
    writeTrack('web-basics', track);
    const result = scanTracksDirectory(root);
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([
      expect.objectContaining({ path: 'id', message: expect.stringMatching(/fundamentos-web.*web-basics|web-basics.*fundamentos-web/) }),
    ]);
  });

  it('reporta divergência de pasta junto com erros de estrutura', () => {
    const track = minimalTrack();
    track.id = 'fundamentos-web';
    track.decks = [];
    writeTrack('web-basics', track);
    const paths = scanTracksDirectory(root).errors.map((e) => e.path);
    expect(paths).toEqual(expect.arrayContaining(['decks', 'id']));
  });

  it('Catálogo vazio', () => {
    fs.writeFileSync(path.join(root, '.gitkeep'), '');
    expect(scanTracksDirectory(root)).toEqual({ ok: true, tracks: [], translations: {}, errors: [] });
  });

  it('pasta inexistente conta como catálogo vazio', () => {
    expect(scanTracksDirectory(path.join(root, 'nao-existe')).ok).toBe(true);
  });

  it('aceita trilhas válidas e devolve-os em ordem alfabética de pasta', () => {
    const b = fullTrack();
    writeTrack('trilha-minimo', minimalTrack());
    writeTrack('crud-teste', b);
    const result = scanTracksDirectory(root);
    expect(result.errors).toEqual([]);
    expect(result.tracks.map((t) => t.id)).toEqual(['crud-teste', 'trilha-minimo']);
  });

  it('JSON malformado vira erro, sem exceção', () => {
    writeTrack('quebrado', '{ "id": ');
    const result = scanTracksDirectory(root);
    expect(result.ok).toBe(false);
    expect(result.errors[0].message).toMatch(/JSON/);
  });

  it('pasta sem track.json vira erro', () => {
    fs.mkdirSync(path.join(root, 'vazio'));
    const result = scanTracksDirectory(root);
    expect(result.ok).toBe(false);
    expect(result.errors[0].file).toBe(path.join('vazio', 'track.json'));
  });
});

function writeTranslation(folder: string, file: string, content: Json | string) {
  fs.mkdirSync(path.join(root, folder, 'translations'), { recursive: true });
  const body = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  fs.writeFileSync(path.join(root, folder, 'translations', file), body);
}

describe('Requirement: Tradução de uma trilha', () => {
  it('Traduções do repositório validadas na suíte', () => {
    writeTrack('crud-teste', fullTrack());
    writeTranslation('crud-teste', 'en.json', { cards: { 'nao-existe': { title: 'x' } } });
    const result = scanTracksDirectory(root);
    expect(result.ok).toBe(false);
    const report = formatScanErrors(result.errors);
    expect(report).toContain(path.join('crud-teste', 'translations', 'en.json'));
    expect(report).toContain('cards.nao-existe');
  });

  it('tradução válida passa e é devolvida', () => {
    writeTrack('crud-teste', fullTrack());
    writeTranslation('crud-teste', 'en.json', { title: 'Test CRUD' });
    const result = scanTracksDirectory(root);
    expect(result.ok).toBe(true);
    expect(result.translations).toEqual({ 'crud-teste': { en: { title: 'Test CRUD' } } });
  });

  it('idioma não suportado ou JSON inválido', () => {
    writeTrack('crud-teste', fullTrack());
    writeTranslation('crud-teste', 'fr.json', { title: 'x' });
    writeTranslation('crud-teste', 'en.json', '{oops');
    const report = formatScanErrors(scanTracksDirectory(root).errors);
    expect(report).toContain(path.join('crud-teste', 'translations', 'fr.json'));
    expect(report).toContain('JSON inválido');
  });
});
