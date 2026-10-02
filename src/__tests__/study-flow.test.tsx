import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import StudyScreen from '../app/study/[themeId]/[deckId]';
import ThemeScreen from '../app/theme/[themeId]';
import { resetStudyStore, useStudyStore } from '../study/store';
import { progressKey } from '../study/rules';
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

const THEME = 'crud-4-frameworks';
const TOTAL_CARDS = crudTheme.decks.reduce((n, d) => n + d.cards.length, 0);
const deckIds = (id: string) => crudTheme.decks.find((d) => d.id === id)!.cards.map((c) => c.id);

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const seed = (cardIds: string[], result: 'known' | 'unknown') =>
  cardIds.forEach((id) => useStudyStore.getState().answer(THEME, id, result));

/** Vira o card atual e responde. */
function answer(result: 'Sei' | 'Não sei') {
  press('Mostrar resposta');
  press(result);
}

beforeEach(() => resetStudyStore());

describe('Requirement: Home mínima', () => {
  it('Lista de temas', async () => {
    await open('/');
    expect(screen.getByText('O mesmo CRUD em quatro frameworks')).toBeOnTheScreen();
  });

  it('Progresso do tema na Home', async () => {
    await open('/');
    expect(screen.getByText(`0/${TOTAL_CARDS}`)).toBeOnTheScreen();
  });

  it('Tocar no tema', async () => {
    await open('/');
    press(/^O mesmo CRUD em quatro frameworks/);
    expect(screen).toHavePathname(`/theme/${THEME}`);
  });
});

describe('Requirement: Tela do tema', () => {
  it('Abrir o tema', async () => {
    await open('/');
    press(/^O mesmo CRUD em quatro frameworks/);
    for (const name of ['Express', 'Spring Boot', 'NestJS', 'FastAPI'])
      expect(screen.getByText(name)).toBeOnTheScreen();
    const titles = ['O que vamos criar', 'Passo a passo', 'Mapa mental', 'Glossário', 'Perguntas de entrevista'];
    const found = screen.getAllByRole('header').map((h) => h.props.children);
    expect(found.filter((t: unknown) => titles.includes(String(t)))).toEqual(titles);
    expect(screen.queryByRole('button', { name: /^Temas, tab/ })).toBeNull(); // tela cheia, sem abas
  });

  it('Voltar para os temas', async () => {
    await open('/');
    press(/^O mesmo CRUD em quatro frameworks/);
    press('Voltar');
    expect(screen).toHavePathname('/');
  });

  it('tema inexistente mostra aviso', async () => {
    await open('/theme/nao-existe');
    expect(screen.getByText(/não encontrado/i)).toBeOnTheScreen();
  });
});

describe('Requirement: Deck com progresso e ação', () => {
  it('Deck nunca estudado', async () => {
    await open(`/theme/${THEME}`);
    expect(screen.getByText('0/24')).toBeOnTheScreen();
    press('Estudar Glossário');
    expect(screen).toHavePathname(`/study/${THEME}/glossario`);
    expect(screen.getByText('1 / 24')).toBeOnTheScreen();
  });

  it('Continuar de onde parou', async () => {
    const [a, b, c] = deckIds('o-que-vamos-criar');
    seed([a, b], 'known');
    seed([c], 'unknown');
    await open(`/theme/${THEME}`);
    expect(screen.getByText('2/5')).toBeOnTheScreen();
    press('Continuar O que vamos criar');
    expect(screen.getByText('1 / 3')).toBeOnTheScreen();
  });

  it('Deck dominado', async () => {
    seed(deckIds('o-que-vamos-criar'), 'known');
    await open(`/theme/${THEME}`);
    expect(screen.getByText('5/5')).toBeOnTheScreen();
    press('Estudar de novo O que vamos criar');
    expect(screen.getByText('1 / 5')).toBeOnTheScreen();
  });
});

describe('Requirement: Sessão de estudo', () => {
  it('Primeiro card', async () => {
    await open(`/theme/${THEME}`);
    press('Estudar Passo a passo');
    expect(screen.getByText('1 / 20')).toBeOnTheScreen();
    expect(screen.getByText('Passo 1')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /^Temas, tab/ })).toBeNull();
  });

  it('Sair no meio', async () => {
    await open(`/theme/${THEME}`);
    press('Estudar O que vamos criar');
    answer('Sei');
    answer('Sei');
    answer('Não sei');
    press('Sair da sessão');
    expect(screen).toHavePathname(`/theme/${THEME}`);
    expect(Object.keys(useStudyStore.getState().progress)).toHaveLength(3);
    expect(screen.getByText('2/5')).toBeOnTheScreen();
  });

  it('deck inexistente mostra aviso', async () => {
    await open(`/study/${THEME}/nao-existe`);
    expect(screen.getByText(/não encontrado/i)).toBeOnTheScreen();
  });
});

describe('Requirement: Virar e responder (na tela)', () => {
  it('Não responder sem ver o verso', async () => {
    await open(`/study/${THEME}/o-que-vamos-criar`);
    expect(screen.queryByRole('button', { name: 'Sei' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Não sei' })).toBeNull();
    press('Mostrar resposta');
    expect(screen.getByRole('button', { name: 'Sei' })).toBeOnTheScreen();
  });

  it('tocar no card também vira', async () => {
    await open(`/study/${THEME}/o-que-vamos-criar`);
    press('Virar card');
    expect(screen.getByText('C · Create')).toBeOnTheScreen();
  });

  it('Responder e avançar', async () => {
    await open(`/study/${THEME}/o-que-vamos-criar`);
    answer('Sei');
    expect(screen.getByText('2 / 5')).toBeOnTheScreen();
    expect(useStudyStore.getState().progress[progressKey(THEME, 'endpoint-create')]).toBe('known');
    expect(screen.getByRole('button', { name: 'Mostrar resposta' })).toBeOnTheScreen();
  });
});

describe('Requirement: Abas de framework (na sessão)', () => {
  it('Escolha mantida entre passos', async () => {
    await open(`/study/${THEME}/passo-a-passo`);
    press('Mostrar resposta');
    fireEvent.press(screen.getByRole('tab', { name: 'FastAPI' }));
    press('Sei');
    press('Mostrar resposta');
    expect(screen.getByText('Passo 2')).toBeOnTheScreen();
    expect(screen.getByRole('tab', { name: 'FastAPI' })).toBeSelected();
    expect(screen.getByText(/pip install "fastapi\[standard\]"/)).toBeOnTheScreen();
  });
});

describe('Requirement: Resumo da sessão', () => {
  it('Resumo com erros', async () => {
    await open(`/study/${THEME}/o-que-vamos-criar`);
    (['Sei', 'Não sei', 'Sei', 'Não sei', 'Sei'] as const).forEach(answer);
    expect(screen.getByText('Sessão concluída')).toBeOnTheScreen();
    expect(screen.getByLabelText('3 sei')).toBeOnTheScreen();
    expect(screen.getByLabelText('2 não sei')).toBeOnTheScreen();
    expect(screen.getByText('GET /products')).toBeOnTheScreen();
    expect(screen.getByText('PUT /products/{id}')).toBeOnTheScreen();
    press('Revisar os que errei');
    expect(screen.getByText('1 / 2')).toBeOnTheScreen();
  });

  it('Resumo sem erros', async () => {
    await open(`/study/${THEME}/o-que-vamos-criar`);
    for (let i = 0; i < 5; i++) answer('Sei');
    expect(screen.getByText('Sessão concluída')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Revisar os que errei' })).toBeNull();
    expect(screen.queryByText('Para revisar')).toBeNull();
    press('Voltar ao tema');
  });
});

describe('Requirement: Progresso enquanto o app está aberto', () => {
  it('Progresso refletido na tela do tema', async () => {
    await open(`/theme/${THEME}`);
    expect(screen.getByLabelText(`0 de ${TOTAL_CARDS} cards que você sabe`)).toBeOnTheScreen();
    press('Estudar Glossário');
    answer('Sei');
    answer('Sei');
    press('Sair da sessão');
    expect(screen.getByText('2/24')).toBeOnTheScreen();
    expect(screen.getByLabelText(`2 de ${TOTAL_CARDS} cards que você sabe`)).toBeOnTheScreen();
  });

  it('progresso refletido na Home', async () => {
    seed(deckIds('glossario').slice(0, 4), 'known');
    await open('/');
    expect(screen.getByText(`4/${TOTAL_CARDS}`)).toBeOnTheScreen();
  });
});
