// Ponto de entrada do i18n: o idioma efetivo e os textos dele.

import { getLocales } from 'expo-localization';

import { en } from './en';
import { resolveLanguage, type Language } from './language';
import { ptBR, type Messages } from './pt-BR';
import { useSettingsStore } from './store';

export { LANGUAGE_NAMES, LANGUAGES, type Language } from './language';
export type { Messages } from './pt-BR';
export { useSettingsStore } from './store';

export const MESSAGES: Record<Language, Messages> = { 'pt-BR': ptBR, en };

function deviceLocales() {
  try {
    return getLocales() ?? [];
  } catch {
    return [];
  }
}

/** Idioma em uso: a escolha salva ou, sem escolha, o do aparelho. */
export function useLanguage(): Language {
  const saved = useSettingsStore((s) => s.language);
  return resolveLanguage(saved, deviceLocales());
}

/** Textos da interface no idioma em uso. */
export function useT(): Messages {
  return MESSAGES[useLanguage()];
}

/** Idioma em uso fora de componentes (ex.: ao agendar notificações). */
export function currentLanguage(): Language {
  return resolveLanguage(useSettingsStore.getState().language, deviceLocales());
}
