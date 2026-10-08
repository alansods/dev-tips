import { act, renderRouter, screen, within } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import TracksScreen from '../app/(tabs)/tracks';
import ProfileScreen from '../app/(tabs)/profile';
import ProgressScreen from '../app/progress';
import AreaScreen from '../app/area/[areaId]/index';
import LanguageScreen from '../app/area/[areaId]/[languageId]/index';
import FrameworkScreen from '../app/area/[areaId]/[languageId]/[frameworkId]';
import TrackScreen from '../app/track/[trackId]';
import { resetStudyStore } from '../study/store';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/tracks': TracksScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/profile': ProfileScreen,
  progress: ProgressScreen,
  'area/[areaId]/index': AreaScreen,
  'area/[areaId]/[languageId]/index': LanguageScreen,
  'area/[areaId]/[languageId]/[frameworkId]': FrameworkScreen,
  'track/[trackId]': TrackScreen,
};

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const hidden = { includeHiddenElements: true };
/** O ícone dentro do botão cujo rótulo começa com `name`. */
const iconIn = (name: string, icon: string) =>
  within(screen.getByRole('button', { name: new RegExp(`^${name},`) })).getByTestId(`tech-icon-${icon}`, hidden);

beforeEach(() => resetStudyStore());

describe('Requirement: Ícone nas listas e telas', () => {
  it('Card de trilha com logo do framework', async () => {
    await open('/area/frontend/javascript/react');
    expect(iconIn('React', 'logo:react')).toBeTruthy();
  });

  it('Linha de linguagem', async () => {
    await open('/area/backend');
    expect(iconIn('Java', 'logo:openjdk')).toBeTruthy();
  });

  it('linha de framework', async () => {
    await open('/area/frontend/javascript');
    expect(iconIn('Next.js', 'logo:nextdotjs')).toBeTruthy();
  });

  it('Sigla', async () => {
    await open('/area/devops');
    expect(iconIn('AWS essencial', 'text:AWS')).toBeTruthy();
  });

  it('Trilha sem marca', async () => {
    await open('/area/fundamentos');
    expect(iconIn('Fundamentos de programação e web', 'area:fundamentos')).toBeTruthy();
  });

  it('Card de área', async () => {
    await open('/tracks');
    expect(iconIn('Backend', 'area:backend')).toBeTruthy();
    expect(iconIn('Frontend', 'area:frontend')).toBeTruthy();
  });

  it('Tela da trilha', async () => {
    await open('/track/nextjs');
    expect(screen.getByTestId('tech-icon-logo:nextdotjs', hidden)).toBeTruthy();
  });

  it('Painel de progresso', async () => {
    await open('/progress');
    expect(
      within(screen.getByTestId('track-progress-header-django')).getByTestId('tech-icon-logo:django', hidden),
    ).toBeTruthy();
  });
});

describe('Requirement: Ícone decorativo (nas telas)', () => {
  it('Rótulo do card sem o ícone', async () => {
    await open('/area/frontend/javascript/react');
    const card = screen.getByRole('button', { name: /^React,/ });
    expect(card.props.accessibilityLabel).toMatch(/^React, \d+ de \d+ cards que você sabe$/);
    // o ícone não aparece para o leitor de tela
    expect(within(card).queryByTestId('tech-icon-logo:react')).toBeNull();
  });
});
