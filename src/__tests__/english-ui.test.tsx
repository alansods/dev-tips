import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import ReviewScreen from '../app/review/[themeId]';
import StudyScreen from '../app/study/[themeId]/[deckId]';
import ThemeScreen from '../app/theme/[themeId]';
import { useSettingsStore } from '../i18n';
import { useStudyStore } from '../study/store';
import { resetStudyStore } from '../study/store';
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
const THEME = 'crud-4-frameworks';
const deckIds = (id: string) => crudTheme.decks.find((d) => d.id === id)!.cards.map((c) => c.id);

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));

beforeEach(() => {
  resetStudyStore();
  useSettingsStore.setState({ language: 'en' });
});

describe('Requirement: Interface traduzida', () => {
  it('Sessão em inglês', async () => {
    await open(`/study/${THEME}/o-que-vamos-criar`);
    expect(screen.getByText('Tap to see the answer')).toBeOnTheScreen();
    press('Show answer');
    expect(screen.getByRole('button', { name: "I didn't know" })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'I knew it' })).toBeOnTheScreen();
  });

  it('Rótulo acessível traduzido', async () => {
    await open(`/study/${THEME}/o-que-vamos-criar`);
    const n = deckIds('o-que-vamos-criar').length;
    for (let i = 0; i < n; i++) {
      press('Show answer');
      press(i < 3 ? 'I knew it' : "I didn't know");
    }
    expect(screen.getByText('Session complete')).toBeOnTheScreen();
    expect(screen.getByLabelText('3 I knew it')).toBeOnTheScreen();
    expect(screen.getByLabelText(`${n - 3} I didn't know`)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Review the ones I missed' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Back to topic' })).toBeOnTheScreen();
  });

  it('tela do tema e revisão em inglês', async () => {
    useStudyStore.getState().answer(THEME, deckIds('glossario')[0], 'unknown');
    await open(`/theme/${THEME}`);
    expect(screen.getByText("Today's review")).toBeOnTheScreen();
    expect(screen.getByText('1 card to review today')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Study O que vamos criar' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /^Continue / })).toBeOnTheScreen();
    press('Review now');
    expect(screen.getAllByText("Today's review").length).toBeGreaterThan(0);
  });

  it('sem revisão: "Nothing to review today."', async () => {
    await open(`/theme/${THEME}`);
    expect(screen.getByText('Nothing to review today.')).toBeOnTheScreen();
  });

  it('aba Progresso em inglês', async () => {
    await open('/progress');
    expect(screen.getAllByRole('button', { name: 'Reset progress' }).length).toBeGreaterThan(0);
    fireEvent.press(screen.getAllByRole('button', { name: 'Reset progress' })[0]);
    expect(screen.getByRole('button', { name: 'Reset' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeOnTheScreen();
    expect(screen.getAllByText('to review').length).toBeGreaterThan(0);
  });

  it('Glossário em inglês', async () => {
    await open('/glossary');
    expect(screen.getByLabelText('Search term')).toBeOnTheScreen();
    expect(screen.getByText('45 terms')).toBeOnTheScreen();
  });

  it('Home em inglês', async () => {
    useStudyStore.getState().answer(THEME, deckIds('glossario')[0], 'unknown');
    await open('/');
    expect(screen.getByText('1 to review today')).toBeOnTheScreen();
  });
});
