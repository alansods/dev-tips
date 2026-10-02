import type { ConceptCard } from '../content';

export type GlossaryEntry = { themeId: string; concept: ConceptCard };

// Acentos separados pelo NFD (U+0300 a U+036F, "Combining Diacritical Marks").
const COMBINING_MARKS = new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, 'g');

/** Minúsculas e sem acentos, para comparar "Injeção" com "injecao". */
export function normalize(s: string): string {
  return s.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase();
}

/** Filtra por termo, definição e outros nomes; consulta vazia devolve tudo, na ordem original. */
export function searchTerms(entries: GlossaryEntry[], query: string): GlossaryEntry[] {
  const q = normalize(query.trim());
  if (!q) return entries;
  return entries.filter(({ concept }) =>
    [concept.term, concept.definition, ...(concept.aliases ?? [])].some((text) => normalize(text).includes(q)),
  );
}
