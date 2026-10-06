// Conversa do chat "Perguntar" para o card atual. Fica só em memória e
// guardada junto com o id do card: trocar de card mostra uma conversa vazia;
// fechar e reabrir o chat no mesmo card a mantém.

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Card } from '../content';
import type { Language } from '../i18n';
import { useSubscriptionStore } from '../subscriptions/store';
import { ask, type AskFailure, type ChatRole } from './api';
import { cardPayload } from './cardText';

export type ChatMessage = { role: ChatRole; text: string; inScope?: boolean };
export type ChatStatus = 'idle' | 'sending' | AskFailure;

/** Mensagens anteriores enviadas junto com cada pergunta. */
export const HISTORY_SIZE = 6;

type Chat = { cardId: string; messages: ChatMessage[]; status: ChatStatus; pending: string | null };
const empty = (cardId: string): Chat => ({ cardId, messages: [], status: 'idle', pending: null });

export function useCardChat(card: Card, language: Language, options: { onProRequired?: () => void } = {}) {
  const { onProRequired } = options;
  const [stored, setStored] = useState<Chat>(() => empty(card.id));
  const chat = stored.cardId === card.id ? stored : empty(card.id);
  const currentCard = useRef(card.id);
  useEffect(() => {
    currentCard.current = card.id;
  }, [card.id]);

  /** Atualiza a conversa deste card (descarta se o usuário já mudou de card). */
  const update = useCallback(
    (cardId: string, change: (c: Chat) => Chat) =>
      setStored((s) => (cardId === currentCard.current ? change(s.cardId === cardId ? s : empty(cardId)) : s)),
    [],
  );

  const request = useCallback(
    async (question: string, before: ChatMessage[]) => {
      const cardId = card.id;
      update(cardId, (c) => ({ ...c, status: 'sending', pending: question }));
      const result = await ask({
        card: cardPayload(card),
        history: before.slice(-HISTORY_SIZE).map(({ role, text }) => ({ role, text })),
        question,
        language,
      });
      if (!result.ok) {
        update(cardId, (c) => ({ ...c, status: result.reason }));
        if (result.reason === 'pro_required') onProRequired?.();
        return;
      }
      const reply: ChatMessage = result.inScope
        ? { role: 'assistant', text: result.answer }
        : { role: 'assistant', text: result.answer, inScope: false };
      update(cardId, (c) => ({ ...c, messages: [...c.messages, reply], status: 'idle', pending: null }));
      const { plan, setPlan } = useSubscriptionStore.getState();
      if (plan) setPlan({ ...plan, questions: result.questions });
    },
    [card, language, onProRequired, update],
  );

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || chat.status === 'sending') return;
      const before = chat.messages;
      update(card.id, (c) => ({ ...c, messages: [...c.messages, { role: 'user', text: question }] }));
      await request(question, before);
    },
    [card.id, chat, request, update],
  );

  /** Reenvia a última pergunta que falhou (a mensagem dela já está na tela). */
  const retry = useCallback(async () => {
    if (!chat.pending) return;
    await request(chat.pending, chat.messages.slice(0, -1));
  }, [chat, request]);

  return { messages: chat.messages, status: chat.status, send, retry };
}
