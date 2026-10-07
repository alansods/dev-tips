// Ícone de uma trilha, linguagem, framework ou área: logo da tecnologia na cor
// da marca, sigla em mono ou o ícone de traço da área, num quadrado. É
// decorativo: fica fora da árvore de acessibilidade.
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { ItemIcon } from '../content/icons';
import { TECH_ICONS } from '../content/techIcons.generated';
import { contrastRatio } from '../theme/contrast';
import { useTheme } from '../theme/ThemeProvider';
import type { ColorScheme, ColorTokens } from '../theme/tokens';
import { AppText } from './AppText';
import { AREA_ICONS } from './icons';

export type TechIconSize = 32 | 40 | 48;

/** Cor do logo: a da marca, exceto no escuro quando ela some contra o fundo. */
export function logoColor(hex: string, scheme: ColorScheme, colors: ColorTokens): string {
  return scheme === 'dark' && contrastRatio(hex, colors.bg) < 3 ? colors.ink : hex;
}

const describe = (icon: ItemIcon) => (icon.kind === 'logo' ? icon.slug : icon.kind === 'text' ? icon.text : icon.area);

export function TechIcon({ icon, size, testID }: { icon: ItemIcon; size: TechIconSize; testID?: string }) {
  const { scheme, colors } = useTheme();
  const isArea = icon.kind === 'area';
  const glyph = Math.round(size * 0.6);
  return (
    <View
      testID={testID ?? `tech-icon-${icon.kind}:${describe(icon)}`}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        backgroundColor: isArea ? colors.accentSoft : colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon.kind === 'logo' ? (
        <Svg width={glyph} height={glyph} viewBox="0 0 24 24">
          <Path d={TECH_ICONS[icon.slug].path} fill={logoColor(TECH_ICONS[icon.slug].hex, scheme, colors)} />
        </Svg>
      ) : icon.kind === 'text' ? (
        <AppText font="monoMedium" size={Math.round(size * 0.3)}>
          {icon.text}
        </AppText>
      ) : (
        (() => {
          const AreaIcon = AREA_ICONS[icon.area];
          return <AreaIcon color={colors.accentText} size={glyph} />;
        })()
      )}
    </View>
  );
}
