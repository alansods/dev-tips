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

const TRACKS = [
  'SQL essencial',
  'Modelagem de dados',
  'Transações e performance',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'NoSQL: modelos e quando usar',
];
const headers = () => screen.getAllByRole('header').map((h) => String(h.props.children));

describe('Requirement: Trilhas de banco de dados no catálogo', () => {
  it('Área Banco de dados', async () => {
    await open('/area/banco-de-dados');
    expect(headers()).toEqual(expect.arrayContaining(['Banco de dados', 'Trilhas']));
    expect(headers()).not.toContain('Linguagens');
    expect(headers()).not.toContain('Comparativos');
    expect(buttons(TRACKS)).toEqual(TRACKS);
  });

  it('a Home mostra Banco de dados por último', async () => {
    await open('/');
    const areas = screen
      .getAllByRole('button')
      .map((b) => String(b.props.accessibilityLabel ?? '').split(',')[0])
      .filter((l) => ['Fundamentos', 'Frontend', 'Backend', 'Banco de dados'].includes(l));
    expect(areas).toEqual(['Fundamentos', 'Frontend', 'Backend', 'Banco de dados']);
    expect(within(screen.getByRole('button', { name: /^Banco de dados,/ })).getByText('8 trilhas')).toBeOnTheScreen();
  });
});

describe('Requirement: Tradução das trilhas de banco de dados', () => {
  it('Área em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/');
    expect(screen.getByRole('button', { name: /^Databases,/ })).toBeOnTheScreen();
  });
});
