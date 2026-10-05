/**
 * @jest-environment node
 */
import { describeContentTracks, direct } from '../__fixtures__/languageTracks';

const db = (id: string, title: string, decks: string[]) => ({ id, title, areas: ['banco-de-dados'], placement: direct, decks });

describeContentTracks({
  group: 'banco de dados',
  after: 'django',
  snippetLanguages: ['sql', 'js', 'json', 'bash', 'text'],
  tracks: [
    db('sql-essencial', 'SQL essencial', ['consultas', 'joins-e-agregacoes', 'subqueries-e-janelas']),
    db('modelagem-de-dados', 'Modelagem de dados', ['chaves-e-relacionamentos', 'normalizacao', 'restricoes-e-evolucao']),
    db('transacoes-e-performance', 'Transações e performance', ['transacoes', 'concorrencia', 'indices-e-consultas']),
    db('postgresql', 'PostgreSQL', ['tipos-e-recursos', 'indices-postgres', 'mvcc-e-manutencao']),
    db('mysql', 'MySQL', ['innodb', 'indices-mysql', 'replicacao-e-operacao']),
    db('mongodb', 'MongoDB', ['documentos', 'modelagem-mongo', 'consultas-e-indices']),
    db('redis', 'Redis', ['estruturas', 'cache', 'recursos-redis']),
    db('nosql', 'NoSQL: modelos e quando usar', ['modelos', 'teorema-cap', 'quando-usar']),
  ],
});
