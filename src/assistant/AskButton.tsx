// Botão "Perguntar" da barra de ações da sessão (sempre o último, nas duas
// faces do card). Sem conta ou no plano grátis leva o selo PRO. Não aparece
// na web.

import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { AskIcon } from '../components/icons';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius } from '../theme/tokens';

type Props = { pro: boolean; onPress: () => void };

export function AskButton({ pro, onPress }: Props) {
  const { colors } = useTheme();
  const t = useT();
  if (Platform.OS === 'web') return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.assistant.ask}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.surface, borderColor: colors.line, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <AskIcon color={pro ? colors.accentText : colors.muted} />
      {pro ? null : (
        <View style={[styles.badge, { backgroundColor: colors.accent, borderColor: colors.bg }]}>
          <AppText font="monoMedium" size={9} style={{ color: colors.onAccent, letterSpacing: 0.5 }}>
            {t.pro.badge}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 2,
  },
});
