import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import StudyScreen from '../app/study/[themeId]/[deckId]';
import ThemeScreen from '../app/theme/[themeId]';
import { resetStudyStore, useStudyStore } from '../study/store';
import { crudTheme } from '../test-utils';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/progress': ProgressScreen,
  'theme/[themeId]': ThemeScreen,
  'study/[themeId]/[deckId]': StudyScreen,
};
const THEME = crudTheme.id;

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
    await open(`/study/${THEME}/passo-a-passo`);
    // avança até o Passo 13 (os complementos ficam entre os passos)
    while (!screen.queryByText('Passo 13')) {
      press('Mostrar resposta');
      press('Sei');
    }
    press('Mostrar resposta');
    fireEvent.press(screen.getByRole('button', { name: 'CORS' }));
    expect(sheet().getByText(/Regra de segurança do navegador/)).toBeOnTheScreen();
    fireEvent.press(sheet().getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByTestId('term-sheet')).toBeNull();
    expect(screen.getByText('Liberar o frontend (CORS)')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Não sei' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Sei' })).toBeOnTheScreen();
  });
});

describe('Requirement: Aba Glossário', () => {
  it('Lista completa', async () => {
    await open('/glossary');
    expect(listed()).toHaveLength(24);
    expect(listed()[0]).toBe('API');
    expect(screen.getByText('24 termos')).toBeOnTheScreen();
    expect(screen.queryByText(/em construção/i)).toBeNull();
  });

  it('Selo de status', async () => {
    useStudyStore.getState().answer(THEME, 'cors', 'known');
    useStudyStore.getState().answer(THEME, 'dto', 'unknown');
    await open('/glossary');
    const item = (term: string) => within(screen.getByRole('button', { name: term }));
    expect(item('CORS').getByText('sei')).toBeOnTheScreen();
    expect(item('DTO (Data Transfer Object)').getByText('revisar')).toBeOnTheScreen();
    expect(item('API').queryByText(/^(sei|revisar)$/)).toBeNull();
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
    expect(listed()).toEqual(['CORS']);
    expect(screen.getByText('1 termo')).toBeOnTheScreen();
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
