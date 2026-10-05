import { getGlossary } from '../index';
import { conceptCard, fullTrack, minimalTrack } from '../__fixtures__/tracks';
import { errorsOf, expectErrorAt, trackOf } from '../__fixtures__/expect';

describe('Requirement: Unicidade de ids', () => {
  it('Card repetido em decks diferentes', () => {
    const input = minimalTrack();
    input.decks[0].cards = [conceptCard('cors', 'CORS')];
    input.decks.push({ id: 'deck-2', title: 'Deck 2', cards: [conceptCard('cors', 'CORS 2')] });
    expectErrorAt(input, 'decks[1].cards[0].id', 'cors');
  });

  it('deck repetido na trilha', () => {
    const input = minimalTrack();
    input.decks.push({ id: 'deck-1', title: 'Outro', cards: [conceptCard('dto', 'DTO')] });
    expectErrorAt(input, 'decks[1].id', 'deck-1');
  });
});

describe('Requirement: Card concept e glossário', () => {
  it('Glossário derivado dos concepts', () => {
    const input = fullTrack(); // concepts: api e cors no deck de glossário
    input.decks[0].cards.push(conceptCard('dto', 'DTO'));
    const glossary = getGlossary(trackOf(input));
    expect(glossary.map((c) => c.term).sort()).toEqual(['API', 'CORS', 'DTO']);
  });

  it('Termo duplicado com caixa diferente', () => {
    const input = minimalTrack();
    input.decks[0].cards = [conceptCard('cors', 'CORS'), conceptCard('cors-2', 'cors')];
    expectErrorAt(input, 'decks[0].cards[1].term', 'cors');
  });

  it('aceita frontendAnalogy e aliases', () => {
    const input = minimalTrack();
    input.decks[0].cards[0] = conceptCard('endpoint', 'Endpoint', { aliases: ['rota'], frontendAnalogy: 'A URL que o fetch chama.' });
    const card = trackOf(input).decks[0].cards[0];
    expect(card).toMatchObject({ aliases: ['rota'], frontendAnalogy: 'A URL que o fetch chama.' });
  });
});

describe('Requirement: Termos relacionados', () => {
  it('Termo relacionado inexistente', () => {
    const input = fullTrack();
    input.decks[1].cards[0].relatedTerms = ['pool-de-conexoes'];
    expectErrorAt(input, 'decks[1].cards[0].relatedTerms[0]', 'pool-de-conexoes');
  });

  it('Termo relacionado que não é concept', () => {
    const input = fullTrack();
    input.decks[3].cards[0].relatedTerms = ['step-1'];
    expectErrorAt(input, 'decks[3].cards[0].relatedTerms[0]', 'concept');
  });

  it('Concept referenciando a si mesmo', () => {
    const input = fullTrack();
    input.decks[3].cards[1].relatedTerms = ['cors'];
    expectErrorAt(input, 'decks[3].cards[1].relatedTerms[0]');
  });

  it('termo relacionado repetido', () => {
    const input = fullTrack();
    input.decks[1].cards[0].relatedTerms = ['api', 'api'];
    expectErrorAt(input, 'decks[1].cards[0].relatedTerms[1]', 'api');
  });

  it('referência válida é aceita', () => {
    const track = trackOf(fullTrack());
    expect(track.decks[1].cards[0].relatedTerms).toEqual(['api']);
  });

  it('relatedTerms e tags omitidos viram listas vazias', () => {
    const card = trackOf(minimalTrack()).decks[0].cards[0];
    expect(card.relatedTerms).toEqual([]);
    expect(card.tags).toEqual([]);
  });

  it('não acusa erro de referência quando o card alvo existe mas está malformado', () => {
    const input = fullTrack();
    delete input.decks[3].cards[0].definition; // api continua sendo concept
    const errors = errorsOf(input);
    expect(errors.some((e) => e.path.includes('relatedTerms'))).toBe(false);
  });
});
