import { Pressable, StyleSheet } from 'react-native';

import { AppText, type Tone } from './AppText';

type Props = {
  title: string;
  onPress: () => void;
  tone?: Tone;
  underline?: boolean;
  disabled?: boolean;
};

/** Ação discreta em forma de link de texto, sem fundo nem borda. Área de toque de 44px. */
export function TextLink({ title, onPress, tone = 'accentText', underline = false, disabled = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.link, { opacity: disabled ? 0.5 : pressed ? 0.6 : 1 }]}
    >
      <AppText
        font="medium"
        size={14}
        tone={tone}
        style={underline ? { textDecorationLine: 'underline' } : undefined}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { minHeight: 44, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
});
