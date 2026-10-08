// Comparação de textos sem acentos e sem diferenciar maiúsculas (buscas).

// Acentos separados pelo NFD (U+0300 a U+036F, "Combining Diacritical Marks").
const COMBINING_MARKS = new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, 'g');

/** Minúsculas e sem acentos, para comparar "Injeção" com "injecao". */
export function normalize(s: string): string {
  return s.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase();
}
