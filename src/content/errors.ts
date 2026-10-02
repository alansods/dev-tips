export type ContentError = { path: string; message: string };
export type PathSegment = string | number;

/** `['decks', 1, 'cards', 3, 'snippets', 'fastapi']` → `decks[1].cards[3].snippets.fastapi` */
export function formatPath(path: readonly PropertyKey[]): string {
  return path.reduce<string>((acc, seg) => {
    if (typeof seg === 'number') return `${acc}[${seg}]`;
    const key = String(seg);
    return acc ? `${acc}.${key}` : key;
  }, '');
}

/** Remove erros repetidos (mesmo path e mensagem), mantendo a ordem. */
export function dedupe(errors: ContentError[]): ContentError[] {
  const seen = new Set<string>();
  return errors.filter((e) => {
    const key = `${e.path}\u0000${e.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
