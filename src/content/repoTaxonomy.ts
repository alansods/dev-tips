// O cadastro de linguagens e frameworks do repositório, já validado. O gate
// do `npm test` garante que content/taxonomy.json é válido.

import raw from '../../content/taxonomy.json';
import { taxonomySchema, type Taxonomy } from './taxonomy';

export const repoTaxonomy: Taxonomy = taxonomySchema.parse(raw);
