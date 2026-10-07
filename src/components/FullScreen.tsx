// Telas cheias (sem abas): cabeçalho com voltar e um rótulo pequeno. Usado
// pela trilha, pelas telas de área, linguagem e framework e pelo Progresso.
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';
import { AppText } from './AppText';
import { IconButton } from './IconButton';
import { BackIcon } from './icons';

type Href = Parameters<typeof router.replace>[0];

/** Volta na pilha; sem histórico (ex.: link direto), vai para `fallback` (a aba Trilhas por padrão). */
export function goBack(fallback: Href = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

export function FullScreenHeader({ kicker, fallback = '/' }: { kicker: string; fallback?: Href }) {
  const { colors } = useTheme();
  const t = useT();
  return (
    <View style={styles.header}>
      <IconButton label={t.common.back} onPress={() => goBack(fallback)}>
        <BackIcon color={colors.ink} />
      </IconButton>
      <AppText font="mono" size={11} tone="muted" style={styles.kicker}>
        {kicker}
      </AppText>
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
  fallback,
  children,
}: {
  kicker: string;
  title?: string;
  missing: string;
  fallback?: Href;
  children?: ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <FullScreenHeader kicker={kicker} fallback={fallback} />
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
