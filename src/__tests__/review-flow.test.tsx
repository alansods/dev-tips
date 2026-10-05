import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import AreaScreen from '../app/area/[areaId]/index';
import ReviewScreen from '../app/review/[trackId]';
import StudyScreen from '../app/study/[trackId]/[deckId]';
import TrackScreen from '../app/track/[trackId]';
import * as clock from '../study/clock';
import { resetStudyStore, useStudyStore } from '../study/store';
import { crudTrack } from '../test-utils';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/progress': ProgressScreen,
  'area/[areaId]/index': AreaScreen,
  'track/[trackId]': TrackScreen,
  'study/[trackId]/[deckId]': StudyScreen,
  'review/[trackId]': ReviewScreen,
};
const TRACK = crudTrack.id;
const glossaryIds = crudTrack.decks.find((d) => d.id === 'glossario')!.cards.map((c) => c.id);

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const seed = (ids: string[], result: 'known' | 'unknown') =>
  ids.forEach((id) => useStudyStore.getState().answer(TRACK, id, result));
function answer(result: 'Já sabia' | 'Não sabia') {
  press('Mostrar resposta');
  press(result);
}

beforeEach(() => {
  jest.spyOn(clock, 'today').mockReturnValue('2026-10-02');
  resetStudyStore();
});
afterEach(() => jest.restoreAllMocks());

describe('Requirement: Revisão de hoje na tela da trilha', () => {
  it('Com revisão pendente', async () => {
    seed(glossaryIds.slice(0, 3), 'unknown');
    await open(`/track/${TRACK}`);
    expect(screen.getByText('3 cards para revisar hoje')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Revisar agora' })).toBeOnTheScreen();
  });

  it('Sem revisão pendente', async () => {
    seed(glossaryIds.slice(0, 3), 'known'); // agendados para daqui a 3 dias
    await open(`/track/${TRACK}`);
    expect(screen.getByText('Nada para revisar hoje.')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Revisar agora' })).toBeNull();
  });

  it('cards vencem com o passar dos dias', async () => {
    seed(glossaryIds.slice(0, 2), 'known');
    (clock.today as jest.Mock).mockReturnValue('2026-10-05');
    await open(`/track/${TRACK}`);
    expect(screen.getByText('2 cards para revisar hoje')).toBeOnTheScreen();
  });
});

describe('Requirement: Revisão na Home', () => {
  it('Aviso na Home', async () => {
    seed(glossaryIds.slice(0, 2), 'unknown');
    await open('/');
    expect(screen.getByText('2 para revisar hoje')).toBeOnTheScreen();
  });

  it('sem aviso quando não há revisão', async () => {
    await open('/');
    expect(screen.queryByText(/para revisar hoje/)).toBeNull();
  });
});

describe('Requirement: Sessão de revisão', () => {
  it('Revisar os cards do dia', async () => {
    seed(glossaryIds.slice(0, 2), 'unknown');
    await open(`/track/${TRACK}`);
    press('Revisar agora');
    expect(screen).toHavePathname(`/review/${TRACK}`);
    expect(screen.getByText('Revisão de hoje')).toBeOnTheScreen();
    expect(screen.getByText('1 / 2')).toBeOnTheScreen();
  });

  it('Revisão concluída some do dia', async () => {
    seed(glossaryIds.slice(0, 2), 'unknown');
    await open(`/track/${TRACK}`);
    press('Revisar agora');
    answer('Já sabia');
    answer('Já sabia');
    press('Voltar à trilha');
    expect(screen.getByText('Nada para revisar hoje.')).toBeOnTheScreen();
  });

  it('Erro na revisão continua no dia', async () => {
    seed(glossaryIds.slice(0, 1), 'unknown');
    await open(`/track/${TRACK}`);
    press('Revisar agora');
    answer('Não sabia');
    press('Voltar à trilha');
    expect(screen.getByText('1 card para revisar hoje')).toBeOnTheScreen();
  });
});

describe('Requirement: Zerar progresso de uma trilha (agendamento)', () => {
  it('Zerar apaga o agendamento da trilha', async () => {
    seed(glossaryIds.slice(0, 2), 'unknown');
    await open('/progress');
    const crud = within(screen.getByTestId(`track-progress-${TRACK}`));
    fireEvent.press(crud.getByRole('button', { name: 'Zerar progresso' }));
    fireEvent.press(crud.getByRole('button', { name: 'Zerar' }));
    fireEvent.press(screen.getByRole('button', { name: /^Trilhas, tab/ }));
    press(/^Backend,/);
    press(/^O mesmo CRUD em quatro frameworks/);
    expect(screen.getByText('Nada para revisar hoje.')).toBeOnTheScreen();
  });
});
