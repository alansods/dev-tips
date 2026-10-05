/**
 * @jest-environment node
 */
import { describeContentTracks, direct } from '../__fixtures__/languageTracks';
import { getTrack } from '../catalog';

const devops = (id: string, title: string, decks: string[]) => ({ id, title, areas: ['devops'], placement: direct, decks });

const TRACKS = [
  devops('ci-cd-essencial', 'CI/CD essencial', ['pipeline-e-etapas', 'testes-e-artefatos', 'estrategias-de-deploy']),
  devops('github-actions', 'GitHub Actions', ['workflows-e-jobs', 'segredos-cache-e-matriz', 'deploy-e-ambientes']),
  devops('aws-essencial', 'AWS essencial', ['iam-e-conta', 'computacao-e-rede', 'armazenamento-e-dados']),
  devops('deploy-na-aws', 'Deploy na AWS', ['containers-na-aws', 'serverless-e-borda', 'iac-e-pipeline']),
];

describeContentTracks({
  group: 'DevOps e Cloud',
  after: 'react-native',
  snippetLanguages: ['yaml', 'json', 'bash', 'ts', 'text'],
  tracks: TRACKS,
});

describe('Requirement: Trilhas de DevOps e Cloud no catálogo (seções)', () => {
  it.each([
    ['ci-cd-essencial', 'ci-cd'],
    ['github-actions', 'ci-cd'],
    ['aws-essencial', 'aws'],
    ['deploy-na-aws', 'aws'],
  ])('%s na seção %s', (id, section) => {
    expect(getTrack(id)?.section).toBe(section);
  });
});
