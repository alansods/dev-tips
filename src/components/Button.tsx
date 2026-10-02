import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { radius } from '../theme/tokens';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'warn';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  /** Nome para leitor de tela, quando o texto visível não basta (ex.: "Estudar Glossário"). */
  accessibilityLabel?: string;
};

/** Botão de texto com altura mínima de 48px. */
export function Button({ title, onPress, variant = 'primary', accessibilityLabel }: Props) {
  const { colors } = useTheme();
  const look = {
    primary: { bg: colors.accent, border: colors.accent, text: colors.onAccent },
    secondary: { bg: colors.surface, border: colors.line, text: colors.ink },
    warn: { bg: colors.warnSoft, border: colors.warn, text: colors.warn },
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: look.bg, borderColor: look.border, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <AppText font="semibold" size={16} style={{ color: look.text }}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
