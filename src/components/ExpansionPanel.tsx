// Painel expansível: cabeçalho tocável que abre e fecha o conteúdo. O conteúdo
// só é montado com o painel aberto, então não pesa nem aparece para o leitor
// de tela enquanto está fechado.
import { useState, type ReactNode } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { ChevronRightIcon } from './icons';

type Props = {
  header: ReactNode;
  /** Nome do cabeçalho para o leitor de tela. */
  accessibilityLabel: string;
  children: ReactNode;
  initiallyExpanded?: boolean;
  testID?: string;
  headerTestID?: string;
};

export function ExpansionPanel({
  header,
  accessibilityLabel,
  children,
  initiallyExpanded = false,
  testID,
  headerTestID,
}: Props) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(initiallyExpanded);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  };

  return (
    <View testID={testID} style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <Pressable
        testID={headerTestID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded }}
        onPress={toggle}
        style={({ pressed }) => [styles.header, { opacity: pressed ? 0.85 : 1 }]}
      >
        <View style={{ flex: 1 }}>{header}</View>
        <View style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}>
          <ChevronRightIcon color={colors.muted} />
        </View>
      </Pressable>
      {expanded && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: radius.xl, borderWidth: 1, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.lg },
});
