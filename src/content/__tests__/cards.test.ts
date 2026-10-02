import type { CodeCard, EndpointCard, StepCard } from '../index';
import { cardAt, codeCard, endpointCard, fullTheme, minimalTheme, snippet, stepCard, compareCard } from '../__fixtures__/themes';
import { errorsOf, expectErrorAt, themeOf } from '../__fixtures__/expect';

// No fullTheme: deck 0 = endpoints, deck 1 = [step-1, docker-compose], deck 2 = [cmp-dto], deck 3 = glossário.

describe('Requirement: Card endpoint', () => {
  it('Endpoint válido', () => {
    const card = cardAt(themeOf(fullTheme()), 0, 0) as EndpointCard;
    expect(card).toMatchObject({ method: 'DELETE', path: '/products/{id}', operation: 'D', successStatus: 204, errorStatuses: [404] });
  });

  it('Método desconhecido', () => {
    const input = fullTheme();
    input.decks[0].cards[0] = endpointCard('ep-x', { method: 'FETCH' });
    expectErrorAt(input, 'decks[0].cards[0].method');
  });

  it('Path sem barra inicial', () => {
    const input = fullTheme();
    input.decks[0].cards[0] = endpointCard('ep-x', { path: 'products' });
    expectErrorAt(input, 'decks[0].cards[0].path');
  });

  it('rejeita status fora de 100–599', () => {
    const input = fullTheme();
    input.decks[0].cards[0] = endpointCard('ep-x', { successStatus: 99, errorStatuses: [600] });
    const paths = errorsOf(input).map((e) => e.path);
    expect(paths).toEqual(expect.arrayContaining(['decks[0].cards[0].successStatus', 'decks[0].cards[0].errorStatuses[0]']));
  });
});

describe('Requirement: Snippet de código', () => {
  it('Linguagem não suportada', () => {
    const input = fullTheme();
    cardAt(input, 1, 1).snippet = snippet('x', { language: 'cobol' });
    expectErrorAt(input, 'decks[1].cards[1].snippet.language');
  });

  it('Código preservado', () => {
    const code = '\n    def f():\n\n        return 1\n  ';
    const input = fullTheme();
    cardAt(input, 1, 1).snippet = snippet(code, { language: 'python' });
    const card = cardAt(themeOf(input), 1, 1) as CodeCard;
    expect(card.snippet.code).toBe(code);
  });

  it('aceita note opcional', () => {
    const input = fullTheme();
    cardAt(input, 1, 1).snippet = snippet('x', { note: 'Uma nota.' });
    expect((cardAt(themeOf(input), 1, 1) as CodeCard).snippet.note).toBe('Uma nota.');
  });
});

describe('Requirement: Card code', () => {
  it('Code ligado a variante existente', () => {
    const input = fullTheme();
    cardAt(input, 1, 1).variant = 'express';
    expect((cardAt(themeOf(input), 1, 1) as CodeCard).variant).toBe('express');
  });

  it('Code ligado a variante inexistente', () => {
    const input = fullTheme();
    cardAt(input, 1, 1).variant = 'rails';
    expectErrorAt(input, 'decks[1].cards[1].variant', 'rails');
  });

  it('Code sem variante', () => {
    const card = cardAt(themeOf(fullTheme()), 1, 1) as CodeCard;
    expect(card.variant).toBeUndefined();
  });

  it('code com variante em tema sem variants', () => {
    const input = minimalTheme();
    input.decks[0].cards.push(codeCard('trecho', { variant: 'express' }));
    expectErrorAt(input, 'decks[0].cards[1].variant', 'express');
  });
});

describe('Requirement: Card step', () => {
  it('Step cobre todas as variantes', () => {
    const card = cardAt(themeOf(fullTheme()), 1, 0) as StepCard;
    expect(Object.keys(card.snippets).sort()).toEqual(['express', 'fastapi', 'nest', 'spring']);
  });

  it('Step sem uma variante', () => {
    const input = fullTheme();
    delete cardAt(input, 1, 0).snippets.fastapi;
    expectErrorAt(input, 'decks[1].cards[0].snippets.fastapi', 'fastapi');
  });

  it('Step com variante desconhecida', () => {
    const input = fullTheme();
    cardAt(input, 1, 0).snippets.django = snippet();
    expectErrorAt(input, 'decks[1].cards[0].snippets.django', 'django');
  });

  it('Step em tema sem variantes', () => {
    const input = minimalTheme();
    input.decks[0].cards.push(stepCard(1, {}, ['express']));
    expectErrorAt(input, 'decks[0].cards[1]', 'variants');
  });

  it('Número de passo repetido no deck', () => {
    const input = fullTheme();
    input.decks[1].cards = [stepCard(3), stepCard(3, { id: 'step-3b' })];
    expectErrorAt(input, 'decks[1].cards[1].number', '3');
  });

  it('mesmo número em decks diferentes é permitido', () => {
    const input = fullTheme();
    input.decks[0].cards.push(stepCard(1, { id: 'step-1-outro' }));
    themeOf(input);
  });

  it('rejeita número menor que 1', () => {
    const input = fullTheme();
    cardAt(input, 1, 0).number = 0;
    expectErrorAt(input, 'decks[1].cards[0].number');
  });
});

describe('Requirement: Card compare', () => {
  it('Compare completo', () => {
    const card = cardAt(themeOf(fullTheme()), 2, 0);
    expect(card.type).toBe('compare');
  });

  it('Compare sem uma coluna', () => {
    const input = fullTheme();
    delete cardAt(input, 2, 0).values.nest;
    expectErrorAt(input, 'decks[2].cards[0].values.nest', 'nest');
  });

  it('coluna desconhecida no compare', () => {
    const input = fullTheme();
    cardAt(input, 2, 0).values.rails = 'x';
    expectErrorAt(input, 'decks[2].cards[0].values.rails', 'rails');
  });

  it('valor de coluna vazio', () => {
    const input = fullTheme();
    cardAt(input, 2, 0).values.nest = '  ';
    expectErrorAt(input, 'decks[2].cards[0].values.nest');
  });

  it('Compare em tema sem colunas', () => {
    const input = minimalTheme();
    input.decks[0].cards.push(compareCard());
    expectErrorAt(input, 'decks[0].cards[1]', 'compareColumns');
  });
});
