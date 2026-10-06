import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';
import { Platform } from 'react-native';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import HomeScreen from '../app/(tabs)/index';
import PaywallScreen from '../app/paywall';
import StudyScreen from '../app/study/[trackId]/[deckId]';
import TrackScreen from '../app/track/[trackId]';
import { ask } from '../assistant/api';
import { useAccountStore } from '../auth/store';
import { saveTokens } from '../auth/tokens';
import { resetStudyStore } from '../study/store';
import { useSubscriptionStore } from '../subscriptions/store';

jest.mock('../sync/useSync', () => ({ useSync: () => {} }));
jest.mock('../assistant/api', () => ({ ask: jest.fn() }));
jest.mock('../subscriptions/purchases', () => ({
  billingAvailable: jest.fn(() => true),
  purchasesLogIn: jest.fn(async () => {}),
  purchasesLogOut: jest.fn(async () => {}),
  monthlyPrice: jest.fn(async () => 'R$ 14,90'),
  purchaseMonthly: jest.fn(),
  restorePurchases: jest.fn(),
  manageSubscriptions: jest.fn(async () => {}),
}));
const askMock = jest.mocked(ask);

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  'track/[trackId]': TrackScreen,
  'study/[trackId]/[deckId]': StudyScreen,
  paywall: PaywallScreen,
};
const SESSION = '/study/crud-4-frameworks/glossario';

const ana = { id: 'u1', name: 'Ana', email: 'ana@example.com', photoUrl: null };
const PRO = {
  plan: 'pro' as const,
  source: 'store' as const,
  expiresAt: '2026-11-12T12:00:00.000Z',
  willRenew: true,
  questions: { used: 30, limit: 100 },
};
const answer = (text: string, inScope = true) =>
  ({ ok: true, answer: text, inScope, questions: { used: 31, limit: 100 } }) as const;

const flush = () =>
  act(async () => {
    for (let i = 0; i < 20; i++) await Promise.resolve();
  });
async function open(url = SESSION) {
  renderRouter(APP, { initialUrl: url });
  await flush();
}
const button = (name: string | RegExp) => screen.getByRole('button', { name });
const press = async (name: string | RegExp) => {
  fireEvent.press(button(name));
  await flush();
};
async function subscriber() {
  await saveTokens({ accessToken: 'a1', refreshToken: 'r1' });
  useAccountStore.setState({ user: ana });
  useSubscriptionStore.setState({ plan: PRO });
}
async function typeAndSend(text: string) {
  fireEvent.changeText(screen.getByLabelText('Sua pergunta'), text);
  await press('Enviar pergunta');
}
const lastAction = () => within(screen.getByTestId('session-actions')).getAllByRole('button').at(-1);

const os = Platform.OS;
const setOS = (value: string) => Object.defineProperty(Platform, 'OS', { value, configurable: true });

let fetchMock: jest.SpyInstance;
beforeEach(() => {
  resetStudyStore();
  askMock.mockReset();
  // O plano é consultado ao abrir; nos testes a API devolve o que já está no store.
  fetchMock = jest
    .spyOn(global, 'fetch')
    .mockImplementation(
      async () => ({ ok: true, status: 200, json: async () => useSubscriptionStore.getState().plan }) as Response,
    );
});
afterEach(() => {
  setOS(os);
  fetchMock.mockRestore();
});

describe('Requirement: Botão Perguntar na sessão', () => {
  it('Frente e verso', async () => {
    await open();
    expect(lastAction()).toHaveProp('accessibilityLabel', 'Perguntar sobre este card');
    await press('Mostrar resposta');
    expect(lastAction()).toHaveProp('accessibilityLabel', 'Perguntar sobre este card');
  });

  it('Sem conta', async () => {
    await open();
    expect(within(button('Perguntar sobre este card')).getByText('PRO')).toBeOnTheScreen();
    await press('Perguntar sobre este card');
    expect(screen).toHavePathname('/paywall');
  });

  it('Assinante', async () => {
    await subscriber();
    await open();
    expect(within(button('Perguntar sobre este card')).queryByText('PRO')).toBeNull();
    await press('Perguntar sobre este card');
    expect(screen.getByRole('header', { name: 'Dúvidas sobre este card' })).toBeOnTheScreen();
  });

  it('Web', async () => {
    setOS('web');
    await open();
    expect(screen.queryByRole('button', { name: 'Perguntar sobre este card' })).toBeNull();
  });
});

describe('Requirement: Chat do card', () => {
  beforeEach(subscriber);

  it('Chat vazio', async () => {
    await open();
    await press('Perguntar sobre este card');
    const sheet = within(screen.getByTestId('chat-sheet'));
    expect(sheet.getByText('API')).toBeOnTheScreen();
    expect(sheet.getByText('O que ficou confuso?')).toBeOnTheScreen();
    for (const s of ['Explique de outro jeito', 'Me dê um exemplo', 'Por que isso importa?'])
      expect(sheet.getByRole('button', { name: s })).toBeOnTheScreen();
    expect(sheet.getByText('A conversa recomeça quando você muda de card.')).toBeOnTheScreen();
    expect(sheet.getByText('Respostas geradas por IA podem conter erros.')).toBeOnTheScreen();
    expect(button('Enviar pergunta')).toBeDisabled();
  });

  it('Conversa recomeça em outro card', async () => {
    askMock.mockResolvedValue(answer('Resposta sobre API.'));
    await open();
    await press('Perguntar sobre este card');
    await typeAndSend('O que é?');
    expect(screen.getByText('Resposta sobre API.')).toBeOnTheScreen();
    await press('Fechar');
    await press('Mostrar resposta');
    await press('Já sabia');
    await press('Perguntar sobre este card');
    expect(screen.queryByText('Resposta sobre API.')).toBeNull();
    expect(screen.getByText('O que ficou confuso?')).toBeOnTheScreen();
  });

  it('Reabrir no mesmo card', async () => {
    askMock.mockResolvedValue(answer('Resposta sobre API.'));
    await open();
    await press('Perguntar sobre este card');
    await typeAndSend('O que é?');
    await press('Fechar');
    await press('Perguntar sobre este card');
    expect(screen.getByText('Resposta sobre API.')).toBeOnTheScreen();
  });
});

describe('Requirement: Enviar pergunta no app', () => {
  beforeEach(subscriber);

  it('Pergunta e resposta', async () => {
    let resolve: (v: Awaited<ReturnType<typeof ask>>) => void = () => {};
    askMock.mockReturnValue(new Promise((r) => (resolve = r)));
    await open();
    await press('Perguntar sobre este card');
    await typeAndSend('Por que o count não volta a 0?');
    expect(screen.getByText('Por que o count não volta a 0?')).toBeOnTheScreen();
    expect(screen.getByText('digitando…')).toBeOnTheScreen();
    await act(async () => resolve(answer('Porque roda uma vez.')));
    await flush();
    expect(screen.queryByText('digitando…')).toBeNull();
    expect(screen.getByText('Porque roda uma vez.')).toBeOnTheScreen();
    const payload = askMock.mock.calls[0][0];
    expect(payload).toMatchObject({ question: 'Por que o count não volta a 0?', language: 'pt-BR', history: [] });
    expect(payload.card.title).toBe('API');
  });

  it('Sugestão', async () => {
    askMock.mockResolvedValue(answer('Um exemplo.'));
    await open();
    await press('Perguntar sobre este card');
    await press('Me dê um exemplo');
    expect(askMock.mock.calls[0][0].question).toBe('Me dê um exemplo');
  });

  it('Bloco de código', async () => {
    askMock.mockResolvedValue(answer('Veja:\n```js\nconst x = 1;\n```\nPronto.'));
    await open();
    await press('Perguntar sobre este card');
    await typeAndSend('Exemplo?');
    expect(screen.getByTestId('code-block')).toHaveTextContent('const x = 1;');
    expect(screen.getByText('Veja:')).toBeOnTheScreen();
  });

  it('Fora deste card', async () => {
    askMock.mockResolvedValue(answer('Só consigo ajudar com o conteúdo deste card: API.', false));
    await open();
    await press('Perguntar sobre este card');
    await typeAndSend('React ou Vue?');
    expect(screen.getByText('Fora deste card')).toBeOnTheScreen();
    expect(button('Explique de outro jeito')).toBeOnTheScreen();
  });
});

describe('Requirement: Erros e cota no chat', () => {
  beforeEach(subscriber);

  it('Sem conexão', async () => {
    askMock.mockResolvedValue({ ok: false, reason: 'offline' });
    await open();
    await press('Perguntar sobre este card');
    await typeAndSend('Oi');
    expect(screen.getByText('Sem conexão. Tente de novo quando estiver online.')).toBeOnTheScreen();
    expect(button('Tentar de novo')).toBeOnTheScreen();
  });

  it('Tentar de novo', async () => {
    askMock.mockResolvedValueOnce({ ok: false, reason: 'error' }).mockResolvedValueOnce(answer('Agora foi.'));
    await open();
    await press('Perguntar sobre este card');
    await typeAndSend('Oi');
    expect(screen.getByText('Não consegui responder agora.')).toBeOnTheScreen();
    await press('Tentar de novo');
    expect(askMock.mock.calls[1][0].question).toBe('Oi');
    expect(screen.getByText('Agora foi.')).toBeOnTheScreen();
  });

  it('Cota esgotada', async () => {
    askMock.mockResolvedValue({ ok: false, reason: 'quota' });
    await open();
    await press('Perguntar sobre este card');
    await typeAndSend('Oi');
    expect(screen.getByText('Você usou as 100 perguntas do mês')).toBeOnTheScreen();
    expect(screen.getByText('100 de 100 · renova em 12/11/2026')).toBeOnTheScreen();
    expect(screen.queryByLabelText('Sua pergunta')).toBeNull();
    expect(screen.getByText('Oi')).toBeOnTheScreen();
  });

  it('Assinatura expirou', async () => {
    askMock.mockResolvedValue({ ok: false, reason: 'pro_required' });
    await open();
    await press('Perguntar sobre este card');
    await typeAndSend('Oi');
    expect(screen).toHavePathname('/paywall');
  });
});
