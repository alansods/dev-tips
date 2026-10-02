// Tradução de um tema (content/themes/<id>/translations/<idioma>.json): só os
// textos exibidos, organizados por id. Tudo é opcional; o que faltar aparece
// no idioma original. Código, ids, métodos, caminhos e status nunca se traduzem.

import { z } from 'zod';
import { pt } from 'zod/locales';

import { formatPath, type ContentError, type PathSegment } from './errors';
import type { Card, Theme } from './schema';

const text = () => z.string().refine((s) => s.trim().length > 0, { error: 'não pode ficar vazio' });
const optionalText = () => text().optional();
const textList = () => z.array(text()).optional();
const snippetNote = z.strictObject({ note: optionalText() });

/** Campos traduzíveis de cada tipo de card. */
const cardTranslationSchemas = {
  endpoint: z.strictObject({ tags: textList(), description: optionalText() }),
  step: z.strictObject({
    tags: textList(),
    title: optionalText(),
    whatIs: optionalText(),
    whyItMatters: optionalText(),
    snippets: z.record(z.string(), snippetNote).optional(),
  }),
  compare: z.strictObject({
    tags: textList(),
    concept: optionalText(),
    explanation: optionalText(),
    values: z.record(z.string(), text()).optional(),
  }),
  concept: z.strictObject({
    tags: textList(),
    term: optionalText(),
    definition: optionalText(),
    frontendAnalogy: optionalText(),
    aliases: textList(),
  }),
  code: z.strictObject({ tags: textList(), title: optionalText(), body: optionalText(), snippet: snippetNote.optional() }),
  question: z.strictObject({
    tags: textList(),
    question: optionalText(),
    answer: optionalText(),
    snippet: snippetNote.optional(),
  }),
} satisfies Record<Card['type'], z.ZodType>;

export const themeTranslationSchema = z.strictObject({
  title: optionalText(),
  description: optionalText(),
  compareColumns: z.record(z.string(), text()).optional(),
  decks: z.record(z.string(), z.strictObject({ title: optionalText(), description: optionalText() })).optional(),
  cards: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
});

export type ThemeTranslation = z.output<typeof themeTranslationSchema>;
type CardTranslation = { [K in Card['type']]: z.output<(typeof cardTranslationSchemas)[K]> };

const ptErrors = pt().localeError;

/** Erros do Zod como ContentError; chave sobrando vira um erro no caminho da própria chave. */
function zodErrors(result: z.ZodSafeParseResult<unknown>, prefix: PathSegment[]): ContentError[] {
  if (result.success) return [];
  return result.error.issues.flatMap((issue) => {
    const base = [...prefix, ...(issue.path as PathSegment[])];
    if (issue.code === 'unrecognized_keys') {
      return issue.keys.map((key) => ({ path: formatPath([...base, key]), message: 'campo que não se traduz' }));
    }
    return [{ path: formatPath(base), message: issue.message }];
  });
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Valida a tradução contra o tema: formato, campos por tipo de card e ids existentes. */
export function validateTranslation(theme: Theme, input: unknown): ContentError[] {
  const errors = zodErrors(themeTranslationSchema.safeParse(input, { error: ptErrors }), []);
  if (!isObj(input)) return errors;

  const missing = (path: PathSegment[], what: string) =>
    errors.push({ path: formatPath(path), message: `${what} não existe no tema` });

  const deckIds = new Set(theme.decks.map((d) => d.id));
  const columnIds = new Set((theme.compareColumns ?? []).map((c) => c.id));
  const cards = new Map(theme.decks.flatMap((d) => d.cards).map((c) => [c.id, c]));

  if (isObj(input.decks)) for (const id of Object.keys(input.decks)) if (!deckIds.has(id)) missing(['decks', id], 'deck');
  if (isObj(input.compareColumns))
    for (const id of Object.keys(input.compareColumns)) if (!columnIds.has(id)) missing(['compareColumns', id], 'coluna');

  if (isObj(input.cards)) {
    for (const [id, raw] of Object.entries(input.cards)) {
      const card = cards.get(id);
      if (!card) {
        missing(['cards', id], 'card');
        continue;
      }
      errors.push(...zodErrors(cardTranslationSchemas[card.type].safeParse(raw, { error: ptErrors }), ['cards', id]));
      if (!isObj(raw)) continue;
      if (card.type === 'step' && isObj(raw.snippets)) {
        for (const v of Object.keys(raw.snippets)) if (!(v in card.snippets)) missing(['cards', id, 'snippets', v], 'variante');
      }
      if (card.type === 'compare' && isObj(raw.values)) {
        for (const c of Object.keys(raw.values)) if (!columnIds.has(c)) missing(['cards', id, 'values', c], 'coluna');
      }
    }
  }
  return errors;
}

/** O tema com os textos traduzidos por cima, campo a campo; sem tradução, devolve o próprio tema. */
export function localizeTheme(theme: Theme, translation: ThemeTranslation | undefined): Theme {
  if (!translation) return theme;
  const cards = translation.cards ?? {};
  return {
    ...theme,
    title: translation.title ?? theme.title,
    description: translation.description ?? theme.description,
    compareColumns: theme.compareColumns?.map((col) => ({ ...col, label: translation.compareColumns?.[col.id] ?? col.label })),
    decks: theme.decks.map((deck) => {
      const d = translation.decks?.[deck.id];
      return {
        ...deck,
        title: d?.title ?? deck.title,
        description: d?.description ?? deck.description,
        cards: deck.cards.map((card) => localizeCard(card, cards[card.id])),
      };
    }),
  };
}

function localizeCard(card: Card, raw: Record<string, unknown> | undefined): Card {
  if (!raw) return card;
  const tr = raw as Partial<CardTranslation[Card['type']]>;
  const { snippets, snippet, values, ...texts } = tr as Record<string, unknown> & {
    snippets?: Record<string, { note?: string }>;
    snippet?: { note?: string };
    values?: Record<string, string>;
  };
  const out = { ...card, ...texts } as Card;
  if (out.type === 'step' && snippets) {
    out.snippets = Object.fromEntries(
      Object.entries(out.snippets).map(([v, s]) => [v, { ...s, note: snippets[v]?.note ?? s.note }]),
    );
  }
  if ((out.type === 'code' || out.type === 'question') && snippet && out.snippet) {
    out.snippet = { ...out.snippet, note: snippet.note ?? out.snippet.note };
  }
  if (out.type === 'compare' && values) out.values = { ...out.values, ...values };
  return out;
}

/** Campos de texto exibidos de cada tipo de card que a tradução precisa cobrir. */
const COVERED_FIELDS: { [K in Card['type']]: string[] } = {
  endpoint: ['description'],
  step: ['title', 'whatIs', 'whyItMatters'],
  compare: ['concept', 'explanation'],
  concept: ['term', 'definition', 'frontendAnalogy'],
  code: ['title', 'body'],
  question: ['question', 'answer'],
};

/**
 * Caminhos de texto exibido que existem no original e não têm tradução.
 * Ficam de fora `tags`, `aliases` e `values` (tradução editorial) e o código.
 */
export function missingTranslations(theme: Theme, translation: ThemeTranslation): string[] {
  const missing: string[] = [];
  if (!translation.title) missing.push('title');
  if (!translation.description) missing.push('description');
  for (const col of theme.compareColumns ?? []) {
    if (!translation.compareColumns?.[col.id]) missing.push(`compareColumns.${col.id}`);
  }
  for (const deck of theme.decks) {
    const d = translation.decks?.[deck.id];
    if (!d?.title) missing.push(`decks.${deck.id}.title`);
    if (deck.description && !d?.description) missing.push(`decks.${deck.id}.description`);
    for (const card of deck.cards) {
      const tr = (translation.cards?.[card.id] ?? {}) as Record<string, unknown>;
      const original = card as unknown as Record<string, unknown>;
      for (const field of COVERED_FIELDS[card.type]) {
        if (original[field] !== undefined && !tr[field]) missing.push(`cards.${card.id}.${field}`);
      }
      if (card.type === 'step') {
        const notes = tr.snippets as Record<string, { note?: string }> | undefined;
        for (const [variant, snippet] of Object.entries(card.snippets)) {
          if (snippet.note && !notes?.[variant]?.note) missing.push(`cards.${card.id}.snippets.${variant}.note`);
        }
      }
      if ((card.type === 'code' || card.type === 'question') && card.snippet?.note) {
        if (!(tr.snippet as { note?: string } | undefined)?.note) missing.push(`cards.${card.id}.snippet.note`);
      }
    }
  }
  return missing;
}
