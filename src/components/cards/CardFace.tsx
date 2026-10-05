// Frente e verso de cada tipo de card. O switch é exaustivo: um tipo novo no
// schema quebra o typecheck até ganhar sua apresentação aqui.
import { StyleSheet, View } from 'react-native';

import type {
  Card,
  CodeCard,
  CompareCard,
  ConceptCard,
  EndpointCard,
  QuestionCard,
  StepCard,
  Track,
} from '../../content';
import { useT } from '../../i18n';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/tokens';
import { AppText } from '../AppText';
import { TermChips } from '../../glossary/TermChips';
import { CodeBlock, SupplementBadge, TypeChip, VariantTabs } from './parts';

export type Side = 'front' | 'back';

type Props = {
  card: Card;
  track: Track;
  side: Side;
  /** Aba de framework selecionada (cards step). */
  variantId: string;
  onSelectVariant: (id: string) => void;
  /** Quando presente, o verso mostra os termos relacionados como chips que chamam esta função. */
  onOpenTerm?: (termId: string) => void;
};

export function CardFace({ card, track, side, variantId, onSelectVariant, onOpenTerm }: Props) {
  const t = useT();
  const label = card.type === 'step' ? t.card.stepNumber(card.number) : t.card.types[card.type];
  return (
    <View style={styles.face}>
      <View style={styles.chips}>
        <TypeChip label={label} />
        {card.origin === 'supplement' && <SupplementBadge label={t.card.supplement} />}
      </View>
      <Body card={card} track={track} side={side} variantId={variantId} onSelectVariant={onSelectVariant} />
      {side === 'back' && onOpenTerm ? (
        <TermChips track={track} termIds={card.relatedTerms} onOpen={onOpenTerm} title={t.card.relatedTerms} />
      ) : null}
    </View>
  );
}

function Body(props: Props) {
  const { card } = props;
  switch (card.type) {
    case 'endpoint':
      return <Endpoint card={card} side={props.side} />;
    case 'step':
      return <Step {...props} card={card} />;
    case 'compare':
      return <Compare card={card} track={props.track} side={props.side} />;
    case 'concept':
      return <Concept card={card} side={props.side} />;
    case 'code':
      return <Code card={card} side={props.side} />;
    case 'question':
      return <Question card={card} side={props.side} />;
    default: {
      const exhaustive: never = card;
      return exhaustive;
    }
  }
}

const Title = ({ children }: { children: string }) => (
  <AppText font="bold" size={24} style={{ lineHeight: 30 }}>
    {children}
  </AppText>
);
const Prompt = ({ children }: { children: string }) => (
  <AppText size={16} tone="muted">
    {children}
  </AppText>
);

function Endpoint({ card, side }: { card: EndpointCard; side: Side }) {
  const { colors } = useTheme();
  const t = useT();
  if (side === 'front') {
    return (
      <View style={styles.gap}>
        <View style={styles.row}>
          <View style={[styles.method, { backgroundColor: colors.code }]}>
            <AppText font="monoMedium" size={15} style={{ color: colors.codeInk }}>
              {card.method}
            </AppText>
          </View>
          <AppText font="monoMedium" size={21}>
            {card.path}
          </AppText>
        </View>
        <Prompt>{t.card.frontPrompt.endpoint}</Prompt>
      </View>
    );
  }
  return (
    <View style={styles.gap}>
      <AppText font="bold" size={20}>{`${card.operation} · ${t.card.operation[card.operation]}`}</AppText>
      <AppText size={15}>{card.description}</AppText>
      <View style={styles.row}>
        <StatusBox title={t.card.success} value={String(card.successStatus)} tone="accentText" bg={colors.accentSoft} />
        {card.errorStatuses?.length ? (
          <StatusBox title={t.card.errors} value={card.errorStatuses.join(' · ')} tone="warn" bg={colors.warnSoft} />
        ) : null}
      </View>
      <AppText font="mono" size={12.5} tone="muted">{`${card.method} ${card.path}`}</AppText>
    </View>
  );
}

function StatusBox({
  title,
  value,
  tone,
  bg,
}: {
  title: string;
  value: string;
  tone: 'accentText' | 'warn';
  bg: string;
}) {
  return (
    <View style={[styles.status, { backgroundColor: bg }]}>
      <AppText size={11} style={styles.caps}>
        {title}
      </AppText>
      <AppText font="monoMedium" size={16} tone={tone}>
        {value}
      </AppText>
    </View>
  );
}

function Step({ card, track, side, variantId, onSelectVariant }: Props & { card: StepCard }) {
  const t = useT();
  if (side === 'front') {
    return (
      <View style={styles.gap}>
        <Title>{card.title}</Title>
        <AppText size={16}>{card.whatIs}</AppText>
        <Prompt>{t.card.frontPrompt.step}</Prompt>
      </View>
    );
  }
  const variants = track.variants ?? [];
  const selected = variants.some((v) => v.id === variantId) ? variantId : (variants[0]?.id ?? '');
  const snippet = card.snippets[selected];
  return (
    <View style={styles.gap}>
      <AppText font="bold" size={18}>
        {card.title}
      </AppText>
      <AppText size={14} tone="muted">
        {card.whyItMatters}
      </AppText>
      <VariantTabs variants={variants} selected={selected} onSelect={onSelectVariant} />
      {snippet && <CodeBlock snippet={snippet} />}
    </View>
  );
}

function Compare({ card, track, side }: { card: CompareCard; track: Track; side: Side }) {
  const { colors } = useTheme();
  const t = useT();
  if (side === 'front') {
    return (
      <View style={styles.gap}>
        <Title>{card.concept}</Title>
        <AppText size={16}>{card.explanation}</AppText>
        <Prompt>{t.card.frontPrompt.compare}</Prompt>
      </View>
    );
  }
  return (
    <View style={styles.gap}>
      <AppText font="bold" size={18}>
        {card.concept}
      </AppText>
      <View style={[styles.table, { borderColor: colors.line }]}>
        {(track.compareColumns ?? []).map((col, i) => (
          <View
            key={col.id}
            style={[
              styles.tableRow,
              { borderColor: colors.line, backgroundColor: i === 0 ? colors.surface2 : undefined },
            ]}
          >
            <AppText font="semibold" size={12} tone="muted" style={styles.tableLabel}>
              {col.label}
            </AppText>
            <AppText font="mono" size={12.5} style={styles.tableValue}>
              {card.values[col.id]}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function Concept({ card, side }: { card: ConceptCard; side: Side }) {
  const t = useT();
  if (side === 'front') {
    return (
      <View style={styles.gap}>
        <Title>{card.term}</Title>
        <Prompt>{t.card.frontPrompt.concept}</Prompt>
      </View>
    );
  }
  return (
    <View style={styles.gap}>
      <AppText font="bold" size={18}>
        {card.term}
      </AppText>
      <AppText size={16}>{card.definition}</AppText>
    </View>
  );
}

function Code({ card, side }: { card: CodeCard; side: Side }) {
  if (side === 'front') {
    return (
      <View style={styles.gap}>
        <Title>{card.title}</Title>
        <AppText size={16} tone="muted">
          {card.body}
        </AppText>
      </View>
    );
  }
  return (
    <View style={styles.gap}>
      <AppText font="bold" size={18}>
        {card.title}
      </AppText>
      <CodeBlock snippet={card.snippet} />
    </View>
  );
}

function Question({ card, side }: { card: QuestionCard; side: Side }) {
  const t = useT();
  if (side === 'front') {
    return (
      <View style={styles.gap}>
        <Title>{card.question}</Title>
        <Prompt>{t.card.frontPrompt.question}</Prompt>
      </View>
    );
  }
  return (
    <View style={styles.gap}>
      <AppText font="semibold" size={15} tone="muted">
        {card.question}
      </AppText>
      <AppText size={16} style={{ lineHeight: 24 }}>
        {card.answer}
      </AppText>
      {card.snippet && <CodeBlock snippet={card.snippet} />}
    </View>
  );
}

const styles = StyleSheet.create({
  face: { gap: spacing.md },
  chips: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  gap: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  method: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm },
  status: { flex: 1, padding: spacing.md, borderRadius: radius.md, gap: 2 },
  caps: { textTransform: 'uppercase', letterSpacing: 0.6 },
  table: { borderWidth: 1, borderRadius: radius.md, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, borderBottomWidth: 1 },
  tableLabel: { width: 92 },
  tableValue: { flex: 1 },
});
