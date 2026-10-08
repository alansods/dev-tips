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
    expect(headers()).toEqual(expect.arrayContaining(['Banco de dados', 'Relacionais', 'Não relacionais']));
    expect(headers().indexOf('Relacionais')).toBeLessThan(headers().indexOf('Não relacionais'));
    for (const absent of ['Trilhas', 'Linguagens', 'Comparativos']) expect(headers()).not.toContain(absent);
    expect(buttons(TRACKS)).toEqual(TRACKS);
  });

  it('a Home mostra Banco de dados com as 8 trilhas', async () => {
    await open('/');
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

describe('Requirement: Textos da navegação (seções)', () => {
  it('seções em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/area/banco-de-dados');
    expect(headers()).toEqual(expect.arrayContaining(['Relational', 'Non-relational']));
  });
});
