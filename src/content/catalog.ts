// Catálogo dos temas empacotados no app. Para adicionar um tema, importe o
// theme.json dele aqui; o teste do catálogo falha se uma pasta de
// content/themes/ ficar sem registro.
//
// Cada tema passa pelo schema ao carregar para receber os valores padrão
// (origin, tags, relatedTerms). O gate do `npm test` garante que o parse
// nunca falha com o conteúdo do repositório.

import crud4Frameworks from '../../content/themes/crud-4-frameworks/theme.json';
import fundamentosWeb from '../../content/themes/fundamentos-web/theme.json';
import type { Language } from '../i18n/language';
import { themeSchema, type Theme } from './schema';
import { localizeTheme, themeTranslationSchema } from './translation';
import { translationRegistry } from './translations';

const registry: unknown[] = [crud4Frameworks, fundamentosWeb];

export const catalog: readonly Theme[] = registry.map((raw) => themeSchema.parse(raw));

export function getTheme(id: string): Theme | undefined {
  return catalog.find((theme) => theme.id === id);
}

const localized = new Map<Language, readonly Theme[]>();

/**
 * O catálogo no idioma pedido: PT-BR é o conteúdo original; nos outros idiomas,
 * cada tema recebe a tradução registrada, campo a campo. Memorizado por idioma
 * quando usa o registro padrão.
 */
export function getCatalog(
  language: Language,
  translations: Record<string, Record<string, unknown>> = translationRegistry,
): readonly Theme[] {
  if (language === 'pt-BR') return catalog;
  const useCache = translations === translationRegistry;
  const cached = useCache ? localized.get(language) : undefined;
  if (cached) return cached;
  const themes = catalog.map((theme) => {
    const raw = translations[theme.id]?.[language];
    return localizeTheme(theme, raw === undefined ? undefined : themeTranslationSchema.parse(raw));
  });
  if (useCache) localized.set(language, themes);
  return themes;
}

/** Compara as pastas de content/themes com os ids registrados, nos dois sentidos. */
export function compareRegistry(folders: string[], registeredIds: string[]): { unregistered: string[]; missing: string[] } {
  return {
    unregistered: folders.filter((f) => !registeredIds.includes(f)).sort(),
    missing: registeredIds.filter((id) => !folders.includes(id)).sort(),
  };
}
