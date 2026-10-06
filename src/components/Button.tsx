import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

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
  disabled?: boolean;
  /** Mostra um indicador de carregamento ao lado do texto. */
  loading?: boolean;
};

/** Botão de texto com altura mínima de 48px. */
export function Button({ title, onPress, variant = 'primary', accessibilityLabel, disabled = false, loading }: Props) {
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
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: look.bg,
          borderColor: look.border,
          opacity: disabled && !loading ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.inner}>
        {loading ? <ActivityIndicator color={look.text} /> : null}
        <AppText font="semibold" size={16} style={{ color: look.text }}>
          {title}
        </AppText>
      </View>
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
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
