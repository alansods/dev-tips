import { StyleSheet } from 'react-native';

import { AppText } from '../components/AppText';

/** Título de uma seção de Ajustes (cabeçalho para o leitor de tela). */
export function SectionTitle({ children }: { children: string }) {
  return (
    <AppText font="mono" size={11} tone="muted" accessibilityRole="header" style={styles.kicker}>
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({ kicker: { textTransform: 'uppercase', letterSpacing: 0.8 } });
