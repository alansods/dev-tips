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

  errors.push(...checkPrerequisites(inputs));
  return errors.length === 0 ? { ok: true, tracks } : { ok: false, errors };
}

/**
 * Pré-requisitos entre trilhas: cada id precisa existir no catálogo, a trilha
 * não pode depender de si mesma e não pode haver ciclo. Lê o input cru, para
 * funcionar mesmo quando outra parte da trilha é inválida.
 */
function checkPrerequisites(inputs: unknown[]): ContentError[] {
  const errors: ContentError[] = [];
  const ids = inputs.map((input) => {
    const id = typeof input === 'object' && input !== null ? (input as { id?: unknown }).id : undefined;
    return typeof id === 'string' ? id : undefined;
  });
  const index = new Map(ids.flatMap((id, i) => (id === undefined ? [] : [[id, i] as const])));
  const edges = inputs.map((input, i) => {
    const list = typeof input === 'object' && input !== null ? (input as { prerequisites?: unknown }).prerequisites : undefined;
    if (!Array.isArray(list)) return [];
    return list.flatMap((pre, j) => {
      if (typeof pre !== 'string') return [];
      if (pre === ids[i]) {
        errors.push({ path: `[${i}].prerequisites[${j}]`, message: 'a trilha não pode ser pré-requisito de si mesma' });
        return [];
      }
      if (!index.has(pre)) {
        errors.push({ path: `[${i}].prerequisites[${j}]`, message: `trilha inexistente no catálogo: ${pre}` });
        return [];
      }
      const target = inputs[index.get(pre)!] as { kind?: unknown };
      if (target.kind === 'simulation') {
        errors.push({ path: `[${i}].prerequisites[${j}]`, message: `uma simulação não pode ser pré-requisito: ${pre}` });
        return [];
      }
      return [index.get(pre)!];
    });
  });

  // Busca em profundidade: chegar de novo a uma trilha que está na pilha é um ciclo.
  const state = new Map<number, 'visiting' | 'done'>();
  const inCycle = new Set<number>();
  const stack: number[] = [];
  const visit = (i: number) => {
    state.set(i, 'visiting');
    stack.push(i);
    for (const next of edges[i]) {
      if (state.get(next) === 'visiting' && !inCycle.has(next)) {
        const cycle = stack.slice(stack.indexOf(next));
        cycle.forEach((n) => inCycle.add(n));
        const names = [...cycle, next].map((n) => ids[n]).join(' → ');
        errors.push({ path: `[${next}].prerequisites`, message: `ciclo de pré-requisitos: ${names}` });
      } else if (!state.has(next)) visit(next);
    }
    stack.pop();
    state.set(i, 'done');
  };
  inputs.forEach((_, i) => {
    if (!state.has(i)) visit(i);
  });
  return errors;
}
