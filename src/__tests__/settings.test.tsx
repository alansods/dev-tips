import Constants from 'expo-constants';
import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import { Linking } from 'react-native';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProfileScreen from '../app/(tabs)/profile';
import ProgressScreen from '../app/progress';
import { useSettingsStore } from '../i18n';
import * as clock from '../study/clock';
import { resetStudyStore, useStudyStore } from '../study/store';
import { crudTrack } from '../test-utils';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/profile': ProfileScreen,
  progress: ProgressScreen,
};

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const radio = (name: string) => screen.getByRole('radio', { name });
const TAB_ROLE = /^(button|tab)$/;
const tabLabels = () =>
  screen
    .queryAllByRole(TAB_ROLE)
    .map((el) => String(el.props.accessibilityLabel ?? ''))
    .filter((label) => label.includes(', tab'))
    .map((label) => label.split(',')[0]);

const tab = (label: string) => screen.getByRole(TAB_ROLE, { name: new RegExp(`^${label}, tab`) });

describe('Requirement: Aba Perfil', () => {
  it('Abrir o Perfil', async () => {
    await open('/');
    fireEvent.press(tab('Perfil'));
    expect(screen).toHavePathname('/profile');
    expect(screen.getByRole('header', { name: 'Idioma' })).toBeOnTheScreen();
    expect(radio('Português (Brasil)')).toBeChecked();
    expect(radio('English')).not.toBeChecked();
    expect(tabLabels()).toEqual(['Trilhas', 'Glossário', 'Perfil']);
  });

  it('Abrir o progresso por trilha', async () => {
    await open('/');
    fireEvent.press(tab('Perfil'));
    press('Progresso por trilha');
    expect(screen).toHavePathname('/progress');
    expect(screen.getByRole('header', { name: 'Progresso' })).toBeOnTheScreen();
    expect(tabLabels()).toEqual([]);
    press('Voltar');
    expect(screen).toHavePathname('/profile');
  });

  it('voltar do Progresso aberto por link vai para o Perfil', async () => {
    await open('/progress');
    press('Voltar');
    expect(screen).toHavePathname('/profile');
  });
});

describe('Requirement: Resumo do estudo no Perfil', () => {
  beforeEach(() => resetStudyStore());
  afterEach(() => jest.restoreAllMocks());

  it('Sem estudo', async () => {
    await open('/profile');
    expect(screen.getByLabelText('0 dias seguidos')).toBeOnTheScreen();
    expect(screen.getByLabelText('0 cards que sei')).toBeOnTheScreen();
    expect(screen.getByLabelText('0 trilhas iniciadas')).toBeOnTheScreen();
  });

  it('Com estudo', async () => {
    const day = jest.spyOn(clock, 'today');
    day.mockReturnValue('2026-10-06');
    useStudyStore.getState().answer(crudTrack.id, 'api', 'known');
    day.mockReturnValue('2026-10-07');
    ['crud', 'cors', 'endpoint-create'].forEach((id) => useStudyStore.getState().answer(crudTrack.id, id, 'known'));
    useStudyStore.getState().answer('fundamentos-web', 'http', 'unknown');
    await open('/profile');
    expect(screen.getByLabelText('2 dias seguidos')).toBeOnTheScreen();
    expect(screen.getByLabelText('4 cards que sei')).toBeOnTheScreen();
    expect(screen.getByLabelText('2 trilhas iniciadas')).toBeOnTheScreen();
  });
});

describe('Requirement: Idiomas disponíveis', () => {
  it('Nomes das opções', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/profile');
    expect(radio('Português (Brasil)')).toBeOnTheScreen();
    expect(radio('English')).toBeChecked();
  });
});

describe('Requirement: Trocar o idioma', () => {
  it('Troca imediata', async () => {
    await open('/profile');
    fireEvent.press(radio('English'));
    expect(screen.getByRole('header', { name: 'Language' })).toBeOnTheScreen();
    expect(useSettingsStore.getState().language).toBe('en');
    expect(tabLabels()).toEqual(['Tracks', 'Glossary', 'Profile']);
  });
});

describe('Requirement: Trocar o idioma (progresso)', () => {
  it('Progresso preservado', async () => {
    resetStudyStore();
    const ids = crudTrack.decks
      .flatMap((d) => d.cards)
      .slice(0, 4)
      .map((c) => c.id);
    ids.forEach((id) => useStudyStore.getState().answer(crudTrack.id, id, 'known'));
    await open('/progress');
    expect(screen.getByTestId(`track-progress-${crudTrack.id}`)).toBeOnTheScreen();
    fireEvent.press(screen.getByTestId(`track-progress-header-${crudTrack.id}`));
    expect(screen.getAllByLabelText('4 já sabia').length).toBeGreaterThan(0);
    press('Voltar');
    fireEvent.press(radio('English'));
    press('Progress by track');
    fireEvent.press(screen.getByTestId(`track-progress-header-${crudTrack.id}`));
    expect(screen.getAllByLabelText('4 I knew it').length).toBeGreaterThan(0);
  });
});

describe('Requirement: Aba Perfil (seções)', () => {
  it('Ordem das seções', async () => {
    await open('/profile');
    const headers = screen.getAllByRole('header').map((el) => String(el.props.children));
    expect(headers).toEqual(['Conta', 'Seu estudo', 'Idioma', 'Lembretes', 'Tema', 'Sobre']);
  });
});

describe('Requirement: Seção Sobre', () => {
  it('Abrir a política de privacidade', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    await open('/profile');
    press('Política de privacidade');
    expect(openURL).toHaveBeenCalledWith(Constants.expoConfig?.extra?.legal?.privacyUrl);
    expect(String(openURL.mock.calls[0][0])).toMatch(/^https:\/\//);
    press('Termos de uso');
    expect(openURL).toHaveBeenLastCalledWith(Constants.expoConfig?.extra?.legal?.termsUrl);
    openURL.mockRestore();
  });

  it('Versão do app', async () => {
    await open('/profile');
    expect(screen.getByLabelText('Versão 1.0.0')).toBeOnTheScreen();
  });

  it('em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/profile');
    expect(screen.getByRole('header', { name: 'About' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Privacy policy' })).toBeOnTheScreen();
  });
});
