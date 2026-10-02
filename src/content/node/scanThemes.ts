// Varredura de content/themes/ para a suíte de testes. Usa `fs`, então só
// roda em Node (testes e scripts) — nunca importe isto no app.

import fs from 'node:fs';
import path from 'node:path';

import type { Theme } from '../schema';
import { validateTranslation, type ThemeTranslation } from '../translation';
import { validateTheme } from '../validate';

export type ScanError = { file: string; path: string; message: string };
export type ScanResult = {
  ok: boolean;
  themes: Theme[];
  /** Traduções válidas por tema e idioma (`{ 'crud-4-frameworks': { en: {...} } }`). */
  translations: Record<string, Record<string, ThemeTranslation>>;
  errors: ScanError[];
};

/** Idiomas aceitos em `translations/` (o original do conteúdo é PT-BR). */
export const TRANSLATION_LANGUAGES = ['en'];

/**
 * Valida cada `<dir>/<theme-id>/theme.json`: estrutura, integridade e id igual
 * ao nome da pasta. Arquivos soltos (ex.: `.gitkeep`) são ignorados.
 */
export function scanThemesDirectory(dir: string): ScanResult {
  const themes: Theme[] = [];
  const translations: ScanResult['translations'] = {};
  const errors: ScanError[] = [];
  if (!fs.existsSync(dir)) return { ok: true, themes, translations, errors };

  const folders = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const folder of folders) {
    const file = path.join(folder, 'theme.json');
    const fullPath = path.join(dir, file);

    if (!fs.existsSync(fullPath)) {
      errors.push({ file, path: '', message: 'a pasta do tema não tem theme.json' });
      continue;
    }

    let input: unknown;
    try {
      input = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (e) {
      errors.push({ file, path: '', message: `JSON inválido: ${(e as Error).message}` });
      continue;
    }

    const result = validateTheme(input);
    if (!result.ok) errors.push(...result.errors.map((err) => ({ file, ...err })));

    const themeId = typeof input === 'object' && input !== null ? (input as { id?: unknown }).id : undefined;
    const idMatches = themeId === folder;
    if (typeof themeId === 'string' && !idMatches) {
      errors.push({ file, path: 'id', message: `o id do tema (${themeId}) deve ser igual ao nome da pasta (${folder})` });
    }

    if (result.ok && idMatches) {
      themes.push(result.theme);
      const found = scanTranslations(dir, folder, result.theme, errors);
      if (Object.keys(found).length > 0) translations[folder] = found;
    }
  }

  return { ok: errors.length === 0, themes, translations, errors };
}

/** Valida cada `<theme-id>/translations/<idioma>.json` contra o tema já validado. */
function scanTranslations(dir: string, folder: string, theme: Theme, errors: ScanError[]): Record<string, ThemeTranslation> {
  const found: Record<string, ThemeTranslation> = {};
  const translationsDir = path.join(dir, folder, 'translations');
  if (!fs.existsSync(translationsDir)) return found;

  for (const name of fs.readdirSync(translationsDir).sort()) {
    const file = path.join(folder, 'translations', name);
    const language = name.replace(/\.json$/, '');
    if (!name.endsWith('.json') || !TRANSLATION_LANGUAGES.includes(language)) {
      errors.push({ file, path: '', message: `idioma de tradução não suportado; use: ${TRANSLATION_LANGUAGES.join(', ')}` });
      continue;
    }
    let input: unknown;
    try {
      input = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    } catch (e) {
      errors.push({ file, path: '', message: `JSON inválido: ${(e as Error).message}` });
      continue;
    }
    const problems = validateTranslation(theme, input);
    if (problems.length > 0) errors.push(...problems.map((err) => ({ file, ...err })));
    else found[language] = input as ThemeTranslation;
  }
  return found;
}

/** Relatório legível: uma linha por erro, `arquivo → path: mensagem`. */
export function formatScanErrors(errors: ScanError[]): string {
  return errors.map((e) => `${e.file} → ${e.path || '(raiz)'}: ${e.message}`).join('\n');
}
