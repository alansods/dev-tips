// Varredura de content/themes/ para a suíte de testes. Usa `fs`, então só
// roda em Node (testes e scripts) — nunca importe isto no app.

import fs from 'node:fs';
import path from 'node:path';

import type { Theme } from '../schema';
import { validateTheme } from '../validate';

export type ScanError = { file: string; path: string; message: string };
export type ScanResult = { ok: boolean; themes: Theme[]; errors: ScanError[] };

/**
 * Valida cada `<dir>/<theme-id>/theme.json`: estrutura, integridade e id igual
 * ao nome da pasta. Arquivos soltos (ex.: `.gitkeep`) são ignorados.
 */
export function scanThemesDirectory(dir: string): ScanResult {
  const themes: Theme[] = [];
  const errors: ScanError[] = [];
  if (!fs.existsSync(dir)) return { ok: true, themes, errors };

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

    if (result.ok && idMatches) themes.push(result.theme);
  }

  return { ok: errors.length === 0, themes, errors };
}

/** Relatório legível: uma linha por erro, `arquivo → path: mensagem`. */
export function formatScanErrors(errors: ScanError[]): string {
  return errors.map((e) => `${e.file} → ${e.path || '(raiz)'}: ${e.message}`).join('\n');
}
