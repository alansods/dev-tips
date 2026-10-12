/**
 * @jest-environment node
 */
import { describeContentTracks, framework } from '../__fixtures__/languageTracks';
import { getTrack } from '../catalog';

describeContentTracks({
  group: 'Next.js no backend',
  after: 'modulos-nativos-no-expo',
  snippetLanguages: ['ts', 'bash'],
  tracks: [
    {
      id: 'nextjs-no-backend',
      title: 'Next.js no backend',
      areas: ['backend'],
      placement: framework('javascript', 'nextjs'),
      decks: ['route-handlers', 'server-actions', 'auth-e-dados'],
    },
  ],
});

const snippets = () =>
  (getTrack('nextjs-no-backend')?.decks ?? [])
    .flatMap((d) => d.cards)
    .flatMap((c) => (c.type === 'code' || c.type === 'question') && c.snippet ? [c.snippet] : []);

describe('Requirement: Trilha Next.js no backend no catálogo', () => {
  it('pré-requisito e data de inclusão', () => {
    const track = getTrack('nextjs-no-backend');
    expect(track?.prerequisites).toEqual(['nextjs']);
    expect(track?.addedAt).toBe('2026-10-12');
  });
});

describe('Requirement: Next.js no backend na versão atual', () => {
  it('params assíncrono', () => {
    const withParams = snippets().filter((s) => /\{ params \}|\bparams\b.*Promise/.test(s.code));
    expect(withParams.length).toBeGreaterThan(0);
    for (const s of withParams) expect(s.code).toContain('await params');
  });

  it('Sem middleware.ts', () => {
    expect(snippets().filter((s) => s.file === 'middleware.ts')).toEqual([]);
    expect(snippets().some((s) => s.file.endsWith('proxy.ts'))).toBe(true);
  });

  it('revalidateTag com perfil', () => {
    const calls = snippets().flatMap((s) => s.code.match(/revalidateTag\(([^)]*)\)/g) ?? []);
    expect(calls.length).toBeGreaterThan(0);
    for (const call of calls) expect(call).toMatch(/revalidateTag\([^,]+,[^)]+\)/);
  });
});
