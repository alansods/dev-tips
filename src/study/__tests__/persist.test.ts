import AsyncStorage from '@react-native-async-storage/async-storage';

import { progressKey } from '../rules';
import { STUDY_STORAGE_KEY, resetStudyStore, useStudyStore } from '../store';

const store = () => useStudyStore.getState();
const THEME = 'crud-4-frameworks';

/** Espera as gravações assíncronas do persist. */
const flush = () => new Promise((r) => setTimeout(r, 0));

/** Simula fechar e reabrir o app: zera a memória e reidrata do disco. */
async function reopen() {
  // limpar a memória faz o persist gravar o estado vazio; guardamos o disco antes e o restauramos
  const saved = await AsyncStorage.getItem(STUDY_STORAGE_KEY);
  useStudyStore.setState({ progress: {}, preferredVariant: {} });
  await flush();
  if (saved == null) await AsyncStorage.removeItem(STUDY_STORAGE_KEY);
  else await AsyncStorage.setItem(STUDY_STORAGE_KEY, saved);
  await useStudyStore.persist.rehydrate();
}

beforeEach(async () => {
  await AsyncStorage.clear();
  resetStudyStore();
  await flush();
  await AsyncStorage.clear();
});

describe('Requirement: Progresso salvo no aparelho', () => {
  it('Progresso mantido ao reabrir', async () => {
    store().answer(THEME, 'api', 'known');
    store().answer(THEME, 'crud', 'known');
    store().answer(THEME, 'cors', 'known');
    await flush();
    await reopen();
    expect(Object.values(store().progress)).toEqual(['known', 'known', 'known']);
    expect(store().progress[progressKey(THEME, 'cors')]).toBe('known');
  });

  it('Framework preferido mantido ao reabrir', async () => {
    store().setVariant(THEME, 'fastapi');
    await flush();
    await reopen();
    expect(store().preferredVariant[THEME]).toBe('fastapi');
  });

  it('Dados salvos inválidos', async () => {
    await AsyncStorage.setItem(
      STUDY_STORAGE_KEY,
      JSON.stringify({ state: { progress: { 'x:y': 'talvez' }, preferredVariant: 3 }, version: 1 }),
    );
    await reopen();
    expect(store().progress).toEqual({});
    expect(store().preferredVariant).toEqual({});
  });

  it('JSON corrompido é ignorado', async () => {
    await AsyncStorage.setItem(STUDY_STORAGE_KEY, '{ isto não é json');
    await expect(reopen()).resolves.toBeUndefined();
    expect(store().progress).toEqual({});
  });

  it('falha de leitura não quebra', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('disco indisponível'));
    await expect(useStudyStore.persist.rehydrate()).resolves.toBeUndefined();
    expect(store().progress).toEqual({});
  });

  it('falha de escrita não quebra', async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('disco cheio'));
    expect(() => store().answer(THEME, 'api', 'known')).not.toThrow();
    await flush();
    expect(store().progress[progressKey(THEME, 'api')]).toBe('known');
  });

  it('só dados são salvos, não funções', async () => {
    store().answer(THEME, 'api', 'unknown');
    await flush();
    const saved = JSON.parse((await AsyncStorage.getItem(STUDY_STORAGE_KEY))!);
    expect(Object.keys(saved.state).sort()).toEqual(['preferredVariant', 'progress']);
    expect(saved.version).toBe(1);
  });
});

describe('Requirement: Zerar progresso de um tema', () => {
  it('Zerar mantém outros temas e o framework preferido', async () => {
    store().answer(THEME, 'api', 'known');
    store().answer(THEME, 'cors', 'unknown');
    store().answer('outro-tema', 'api', 'known');
    store().setVariant(THEME, 'fastapi');
    store().resetTheme(THEME);
    expect(store().progress).toEqual({ [progressKey('outro-tema', 'api')]: 'known' });
    expect(store().preferredVariant[THEME]).toBe('fastapi');
    await flush();
    await reopen();
    expect(store().progress).toEqual({ [progressKey('outro-tema', 'api')]: 'known' });
  });
});
