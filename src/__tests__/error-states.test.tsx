import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import NotFoundScreen from '../app/+not-found';
import RootLayout, { ErrorBoundary } from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';

// Uma tela que falha enquanto `failing` for true (simula um erro passageiro).
let failing = true;
function FlakyScreen() {
  if (failing) throw new Error('detalhe técnico do erro');
  return null;
}

const APP = {
  _layout: { default: RootLayout, ErrorBoundary },
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/progress': ProgressScreen,
  flaky: FlakyScreen,
  '+not-found': NotFoundScreen,
};

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));

let consoleError: jest.SpyInstance;
beforeEach(() => {
  failing = true;
  // O React registra o erro capturado no console; aqui ele é esperado.
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => consoleError.mockRestore());

describe('Requirement: Erro inesperado', () => {
  it('Falha numa tela', async () => {
    await open('/flaky');
    expect(screen.getByRole('header', { name: 'Algo deu errado' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Voltar ao início' })).toBeOnTheScreen();
    expect(screen.queryByText(/detalhe técnico/)).toBeNull();
  });

  it('Tentar de novo', async () => {
    await open('/flaky');
    failing = false;
    press('Tentar de novo');
    await act(async () => {});
    expect(screen.queryByText('Algo deu errado')).toBeNull();
    expect(screen).toHavePathname('/flaky');
  });

  it('Voltar ao início', async () => {
    await open('/flaky');
    press('Voltar ao início');
    await act(async () => {});
    expect(screen).toHavePathname('/');
    expect(screen.queryByText('Algo deu errado')).toBeNull();
  });
});

describe('Requirement: Página não encontrada', () => {
  it('Rota inexistente', async () => {
    await open('/nao-existe');
    expect(screen.getByRole('header', { name: 'Não encontramos esta página' })).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Ir para Temas' })).toBeOnTheScreen();
  });

  it('Ir para Temas', async () => {
    await open('/nao-existe');
    fireEvent.press(screen.getByRole('link', { name: 'Ir para Temas' }));
    await act(async () => {});
    expect(screen).toHavePathname('/');
  });
});
