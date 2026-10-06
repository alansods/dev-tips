// Chamada ao chat da API (POST /assistant/ask), com os erros já traduzidos
// para o que a tela precisa mostrar.

import { ApiError, authFetch, NetworkError } from '../auth/api';
import type { Language } from '../i18n';

export type ChatRole = 'user' | 'assistant';
export type AskPayload = {
  card: { type: string; title: string; text: string };
  history: { role: ChatRole; text: string }[];
  question: string;
  language: Language;
};
type AskResponse = { answer: string; inScope: boolean; questions: { used: number; limit: number | null } };

export type AskFailure = 'offline' | 'pro_required' | 'quota' | 'error';
export type AskResult = ({ ok: true } & AskResponse) | { ok: false; reason: AskFailure };

export async function ask(payload: AskPayload): Promise<AskResult> {
  try {
    const res = await authFetch<AskResponse>('/assistant/ask', { method: 'POST', body: JSON.stringify(payload) });
    return { ok: true, ...res };
  } catch (e) {
    if (e instanceof NetworkError) return { ok: false, reason: 'offline' };
    if (e instanceof ApiError && e.code === 'pro_required') return { ok: false, reason: 'pro_required' };
    if (e instanceof ApiError && e.status === 429) return { ok: false, reason: 'quota' };
    return { ok: false, reason: 'error' };
  }
}
