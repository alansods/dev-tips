// Lista de opções exclusivas (rádios) no visual das seções do Perfil.
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';

export function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="radiogroup"
      style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.line }]}
    >
      {options.map((option, i) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.option,
              i > 0 && { borderTopWidth: 1, borderColor: colors.line },
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <AppText size={15} style={{ flex: 1 }}>
              {option.label}
            </AppText>
            <View style={[styles.dot, { borderColor: selected ? colors.accent : colors.line }]}>
              {selected ? <View style={[styles.dotInner, { backgroundColor: colors.accent }]} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  option: { flexDirection: 'row', alignItems: 'center', minHeight: 52, paddingHorizontal: spacing.lg, gap: spacing.md },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dotInner: { width: 10, height: 10, borderRadius: 5 },
});
