import { pt } from 'zod/locales';

import { dedupe, formatPath, type ContentError } from './errors';
import { checkIntegrity } from './integrity';
import { themeSchema, type Theme } from './schema';

export type ThemeResult = { ok: true; theme: Theme } | { ok: false; errors: ContentError[] };
export type CatalogResult = { ok: true; themes: Theme[] } | { ok: false; errors: ContentError[] };

const ptErrors = pt().localeError;

/**
 * Valida um tema em duas passadas (estrutura com Zod + integridade sobre o
 * input cru) e devolve todos os erros juntos. Em caso de sucesso, devolve o
 * tema com os valores padrão aplicados.
 */
export function validateTheme(input: unknown): ThemeResult {
  const parsed = themeSchema.safeParse(input, { error: ptErrors });
  const structural: ContentError[] = parsed.success
    ? []
    : parsed.error.issues.map((issue) => ({ path: formatPath(issue.path), message: issue.message }));
  const errors = dedupe([...structural, ...checkIntegrity(input)]);

  if (parsed.success && errors.length === 0) return { ok: true, theme: parsed.data };
  return { ok: false, errors };
}

/**
 * Valida uma lista de temas e a unicidade dos ids entre eles. Os erros de
 * cada tema saem prefixados com o índice (`[1].decks[0].title`).
 */
export function validateCatalog(inputs: unknown[]): CatalogResult {
  const errors: ContentError[] = [];
  const themes: Theme[] = [];
  const seen = new Set<string>();

  inputs.forEach((input, i) => {
    const result = validateTheme(input);
    if (result.ok) themes.push(result.theme);
    else errors.push(...result.errors.map((e) => ({ path: e.path ? `[${i}].${e.path}` : `[${i}]`, message: e.message })));

    const themeId = typeof input === 'object' && input !== null ? (input as { id?: unknown }).id : undefined;
    if (typeof themeId === 'string') {
      if (seen.has(themeId)) errors.push({ path: `[${i}].id`, message: `id de tema duplicado no catálogo: ${themeId}` });
      seen.add(themeId);
    }
  });

  return errors.length === 0 ? { ok: true, themes } : { ok: false, errors };
}
