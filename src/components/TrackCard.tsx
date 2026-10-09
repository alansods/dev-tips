// Cards tocáveis da navegação do catálogo: trilha (título, descrição,
// progresso e revisões de hoje), área (progresso somado das suas trilhas) e
// linha de linguagem/framework (nome e quantidade de trilhas).
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { repoTaxonomy, type Area, type Track } from '../content';
import { trackIcon, type ItemIcon } from '../content/icons';
import { useT } from '../i18n';
import { today } from '../study/clock';
import { trackStats, tracksStats } from '../study/rules';
import { dueCardIds } from '../study/srs';
import { useStudyStore } from '../study/store';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { AppText } from './AppText';
import { ChevronRightIcon } from './icons';
import { TechIcon } from './TechIcon';
import { ProgressBar } from './ProgressBar';

function Card({
  label,
  onPress,
  fill = false,
  children,
}: {
  label: string;
  onPress: () => void;
  /** Ocupa toda a altura disponível (cards lado a lado com a mesma altura). */
  fill?: boolean;
  children: ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        fill && styles.fill,
        { backgroundColor: colors.surface, borderColor: colors.line, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      {children}
    </Pressable>
  );
}

function ProgressLine({ known, total }: { known: number; total: number }) {
  return (
    <View style={styles.progressRow}>
      <View style={{ flex: 1 }}>
        <ProgressBar value={total ? known / total : 0} />
      </View>
      <AppText font="mono" size={12} tone="muted">{`${known}/${total}`}</AppText>
    </View>
  );
}

/** Cards para revisar hoje, somados sobre as trilhas. */
function useDue(tracks: readonly Track[]): number {
  const schedule = useStudyStore((s) => s.schedule);
  const day = today();
  return tracks.reduce((n, track) => n + dueCardIds(track, schedule, day).length, 0);
}

export function TrackCard({ track }: { track: Track }) {
  const t = useT();
  const progress = useStudyStore((s) => s.progress);
  const stats = trackStats(track, progress);
  const due = useDue([track]);
  return (
    <Card
      label={t.home.cardLabel(track.title, stats.known, stats.total)}
      onPress={() => router.push(`/track/${track.id}`)}
    >
      <View style={styles.row}>
        <TechIcon icon={trackIcon(track, repoTaxonomy)} size={40} />
        <AppText font="semibold" size={16} style={{ flex: 1 }}>
          {track.title}
        </AppText>
      </View>
      <AppText size={13} tone="muted">
        {track.description}
      </AppText>
      <ProgressLine known={stats.known} total={stats.total} />
      {due > 0 && (
        <AppText font="medium" size={13} tone="warn">
          {t.home.dueBadge(due)}
        </AppText>
      )}
    </Card>
  );
}

export function AreaCard({
  area,
  name,
  tracks,
  onPress,
  compact = false,
}: {
  area: Area;
  name: string;
  tracks: readonly Track[];
  onPress: () => void;
  /** Em duas colunas: ícone acima do nome. */
  compact?: boolean;
}) {
  const t = useT();
  const progress = useStudyStore((s) => s.progress);
  const stats = tracksStats(tracks, progress);
  const due = useDue(tracks);
  const count = area === 'simulacoes' ? t.nav.simulationCount(tracks.length) : t.nav.trackCount(tracks.length);
  return (
    <Card label={t.nav.areaLabel(name, count, stats.known, stats.total)} onPress={onPress} fill={compact}>
      <View style={compact ? { gap: spacing.sm } : styles.row}>
        <TechIcon icon={{ kind: 'area', area }} size={40} />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText font="semibold" size={compact ? 16 : 18}>
            {name}
          </AppText>
          <AppText size={13} tone="muted">
            {count}
          </AppText>
        </View>
      </View>
      <ProgressLine known={stats.known} total={stats.total} />
      {due > 0 && (
        <AppText font="medium" size={13} tone="warn">
          {t.home.dueBadge(due)}
        </AppText>
      )}
    </Card>
  );
}

/** Linha de linguagem ou framework: nome, quantidade de trilhas e seta. */
export function NavRow({
  name,
  icon,
  count,
  onPress,
}: {
  name: string;
  icon: ItemIcon;
  count: number;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const t = useT();
  const tracks = t.nav.trackCount(count);
  return (
    <Card label={t.nav.rowLabel(name, tracks)} onPress={onPress}>
      <View style={styles.row}>
        <TechIcon icon={icon} size={40} />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText font="semibold" size={16}>
            {name}
          </AppText>
          <AppText size={13} tone="muted">
            {tracks}
          </AppText>
        </View>
        <ChevronRightIcon color={colors.muted} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm },
  fill: { flex: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
