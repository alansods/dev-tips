import { act, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import TracksScreen from '../app/(tabs)/tracks';
import ProfileScreen from '../app/(tabs)/profile';
import ProgressScreen from '../app/progress';
import AreaScreen from '../app/area/[areaId]/index';
import LanguageScreen from '../app/area/[areaId]/[languageId]/index';
import FrameworkScreen from '../app/area/[areaId]/[languageId]/[frameworkId]';
import TrackScreen from '../app/track/[trackId]';
import { useSettingsStore } from '../i18n';
import { resetStudyStore } from '../study/store';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/tracks': TracksScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/profile': ProfileScreen,
  progress: ProgressScreen,
  'area/[areaId]/index': AreaScreen,
  'area/[areaId]/[languageId]/index': LanguageScreen,
  'area/[areaId]/[languageId]/[frameworkId]': FrameworkScreen,
  'track/[trackId]': TrackScreen,
};

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
/** Nomes dos botões cujo rótulo começa por um dos nomes dados, na ordem da tela. */
const buttons = (names: string[]) =>
  screen
    .getAllByRole('button')
    .map((b) => String(b.props.accessibilityLabel ?? ''))
    .map((label) => names.find((name) => label.startsWith(`${name},`)))
    .filter((name): name is string => name !== undefined);

beforeEach(() => resetStudyStore());

const TRACKS = ['Fundamentos web', 'Git e colaboração'];

describe('Requirement: Trilha de Git no catálogo', () => {
  it('Área Fundamentos', async () => {
    await open('/area/fundamentos');
    expect(screen.getAllByRole('header').map((h) => String(h.props.children))).toContain('Trilhas');
    expect(buttons(TRACKS)).toEqual(['Fundamentos web', 'Git e colaboração']);
  });

  it('Só em Fundamentos', async () => {
    await open('/area/devops');
    expect(buttons(TRACKS)).toEqual([]);
  });
});

describe('Requirement: Tradução da trilha de Git', () => {
  it('Trilha em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/area/fundamentos');
    expect(screen.getByRole('button', { name: /^Git and collaboration,/ })).toBeOnTheScreen();
  });
});
