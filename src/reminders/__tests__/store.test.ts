import AsyncStorage from '@react-native-async-storage/async-storage';

import { REMINDERS_STORAGE_KEY, resetRemindersStore, useRemindersStore } from '../store';

const store = () => useRemindersStore.getState();
const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(async () => {
  resetRemindersStore();
  await flush();
  await AsyncStorage.clear();
});

describe('Requirement: Seção Lembretes', () => {
  it('Estado inicial: desligado, às 20:00', () => {
    expect(store()).toMatchObject({ enabled: false, time: '20:00' });
  });
});

describe('Requirement: Configuração salva no aparelho', () => {
  it('Configuração mantida ao reabrir', async () => {
    store().setEnabled(true);
    store().setTime('08:00');
    await flush();
    const saved = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
    useRemindersStore.setState({ enabled: false, time: '20:00' });
    await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, saved!);
    await useRemindersStore.persist.rehydrate();
    expect(store()).toMatchObject({ enabled: true, time: '08:00' });
  });

  it('Dados inválidos', async () => {
    await AsyncStorage.setItem(
      REMINDERS_STORAGE_KEY,
      JSON.stringify({ state: { enabled: 'sim', time: '07:00' }, version: 1 }),
    );
    await useRemindersStore.persist.rehydrate();
    expect(store()).toMatchObject({ enabled: false, time: '20:00' });
  });

  it('JSON corrompido', async () => {
    await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, '{oops');
    await useRemindersStore.persist.rehydrate();
    expect(store()).toMatchObject({ enabled: false, time: '20:00' });
  });

  it('o aviso de permissão negada não é salvo', async () => {
    store().setPermissionDenied(true);
    await flush();
    const saved = JSON.parse((await AsyncStorage.getItem(REMINDERS_STORAGE_KEY))!);
    expect(Object.keys(saved.state).sort()).toEqual(['enabled', 'time']);
  });
});
