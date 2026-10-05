import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import { StyleSheet } from 'react-native';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';

// Os layouts e telas reais do app, montados num roteador em memória.
const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/progress': ProgressScreen,
};

const TAB_LABELS = ['Trilhas', 'Glossário', 'Progresso'];

async function renderApp() {
  renderRouter(APP, { initialUrl: '/' });
  await act(async () => {}); // leitura assíncrona da preferência de tema
}

// No iOS a aba é um botão cujo nome acessível é "Trilhas, tab, 1 of 3"; em outras plataformas, role "tab".
const TAB_ROLE = /^(button|tab)$/;
const tabName = (el: { props: { accessibilityLabel?: string } }) =>
  TAB_LABELS.find((label) => String(el.props.accessibilityLabel ?? '').startsWith(`${label}, tab`));

/** Botões da barra de abas, na ordem em que aparecem. */
const tabButtons = () => screen.getAllByRole(TAB_ROLE).filter((el) => tabName(el) !== undefined);
const tab = (label: string) => screen.getByRole(TAB_ROLE, { name: new RegExp(`^${label}, tab`) });

beforeEach(() => {
  (useFonts as jest.Mock).mockReturnValue([true, null]);
});

describe('Requirement: Navegação por abas', () => {
  it('App abre na aba Trilhas', async () => {
    await renderApp();
    expect(screen).toHavePathname('/');
    expect(tab('Trilhas')).toBeSelected();
    expect(tab('Glossário')).not.toBeSelected();
  });

  it('Trocar de aba', async () => {
    await renderApp();
    fireEvent.press(tab('Glossário'));
    expect(screen).toHavePathname('/glossary');
    expect(tab('Glossário')).toBeSelected();
    expect(tab('Trilhas')).not.toBeSelected();
  });

  it('Abas na ordem do design', async () => {
    await renderApp();
    expect(tabButtons().map(tabName)).toEqual(TAB_LABELS);
    for (const label of TAB_LABELS) expect(screen.getAllByText(label).length).toBeGreaterThan(0);
  });
});

describe('Requirement: Home mínima', () => {
  it('Lista de trilhas', async () => {
    await renderApp();
    expect(screen.getByText('O mesmo CRUD em quatro frameworks')).toBeOnTheScreen();
  });
});

describe('Requirement: Fontes do design', () => {
  it('usa IBM Plex Sans quando as fontes carregam', async () => {
    await renderApp();
    const title = screen.getByText('O mesmo CRUD em quatro frameworks');
    expect(StyleSheet.flatten(title.props.style).fontFamily).toMatch(/^IBMPlexSans_/);
  });

  it('Falha ao carregar fontes', async () => {
    (useFonts as jest.Mock).mockReturnValue([false, new Error('fonte indisponível')]);
    await renderApp();
    expect(SplashScreen.hideAsync).toHaveBeenCalled();
    expect(tab('Trilhas')).toBeSelected();
    const title = screen.getByText('O mesmo CRUD em quatro frameworks');
    expect(StyleSheet.flatten(title.props.style).fontFamily).toBeUndefined();
  });

  it('mantém a splash enquanto as fontes carregam', async () => {
    (useFonts as jest.Mock).mockReturnValue([false, null]);
    (SplashScreen.hideAsync as jest.Mock).mockClear();
    renderRouter(APP, { initialUrl: '/' });
    await act(async () => {});
    expect(SplashScreen.hideAsync).not.toHaveBeenCalled();
    expect(screen.queryByText('O mesmo CRUD em quatro frameworks')).toBeNull();
  });
});

describe('cabeçalho', () => {
  it('tem o botão de tema em todas as abas', async () => {
    await renderApp();
    expect(screen.getByRole('button', { name: /^Usar tema/ })).toBeOnTheScreen();
    fireEvent.press(tab('Progresso'));
    expect(screen.getByRole('button', { name: /^Usar tema/ })).toBeOnTheScreen();
  });
});
