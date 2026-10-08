import { validateCatalog } from '../index';
import { minimalTrack, type Json } from '../__fixtures__/tracks';
import { trackOf } from '../__fixtures__/expect';

const track = (id: string, prerequisites?: string[]): Json => ({
  ...minimalTrack(),
  id,
  ...(prerequisites ? { prerequisites } : {}),
});

function errors(inputs: Json[]) {
  const result = validateCatalog(inputs);
  if (result.ok) throw new Error('esperava que a validação rejeitasse o catálogo');
  return result.errors;
}

describe('Requirement: Pré-requisitos da trilha', () => {
  it('Pré-requisito válido', () => {
    const result = validateCatalog([track('react'), track('nextjs', ['react'])]);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.tracks[1].prerequisites).toEqual(['react']);
  });

  it('Pré-requisito inexistente', () => {
    expect(errors([track('react'), track('nextjs', ['kotlin'])])).toEqual([
      expect.objectContaining({ path: '[1].prerequisites[0]', message: expect.stringContaining('kotlin') }),
    ]);
  });

  it('Trilha depende de si mesma', () => {
    expect(errors([track('react', ['react'])]).map((e) => e.path)).toEqual(['[0].prerequisites[0]']);
  });

  it('Ciclo', () => {
    const result = errors([track('a', ['b']), track('b', ['a'])]);
    expect(result).toEqual([expect.objectContaining({ path: '[0].prerequisites', message: expect.stringContaining('a → b → a') })]);
  });

  it('ciclo maior também é detectado', () => {
    const result = errors([track('a', ['c']), track('b', ['a']), track('c', ['b'])]);
    expect(result.map((e) => e.message).join()).toMatch(/ciclo de pré-requisitos/);
  });

  it('Sem pré-requisitos', () => {
    expect(trackOf(minimalTrack()).prerequisites).toEqual([]);
  });

  it('id fora do padrão é rejeitado na própria trilha', () => {
    expect(errors([track('a', ['Não Kebab'])]).map((e) => e.path)).toContain('[0].prerequisites[0]');
  });
});
