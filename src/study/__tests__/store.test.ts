import { progressKey } from '../rules';
import { resetStudyStore, useStudyStore } from '../store';

const store = () => useStudyStore.getState();

beforeEach(() => resetStudyStore());

describe('Requirement: Progresso enquanto o app está aberto', () => {
  it('registra a resposta com chave por tema', () => {
    store().answer('crud-4-frameworks', 'cors', 'known');
    expect(store().progress).toEqual({ [progressKey('crud-4-frameworks', 'cors')]: 'known' });
  });

  it('Resposta substituída', () => {
    store().answer('crud-4-frameworks', 'cors', 'unknown');
    store().answer('crud-4-frameworks', 'cors', 'known');
    expect(store().progress[progressKey('crud-4-frameworks', 'cors')]).toBe('known');
  });

  it('mesmo id em temas diferentes não colide', () => {
    store().answer('tema-a', 'api', 'known');
    store().answer('tema-b', 'api', 'unknown');
    expect(store().progress[progressKey('tema-a', 'api')]).toBe('known');
    expect(store().progress[progressKey('tema-b', 'api')]).toBe('unknown');
  });
});

describe('variante preferida', () => {
  it('guarda a escolha por tema', () => {
    store().setVariant('crud-4-frameworks', 'fastapi');
    expect(store().preferredVariant).toEqual({ 'crud-4-frameworks': 'fastapi' });
  });

  it('resetStudyStore limpa tudo', () => {
    store().answer('t', 'c', 'known');
    store().setVariant('t', 'v');
    resetStudyStore();
    expect(store().progress).toEqual({});
    expect(store().preferredVariant).toEqual({});
  });
});
