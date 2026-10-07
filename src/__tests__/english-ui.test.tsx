import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProfileScreen from '../app/(tabs)/profile';
import ProgressScreen from '../app/progress';
import ReviewScreen from '../app/review/[trackId]';
import StudyScreen from '../app/study/[trackId]/[deckId]';
import TrackScreen from '../app/track/[trackId]';
import { useSettingsStore } from '../i18n';
import { resetStudyStore, useStudyStore } from '../study/store';
import { crudTrack } from '../test-utils';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/profile': ProfileScreen,
  progress: ProgressScreen,
  'track/[trackId]': TrackScreen,
  'study/[trackId]/[deckId]': StudyScreen,
  'review/[trackId]': ReviewScreen,
};
const TRACK = 'crud-4-frameworks';
const deckIds = (id: string) => crudTrack.decks.find((d) => d.id === id)!.cards.map((c) => c.id);

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
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    expect(screen.getByText('Tap to see the answer')).toBeOnTheScreen();
    press('Show answer');
    expect(screen.getByRole('button', { name: "I didn't know" })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'I knew it' })).toBeOnTheScreen();
  });

  it('Rótulo acessível traduzido', async () => {
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    const n = deckIds('o-que-vamos-criar').length;
    for (let i = 0; i < n; i++) {
      press('Show answer');
      press(i < 3 ? 'I knew it' : "I didn't know");
    }
    expect(screen.getByText('Session complete')).toBeOnTheScreen();
    expect(screen.getByLabelText('3 I knew it')).toBeOnTheScreen();
    expect(screen.getByLabelText(`${n - 3} I didn't know`)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Review the ones I missed' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Back to track' })).toBeOnTheScreen();
  });

  it('tela da trilha e revisão em inglês', async () => {
    useStudyStore.getState().answer(TRACK, deckIds('glossario')[0], 'unknown');
    await open(`/track/${TRACK}`);
    expect(screen.getByText("Today's review")).toBeOnTheScreen();
    expect(screen.getByText('1 card to review today')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: "Study What we'll build" })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /^Continue / })).toBeOnTheScreen();
    press('Review now');
    expect(screen.getAllByText("Today's review").length).toBeGreaterThan(0);
  });

  it('sem revisão: "Nothing to review today."', async () => {
    await open(`/track/${TRACK}`);
    expect(screen.getByText('Nothing to review today.')).toBeOnTheScreen();
  });

  it('aba Progresso em inglês', async () => {
    await open('/progress');
    fireEvent.press(screen.getByTestId(`track-progress-header-${TRACK}`));
    expect(screen.getAllByRole('button', { name: 'Reset progress' }).length).toBeGreaterThan(0);
    fireEvent.press(screen.getAllByRole('button', { name: 'Reset progress' })[0]);
    expect(screen.getByRole('button', { name: 'Reset' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeOnTheScreen();
    expect(screen.getAllByText('to review').length).toBeGreaterThan(0);
  });

  it('Glossário em inglês', async () => {
    await open('/glossary');
    expect(screen.getByLabelText('Search term')).toBeOnTheScreen();
    expect(screen.getByText(/^\d+ terms$/)).toBeOnTheScreen();
  });

  it('Home em inglês', async () => {
    useStudyStore.getState().answer(TRACK, deckIds('glossario')[0], 'unknown');
    await open('/');
    expect(screen.getByText('1 to review today')).toBeOnTheScreen();
  });
});
