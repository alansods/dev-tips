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

const CORE = [
  'JavaScript essencial',
  'JavaScript assíncrono',
  'JavaScript no navegador',
  'Node.js',
  'TypeScript essencial',
  'TypeScript avançado',
];
const FRAMEWORKS = ['React', 'Vue', 'Next.js', 'Express', 'Angular', 'NestJS'];

describe('Requirement: Trilhas de JavaScript no catálogo', () => {
  it('JavaScript no Frontend', async () => {
    await open('/area/frontend/javascript');
    expect(buttons(CORE)).toEqual([
      'JavaScript essencial',
      'JavaScript assíncrono',
      'JavaScript no navegador',
      'TypeScript essencial',
      'TypeScript avançado',
    ]);
    expect(buttons(FRAMEWORKS)).toEqual(['React', 'Vue', 'Next.js', 'Angular']);
    expect(within(screen.getByRole('button', { name: /^React,/ })).getByText('4 trilhas')).toBeOnTheScreen();
    expect(within(screen.getByRole('button', { name: /^Vue,/ })).getByText('1 trilha')).toBeOnTheScreen();
    expect(within(screen.getByRole('button', { name: /^Next\.js,/ })).getByText('2 trilhas')).toBeOnTheScreen();
  });

  it('JavaScript no Backend', async () => {
    await open('/area/backend/javascript');
    expect(buttons(CORE)).toEqual([
      'JavaScript essencial',
      'JavaScript assíncrono',
      'Node.js',
      'TypeScript essencial',
      'TypeScript avançado',
    ]);
    expect(buttons(FRAMEWORKS)).toEqual(['Express', 'NestJS']);
  });

  it('Contagem na tela da área', async () => {
    await open('/area/frontend');
    expect(within(screen.getByRole('button', { name: /^JavaScript,/ })).getByText('14 trilhas')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /^TypeScript,/ })).toBeNull();
  });

  it('Frontend aparece na Home', async () => {
    await open('/');
    expect(screen.getByRole('button', { name: /^Frontend,/ })).toBeOnTheScreen();
  });
});

describe('Requirement: Tradução das trilhas de JavaScript', () => {
  it('Trilha em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/area/frontend/javascript');
    expect(screen.getByRole('button', { name: /^JavaScript essentials,/ })).toBeOnTheScreen();
  });
});
