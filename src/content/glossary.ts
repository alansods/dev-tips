import type { ConceptCard, Track } from './schema';

/** O glossário de uma trilha: todos os cards `concept`, na ordem em que aparecem. */
export function getGlossary(track: Track): ConceptCard[] {
  return track.decks.flatMap((deck) => deck.cards.filter((card): card is ConceptCard => card.type === 'concept'));
}
