import { progressKey } from '../rules';
import { resetStudyStore, useStudyStore } from '../store';

const store = () => useStudyStore.getState();

beforeEach(() => resetStudyStore());

describe('Requirement: Progresso enquanto o app está aberto', () => {
  it('registra a resposta com chave por trilha', () => {
    store().answer('crud-4-frameworks', 'cors', 'known');
    expect(store().progress).toEqual({ [progressKey('crud-4-frameworks', 'cors')]: 'known' });
  });

  it('Resposta substituída', () => {
    store().answer('crud-4-frameworks', 'cors', 'unknown');
    store().answer('crud-4-frameworks', 'cors', 'known');
    expect(store().progress[progressKey('crud-4-frameworks', 'cors')]).toBe('known');
  });

  it('mesmo id em trilhas diferentes não colide', () => {
    store().answer('trilha-a', 'api', 'known');
    store().answer('trilha-b', 'api', 'unknown');
    expect(store().progress[progressKey('trilha-a', 'api')]).toBe('known');
    expect(store().progress[progressKey('trilha-b', 'api')]).toBe('unknown');
  });
});

describe('variante preferida', () => {
  it('guarda a escolha por trilha', () => {
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
