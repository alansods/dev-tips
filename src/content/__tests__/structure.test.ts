import { conceptCard, minimalTheme } from '../__fixtures__/themes';
import { expectErrorAt, themeOf } from '../__fixtures__/expect';

describe('Requirement: Estrutura tema, deck e card', () => {
  it('Tema mínimo válido', () => {
    const theme = themeOf(minimalTheme());
    expect(theme.id).toBe('tema-minimo');
    expect(theme.decks[0].cards).toHaveLength(1);
  });

  it('Tema sem decks', () => {
    const input = minimalTheme();
    input.decks = [];
    expectErrorAt(input, 'decks');
  });

  it('Deck sem cards', () => {
    const input = minimalTheme();
    input.decks[0].cards = [];
    expectErrorAt(input, 'decks[0].cards');
  });

  it('Texto obrigatório só com espaços', () => {
    const input = minimalTheme();
    input.decks[0].title = '   ';
    expectErrorAt(input, 'decks[0].title', 'vazio');
  });

  it('Id fora do padrão', () => {
    const input = minimalTheme();
    input.decks[0].cards[0].id = 'Passo 1';
    expectErrorAt(input, 'decks[0].cards[0].id', 'kebab-case');
  });

  it('preserva a ordem de decks e cards', () => {
    const input = minimalTheme();
    input.decks[0].cards.push(conceptCard('cors', 'CORS'), conceptCard('dto', 'DTO'));
    input.decks.push({ id: 'deck-2', title: 'Deck 2', cards: [conceptCard('mock', 'Mock')] });
    const theme = themeOf(input);
    expect(theme.decks.map((d) => d.id)).toEqual(['deck-1', 'deck-2']);
    expect(theme.decks[0].cards.map((c) => c.id)).toEqual(['api', 'cors', 'dto']);
  });
});

describe('Requirement: Variantes e colunas definidas por tema', () => {
  it('Tema sem variantes nem colunas', () => {
    const theme = themeOf(minimalTheme());
    expect(theme.variants).toBeUndefined();
    expect(theme.compareColumns).toBeUndefined();
  });

  it('Variante duplicada', () => {
    const input = minimalTheme();
    input.variants = [
      { id: 'express', name: 'Express', language: 'TypeScript' },
      { id: 'express', name: 'Express 2', language: 'TypeScript' },
    ];
    expectErrorAt(input, 'variants[1].id', 'express');
  });

  it('coluna duplicada', () => {
    const input = minimalTheme();
    input.compareColumns = [
      { id: 'nest', label: 'NestJS' },
      { id: 'nest', label: 'Nest' },
    ];
    expectErrorAt(input, 'compareColumns[1].id', 'nest');
  });
});

describe('Requirement: Origem do card', () => {
  it('Origem omitida', () => {
    const theme = themeOf(minimalTheme());
    expect(theme.decks[0].cards[0].origin).toBe('original');
  });

  it('Origem inválida', () => {
    const input = minimalTheme();
    input.decks[0].cards[0].origin = 'ai';
    expectErrorAt(input, 'decks[0].cards[0].origin');
  });

  it('aceita supplement', () => {
    const input = minimalTheme();
    input.decks[0].cards[0].origin = 'supplement';
    expect(themeOf(input).decks[0].cards[0].origin).toBe('supplement');
  });
});
