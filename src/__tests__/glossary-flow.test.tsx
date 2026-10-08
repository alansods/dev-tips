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
import { crudTrack } from '../test-utils';

// Os cenários do glossário descrevem o catálogo com as trilhas CRUD e Fundamentos de programação e web.
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
    expect(listed()).toHaveLength(69);
    expect(listed()[0]).toBe('API');
    expect(listed()[23]).toBe('venv (Python)');
    expect(listed()[24]).toBe('Variável');
    expect(screen.getByText('69 termos')).toBeOnTheScreen();
    expect(screen.queryByText(/em construção/i)).toBeNull();
  });

  it('Trilha de cada termo', async () => {
    await open('/glossary');
    expect(
      within(screen.getByRole('button', { name: 'CORS' })).getByText('O mesmo CRUD em quatro frameworks'),
    ).toBeOnTheScreen();
    expect(
      within(screen.getByRole('button', { name: 'Cookie' })).getByText('Fundamentos de programação e web'),
    ).toBeOnTheScreen();
  });

  it('Selo de status', async () => {
    useStudyStore.getState().answer(TRACK, 'cors', 'known');
    useStudyStore.getState().answer(TRACK, 'dto', 'unknown');
    await open('/glossary');
    const item = (term: string) => within(screen.getByRole('button', { name: term }));
    expect(item('CORS').getByText('já sabia')).toBeOnTheScreen();
    expect(item('DTO (Data Transfer Object)').getByText('revisar')).toBeOnTheScreen();
    expect(item('API').queryByText(/^(já sabia|revisar)$/)).toBeNull();
  });

  it('Abrir termo pela lista', async () => {
    await open('/glossary');
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
