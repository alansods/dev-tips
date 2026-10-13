import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import TracksScreen from '../app/(tabs)/tracks';
import ProfileScreen from '../app/(tabs)/profile';
import ProgressScreen from '../app/progress';
import StudyScreen from '../app/study/[trackId]/[deckId]';
import TrackScreen from '../app/track/[trackId]';
import { resetStudyStore, useStudyStore } from '../study/store';
import { crudTrack, showAllGlossaryItems } from '../test-utils';

// Os cenários do glossário descrevem o catálogo com as trilhas CRUD e Fundamentos web.
jest.mock('../content/catalog', () => jest.requireActual('../test-catalog').originalCatalogMock());
const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/tracks': TracksScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/profile': ProfileScreen,
  progress: ProgressScreen,
  'track/[trackId]': TrackScreen,
  'study/[trackId]/[deckId]': StudyScreen,
};
const TRACK = crudTrack.id;

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const sheet = () => within(screen.getByTestId('term-sheet'));
const search = (text: string) => fireEvent.changeText(screen.getByLabelText('Buscar termo'), text);
/** Termos listados na aba, na ordem. */
const listed = () => screen.getAllByTestId('glossary-item').map((el) => el.props.accessibilityLabel as string);

beforeEach(() => resetStudyStore());

describe('Requirement: Gaveta de definição (na sessão)', () => {
  it('Fechar sem perder a sessão', async () => {
    await open(`/study/${TRACK}/passo-a-passo`);
    // avança até o Passo 13 (os complementos ficam entre os passos)
    while (!screen.queryByText('Passo 13')) {
      press('Mostrar resposta');
      press('Já sabia');
    }
    press('Mostrar resposta');
    fireEvent.press(screen.getByRole('button', { name: 'CORS' }));
    expect(sheet().getByText(/Regra de segurança do navegador/)).toBeOnTheScreen();
    fireEvent.press(sheet().getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByTestId('term-sheet')).toBeNull();
    expect(screen.getByText('Liberar o frontend (CORS)')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Não sabia' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Já sabia' })).toBeOnTheScreen();
  });
});

describe('Requirement: Aba Glossário', () => {
  it('Lista completa', async () => {
    await open('/glossary');
    showAllGlossaryItems();
    expect(listed()).toHaveLength(45);
    expect(listed().slice(0, 3)).toEqual(['API', 'Cabeçalho (header)', 'Cache HTTP']);
    expect(listed().at(-1)).toBe('XSS (Cross-Site Scripting)');
    expect(screen.getByText('45 termos')).toBeOnTheScreen();
    expect(screen.queryByText(/em construção/i)).toBeNull();
  });

  it('Cabeçalhos de letra', async () => {
    await open('/glossary');
    showAllGlossaryItems();
    const rows = screen
      .getAllByTestId(/^glossary-(letter|item)$/)
      .map((el) =>
        el.props.testID === 'glossary-letter' ? `#${el.props.accessibilityLabel}` : el.props.accessibilityLabel,
      );
    expect(rows[rows.indexOf('Cabeçalho (header)') - 1]).toBe('#C');
    expect(rows[rows.indexOf('Injeção de dependência') - 1]).toBe('#I');
    const letters = rows.filter((r) => r.startsWith('#'));
    expect(new Set(letters).size).toBe(letters.length);
  });

  it('Trilha de cada termo', async () => {
    await open('/glossary');
    showAllGlossaryItems();
    expect(
      within(screen.getByRole('button', { name: 'CORS' })).getByText('O mesmo CRUD em quatro frameworks'),
    ).toBeOnTheScreen();
    expect(within(screen.getByRole('button', { name: 'Cookie' })).getByText('Fundamentos web')).toBeOnTheScreen();
  });

  it('Selo de status', async () => {
    useStudyStore.getState().answer(TRACK, 'cors', 'known');
    useStudyStore.getState().answer(TRACK, 'dto', 'unknown');
    await open('/glossary');
    showAllGlossaryItems();
    const item = (term: string) => within(screen.getByRole('button', { name: term }));
    expect(item('CORS').getByText('já sabia')).toBeOnTheScreen();
    expect(item('DTO (Data Transfer Object)').getByText('revisar')).toBeOnTheScreen();
    expect(item('API').queryByText(/^(já sabia|revisar)$/)).toBeNull();
  });

  it('Abrir termo pela lista', async () => {
    await open('/glossary');
    showAllGlossaryItems();
    press('Docker');
    expect(sheet().getByRole('header', { name: 'Docker' })).toBeOnTheScreen();
    expect(sheet().getByText(/caixinhas/)).toBeOnTheScreen();
  });
});

describe('Requirement: Busca no glossário (na tela)', () => {
  it('Buscar pelo nome', async () => {
    await open('/glossary');
    search('cors');
    expect(listed()).toEqual(['CORS', 'Política de mesma origem']);
    expect(screen.getByText('2 termos')).toBeOnTheScreen();
  });

  it('Buscar sem acento', async () => {
    await open('/glossary');
    search('injecao');
    expect(listed()).toContain('Injeção de dependência');
  });

  it('Buscar pela definição', async () => {
    await open('/glossary');
    search('caixinhas');
    expect(listed()).toEqual(['Docker']);
  });

  it('Sem resultados', async () => {
    await open('/glossary');
    search('kubernetes');
    expect(screen.queryAllByTestId('glossary-item')).toHaveLength(0);
    expect(screen.getByText('Nenhum termo encontrado.')).toBeOnTheScreen();
    expect(screen.getByText('0 termos')).toBeOnTheScreen();
  });
});

describe('Requirement: Filtros do glossário', () => {
  const filtersButton = () => screen.getByRole('button', { name: /^Filtros/ });
  const filters = () => within(screen.getByTestId('glossary-filters'));
  const openFilters = () => fireEvent.press(filtersButton());
  const choose = (name: string) => fireEvent.press(filters().getByLabelText(name));
  const apply = () => fireEvent.press(filters().getByRole('button', { name: /^Ver \d+ termos?$/ }));
  const all = () => {
    showAllGlossaryItems();
    return listed();
  };

  it('Filtrar por trilha', async () => {
    await open('/glossary');
    openFilters();
    choose('Fundamentos web');
    apply();
    expect(screen.queryByTestId('glossary-filters')).toBeNull();
    expect(all()).toHaveLength(21);
    expect(screen.getByText('21 termos')).toBeOnTheScreen();
    expect(filtersButton()).toHaveAccessibleName('Filtros · 1');
    expect(screen.getByRole('button', { name: 'Remover filtro Fundamentos web' })).toBeOnTheScreen();
  });

  it('Filtrar por nível', async () => {
    await open('/glossary');
    openFilters();
    choose('Pleno');
    apply();
    expect(all()).toHaveLength(17);
    expect(listed()).toContain('CORS');
    expect(listed()).not.toContain('API');
  });

  it('Filtrar pelo estudo', async () => {
    useStudyStore.getState().answer(TRACK, 'cors', 'known');
    useStudyStore.getState().answer(TRACK, 'dto', 'unknown');
    await open('/glossary');
    openFilters();
    choose('Revisar');
    apply();
    expect(listed()).toEqual(['DTO (Data Transfer Object)']);
  });

  it('Não vistos', async () => {
    useStudyStore.getState().answer(TRACK, 'cors', 'known');
    await open('/glossary');
    openFilters();
    choose('Não vistos');
    apply();
    expect(all()).toHaveLength(44);
    expect(listed()).not.toContain('CORS');
  });

  it('Filtros combinados com a busca', async () => {
    await open('/glossary');
    openFilters();
    choose('Fundamentos');
    apply();
    search('cors');
    expect(listed()).toEqual(['Política de mesma origem']);
  });

  it('Remover filtro pelo chip', async () => {
    await open('/glossary');
    openFilters();
    choose('Fundamentos web');
    choose('Pleno');
    apply();
    expect(filtersButton()).toHaveAccessibleName('Filtros · 2');
    fireEvent.press(screen.getByRole('button', { name: 'Remover filtro Pleno' }));
    expect(screen.queryByRole('button', { name: 'Remover filtro Pleno' })).toBeNull();
    expect(filtersButton()).toHaveAccessibleName('Filtros · 1');
    expect(all()).toHaveLength(21);
  });

  it('Limpar filtros', async () => {
    await open('/glossary');
    openFilters();
    choose('Fundamentos web');
    choose('Pleno');
    choose('Limpar');
    fireEvent.press(filters().getByRole('button', { name: 'Ver 45 termos' }));
    expect(screen.queryByTestId('glossary-filters')).toBeNull();
    expect(all()).toHaveLength(45);
    expect(filtersButton()).toHaveAccessibleName('Filtros');
  });

  it('fechar tocando fora mantém os filtros escolhidos', async () => {
    await open('/glossary');
    openFilters();
    choose('Pleno');
    fireEvent.press(screen.getByRole('button', { name: 'Fechar filtros' }));
    expect(screen.queryByTestId('glossary-filters')).toBeNull();
    expect(filtersButton()).toHaveAccessibleName('Filtros · 1');
  });
});
