import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { getGlossary, type Track } from '../../content';
import { useCatalog } from '../../content/useCatalog';
import { GlossaryItem } from '../../glossary/GlossaryItem';
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

const keyOf = (entry: GlossaryEntry) => `${entry.trackId}:${entry.concept.id}`;

export default function GlossaryScreen() {
  const { colors } = useTheme();
  const t = useT();
  const fontsReady = useFontsReady();
  const progress = useStudyStore((s) => s.progress);
  const [query, setQuery] = useState('');
  // O campo mostra o texto na hora; o filtro roda em seguida, sem travar a digitação.
  const deferredQuery = useDeferredValue(query);
  const [open, setOpen] = useState<GlossaryEntry | null>(null);
  const catalog = useCatalog();
  const manyTracks = catalog.length > 1;
  const trackTitles = useMemo(() => new Map(catalog.map((track) => [track.id, track.title])), [catalog]);

  const all = useMemo(() => allEntries(catalog), [catalog]);
  const entries = useMemo(() => searchTerms(all, deferredQuery), [all, deferredQuery]);
  const openTrack = open ? catalog.find((t) => t.id === open.trackId) : undefined;

  const renderItem = useCallback(
    ({ item }: { item: GlossaryEntry }) => (
      <GlossaryItem
        entry={item}
        status={progress[progressKey(item.trackId, item.concept.id)]}
        trackTitle={manyTracks ? (trackTitles.get(item.trackId) ?? '') : undefined}
        onOpen={setOpen}
      />
    ),
    [progress, manyTracks, trackTitles],
  );

  return (
    <>
      <Screen scroll={false}>
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
          <FlatList
            testID="glossary-list"
            data={entries}
            keyExtractor={keyOf}
            renderItem={renderItem}
            initialNumToRender={15}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            style={[styles.list, { backgroundColor: colors.surface, borderColor: colors.line }]}
          />
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
  // Encolhe até o tamanho do conteúdo quando há poucos termos; com muitos, ocupa o espaço e rola.
  list: { flexGrow: 0, flexShrink: 1, borderWidth: 1, borderRadius: radius.lg },
});
