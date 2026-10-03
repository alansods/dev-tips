// Botão "Continuar com o Google" no padrão visual do Google (fundo claro,
// borda cinza, "G" colorido), com o estado de carregando.

import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { AppText } from '../components/AppText';
import { GoogleLogo } from '../components/icons';
import { useTheme } from '../theme/ThemeProvider';
import { radius } from '../theme/tokens';

type Props = { label: string; loading: boolean; disabled: boolean; onPress: () => void };

export function GoogleButton({ label, loading, disabled, onPress }: Props) {
  const { scheme, colors } = useTheme();
  const dark = scheme === 'dark';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: dark ? '#131314' : '#FFFFFF', borderColor: dark ? '#8E918F' : '#747775' },
        { opacity: pressed ? 0.85 : 1 },
      ]}
    >
      {loading ? <ActivityIndicator color={colors.accent} /> : <GoogleLogo />}
      <AppText font="medium" size={16} style={{ color: dark ? '#E3E3E3' : '#1F1F1F' }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
