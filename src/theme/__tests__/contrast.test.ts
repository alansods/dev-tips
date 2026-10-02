import { contrastRatio } from '../contrast';
import { palettes, type ColorTokens } from '../tokens';

describe('contrastRatio', () => {
  it('calcula os extremos da fórmula WCAG', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });

  it('é simétrica', () => {
    expect(contrastRatio('#2D4BE0', '#FFFFFF')).toBeCloseTo(contrastRatio('#FFFFFF', '#2D4BE0'), 10);
  });
});

describe('Requirement: Contraste mínimo', () => {
  const PAIRS: [keyof ColorTokens, keyof ColorTokens][] = [
    ['ink', 'bg'],
    ['ink', 'surface'],
    ['ink', 'surface2'],
    ['muted', 'bg'],
    ['muted', 'surface'],
    ['muted', 'surface2'],
    ['onAccent', 'accent'],
  ];

  it('Contraste dos tokens', () => {
    const failures: string[] = [];
    for (const [mode, colors] of Object.entries(palettes)) {
      for (const [fg, bg] of PAIRS) {
        const ratio = contrastRatio(colors[fg], colors[bg]);
        if (ratio < 4.5)
          failures.push(`${mode}: ${fg} (${colors[fg]}) sobre ${bg} (${colors[bg]}) = ${ratio.toFixed(2)}:1`);
      }
    }
    expect(failures).toEqual([]);
  });
});
