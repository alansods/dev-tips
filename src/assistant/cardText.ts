// Texto do card enviado à API do chat: os campos do card (já no idioma atual),
// sem id nem termos relacionados, cortado no limite que a API aceita.

import type { Card } from '../content';
import { cardTitle } from '../study/rules';

export const MAX_CARD_TEXT = 8_000;

export function cardText(card: Card): string {
  const { id: _id, relatedTerms: _terms, ...fields } = card as Card & { relatedTerms?: unknown };
  return JSON.stringify(fields).slice(0, MAX_CARD_TEXT);
}

/** O que o chat mostra e envia sobre o card: tipo, título e texto. */
export const cardPayload = (card: Card) => ({ type: card.type, title: cardTitle(card), text: cardText(card) });
