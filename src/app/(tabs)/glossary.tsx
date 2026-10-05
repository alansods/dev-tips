import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { getGlossary, type Track } from '../../content';
import { useCatalog } from '../../content/useCatalog';
import { searchTerms, type GlossaryEntry } from '../../glossary/search';
import { TermSheet } from '../../glossary/TermSheet';
import { useT } from '../../i18n';
import { progressKey } from '../../study/rules';
import { useStudyStore } from '../../study/store';
import { useFontsReady } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { fontFamilies, radius, spacing } from '../../theme/tokens';

const allEntries = (catalog: readonly Track[]): GlossaryEntry[] =>
  catalog.flatMap((track) => getGlossary(track).map((concept) => ({ trackId: track.id, concept })));

const preview = (text: string) => (text.length > 92 ? `${text.slice(0, 90).trimEnd()}…` : text);

export default function GlossaryScreen() {
  const { colors } = useTheme();
  const t = useT();
  const fontsReady = useFontsReady();
  const progress = useStudyStore((s) => s.progress);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<GlossaryEntry | null>(null);
  const catalog = useCatalog();
  const manyTracks = catalog.length > 1;
  const trackTitle = (id: string) => catalog.find((track) => track.id === id)?.title ?? '';

  const all = useMemo(() => allEntries(catalog), [catalog]);
  const entries = useMemo(() => searchTerms(all, query), [all, query]);
  const openTrack = open ? catalog.find((t) => t.id === open.trackId) : undefined;

  return (
    <>
      <Screen>
        <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <TextInput
            accessibilityLabel={t.glossary.searchLabel}
            placeholder={t.glossary.searchPlaceholder}
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            style={[styles.input, { color: colors.ink, fontFamily: fontsReady ? fontFamilies.regular : undefined }]}
          />
        </View>
        <AppText font="mono" size={12} tone="muted">
          {t.glossary.count(entries.length)}
        </AppText>

        {entries.length === 0 ? (
          <AppText tone="muted" style={styles.empty}>
            {t.glossary.empty}
          </AppText>
        ) : (
          <View style={[styles.list, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            {entries.map((entry) => {
              const status = progress[progressKey(entry.trackId, entry.concept.id)];
              return (
                <Pressable
                  key={`${entry.trackId}:${entry.concept.id}`}
                  testID="glossary-item"
                  accessibilityRole="button"
                  accessibilityLabel={entry.concept.term}
                  accessibilityHint={t.glossary.openHint}
                  onPress={() => setOpen(entry)}
                  style={({ pressed }) => [styles.item, { borderColor: colors.line, opacity: pressed ? 0.7 : 1 }]}
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
                  {manyTracks && (
                    <AppText font="mono" size={11} tone="muted">
                      {trackTitle(entry.trackId)}
                    </AppText>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </Screen>
      {openTrack && (
        <TermSheet
          track={openTrack}
          termId={open?.concept.id ?? null}
          onChangeTerm={(id) =>
            setOpen({ trackId: openTrack.id, concept: getGlossary(openTrack).find((c) => c.id === id)! })
          }
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  search: { borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: spacing.md },
  input: { minHeight: 48, fontSize: 15 },
  empty: { paddingVertical: spacing.xl, textAlign: 'center' },
  list: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  item: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, gap: 3, minHeight: 44 },
  itemHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
