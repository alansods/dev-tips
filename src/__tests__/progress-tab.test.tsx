import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import StudyScreen from '../app/study/[themeId]/[deckId]';
import ThemeScreen from '../app/theme/[themeId]';
import { progressKey } from '../study/rules';
import { resetStudyStore, useStudyStore } from '../study/store';
import { crudTheme } from '../test-utils';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/progress': ProgressScreen,
  'theme/[themeId]': ThemeScreen,
  'study/[themeId]/[deckId]': StudyScreen,
};

const THEME = crudTheme.id;
const TOTAL = crudTheme.decks.reduce((n, d) => n + d.cards.length, 0);
const deckIds = (id: string) => crudTheme.decks.find((d) => d.id === id)!.cards.map((c) => c.id);
const seed = (ids: string[], result: 'known' | 'unknown') =>
  ids.forEach((id) => useStudyStore.getState().answer(THEME, id, result));
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
/** Seção da aba Progresso do tema CRUD (há mais de um tema no catálogo). */
const crud = () => within(screen.getByTestId(`theme-progress-${THEME}`));
const pressInCrud = (name: string) => fireEvent.press(crud().getByRole('button', { name }));

async function openProgress() {
  renderRouter(APP, { initialUrl: '/progress' });
  await act(async () => {});
}

beforeEach(() => resetStudyStore());

describe('Requirement: Aba Progresso', () => {
  it('Sem progresso', async () => {
    await openProgress();
    expect(crud().getByText(crudTheme.title)).toBeOnTheScreen();
    expect(crud().getByLabelText('0% do tema dominado')).toBeOnTheScreen();
    expect(crud().getByLabelText('0 já sabia')).toBeOnTheScreen();
    expect(crud().getByLabelText('0 para revisar')).toBeOnTheScreen();
    expect(crud().getByLabelText(`${TOTAL} não vistos`)).toBeOnTheScreen();
    expect(screen.queryByText(/em construção/i)).toBeNull();
  });

  it('Com progresso', async () => {
    seed(deckIds('glossario').slice(0, 4), 'known');
    seed(deckIds('mapa-mental').slice(0, 2), 'unknown');
    await openProgress();
    expect(crud().getByLabelText('5% do tema dominado')).toBeOnTheScreen(); // 4 de 73
    expect(crud().getByLabelText('4 já sabia')).toBeOnTheScreen();
    expect(crud().getByLabelText('2 para revisar')).toBeOnTheScreen();
    expect(crud().getByLabelText(`${TOTAL - 6} não vistos`)).toBeOnTheScreen();
    // legenda das cores com o mesmo rótulo da contagem
    expect(crud().getAllByText('já sabia').length).toBeGreaterThanOrEqual(2);
  });

  it('Progresso por deck', async () => {
    seed(deckIds('o-que-vamos-criar').slice(0, 2), 'known');
    await openProgress();
    expect(crud().getByText('O que vamos criar')).toBeOnTheScreen();
    expect(crud().getByText('2/5')).toBeOnTheScreen();
    expect(crud().getByText('0/20')).toBeOnTheScreen();
  });
});

describe('Requirement: Zerar progresso de um tema', () => {
  it('Zerar com confirmação', async () => {
    seed(deckIds('glossario').slice(0, 4), 'known');
    await openProgress();
    pressInCrud('Zerar progresso');
    expect(crud().getByText('Zerar o progresso deste tema?')).toBeOnTheScreen();
    pressInCrud('Zerar');
    expect(crud().getByLabelText('0% do tema dominado')).toBeOnTheScreen();
    expect(useStudyStore.getState().progress).toEqual({});

    fireEvent.press(screen.getByRole('button', { name: /^Temas, tab/ }));
    press(/^O mesmo CRUD em quatro frameworks/);
    for (const deck of crudTheme.decks) {
      expect(screen.getByRole('button', { name: `Estudar ${deck.title}` })).toBeOnTheScreen();
    }
  });

  it('Cancelar', async () => {
    seed(deckIds('glossario').slice(0, 4), 'known');
    await openProgress();
    pressInCrud('Zerar progresso');
    pressInCrud('Cancelar');
    expect(crud().queryByText('Zerar o progresso deste tema?')).toBeNull();
    expect(crud().getByLabelText('4 já sabia')).toBeOnTheScreen();
    expect(useStudyStore.getState().progress[progressKey(THEME, 'api')]).toBe('known');
  });
});
