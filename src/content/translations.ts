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
import typescriptEssencialEn from '../../content/tracks/typescript-essencial/translations/en.json';
import typescriptAvancadoEn from '../../content/tracks/typescript-avancado/translations/en.json';
import angularEn from '../../content/tracks/angular/translations/en.json';
import nestjsEn from '../../content/tracks/nestjs/translations/en.json';
import javaEssencialEn from '../../content/tracks/java-essencial/translations/en.json';
import javaColecoesEConcorrenciaEn from '../../content/tracks/java-colecoes-e-concorrencia/translations/en.json';
import springBootEn from '../../content/tracks/spring-boot/translations/en.json';
import pythonEssencialEn from '../../content/tracks/python-essencial/translations/en.json';
import fastapiEn from '../../content/tracks/fastapi/translations/en.json';
import djangoEn from '../../content/tracks/django/translations/en.json';
import csharpEssencialEn from '../../content/tracks/csharp-essencial/translations/en.json';
import aspnetCoreEn from '../../content/tracks/aspnet-core/translations/en.json';
import rubyEssencialEn from '../../content/tracks/ruby-essencial/translations/en.json';
import railsEn from '../../content/tracks/rails/translations/en.json';
import sqlEssencialEn from '../../content/tracks/sql-essencial/translations/en.json';
import modelagemDeDadosEn from '../../content/tracks/modelagem-de-dados/translations/en.json';
import transacoesEPerformanceEn from '../../content/tracks/transacoes-e-performance/translations/en.json';
import postgresqlEn from '../../content/tracks/postgresql/translations/en.json';
import mysqlEn from '../../content/tracks/mysql/translations/en.json';
import mongodbEn from '../../content/tracks/mongodb/translations/en.json';
import redisEn from '../../content/tracks/redis/translations/en.json';
import nosqlEn from '../../content/tracks/nosql/translations/en.json';
import reactNativeEn from '../../content/tracks/react-native/translations/en.json';
import ciCdEssencialEn from '../../content/tracks/ci-cd-essencial/translations/en.json';
import githubActionsEn from '../../content/tracks/github-actions/translations/en.json';
import awsEssencialEn from '../../content/tracks/aws-essencial/translations/en.json';
import deployNaAwsEn from '../../content/tracks/deploy-na-aws/translations/en.json';
import estadoEDadosNoReactEn from '../../content/tracks/estado-e-dados-no-react/translations/en.json';
import testesNoFrontendEn from '../../content/tracks/testes-no-frontend/translations/en.json';
import estilizacaoEDesignSystemEn from '../../content/tracks/estilizacao-e-design-system/translations/en.json';
import buildEBundlersEn from '../../content/tracks/build-e-bundlers/translations/en.json';
import gitEColaboracaoEn from '../../content/tracks/git-e-colaboracao/translations/en.json';
import pagamentosNoAppEn from '../../content/tracks/pagamentos-no-app/translations/en.json';
import performanceNoNextjsEn from '../../content/tracks/performance-no-nextjs/translations/en.json';
import modulosNativosNoExpoEn from '../../content/tracks/modulos-nativos-no-expo/translations/en.json';

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
  'typescript-essencial': { en: typescriptEssencialEn },
  'typescript-avancado': { en: typescriptAvancadoEn },
  angular: { en: angularEn },
  nestjs: { en: nestjsEn },
  'java-essencial': { en: javaEssencialEn },
  'java-colecoes-e-concorrencia': { en: javaColecoesEConcorrenciaEn },
  'spring-boot': { en: springBootEn },
  'python-essencial': { en: pythonEssencialEn },
  fastapi: { en: fastapiEn },
  django: { en: djangoEn },
  'csharp-essencial': { en: csharpEssencialEn },
  'aspnet-core': { en: aspnetCoreEn },
  'ruby-essencial': { en: rubyEssencialEn },
  rails: { en: railsEn },
  'sql-essencial': { en: sqlEssencialEn },
  'modelagem-de-dados': { en: modelagemDeDadosEn },
  'transacoes-e-performance': { en: transacoesEPerformanceEn },
  postgresql: { en: postgresqlEn },
  mysql: { en: mysqlEn },
  mongodb: { en: mongodbEn },
  redis: { en: redisEn },
  nosql: { en: nosqlEn },
  'react-native': { en: reactNativeEn },
  'ci-cd-essencial': { en: ciCdEssencialEn },
  'github-actions': { en: githubActionsEn },
  'aws-essencial': { en: awsEssencialEn },
  'deploy-na-aws': { en: deployNaAwsEn },
  'estado-e-dados-no-react': { en: estadoEDadosNoReactEn },
  'testes-no-frontend': { en: testesNoFrontendEn },
  'estilizacao-e-design-system': { en: estilizacaoEDesignSystemEn },
  'build-e-bundlers': { en: buildEBundlersEn },
  'git-e-colaboracao': { en: gitEColaboracaoEn },
  'pagamentos-no-app': { en: pagamentosNoAppEn },
  'performance-no-nextjs': { en: performanceNoNextjsEn },
  'modulos-nativos-no-expo': { en: modulosNativosNoExpoEn },
};
