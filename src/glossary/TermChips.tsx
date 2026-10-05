import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { getGlossary, type ConceptCard, type Track } from '../content';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';

const cache = new WeakMap<Track, Map<string, ConceptCard>>();

/** Mapa id → concept da trilha (memorizado por trilha). */
export function conceptsOf(track: Track): Map<string, ConceptCard> {
  let map = cache.get(track);
  if (!map) {
    map = new Map(getGlossary(track).map((c) => [c.id, c]));
    cache.set(track, map);
  }
  return map;
}

type Props = { track: Track; termIds: string[]; onOpen: (termId: string) => void; title?: string };

/** Um chip-botão por termo relacionado; não renderiza nada sem termos. */
export function TermChips({ track, termIds, onOpen, title }: Props) {
  const { colors } = useTheme();
  const t = useT();
  const concepts = conceptsOf(track);
  const terms = termIds.map((id) => concepts.get(id)).filter((c): c is ConceptCard => c !== undefined);
  if (terms.length === 0) return null;
  return (
    <View style={{ gap: spacing.sm }}>
      {title ? (
        <AppText size={12} tone="muted">
          {title}
        </AppText>
      ) : null}
      <View style={styles.chips}>
        {terms.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            accessibilityLabel={c.term}
            accessibilityHint={t.glossary.openHint}
            onPress={() => onOpen(c.id)}
            hitSlop={{ top: 4, bottom: 4 }}
            style={({ pressed }) => [styles.chip, { borderColor: colors.accentText, opacity: pressed ? 0.7 : 1 }]}
          >
            <AppText font="medium" size={13} tone="accentText">
              {c.term}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
});
