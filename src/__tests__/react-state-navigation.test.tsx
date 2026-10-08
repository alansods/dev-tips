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

const TRACKS = ['React', 'Estado e dados no React'];

describe('Requirement: Trilha de estado e dados no catálogo', () => {
  it('Framework React no Frontend', async () => {
    await open('/area/frontend/javascript/react');
    const list = buttons(TRACKS);
    expect(list.indexOf('Estado e dados no React')).toBe(list.indexOf('React') + 1);
  });

  it('Framework React no Mobile', async () => {
    await open('/area/mobile/javascript/react');
    const list = buttons(TRACKS);
    expect(list[0]).toBe('Estado e dados no React');
    expect(list).not.toContain('React');
  });
});

describe('Requirement: Tradução da trilha de estado e dados', () => {
  it('Trilha em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/area/frontend/javascript/react');
    expect(screen.getByRole('button', { name: /^State and data in React,/ })).toBeOnTheScreen();
  });
});
