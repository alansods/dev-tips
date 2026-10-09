import { z } from 'zod';

import { TECH_ICON_SLUGS } from './techIcons.generated';

/** Texto obrigatório: não pode ser vazio nem só espaços. O valor é preservado sem trim. */
const text = () =>
  z.string().refine((s) => s.trim().length > 0, { error: 'não pode ficar vazio' });

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const id = () => z.string().regex(KEBAB, { error: 'deve estar em kebab-case (a-z, 0-9 e -)' });

/** Áreas do catálogo, na ordem de exibição. */
export const AREAS = ['fundamentos', 'git', 'frontend', 'backend', 'banco-de-dados', 'mobile', 'devops', 'simulacoes'] as const;

/** Data de inclusão das áreas que têm uma (as mais antigas não têm). Usada em "Novidades". */
export const AREA_ADDED_AT: Partial<Record<(typeof AREAS)[number], string>> = { simulacoes: '2026-10-09' };

/** Tipos de entrada do catálogo: trilha de estudo ou simulação de entrevista. */
export const TRACK_KINDS = ['track', 'simulation'] as const;

/** Seções que agrupam trilhas diretas dentro de uma área, na ordem de exibição. */
export const SECTIONS = ['relacionais', 'nao-relacionais', 'ci-cd', 'aws'] as const;

/** Senioridade em que o assunto do card costuma ser cobrado. */
export const LEVELS = ['junior', 'pleno', 'senior'] as const;

const cardBase = {
  id: id(),
  level: z.enum(LEVELS, { error: 'nível deve ser "junior", "pleno" ou "senior"' }),
  origin: z.enum(['original', 'supplement'], { error: 'deve ser "original" ou "supplement"' }).default('original'),
  tags: z.array(text()).default([]),
  relatedTerms: z.array(id()).default([]),
};

export const conceptCardSchema = z.object({
  ...cardBase,
  type: z.literal('concept'),
  term: text(),
  definition: text(),
  frontendAnalogy: text().optional(),
  aliases: z.array(text()).optional(),
});

export const SNIPPET_LANGUAGES = ['bash', 'ts', 'js', 'java', 'python', 'csharp', 'ruby', 'sql', 'xml', 'properties', 'json', 'yaml', 'text'] as const;

export const snippetSchema = z.object({
  file: text(),
  language: z.enum(SNIPPET_LANGUAGES, { error: `linguagem não suportada; use: ${SNIPPET_LANGUAGES.join(', ')}` }),
  code: text(),
  note: text().optional(),
});

const httpStatus = () => z.int().min(100, { error: 'status HTTP deve estar entre 100 e 599' }).max(599, { error: 'status HTTP deve estar entre 100 e 599' });

export const endpointCardSchema = z.object({
  ...cardBase,
  type: z.literal('endpoint'),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], { error: 'método deve ser GET, POST, PUT, PATCH ou DELETE' }),
  path: z.string().startsWith('/', { error: 'o caminho deve começar com /' }),
  operation: z.enum(['C', 'R', 'U', 'D'], { error: 'operação deve ser C, R, U ou D' }),
  description: text(),
  successStatus: httpStatus(),
  errorStatuses: z.array(httpStatus()).optional(),
});

export const stepCardSchema = z.object({
  ...cardBase,
  type: z.literal('step'),
  number: z.int().min(1, { error: 'o número do passo deve ser um inteiro ≥ 1' }),
  title: text(),
  whatIs: text(),
  whyItMatters: text(),
  snippets: z.record(z.string(), snippetSchema),
});

export const compareCardSchema = z.object({
  ...cardBase,
  type: z.literal('compare'),
  concept: text(),
  explanation: text(),
  values: z.record(z.string(), text()),
});

export const codeCardSchema = z.object({
  ...cardBase,
  type: z.literal('code'),
  title: text(),
  body: text(),
  snippet: snippetSchema,
  variant: z.string().optional(),
});

export const questionCardSchema = z.object({
  ...cardBase,
  type: z.literal('question'),
  question: text(),
  answer: text(),
  snippet: snippetSchema.optional(),
});

export const interviewCardSchema = z.object({
  ...cardBase,
  type: z.literal('interview'),
  question: text(),
  answer: text(),
  why: text().optional(),
  watchOut: text().optional(),
  snippet: snippetSchema.optional(),
});

export const cardSchema = z.discriminatedUnion('type', [
  endpointCardSchema,
  stepCardSchema,
  compareCardSchema,
  conceptCardSchema,
  codeCardSchema,
  questionCardSchema,
  interviewCardSchema,
]);

/** Nome de um logo do conjunto gerado por `npm run tech-icons`. */
export const logoSlug = () => z.enum(TECH_ICON_SLUGS, { error: 'logo desconhecido; rode npm run tech-icons' });

/** Ícone próprio da trilha: um logo do conjunto ou uma sigla curta. */
export const trackIconSchema = z
  .strictObject({
    logo: logoSlug().optional(),
    text: z
      .string()
      .refine((s) => s.trim().length >= 1 && s.length <= 4, { error: 'a sigla deve ter de 1 a 4 caracteres' })
      .optional(),
  })
  .refine((icon) => (icon.logo === undefined) !== (icon.text === undefined), {
    error: 'use "logo" ou "text", um dos dois',
  });

export const variantSchema = z.object({ id: id(), name: text(), language: text() });
export const compareColumnSchema = z.object({ id: id(), label: text() });

export const deckSchema = z.object({
  id: id(),
  title: text(),
  description: text().optional(),
  cards: z.array(cardSchema).min(1, { error: 'o deck precisa de pelo menos um card' }),
});

/** O caso de uma simulação: o contexto apresentado pelo entrevistador e a stack. */
export const scenarioSchema = z.object({
  context: text(),
  stack: z.array(text()).min(1, { error: 'a stack precisa de pelo menos um item' }),
});

export const trackSchema = z.object({
  id: id(),
  kind: z.enum(TRACK_KINDS, { error: 'kind deve ser "track" ou "simulation"' }).default('track'),
  scenario: scenarioSchema.optional(),
  title: text(),
  description: text(),
  areas: z.array(z.enum(AREAS, { error: `área desconhecida; use: ${AREAS.join(', ')}` })).min(1, { error: 'a trilha precisa de pelo menos uma área' }),
  language: id().optional(),
  framework: id().optional(),
  icon: trackIconSchema.optional(),
  prerequisites: z.array(id()).default([]),
  addedAt: z
    .string()
    .refine((s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && new Date(`${s}T00:00:00Z`).toISOString().startsWith(s), {
      error: 'data deve estar no formato AAAA-MM-DD e existir',
    })
    .optional(),
  section: z.enum(SECTIONS, { error: `seção desconhecida; use: ${SECTIONS.join(', ')}` }).optional(),
  variants: z.array(variantSchema).optional(),
  compareColumns: z.array(compareColumnSchema).optional(),
  decks: z.array(deckSchema).min(1, { error: 'a trilha precisa de pelo menos um deck' }),
});

export type Track = z.output<typeof trackSchema>;
export type TrackIconField = z.output<typeof trackIconSchema>;
export type Area = (typeof AREAS)[number];
export type Level = (typeof LEVELS)[number];
export type Section = (typeof SECTIONS)[number];
export type Deck = z.output<typeof deckSchema>;
export type Card = z.output<typeof cardSchema>;
export type ConceptCard = z.output<typeof conceptCardSchema>;
export type EndpointCard = z.output<typeof endpointCardSchema>;
export type StepCard = z.output<typeof stepCardSchema>;
export type CompareCard = z.output<typeof compareCardSchema>;
export type CodeCard = z.output<typeof codeCardSchema>;
export type QuestionCard = z.output<typeof questionCardSchema>;
export type InterviewCard = z.output<typeof interviewCardSchema>;
export type Scenario = z.output<typeof scenarioSchema>;
export type Snippet = z.output<typeof snippetSchema>;
export type SnippetLanguage = (typeof SNIPPET_LANGUAGES)[number];
export type Variant = z.output<typeof variantSchema>;
export type CompareColumn = z.output<typeof compareColumnSchema>;

/** A entrada é uma simulação de entrevista (e não uma trilha de estudo). */
export const isSimulation = (track: Pick<Track, 'kind'>): boolean => track.kind === 'simulation';
