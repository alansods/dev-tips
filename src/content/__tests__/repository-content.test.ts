/**
 * @jest-environment node
 */
import path from 'node:path';

import { formatScanErrors, scanTracksDirectory } from '../node/scanTracks';

// Gate de conteúdo: todo content/tracks/<track-id>/track.json do repositório
// precisa passar na validação para a suíte ficar verde.
const TRACKS_DIR = path.resolve(__dirname, '../../../content/tracks');

describe('conteúdo do repositório (content/tracks)', () => {
  it('todas as trilhas são válidas', () => {
    const result = scanTracksDirectory(TRACKS_DIR);
    if (!result.ok) {
      throw new Error(`Conteúdo inválido em content/tracks:\n${formatScanErrors(result.errors)}`);
    }
  });
});
