// Helpers de teste (fora de __tests__ para não ser tratado como suíte).
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { getTheme } from './content/catalog';
import type { Card, Theme } from './content';
import { useSettingsStore, type Language } from './i18n';
import { ThemeProvider } from './theme/ThemeProvider';

export const crudTheme: Theme = getTheme('crud-4-frameworks')!;

export function cardById(id: string, theme: Theme = crudTheme): Card {
  const card = theme.decks.flatMap((d) => d.cards).find((c) => c.id === id);
  if (!card) throw new Error(`card ${id} não encontrado`);
  return card;
}

/** Escolhe o idioma do app no teste (o padrão é PT-BR, o idioma do aparelho simulado). */
export function setTestLanguage(language: Language) {
  useSettingsStore.setState({ language });
}

export function renderWithTheme(ui: ReactElement, { language }: { language?: Language } = {}) {
  if (language) setTestLanguage(language);
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}
