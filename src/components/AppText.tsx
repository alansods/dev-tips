import { Text, type TextProps } from 'react-native';

import { useFontsReady } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { fontFamilies, type FontRole } from '../theme/tokens';

type Tone = 'ink' | 'muted' | 'accentText' | 'warn';

type AppTextProps = TextProps & {
  font?: FontRole;
  size?: number;
  tone?: Tone;
};

/** Texto com as fontes e cores do design. Sem as fontes carregadas, usa a do sistema. */
export function AppText({ font = 'regular', size = 15, tone = 'ink', style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  const fontsReady = useFontsReady();
  return (
    <Text
      {...rest}
      style={[
        {
          color: colors[tone],
          fontSize: size,
          lineHeight: Math.round(size * 1.4),
          fontFamily: fontsReady ? fontFamilies[font] : undefined,
          fontWeight: fontsReady ? undefined : font === 'bold' ? '700' : font === 'semibold' ? '600' : undefined,
        },
        style,
      ]}
    />
  );
}
