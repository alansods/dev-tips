import { getTrack } from '../../content/catalog';
import { cardPayload } from '../cardText';

describe('cardPayload de um card interview', () => {
  it('envia a pergunta como título e os campos do card como texto', () => {
    const card = getTrack('sim-pedidos-duplicados')!.decks[0].cards.find((c) => c.id === 'timeout-no-provedor')!;
    const payload = cardPayload(card);
    expect(payload.type).toBe('interview');
    expect(payload.title).toMatch(/timeout/);
    expect(JSON.parse(payload.text)).toEqual(
      expect.objectContaining({ answer: expect.any(String), watchOut: expect.any(String) }),
    );
  });
});
