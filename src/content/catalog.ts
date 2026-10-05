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
import typescriptEssencial from '../../content/tracks/typescript-essencial/track.json';
import typescriptAvancado from '../../content/tracks/typescript-avancado/track.json';
import angular from '../../content/tracks/angular/track.json';
import nestjs from '../../content/tracks/nestjs/track.json';
import javaEssencial from '../../content/tracks/java-essencial/track.json';
import javaColecoesEConcorrencia from '../../content/tracks/java-colecoes-e-concorrencia/track.json';
import springBoot from '../../content/tracks/spring-boot/track.json';
import pythonEssencial from '../../content/tracks/python-essencial/track.json';
import fastapi from '../../content/tracks/fastapi/track.json';
import django from '../../content/tracks/django/track.json';
import sqlEssencial from '../../content/tracks/sql-essencial/track.json';
import modelagemDeDados from '../../content/tracks/modelagem-de-dados/track.json';
import transacoesEPerformance from '../../content/tracks/transacoes-e-performance/track.json';
import postgresql from '../../content/tracks/postgresql/track.json';
import mysql from '../../content/tracks/mysql/track.json';
import mongodb from '../../content/tracks/mongodb/track.json';
import redis from '../../content/tracks/redis/track.json';
import nosql from '../../content/tracks/nosql/track.json';
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
  typescriptEssencial,
  typescriptAvancado,
  angular,
  nestjs,
  javaEssencial,
  javaColecoesEConcorrencia,
  springBoot,
  pythonEssencial,
  fastapi,
  django,
  sqlEssencial,
  modelagemDeDados,
  transacoesEPerformance,
  postgresql,
  mysql,
  mongodb,
  redis,
  nosql,
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
