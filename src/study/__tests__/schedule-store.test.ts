import AsyncStorage from '@react-native-async-storage/async-storage';

import * as clock from '../clock';
import { progressKey } from '../rules';
import { STUDY_STORAGE_KEY, resetStudyStore, useStudyStore } from '../store';

const THEME = 'crud-4-frameworks';
const store = () => useStudyStore.getState();
const flush = () => new Promise((r) => setTimeout(r, 0));

async function reopen() {
  const saved = await AsyncStorage.getItem(STUDY_STORAGE_KEY);
  useStudyStore.setState({ progress: {}, preferredVariant: {}, schedule: {} });
  await flush();
  if (saved == null) await AsyncStorage.removeItem(STUDY_STORAGE_KEY);
  else await AsyncStorage.setItem(STUDY_STORAGE_KEY, saved);
  await useStudyStore.persist.rehydrate();
}

beforeEach(async () => {
  jest.spyOn(clock, 'today').mockReturnValue('2026-10-02');
  resetStudyStore();
  await flush();
  await AsyncStorage.clear();
});
afterEach(() => jest.restoreAllMocks());

describe('Requirement: Agendamento salvo no aparelho', () => {
  it('answer atualiza progresso e agendamento', () => {
    store().answer(THEME, 'api', 'known');
    store().answer(THEME, 'cors', 'unknown');
    expect(store().schedule).toEqual({
      [progressKey(THEME, 'api')]: { box: 2, due: '2026-10-05' },
      [progressKey(THEME, 'cors')]: { box: 1, due: '2026-10-02' },
    });
  });

  it('Agendamento mantido ao reabrir', async () => {
    store().answer(THEME, 'api', 'known');
    store().answer(THEME, 'api', 'known');
    await flush();
    await reopen();
    expect(store().schedule[progressKey(THEME, 'api')]).toEqual({ box: 3, due: '2026-10-09' });
  });

  it('Dados da versão anterior', async () => {
    await AsyncStorage.setItem(
      STUDY_STORAGE_KEY,
      JSON.stringify({
        state: { progress: { [progressKey(THEME, 'api')]: 'known' }, preferredVariant: { [THEME]: 'nest' } },
        version: 1,
      }),
    );
    await useStudyStore.persist.rehydrate();
    expect(store().progress[progressKey(THEME, 'api')]).toBe('known');
    expect(store().preferredVariant[THEME]).toBe('nest');
    expect(store().schedule).toEqual({});
  });
});

describe('Requirement: Zerar progresso de um tema', () => {
  it('Zerar apaga o agendamento do tema', () => {
    store().answer(THEME, 'api', 'unknown');
    store().answer('outro', 'api', 'unknown');
    store().resetTheme(THEME);
    expect(store().schedule).toEqual({ [progressKey('outro', 'api')]: { box: 1, due: '2026-10-02' } });
  });
});

describe('Requirement: Configuração salva no aparelho (último dia de estudo)', () => {
  it('answer grava o último dia de estudo, que é salvo e restaurado', async () => {
    expect(store().lastStudyDay).toBeNull();
    store().answer(THEME, 'api', 'known');
    expect(store().lastStudyDay).toBe('2026-10-02');
    await flush();
    await reopen();
    expect(store().lastStudyDay).toBe('2026-10-02');
  });

  it('Progresso da versão anterior', async () => {
    await AsyncStorage.setItem(
      STUDY_STORAGE_KEY,
      JSON.stringify({
        state: { progress: { [progressKey(THEME, 'api')]: 'known' }, preferredVariant: {}, schedule: {} },
        version: 2,
      }),
    );
    await useStudyStore.persist.rehydrate();
    expect(store().progress[progressKey(THEME, 'api')]).toBe('known');
    expect(store().lastStudyDay).toBeNull();
  });
});
