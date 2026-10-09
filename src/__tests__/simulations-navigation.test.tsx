import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import HomeScreen from '../app/(tabs)/index';
import TracksScreen from '../app/(tabs)/tracks';
import AreaScreen from '../app/area/[areaId]/index';
import TrackScreen from '../app/track/[trackId]';
import { useSettingsStore } from '../i18n';
import { resetStudyStore, useStudyStore } from '../study/store';
import { getTrack } from '../content/catalog';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/tracks': TracksScreen,
  'area/[areaId]/index': AreaScreen,
  'track/[trackId]': TrackScreen,
};

const SIM_TITLES = [
  'Dashboard lento: de 8 s para menos de 2',
  'Pedido e pagamento em dobro',
  'Projetos, membros e permissões',
  'Processamento de arquivos em segundo plano',
  'Resumos de PDF com IA',
  'API de notificações',
];

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const search = (text: string) => fireEvent.changeText(screen.getByLabelText('Buscar trilha, linguagem ou tema'), text);
const trackCard = (title: string) => screen.queryByRole('button', { name: new RegExp(`^${title}, \\d+ de`) });
const areaNames = () =>
  screen
    .getAllByRole('button')
    .map((b) => String(b.props.accessibilityLabel ?? ''))
    .filter((label) => / cards que você sabe$/.test(label))
    .map((label) => label.split(',')[0]);

beforeEach(() => resetStudyStore());
afterEach(() => useSettingsStore.setState({ language: 'pt-BR' }));

describe('Requirement: Home por áreas (Situações-problema)', () => {
  it('Situações-problema por último', async () => {
    await open('/tracks');
    expect(areaNames().at(-1)).toBe('Situações-problema');
    expect(areaNames().at(-2)).toBe('DevOps e Cloud');
    expect(screen.getByRole('button', { name: /^Situações-problema, 6 casos, 0 de 25 / })).toBeOnTheScreen();
  });

  it('Progresso das simulações', async () => {
    const sim = getTrack('sim-dashboard-lento')!;
    for (const card of sim.decks[0].cards.slice(0, 3)) useStudyStore.getState().answer(sim.id, card.id, 'known');
    await open('/tracks');
    expect(screen.getByRole('button', { name: /^Situações-problema, 6 casos, 3 de 25 / })).toBeOnTheScreen();
  });
});

describe('Requirement: Tela da área (Situações-problema)', () => {
  it('Área Situações-problema', async () => {
    await open('/area/simulacoes');
    expect(screen.getAllByText('Situações-problema')).toHaveLength(1);
    expect(
      screen.getByText(
        'O entrevistador apresenta um problema e aprofunda a cada pergunta. Responda em voz alta, como na entrevista.',
      ),
    ).toBeOnTheScreen();
    expect(screen.queryByText('Ordem sugerida')).toBeNull();
    expect(screen.queryByText('Trilhas')).toBeNull();
    for (const title of SIM_TITLES) expect(trackCard(title)).toBeOnTheScreen();
  });

  it('Abrir uma simulação', async () => {
    await open('/area/simulacoes');
    fireEvent.press(trackCard('Pedido e pagamento em dobro')!);
    expect(screen).toHavePathname('/track/sim-pedidos-duplicados');
  });
});

describe('Requirement: Simulações na busca', () => {
  it('Buscar uma simulação', async () => {
    await open('/tracks');
    search('notificacoes');
    expect(screen.getByRole('header', { name: 'Situações-problema' })).toBeOnTheScreen();
    expect(trackCard('API de notificações')).toBeOnTheScreen();
  });

  it('Filtro de linguagem', async () => {
    await open('/tracks');
    press('JavaScript');
    for (const title of SIM_TITLES) expect(trackCard(title)).toBeNull();
  });
});

describe('Requirement: Textos da navegação (Situações-problema)', () => {
  it('Área Situações-problema em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/tracks');
    expect(screen.getByRole('button', { name: /^Problem scenarios, 6 cases, / })).toBeOnTheScreen();
  });
});
