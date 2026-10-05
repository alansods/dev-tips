// Telas cheias (sem abas): cabeçalho com voltar, um rótulo pequeno e o botão
// de tema claro/escuro. Usado pela trilha e pelas telas de área, linguagem e
// framework.
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeToggle } from '../theme/ThemeToggle';
import { spacing } from '../theme/tokens';
import { AppText } from './AppText';
import { IconButton } from './IconButton';
import { BackIcon } from './icons';

/** Volta na pilha; sem histórico (ex.: link direto), vai para a aba Trilhas. */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export function FullScreenHeader({ kicker }: { kicker: string }) {
  const { colors } = useTheme();
  const t = useT();
  return (
    <View style={styles.header}>
      <IconButton label={t.common.back} onPress={goBack}>
        <BackIcon color={colors.ink} />
      </IconButton>
      <AppText font="mono" size={11} tone="muted" style={styles.kicker}>
        {kicker}
      </AppText>
      <ThemeToggle />
    </View>
  );
}

/**
 * Tela cheia com conteúdo rolável. Sem `title`, mostra `missing` no lugar do
 * conteúdo (ex.: "Área não encontrada.").
 */
export function FullScreen({
  kicker,
  title,
  missing,
  children,
}: {
  kicker: string;
  title?: string;
  missing: string;
  children?: ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <FullScreenHeader kicker={kicker} />
      {title ? (
        <ScrollView contentContainerStyle={styles.content}>
          <AppText font="bold" size={24} accessibilityRole="header" style={{ lineHeight: 30 }}>
            {title}
          </AppText>
          {children}
        </ScrollView>
      ) : (
        <AppText style={styles.missing}>{missing}</AppText>
      )}
    </SafeAreaView>
  );
}

/** Seção com título; não desenha nada quando está vazia. */
export function Section({ title, children }: { title: string; children: ReactNode[] }) {
  if (children.length === 0) return null;
  return (
    <View style={styles.section}>
      <AppText font="bold" size={17} accessibilityRole="header">
        {title}
      </AppText>
      {children}
    </View>
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
  kicker: { flex: 1, textTransform: 'uppercase', letterSpacing: 0.8 },
  missing: { padding: spacing.lg },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl * 2 },
  section: { gap: spacing.md },
});
