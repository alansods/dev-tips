import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useReducer } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { CardFace } from '../../../components/cards/CardFace';
import { IconButton } from '../../../components/IconButton';
import { CloseIcon } from '../../../components/icons';
import { ProgressBar } from '../../../components/ProgressBar';
import { getTheme } from '../../../content/catalog';
import type { Card, Deck, Theme } from '../../../content';
import { CARD_TYPE_LABEL } from '../../../study/copy';
import {
  cardTitle,
  initialSession,
  sessionCardIds,
  sessionReducer,
  summary,
  type SessionState,
} from '../../../study/rules';
import { useStudyStore } from '../../../study/store';
import { useTheme } from '../../../theme/ThemeProvider';
import { radius, spacing } from '../../../theme/tokens';

export default function StudyScreen() {
  const { themeId, deckId } = useLocalSearchParams<{ themeId: string; deckId: string }>();
  const { colors } = useTheme();
  const theme = getTheme(String(themeId));
  const deck = theme?.decks.find((d) => d.id === deckId);

  if (!theme || !deck) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg, gap: spacing.md }}>
        <AppText>Deck não encontrado.</AppText>
        <View style={{ flexDirection: 'row' }}>
          <Button title="Voltar" variant="secondary" onPress={() => leave(String(themeId))} />
        </View>
      </SafeAreaView>
    );
  }
  return <Session theme={theme} deck={deck} />;
}

function leave(themeId: string) {
  if (router.canGoBack()) router.back();
  else router.replace(`/theme/${themeId}`);
}

function Session({ theme, deck }: { theme: Theme; deck: Deck }) {
  const { colors } = useTheme();
  const answerCard = useStudyStore((s) => s.answer);
  const setVariant = useStudyStore((s) => s.setVariant);
  const variantId = useStudyStore((s) => s.preferredVariant[theme.id]) ?? theme.variants?.[0]?.id ?? '';

  // A ordem é fixada ao abrir a sessão, com o progresso daquele momento.
  const [state, dispatch] = useReducer(sessionReducer, undefined, () =>
    initialSession(sessionCardIds(theme.id, deck, useStudyStore.getState().progress)),
  );
  const cardsById = useMemo(() => new Map(deck.cards.map((c) => [c.id, c])), [deck]);

  const exit = () => leave(theme.id);

  if (state.finished) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
        <Summary
          state={state}
          deck={deck}
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
              {deck.title}
            </AppText>
            <AppText font="mono" size={12} tone="muted">{`${state.index + 1} / ${total}`}</AppText>
          </View>
          <ProgressBar value={state.index / total} />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <ScrollView contentContainerStyle={styles.cardContent}>
          {state.revealed ? (
            <CardFace
              card={card}
              theme={theme}
              side="back"
              variantId={variantId}
              onSelectVariant={(id) => setVariant(theme.id, id)}
            />
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
            <Button title="Não sei" variant="warn" onPress={() => respond('unknown')} />
            <Button title="Sei" onPress={() => respond('known')} />
          </>
        ) : (
          <Button title="Mostrar resposta" onPress={() => dispatch({ type: 'reveal' })} />
        )}
      </View>
    </SafeAreaView>
  );
}

type SummaryProps = {
  state: SessionState;
  deck: Deck;
  cardsById: Map<string, Card>;
  onReview: (ids: string[]) => void;
  onBack: () => void;
};

function Summary({ state, deck, cardsById, onReview, onBack }: SummaryProps) {
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
      <AppText tone="muted">{`Você marcou ${known} de ${total} cards como "sei" em ${deck.title}.`}</AppText>

      <View style={styles.counts}>
        <View
          accessible
          accessibilityLabel={`${known} sei`}
          style={[styles.count, { backgroundColor: colors.accentSoft }]}
        >
          <AppText font="monoMedium" size={30} tone="accentText">
            {String(known)}
          </AppText>
          <AppText size={13}>sei</AppText>
        </View>
        <View
          accessible
          accessibilityLabel={`${unknown} não sei`}
          style={[styles.count, { backgroundColor: colors.warnSoft }]}
        >
          <AppText font="monoMedium" size={30} tone="warn">
            {String(unknown)}
          </AppText>
          <AppText size={13}>não sei</AppText>
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
