import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import AreaScreen from '../app/area/[areaId]/index';
import LanguageScreen from '../app/area/[areaId]/[languageId]/index';
import FrameworkScreen from '../app/area/[areaId]/[languageId]/[frameworkId]';
import TrackScreen from '../app/track/[trackId]';

// O repositório ainda não tem trilhas de linguagem nem de framework: este
// teste acrescenta algumas ao catálogo real, usando o cadastro do repositório.
jest.mock('../content/catalog', () => {
  const actual = jest.requireActual('../content/catalog');
  const { trackSchema } = jest.requireActual('../content/schema');
  const { minimalTrack } = jest.requireActual('../content/__fixtures__/tracks');
  const make = (id: string, title: string, extra: object) => trackSchema.parse({ ...minimalTrack(), id, title, ...extra });
  const extra = [
    make('java-puro', 'Java do zero', { areas: ['backend'], language: 'java' }),
    make('spring-di', 'Injeção no Spring', { areas: ['backend'], language: 'java', framework: 'spring' }),
    make('fastapi-basico', 'FastAPI básico', { areas: ['backend'], language: 'python', framework: 'fastapi' }),
  ];
  const catalog = [...actual.catalog, ...extra];
  return {
    ...actual,
    catalog,
    getCatalog: () => catalog,
    getTrack: (id: string) => catalog.find((t: { id: string }) => t.id === id),
  };
});

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
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const headers = () => screen.getAllByRole('header').map((h) => String(h.props.children));

describe('Requirement: Tela da área', () => {
  it('Área com linguagens', async () => {
    await open('/area/backend');
    expect(headers()).toEqual(expect.arrayContaining(['Linguagens', 'Comparativos']));
    expect(within(screen.getByRole('button', { name: /^Java,/ })).getByText('2 trilhas')).toBeOnTheScreen();
    expect(within(screen.getByRole('button', { name: /^Python,/ })).getByText('1 trilha')).toBeOnTheScreen();
  });

  it('tocar na linguagem abre a tela da linguagem', async () => {
    await open('/area/backend');
    press(/^Java,/);
    expect(screen).toHavePathname('/area/backend/java');
  });

  it('Home soma as trilhas de linguagem na área', async () => {
    await open('/');
    expect(within(screen.getByRole('button', { name: /^Backend,/ })).getByText('4 trilhas')).toBeOnTheScreen();
  });
});

describe('Requirement: Tela da linguagem', () => {
  it('Linguagem com as duas seções', async () => {
    await open('/area/backend/java');
    expect(headers()).toEqual(expect.arrayContaining(['Java', 'Linguagem pura', 'Frameworks']));
    expect(screen.getByText('Backend')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /^Java do zero,/ })).toBeOnTheScreen();
    expect(within(screen.getByRole('button', { name: /^Spring Boot,/ })).getByText('1 trilha')).toBeOnTheScreen();
  });

  it('Linguagem só com frameworks', async () => {
    await open('/area/backend/python');
    expect(headers()).not.toContain('Linguagem pura');
    expect(screen.getByRole('button', { name: /^FastAPI,/ })).toBeOnTheScreen();
  });

  it('linguagem sem trilhas na área', async () => {
    await open('/area/backend/typescript');
    expect(screen.getByText('Linguagem não encontrada.')).toBeOnTheScreen();
  });

  it('tocar no framework abre a tela do framework', async () => {
    await open('/area/backend/java');
    press(/^Spring Boot,/);
    expect(screen).toHavePathname('/area/backend/java/spring');
  });
});

describe('Requirement: Tela do framework', () => {
  it('Trilhas do framework', async () => {
    await open('/area/backend/java/spring');
    expect(headers()).toContain('Spring Boot');
    expect(screen.getByText('Backend › Java')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /^Injeção no Spring,/ })).toBeOnTheScreen();
    expect(screen.queryByText('Java do zero')).toBeNull();
  });

  it('framework sem trilhas na área', async () => {
    await open('/area/backend/java/nest');
    expect(screen.getByText('Framework não encontrado.')).toBeOnTheScreen();
  });

  it('abrir a trilha pelo framework', async () => {
    await open('/area/backend/java/spring');
    press(/^Injeção no Spring,/);
    expect(screen).toHavePathname('/track/spring-di');
  });
});
