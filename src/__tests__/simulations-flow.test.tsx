import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import HomeScreen from '../app/(tabs)/index';
import TracksScreen from '../app/(tabs)/tracks';
import AreaScreen from '../app/area/[areaId]/index';
import StudyScreen from '../app/study/[trackId]/[deckId]';
import TrackScreen from '../app/track/[trackId]';
import { getTrack } from '../content/catalog';
import { useSettingsStore } from '../i18n';
import { ptBR } from '../i18n/pt-BR';
import { resetStudyStore, useStudyStore } from '../study/store';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/tracks': TracksScreen,
  'area/[areaId]/index': AreaScreen,
  'track/[trackId]': TrackScreen,
  'study/[trackId]/[deckId]': StudyScreen,
};

const SIM = 'sim-pedidos-duplicados';
const sim = getTrack(SIM)!;
const cardIds = sim.decks[0].cards.map((c) => c.id);

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const seed = (ids: string[], result: 'known' | 'unknown') =>
  ids.forEach((id) => useStudyStore.getState().answer(SIM, id, result));
function answer(result: 'Já sabia' | 'Não sabia') {
  press('Mostrar resposta');
  press(result);
}

beforeEach(() => resetStudyStore());
afterEach(() => useSettingsStore.setState({ language: 'pt-BR' }));

describe('Requirement: Tela da simulação', () => {
  it('Abrir a simulação', async () => {
    await open(`/track/${SIM}`);
    expect(screen.getByText('Pedido e pagamento em dobro')).toBeOnTheScreen();
    expect(screen.getByText('Situação-problema')).toBeOnTheScreen();
    expect(screen.getByText('Contexto')).toBeOnTheScreen();
    expect(screen.getByText(sim.scenario!.context)).toBeOnTheScreen();
    for (const item of sim.scenario!.stack) expect(screen.getByText(item)).toBeOnTheScreen();
    expect(screen.getByText('4 perguntas')).toBeOnTheScreen();
    expect(screen.getByText('0/4')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Começar conversa' })).toBeOnTheScreen();
    expect(screen.queryByText(ptBR.track.decks)).toBeNull();
    expect(screen.queryByText('Conversa')).toBeNull();
  });

  it('Começar conversa', async () => {
    await open(`/track/${SIM}`);
    press('Começar conversa');
    expect(screen).toHavePathname(`/study/${SIM}/conversa`);
    expect(screen.getByText('1 / 4')).toBeOnTheScreen();
    expect(screen.getByText('Pedido e pagamento em dobro')).toBeOnTheScreen();
  });

  it('Continuar a simulação', async () => {
    seed([cardIds[0]], 'known');
    seed([cardIds[1]], 'unknown');
    await open(`/track/${SIM}`);
    expect(screen.getByText('1/4')).toBeOnTheScreen();
    press('Continuar');
    expect(screen.getByText('1 / 3')).toBeOnTheScreen();
  });

  it('Simulação dominada', async () => {
    seed(cardIds, 'known');
    await open(`/track/${SIM}`);
    press('Praticar de novo');
    expect(screen.getByText('1 / 4')).toBeOnTheScreen();
  });

  it('Voltar ao caso', async () => {
    await open(`/track/${SIM}`);
    press('Começar conversa');
    for (let i = 0; i < 4; i++) answer('Já sabia');
    expect(screen.getByText('Sessão concluída')).toBeOnTheScreen();
    press('Voltar ao caso');
    expect(screen).toHavePathname(`/track/${SIM}`);
    expect(screen.getByText('4/4')).toBeOnTheScreen();
  });

  it('Simulação em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open(`/track/${SIM}`);
    expect(screen.getByText('Problem scenario')).toBeOnTheScreen();
    expect(screen.getByText('Context')).toBeOnTheScreen();
    expect(screen.getByText('Double order, double charge')).toBeOnTheScreen();
    expect(screen.getByText('4 questions')).toBeOnTheScreen();
    expect(screen.getByText('Payment provider')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Start conversation' })).toBeOnTheScreen();
  });
});
