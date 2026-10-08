import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import HomeScreen from '../app/(tabs)/index';
import TracksScreen from '../app/(tabs)/tracks';
import { getTrack } from '../content/catalog';
import { resetStudyStore, useStudyStore } from '../study/store';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/tracks': TracksScreen,
};

async function open() {
  renderRouter(APP, { initialUrl: '/tracks' });
  await act(async () => {});
}
const search = (text: string) => fireEvent.changeText(screen.getByLabelText('Buscar trilha, linguagem ou tema'), text);
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const trackCard = (title: string) => screen.queryByRole('button', { name: new RegExp(`^${title}, \\d+ de`) });
const areaCard = (name: string) => screen.queryByRole('button', { name: new RegExp(`^${name}, \\d+ trilha`) });
const cards = (trackId: string) => getTrack(trackId)!.decks.flatMap((d) => d.cards.map((c) => c.id));

beforeEach(() => resetStudyStore());

describe('Requirement: Busca e filtros na aba Trilhas (na tela)', () => {
  it('sem critério mostra as áreas e as linguagens', async () => {
    await open();
    expect(areaCard('Backend')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Por linguagem' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Python' })).toBeOnTheScreen();
  });

  it('Buscar sem acento', async () => {
    await open();
    search('estilizacao');
    expect(trackCard('Estilização e design system')).toBeOnTheScreen();
    expect(areaCard('Backend')).toBeNull();
  });

  it('Buscar pelo framework', async () => {
    await open();
    search('spring');
    expect(trackCard('Spring Boot')).toBeOnTheScreen();
  });

  it('Sem resultado', async () => {
    await open();
    search('cobol');
    expect(screen.getByText('Nenhuma trilha encontrada.')).toBeOnTheScreen();
  });

  it('Filtro em andamento', async () => {
    useStudyStore.getState().answer('react', cards('react')[0], 'known');
    await open();
    press('Em andamento · 1');
    expect(screen.getByRole('button', { name: 'Em andamento · 1' })).toBeSelected();
    expect(trackCard('React')).toBeOnTheScreen();
    expect(trackCard('Next.js')).toBeNull();
  });

  it('Filtro concluídas', async () => {
    cards('fundamentos-web').forEach((id) => useStudyStore.getState().answer('fundamentos-web', id, 'known'));
    await open();
    press('Concluídas');
    expect(trackCard('Fundamentos de programação e web')).toBeOnTheScreen();
    expect(trackCard('React')).toBeNull();
  });

  it('Filtro por linguagem', async () => {
    await open();
    press('Python');
    for (const title of ['Python essencial', 'FastAPI', 'Django']) expect(trackCard(title)).toBeOnTheScreen();
    expect(trackCard('React')).toBeNull();
  });

  it('Tirar o filtro de linguagem', async () => {
    await open();
    press('Python');
    press('Python');
    expect(areaCard('Backend')).toBeOnTheScreen();
  });

  it('Busca e filtro juntos', async () => {
    await open();
    press('Python');
    search('api');
    expect(trackCard('FastAPI')).toBeOnTheScreen();
    expect(trackCard('Django')).toBeNull();
  });
});

describe('Requirement: Busca e filtros na aba Trilhas (ordem e grupos)', () => {
  const headers = () => screen.getAllByRole('header').map((h) => String(h.props.children));

  it('Áreas antes das linguagens', async () => {
    await open();
    const list = headers();
    expect(list.indexOf('Por área')).toBeGreaterThanOrEqual(0);
    expect(list.indexOf('Por área')).toBeLessThan(list.indexOf('Por linguagem'));
  });

  it('Resultado agrupado por área', async () => {
    await open();
    press('JavaScript');
    const list = headers();
    expect(list.indexOf('Por linguagem')).toBeLessThan(list.indexOf('Frontend'));
    expect(list.filter((h) => ['Frontend', 'Backend', 'Mobile'].includes(h))).toEqual([
      'Frontend',
      'Backend',
      'Mobile',
    ]);
    expect(screen.getAllByRole('button', { name: /^JavaScript essencial, \d+ de/ })).toHaveLength(1);
  });
});
