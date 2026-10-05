import AsyncStorage from '@react-native-async-storage/async-storage';

import { progressKey } from '../rules';
import { STUDY_STORAGE_KEY, resetStudyStore, useStudyStore } from '../store';

const store = () => useStudyStore.getState();
const TRACK = 'crud-4-frameworks';

/** Espera as gravações assíncronas do persist. */
const flush = () => new Promise((r) => setTimeout(r, 0));

/** Simula fechar e reabrir o app: zera a memória e reidrata do disco. */
async function reopen() {
  // limpar a memória faz o persist gravar o estado vazio; guardamos o disco antes e o restauramos
  const saved = await AsyncStorage.getItem(STUDY_STORAGE_KEY);
  useStudyStore.setState({ progress: {}, preferredVariant: {}, schedule: {} });
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
    store().answer(TRACK, 'api', 'known');
    store().answer(TRACK, 'crud', 'known');
    store().answer(TRACK, 'cors', 'known');
    await flush();
    await reopen();
    expect(Object.values(store().progress)).toEqual(['known', 'known', 'known']);
    expect(store().progress[progressKey(TRACK, 'cors')]).toBe('known');
  });

  it('Framework preferido mantido ao reabrir', async () => {
    store().setVariant(TRACK, 'fastapi');
    await flush();
    await reopen();
    expect(store().preferredVariant[TRACK]).toBe('fastapi');
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
    expect(() => store().answer(TRACK, 'api', 'known')).not.toThrow();
    await flush();
    expect(store().progress[progressKey(TRACK, 'api')]).toBe('known');
  });

  it('só dados são salvos, não funções', async () => {
    store().answer(TRACK, 'api', 'unknown');
    await flush();
    const saved = JSON.parse((await AsyncStorage.getItem(STUDY_STORAGE_KEY))!);
    expect(Object.keys(saved.state).sort()).toEqual(['lastStudyDay', 'preferredVariant', 'progress', 'schedule']);
    expect(saved.version).toBe(2);
  });
});

describe('Requirement: Zerar progresso de uma trilha', () => {
  it('Zerar mantém outras trilhas e o framework preferido', async () => {
    store().answer(TRACK, 'api', 'known');
    store().answer(TRACK, 'cors', 'unknown');
    store().answer('outro-trilha', 'api', 'known');
    store().setVariant(TRACK, 'fastapi');
    store().resetTrack(TRACK);
    expect(store().progress).toEqual({ [progressKey('outro-trilha', 'api')]: 'known' });
    expect(store().preferredVariant[TRACK]).toBe('fastapi');
    await flush();
    await reopen();
    expect(store().progress).toEqual({ [progressKey('outro-trilha', 'api')]: 'known' });
  });
});
