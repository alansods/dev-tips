import type { ConceptCard, Theme } from './schema';

/** O glossário de um tema: todos os cards `concept`, na ordem em que aparecem. */
export function getGlossary(theme: Theme): ConceptCard[] {
  return theme.decks.flatMap((deck) => deck.cards.filter((card): card is ConceptCard => card.type === 'concept'));
}
