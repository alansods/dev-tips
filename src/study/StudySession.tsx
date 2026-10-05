import { router } from 'expo-router';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { CardFace } from '../components/cards/CardFace';
import { IconButton } from '../components/IconButton';
import { CloseIcon } from '../components/icons';
import { ProgressBar } from '../components/ProgressBar';
import type { Card, Track } from '../content';
import { TermSheet } from '../glossary/TermSheet';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { flipDuration } from './motion';
import { cardTitle, initialSession, sessionReducer, summary, type SessionState } from './rules';
import { useStudyStore } from './store';
import { useReducedMotion } from './useReducedMotion';

export function leaveToTrack(trackId: string) {
  if (router.canGoBack()) router.back();
  else router.replace(`/track/${trackId}`);
}

type SessionProps = {
  track: Track;
  /** Nome exibido no cabeçalho e no resumo (ex.: título do deck ou "Revisão de hoje"). */
  title: string;
  /** Ids dos cards, calculados uma única vez na abertura da sessão. */
  initialIds: () => string[];
};

/** Sessão de flashcards: frente → verso → "Já sabia"/"Não sabia", e o resumo no fim. */
export function StudySession({ track, title, initialIds }: SessionProps) {
  const { colors } = useTheme();
  const t = useT();
  const answerCard = useStudyStore((s) => s.answer);
  const setVariant = useStudyStore((s) => s.setVariant);
  const variantId = useStudyStore((s) => s.preferredVariant[track.id]) ?? track.variants?.[0]?.id ?? '';

  // A ordem é fixada ao abrir a sessão.
  const [state, dispatch] = useReducer(sessionReducer, undefined, () => initialSession(initialIds()));
  const cardsById = useMemo(() => new Map(track.decks.flatMap((d) => d.cards).map((c) => [c.id, c])), [track]);
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  // 0 = de lado (90°, invisível), 1 = de frente. Anima só quando o verso é pedido.
  const [flip] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (!state.revealed) {
      flip.setValue(1);
      return;
    }
    const duration = flipDuration(reducedMotion);
    if (duration === 0) {
      flip.setValue(1);
      return;
    }
    flip.setValue(0);
    const animation = Animated.timing(flip, { toValue: 1, duration, useNativeDriver: Platform.OS !== 'web' });
    animation.start();
    return () => animation.stop();
  }, [state.revealed, state.index, reducedMotion, flip]);
  const flipStyle = {
    opacity: flip,
    transform: [
      { perspective: 900 },
      { rotateY: flip.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) },
    ],
  };

  const exit = () => leaveToTrack(track.id);

  if (state.finished) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
        <Summary
          state={state}
          title={title}
          cardsById={cardsById}
          onReview={(ids) => dispatch({ type: 'restart', ids })}
          onBack={exit}
        />
      </SafeAreaView>
    );
  }

  const card = cardsById.get(state.ids[state.index])!;
  const total = state.ids.length;
  const respond = (result: 'known' | 'unknown') => {
    answerCard(track.id, card.id, result);
    dispatch({ type: 'answer', result });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton label={t.session.exit} onPress={exit}>
          <CloseIcon color={colors.ink} />
        </IconButton>
        <View style={{ flex: 1, gap: 6 }}>
          <View style={styles.headerRow}>
            <AppText size={12} tone="muted" numberOfLines={1} style={{ flex: 1 }}>
              {title}
            </AppText>
            <AppText font="mono" size={12} tone="muted">{`${state.index + 1} / ${total}`}</AppText>
          </View>
          <ProgressBar value={state.index / total} />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <ScrollView contentContainerStyle={styles.cardContent}>
          {state.revealed ? (
            <Animated.View style={flipStyle}>
              <CardFace
                card={card}
                track={track}
                side="back"
                variantId={variantId}
                onSelectVariant={(id) => setVariant(track.id, id)}
                onOpenTerm={setOpenTerm}
              />
            </Animated.View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.session.flip}
              accessibilityHint={t.session.flipHint}
              onPress={() => dispatch({ type: 'reveal' })}
            >
              <CardFace card={card} track={track} side="front" variantId={variantId} onSelectVariant={() => {}} />
              <AppText size={13} tone="accentText" font="medium" style={{ marginTop: spacing.lg }}>
                {t.session.tapToReveal}
              </AppText>
            </Pressable>
          )}
        </ScrollView>
      </View>

      <View style={styles.actions}>
        {state.revealed ? (
          <>
            <Button title={t.answer.unknown.button} variant="warn" onPress={() => respond('unknown')} />
            <Button title={t.answer.known.button} onPress={() => respond('known')} />
          </>
        ) : (
          <Button title={t.session.showAnswer} onPress={() => dispatch({ type: 'reveal' })} />
        )}
      </View>
      <TermSheet track={track} termId={openTerm} onChangeTerm={setOpenTerm} onClose={() => setOpenTerm(null)} />
    </SafeAreaView>
  );
}

type SummaryProps = {
  state: SessionState;
  title: string;
  cardsById: Map<string, Card>;
  onReview: (ids: string[]) => void;
  onBack: () => void;
};

function Summary({ state, title: sessionTitle, cardsById, onReview, onBack }: SummaryProps) {
  const { colors } = useTheme();
  const t = useT();
  const { known, unknown, missedIds } = summary(state);
  const total = known + unknown;
  const title = unknown === 0 ? t.summary.allRight : known >= unknown ? t.summary.goodPace : t.summary.oneMore;

  return (
    <ScrollView contentContainerStyle={styles.summary}>
      <AppText font="mono" size={11} tone="muted" style={styles.kicker}>
        {t.summary.kicker}
      </AppText>
      <AppText font="bold" size={28} accessibilityRole="header" style={{ lineHeight: 34 }}>
        {title}
      </AppText>
      <AppText tone="muted">{t.summary.marked(known, total, sessionTitle)}</AppText>

      <View style={styles.counts}>
        <View
          accessible
          accessibilityLabel={t.summary.count(known, t.answer.known.short)}
          style={[styles.count, { backgroundColor: colors.accentSoft }]}
        >
          <AppText font="monoMedium" size={30} tone="accentText">
            {String(known)}
          </AppText>
          <AppText size={13}>{t.answer.known.short}</AppText>
        </View>
        <View
          accessible
          accessibilityLabel={t.summary.count(unknown, t.answer.unknown.short)}
          style={[styles.count, { backgroundColor: colors.warnSoft }]}
        >
          <AppText font="monoMedium" size={30} tone="warn">
            {String(unknown)}
          </AppText>
          <AppText size={13}>{t.answer.unknown.short}</AppText>
        </View>
      </View>

      {missedIds.length > 0 && (
        <View style={{ gap: spacing.sm }}>
          <AppText size={13} tone="muted">
            {t.summary.toReview}
          </AppText>
          {missedIds.map((id) => {
            const card = cardsById.get(id)!;
            return (
              <View key={id} style={[styles.missed, { backgroundColor: colors.surface, borderColor: colors.line }]}>
                <AppText font="mono" size={11} tone="muted">
                  {card.type === 'step' ? t.card.stepNumber(card.number) : t.card.types[card.type]}
                </AppText>
                <AppText size={14} style={{ flex: 1 }}>
                  {cardTitle(card)}
                </AppText>
              </View>
            );
          })}
        </View>
      )}

      <View style={{ gap: spacing.md, marginTop: spacing.md }}>
        {missedIds.length > 0 && (
          <View style={{ flexDirection: 'row' }}>
            <Button title={t.summary.reviewMissed} onPress={() => onReview(missedIds)} />
          </View>
        )}
        <View style={{ flexDirection: 'row' }}>
          <Button title={t.summary.backToTrack} variant="secondary" onPress={onBack} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerRow: { flexDirection: 'row', gap: spacing.sm },
  card: { flex: 1, marginHorizontal: spacing.lg, borderRadius: radius.xl, borderWidth: 1, overflow: 'hidden' },
  cardContent: { padding: spacing.lg, flexGrow: 1 },
  actions: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  summary: { padding: spacing.xl, gap: spacing.lg },
  kicker: { textTransform: 'uppercase', letterSpacing: 0.8 },
  counts: { flexDirection: 'row', gap: spacing.md },
  count: { flex: 1, padding: spacing.lg, borderRadius: radius.lg, gap: 2 },
  missed: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'baseline',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
