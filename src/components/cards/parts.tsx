// Peças comuns dos cards: rótulo do tipo, selo de complemento, bloco de código e abas de framework.
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { Snippet, Variant } from '../../content';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/tokens';
import { AppText } from '../AppText';

export function TypeChip({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.chip, { backgroundColor: colors.accentSoft }]}>
      <AppText font="mono" size={11} tone="accentText" style={styles.caps}>
        {label}
      </AppText>
    </View>
  );
}

export function SupplementBadge({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.chip, styles.outlined, { borderColor: colors.warn }]}>
      <AppText font="mono" size={11} tone="warn" style={styles.caps}>
        {label}
      </AppText>
    </View>
  );
}

/** Código em fonte mono, sem quebra de linha, com rolagem horizontal; arquivo em cima e nota embaixo. */
export function CodeBlock({ snippet }: { snippet: Snippet }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <View style={[styles.code, { backgroundColor: colors.code }]}>
        <View style={styles.codeHeader}>
          <AppText font="mono" size={11.5} style={{ color: colors.codeMuted }}>
            {snippet.file}
          </AppText>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.codeScroll}>
          <AppText font="mono" size={12} style={{ color: colors.codeInk, lineHeight: 19 }}>
            {snippet.code}
          </AppText>
        </ScrollView>
      </View>
      {snippet.note ? (
        <View style={[styles.note, { backgroundColor: colors.surface2 }]}>
          <AppText size={13.5}>{snippet.note}</AppText>
        </View>
      ) : null}
    </View>
  );
}

type TabsProps = { variants: Variant[]; selected: string; onSelect: (id: string) => void };

export function VariantTabs({ variants, selected, onSelect }: TabsProps) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="tablist" style={[styles.tabs, { backgroundColor: colors.surface2 }]}>
      {variants.map((v) => {
        const isSelected = v.id === selected;
        return (
          <Pressable
            key={v.id}
            accessibilityRole="tab"
            accessibilityLabel={v.name}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(v.id)}
            style={[styles.tab, isSelected && { backgroundColor: colors.surface }]}
          >
            <AppText font="semibold" size={12.5} tone={isSelected ? 'ink' : 'muted'} numberOfLines={1}>
              {v.name}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: 6 },
  outlined: { borderWidth: 1, paddingVertical: 2 },
  caps: { textTransform: 'uppercase', letterSpacing: 0.6 },
  code: { borderRadius: radius.lg, overflow: 'hidden' },
  codeHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderColor: '#222B37',
  },
  codeScroll: { padding: spacing.md },
  note: { padding: spacing.md, borderRadius: radius.md },
  tabs: { flexDirection: 'row', padding: 4, borderRadius: radius.md, gap: 4 },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    paddingHorizontal: 4,
  },
});
