import { act, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
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

const TRACKS = ['React', 'Estado e dados no React', 'Testes no frontend', 'Estilização e design system'];

describe('Requirement: Trilha de estilização e design system no catálogo', () => {
  it('Framework React no Frontend', async () => {
    await open('/area/frontend/javascript/react');
    const list = buttons(TRACKS);
    expect(list.indexOf('Estilização e design system')).toBe(list.indexOf('Testes no frontend') + 1);
  });

  it('Framework React no Mobile', async () => {
    await open('/area/mobile/javascript/react');
    const list = buttons(TRACKS);
    expect(list.indexOf('Estilização e design system')).toBe(list.indexOf('Testes no frontend') + 1);
  });
});

describe('Requirement: Tradução da trilha de estilização e design system', () => {
  it('Trilha em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/area/frontend/javascript/react');
    expect(screen.getByRole('button', { name: /^Styling and design systems,/ })).toBeOnTheScreen();
  });
});
