import Constants from 'expo-constants';
import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import { Linking } from 'react-native';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import SettingsScreen from '../app/settings';
import { useSettingsStore } from '../i18n';
import { resetStudyStore, useStudyStore } from '../study/store';
import { crudTheme } from '../test-utils';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/progress': ProgressScreen,
  settings: SettingsScreen,
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

describe('Requirement: Tela Ajustes', () => {
  it('Abrir Ajustes', async () => {
    await open('/');
    press('Ajustes');
    expect(screen).toHavePathname('/settings');
    expect(screen.getByRole('header', { name: 'Ajustes' })).toBeOnTheScreen();
    expect(screen.getByText('Idioma')).toBeOnTheScreen();
    expect(radio('Português (Brasil)')).toBeChecked();
    expect(radio('English')).not.toBeChecked();
    expect(tabLabels()).toEqual([]);
  });

  it('Voltar', async () => {
    await open('/glossary');
    press('Ajustes');
    press('Voltar');
    expect(screen).toHavePathname('/glossary');
  });
});

describe('Requirement: Idiomas disponíveis', () => {
  it('Nomes das opções', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/settings');
    expect(radio('Português (Brasil)')).toBeOnTheScreen();
    expect(radio('English')).toBeChecked();
  });
});

describe('Requirement: Trocar o idioma', () => {
  it('Troca imediata', async () => {
    await open('/');
    press('Ajustes');
    fireEvent.press(radio('English'));
    expect(screen.getByRole('header', { name: 'Settings' })).toBeOnTheScreen();
    expect(useSettingsStore.getState().language).toBe('en');
    press('Back');
    expect(tabLabels()).toEqual(['Topics', 'Glossary', 'Progress']);
  });
});

describe('Requirement: Trocar o idioma (progresso)', () => {
  it('Progresso preservado', async () => {
    resetStudyStore();
    const ids = crudTheme.decks
      .flatMap((d) => d.cards)
      .slice(0, 4)
      .map((c) => c.id);
    ids.forEach((id) => useStudyStore.getState().answer(crudTheme.id, id, 'known'));
    await open('/progress');
    expect(screen.getByTestId(`theme-progress-${crudTheme.id}`)).toBeOnTheScreen();
    expect(screen.getAllByLabelText('4 já sabia').length).toBeGreaterThan(0);
    press('Ajustes');
    fireEvent.press(radio('English'));
    press('Back');
    expect(screen.getAllByLabelText('4 I knew it').length).toBeGreaterThan(0);
  });
});

describe('Requirement: Tela Ajustes (seções)', () => {
  it('Ordem das seções', async () => {
    await open('/settings');
    const headers = screen.getAllByRole('header').map((el) => String(el.props.children));
    expect(headers).toEqual(['Ajustes', 'Idioma', 'Lembretes', 'Sobre']);
  });
});

describe('Requirement: Seção Sobre', () => {
  it('Abrir a política de privacidade', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    await open('/settings');
    press('Política de privacidade');
    expect(openURL).toHaveBeenCalledWith(Constants.expoConfig?.extra?.legal?.privacyUrl);
    expect(String(openURL.mock.calls[0][0])).toMatch(/^https:\/\//);
    press('Termos de uso');
    expect(openURL).toHaveBeenLastCalledWith(Constants.expoConfig?.extra?.legal?.termsUrl);
    openURL.mockRestore();
  });

  it('Versão do app', async () => {
    await open('/settings');
    expect(screen.getByLabelText('Versão 1.0.0')).toBeOnTheScreen();
  });

  it('em inglês', async () => {
    useSettingsStore.setState({ language: 'en' });
    await open('/settings');
    expect(screen.getByRole('header', { name: 'About' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Privacy policy' })).toBeOnTheScreen();
  });
});
