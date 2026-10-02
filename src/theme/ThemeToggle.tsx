import { Pressable, StyleSheet } from 'react-native';

import { MoonIcon, SunIcon } from '../components/icons';
import { useTheme } from './ThemeProvider';
import { radius } from './tokens';

/** Botão do cabeçalho que alterna entre claro e escuro. */
export function ThemeToggle() {
  const { scheme, colors, toggle } = useTheme();
  const label = scheme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={toggle}
      hitSlop={4}
      style={({ pressed }) => [
        styles.button,
        { borderColor: colors.line, backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      {scheme === 'dark' ? <SunIcon color={colors.ink} /> : <MoonIcon color={colors.ink} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
