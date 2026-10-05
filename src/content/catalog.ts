// Catálogo das trilhas empacotadas no app. Para adicionar uma trilha, importe o
// track.json dela aqui; o teste do catálogo falha se uma pasta de
// content/tracks/ ficar sem registro.
//
// Cada trilha passa pelo schema ao carregar para receber os valores padrão
// (origin, tags, relatedTerms). O gate do `npm test` garante que o parse
// nunca falha com o conteúdo do repositório.

import crud4Frameworks from '../../content/tracks/crud-4-frameworks/track.json';
import fundamentosWeb from '../../content/tracks/fundamentos-web/track.json';
import javascriptEssencial from '../../content/tracks/javascript-essencial/track.json';
import javascriptAssincrono from '../../content/tracks/javascript-assincrono/track.json';
import javascriptNoNavegador from '../../content/tracks/javascript-no-navegador/track.json';
import nodejs from '../../content/tracks/nodejs/track.json';
import react from '../../content/tracks/react/track.json';
import vue from '../../content/tracks/vue/track.json';
import nextjs from '../../content/tracks/nextjs/track.json';
import express from '../../content/tracks/express/track.json';
import type { Language } from '../i18n/language';
import { trackSchema, type Track } from './schema';
import { localizeTrack, trackTranslationSchema } from './translation';
import { translationRegistry } from './translations';

const registry: unknown[] = [
  crud4Frameworks,
  fundamentosWeb,
  javascriptEssencial,
  javascriptAssincrono,
  javascriptNoNavegador,
  nodejs,
  react,
  vue,
  nextjs,
  express,
];

export const catalog: readonly Track[] = registry.map((raw) => trackSchema.parse(raw));

export function getTrack(id: string): Track | undefined {
  return catalog.find((track) => track.id === id);
}

const localized = new Map<Language, readonly Track[]>();

/**
 * O catálogo no idioma pedido: PT-BR é o conteúdo original; nos outros idiomas,
 * cada trilha recebe a tradução registrada, campo a campo. Memorizado por idioma
 * quando usa o registro padrão.
 */
export function getCatalog(
  language: Language,
  translations: Record<string, Record<string, unknown>> = translationRegistry,
): readonly Track[] {
  if (language === 'pt-BR') return catalog;
  const useCache = translations === translationRegistry;
  const cached = useCache ? localized.get(language) : undefined;
  if (cached) return cached;
  const tracks = catalog.map((track) => {
    const raw = translations[track.id]?.[language];
    return localizeTrack(track, raw === undefined ? undefined : trackTranslationSchema.parse(raw));
  });
  if (useCache) localized.set(language, tracks);
  return tracks;
}

/** Compara as pastas de content/tracks com os ids registrados, nos dois sentidos. */
export function compareRegistry(folders: string[], registeredIds: string[]): { unregistered: string[]; missing: string[] } {
  return {
    unregistered: folders.filter((f) => !registeredIds.includes(f)).sort(),
    missing: registeredIds.filter((id) => !folders.includes(id)).sort(),
  };
}
