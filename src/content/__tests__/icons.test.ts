import { getTrack } from '../catalog';
import { frameworkIcon, languageIcon, trackIcon } from '../icons';
import { repoTaxonomy } from '../repoTaxonomy';

const track = (id: string) => getTrack(id)!;

describe('Requirement: Ícone de linguagem, framework e trilha', () => {
  it('Logo herdado do framework', () => {
    expect(trackIcon(track('nextjs'), repoTaxonomy)).toEqual({ kind: 'logo', slug: 'nextdotjs' });
  });

  it('Logo herdado da linguagem', () => {
    expect(trackIcon(track('java-essencial'), repoTaxonomy)).toEqual({ kind: 'logo', slug: 'openjdk' });
  });

  it('Ícone da trilha tem prioridade', () => {
    expect(trackIcon(track('typescript-essencial'), repoTaxonomy)).toEqual({ kind: 'logo', slug: 'typescript' });
  });

  it('Sigla', () => {
    expect(trackIcon(track('aws-essencial'), repoTaxonomy)).toEqual({ kind: 'text', text: 'AWS' });
  });

  it('Trilha sem marca', () => {
    expect(trackIcon(track('fundamentos-web'), repoTaxonomy)).toEqual({ kind: 'area', area: 'fundamentos' });
  });

  it('Comparativo usa a primeira área', () => {
    expect(trackIcon(track('crud-4-frameworks'), repoTaxonomy)).toEqual({ kind: 'area', area: 'backend' });
  });

  it('logos de linguagem e framework vêm do cadastro', () => {
    const python = repoTaxonomy.languages.find((l) => l.id === 'python')!;
    const spring = repoTaxonomy.frameworks.find((f) => f.id === 'spring')!;
    expect(languageIcon(python)).toEqual({ kind: 'logo', slug: 'python' });
    expect(frameworkIcon(spring)).toEqual({ kind: 'logo', slug: 'springboot' });
  });

  it('toda trilha do catálogo tem um ícone', () => {
    const ids = ['react', 'redis', 'git-e-colaboracao', 'modulos-nativos-no-expo', 'sql-essencial'];
    for (const id of ids) expect(trackIcon(track(id), repoTaxonomy)).toBeDefined();
  });
});
