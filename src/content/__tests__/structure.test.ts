import { conceptCard, minimalTrack } from '../__fixtures__/tracks';
import { expectErrorAt, trackOf } from '../__fixtures__/expect';

describe('Requirement: Estrutura trilha, deck e card', () => {
  it('Trilha mínima válida', () => {
    const track = trackOf(minimalTrack());
    expect(track.id).toBe('trilha-minimo');
    expect(track.decks[0].cards).toHaveLength(1);
  });

  it('Trilha sem decks', () => {
    const input = minimalTrack();
    input.decks = [];
    expectErrorAt(input, 'decks');
  });

  it('Deck sem cards', () => {
    const input = minimalTrack();
    input.decks[0].cards = [];
    expectErrorAt(input, 'decks[0].cards');
  });

  it('Texto obrigatório só com espaços', () => {
    const input = minimalTrack();
    input.decks[0].title = '   ';
    expectErrorAt(input, 'decks[0].title', 'vazio');
  });

  it('Id fora do padrão', () => {
    const input = minimalTrack();
    input.decks[0].cards[0].id = 'Passo 1';
    expectErrorAt(input, 'decks[0].cards[0].id', 'kebab-case');
  });

  it('preserva a ordem de decks e cards', () => {
    const input = minimalTrack();
    input.decks[0].cards.push(conceptCard('cors', 'CORS'), conceptCard('dto', 'DTO'));
    input.decks.push({ id: 'deck-2', title: 'Deck 2', cards: [conceptCard('mock', 'Mock')] });
    const track = trackOf(input);
    expect(track.decks.map((d) => d.id)).toEqual(['deck-1', 'deck-2']);
    expect(track.decks[0].cards.map((c) => c.id)).toEqual(['api', 'cors', 'dto']);
  });
});

describe('Requirement: Variantes e colunas definidas por trilha', () => {
  it('Trilha sem variantes nem colunas', () => {
    const track = trackOf(minimalTrack());
    expect(track.variants).toBeUndefined();
    expect(track.compareColumns).toBeUndefined();
  });

  it('Variante duplicada', () => {
    const input = minimalTrack();
    input.variants = [
      { id: 'express', name: 'Express', language: 'TypeScript' },
      { id: 'express', name: 'Express 2', language: 'TypeScript' },
    ];
    expectErrorAt(input, 'variants[1].id', 'express');
  });

  it('coluna duplicada', () => {
    const input = minimalTrack();
    input.compareColumns = [
      { id: 'nest', label: 'NestJS' },
      { id: 'nest', label: 'Nest' },
    ];
    expectErrorAt(input, 'compareColumns[1].id', 'nest');
  });
});

describe('Requirement: Origem do card', () => {
  it('Origem omitida', () => {
    const track = trackOf(minimalTrack());
    expect(track.decks[0].cards[0].origin).toBe('original');
  });

  it('Origem inválida', () => {
    const input = minimalTrack();
    input.decks[0].cards[0].origin = 'ai';
    expectErrorAt(input, 'decks[0].cards[0].origin');
  });

  it('aceita supplement', () => {
    const input = minimalTrack();
    input.decks[0].cards[0].origin = 'supplement';
    expect(trackOf(input).decks[0].cards[0].origin).toBe('supplement');
  });
});
