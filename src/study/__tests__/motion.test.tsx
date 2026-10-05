import { render, screen, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, StyleSheet, Text } from 'react-native';

import { TermChips } from '../../glossary/TermChips';
import { crudTrack, renderWithTheme } from '../../test-utils';
import { flipDuration } from '../motion';
import { useReducedMotion } from '../useReducedMotion';

function Probe() {
  return <Text testID="reduced">{String(useReducedMotion())}</Text>;
}

afterEach(() => jest.restoreAllMocks());

describe('Requirement: Animação de virar o card', () => {
  it('Duração da animação', () => {
    expect(flipDuration(false)).toBeGreaterThanOrEqual(150);
    expect(flipDuration(false)).toBeLessThanOrEqual(300);
  });

  it('Reduzir movimento', async () => {
    expect(flipDuration(true)).toBe(0);
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    render(<Probe />);
    await waitFor(() => expect(screen.getByTestId('reduced')).toHaveTextContent('true'));
  });

  it('falha ao consultar o sistema conta como movimento normal', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockRejectedValue(new Error('indisponível'));
    render(<Probe />);
    await waitFor(() => expect(screen.getByTestId('reduced')).toHaveTextContent('false'));
  });
});

describe('Requirement: Alvos de toque mínimos', () => {
  it('Chips de termos relacionados', () => {
    renderWithTheme(<TermChips track={crudTrack} termIds={['cors']} onOpen={() => {}} />);
    const chip = screen.getByRole('button', { name: 'CORS' });
    const style = StyleSheet.flatten(
      typeof chip.props.style === 'function' ? chip.props.style({ pressed: false }) : chip.props.style,
    );
    const slop = chip.props.hitSlop ?? {};
    const vertical = typeof slop === 'number' ? slop * 2 : (slop.top ?? 0) + (slop.bottom ?? 0);
    expect((style.minHeight ?? 0) + vertical).toBeGreaterThanOrEqual(44);
  });
});
