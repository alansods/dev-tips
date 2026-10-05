import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import StudyScreen from '../app/study/[trackId]/[deckId]';
import TrackScreen from '../app/track/[trackId]';
import { progressKey } from '../study/rules';
import { resetStudyStore, useStudyStore } from '../study/store';
import { crudTrack } from '../test-utils';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/progress': ProgressScreen,
  'track/[trackId]': TrackScreen,
  'study/[trackId]/[deckId]': StudyScreen,
};

const TRACK = crudTrack.id;
const TOTAL = crudTrack.decks.reduce((n, d) => n + d.cards.length, 0);
const deckIds = (id: string) => crudTrack.decks.find((d) => d.id === id)!.cards.map((c) => c.id);
const seed = (ids: string[], result: 'known' | 'unknown') =>
  ids.forEach((id) => useStudyStore.getState().answer(TRACK, id, result));
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
/** Seção da aba Progresso da trilha CRUD (há mais de uma trilha no catálogo). */
const crud = () => within(screen.getByTestId(`track-progress-${TRACK}`));
const pressInCrud = (name: string) => fireEvent.press(crud().getByRole('button', { name }));

async function openProgress() {
  renderRouter(APP, { initialUrl: '/progress' });
  await act(async () => {});
}

beforeEach(() => resetStudyStore());

describe('Requirement: Aba Progresso', () => {
  it('Sem progresso', async () => {
    await openProgress();
    expect(crud().getByText(crudTrack.title)).toBeOnTheScreen();
    expect(crud().getByLabelText('0% da trilha dominada')).toBeOnTheScreen();
    expect(crud().getByLabelText('0 já sabia')).toBeOnTheScreen();
    expect(crud().getByLabelText('0 para revisar')).toBeOnTheScreen();
    expect(crud().getByLabelText(`${TOTAL} não vistos`)).toBeOnTheScreen();
    expect(screen.queryByText(/em construção/i)).toBeNull();
  });

  it('Com progresso', async () => {
    seed(deckIds('glossario').slice(0, 4), 'known');
    seed(deckIds('mapa-mental').slice(0, 2), 'unknown');
    await openProgress();
    expect(crud().getByLabelText('5% da trilha dominada')).toBeOnTheScreen(); // 4 de 73
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

describe('Requirement: Zerar progresso de uma trilha', () => {
  it('Zerar com confirmação', async () => {
    seed(deckIds('glossario').slice(0, 4), 'known');
    await openProgress();
    pressInCrud('Zerar progresso');
    expect(crud().getByText('Zerar o progresso desta trilha?')).toBeOnTheScreen();
    pressInCrud('Zerar');
    expect(crud().getByLabelText('0% da trilha dominada')).toBeOnTheScreen();
    expect(useStudyStore.getState().progress).toEqual({});

    fireEvent.press(screen.getByRole('button', { name: /^Trilhas, tab/ }));
    press(/^O mesmo CRUD em quatro frameworks/);
    for (const deck of crudTrack.decks) {
      expect(screen.getByRole('button', { name: `Estudar ${deck.title}` })).toBeOnTheScreen();
    }
  });

  it('Cancelar', async () => {
    seed(deckIds('glossario').slice(0, 4), 'known');
    await openProgress();
    pressInCrud('Zerar progresso');
    pressInCrud('Cancelar');
    expect(crud().queryByText('Zerar o progresso desta trilha?')).toBeNull();
    expect(crud().getByLabelText('4 já sabia')).toBeOnTheScreen();
    expect(useStudyStore.getState().progress[progressKey(TRACK, 'api')]).toBe('known');
  });
});
