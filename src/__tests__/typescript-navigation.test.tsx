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
    .map((b) => String(b.props.accessibilityLabel ?? '').split(',')[0])
    .filter((label) => names.includes(label));

beforeEach(() => resetStudyStore());

const CORE = ['TypeScript essencial', 'TypeScript avançado'];
const FRAMEWORKS = ['Angular', 'NestJS'];

describe('Requirement: Trilhas de TypeScript no catálogo', () => {
  it('TypeScript no Frontend', async () => {
    await open('/area/frontend/typescript');
    expect(buttons(CORE)).toEqual(CORE);
    expect(buttons(FRAMEWORKS)).toEqual(['Angular']);
    expect(within(screen.getByRole('button', { name: /^Angular,/ })).getByText('1 trilha')).toBeOnTheScreen();
  });

  it('TypeScript no Backend', async () => {
    await open('/area/backend/typescript');
    expect(buttons(CORE)).toEqual(CORE);
    expect(buttons(FRAMEWORKS)).toEqual(['NestJS']);
  });
});

describe('Requirement: Tradução das trilhas de TypeScript', () => {
  it('Trilha em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/area/frontend/typescript');
    expect(screen.getByRole('button', { name: /^TypeScript essentials,/ })).toBeOnTheScreen();
  });
});
