// Servidor de sincronização falso, em memória, com as mesmas regras da API
// (a mudança mais recente vence; since pelo relógio do servidor).

import { API_URL } from '../../auth/config';

export type Card = {
  trackId: string;
  cardId: string;
  result: 'known' | 'unknown' | null;
  box: number | null;
  due: string | null;
  updatedAt: number;
};
type Settings = { language: 'pt-BR' | 'en' | null; preferredVariant: Record<string, string>; updatedAt: number };

export function fakeServer() {
  let clock = 1_000;
  const cards = new Map<string, Card & { serverAt: number }>();
  let settings: (Settings & { serverAt: number }) | null = null;
  let offline = false;
  const calls: string[] = [];

  const json = (status: number, body: unknown) =>
    ({ ok: status < 400, status, json: async () => body }) as unknown as Response;

  function handle(url: string, init: RequestInit = {}): Response {
    const path = url.replace(API_URL, '');
    const method = init.method ?? 'GET';
    calls.push(`${method} ${path.split('?')[0]}`);
    clock += 10;
    if (method === 'PUT' && path === '/sync') {
      const body = JSON.parse(String(init.body)) as { cards?: Card[]; settings?: Settings };
      for (const c of body.cards ?? []) server.putCard(c);
      if (body.settings && (!settings || body.settings.updatedAt > settings.updatedAt)) {
        settings = { ...body.settings, serverAt: clock };
      }
      return json(200, { serverTime: clock });
    }
    if (method === 'GET' && path.startsWith('/sync')) {
      const since = Number(new URL(`http://x${path}`).searchParams.get('since') ?? -1);
      const out = [...cards.values()].filter((c) => c.serverAt > since).map(({ serverAt: _s, ...c }) => c);
      const s = settings && settings.serverAt > since ? (({ serverAt: _s, ...rest }) => rest)(settings) : undefined;
      return json(200, { cards: out, ...(s ? { settings: s } : {}), serverTime: clock });
    }
    if (method === 'POST' && path === '/auth/logout') return json(204, null);
    throw new Error(`rota inesperada no servidor falso: ${method} ${path}`);
  }

  const server = {
    calls,
    /** Mudança vinda de "outro aparelho". */
    putCard(c: Card) {
      const key = `${c.trackId}:${c.cardId}`;
      const old = cards.get(key);
      clock += 1; // cada gravação ganha um horário de servidor novo, como na API
      if (!old || c.updatedAt > old.updatedAt) cards.set(key, { ...c, serverAt: clock });
    },
    card: (trackId: string, cardId: string) => {
      const c = cards.get(`${trackId}:${cardId}`);
      return c ? (({ serverAt: _s, ...rest }) => rest)(c) : undefined;
    },
    cardCount: () => cards.size,
    settings: () => settings,
    setOffline(v: boolean) {
      offline = v;
    },
    install(): jest.SpyInstance {
      return jest.spyOn(global, 'fetch').mockImplementation(async (url: string | URL | Request, init?: RequestInit) => {
        if (offline) throw new TypeError('Network request failed');
        return handle(String(url), init);
      });
    },
  };
  return server;
}
