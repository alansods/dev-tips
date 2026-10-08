import { minimalTrack } from '../__fixtures__/tracks';
import { expectErrorAt, trackOf } from '../__fixtures__/expect';

describe('Requirement: Data de inclusão da trilha', () => {
  it('Data válida', () => {
    expect(trackOf({ ...minimalTrack(), addedAt: '2026-10-06' }).addedAt).toBe('2026-10-06');
  });

  it('Data inválida', () => {
    expectErrorAt({ ...minimalTrack(), addedAt: '06/10/2026' }, 'addedAt');
  });

  it('data inexistente', () => {
    expectErrorAt({ ...minimalTrack(), addedAt: '2026-02-30' }, 'addedAt');
  });

  it('sem data', () => {
    expect(trackOf(minimalTrack()).addedAt).toBeUndefined();
  });
});
