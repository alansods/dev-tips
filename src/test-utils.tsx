// Helpers de teste (fora de __tests__ para não ser tratado como suíte).
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { getTrack } from './content/catalog';
import type { Card, Track } from './content';
import { useSettingsStore, type Language } from './i18n';
import { ThemeProvider } from './theme/ThemeProvider';

export const crudTrack: Track = getTrack('crud-4-frameworks')!;
export const webTrack: Track = getTrack('fundamentos-web')!;

export function cardById(id: string, track: Track = crudTrack): Card {
  const card = track.decks.flatMap((d) => d.cards).find((c) => c.id === id);
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

// Em Jest a lista do Glossário não tem medida de tela, então só monta os
// primeiros itens. Os helpers abaixo informam tamanhos de tela e de item
// (altura fixa) e avançam os timers (o `renderRouter` usa timers falsos).
const GLOSSARY_ITEM_HEIGHT = 72;
const GLOSSARY_WIDTH = 400;

function layoutGlossary(viewportHeight: number, offset: (contentHeight: number) => number) {
  const list = screen.getByTestId('glossary-list');
  const contentHeight = list.props.data.length * GLOSSARY_ITEM_HEIGHT;
  const viewport = { width: GLOSSARY_WIDTH, height: viewportHeight };
  act(() => {
    fireEvent(list, 'layout', { nativeEvent: { layout: { x: 0, y: 0, ...viewport } } });
    screen.getAllByTestId(/^glossary-(item|letter)$/).forEach((item, index) =>
      fireEvent(item, 'layout', {
        nativeEvent: {
          layout: { x: 0, y: index * GLOSSARY_ITEM_HEIGHT, width: GLOSSARY_WIDTH, height: GLOSSARY_ITEM_HEIGHT },
        },
      }),
    );
    fireEvent(list, 'contentSizeChange', GLOSSARY_WIDTH, contentHeight);
    fireEvent.scroll(list, {
      nativeEvent: {
        contentOffset: { x: 0, y: offset(contentHeight) },
        contentSize: { width: GLOSSARY_WIDTH, height: contentHeight },
        layoutMeasurement: viewport,
      },
    });
    jest.advanceTimersByTime(1000);
  });
}

/** Rola a lista do Glossário até o fim (tela de celular). */
export function scrollGlossaryToEnd() {
  untilStable(() => layoutGlossary(800, (contentHeight) => Math.max(0, contentHeight - 800)));
}

/** Repete o passo enquanto a lista monta linhas novas (cada rodada mede as que acabaram de montar). */
function untilStable(step: () => void) {
  const mounted = () =>
    screen
      .getAllByTestId(/^glossary-(item|letter)$/)
      .map((el) => el.props.accessibilityLabel)
      .join('|');
  let before = '';
  for (let i = 0; i < 20 && mounted() !== before; i++) {
    before = mounted();
    step();
  }
}

/** Monta todos os termos da lista do Glossário, como numa tela alta o bastante para caber todos. */
export function showAllGlossaryItems() {
  const total = screen.getByTestId('glossary-list').props.data.length;
  untilStable(() => layoutGlossary(total * GLOSSARY_ITEM_HEIGHT, () => 0));
}
