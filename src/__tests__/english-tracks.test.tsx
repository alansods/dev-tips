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
import { useSettingsStore } from '../i18n';
import { resetStudyStore } from '../study/store';

// Traduções reais de content/tracks/*/translations/en.json (sem mock).
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

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));

beforeEach(() => resetStudyStore());

describe('Requirement: Tradução completa para inglês', () => {
  beforeEach(() => useSettingsStore.setState({ language: 'en' }));

  it('trilha CRUD em inglês na área Backend', async () => {
    await open('/area/backend');
    expect(screen.getAllByText('The same CRUD in four frameworks').length).toBeGreaterThan(0);
  });

  it('trilha Fundamentos web em inglês na área Fundamentos', async () => {
    await open('/area/fundamentos');
    expect(screen.getAllByText('Web fundamentals').length).toBeGreaterThan(0);
  });

  it('Card exibido em inglês: concept CORS', async () => {
    await open('/glossary');
    fireEvent.press(screen.getByRole('button', { name: 'CORS' }));
    expect(within(screen.getByTestId('term-sheet')).getByText(/A browser security rule/)).toBeOnTheScreen();
  });

  it('Card exibido em inglês: passo step-01', async () => {
    await open('/study/crud-4-frameworks/passo-a-passo');
    expect(screen.getByText('Create the project')).toBeOnTheScreen();
    expect(screen.getByText('Create the project folder with the initial structure.')).toBeOnTheScreen();
    press('Show answer');
    expect(screen.getByText(/No generator\. You start with an empty folder/)).toBeOnTheScreen();
  });

  it('Card exibido em inglês: concept Cookie e uma pergunta de entrevista', async () => {
    await open('/track/fundamentos-web');
    expect(screen.getByRole('button', { name: 'Study Interview questions' })).toBeOnTheScreen();
    await open('/glossary');
    fireEvent.changeText(screen.getByLabelText('Search term'), 'Set-Cookie');
    fireEvent.press(screen.getByRole('button', { name: 'Cookie' }));
    expect(
      within(screen.getByTestId('term-sheet')).getByText(/A small piece of data the server stores/),
    ).toBeOnTheScreen();
    await open('/study/fundamentos-web/perguntas-de-entrevista');
    expect(screen.getByText('What happens when you type a URL and press Enter?')).toBeOnTheScreen();
  });
});

describe('Requirement: Tradução completa para inglês (PT-BR intacto)', () => {
  it('PT-BR intacto', async () => {
    await open('/track/crud-4-frameworks');
    expect(screen.getByRole('header', { name: 'O mesmo CRUD em quatro frameworks' })).toBeOnTheScreen();
    await open('/study/crud-4-frameworks/passo-a-passo');
    expect(screen.getByText('Criar o projeto')).toBeOnTheScreen();
  });
});
