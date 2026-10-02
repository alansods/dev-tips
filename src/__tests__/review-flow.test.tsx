import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import ReviewScreen from '../app/review/[themeId]';
import StudyScreen from '../app/study/[themeId]/[deckId]';
import ThemeScreen from '../app/theme/[themeId]';
import * as clock from '../study/clock';
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
  'review/[themeId]': ReviewScreen,
};
const THEME = crudTheme.id;
const glossaryIds = crudTheme.decks.find((d) => d.id === 'glossario')!.cards.map((c) => c.id);

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const seed = (ids: string[], result: 'known' | 'unknown') =>
  ids.forEach((id) => useStudyStore.getState().answer(THEME, id, result));
function answer(result: 'Sei' | 'Não sei') {
  press('Mostrar resposta');
  press(result);
}

beforeEach(() => {
  jest.spyOn(clock, 'today').mockReturnValue('2026-10-02');
  resetStudyStore();
});
afterEach(() => jest.restoreAllMocks());

describe('Requirement: Revisão de hoje na tela do tema', () => {
  it('Com revisão pendente', async () => {
    seed(glossaryIds.slice(0, 3), 'unknown');
    await open(`/theme/${THEME}`);
    expect(screen.getByText('3 cards para revisar hoje')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Revisar agora' })).toBeOnTheScreen();
  });

  it('Sem revisão pendente', async () => {
    seed(glossaryIds.slice(0, 3), 'known'); // agendados para daqui a 3 dias
    await open(`/theme/${THEME}`);
    expect(screen.getByText('Nada para revisar hoje.')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Revisar agora' })).toBeNull();
  });

  it('cards vencem com o passar dos dias', async () => {
    seed(glossaryIds.slice(0, 2), 'known');
    (clock.today as jest.Mock).mockReturnValue('2026-10-05');
    await open(`/theme/${THEME}`);
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
    await open(`/theme/${THEME}`);
    press('Revisar agora');
    expect(screen).toHavePathname(`/review/${THEME}`);
    expect(screen.getByText('Revisão de hoje')).toBeOnTheScreen();
    expect(screen.getByText('1 / 2')).toBeOnTheScreen();
  });

  it('Revisão concluída some do dia', async () => {
    seed(glossaryIds.slice(0, 2), 'unknown');
    await open(`/theme/${THEME}`);
    press('Revisar agora');
    answer('Sei');
    answer('Sei');
    press('Voltar ao tema');
    expect(screen.getByText('Nada para revisar hoje.')).toBeOnTheScreen();
  });

  it('Erro na revisão continua no dia', async () => {
    seed(glossaryIds.slice(0, 1), 'unknown');
    await open(`/theme/${THEME}`);
    press('Revisar agora');
    answer('Não sei');
    press('Voltar ao tema');
    expect(screen.getByText('1 card para revisar hoje')).toBeOnTheScreen();
  });
});

describe('Requirement: Zerar progresso de um tema (agendamento)', () => {
  it('Zerar apaga o agendamento do tema', async () => {
    seed(glossaryIds.slice(0, 2), 'unknown');
    await open('/progress');
    press('Zerar progresso');
    press('Zerar');
    fireEvent.press(screen.getByRole('button', { name: /^Temas, tab/ }));
    press(/^O mesmo CRUD em quatro frameworks/);
    expect(screen.getByText('Nada para revisar hoje.')).toBeOnTheScreen();
  });
});
