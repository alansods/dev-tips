import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import TracksScreen from '../app/(tabs)/tracks';
import ProfileScreen from '../app/(tabs)/profile';
import ProgressScreen from '../app/progress';
import StudyScreen from '../app/study/[trackId]/[deckId]';
import TrackScreen from '../app/track/[trackId]';
import { useSettingsStore } from '../i18n';
import { resetStudyStore } from '../study/store';

// Tradução parcial de exemplo para a trilha CRUD (o repositório ainda não tem traduções).
jest.mock('../content/translations', () => ({
  translationRegistry: {
    'crud-4-frameworks': {
      en: {
        title: 'The same CRUD in four frameworks',
        decks: { glossario: { title: 'Glossary' } },
        cards: { cors: { definition: 'A browser rule that blocks requests from other origins.' } },
      },
    },
  },
}));

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/tracks': TracksScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/profile': ProfileScreen,
  progress: ProgressScreen,
  'track/[trackId]': TrackScreen,
  'study/[trackId]/[deckId]': StudyScreen,
};

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}

beforeEach(() => resetStudyStore());

describe('Requirement: Conteúdo no idioma escolhido', () => {
  it('trilha, deck e card traduzidos em inglês; original em PT-BR', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/track/crud-4-frameworks');
    expect(screen.getByRole('header', { name: 'The same CRUD in four frameworks' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Study Glossary' })).toBeOnTheScreen();
    // deck sem tradução fica em PT-BR
    expect(screen.getByRole('button', { name: 'Study O que vamos criar' })).toBeOnTheScreen();
  });

  it('em PT-BR o conteúdo é o original', async () => {
    await open('/track/crud-4-frameworks');
    expect(screen.getByRole('header', { name: 'O mesmo CRUD em quatro frameworks' })).toBeOnTheScreen();
  });
});

describe('Requirement: Busca do glossário no idioma exibido', () => {
  it('Buscar em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/glossary');
    fireEvent.changeText(screen.getByLabelText('Search term'), 'browser');
    const items = screen.getAllByTestId('glossary-item');
    expect(items.map((el) => el.props.accessibilityLabel)).toContain('CORS');
  });
});
