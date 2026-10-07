import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';

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
import * as clock from '../study/clock';
import { resetStudyStore, useStudyStore } from '../study/store';
import { crudTrack, webTrack } from '../test-utils';

// Os cenários descrevem o catálogo com as duas trilhas originais (CRUD e
// Fundamentos web); as trilhas de linguagem têm testes próprios.
jest.mock('../content/catalog', () => jest.requireActual('../test-catalog').originalCatalogMock());

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

const total = (track: typeof crudTrack) => track.decks.reduce((n, d) => n + d.cards.length, 0);
const glossaryIds = crudTrack.decks.find((d) => d.id === 'glossario')!.cards.map((c) => c.id);

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const headers = () => screen.getAllByRole('header').map((h) => String(h.props.children));

beforeEach(() => {
  jest.spyOn(clock, 'today').mockReturnValue('2026-10-02');
  resetStudyStore();
});
afterEach(() => jest.restoreAllMocks());

describe('Requirement: Home por áreas', () => {
  it('Áreas com o conteúdo atual', async () => {
    await open('/');
    const areas = screen
      .getAllByRole('button')
      .map((b) => String(b.props.accessibilityLabel ?? ''))
      .filter((l) => /^(Fundamentos|Frontend|Backend),/.test(l))
      .map((l) => l.split(',')[0]);
    expect(areas).toEqual(['Fundamentos', 'Backend']);
    expect(screen.queryByText('Frontend')).toBeNull();
    expect(screen.queryByText('O mesmo CRUD em quatro frameworks')).toBeNull();
  });

  it('Progresso somado da área', async () => {
    await open('/');
    const backend = within(screen.getByRole('button', { name: /^Backend,/ }));
    expect(backend.getByText(`0/${total(crudTrack)}`)).toBeOnTheScreen();
    expect(backend.getByText('1 trilha')).toBeOnTheScreen();
    const fundamentos = within(screen.getByRole('button', { name: /^Fundamentos,/ }));
    expect(fundamentos.getByText(`0/${total(webTrack)}`)).toBeOnTheScreen();
  });

  it('Tocar na área', async () => {
    await open('/');
    press(/^Backend,/);
    expect(screen).toHavePathname('/area/backend');
  });
});

describe('Requirement: Revisão na Home', () => {
  it('Aviso na Home', async () => {
    glossaryIds.slice(0, 2).forEach((id) => useStudyStore.getState().answer(crudTrack.id, id, 'unknown'));
    await open('/');
    expect(
      within(screen.getByRole('button', { name: /^Backend,/ })).getByText('2 para revisar hoje'),
    ).toBeOnTheScreen();
  });

  it('Aviso no card da trilha', async () => {
    glossaryIds.slice(0, 2).forEach((id) => useStudyStore.getState().answer(crudTrack.id, id, 'unknown'));
    await open('/area/backend');
    const card = within(screen.getByRole('button', { name: /^O mesmo CRUD em quatro frameworks,/ }));
    expect(card.getByText('2 para revisar hoje')).toBeOnTheScreen();
  });

  it('Sem revisão', async () => {
    await open('/');
    expect(screen.queryByText(/para revisar hoje/)).toBeNull();
  });
});

describe('Requirement: Tela da área', () => {
  it('Backend com o conteúdo atual', async () => {
    await open('/area/backend');
    expect(headers()).toEqual(['Backend', 'Ordem sugerida', 'Comparativos']);
    expect(headers()).not.toContain('Trilhas');
    expect(headers()).not.toContain('Linguagens');
    expect(screen.getAllByText('O mesmo CRUD em quatro frameworks').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /^Trilhas, tab/ })).toBeNull(); // tela cheia, sem abas
  });

  it('Fundamentos com o conteúdo atual', async () => {
    await open('/area/fundamentos');
    expect(headers()).toEqual(['Fundamentos', 'Ordem sugerida', 'Trilhas']);
    expect(headers()).not.toContain('Comparativos');
    expect(screen.getAllByText('Fundamentos web').length).toBeGreaterThan(0);
  });

  it('Abrir trilha pela área', async () => {
    await open('/area/backend');
    press(/^O mesmo CRUD em quatro frameworks,/);
    expect(screen).toHavePathname(`/track/${crudTrack.id}`);
  });

  it('Área não encontrada', async () => {
    await open('/area/games');
    expect(screen.getByText('Área não encontrada.')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeOnTheScreen();
  });

  it('área sem trilhas também não é encontrada', async () => {
    await open('/area/frontend');
    expect(screen.getByText('Área não encontrada.')).toBeOnTheScreen();
  });
});

describe('Requirement: Tela da trilha', () => {
  it('Abrir a trilha', async () => {
    await open('/');
    press(/^Backend,/);
    press(/^O mesmo CRUD em quatro frameworks,/);
    for (const name of ['Express', 'Spring Boot', 'NestJS', 'FastAPI'])
      expect(screen.getByText(name)).toBeOnTheScreen();
  });

  it('Voltar para as trilhas', async () => {
    await open('/');
    press(/^Backend,/);
    press(/^O mesmo CRUD em quatro frameworks,/);
    press('Voltar');
    expect(screen).toHavePathname('/area/backend');
    press('Voltar');
    expect(screen).toHavePathname('/');
  });
});

describe('Requirement: Identidade, variantes e colunas da trilha', () => {
  it('Comparativa em Backend', async () => {
    await open('/area/backend');
    expect(headers()).toContain('Comparativos');
    expect(screen.getAllByText('O mesmo CRUD em quatro frameworks').length).toBeGreaterThan(0);
  });
});

describe('Requirement: Identidade da trilha', () => {
  it('Trilha na área Fundamentos', async () => {
    await open('/area/fundamentos');
    expect(headers()).toContain('Trilhas');
    expect(screen.getByRole('button', { name: /^Fundamentos web,/ })).toBeOnTheScreen();
  });
});

describe('Requirement: Textos da navegação', () => {
  beforeEach(() => useSettingsStore.setState({ language: 'en' }));

  it('Home em inglês', async () => {
    await open('/');
    expect(screen.getByRole('button', { name: /^Fundamentals,/ })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /^Backend,/ })).toBeOnTheScreen();
    expect(within(screen.getByRole('button', { name: /^Backend,/ })).getByText('1 track')).toBeOnTheScreen();
  });

  it('Seção em inglês', async () => {
    await open('/area/backend');
    expect(headers()).toContain('Comparisons');
  });

  it('não encontrado em inglês', async () => {
    await open('/area/games');
    expect(screen.getByText('Area not found.')).toBeOnTheScreen();
  });
});
