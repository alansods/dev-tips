// Helpers de teste (fora de __tests__ para não ser tratado como suíte).
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { getTheme } from './content/catalog';
import type { Card, Theme } from './content';
import { ThemeProvider } from './theme/ThemeProvider';

export const crudTheme: Theme = getTheme('crud-4-frameworks')!;

export function cardById(id: string, theme: Theme = crudTheme): Card {
  const card = theme.decks.flatMap((d) => d.cards).find((c) => c.id === id);
  if (!card) throw new Error(`card ${id} não encontrado`);
  return card;
}

export function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}
