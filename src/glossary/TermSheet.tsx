import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { IconButton } from '../components/IconButton';
import { CloseIcon } from '../components/icons';
import type { Track } from '../content';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { TermChips, conceptsOf } from './TermChips';

type Props = {
  track: Track;
  /** Termo exibido; `null` = gaveta fechada. */
  termId: string | null;
  onChangeTerm: (termId: string) => void;
  onClose: () => void;
};

/** Gaveta inferior com a definição de um termo e os termos relacionados a ele. */
export function TermSheet({ track, termId, onChangeTerm, onClose }: Props) {
  const { colors } = useTheme();
  const t = useT();
  const concept = termId ? conceptsOf(track).get(termId) : undefined;

  return (
    <Modal visible={!!concept} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.glossary.closeDefinition}
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,8,12,0.55)' }]}
        />
        {concept && (
          <SafeAreaView edges={['bottom']} style={[styles.panel, { backgroundColor: colors.surface }]}>
            <View testID="term-sheet" style={styles.inner}>
              <View style={[styles.handle, { backgroundColor: colors.line }]} />
              <View style={styles.head}>
                <AppText font="mono" size={11} tone="accentText" style={styles.kicker}>
                  {t.glossary.kicker}
                </AppText>
                <IconButton label={t.common.close} onPress={onClose}>
                  <CloseIcon color={colors.ink} size={18} />
                </IconButton>
              </View>
              <ScrollView contentContainerStyle={{ gap: spacing.md }}>
                <AppText font="bold" size={24} accessibilityRole="header">
                  {concept.term}
                </AppText>
                <AppText size={16} style={{ lineHeight: 24 }}>
                  {concept.definition}
                </AppText>
                <TermChips
                  track={track}
                  termIds={concept.relatedTerms}
                  onOpen={onChangeTerm}
                  title={t.card.relatedTerms}
                />
              </ScrollView>
            </View>
          </SafeAreaView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  panel: { borderTopLeftRadius: radius.xl + 2, borderTopRightRadius: radius.xl + 2, maxHeight: '75%' },
  inner: { padding: spacing.xl, paddingTop: spacing.sm, gap: spacing.md },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { textTransform: 'uppercase', letterSpacing: 0.6 },
});
