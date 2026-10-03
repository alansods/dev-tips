/**
 * @jest-environment node
 */
import fs from 'node:fs';
import path from 'node:path';

// Varredura: texto de interface tem que vir dos dicionários (src/i18n/), nunca
// escrito direto nos componentes. Pega texto JSX e props de texto com literal.

const SRC = path.resolve(__dirname, '../..');
const SKIP = [/__tests__/, /__fixtures__/, /^i18n\//, /^test-utils\.tsx$/];

/** Literais permitidos: não são texto de interface traduzível. */
// Conteúdo técnico da ilustração de login (código e termo), igual em qualquer idioma.
const ALLOWED = new Set<string>(['DELETE', 'CORS']);

const TEXT_PROP = /\b(title|label|accessibilityLabel|accessibilityHint|placeholder)="([^"]*\p{L}[^"]*)"/gu;
const INLINE_TEXT = />([^<>{}]*\p{L}{2}[^<>{}]*)<\//gu;
const TEXT_LINE = /^\s+(\p{L}[^<>{}=;:,()[\]'"`/*|&]*)$/u;

function tsxFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return tsxFiles(full);
    return entry.name.endsWith('.tsx') ? [full] : [];
  });
}

function findLiterals(source: string): string[] {
  const found: string[] = [];
  for (const m of source.matchAll(TEXT_PROP)) found.push(m[2]);
  for (const m of source.matchAll(INLINE_TEXT)) found.push(m[1].trim());
  for (const line of source.split('\n')) {
    const m = TEXT_LINE.exec(line);
    if (m) found.push(m[1].trim());
  }
  // Uma palavra em camelCase numa linha é prop booleana do JSX (ex.: `accessible`), não texto.
  const isBooleanProp = (text: string) => /^[a-z][A-Za-z]*$/.test(text);
  return [...new Set(found)].filter((text) => !ALLOWED.has(text) && !isBooleanProp(text));
}

describe('Requirement: Interface traduzida', () => {
  it('nenhum texto de interface fixo fora de src/i18n/', () => {
    const offenders = tsxFiles(SRC)
      .map((file) => path.relative(SRC, file))
      .filter((rel) => !SKIP.some((re) => re.test(rel)))
      .flatMap((rel) => findLiterals(fs.readFileSync(path.join(SRC, rel), 'utf8')).map((text) => `${rel}: ${text}`));
    expect(offenders).toEqual([]);
  });

  it('a varredura detecta texto fixo', () => {
    expect(findLiterals('<Button title="Salvar" />')).toEqual(['Salvar']);
    expect(findLiterals('<AppText>Olá mundo</AppText>')).toEqual(['Olá mundo']);
    expect(findLiterals('      <AppText>\n        Texto solto\n      </AppText>')).toEqual(['Texto solto']);
  });
});
