// Ilustração da tela de login (opção C do protótipo): três cards em leque com
// conteúdo real do app. Decorativa: escondida do leitor de tela.

import { StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { CheckIcon } from '../components/icons';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius } from '../theme/tokens';

export function LoginIllustration() {
  const { colors } = useTheme();
  const t = useT();
  const card = [styles.card, { backgroundColor: colors.surface, borderColor: colors.line }];
  const chip = [styles.chip, { backgroundColor: colors.accentSoft }];
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.root}>
      <View style={[card, styles.left]}>
        <View style={chip}>
          <AppText font="mono" size={10} tone="accentText">
            {t.card.types.endpoint.toUpperCase()}
          </AppText>
        </View>
        <View style={styles.row}>
          <View style={[styles.method, { backgroundColor: colors.code }]}>
            <AppText font="mono" size={10} style={{ color: colors.codeInk }}>
              DELETE
            </AppText>
          </View>
          <AppText font="mono" size={11}>
            /products/{'{id}'}
          </AppText>
        </View>
        <AppText size={12} tone="muted" numberOfLines={2}>
          {t.card.frontPrompt.endpoint}
        </AppText>
      </View>
      <View style={[card, styles.right]}>
        <View style={chip}>
          <AppText font="mono" size={10} tone="accentText">
            {t.card.types.concept.toUpperCase()}
          </AppText>
        </View>
        <AppText font="bold" size={22}>
          CORS
        </AppText>
        <AppText size={12} tone="muted">
          {t.card.frontPrompt.concept}
        </AppText>
      </View>
      <View style={[styles.knew, { backgroundColor: colors.accent }]}>
        <View style={styles.knewIcon}>
          <CheckIcon color={colors.onAccent} />
        </View>
        <AppText font="semibold" size={15} style={{ color: colors.onAccent }}>
          {t.answer.known.button}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { height: 230 },
  card: {
    position: 'absolute',
    width: 170,
    height: 150,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 10,
  },
  left: { left: 4, top: 34, transform: [{ rotate: '-9deg' }] },
  right: { right: 4, top: 6, transform: [{ rotate: '7deg' }], gap: 8 },
  chip: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  method: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  knew: {
    position: 'absolute',
    alignSelf: 'center',
    top: 120,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.lg,
    transform: [{ rotate: '-2deg' }],
  },
  knewIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
