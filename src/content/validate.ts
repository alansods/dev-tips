import { pt } from 'zod/locales';

import { dedupe, formatPath, type ContentError } from './errors';
import { checkIntegrity } from './integrity';
import { repoTaxonomy } from './repoTaxonomy';
import { trackSchema, type Track } from './schema';
import { checkPlacement, type Taxonomy } from './taxonomy';

export type TrackResult = { ok: true; track: Track } | { ok: false; errors: ContentError[] };
export type CatalogResult = { ok: true; tracks: Track[] } | { ok: false; errors: ContentError[] };

const ptErrors = pt().localeError;

/**
 * Valida uma trilha em três passadas (estrutura com Zod, integridade e
 * referências ao cadastro, as duas sobre o input cru) e devolve todos os erros
 * juntos. Em caso de sucesso, devolve a trilha com os valores padrão aplicados.
 */
export function validateTrack(input: unknown, taxonomy: Taxonomy = repoTaxonomy): TrackResult {
  const parsed = trackSchema.safeParse(input, { error: ptErrors });
  const structural: ContentError[] = parsed.success
    ? []
    : parsed.error.issues.map((issue) => ({ path: formatPath(issue.path), message: issue.message }));
  const errors = dedupe([...structural, ...checkIntegrity(input), ...checkPlacement(input, taxonomy)]);

  if (parsed.success && errors.length === 0) return { ok: true, track: parsed.data };
  return { ok: false, errors };
}

/**
 * Valida uma lista de trilhas e a unicidade dos ids entre elas. Os erros de
 * cada trilha saem prefixados com o índice (`[1].decks[0].title`).
 */
export function validateCatalog(inputs: unknown[], taxonomy: Taxonomy = repoTaxonomy): CatalogResult {
  const errors: ContentError[] = [];
  const tracks: Track[] = [];
  const seen = new Set<string>();

  inputs.forEach((input, i) => {
    const result = validateTrack(input, taxonomy);
    if (result.ok) tracks.push(result.track);
    else errors.push(...result.errors.map((e) => ({ path: e.path ? `[${i}].${e.path}` : `[${i}]`, message: e.message })));

    const trackId = typeof input === 'object' && input !== null ? (input as { id?: unknown }).id : undefined;
    if (typeof trackId === 'string') {
      if (seen.has(trackId)) errors.push({ path: `[${i}].id`, message: `id de trilha duplicado no catálogo: ${trackId}` });
      seen.add(trackId);
    }
  });

  return errors.length === 0 ? { ok: true, tracks } : { ok: false, errors };
}
