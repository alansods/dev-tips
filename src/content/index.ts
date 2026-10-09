export { validateCatalog, validateTrack, type CatalogResult, type TrackResult } from './validate';
export { getGlossary } from './glossary';
export { AREA_ADDED_AT, AREAS, isSimulation, LEVELS, SECTIONS, SNIPPET_LANGUAGES, trackSchema } from './schema';
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
  InterviewCard,
  QuestionCard,
  Scenario,
  Snippet,
  SnippetLanguage,
  StepCard,
  Track,
  Variant,
} from './schema';
