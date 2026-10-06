import { act, renderRouter, screen, within } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
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
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/progress': ProgressScreen,
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

const headers = () => screen.getAllByRole('header').map((h) => String(h.props.children));

describe('Requirement: Trilha de React Native no catálogo', () => {
  it('Área Mobile', async () => {
    await open('/area/mobile');
    expect(headers()).toContain('Linguagens');
    for (const absent of ['Trilhas', 'Comparativos']) expect(headers()).not.toContain(absent);
    expect(buttons(['JavaScript'])).toEqual(['JavaScript']);
    expect(within(screen.getByRole('button', { name: /^JavaScript,/ })).getByText('2 trilhas')).toBeOnTheScreen();
  });

  it('JavaScript no Mobile', async () => {
    await open('/area/mobile/javascript');
    expect(headers()).toContain('Frameworks');
    expect(headers()).not.toContain('Linguagem pura');
    expect(buttons(['React Native', 'React', 'Angular'])).toEqual(['React', 'React Native']);
    expect(within(screen.getByRole('button', { name: /^React,/ })).getByText('1 trilha')).toBeOnTheScreen();
    expect(within(screen.getByRole('button', { name: /^React Native,/ })).getByText('1 trilha')).toBeOnTheScreen();
  });

  it('Framework React Native', async () => {
    await open('/area/mobile/javascript/react-native');
    expect(screen.getByRole('button', { name: /^React Native,/ })).toBeOnTheScreen();
  });

  it('React Native fora do Frontend', async () => {
    await open('/area/frontend/javascript');
    expect(screen.queryByRole('button', { name: /^React Native,/ })).toBeNull();
  });
});

describe('Requirement: Tradução da trilha de React Native', () => {
  it('Área em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/');
    expect(screen.getByRole('button', { name: /^Mobile,/ })).toBeOnTheScreen();
  });
});
