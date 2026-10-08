import { act, renderRouter, screen, within } from 'expo-router/testing-library';

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

const headers = () => screen.getAllByRole('header').map((h) => String(h.props.children));
const CI = ['CI/CD essencial', 'GitHub Actions'];
const AWS = ['AWS essencial', 'Deploy na AWS'];

describe('Requirement: Trilhas de DevOps e Cloud no catálogo', () => {
  it('Área DevOps e Cloud', async () => {
    await open('/area/devops');
    expect(headers()).toEqual(expect.arrayContaining(['DevOps e Cloud', 'CI/CD', 'AWS']));
    expect(headers().indexOf('CI/CD')).toBeLessThan(headers().indexOf('AWS'));
    for (const absent of ['Trilhas', 'Linguagens', 'Comparativos']) expect(headers()).not.toContain(absent);
    expect(buttons([...CI, ...AWS])).toEqual([...CI, ...AWS]);
  });
});

describe('Requirement: Home por áreas', () => {
  it('Mobile e DevOps e Cloud no fim', async () => {
    await open('/');
    const names = ['Fundamentos', 'Frontend', 'Backend', 'Banco de dados', 'Mobile', 'DevOps e Cloud'];
    expect(buttons(names)).toEqual(names);
    expect(within(screen.getByRole('button', { name: /^DevOps e Cloud,/ })).getByText('4 trilhas')).toBeOnTheScreen();
  });
});

describe('Requirement: Tradução das trilhas de DevOps e Cloud', () => {
  it('Área em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/area/devops');
    expect(headers()).toEqual(expect.arrayContaining(['DevOps & Cloud', 'CI/CD', 'AWS']));
  });

  it('Área DevOps em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/');
    expect(screen.getByRole('button', { name: /^DevOps & Cloud,/ })).toBeOnTheScreen();
  });
});
