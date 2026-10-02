import AsyncStorage from '@react-native-async-storage/async-storage';

import { resolveLanguage } from '../language';
import { SETTINGS_STORAGE_KEY, useSettingsStore } from '../store';

const locale = (languageTag: string) => ({ languageTag, languageCode: languageTag.split('-')[0] });

describe('Requirement: Idioma inicial pelo aparelho', () => {
  it('Aparelho em inglês', () => {
    expect(resolveLanguage(null, [locale('en-GB')])).toBe('en');
  });

  it('Aparelho em outro idioma', () => {
    expect(resolveLanguage(null, [locale('es-ES')])).toBe('pt-BR');
  });

  it('Aparelho em português', () => {
    expect(resolveLanguage(null, [locale('pt-PT')])).toBe('pt-BR');
  });

  it('sem idioma do aparelho cai para PT-BR', () => {
    expect(resolveLanguage(null, [])).toBe('pt-BR');
  });

  it('usa só o idioma preferido (o primeiro da lista)', () => {
    expect(resolveLanguage(null, [locale('fr-FR'), locale('en-US')])).toBe('pt-BR');
  });
});

describe('Requirement: Trocar o idioma', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useSettingsStore.setState({ language: null });
  });

  it('escolha salva prevalece sobre o aparelho', () => {
    expect(resolveLanguage('pt-BR', [locale('en-US')])).toBe('pt-BR');
    expect(resolveLanguage('en', [locale('pt-BR')])).toBe('en');
  });

  it('Escolha mantida ao reabrir', async () => {
    useSettingsStore.getState().setLanguage('pt-BR');
    await new Promise((r) => setTimeout(r, 0));
    const saved = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    expect(JSON.parse(saved!).state.language).toBe('pt-BR');

    // "reabrir": memória vazia (o setState também grava), depois restaura o que foi salvo
    useSettingsStore.setState({ language: null });
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, saved!);
    await useSettingsStore.persist.rehydrate();
    expect(useSettingsStore.getState().language).toBe('pt-BR');
  });

  it('Valor salvo inválido', async () => {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ state: { language: 'fr' }, version: 1 }));
    await useSettingsStore.persist.rehydrate();
    expect(useSettingsStore.getState().language).toBeNull();
  });

  it('JSON corrompido não quebra', async () => {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, '{oops');
    await useSettingsStore.persist.rehydrate();
    expect(useSettingsStore.getState().language).toBeNull();
  });
});
