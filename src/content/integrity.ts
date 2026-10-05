// Passada de integridade: regras que cruzam partes da trilha (unicidade,
// referências, cobertura de variantes e colunas). Roda sobre o input CRU, de
// forma defensiva, para reportar esses erros mesmo quando a estrutura também
// falhou. Nós com formato inesperado são ignorados aqui: a passada estrutural
// já os reporta.

import { formatPath, type ContentError, type PathSegment } from './errors';

type Obj = Record<string, unknown>;
type Push = (path: PathSegment[], message: string) => void;

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);

/** Ids declarados numa lista de `{ id }`, ou `undefined` se a lista não foi declarada. */
function declaredIds(value: unknown): Set<string> | undefined {
  if (!Array.isArray(value)) return undefined;
  return new Set(value.map((item) => (isObj(item) ? str(item.id) : undefined)).filter((v): v is string => v !== undefined));
}

export function checkIntegrity(input: unknown): ContentError[] {
  const errors: ContentError[] = [];
  if (!isObj(input)) return errors;
  const push: Push = (path, message) => errors.push({ path: formatPath(path), message });

  checkUniqueIds(input.variants, 'variants', 'variante', push);
  checkUniqueIds(input.compareColumns, 'compareColumns', 'coluna', push);

  const variants = declaredIds(input.variants);
  const columns = declaredIds(input.compareColumns);

  checkUniqueIds(input.decks, 'decks', 'deck', push);
  checkCardsAcrossTrack(input.decks, push);

  list(input.decks).forEach((deck, d) => {
    if (!isObj(deck)) return;
    const stepNumbers = new Set<number>();
    list(deck.cards).forEach((card, c) => {
      if (!isObj(card)) return;
      const at = ['decks', d, 'cards', c];
      switch (card.type) {
        case 'step':
          checkStep(card, at, variants, stepNumbers, push);
          break;
        case 'compare':
          checkKeysCover(card.values, [...at, 'values'], columns, 'compareColumns', 'compare', 'coluna', 'o valor da coluna', push);
          break;
        case 'code': {
          const variant = str(card.variant);
          if (variant !== undefined && !variants?.has(variant)) push([...at, 'variant'], `variante desconhecida: ${variant}`);
          break;
        }
      }
    });
  });

  return errors;
}

function checkUniqueIds(value: unknown, key: string, label: string, push: Push) {
  const seen = new Set<string>();
  list(value).forEach((item, i) => {
    const itemId = isObj(item) ? str(item.id) : undefined;
    if (itemId === undefined) return;
    if (seen.has(itemId)) push([key, i, 'id'], `id de ${label} duplicado: ${itemId}`);
    seen.add(itemId);
  });
}

/** Unicidade de ids de card e de termos na trilha inteira, e validade de `relatedTerms`. */
function checkCardsAcrossTrack(decks: unknown, push: Push) {
  const cards: { card: Obj; at: PathSegment[] }[] = [];
  list(decks).forEach((deck, d) => {
    if (!isObj(deck)) return;
    list(deck.cards).forEach((card, c) => {
      if (isObj(card)) cards.push({ card, at: ['decks', d, 'cards', c] });
    });
  });

  const typeById = new Map<string, unknown>();
  const terms = new Set<string>();
  for (const { card, at } of cards) {
    const cardId = str(card.id);
    if (cardId !== undefined) {
      if (typeById.has(cardId)) push([...at, 'id'], `id de card duplicado na trilha: ${cardId}`);
      else typeById.set(cardId, card.type);
    }
    const term = card.type === 'concept' ? str(card.term) : undefined;
    if (term !== undefined && term.trim()) {
      const key = term.trim().toLowerCase();
      if (terms.has(key)) push([...at, 'term'], `termo duplicado na trilha: ${term}`);
      terms.add(key);
    }
  }

  for (const { card, at } of cards) {
    const seen = new Set<string>();
    list(card.relatedTerms).forEach((ref, i) => {
      if (typeof ref !== 'string') return;
      const path = [...at, 'relatedTerms', i];
      if (seen.has(ref)) push(path, `termo relacionado repetido: ${ref}`);
      seen.add(ref);
      if (!typeById.has(ref)) push(path, `termo relacionado inexistente: ${ref}`);
      else if (typeById.get(ref) !== 'concept') push(path, `termo relacionado precisa ser um card concept: ${ref}`);
      else if (card.type === 'concept' && ref === card.id) push(path, `um concept não pode listar a si mesmo: ${ref}`);
    });
  }
}

function checkStep(card: Obj, at: PathSegment[], variants: Set<string> | undefined, numbers: Set<number>, push: Push) {
  checkKeysCover(card.snippets, [...at, 'snippets'], variants, 'variants', 'step', 'variante', 'o snippet da variante', push);
  if (typeof card.number === 'number') {
    if (numbers.has(card.number)) push([...at, 'number'], `número de passo repetido no deck: ${card.number}`);
    numbers.add(card.number);
  }
}

/** Confere que as chaves de um mapa são exatamente os ids declarados na trilha. */
function checkKeysCover(
  map: unknown,
  at: PathSegment[],
  declared: Set<string> | undefined,
  trackKey: string,
  cardType: string,
  label: string,
  missingLabel: string,
  push: Push,
) {
  if (declared === undefined) {
    push(at.slice(0, -1), `cards ${cardType} exigem ${trackKey} declarado na trilha`);
    return;
  }
  if (!isObj(map)) return;
  for (const key of declared) if (!(key in map)) push([...at, key], `falta ${missingLabel} ${key}`);
  for (const key of Object.keys(map)) if (!declared.has(key)) push([...at, key], `${label} desconhecida: ${key}`);
}
