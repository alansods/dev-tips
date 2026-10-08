import { screen } from '@testing-library/react-native';

import { TECH_ICONS } from '../../content/techIcons.generated';
import { renderWithTheme } from '../../test-utils';
import { palettes } from '../../theme/tokens';
import { logoColor, TechIcon } from '../TechIcon';

describe('Requirement: Cores do ícone', () => {
  it('Logo no modo claro', () => {
    expect(logoColor(TECH_ICONS.react.hex, 'light', palettes.light)).toBe('#61DAFB');
  });

  it('Logo escuro no modo escuro', () => {
    expect(logoColor(TECH_ICONS.nextdotjs.hex, 'dark', palettes.dark)).toBe(palettes.dark.ink);
  });

  it('Logo colorido no modo escuro', () => {
    expect(logoColor(TECH_ICONS.react.hex, 'dark', palettes.dark)).toBe('#61DAFB');
  });

  it('logo preto continua preto no modo claro', () => {
    expect(logoColor(TECH_ICONS.nextdotjs.hex, 'light', palettes.light)).toBe(TECH_ICONS.nextdotjs.hex);
  });
});

describe('Requirement: Ícone decorativo', () => {
  it.each([
    ['logo', { kind: 'logo', slug: 'react' }],
    ['sigla', { kind: 'text', text: 'AWS' }],
    ['área', { kind: 'area', area: 'backend' }],
  ] as const)('%s fica fora da acessibilidade', (_, icon) => {
    renderWithTheme(<TechIcon icon={icon} size={40} testID="icon" />);
    const root = screen.getByTestId('icon', { includeHiddenElements: true });
    expect(root.props.accessible).toBe(false);
    expect(root.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(root.props.accessibilityElementsHidden).toBe(true);
  });

  it('sigla aparece como texto', () => {
    renderWithTheme(<TechIcon icon={{ kind: 'text', text: 'AWS' }} size={40} testID="icon" />);
    expect(screen.getByTestId('icon', { includeHiddenElements: true })).toHaveTextContent('AWS');
  });
});
