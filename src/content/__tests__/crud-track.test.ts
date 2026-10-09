/**
 * @jest-environment node
 */
import fs from 'node:fs';
import path from 'node:path';

import { getGlossary, placementOf, validateTrack, type Card, type CodeCard, type EndpointCard, type StepCard, type Track } from '../index';

const ROOT = path.resolve(__dirname, '../../..');
const SOURCE_PATH = path.join(ROOT, 'content/sources/crud-4-frameworks.md');
const TRACK_PATH = path.join(ROOT, 'content/tracks/crud-4-frameworks/track.json');

const STEP_TITLES = [
  'Criar o projeto',
  'Instalar as bibliotecas',
  'Subir o banco e conectar',
  'Definir a tabela de produtos',
  'Definir e validar os dados de entrada',
  'Montar a estrutura em camadas',
  'C: Criar produto',
  'R: Listar produtos',
  'R: Buscar um produto',
  'U: Atualizar produto',
  'D: Apagar produto',
  'Tratar erros em um lugar só',
  'Liberar o frontend (CORS)',
  'Rodar a API',
  'Testar o CRUD na mão',
  'Testar automaticamente',
];

const readSource = () => fs.readFileSync(SOURCE_PATH, 'utf8');

/** Remove `**` e crases, colapsa espaços e ignora caixa. */
const normalize = (s: string) => s.replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

let cachedTrack: Track | undefined;
function loadTrack(): Track {
  if (cachedTrack) return cachedTrack;
  const result = validateTrack(JSON.parse(fs.readFileSync(TRACK_PATH, 'utf8')));
  if (!result.ok) throw new Error('track.json inválido:\n' + result.errors.map((e) => `${e.path}: ${e.message}`).join('\n'));
  cachedTrack = result.track;
  return cachedTrack;
}
const deck = (id: string) => {
  const found = loadTrack().decks.find((d) => d.id === id);
  if (!found) throw new Error(`deck ${id} não encontrado`);
  return found;
};
const allCards = (): Card[] => loadTrack().decks.flatMap((d) => d.cards);
const steps = () => deck('passo-a-passo').cards.filter((c): c is StepCard => c.type === 'step');
const step = (n: number) => {
  const found = steps().find((s) => s.number === n);
  if (!found) throw new Error(`passo ${n} não encontrado`);
  return found;
};

describe('Requirement: Material de origem preservado', () => {
  it('Material de origem presente', () => {
    expect(fs.existsSync(SOURCE_PATH)).toBe(true);
    const source = readSource();
    STEP_TITLES.forEach((title, i) => expect(source).toContain(`### Passo ${i + 1}: ${title}`));
    expect(source).toContain('## Tabela comparativa (mapa mental)');
    expect(source).toContain('## Glossário');
  });
});

describe('Requirement: Identidade, variantes e colunas da trilha', () => {
  it('Trilha válida no catálogo', () => {
    const track = loadTrack();
    expect(track.id).toBe('crud-4-frameworks');
    expect(track.title).toBe('O mesmo CRUD em quatro frameworks');
    expect(track.areas).toEqual(['backend']);
    expect(placementOf(track)).toEqual({ kind: 'comparison' });
  });

  it('Ordem de variantes e colunas', () => {
    const track = loadTrack();
    expect(track.variants?.map((v) => [v.id, v.name])).toEqual([
      ['express', 'Express'],
      ['spring', 'Spring Boot'],
      ['nest', 'NestJS'],
      ['fastapi', 'FastAPI'],
    ]);
    expect(track.compareColumns?.map((c) => c.id)).toEqual(['frontend', 'spring', 'express', 'nest', 'fastapi']);
  });
});

describe('Requirement: Decks e contagens', () => {
  it('Contagem por deck', () => {
    const track = loadTrack();
    expect(track.decks.map((d) => d.id)).toEqual([
      'o-que-vamos-criar',
      'passo-a-passo',
      'mapa-mental',
      'glossario',
      'perguntas-de-entrevista',
    ]);
    const countBy = (id: string) =>
      deck(id).cards.reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.type]: (acc[c.type] ?? 0) + 1 }), {});
    expect(countBy('o-que-vamos-criar')).toEqual({ endpoint: 5 });
    expect(countBy('passo-a-passo')).toEqual({ step: 16, code: 4 });
    expect(countBy('mapa-mental')).toEqual({ compare: 16 });
    expect(countBy('glossario')).toEqual({ concept: 24 });
    expect(countBy('perguntas-de-entrevista')).toEqual({ question: 8 });
  });

  it('Passos contíguos', () => {
    expect(steps().map((s) => s.number)).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
    expect(steps().map((s) => s.title)).toEqual(STEP_TITLES);
  });

  it('Glossário completo', () => {
    const terms = getGlossary(loadTrack()).map((c) => c.term);
    expect(terms).toHaveLength(24);
    expect(terms[0]).toBe('API');
    expect(terms[23]).toBe('venv (Python)');
    const sourceTerms = [...readSource().matchAll(/^\*\*(.+?)\*\*: /gm)].map((m) => m[1]);
    expect(terms).toEqual(sourceTerms);
  });

  it('Perguntas de entrevista na ordem', () => {
    expect(deck('perguntas-de-entrevista').cards.map((c) => c.id)).toEqual([
      'put-vs-patch',
      'idempotencia',
      'paginacao-offset-cursor',
      'problema-n-mais-1',
      'transacoes',
      'autenticacao-jwt',
      'migrations',
      'sql-injection',
    ]);
  });

  it('mapa mental na ordem da tabela', () => {
    const concepts = deck('mapa-mental').cards.map((c) => (c.type === 'compare' ? c.concept : ''));
    const tableRows = readSource()
      .split('## Tabela comparativa (mapa mental)')[1]
      .split('## Glossário')[0]
      .split('\n')
      .filter((l) => l.startsWith('| ') && !l.startsWith('| Conceito') && !l.startsWith('|---'))
      .map((l) => l.split('|')[1].trim());
    expect(concepts).toEqual(tableRows);
  });
});

describe('Requirement: Endpoints do CRUD', () => {
  const endpoints = () => deck('o-que-vamos-criar').cards as EndpointCard[];
  const row = (e: EndpointCard) => [e.method, e.path, e.operation, e.successStatus, e.errorStatuses ?? []];

  it('Endpoint de criação', () => {
    expect(row(endpoints()[0])).toEqual(['POST', '/products', 'C', 201, [400]]);
  });

  it('Endpoint de remoção', () => {
    expect(row(endpoints()[4])).toEqual(['DELETE', '/products/{id}', 'D', 204, [404]]);
  });

  it('tabela completa de endpoints', () => {
    expect(endpoints().map(row)).toEqual([
      ['POST', '/products', 'C', 201, [400]],
      ['GET', '/products', 'R', 200, [400]],
      ['GET', '/products/{id}', 'R', 200, [404]],
      ['PUT', '/products/{id}', 'U', 200, [400, 404]],
      ['DELETE', '/products/{id}', 'D', 204, [404]],
    ]);
  });
});

/** Textos de um card original que precisam existir no material (código fica de fora). */
function textsOf(card: Card): [string, string][] {
  switch (card.type) {
    case 'endpoint':
      return [['description', card.description]];
    case 'step': {
      const texts: [string, string][] = [
        ['title', card.title],
        ['whatIs', card.whatIs],
        ['whyItMatters', card.whyItMatters],
      ];
      for (const [variant, s] of Object.entries(card.snippets)) {
        texts.push([`snippets.${variant}.file`, s.file]);
        if (s.note) texts.push([`snippets.${variant}.note`, s.note]);
      }
      return texts;
    }
    case 'compare':
      return [['concept', card.concept], ['explanation', card.explanation], ...Object.entries(card.values).map(([k, v]): [string, string] => [`values.${k}`, v])];
    case 'concept':
      return [['term', card.term], ['definition', card.definition]];
    case 'code':
      return [['title', card.title], ['body', card.body], ['snippet.file', card.snippet.file], ...(card.snippet.note ? [['snippet.note', card.snippet.note] as [string, string]] : [])];
    case 'question':
    case 'interview':
      return [['question', card.question], ['answer', card.answer]];
  }
}

describe('Requirement: Fidelidade ao material original', () => {
  it('Código original idêntico ao material', () => {
    const source = readSource();
    const missing: string[] = [];
    for (const card of allCards()) {
      if (card.origin !== 'original' || card.type !== 'step') continue;
      for (const [variant, s] of Object.entries(card.snippets)) {
        if (!source.includes(s.code)) missing.push(`${card.id} › ${variant}: ${s.code.slice(0, 60)}…`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('Texto original presente no material', () => {
    const source = normalize(readSource());
    const missing: string[] = [];
    for (const card of allCards()) {
      if (card.origin !== 'original') continue;
      for (const [field, text] of textsOf(card)) {
        if (!source.includes(normalize(text))) missing.push(`${card.id} › ${field}: ${text.slice(0, 80)}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('Snippet de instrução marcado como texto', () => {
    const spring = step(1).snippets.spring;
    expect(spring.language).toBe('text');
    expect(readSource()).toContain(spring.code);
    expect(spring.code.startsWith('# No site start.spring.io')).toBe(true);
  });
});

describe('Requirement: Complementos marcados', () => {
  const SUPPLEMENTS = ['docker-compose', 'express-to-product', 'express-query-schemas', 'express-server'];

  it('Somente os complementos são supplement', () => {
    const supplements = allCards().filter((c) => c.origin === 'supplement');
    const questions = deck('perguntas-de-entrevista').cards.map((c) => c.id);
    expect(supplements.map((c) => c.id)).toEqual([...SUPPLEMENTS, ...questions]);
    expect(supplements.filter((c) => c.type === 'code').map((c) => c.id)).toEqual(SUPPLEMENTS);
    expect(supplements.filter((c) => c.type === 'question')).toHaveLength(8);
    expect(allCards().filter((c) => c.origin === 'original')).toHaveLength(allCards().length - 12);
    const codes = supplements.filter((c): c is CodeCard => c.type === 'code');
    const variants = Object.fromEntries(codes.map((c) => [c.id, c.variant ?? null]));
    expect(variants).toEqual({
      'docker-compose': null,
      'express-to-product': 'express',
      'express-query-schemas': 'express',
      'express-server': 'express',
    });
  });

  it('Posição dos complementos', () => {
    const order = deck('passo-a-passo').cards.map((c) => (c.type === 'step' ? `step-${c.number}` : c.id));
    const after = (id: string) => order[order.indexOf(id) - 1];
    expect(after('docker-compose')).toBe('step-3');
    expect(after('express-to-product')).toBe('step-7');
    expect(after('express-query-schemas')).toBe('step-8');
    expect(after('express-server')).toBe('step-14');
  });

  it('docker-compose coerente com o material', () => {
    const card = allCards().find((c) => c.id === 'docker-compose') as CodeCard;
    const code = card.snippet.code;
    expect(code).toMatch(/container_name:\s*products-db/);
    expect(code).toMatch(/POSTGRES_USER:\s*products\b/);
    expect(code).toMatch(/POSTGRES_PASSWORD:\s*products\b/);
    expect(code).toMatch(/POSTGRES_DB:\s*productsdb/);
    expect(code).toContain('5432:5432');
  });

  it('cada complemento diz qual passo o usa', () => {
    const expected: Record<string, string> = {
      'docker-compose': 'Passo 3',
      'express-to-product': 'Passo 7',
      'express-query-schemas': 'Passo 8',
      'express-server': 'Passo 14',
    };
    for (const card of allCards().filter((c): c is CodeCard => c.type === 'code')) {
      expect(card.body).toContain(expected[card.id]);
    }
  });

  it('server.ts usa a porta 8080', () => {
    const card = allCards().find((c) => c.id === 'express-server') as CodeCard;
    expect(card.snippet.code).toContain('8080');
  });
});

describe('Requirement: Ligação com o glossário', () => {
  it('Todo passo tem termos relacionados', () => {
    const empty = allCards()
      .filter((c) => c.type === 'step' || c.type === 'endpoint' || c.type === 'question')
      .filter((c) => c.relatedTerms.length === 0)
      .map((c) => c.id);
    expect(empty).toEqual([]);
  });

  it('Passo de CORS ligado ao termo CORS', () => {
    expect(step(13).relatedTerms).toContain('cors');
  });

  it('Passo de testes ligado ao termo Mock', () => {
    expect(step(16).relatedTerms).toContain('mock');
  });
});
