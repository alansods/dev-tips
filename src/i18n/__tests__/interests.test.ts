import AsyncStorage from '@react-native-async-storage/async-storage';

import { SETTINGS_STORAGE_KEY, useSettingsStore } from '../store';

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('Requirement: Áreas de interesse', () => {
  beforeEach(() => useSettingsStore.setState({ interests: [] }));

  it('começa sem áreas e alterna a área escolhida', () => {
    expect(useSettingsStore.getState().interests).toEqual([]);
    useSettingsStore.getState().toggleInterest('backend');
    useSettingsStore.getState().toggleInterest('mobile');
    expect(useSettingsStore.getState().interests).toEqual(['backend', 'mobile']);
    useSettingsStore.getState().toggleInterest('backend');
    expect(useSettingsStore.getState().interests).toEqual(['mobile']);
  });

  it('fica salva no aparelho', async () => {
    useSettingsStore.getState().toggleInterest('frontend');
    await flush();
    const saved = JSON.parse((await AsyncStorage.getItem(SETTINGS_STORAGE_KEY))!);
    expect(saved.state.interests).toEqual(['frontend']);
  });

  it('valor salvo inválido volta para nenhuma área', async () => {
    await AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ state: { language: null, onboardingSeen: true, interests: ['games'] }, version: 1 }),
    );
    await useSettingsStore.persist.rehydrate();
    expect(useSettingsStore.getState().interests).toEqual([]);
  });
});
