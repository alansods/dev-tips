/**
 * @jest-environment node
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { formatScanErrors, scanThemesDirectory } from '../node/scanThemes';
import { fullTheme, minimalTheme, type Json } from '../__fixtures__/themes';

let root: string;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'dev-tips-themes-'));
});
afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

function writeTheme(folder: string, content: Json | string) {
  fs.mkdirSync(path.join(root, folder), { recursive: true });
  const body = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  fs.writeFileSync(path.join(root, folder, 'theme.json'), body);
}

describe('Requirement: Conteúdo do repositório validado na suíte de testes', () => {
  it('theme.json inválido no repositório', () => {
    const theme = minimalTheme();
    theme.decks[0].cards[0].type = 'quiz';
    writeTheme('tema-minimo', theme);
    const result = scanThemesDirectory(root);
    expect(result.ok).toBe(false);
    const report = formatScanErrors(result.errors);
    expect(report).toContain(path.join('tema-minimo', 'theme.json'));
    expect(report).toContain('decks[0].cards[0].type');
  });

  it('Pasta e id divergentes', () => {
    const theme = minimalTheme();
    theme.id = 'fundamentos-web';
    writeTheme('web-basics', theme);
    const result = scanThemesDirectory(root);
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual([
      expect.objectContaining({ path: 'id', message: expect.stringMatching(/fundamentos-web.*web-basics|web-basics.*fundamentos-web/) }),
    ]);
  });

  it('reporta divergência de pasta junto com erros de estrutura', () => {
    const theme = minimalTheme();
    theme.id = 'fundamentos-web';
    theme.decks = [];
    writeTheme('web-basics', theme);
    const paths = scanThemesDirectory(root).errors.map((e) => e.path);
    expect(paths).toEqual(expect.arrayContaining(['decks', 'id']));
  });

  it('Catálogo vazio', () => {
    fs.writeFileSync(path.join(root, '.gitkeep'), '');
    expect(scanThemesDirectory(root)).toEqual({ ok: true, themes: [], translations: {}, errors: [] });
  });

  it('pasta inexistente conta como catálogo vazio', () => {
    expect(scanThemesDirectory(path.join(root, 'nao-existe')).ok).toBe(true);
  });

  it('aceita temas válidos e devolve-os em ordem alfabética de pasta', () => {
    const b = fullTheme();
    writeTheme('tema-minimo', minimalTheme());
    writeTheme('crud-teste', b);
    const result = scanThemesDirectory(root);
    expect(result.errors).toEqual([]);
    expect(result.themes.map((t) => t.id)).toEqual(['crud-teste', 'tema-minimo']);
  });

  it('JSON malformado vira erro, sem exceção', () => {
    writeTheme('quebrado', '{ "id": ');
    const result = scanThemesDirectory(root);
    expect(result.ok).toBe(false);
    expect(result.errors[0].message).toMatch(/JSON/);
  });

  it('pasta sem theme.json vira erro', () => {
    fs.mkdirSync(path.join(root, 'vazio'));
    const result = scanThemesDirectory(root);
    expect(result.ok).toBe(false);
    expect(result.errors[0].file).toBe(path.join('vazio', 'theme.json'));
  });
});

function writeTranslation(folder: string, file: string, content: Json | string) {
  fs.mkdirSync(path.join(root, folder, 'translations'), { recursive: true });
  const body = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  fs.writeFileSync(path.join(root, folder, 'translations', file), body);
}

describe('Requirement: Tradução de um tema', () => {
  it('Traduções do repositório validadas na suíte', () => {
    writeTheme('crud-teste', fullTheme());
    writeTranslation('crud-teste', 'en.json', { cards: { 'nao-existe': { title: 'x' } } });
    const result = scanThemesDirectory(root);
    expect(result.ok).toBe(false);
    const report = formatScanErrors(result.errors);
    expect(report).toContain(path.join('crud-teste', 'translations', 'en.json'));
    expect(report).toContain('cards.nao-existe');
  });

  it('tradução válida passa e é devolvida', () => {
    writeTheme('crud-teste', fullTheme());
    writeTranslation('crud-teste', 'en.json', { title: 'Test CRUD' });
    const result = scanThemesDirectory(root);
    expect(result.ok).toBe(true);
    expect(result.translations).toEqual({ 'crud-teste': { en: { title: 'Test CRUD' } } });
  });

  it('idioma não suportado ou JSON inválido', () => {
    writeTheme('crud-teste', fullTheme());
    writeTranslation('crud-teste', 'fr.json', { title: 'x' });
    writeTranslation('crud-teste', 'en.json', '{oops');
    const report = formatScanErrors(scanThemesDirectory(root).errors);
    expect(report).toContain(path.join('crud-teste', 'translations', 'fr.json'));
    expect(report).toContain('JSON inválido');
  });
});
