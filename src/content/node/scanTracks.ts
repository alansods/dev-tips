// Varredura de content/tracks/ para a suíte de testes. Usa `fs`, então só
// roda em Node (testes e scripts) — nunca importe isto no app.

import fs from 'node:fs';
import path from 'node:path';

import type { Track } from '../schema';
import { validateTranslation, type TrackTranslation } from '../translation';
import { validateTrack } from '../validate';

export type ScanError = { file: string; path: string; message: string };
export type ScanResult = {
  ok: boolean;
  tracks: Track[];
  /** Traduções válidas por trilha e idioma (`{ 'crud-4-frameworks': { en: {...} } }`). */
  translations: Record<string, Record<string, TrackTranslation>>;
  errors: ScanError[];
};

/** Idiomas aceitos em `translations/` (o original do conteúdo é PT-BR). */
export const TRANSLATION_LANGUAGES = ['en'];

/**
 * Valida cada `<dir>/<track-id>/track.json`: estrutura, integridade e id igual
 * ao nome da pasta. Arquivos soltos (ex.: `.gitkeep`) são ignorados.
 */
export function scanTracksDirectory(dir: string): ScanResult {
  const tracks: Track[] = [];
  const translations: ScanResult['translations'] = {};
  const errors: ScanError[] = [];
  if (!fs.existsSync(dir)) return { ok: true, tracks, translations, errors };

  const folders = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const folder of folders) {
    const file = path.join(folder, 'track.json');
    const fullPath = path.join(dir, file);

    if (!fs.existsSync(fullPath)) {
      errors.push({ file, path: '', message: 'a pasta da trilha não tem track.json' });
      continue;
    }

    let input: unknown;
    try {
      input = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (e) {
      errors.push({ file, path: '', message: `JSON inválido: ${(e as Error).message}` });
      continue;
    }

    const result = validateTrack(input);
    if (!result.ok) errors.push(...result.errors.map((err) => ({ file, ...err })));

    const trackId = typeof input === 'object' && input !== null ? (input as { id?: unknown }).id : undefined;
    const idMatches = trackId === folder;
    if (typeof trackId === 'string' && !idMatches) {
      errors.push({ file, path: 'id', message: `o id da trilha (${trackId}) deve ser igual ao nome da pasta (${folder})` });
    }

    if (result.ok && idMatches) {
      tracks.push(result.track);
      const found = scanTranslations(dir, folder, result.track, errors);
      if (Object.keys(found).length > 0) translations[folder] = found;
    }
  }

  return { ok: errors.length === 0, tracks, translations, errors };
}

/** Valida cada `<track-id>/translations/<idioma>.json` contra a trilha já validada. */
function scanTranslations(dir: string, folder: string, track: Track, errors: ScanError[]): Record<string, TrackTranslation> {
  const found: Record<string, TrackTranslation> = {};
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
    const problems = validateTranslation(track, input);
    if (problems.length > 0) errors.push(...problems.map((err) => ({ file, ...err })));
    else found[language] = input as TrackTranslation;
  }
  return found;
}

/** Relatório legível: uma linha por erro, `arquivo → path: mensagem`. */
export function formatScanErrors(errors: ScanError[]): string {
  return errors.map((e) => `${e.file} → ${e.path || '(raiz)'}: ${e.message}`).join('\n');
}
