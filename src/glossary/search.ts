import type { ConceptCard } from '../content';
import { normalize } from '../content/text';

export { normalize };

export type GlossaryEntry = { trackId: string; concept: ConceptCard };

/** Filtra por termo, definição e outros nomes; consulta vazia devolve tudo, na ordem original. */
export function searchTerms(entries: GlossaryEntry[], query: string): GlossaryEntry[] {
  const q = normalize(query.trim());
  if (!q) return entries;
  return entries.filter(({ concept }) =>
    [concept.term, concept.definition, ...(concept.aliases ?? [])].some((text) => normalize(text).includes(q)),
  );
}
