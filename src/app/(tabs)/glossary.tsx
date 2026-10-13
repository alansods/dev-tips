import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { CloseIcon } from '../../components/icons';
import { Screen } from '../../components/Screen';
import { AREAS, getGlossary, type Track } from '../../content';
import { useCatalog } from '../../content/useCatalog';
import { GlossaryFilters } from '../../glossary/GlossaryFilters';
import { GlossaryItem, GlossaryLetter } from '../../glossary/GlossaryItem';
import {
  countActive,
  filterTerms,
  NO_FILTERS,
  normalize,
  searchTerms,
  sortTerms,
  withLetterHeaders,
  type GlossaryEntry,
  type GlossaryFilters as Filters,
  type GlossaryRow,
} from '../../glossary/search';
import { TermSheet } from '../../glossary/TermSheet';
import { useT } from '../../i18n';
import { progressKey } from '../../study/rules';
import { useStudyStore } from '../../study/store';
import { useFontsReady } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { fontFamilies, radius, spacing } from '../../theme/tokens';

const allEntries = (catalog: readonly Track[]): GlossaryEntry[] =>
  catalog.flatMap((track) => getGlossary(track).map((concept) => ({ trackId: track.id, concept })));

const keyOf = (row: GlossaryRow) =>
  row.kind === 'letter' ? `letter:${row.letter}` : `${row.entry.trackId}:${row.entry.concept.id}`;

export default function GlossaryScreen() {
  const { colors } = useTheme();
  const t = useT();
  const fontsReady = useFontsReady();
  const progress = useStudyStore((s) => s.progress);
  const [query, setQuery] = useState('');
  // O campo mostra o texto na hora; o filtro roda em seguida, sem travar a digitação.
  const deferredQuery = useDeferredValue(query);
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [open, setOpen] = useState<GlossaryEntry | null>(null);
  const catalog = useCatalog();
  const manyTracks = catalog.length > 1;
  const trackTitles = useMemo(() => new Map(catalog.map((track) => [track.id, track.title])), [catalog]);
  const trackAreas = useMemo(() => new Map(catalog.map((track) => [track.id, track.areas[0]])), [catalog]);

  const all = useMemo(() => allEntries(catalog), [catalog]);
  const filtered = useMemo(
    () =>
      filterTerms(searchTerms(all, deferredQuery), filters, {
        areaOf: (trackId) => trackAreas.get(trackId),
        statusOf: (entry) => progress[progressKey(entry.trackId, entry.concept.id)],
      }),
    [all, deferredQuery, filters, trackAreas, progress],
  );
  const rows = useMemo(() => withLetterHeaders(sortTerms(filtered)), [filtered]);
  const openTrack = open ? catalog.find((t) => t.id === open.trackId) : undefined;

  // Opções da gaveta: áreas que têm termos (na ordem das áreas) e trilhas com termos (A–Z).
  const filterAreas = useMemo(() => {
    const withTerms = new Set(all.map((entry) => trackAreas.get(entry.trackId)));
    return AREAS.filter((area) => withTerms.has(area)).map((area) => ({ area, name: t.nav.areas[area] }));
  }, [all, trackAreas, t]);
  const filterTracks = useMemo(
    () =>
      catalog
        .map((track) => ({ id: track.id, title: track.title, count: getGlossary(track).length }))
        .filter((track) => track.count > 0)
        .sort((a, b) => (normalize(a.title) < normalize(b.title) ? -1 : 1)),
    [catalog],
  );

  // Um chip por filtro ativo; tocar remove só aquele filtro.
  const activeChips: { key: string; label: string; remove: () => void }[] = [
    ...(filters.study !== 'all'
      ? [
          {
            key: 'study',
            label: t.glossary.study[filters.study],
            remove: () => setFilters((f) => ({ ...f, study: 'all' })),
          },
        ]
      : []),
    ...(filters.area
      ? [{ key: 'area', label: t.nav.areas[filters.area], remove: () => setFilters((f) => ({ ...f, area: null })) }]
      : []),
    ...(filters.level
      ? [
          {
            key: 'level',
            label: t.card.levels[filters.level],
            remove: () => setFilters((f) => ({ ...f, level: null })),
          },
        ]
      : []),
    ...filters.trackIds.map((id) => ({
      key: `track:${id}`,
      label: trackTitles.get(id) ?? id,
      remove: () => setFilters((f) => ({ ...f, trackIds: f.trackIds.filter((x) => x !== id) })),
    })),
  ];
  const active = countActive(filters);

  const renderItem = useCallback(
    ({ item }: { item: GlossaryRow }) =>
      item.kind === 'letter' ? (
        <GlossaryLetter letter={item.letter} />
      ) : (
        <GlossaryItem
          entry={item.entry}
          status={progress[progressKey(item.entry.trackId, item.entry.concept.id)]}
          trackTitle={manyTracks ? (trackTitles.get(item.entry.trackId) ?? '') : undefined}
          first={item.first}
          last={item.last}
          onOpen={setOpen}
        />
      ),
    [progress, manyTracks, trackTitles],
  );

  return (
    <>
      <Screen scroll={false}>
        <View style={styles.searchRow}>
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.glossary.filters(active)}
            onPress={() => setFiltersOpen(true)}
            style={({ pressed }) => [
              styles.filterButton,
              {
                backgroundColor: active ? colors.accentSoft : colors.surface,
                borderColor: active ? colors.accent : colors.line,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <AppText font="semibold" size={14} tone={active ? 'accentText' : 'ink'}>
              {t.glossary.filters(active)}
            </AppText>
          </Pressable>
        </View>

        {activeChips.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chips}
          >
            {activeChips.map((chip) => (
              <Pressable
                key={chip.key}
                accessibilityRole="button"
                accessibilityLabel={t.glossary.removeFilter(chip.label)}
                onPress={chip.remove}
                style={({ pressed }) => [
                  styles.chip,
                  { backgroundColor: colors.accentSoft, borderColor: colors.accent, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <AppText font="semibold" size={13} tone="accentText">
                  {chip.label}
                </AppText>
                <CloseIcon color={colors.accentText} size={14} />
              </Pressable>
            ))}
          </ScrollView>
        )}

        <AppText font="mono" size={12} tone="muted">
          {t.glossary.count(filtered.length)}
        </AppText>

        {rows.length === 0 ? (
          <AppText tone="muted" style={styles.empty}>
            {t.glossary.empty}
          </AppText>
        ) : (
          <FlatList
            testID="glossary-list"
            data={rows}
            keyExtractor={keyOf}
            renderItem={renderItem}
            initialNumToRender={15}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            style={styles.list}
          />
        )}
      </Screen>
      <GlossaryFilters
        visible={filtersOpen}
        filters={filters}
        onChange={setFilters}
        onClose={() => setFiltersOpen(false)}
        resultCount={filtered.length}
        areas={filterAreas}
        tracks={filterTracks}
      />
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
  searchRow: { flexDirection: 'row', gap: spacing.sm },
  search: { flex: 1, borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: spacing.md },
  input: { minHeight: 48, fontSize: 15 },
  filterButton: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
  },
  // ScrollView horizontal encolhe por padrão (flexShrink: 1); sem isso a lista abaixo corta os chips.
  chipsScroll: { flexGrow: 0, flexShrink: 0, marginHorizontal: -spacing.lg },
  chips: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
  },
  empty: { paddingVertical: spacing.xl, textAlign: 'center' },
  // Encolhe até o tamanho do conteúdo quando há poucos termos; com muitos, ocupa o espaço e rola.
  list: { flexGrow: 0, flexShrink: 1 },
});
