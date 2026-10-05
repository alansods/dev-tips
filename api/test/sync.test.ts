import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';

import { clearDatabase, testApp } from './helpers/session';

type Card = {
  trackId: string;
  cardId: string;
  result: 'known' | 'unknown' | null;
  box: number | null;
  due: string | null;
  updatedAt: number;
};
type Pull = {
  cards: Card[];
  settings?: { language: string | null; preferredVariant: Record<string, string>; updatedAt: number };
  serverTime: number;
};

const card = (cardId: string, updatedAt: number, result: Card['result'] = 'known'): Card => ({
  trackId: 'crud-4-frameworks',
  cardId,
  result,
  box: result ? 2 : null,
  due: result ? '2026-10-05' : null,
  updatedAt,
});

/** App com relógio controlado (serverTime e server_updated_at previsíveis), perto do horário
 * real para os tokens de acesso emitidos no login não nascerem expirados. */
const BASE = Date.now();
let clock = BASE;
const sync = await testApp({ now: () => clock });

const put = (token: string, body: unknown) =>
  sync.app().request(
    '/sync',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    },
    env,
  );
const get = async (token: string, since?: number) => {
  const res = await sync
    .app()
    .request(
      `/sync${since === undefined ? '' : `?since=${since}`}`,
      { headers: { Authorization: `Bearer ${token}` } },
      env,
    );
  expect(res.status).toBe(200);
  return res.json<Pull>();
};

beforeEach(async () => {
  clock = BASE;
  await clearDatabase();
});

describe('Requirement: Enviar mudanças à API', () => {
  it('Mudança nova', async () => {
    const { accessToken } = await sync.login();
    expect((await put(accessToken, { cards: [card('cors', 100, 'unknown')] })).status).toBe(200);
    expect((await put(accessToken, { cards: [card('cors', 200, 'known')] })).status).toBe(200);
    const { cards } = await get(accessToken);
    expect(cards).toEqual([card('cors', 200, 'known')]);
  });

  it('Mudança antiga', async () => {
    const { accessToken } = await sync.login();
    await put(accessToken, { cards: [card('cors', 300, 'known')] });
    const res = await put(accessToken, { cards: [card('cors', 200, 'unknown')] });
    expect(res.status).toBe(200);
    expect((await get(accessToken)).cards).toEqual([card('cors', 300, 'known')]);
  });

  it('resposta traz o serverTime', async () => {
    const { accessToken } = await sync.login();
    clock = BASE + 5_000;
    const res = await put(accessToken, { cards: [card('cors', 100)] });
    expect(await res.json()).toEqual({ serverTime: BASE + 5_000 });
  });

  it('Corpo inválido', async () => {
    const { accessToken } = await sync.login();
    const { cardId: _omit, ...semCardId } = card('cors', 100);
    const res = await put(accessToken, { cards: [semCardId] });
    expect(res.status).toBe(400);
    expect((await res.json<{ error: { code: string } }>()).error.code).toBe('invalid_body');
  });

  it('mais de 500 cards', async () => {
    const { accessToken } = await sync.login();
    const cards = Array.from({ length: 501 }, (_, i) => card(`c${i}`, 100));
    const res = await put(accessToken, { cards });
    expect(res.status).toBe(400);
    expect((await res.json<{ error: { code: string } }>()).error.code).toBe('too_many_items');
  });

  it('Dados de outro usuário', async () => {
    const ana = await sync.login('google-sub-ana');
    const bruno = await sync.login('google-sub-bruno');
    await put(ana.accessToken, { cards: [card('cors', 100)] });
    expect((await get(ana.accessToken)).cards).toHaveLength(1);
    expect((await get(bruno.accessToken)).cards).toEqual([]);
  });

  it('zerado (tombstone) também é guardado', async () => {
    const { accessToken } = await sync.login();
    await put(accessToken, { cards: [card('cors', 100, 'known')] });
    await put(accessToken, { cards: [card('cors', 200, null)] });
    expect((await get(accessToken)).cards).toEqual([card('cors', 200, null)]);
  });

  it('preferências: a mais recente vence', async () => {
    const { accessToken } = await sync.login();
    await put(accessToken, {
      settings: { language: 'en', preferredVariant: { 'crud-4-frameworks': 'nest' }, updatedAt: 200 },
    });
    await put(accessToken, { settings: { language: 'pt-BR', preferredVariant: {}, updatedAt: 100 } });
    expect((await get(accessToken)).settings).toEqual({
      language: 'en',
      preferredVariant: { 'crud-4-frameworks': 'nest' },
      updatedAt: 200,
    });
  });

  it('exige conta', async () => {
    const res = await sync.app().request('/sync', {}, env);
    expect(res.status).toBe(401);
  });
});

describe('Requirement: Buscar mudanças da API', () => {
  it('Só o que mudou', async () => {
    const { accessToken } = await sync.login();
    clock = BASE + 100;
    await put(accessToken, { cards: [card('api', 10)] });
    clock = BASE + 300;
    await put(accessToken, { cards: [card('cors', 20)] });
    const pull = await get(accessToken, BASE + 200);
    expect(pull.cards.map((c) => c.cardId)).toEqual(['cors']);
    expect(pull.serverTime).toBe(BASE + 300);
  });

  it('Primeira busca', async () => {
    const { accessToken } = await sync.login();
    await put(accessToken, {
      cards: [card('api', 10), card('cors', 20)],
      settings: { language: null, preferredVariant: {}, updatedAt: 5 },
    });
    const pull = await get(accessToken);
    expect(pull.cards.map((c) => c.cardId).sort()).toEqual(['api', 'cors']);
    expect(pull.settings).toEqual({ language: null, preferredVariant: {}, updatedAt: 5 });
  });

  it('apagar a conta apaga o progresso na nuvem', async () => {
    const { accessToken } = await sync.login();
    await put(accessToken, {
      cards: [card('cors', 100)],
      settings: { language: 'en', preferredVariant: {}, updatedAt: 1 },
    });
    const del = await sync
      .app()
      .request('/me', { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }, env);
    expect(del.status).toBe(204);
    const left = await env.DB.prepare(
      'SELECT (SELECT COUNT(*) FROM card_progress) + (SELECT COUNT(*) FROM user_settings) AS n',
    ).first<{ n: number }>();
    expect(left?.n).toBe(0);
  });
});
