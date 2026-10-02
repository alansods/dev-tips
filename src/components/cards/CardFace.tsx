// Frente e verso de cada tipo de card. O switch é exaustivo: um tipo novo no
// schema quebra o typecheck até ganhar sua apresentação aqui.
import { StyleSheet, View } from 'react-native';

import type { Card, CodeCard, CompareCard, ConceptCard, EndpointCard, StepCard, Theme } from '../../content';
import { CARD_TYPE_LABEL, FRONT_PROMPT, OPERATION_NAME } from '../../study/copy';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/tokens';
import { AppText } from '../AppText';
import { CodeBlock, SupplementBadge, TypeChip, VariantTabs } from './parts';

export type Side = 'front' | 'back';

type Props = {
  card: Card;
  theme: Theme;
  side: Side;
  /** Aba de framework selecionada (cards step). */
  variantId: string;
  onSelectVariant: (id: string) => void;
};

export function CardFace({ card, theme, side, variantId, onSelectVariant }: Props) {
  const label = card.type === 'step' ? `Passo ${card.number}` : CARD_TYPE_LABEL[card.type];
  return (
    <View style={styles.face}>
      <View style={styles.chips}>
        <TypeChip label={label} />
        {card.origin === 'supplement' && <SupplementBadge />}
      </View>
      <Body card={card} theme={theme} side={side} variantId={variantId} onSelectVariant={onSelectVariant} />
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
      return <Compare card={card} theme={props.theme} side={props.side} />;
    case 'concept':
      return <Concept card={card} side={props.side} />;
    case 'code':
      return <Code card={card} side={props.side} />;
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
        <Prompt>{FRONT_PROMPT.endpoint}</Prompt>
      </View>
    );
  }
  return (
    <View style={styles.gap}>
      <AppText font="bold" size={20}>{`${card.operation} · ${OPERATION_NAME[card.operation]}`}</AppText>
      <AppText size={15}>{card.description}</AppText>
      <View style={styles.row}>
        <StatusBox title="Sucesso" value={String(card.successStatus)} tone="accentText" bg={colors.accentSoft} />
        {card.errorStatuses?.length ? (
          <StatusBox title="Erros" value={card.errorStatuses.join(' · ')} tone="warn" bg={colors.warnSoft} />
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

function Step({ card, theme, side, variantId, onSelectVariant }: Props & { card: StepCard }) {
  if (side === 'front') {
    return (
      <View style={styles.gap}>
        <Title>{card.title}</Title>
        <AppText size={16}>{card.whatIs}</AppText>
        <Prompt>{FRONT_PROMPT.step}</Prompt>
      </View>
    );
  }
  const variants = theme.variants ?? [];
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

function Compare({ card, theme, side }: { card: CompareCard; theme: Theme; side: Side }) {
  const { colors } = useTheme();
  if (side === 'front') {
    return (
      <View style={styles.gap}>
        <Title>{card.concept}</Title>
        <AppText size={16}>{card.explanation}</AppText>
        <Prompt>{FRONT_PROMPT.compare}</Prompt>
      </View>
    );
  }
  return (
    <View style={styles.gap}>
      <AppText font="bold" size={18}>
        {card.concept}
      </AppText>
      <View style={[styles.table, { borderColor: colors.line }]}>
        {(theme.compareColumns ?? []).map((col, i) => (
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
  if (side === 'front') {
    return (
      <View style={styles.gap}>
        <Title>{card.term}</Title>
        <Prompt>{FRONT_PROMPT.concept}</Prompt>
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
