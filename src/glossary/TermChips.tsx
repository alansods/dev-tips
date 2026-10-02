import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { getGlossary, type ConceptCard, type Theme } from '../content';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';

const cache = new WeakMap<Theme, Map<string, ConceptCard>>();

/** Mapa id → concept do tema (memorizado por tema). */
export function conceptsOf(theme: Theme): Map<string, ConceptCard> {
  let map = cache.get(theme);
  if (!map) {
    map = new Map(getGlossary(theme).map((c) => [c.id, c]));
    cache.set(theme, map);
  }
  return map;
}

type Props = { theme: Theme; termIds: string[]; onOpen: (termId: string) => void; title?: string };

/** Um chip-botão por termo relacionado; não renderiza nada sem termos. */
export function TermChips({ theme, termIds, onOpen, title }: Props) {
  const { colors } = useTheme();
  const t = useT();
  const concepts = conceptsOf(theme);
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
