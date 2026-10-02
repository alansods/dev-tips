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
import type { Card, Theme } from '../content';
import { TermSheet } from '../glossary/TermSheet';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { ANSWER_LABEL, CARD_TYPE_LABEL } from './copy';
import { flipDuration } from './motion';
import { cardTitle, initialSession, sessionReducer, summary, type SessionState } from './rules';
import { useStudyStore } from './store';
import { useReducedMotion } from './useReducedMotion';

export function leaveToTheme(themeId: string) {
  if (router.canGoBack()) router.back();
  else router.replace(`/theme/${themeId}`);
}

type SessionProps = {
  theme: Theme;
  /** Nome exibido no cabeçalho e no resumo (ex.: título do deck ou "Revisão de hoje"). */
  title: string;
  /** Ids dos cards, calculados uma única vez na abertura da sessão. */
  initialIds: () => string[];
};

/** Sessão de flashcards: frente → verso → "Já sabia"/"Não sabia", e o resumo no fim. */
export function StudySession({ theme, title, initialIds }: SessionProps) {
  const { colors } = useTheme();
  const answerCard = useStudyStore((s) => s.answer);
  const setVariant = useStudyStore((s) => s.setVariant);
  const variantId = useStudyStore((s) => s.preferredVariant[theme.id]) ?? theme.variants?.[0]?.id ?? '';

  // A ordem é fixada ao abrir a sessão.
  const [state, dispatch] = useReducer(sessionReducer, undefined, () => initialSession(initialIds()));
  const cardsById = useMemo(() => new Map(theme.decks.flatMap((d) => d.cards).map((c) => [c.id, c])), [theme]);
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

  const exit = () => leaveToTheme(theme.id);

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
    answerCard(theme.id, card.id, result);
    dispatch({ type: 'answer', result });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton label="Sair da sessão" onPress={exit}>
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
                theme={theme}
                side="back"
                variantId={variantId}
                onSelectVariant={(id) => setVariant(theme.id, id)}
                onOpenTerm={setOpenTerm}
              />
            </Animated.View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Virar card"
              accessibilityHint="Mostra a resposta"
              onPress={() => dispatch({ type: 'reveal' })}
            >
              <CardFace card={card} theme={theme} side="front" variantId={variantId} onSelectVariant={() => {}} />
              <AppText size={13} tone="accentText" font="medium" style={{ marginTop: spacing.lg }}>
                Toque para ver a resposta
              </AppText>
            </Pressable>
          )}
        </ScrollView>
      </View>

      <View style={styles.actions}>
        {state.revealed ? (
          <>
            <Button title={ANSWER_LABEL.unknown.button} variant="warn" onPress={() => respond('unknown')} />
            <Button title={ANSWER_LABEL.known.button} onPress={() => respond('known')} />
          </>
        ) : (
          <Button title="Mostrar resposta" onPress={() => dispatch({ type: 'reveal' })} />
        )}
      </View>
      <TermSheet theme={theme} termId={openTerm} onChangeTerm={setOpenTerm} onClose={() => setOpenTerm(null)} />
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
  const { known, unknown, missedIds } = summary(state);
  const total = known + unknown;
  const title = unknown === 0 ? 'Mandou bem, acertou tudo.' : known >= unknown ? 'Bom ritmo.' : 'Vale mais uma rodada.';

  return (
    <ScrollView contentContainerStyle={styles.summary}>
      <AppText font="mono" size={11} tone="muted" style={styles.kicker}>
        Sessão concluída
      </AppText>
      <AppText font="bold" size={28} accessibilityRole="header" style={{ lineHeight: 34 }}>
        {title}
      </AppText>
      <AppText tone="muted">{`Você marcou ${known} de ${total} cards como "${ANSWER_LABEL.known.short}" em ${sessionTitle}.`}</AppText>

      <View style={styles.counts}>
        <View
          accessible
          accessibilityLabel={`${known} ${ANSWER_LABEL.known.short}`}
          style={[styles.count, { backgroundColor: colors.accentSoft }]}
        >
          <AppText font="monoMedium" size={30} tone="accentText">
            {String(known)}
          </AppText>
          <AppText size={13}>{ANSWER_LABEL.known.short}</AppText>
        </View>
        <View
          accessible
          accessibilityLabel={`${unknown} ${ANSWER_LABEL.unknown.short}`}
          style={[styles.count, { backgroundColor: colors.warnSoft }]}
        >
          <AppText font="monoMedium" size={30} tone="warn">
            {String(unknown)}
          </AppText>
          <AppText size={13}>{ANSWER_LABEL.unknown.short}</AppText>
        </View>
      </View>

      {missedIds.length > 0 && (
        <View style={{ gap: spacing.sm }}>
          <AppText size={13} tone="muted">
            Para revisar
          </AppText>
          {missedIds.map((id) => {
            const card = cardsById.get(id)!;
            return (
              <View key={id} style={[styles.missed, { backgroundColor: colors.surface, borderColor: colors.line }]}>
                <AppText font="mono" size={11} tone="muted">
                  {card.type === 'step' ? `Passo ${card.number}` : CARD_TYPE_LABEL[card.type]}
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
            <Button title="Revisar os que errei" onPress={() => onReview(missedIds)} />
          </View>
        )}
        <View style={{ flexDirection: 'row' }}>
          <Button title="Voltar ao tema" variant="secondary" onPress={onBack} />
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
