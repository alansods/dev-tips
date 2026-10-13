import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useT } from '../i18n';
import type { AnswerResult } from '../study/rules';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import type { GlossaryEntry } from './search';

const preview = (text: string) => (text.length > 92 ? `${text.slice(0, 90).trimEnd()}…` : text);

type Props = {
  entry: GlossaryEntry;
  status: AnswerResult | undefined;
  /** Título da trilha; omitido quando o catálogo tem uma trilha só. */
  trackTitle?: string;
  /** Primeiro e último termo da sua letra: o grupo é desenhado como um cartão. */
  first: boolean;
  last: boolean;
  onOpen: (entry: GlossaryEntry) => void;
};

/** Um termo da aba Glossário. Memoizado: só redesenha quando o próprio termo ou o selo muda. */
export const GlossaryItem = memo(function GlossaryItem({ entry, status, trackTitle, first, last, onOpen }: Props) {
  const { colors } = useTheme();
  const t = useT();
  return (
    <Pressable
      testID="glossary-item"
      accessibilityRole="button"
      accessibilityLabel={entry.concept.term}
      accessibilityHint={t.glossary.openHint}
      onPress={() => onOpen(entry)}
      style={({ pressed }) => [
        styles.item,
        first && styles.first,
        last && styles.last,
        { backgroundColor: colors.surface, borderColor: colors.line, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.itemHead}>
        <AppText font="semibold" size={15} style={{ flex: 1 }}>
          {entry.concept.term}
        </AppText>
        {status ? (
          <AppText font="mono" size={11} tone={status === 'known' ? 'accentText' : 'warn'}>
            {status === 'known' ? t.answer.known.short : t.glossary.reviewBadge}
          </AppText>
        ) : null}
      </View>
      <AppText size={13} tone="muted">
        {preview(entry.concept.definition)}
      </AppText>
      {trackTitle !== undefined && (
        <AppText font="mono" size={11} tone="muted">
          {trackTitle}
        </AppText>
      )}
    </Pressable>
  );
});

/** Cabeçalho com a letra inicial dos termos que vêm abaixo dele. */
export function GlossaryLetter({ letter }: { letter: string }) {
  return (
    <AppText
      testID="glossary-letter"
      accessibilityRole="header"
      accessibilityLabel={letter}
      font="monoMedium"
      size={12}
      tone="accentText"
      style={styles.letter}
    >
      {letter}
    </AppText>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    gap: 3,
    minHeight: 44,
  },
  first: { borderTopWidth: 1, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  last: { borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg },
  letter: { paddingHorizontal: spacing.xs, paddingTop: spacing.md, paddingBottom: spacing.sm },
  itemHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
