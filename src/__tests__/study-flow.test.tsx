import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import StudyScreen from '../app/study/[trackId]/[deckId]';
import TrackScreen from '../app/track/[trackId]';
import { resetStudyStore, useStudyStore } from '../study/store';
import { progressKey } from '../study/rules';
import { crudTrack } from '../test-utils';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/progress': ProgressScreen,
  'track/[trackId]': TrackScreen,
  'study/[trackId]/[deckId]': StudyScreen,
};

const TRACK = 'crud-4-frameworks';
const TOTAL_CARDS = crudTrack.decks.reduce((n, d) => n + d.cards.length, 0);
const deckIds = (id: string) => crudTrack.decks.find((d) => d.id === id)!.cards.map((c) => c.id);

async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await act(async () => {});
}
const press = (name: string | RegExp) => fireEvent.press(screen.getByRole('button', { name }));
const seed = (cardIds: string[], result: 'known' | 'unknown') =>
  cardIds.forEach((id) => useStudyStore.getState().answer(TRACK, id, result));

/** Vira o card atual e responde. */
function answer(result: 'Já sabia' | 'Não sabia') {
  press('Mostrar resposta');
  press(result);
}

beforeEach(() => resetStudyStore());

describe('Requirement: Home mínima', () => {
  it('Lista de trilhas', async () => {
    await open('/');
    expect(screen.getByText('O mesmo CRUD em quatro frameworks')).toBeOnTheScreen();
  });

  it('Progresso da trilha na Home', async () => {
    await open('/');
    expect(screen.getByText(`0/${TOTAL_CARDS}`)).toBeOnTheScreen();
  });

  it('Tocar na trilha', async () => {
    await open('/');
    press(/^O mesmo CRUD em quatro frameworks/);
    expect(screen).toHavePathname(`/track/${TRACK}`);
  });
});

describe('Requirement: Tela da trilha', () => {
  it('Abrir a trilha', async () => {
    await open('/');
    press(/^O mesmo CRUD em quatro frameworks/);
    for (const name of ['Express', 'Spring Boot', 'NestJS', 'FastAPI'])
      expect(screen.getByText(name)).toBeOnTheScreen();
    const titles = ['O que vamos criar', 'Passo a passo', 'Mapa mental', 'Glossário', 'Perguntas de entrevista'];
    const found = screen.getAllByRole('header').map((h) => h.props.children);
    expect(found.filter((t: unknown) => titles.includes(String(t)))).toEqual(titles);
    expect(screen.queryByRole('button', { name: /^Trilhas, tab/ })).toBeNull(); // tela cheia, sem abas
  });

  it('Voltar para as trilhas', async () => {
    await open('/');
    press(/^O mesmo CRUD em quatro frameworks/);
    press('Voltar');
    expect(screen).toHavePathname('/');
  });

  it('trilha inexistente mostra aviso', async () => {
    await open('/track/nao-existe');
    expect(screen.getByText(/Trilha não encontrada/i)).toBeOnTheScreen();
  });
});

describe('Requirement: Deck com progresso e ação', () => {
  it('Deck nunca estudado', async () => {
    await open(`/track/${TRACK}`);
    expect(screen.getByText('0/24')).toBeOnTheScreen();
    press('Estudar Glossário');
    expect(screen).toHavePathname(`/study/${TRACK}/glossario`);
    expect(screen.getByText('1 / 24')).toBeOnTheScreen();
  });

  it('Continuar de onde parou', async () => {
    const [a, b, c] = deckIds('o-que-vamos-criar');
    seed([a, b], 'known');
    seed([c], 'unknown');
    await open(`/track/${TRACK}`);
    expect(screen.getByText('2/5')).toBeOnTheScreen();
    press('Continuar O que vamos criar');
    expect(screen.getByText('1 / 3')).toBeOnTheScreen();
  });

  it('Deck dominado', async () => {
    seed(deckIds('o-que-vamos-criar'), 'known');
    await open(`/track/${TRACK}`);
    expect(screen.getByText('5/5')).toBeOnTheScreen();
    press('Estudar de novo O que vamos criar');
    expect(screen.getByText('1 / 5')).toBeOnTheScreen();
  });
});

describe('Requirement: Sessão de estudo', () => {
  it('Primeiro card', async () => {
    await open(`/track/${TRACK}`);
    press('Estudar Passo a passo');
    expect(screen.getByText('1 / 20')).toBeOnTheScreen();
    expect(screen.getByText('Passo 1')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /^Trilhas, tab/ })).toBeNull();
  });

  it('Sair no meio', async () => {
    await open(`/track/${TRACK}`);
    press('Estudar O que vamos criar');
    answer('Já sabia');
    answer('Já sabia');
    answer('Não sabia');
    press('Sair da sessão');
    expect(screen).toHavePathname(`/track/${TRACK}`);
    expect(Object.keys(useStudyStore.getState().progress)).toHaveLength(3);
    expect(screen.getByText('2/5')).toBeOnTheScreen();
  });

  it('deck inexistente mostra aviso', async () => {
    await open(`/study/${TRACK}/nao-existe`);
    expect(screen.getByText(/não encontrado/i)).toBeOnTheScreen();
  });
});

describe('Requirement: Virar e responder (na tela)', () => {
  it('Não responder sem ver o verso', async () => {
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    expect(screen.queryByRole('button', { name: 'Já sabia' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Não sabia' })).toBeNull();
    press('Mostrar resposta');
    expect(screen.getByRole('button', { name: 'Já sabia' })).toBeOnTheScreen();
  });

  it('tocar no card também vira', async () => {
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    press('Virar card');
    expect(screen.getByText('C · Create')).toBeOnTheScreen();
  });

  it('Responder e avançar', async () => {
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    answer('Já sabia');
    expect(screen.getByText('2 / 5')).toBeOnTheScreen();
    expect(useStudyStore.getState().progress[progressKey(TRACK, 'endpoint-create')]).toBe('known');
    expect(screen.getByRole('button', { name: 'Mostrar resposta' })).toBeOnTheScreen();
  });
});

describe('Requirement: Abas de framework (na sessão)', () => {
  it('Escolha mantida entre passos', async () => {
    await open(`/study/${TRACK}/passo-a-passo`);
    press('Mostrar resposta');
    fireEvent.press(screen.getByRole('tab', { name: 'FastAPI' }));
    press('Já sabia');
    press('Mostrar resposta');
    expect(screen.getByText('Passo 2')).toBeOnTheScreen();
    expect(screen.getByRole('tab', { name: 'FastAPI' })).toBeSelected();
    expect(screen.getByText(/pip install "fastapi\[standard\]"/)).toBeOnTheScreen();
  });
});

describe('Requirement: Resumo da sessão', () => {
  it('Resumo com erros', async () => {
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    (['Já sabia', 'Não sabia', 'Já sabia', 'Não sabia', 'Já sabia'] as const).forEach(answer);
    expect(screen.getByText('Sessão concluída')).toBeOnTheScreen();
    expect(screen.getByLabelText('3 já sabia')).toBeOnTheScreen();
    expect(screen.getByLabelText('2 não sabia')).toBeOnTheScreen();
    expect(screen.getByText(/3 de 5 cards como "já sabia"/)).toBeOnTheScreen();
    expect(screen.getByText('GET /products')).toBeOnTheScreen();
    expect(screen.getByText('PUT /products/{id}')).toBeOnTheScreen();
    press('Revisar os que errei');
    expect(screen.getByText('1 / 2')).toBeOnTheScreen();
  });

  it('Resumo sem erros', async () => {
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    for (let i = 0; i < 5; i++) answer('Já sabia');
    expect(screen.getByText('Sessão concluída')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Revisar os que errei' })).toBeNull();
    expect(screen.queryByText('Para revisar')).toBeNull();
    press('Voltar à trilha');
  });
});

describe('Requirement: Progresso enquanto o app está aberto', () => {
  it('Progresso refletido na tela da trilha', async () => {
    await open(`/track/${TRACK}`);
    expect(screen.getByLabelText(`0 de ${TOTAL_CARDS} cards que você sabe`)).toBeOnTheScreen();
    press('Estudar Glossário');
    answer('Já sabia');
    answer('Já sabia');
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

describe('Requirement: Identidade da trilha (Fundamentos web)', () => {
  it('Trilha na Home', async () => {
    await open('/');
    const titles = screen
      .getAllByRole('button')
      .map((b) => String(b.props.accessibilityLabel ?? ''))
      .filter((l) => /^(O mesmo CRUD em quatro frameworks|Fundamentos web),/.test(l))
      .map((l) => l.split(',')[0]);
    expect(titles).toEqual(['O mesmo CRUD em quatro frameworks', 'Fundamentos web']);
  });

  it('Sem frameworks', async () => {
    await open('/track/fundamentos-web');
    expect(screen.getByText('Fundamentos web')).toBeOnTheScreen();
    expect(screen.queryByText('Spring Boot')).toBeNull();
    expect(screen.queryByText('FastAPI')).toBeNull();
  });
});

describe('Requirement: Animação de virar o card (na sessão)', () => {
  it('Botões disponíveis durante a animação', async () => {
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    press('Mostrar resposta');
    // sem avançar timers: a animação ainda está em curso, mas os botões já existem
    expect(screen.getByRole('button', { name: 'Não sabia' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Já sabia' })).toBeOnTheScreen();
  });
});
