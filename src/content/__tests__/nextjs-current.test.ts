/**
 * @jest-environment node
 */
import { getCatalog, getTrack } from '../catalog';

const nextjs = () => {
  const track = getTrack('nextjs');
  if (!track) throw new Error('trilha nextjs não registrada');
  return track;
};
const card = (id: string) => nextjs().decks.flatMap((d) => d.cards).find((c) => c.id === id);

describe('Requirement: Trilha Next.js na versão atual', () => {
  it('Proxy no lugar de Middleware', () => {
    const proxy = card('proxy');
    expect(proxy?.type).toBe('concept');
    if (proxy?.type !== 'concept') return;
    expect(proxy.term).toBe('Proxy (antigo Middleware)');
    expect(proxy.definition).toContain('proxy.ts');
  });

  it('Cache Components no card de cache', () => {
    const cache = card('cache-e-revalidacao');
    expect(cache?.type).toBe('code');
    if (cache?.type !== 'code') return;
    expect(cache.snippet.code).toMatch(/["']use cache["']/);
    for (const api of ['cacheLife', 'cacheTag']) expect(cache.snippet.code).toContain(api);
    expect(cache.body).toContain('cacheComponents');
  });

  it('Ids antigos removidos', () => {
    const ids = nextjs().decks.flatMap((d) => d.cards.map((c) => c.id));
    expect(ids).toHaveLength(24);
    expect(ids).not.toContain('middleware-next');
    expect(ids).not.toContain('revalidate');
  });

  it('Proxy em inglês', () => {
    const en = getCatalog('en').find((t) => t.id === 'nextjs');
    const proxy = en?.decks.flatMap((d) => d.cards).find((c) => c.id === 'proxy');
    expect(proxy?.type === 'concept' && proxy.term).toBe('Proxy (formerly Middleware)');
  });
});
