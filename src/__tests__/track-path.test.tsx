import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import HomeScreen from '../app/(tabs)/index';
import TracksScreen from '../app/(tabs)/tracks';
import AreaScreen from '../app/area/[areaId]/index';
import TrackScreen from '../app/track/[trackId]';
import { getTrack } from '../content/catalog';
import * as clock from '../study/clock';
import { resetStudyStore, useStudyStore } from '../study/store';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/tracks': TracksScreen,
  'area/[areaId]/index': AreaScreen,
  'track/[trackId]': TrackScreen,
};

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const cardIds = (trackId: string) => getTrack(trackId)!.decks.flatMap((d) => d.cards.map((c) => c.id));
const answer = (trackId: string, ids: string[], result: 'known' | 'unknown') =>
  ids.forEach((id) => useStudyStore.getState().answer(trackId, id, result));
/** Linhas da "Ordem sugerida", na ordem exibida (ids das trilhas). */
const pathOrder = () =>
  screen.getAllByTestId(/^path-row-/).map((el) => String(el.props.testID).replace('path-row-', ''));

beforeEach(() => {
  resetStudyStore();
  jest.spyOn(clock, 'today').mockReturnValue('2026-10-07');
});
afterEach(() => jest.restoreAllMocks());

describe('Requirement: Ordem sugerida na área (na tela)', () => {
  it('a seção aparece no topo da área', async () => {
    await open('/area/frontend');
    const headers = screen.getAllByRole('header').map((h) => String(h.props.children));
    expect(headers.slice(0, 2)).toEqual(['Frontend', 'Ordem sugerida']);
  });

  it('respeita os pré-requisitos do catálogo', async () => {
    await open('/area/frontend');
    const order = pathOrder();
    const before = (a: string, b: string) => expect(order.indexOf(a)).toBeLessThan(order.indexOf(b));
    before('javascript-essencial', 'javascript-no-navegador');
    before('javascript-no-navegador', 'react');
    before('react', 'nextjs');
    before('nextjs', 'performance-no-nextjs');
    expect(new Set(order).size).toBe(order.length);
  });

  it('Estados', async () => {
    answer('fundamentos-de-programacao', cardIds('fundamentos-de-programacao'), 'known');
    answer('fundamentos-web', ['http'], 'known');
    await open('/area/fundamentos');
    expect(screen.getByRole('button', { name: '1. Fundamentos de programação, Concluída' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: '2. Fundamentos web, Em andamento' })).toBeOnTheScreen();
  });

  it('Revisão pendente', async () => {
    answer('crud-4-frameworks', cardIds('crud-4-frameworks').slice(0, 2), 'unknown');
    await open('/area/backend');
    expect(within(screen.getByTestId('path-row-crud-4-frameworks')).getByText('2 para revisar')).toBeOnTheScreen();
  });

  it('Abrir pela ordem sugerida', async () => {
    await open('/area/fundamentos');
    fireEvent.press(screen.getByRole('button', { name: '1. Fundamentos de programação, Não iniciada' }));
    expect(screen).toHavePathname('/track/fundamentos-de-programacao');
  });
});
