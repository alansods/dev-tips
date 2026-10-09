import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import HomeScreen from '../app/(tabs)/index';
import ProfileScreen from '../app/(tabs)/profile';
import TracksScreen from '../app/(tabs)/tracks';
import AreaScreen from '../app/area/[areaId]/index';
import ReviewAllScreen from '../app/review/index';
import StudyScreen from '../app/study/[trackId]/[deckId]';
import TrackScreen from '../app/track/[trackId]';
import { useAccountStore } from '../auth/store';
import { getTrack } from '../content/catalog';
import { useSettingsStore } from '../i18n';
import * as clock from '../study/clock';
import { progressKey } from '../study/rules';
import { nextSchedule } from '../study/srs';
import { resetStudyStore, useStudyStore } from '../study/store';

jest.mock('../sync/useSync', () => ({ useSync: () => {} }));

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/tracks': TracksScreen,
  '(tabs)/profile': ProfileScreen,
  'review/index': ReviewAllScreen,
  'study/[trackId]/[deckId]': StudyScreen,
  'track/[trackId]': TrackScreen,
  'area/[areaId]/index': AreaScreen,
};
const TODAY = '2026-10-07';
const CRUD = 'crud-4-frameworks';
const WEB = 'fundamentos-web';

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const cards = (trackId: string) => getTrack(trackId)!.decks.flatMap((d) => d.cards.map((c) => c.id));
const answer = (trackId: string, ids: string[], result: 'known' | 'unknown') =>
  ids.forEach((id) => useStudyStore.getState().answer(trackId, id, result));
const at = (hour: number) => jest.spyOn(clock, 'now').mockReturnValue(new Date(2026, 9, 7, hour, 0));

beforeEach(() => {
  resetStudyStore();
  useSettingsStore.setState({ interests: [] });
  jest.spyOn(clock, 'today').mockReturnValue(TODAY);
  at(20);
});
afterEach(() => jest.restoreAllMocks());

describe('Requirement: Aba Início', () => {
  it('Usuário estudando', async () => {
    answer('react', cards('react').slice(0, 1), 'known');
    await open('/');
    expect(screen.getByText('Bora estudar um pouco?')).toBeOnTheScreen();
    expect(screen.getByText('Nada para revisar hoje')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Continue de onde parou' })).toBeOnTheScreen();
  });

  it('Primeiro acesso no lugar das seções', async () => {
    await open('/');
    expect(screen.getByText('Bem-vindo ao Dev Tips')).toBeOnTheScreen();
    expect(screen.queryByText('Continue de onde parou')).toBeNull();
  });
});

describe('Requirement: Saudação', () => {
  it('Com conta', async () => {
    useAccountStore.setState({ user: { id: 'u1', name: 'Ana Souza', email: 'ana@example.com', photoUrl: null } });
    answer(WEB, ['http'], 'known');
    await open('/');
    expect(screen.getByText('Boa noite, Ana')).toBeOnTheScreen();
  });

  it('Sem conta', async () => {
    at(9);
    answer(WEB, ['http'], 'known');
    await open('/');
    expect(screen.getByText('Bom dia')).toBeOnTheScreen();
  });

  it('Selo de dias seguidos', async () => {
    answer(WEB, ['http'], 'known');
    useStudyStore.setState({ studyDays: ['2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', TODAY] });
    await open('/');
    expect(screen.getByText('5 dias')).toBeOnTheScreen();
    expect(screen.getByLabelText('5 dias seguidos de estudo')).toBeOnTheScreen();
  });
});

describe('Requirement: Revisão de hoje no Início', () => {
  it('Com revisão', async () => {
    answer(CRUD, cards(CRUD).slice(0, 3), 'unknown');
    answer(WEB, cards(WEB).slice(0, 2), 'unknown');
    await open('/');
    expect(screen.getByText('5 cards para revisar')).toBeOnTheScreen();
    expect(screen.getByText('2 trilhas · ~3 min')).toBeOnTheScreen();
  });

  it('Começar revisão', async () => {
    answer(WEB, cards(WEB).slice(0, 2), 'unknown');
    await open('/');
    press('Começar revisão');
    expect(screen).toHavePathname('/review');
    expect(screen.getByText('1 / 2')).toBeOnTheScreen();
  });

  it('Revisão em dia', async () => {
    answer(WEB, ['http'], 'known');
    const schedule = Object.fromEntries(
      cards('react')
        .slice(0, 4)
        .map((id) => [progressKey('react', id), nextSchedule(undefined, 'unknown', '2026-10-08')]),
    );
    useStudyStore.setState((s) => ({ schedule: { ...s.schedule, ...schedule } }));
    await open('/');
    expect(screen.getByText('Nada para revisar hoje')).toBeOnTheScreen();
    expect(screen.getByText('Amanhã: 4 cards')).toBeOnTheScreen();
  });
});

describe('Requirement: Continue de onde parou', () => {
  const deck = getTrack(CRUD)!.decks[2];

  it('Último deck estudado', async () => {
    answer(CRUD, [deck.cards[0].id], 'known');
    await open('/');
    expect(screen.getByText(`deck 3 de 5 · ${deck.title}`)).toBeOnTheScreen();
  });

  it('Continuar o deck', async () => {
    answer(CRUD, [deck.cards[0].id], 'known');
    await open('/');
    press(`Continuar O mesmo CRUD em quatro frameworks, ${deck.title}`);
    expect(screen).toHavePathname(`/study/${CRUD}/${deck.id}`);
  });

  it('Última resposta numa simulação', async () => {
    const sim = getTrack('sim-dashboard-lento')!;
    answer(sim.id, [sim.decks[0].cards[0].id], 'known');
    await open('/');
    expect(screen.getAllByText('Dashboard lento: de 8 s para menos de 2').length).toBeGreaterThan(0);
    expect(screen.getByText('Situação-problema')).toBeOnTheScreen();
    expect(screen.queryByText(/deck 1 de 1/)).toBeNull();
    press('Continuar Dashboard lento: de 8 s para menos de 2, Situação-problema');
    expect(screen).toHavePathname('/study/sim-dashboard-lento/conversa');
  });

  it('Também em andamento', async () => {
    answer(WEB, ['http'], 'known');
    answer(CRUD, [deck.cards[0].id], 'known');
    await open('/');
    expect(screen.getByRole('header', { name: 'Também em andamento' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /^Fundamentos web, \d+%$/ })).toBeOnTheScreen();
  });
});

describe('Requirement: Próximo passo', () => {
  it('Depois de React', async () => {
    answer('react', cards('react').slice(0, 1), 'known');
    await open('/');
    expect(screen.getByRole('header', { name: 'Próximo passo depois de React' })).toBeOnTheScreen();
    press('Estado e dados no React');
    expect(screen).toHavePathname('/track/estado-e-dados-no-react');
  });

  it('Sem próximas trilhas', async () => {
    useSettingsStore.setState({ interests: ['backend'] });
    answer('performance-no-nextjs', cards('performance-no-nextjs').slice(0, 1), 'known');
    await open('/');
    expect(screen.getByRole('header', { name: 'Sugestões para você' })).toBeOnTheScreen();
  });
});

describe('Requirement: Novidades', () => {
  it('Trilha incluída há 3 dias', async () => {
    answer(WEB, ['http'], 'known');
    await open('/');
    expect(screen.getByRole('header', { name: 'Novidades' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Módulos nativos no Expo, Nova' })).toBeOnTheScreen();
    fireEvent.press(screen.getByRole('link', { name: 'Ver todas' }));
    expect(screen).toHavePathname('/tracks');
  });

  it('Trilha antiga', async () => {
    jest.spyOn(clock, 'today').mockReturnValue('2026-11-30');
    answer(WEB, ['http'], 'known');
    await open('/');
    expect(screen.queryByText('Novidades')).toBeNull();
  });

  it('Área nova', async () => {
    jest.spyOn(clock, 'today').mockReturnValue('2026-10-10');
    answer(WEB, ['http'], 'known');
    await open('/');
    expect(screen.getByRole('button', { name: 'Situações-problema, 6 casos, Nova área' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /^Pedido e pagamento em dobro, Nova$/ })).toBeNull();
  });

  it('Abrir a área nova', async () => {
    jest.spyOn(clock, 'today').mockReturnValue('2026-10-10');
    answer(WEB, ['http'], 'known');
    await open('/');
    press('Situações-problema, 6 casos, Nova área');
    expect(screen).toHavePathname('/area/simulacoes');
  });

  it('Em inglês', async () => {
    jest.spyOn(clock, 'today').mockReturnValue('2026-10-10');
    useSettingsStore.setState({ language: 'en' });
    answer(WEB, ['http'], 'known');
    await open('/');
    expect(screen.getByRole('header', { name: "What's new" })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Problem scenarios, 6 cases, New area' })).toBeOnTheScreen();
    useSettingsStore.setState({ language: 'pt-BR' });
  });
});

describe('Requirement: Primeiro acesso', () => {
  it('Sem interesse escolhido', async () => {
    await open('/');
    expect(screen.getByRole('header', { name: 'Comece por aqui' })).toBeOnTheScreen();
    expect(screen.getByText('Fundamentos de programação')).toBeOnTheScreen();
    press('Começar a trilha');
    expect(screen).toHavePathname('/track/fundamentos-de-programacao');
  });

  it('Interesse em Backend', async () => {
    await open('/');
    fireEvent.press(screen.getByRole('checkbox', { name: 'Backend' }));
    expect(screen.getByRole('checkbox', { name: 'Backend' })).toBeChecked();
    expect(useSettingsStore.getState().interests).toEqual(['backend']);
    expect(screen.queryByText('Fundamentos de programação')).toBeNull();
  });
});

describe('Requirement: Primeiro acesso (simulações)', () => {
  it('Sem opção de simulações', async () => {
    await open('/');
    expect(screen.getByRole('checkbox', { name: 'Backend' })).toBeOnTheScreen();
    expect(screen.queryByRole('checkbox', { name: 'Situações-problema' })).toBeNull();
  });
});

describe('Requirement: Áreas de interesse', () => {
  it('Mudar no Perfil', async () => {
    await open('/profile');
    fireEvent.press(screen.getByRole('checkbox', { name: 'Mobile' }));
    expect(useSettingsStore.getState().interests).toEqual(['mobile']);
  });
});
