import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import SettingsScreen from '../app/settings';
import { useSettingsStore } from '../i18n';

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
