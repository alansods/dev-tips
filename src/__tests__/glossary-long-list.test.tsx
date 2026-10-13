import { act, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import { getGlossary } from '../content';
import { getCatalog } from '../content/catalog';
import { resetStudyStore } from '../study/store';
import { scrollGlossaryToEnd } from '../test-utils';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/glossary': GlossaryScreen,
};

const terms = getCatalog('pt-BR').flatMap(getGlossary);

beforeEach(() => resetStudyStore());

describe('Requirement: Aba Glossário', () => {
  it('Lista longa', async () => {
    renderRouter(APP, { initialUrl: '/glossary' });
    await act(async () => {});
    expect(screen.getByText(`${terms.length} termos`)).toBeOnTheScreen();
    expect(screen.getAllByTestId('glossary-item').length).toBeLessThan(terms.length);
    scrollGlossaryToEnd();
    expect(screen.getByRole('button', { name: terms.at(-1)!.term })).toBeOnTheScreen();
  });
});
