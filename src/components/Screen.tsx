import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OfflineBanner } from '../sync/OfflineBanner';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';

/**
 * Área de conteúdo rolável de uma aba, com o fundo do tema e o aviso de
 * offline. As abas não têm cabeçalho, então o conteúdo respeita a área segura
 * do topo (barra de status e notch).
 *
 * Com `scroll={false}` a tela não rola: o conteúdo ocupa a altura disponível e
 * a rolagem fica com uma lista virtualizada dentro dele (uma `FlatList` dentro
 * de `ScrollView` deixa de virtualizar).
 */
export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      {scroll ? (
        <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.content}>
          <OfflineBanner />
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fixed]}>
          <OfflineBanner />
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  fixed: { flex: 1 },
});
