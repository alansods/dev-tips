/**
 * @jest-environment node
 */
import path from 'node:path';

import { formatScanErrors, scanThemesDirectory } from '../node/scanThemes';

// Gate de conteúdo: todo content/themes/<theme-id>/theme.json do repositório
// precisa passar na validação para a suíte ficar verde.
const THEMES_DIR = path.resolve(__dirname, '../../../content/themes');

describe('conteúdo do repositório (content/themes)', () => {
  it('todos os temas são válidos', () => {
    const result = scanThemesDirectory(THEMES_DIR);
    if (!result.ok) {
      throw new Error(`Conteúdo inválido em content/themes:\n${formatScanErrors(result.errors)}`);
    }
  });
});
