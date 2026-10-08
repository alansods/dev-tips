import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProfileScreen from '../app/(tabs)/profile';
import ProgressScreen from '../app/progress';
import AreaScreen from '../app/area/[areaId]/index';
import StudyScreen from '../app/study/[trackId]/[deckId]';
import TrackScreen from '../app/track/[trackId]';
import * as chance from '../study/chance';
import { resetStudyStore, useStudyStore } from '../study/store';
import { progressKey } from '../study/rules';
import { cardById, crudTrack } from '../test-utils';

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/profile': ProfileScreen,
  progress: ProgressScreen,
  'area/[areaId]/index': AreaScreen,
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

const term = (id: string) => {
  const card = cardById(id);
  if (card.type !== 'concept') throw new Error(`${id} não é um conceito`);
  return card.term;
};

describe('Requirement: Tela da trilha', () => {
  it('Abrir a trilha', async () => {
    await open('/area/backend');
    press(/^O mesmo CRUD em quatro frameworks, \d+ de/);
    for (const name of ['Express', 'Spring Boot', 'NestJS', 'FastAPI'])
      expect(screen.getByText(name)).toBeOnTheScreen();
    const titles = ['O que vamos criar', 'Passo a passo', 'Mapa mental', 'Glossário', 'Perguntas de entrevista'];
    const found = screen.getAllByRole('header').map((h) => h.props.children);
    expect(found.filter((t: unknown) => titles.includes(String(t)))).toEqual(titles);
    expect(screen.queryByRole('button', { name: /^Trilhas, tab/ })).toBeNull(); // tela cheia, sem abas
  });

  it('Voltar para as trilhas', async () => {
    await open('/');
    press(/^Backend,/);
    press(/^O mesmo CRUD em quatro frameworks, \d+ de/);
    press('Voltar');
    expect(screen).toHavePathname('/area/backend');
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

  it('mostra o nível do card na sessão', async () => {
    await open(`/track/${TRACK}`);
    press('Estudar Passo a passo');
    expect(screen.getByText('Júnior')).toBeOnTheScreen(); // step-01
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

  it('Ordem sorteada', async () => {
    // Sorteio sempre 0: o segundo card do deck vai para a primeira posição.
    jest.spyOn(chance, 'random').mockReturnValue(0);
    const [first, second] = deckIds('glossario');
    await open(`/study/${TRACK}/glossario`);
    expect(screen.getByText(term(second))).toBeOnTheScreen();
    expect(screen.queryByText(term(first))).toBeNull();
  });

  it('Nova ordem a cada sessão', async () => {
    const [first, second] = deckIds('glossario');
    await open(`/track/${TRACK}`);
    press('Estudar Glossário');
    expect(screen.getByText(term(first))).toBeOnTheScreen();
    press('Sair da sessão');
    jest.spyOn(chance, 'random').mockReturnValue(0);
    press('Estudar Glossário');
    expect(screen.getByText(term(second))).toBeOnTheScreen();
  });

  it('Passos em ordem', async () => {
    jest.spyOn(chance, 'random').mockReturnValue(0);
    await open(`/study/${TRACK}/passo-a-passo`);
    expect(screen.getByText('Passo 1')).toBeOnTheScreen();
    answer('Já sabia');
    expect(screen.getByText('Passo 2')).toBeOnTheScreen();
  });

  it('Mesmos cards', async () => {
    const ids = deckIds('o-que-vamos-criar');
    seed(ids.slice(0, 2), 'known');
    jest.spyOn(chance, 'random').mockReturnValue(0);
    await open(`/track/${TRACK}`);
    press('Continuar O que vamos criar');
    expect(screen.getByText('1 / 3')).toBeOnTheScreen();
    for (let i = 0; i < 3; i++) answer('Já sabia');
    const known = Object.entries(useStudyStore.getState().progress).filter(([, r]) => r === 'known');
    expect(known.map(([k]) => k).sort()).toEqual(ids.map((id) => progressKey(TRACK, id)).sort());
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

  it('Voltar para a pergunta', async () => {
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    press('Mostrar resposta');
    press('Ver pergunta');
    expect(screen.getByRole('button', { name: 'Mostrar resposta' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Já sabia' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Não sabia' })).toBeNull();
    expect(screen.queryByText('C · Create')).toBeNull();
  });

  it('Tocar no verso', async () => {
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    press('Mostrar resposta');
    fireEvent.press(screen.getByTestId('card-back'));
    expect(screen.getByRole('button', { name: 'Mostrar resposta' })).toBeOnTheScreen();
    expect(screen.queryByText('C · Create')).toBeNull();
  });

  it('Virar de novo', async () => {
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    press('Mostrar resposta');
    press('Ver pergunta');
    press('Mostrar resposta');
    expect(screen.getByText('C · Create')).toBeOnTheScreen();
    press('Já sabia');
    expect(screen.getByText('2 / 5')).toBeOnTheScreen();
    expect(useStudyStore.getState().progress[progressKey(TRACK, 'endpoint-create')]).toBe('known');
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
    // o card Backend soma todas as trilhas da área
    expect(within(screen.getByRole('button', { name: /^Backend,/ })).getByText(/^4\/\d+$/)).toBeOnTheScreen();
  });
});

describe('Requirement: Identidade da trilha (Fundamentos web)', () => {
  it('Trilha na área Fundamentos', async () => {
    await open('/area/fundamentos');
    expect(screen.getByRole('button', { name: /^Fundamentos web,/ })).toBeOnTheScreen();
  });

  it('Sem frameworks', async () => {
    await open('/track/fundamentos-web');
    expect(screen.getAllByText('Fundamentos web').length).toBeGreaterThan(0);
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

  it('Voltar para a frente com animação', async () => {
    await open(`/study/${TRACK}/o-que-vamos-criar`);
    press('Mostrar resposta');
    press('Ver pergunta');
    // sem avançar timers: a volta ainda anima, mas "Mostrar resposta" já existe
    expect(screen.getByRole('button', { name: 'Mostrar resposta' })).toBeOnTheScreen();
    expect(screen.getByTestId('card-front')).toBeOnTheScreen();
  });
});
