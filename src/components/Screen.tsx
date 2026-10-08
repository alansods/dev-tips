import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OfflineBanner } from '../sync/OfflineBanner';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';

/**
 * Área de conteúdo rolável de uma aba, com o fundo do tema e o aviso de
 * offline. As abas não têm cabeçalho, então o conteúdo respeita a área segura
 * do topo (barra de status e notch).
 */
export function Screen({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.content}>
        <OfflineBanner />
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
});
