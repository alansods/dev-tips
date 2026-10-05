// Cadastro de linguagens e frameworks (content/taxonomy.json) e a posição de
// cada trilha na navegação. A posição sai só dos campos da trilha: `variants`
// a torna comparativa; senão, `framework` e `language` dizem onde ela fica.

import { z } from 'zod';
import { pt } from 'zod/locales';

import { dedupe, formatPath, type ContentError, type PathSegment } from './errors';
import type { Track } from './schema';

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const id = () => z.string().regex(KEBAB, { error: 'deve estar em kebab-case (a-z, 0-9 e -)' });
const name = () => z.string().refine((s) => s.trim().length > 0, { error: 'não pode ficar vazio' });

export const taxonomySchema = z.object({
  languages: z.array(z.object({ id: id(), name: name() })),
  frameworks: z.array(z.object({ id: id(), name: name(), language: id() })),
});

export type Taxonomy = z.output<typeof taxonomySchema>;
export type Language = Taxonomy['languages'][number];
export type Framework = Taxonomy['frameworks'][number];

export type TaxonomyResult = { ok: true; taxonomy: Taxonomy } | { ok: false; errors: ContentError[] };

/** Valida o cadastro: estrutura, ids únicos por lista e linguagem de cada framework. */
export function validateTaxonomy(input: unknown): TaxonomyResult {
  const parsed = taxonomySchema.safeParse(input, { error: pt().localeError });
  if (!parsed.success) {
    return { ok: false, errors: dedupe(parsed.error.issues.map((i) => ({ path: formatPath(i.path), message: i.message }))) };
  }
  const { languages, frameworks } = parsed.data;
  const errors: ContentError[] = [];
  const push = (path: PathSegment[], message: string) => errors.push({ path: formatPath(path), message });

  const uniqueIds = (items: { id: string }[], key: string, label: string) => {
    const seen = new Set<string>();
    items.forEach((item, i) => {
      if (seen.has(item.id)) push([key, i, 'id'], `id de ${label} repetido: ${item.id}`);
      seen.add(item.id);
    });
  };
  uniqueIds(languages, 'languages', 'linguagem');
  uniqueIds(frameworks, 'frameworks', 'framework');

  const languageIds = new Set(languages.map((l) => l.id));
  frameworks.forEach((f, i) => {
    if (!languageIds.has(f.language)) push(['frameworks', i, 'language'], `linguagem inexistente no cadastro: ${f.language}`);
  });

  return errors.length === 0 ? { ok: true, taxonomy: parsed.data } : { ok: false, errors };
}

/** Confere `language` e `framework` da trilha (input cru) contra o cadastro. */
export function checkPlacement(input: unknown, taxonomy: Taxonomy): ContentError[] {
  if (typeof input !== 'object' || input === null) return [];
  const { language, framework } = input as { language?: unknown; framework?: unknown };
  const errors: ContentError[] = [];

  if (typeof language === 'string' && !taxonomy.languages.some((l) => l.id === language)) {
    errors.push({ path: 'language', message: `linguagem inexistente no cadastro: ${language}` });
  }
  if (typeof framework === 'string') {
    const found = taxonomy.frameworks.find((f) => f.id === framework);
    if (!found) errors.push({ path: 'framework', message: `framework inexistente no cadastro: ${framework}` });
    else if (typeof language === 'string' && found.language !== language) {
      errors.push({ path: 'framework', message: `o framework ${framework} é de ${found.language}, não de ${language}` });
    }
  }
  return errors;
}

export type Placement =
  | { kind: 'comparison' }
  | { kind: 'framework'; language: string; framework: string }
  | { kind: 'language'; language: string }
  | { kind: 'direct' };

/** Onde a trilha aparece dentro de cada uma das suas áreas. */
export function placementOf(track: Track): Placement {
  if (track.variants !== undefined) return { kind: 'comparison' };
  if (track.language !== undefined && track.framework !== undefined) {
    return { kind: 'framework', language: track.language, framework: track.framework };
  }
  if (track.language !== undefined) return { kind: 'language', language: track.language };
  return { kind: 'direct' };
}
