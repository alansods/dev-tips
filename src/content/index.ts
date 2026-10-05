export { validateCatalog, validateTrack, type CatalogResult, type TrackResult } from './validate';
export { getGlossary } from './glossary';
export { AREAS, LEVELS, SECTIONS, SNIPPET_LANGUAGES, trackSchema } from './schema';
export { placementOf, validateTaxonomy, type Framework, type Language, type Placement, type Taxonomy, type TaxonomyResult } from './taxonomy';
export { repoTaxonomy } from './repoTaxonomy';
export type { ContentError } from './errors';
export type {
  Area,
  Card,
  CodeCard,
  CompareCard,
  CompareColumn,
  ConceptCard,
  Deck,
  EndpointCard,
  Level,
  Section,
  QuestionCard,
  Snippet,
  SnippetLanguage,
  StepCard,
  Track,
  Variant,
} from './schema';
