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

const CORE = [
  'JavaScript essencial',
  'JavaScript assíncrono',
  'JavaScript no navegador',
  'Node.js',
  'TypeScript essencial',
  'TypeScript avançado',
  'Build e bundlers',
];

describe('Requirement: Trilha de build e bundlers no catálogo', () => {
  it('Linguagem pura no Frontend', async () => {
    await open('/area/frontend/javascript');
    const list = buttons(CORE);
    expect(list.indexOf('Build e bundlers')).toBe(list.indexOf('TypeScript avançado') + 1);
  });

  it('Linguagem pura no Mobile', async () => {
    await open('/area/mobile/javascript');
    expect(screen.getAllByRole('header').map((h) => String(h.props.children))).toContain('Linguagem pura');
    expect(buttons(CORE)).toEqual(['Build e bundlers']);
  });

  it('Fora do Backend', async () => {
    await open('/area/backend/javascript');
    expect(buttons(CORE)).not.toContain('Build e bundlers');
  });
});

describe('Requirement: Tradução da trilha de build e bundlers', () => {
  it('Trilha em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/area/frontend/javascript');
    expect(screen.getByRole('button', { name: /^Build tools and bundlers,/ })).toBeOnTheScreen();
  });
});
