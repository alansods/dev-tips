import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { OfflineBanner } from '../sync/OfflineBanner';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';

/** Área de conteúdo rolável de uma aba, com o fundo do tema e o aviso de offline. */
export function Screen({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.content}>
      <OfflineBanner />
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
});
