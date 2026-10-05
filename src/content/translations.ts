// Traduções empacotadas no app, por trilha e idioma. Para adicionar uma, importe
// o content/tracks/<track-id>/translations/<idioma>.json aqui; o teste do
// catálogo falha se um arquivo de tradução ficar sem registro.

import crud4FrameworksEn from '../../content/tracks/crud-4-frameworks/translations/en.json';
import fundamentosWebEn from '../../content/tracks/fundamentos-web/translations/en.json';
import javascriptEssencialEn from '../../content/tracks/javascript-essencial/translations/en.json';
import javascriptAssincronoEn from '../../content/tracks/javascript-assincrono/translations/en.json';
import javascriptNoNavegadorEn from '../../content/tracks/javascript-no-navegador/translations/en.json';
import nodejsEn from '../../content/tracks/nodejs/translations/en.json';
import reactEn from '../../content/tracks/react/translations/en.json';
import vueEn from '../../content/tracks/vue/translations/en.json';
import nextjsEn from '../../content/tracks/nextjs/translations/en.json';
import expressEn from '../../content/tracks/express/translations/en.json';

export const translationRegistry: Record<string, Record<string, unknown>> = {
  'crud-4-frameworks': { en: crud4FrameworksEn },
  'fundamentos-web': { en: fundamentosWebEn },
  'javascript-essencial': { en: javascriptEssencialEn },
  'javascript-assincrono': { en: javascriptAssincronoEn },
  'javascript-no-navegador': { en: javascriptNoNavegadorEn },
  nodejs: { en: nodejsEn },
  react: { en: reactEn },
  vue: { en: vueEn },
  nextjs: { en: nextjsEn },
  express: { en: expressEn },
};
