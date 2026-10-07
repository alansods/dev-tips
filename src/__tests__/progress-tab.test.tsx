import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProfileScreen from '../app/(tabs)/profile';
import ProgressScreen from '../app/progress';
import AreaScreen from '../app/area/[areaId]/index';
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
  '(tabs)/profile': ProfileScreen,
  progress: ProgressScreen,
  'area/[areaId]/index': AreaScreen,
  'track/[trackId]': TrackScreen,
  'study/[trackId]/[deckId]': StudyScreen,
};

const TRACK = crudTrack.id;
const TOTAL = crudTrack.decks.reduce((n, d) => n + d.cards.length, 0);
const deckIds = (id: string) => crudTrack.decks.find((d) => d.id === id)!.cards.map((c) => c.id);
const seed = (ids: string[], result: 'known' | 'unknown') =>
  ids.forEach((id) => useStudyStore.getState().answer(TRACK, id, result));
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
/** Painel da tela Progresso da trilha CRUD (há mais de uma trilha no catálogo). */
const crud = () => within(screen.getByTestId(`track-progress-${TRACK}`));
const pressInCrud = (name: string) => fireEvent.press(crud().getByRole('button', { name }));
const header = (trackId = TRACK) => screen.getByTestId(`track-progress-header-${trackId}`);
const togglePanel = (trackId = TRACK) => fireEvent.press(header(trackId));

async function openProgress({ expandCrud = true } = {}) {
  renderRouter(APP, { initialUrl: '/progress' });
  await act(async () => {});
  if (expandCrud) togglePanel();
}

beforeEach(() => resetStudyStore());

describe('Requirement: Tela Progresso', () => {
  it('Painéis começam fechados', async () => {
    await openProgress({ expandCrud: false });
    expect(screen.getAllByTestId(/^track-progress-header-/).length).toBeGreaterThan(1);
    expect(header()).toBeCollapsed();
    expect(crud().getByText(crudTrack.title)).toBeOnTheScreen();
    expect(crud().getByLabelText('0% da trilha dominada')).toBeOnTheScreen();
    expect(crud().getByTestId(`track-progress-bar-${TRACK}`)).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Zerar progresso' })).toBeNull();
    expect(screen.queryByText('Por deck')).toBeNull();
    expect(screen.queryByLabelText(/não vistos$/)).toBeNull();
  });

  it('Abrir e fechar um painel', async () => {
    await openProgress({ expandCrud: false });
    togglePanel();
    expect(header()).toBeExpanded();
    expect(crud().getByLabelText(`${TOTAL} não vistos`)).toBeOnTheScreen();
    expect(crud().getByText('O que vamos criar')).toBeOnTheScreen();
    expect(crud().getByRole('button', { name: 'Zerar progresso' })).toBeOnTheScreen();
    togglePanel();
    expect(header()).toBeCollapsed();
    expect(crud().queryByLabelText(`${TOTAL} não vistos`)).toBeNull();
    expect(crud().queryByRole('button', { name: 'Zerar progresso' })).toBeNull();
  });

  it('Vários painéis abertos', async () => {
    await openProgress();
    const other = screen
      .getAllByTestId(/^track-progress-header-/)
      .map((h) => h.props.testID.replace('track-progress-header-', ''))
      .find((id: string) => id !== TRACK)!;
    togglePanel(other);
    expect(header()).toBeExpanded();
    expect(header(other)).toBeExpanded();
    expect(screen.getAllByRole('button', { name: 'Zerar progresso' })).toHaveLength(2);
  });

  it('Porcentagem no painel fechado', async () => {
    seed(deckIds('glossario').slice(0, 4), 'known');
    await openProgress({ expandCrud: false });
    expect(header()).toBeCollapsed();
    expect(crud().getByLabelText('5% da trilha dominada')).toBeOnTheScreen();
  });

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

    // o Progresso é tela cheia: volta para o Perfil e vai para a aba Trilhas
    fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));
    fireEvent.press(screen.getByRole('button', { name: /^Trilhas, tab/ }));
    press(/^Backend,/);
    press(/^O mesmo CRUD em quatro frameworks, \d+ de/);
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
